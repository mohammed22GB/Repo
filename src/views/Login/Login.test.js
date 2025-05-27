import userEvent from "@testing-library/user-event";

import { fireEvent, waitFor, cleanup, screen } from "@testing-library/react";
import { Login } from "../../views";
import { unprotectedUrls } from "../common/utils/lists";
import { loginUser } from "../../store/actions";
import { mockProviders } from "../../test-utilities/mockProviders";

jest.mock("../../store/actions/auth", () => ({
  loginUser: jest.fn(),
  verifyAuth: () => jest.fn(),
}));

const initialState = {
  auth: {
    isLoggingIn: false,
    loginError: "",
    error: null,
    isAuthenticated: false,
    user: {
      account: {
        enableCustomPortal: false,
      },
    },
  },
};

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

describe("Login Component", () => {
  const renderComponent = (options = {}) => {
    return mockProviders(({ history }) => <Login history={history} />, {
      ...options,
      initialState,
    });
  };

  describe("UI Rendering", () => {
    test("renders welcome header and subtitle", async () => {
      renderComponent();

      const welcomeHeader = await waitFor(() =>
        screen.getByText(/Welcome back to Plug/i)
      );
      const subtitle = await waitFor(() =>
        screen.getByText(/Resume your activities on the platform/i)
      );

      expect(welcomeHeader).toBeInTheDocument();
      expect(subtitle).toBeInTheDocument();
    });

    test("renders unauthorized access message when unauthorized flag is set", async () => {
      // Set the unauthorized flag in localStorage
      Object.defineProperty(window.localStorage, "unauthorized", {
        value: "true",
        writable: true,
        configurable: true,
      });

      renderComponent();

      const titleElement = await waitFor(() =>
        screen.getByText((content, element) => {
          return (
            element.tagName.toLowerCase() === "p" &&
            content.includes("Authorized access")
          );
        })
      );

      expect(titleElement).toBeInTheDocument();
    });

    test("renders form elements correctly", async () => {
      renderComponent();

      const emailLabel = await waitFor(() => screen.getByText("Email address"));
      const passwordLabel = await waitFor(() => screen.getByText("Password"));
      const emailInput = screen.getByPlaceholderText(
        /Enter your email address/i
      );
      const passwordInput = screen.getByPlaceholderText(/Enter password here/i);
      const loginButton = screen.getByRole("button", { name: "Login" });
      const rememberMe = screen.getByText("Remember me");
      const forgotPassword = screen.getByText("Forgot password?");

      expect(emailLabel).toBeInTheDocument();
      expect(passwordLabel).toBeInTheDocument();
      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(loginButton).toBeInTheDocument();
      expect(rememberMe).toBeInTheDocument();
      expect(forgotPassword).toBeInTheDocument();
    });

    test("renders social login buttons", async () => {
      renderComponent();

      const googleButton = await waitFor(() =>
        screen.getByText(/Login with Google/i)
      );
      const microsoftButton = await waitFor(() =>
        screen.getByText(/Login with Microsoft/i)
      );
      const ssoButton = await waitFor(() => screen.getByText(/SSO/i));

      expect(googleButton).toBeInTheDocument();
      expect(microsoftButton).toBeInTheDocument();
      expect(ssoButton).toBeInTheDocument();
    });

    test("renders sign up link", async () => {
      renderComponent();

      const signupLink = await waitFor(() => screen.getByText("Sign up"));

      expect(signupLink).toBeInTheDocument();
      expect(signupLink.closest("a")).toHaveAttribute("href", "/sign-up");
    });
  });

  describe("Form Interactions", () => {
    test("login button is enabled when form is valid", async () => {
      renderComponent();

      const emailInput = screen.getByPlaceholderText(
        /Enter your email address/i
      );
      const passwordInput = screen.getByPlaceholderText(/Enter password here/i);

      userEvent.type(emailInput, "test@example.com");
      userEvent.type(passwordInput, "password123");

      await waitFor(() => {
        const loginButton = screen.getByRole("button", { name: "Login" });
        expect(loginButton).not.toBeDisabled();
      });
    });

    test("toggles password visibility when clicking the eye icon", async () => {
      renderComponent();

      const passwordInput = screen.getByPlaceholderText(/Enter password here/i);
      const visibilityIcon = screen.getByAltText("Visibility");

      // Password field should initially be of type password
      expect(passwordInput).toHaveAttribute("type", "password");

      // Click the visibility toggle
      fireEvent.click(visibilityIcon);

      // Password should now be visible
      expect(passwordInput).toHaveAttribute("type", "text");

      // Click again to hide
      fireEvent.click(visibilityIcon);

      // Password should be hidden again
      expect(passwordInput).toHaveAttribute("type", "password");
    });

    test("remembers user preference when remember me is checked", async () => {
      jest.spyOn(Storage.prototype, "setItem");
      renderComponent();

      const rememberMeSwitch = screen.getByLabelText("Remember me");
      fireEvent.click(rememberMeSwitch);

      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith("rememberMe", true);
      });
    });
  });

  // Social Media Login Tests
  describe("Social Media Login", () => {
    test("renders Google login button correctly", async () => {
      renderComponent();

      const googleButton = await waitFor(() =>
        screen.getByText(/Login with Google/i)
      );

      expect(googleButton).toBeInTheDocument();
      expect(googleButton.closest("button")).not.toBeDisabled();
    });

    test("renders Microsoft login button correctly", async () => {
      renderComponent();

      const microsoftButton = await waitFor(() =>
        screen.getByText(/Login with Microsoft/i)
      );

      expect(microsoftButton).toBeInTheDocument();
      expect(microsoftButton.closest("button")).not.toBeDisabled();
    });

    test("renders SSO login button correctly", async () => {
      renderComponent();

      const ssoButton = await waitFor(() =>
        screen.getByText(/Login with SSO/i)
      );

      expect(ssoButton).toBeInTheDocument();
      expect(ssoButton).toHaveAttribute("href", unprotectedUrls.LOGIN_WITH_SSO);
    });

    // Note: Testing actual OAuth flows might require more complex mocking
    // or integration tests. These simple presence tests ensure the buttons exist.
  });

  // Navigation Tests
  describe("Navigation", () => {
    test("navigates to signup page when clicking sign up link", async () => {
      const { history } = renderComponent();

      const signupLink = await waitFor(() => screen.getByText("Sign up"));

      fireEvent.click(signupLink);

      await waitFor(() => {
        expect(history.location.pathname).toBe("/sign-up");
      });
    });

    test("navigates to forgot password page when clicking forgot password link", async () => {
      const { history } = renderComponent();

      const forgotPasswordLink = await waitFor(() =>
        screen.getByText("Forgot password?")
      );

      fireEvent.click(forgotPasswordLink);

      await waitFor(() => {
        expect(history.location.pathname).toBe("/forgot-password");
      });
    });
  });

  describe("Form Validation", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    afterEach(() => {
      cleanup();
    });
    test("disables login button for invalid email format", async () => {
      renderComponent();

      const emailInput = screen.getByPlaceholderText(
        "Enter your email address"
      );
      const loginButton = screen.getByRole("button", { name: "Login" });
      // Fill with invalid email
      userEvent.type(emailInput, "testexample.com");

      // Wait for the button to remain disabled
      await waitFor(() => {
        screen.debug(loginButton);
        expect(emailInput.value).toBe("testexample.com");
        expect(loginButton).toBeInTheDocument();
        expect(loginButton).toBeDisabled();
      });
    });

    test("disable login button for empty required fields", async () => {
      renderComponent();

      const emailField = screen.getByPlaceholderText(
        /Enter your email address/i
      );
      const loginButton = screen.getByRole("button", { name: "Login" });

      fireEvent.change(emailField, {
        target: { value: "" },
      });
      fireEvent.blur(emailField);

      await waitFor(() => {
        expect(loginButton).toBeDisabled();
      });
    });
  });

  // Add this to test the API interaction on form submission
  describe("Form Submission", () => {
    test("dispatches loginUser action when form is submitted", async () => {
      // Mock the loginUser function to return "OK"
      loginUser.mockResolvedValue("OK");

      renderComponent();

      const emailInput = screen.getByPlaceholderText(
        /Enter your email address/i
      );
      const passwordInput = screen.getByPlaceholderText(/Enter password here/i);

      // Fill in form with valid data
      userEvent.type(emailInput, "test@example.com");
      userEvent.type(passwordInput, "password123");

      const loginButton = screen.getByRole("button", { name: "Login" });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(loginUser).toHaveBeenCalledWith(
          {
            email: "test@example.com",
            password: "password123",
            setLoading: expect.any(Function),
          },
          expect.any(Function)
        );
      });
    });

    test("redirects to verification page on successful login", async () => {
      // Mock the loginUser function to return "OK"
      loginUser.mockResolvedValue("OK");

      const { history } = renderComponent();
      jest.spyOn(history, "push");

      const emailInput = screen.getByPlaceholderText(
        /Enter your email address/i
      );
      const passwordInput = screen.getByPlaceholderText(/Enter password here/i);

      // Fill in form with valid data
      userEvent.type(emailInput, "test@example.com");
      userEvent.type(passwordInput, "password123");

      // Submit the form
      const loginButton = screen.getByRole("button", { name: "Login" });
      fireEvent.click(loginButton);

      // Verify we're redirected to the verify page
      await waitFor(() => {
        expect(history.push).toHaveBeenCalledWith(`${unprotectedUrls.VERIFY}/`);
      });
    });
  });
});
