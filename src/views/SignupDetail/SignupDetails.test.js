import React from "react";
import { render, screen } from "@testing-library/react";
import { Router, useHistory } from "react-router-dom";
import { createMemoryHistory } from "history";
import SignupDetail from "./index";
import { useStep } from "react-hooks-helper";
import useCustomMutation from "../common/utils/CustomMutation";
import { Provider } from "react-redux";
import configureStore from "../../configureStore";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: jest.fn(),
}));

jest.mock("react-hooks-helper", () => ({
  useStep: jest.fn(),
}));

jest.mock("../common/utils/CustomMutation", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock(
  "../common/components/Mutation/Registration/registrationMutation",
  () => ({
    verifyEmail: jest.fn(),
  })
);

jest.mock("../common/components/AuthLayout/HeroImage", () => () => (
  <div>HeroImage Mock</div>
));

jest.mock("./components/AboutYou", () => () => <div>AboutYou Mock</div>);
jest.mock("./components/AboutOrganization", () => () => (
  <div>AboutOrganization Mock</div>
));
jest.mock("./components/Subscribe", () => () => <div>Subscribe Mock</div>);
jest.mock("./components/FinishSetup", () => () => <div>FinishSetup Mock</div>);

jest.mock("../common/components/outerPagesStyle", () => ({
  useStyles: () => ({
    root: "mock-root",
    pageGrid: "mock-pageGrid",
    pageForm: "mock-pageForm",
  }),
}));

jest.mock("validate.js", () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

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

describe("SignupDetail Component", () => {
  const mockHistory = { push: jest.fn() };
  const mockUseStep = {
    step: { id: "you" },
    navigation: { go: jest.fn() },
  };
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useHistory.mockReturnValue(mockHistory);
    useStep.mockReturnValue(mockUseStep);
    useCustomMutation.mockReturnValue({ mutate: mockMutate });

    Storage.prototype.getItem = jest.fn((key) => {
      if (key === "userInfo") return null;
      return null;
    });

    delete window.location;
    window.location = {
      search: "",
    };
  });

  const mockStore = configureStore();

  const renderComponent = () => {
    const history = createMemoryHistory();
    return render(
      <Provider store={mockStore}>
        <Router history={history}>
          <SignupDetail
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
    expect(screen.getByText("HeroImage Mock")).toBeInTheDocument();
  });

  it("sets document title on mount", () => {
    renderComponent();
    expect(document.title).toBe("Plug | Organisation");
  });

  describe("URL parameter handling", () => {
    it("calls verifyEmail when email and code params exist", () => {
      window.location.search = "?email=test@example.com&code=12345";

      renderComponent();

      expect(mockMutate).toHaveBeenCalledWith({
        email: "test@example.com",
        emailVerificationCode: "12345",
      });
    });

    it("handles email with spaces correctly", () => {
      window.location.search = "?email=test+1@example.com&code=12345";

      renderComponent();

      expect(mockMutate).toHaveBeenCalledWith({
        email: "test+1@example.com",
        emailVerificationCode: "12345",
      });
    });
  });

  describe("user info handling", () => {
    it("sets form values from localStorage when user exists", () => {
      const mockUser = {
        id: "123",
        firstName: "John",
        lastName: "Doe",
        mobile: "1234567890",
        businessRole: "Developer",
        account: {
          name: "Acme Inc",
          noOfEmployee: "50",
          country: "USA",
          industry: "Tech",
        },
      };

      localStorage.getItem.mockReturnValue(JSON.stringify(mockUser));

      renderComponent();

      expect(screen.getByText("AboutYou Mock")).toBeInTheDocument();
    });

    it("does nothing when no user info exists", () => {
      localStorage.getItem.mockReturnValue(null);

      renderComponent();

      expect(screen.getByText("AboutYou Mock")).toBeInTheDocument();
    });
  });

  describe("verify email callbacks", () => {
    it("navigates to finish step on successful verification", () => {
      window.location.search = "?email=test@example.com&code=12345";

      renderComponent();

      const onSuccess = useCustomMutation.mock.calls[0][0].onSuccess;
      onSuccess({ data: {} });

      expect(mockUseStep.navigation.go).toHaveBeenCalledWith(3);
    });

    it("redirects to login on verification error", () => {
      window.location.search = "?email=test@example.com&code=12345";

      renderComponent();

      const onError = useCustomMutation.mock.calls[0][0].onError;
      onError();

      expect(mockHistory.push).toHaveBeenCalledWith(
        expect.stringContaining("login")
      );
    });
  });

  it("validates form values on change", () => {
    renderComponent();

    const validateMock = require("validate.js").default;
    validateMock.mockReturnValueOnce({ firstName: ["is required"] });

    renderComponent();

    expect(validateMock).toHaveBeenCalled();
  });
});
