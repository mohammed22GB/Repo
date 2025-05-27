import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import AboutOrganization from "./index";
import axios from "axios";
import validate from "validate.js";
import { errorToastify } from "../../../common/utils/Toastify";
import configureStore from "../../../../configureStore";

jest.mock("axios");
jest.mock("validate.js");
jest.mock("../../../common/utils/CustomAxios");
jest.mock("../../../common/utils/Toastify");
jest.mock("@material-ui/core/useMediaQuery");
jest.mock("@material-ui/core/styles");

jest.mock(
  "../../../common/components/DropDown/CustomDropDown",
  () => (props) =>
    (
      <select {...props} data-testid={props.name}>
        {props.data.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    )
);

jest.mock(
  "../../../common/components/ProgressLoader/ProgressLoader",
  () => () => <div>Loading...</div>
);

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

const sessionStorageMock = (() => {
  let store = {};

  return {
    getItem: jest.fn((key) => store[key]),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "sessionStorage", {
  value: sessionStorageMock,
  writable: true,
});

let mockFormState = {
  values: {
    orgName: "",
    employees: "",
    country: "",
    industry: "",
  },
  touched: {},
  errors: {},
  isValid: false,
};

const mockSetFormState = jest.fn();
const mockNavigation = {
  previous: jest.fn(),
  next: jest.fn(),
};
const mockClasses = {
  title: "title",
  subtitle: "subtitle",
  formLabels: "formLabels",
  formTextField: "formTextField",
  notched: "notched",
  inputField: "inputField",
  pageButton: "pageButton",
  disabled: "disabled",
};

const mockStore = configureStore();

describe("AboutOrganization Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    validate.mockImplementation(() => null);

    sessionStorageMock.getItem.mockImplementation((key) => {
      if (key === "user_user")
        return JSON.stringify({
          email: "test@example.com",
          password: "password",
        });
      if (key === "about_you")
        return JSON.stringify({
          firstName: "John",
          lastName: "Doe",
          mobile: "1234567890",
          businessRole: "Developer",
        });
      return null;
    });

    axios.post.mockResolvedValue({ data: {} });
  });

  const renderComponent = () => {
    const history = createMemoryHistory();
    return render(
      <Provider store={mockStore}>
        <Router history={history}>
          <AboutOrganization
            formState={mockFormState}
            setFormState={mockSetFormState}
            navigation={mockNavigation}
            classes={mockClasses}
          />
        </Router>
      </Provider>
    );
  };

  it("renders without crashing", () => {
    renderComponent();
    expect(screen.getByText("Your organisation")).toBeInTheDocument();
  });

  it("displays all form fields", () => {
    renderComponent();
    expect(screen.getByText("Organisation name")).toBeInTheDocument();
    expect(screen.getByTestId("employees")).toBeInTheDocument();
    expect(screen.getByTestId("country")).toBeInTheDocument();
    expect(screen.getByTestId("industry")).toBeInTheDocument();
  });

  it("handles form field changes", () => {
    renderComponent();
    const orgNameInput = screen.getByPlaceholderText(
      "Enter Organisation’s name"
    );

    fireEvent.change(orgNameInput, {
      target: { name: "orgName", value: "Test Org" },
    });

    expect(mockSetFormState).toHaveBeenCalled();
  });

  describe("form submission", () => {
    it("handles normal registration flow", async () => {
      localStorageMock.getItem.mockReturnValue("normal");
      mockFormState.values = {
        orgName: "Test Org",
        employees: "10-50",
        country: "US",
        industry: "Technology",
      };

      renderComponent();
      fireEvent.click(screen.getByText("Finish"));

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          `${process.env.REACT_APP_ENDPOINT}/auth/register`,
          expect.objectContaining({
            user: expect.any(Object),
            account: expect.any(Object),
          }),
          expect.any(Object)
        );
        expect(mockNavigation.next).toHaveBeenCalled();
      });
    });

    it("handles API errors", async () => {
      axios.post.mockRejectedValue({
        response: {
          data: {
            _meta: {
              error: {
                message: "Registration failed",
              },
            },
          },
        },
      });

      renderComponent();
      fireEvent.click(screen.getByText("Finish"));

      await waitFor(() => {
        expect(errorToastify).toHaveBeenCalledWith("Registration failed");
      });
    });
  });

  it("enables finish button when form is valid", () => {
    mockFormState.values = {
      orgName: "Test Org",
      employees: "10-50",
      country: "US",
      industry: "Technology",
    };
    mockFormState.isValid = true;

    renderComponent();
    expect(screen.getByText("Finish")).not.toBeDisabled();
  });

  it("shows loading state during submission", async () => {
    axios.post.mockImplementation(() => new Promise(() => {}));

    renderComponent();
    fireEvent.click(screen.getByText("Finish"));

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("handles previous button click", () => {
    renderComponent();
    fireEvent.click(screen.getByText("Previous"));
    expect(mockNavigation.previous).toHaveBeenCalled();
  });
});
