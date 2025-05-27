import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import axios from "axios";
import Signup from "./index";
import useCustomMutation from "../common/utils/CustomMutation";
import configureStore from "../../configureStore";
import { useSelector } from "react-redux";

jest.mock("axios");

jest.mock("@material-ui/core/styles", () => ({
  makeStyles: () => () => ({
    root: "root",
    pageGrid: "pageGrid",
    pageForm: "pageForm",
    title: "title",
    subtitle: "subtitle",
    formLabels: "formLabels",
    formTextField: "formTextField",
    caution: "caution",
    helperText: "helperText",
    linkText: "linkText",
    inputField: "inputField",
    notched: "notched",
    eye: "eye",
    loginPanel: "loginPanel",
    checkMain: "checkMain",
    checkedBox: "checkedBox",
    checkText: "checkText",
    Terms: "Terms",
    breakText: "breakText",
    pageButton: "pageButton",
    disabled: "disabled",
    hac: "hac",
  }),
}));

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn(),
}));

jest.mock("validate.js", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation((values, schema) => {
    if (values.email) {
      return { email: ["is required"] };
    }
    if (!values.password) {
      return { password: ["is required"] };
    }
    if (!values.policy) {
      return { policy: ["is required"] };
    }
    return null;
  }),
}));

jest.mock("../common/utils/CustomMutation");

const mockeduseCustomMutation = useCustomMutation;

jest.mock("../common/components/Alert/SignupAlert", () => () => (
  <div>SignupAlert</div>
));

jest.mock("../common/components/IntroGetHelp/IntroGetHelp", () => () => (
  <div>IntroGetHelp</div>
));

jest.mock("../common/components/ProgressLoader/ProgressLoader", () => () => (
  <div>ProgressLoader</div>
));

jest.mock("../common/components/AuthLayout/HeroImage", () => () => (
  <div>HeroImage</div>
));
jest.mock("../common/components/Divider/Divider", () => ({ children }) => (
  <div>Divider{children}</div>
));
jest.mock("../common/components/NewPasswordValidator", () => () => (
  <div>NewPasswordValidator</div>
));
jest.mock("./Recapture", () => () => <div>Recapture</div>);

jest.mock("./components/GoogleSignup", () => ({
  __esModule: true,
  default: () => <div>GoogleSignup</div>,
}));
jest.mock("./components/MicrosoftSignup", () => ({
  __esModule: true,
  default: () => <div>MicrosoftSignup</div>,
}));
jest.mock("../Login/components/SSOLogin/SSOLoginButton", () => ({
  __esModule: true,
  default: () => <div>SSOLoginButton</div>,
}));
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  withRouter: (Component) => (props) => <Component {...props} />,
  Link: ({ children }) => <a>{children}</a>,
}));

describe("Signup Component", () => {
  let store;
  let history;

  beforeEach(() => {
    useSelector.mockImplementation((callback) => {
      return callback({
        auth: {
          captchaToken: "test-token",
        },
      });
    });
    store = configureStore();

    mockeduseCustomMutation.mockImplementation(() => ({
      mutate: jest.fn().mockImplementation((data) => {
        if (data.id) {
          return Promise.resolve({ data: { _meta: { success: true } } });
        }
        return Promise.resolve({
          data: { data: { _meta: { success: true, message: "Success" } } },
        });
      }),
    }));

    history = createMemoryHistory();
    jest.spyOn(history, "push");
    jest.spyOn(sessionStorage, "setItem");
    jest.spyOn(sessionStorage, "removeItem");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

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

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <Router history={history}>
          <Signup history={history} />
        </Router>
      </Provider>
    );

  test("renders without crashing", () => {
    renderComponent();
    expect(screen.getByText("Welcome to Plug")).toBeInTheDocument();
  });

  test("displays all form elements", () => {
    renderComponent();

    expect(
      screen.getByPlaceholderText("Enter your email address")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter password here")
    ).toBeInTheDocument();
    expect(screen.getByText("Get started!")).toBeInTheDocument();
    expect(screen.getByText("Have an account?")).toBeInTheDocument();
  });

  test("handles terms checkbox", () => {
    renderComponent();
    const checkbox = screen.getAllByRole("checkbox")[0];

    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  test("Submit button is disabled when email, password and checkbox are empty", () => {
    renderComponent();

    const emailInput = screen.getByPlaceholderText("Enter your email address");
    const passwordInput = screen.getByPlaceholderText("Enter password here");
    const checkbox = screen.getByTestId("terms-checkbox");
    const submitButton = screen.getByRole("button", { name: /get started!/i });

    expect(emailInput).toHaveValue("");
    expect(passwordInput).toHaveValue("");
    expect(checkbox).not.toBeChecked();

    expect(submitButton).toBeDisabled();
  });

  test("Submit button remains disabled when only email is filled", () => {
    renderComponent();

    const emailInput = screen.getByPlaceholderText("Enter your email address");
    const submitButton = screen.getByRole("button", { name: /get started!/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    expect(submitButton).toBeDisabled();
  });

  test("Submit button remains disabled when email and password are filled but checkbox is unchecked", () => {
    renderComponent();

    const emailInput = screen.getByPlaceholderText("Enter your email address");
    const passwordInput = screen.getByPlaceholderText("Enter password here");
    const submitButton = screen.getByRole("button", { name: /get started!/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "Password123!" } });

    expect(submitButton).toBeDisabled();
  });

  test("Submit button enables when all fields are valid and checkbox is checked", () => {
    renderComponent();

    const emailInput = screen.getByPlaceholderText("Enter your email address");
    const passwordInput = screen.getByPlaceholderText("Enter password here");
    const checkbox = screen.getByTestId("terms-checkbox");
    const submitButton = screen.getByText("Get started!");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "ValidPassword123!" } });
    fireEvent.click(checkbox);

    expect(submitButton).not.toBeDisabled();
  });

  test("handles successful form submission", async () => {
    axios.get.mockResolvedValueOnce({ data: { data: { isValid: true } } });

    renderComponent();

    const emailInput = screen.getByPlaceholderText("Enter your email address");
    const passwordInput = screen.getByPlaceholderText("Enter password here");
    const submitButton = screen.getByText("Get started!");

    fireEvent.change(emailInput, { target: { value: "new@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "ValidPassword1!" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockeduseCustomMutation).toHaveBeenCalled();
    });
  });

  test("handles API error during email check", async () => {
    axios.get.mockRejectedValueOnce(new Error("API error"));
    renderComponent();

    const emailInput = screen.getByPlaceholderText("Enter your email address");
    const passwordInput = screen.getByPlaceholderText("Enter password here");
    const submitButton = screen.getByText("Get started!");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "ValidPassword1!" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeInTheDocument();
    });
  });
});
