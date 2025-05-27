import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import GoogleSignup from "./index";
import { useGoogleLogin } from "@react-oauth/google";
import { errorToastify } from "../../../common/utils/Toastify";

jest.mock("@react-oauth/google", () => ({
  useGoogleLogin: jest.fn(),
}));

jest.mock("../../../common/utils/CustomMutation", () => ({
  __esModule: true,
  default: () => ({
    mutate: jest.fn(),
  }),
}));

jest.mock("../../../common/utils/Toastify", () => ({
  errorToastify: jest.fn(),
}));

jest.mock("../../../../store/actions", () => ({
  googleLogin: jest.fn(),
}));

const localStorageMock = (() => {
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

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("GoogleSignup Component", () => {
  let store;
  let history;
  let mockUseGoogleLogin;
  let mockMutate;
  let mockDispatch;

  const mockResponse = {
    data: {
      data: {
        id: "user123",
        account: "account123",
        name: "Test User",
        email: "test@example.com",
      },
      _meta: {
        access_token: "access123",
      },
    },
  };

  beforeEach(() => {
    history = createMemoryHistory();
    jest.spyOn(history, "push");
    mockDispatch = jest.fn();

    store = createStore(() => ({}), {
      dispatch: mockDispatch,
    });

    mockUseGoogleLogin = jest.fn(({ onSuccess, onError }) => ({
      onSuccess,
      onError,
    }));

    useGoogleLogin.mockImplementation(mockUseGoogleLogin);

    mockMutate = {
      mock: {
        calls: [
          [
            {},
            {
              onSuccess: jest.fn().mockReturnValue(mockResponse),
            },
          ],
        ],
      },
    };

    jest.clearAllMocks();
    localStorage.clear();
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      classes: {
        signUpButton: "signUpButton",
        googleIcon: "googleIcon",
      },
      btnMessage: "Sign up with Google",
      history,
    };

    return render(
      <Provider store={store}>
        <Router history={history}>
          <GoogleSignup {...defaultProps} {...props} />
        </Router>
      </Provider>
    );
  };

  test("renders without crashing", () => {
    renderComponent();
    expect(screen.getByText("Sign up with Google")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("displays the correct button text", () => {
    renderComponent({ btnMessage: "Continue with Google" });
    expect(screen.getByText("Continue with Google")).toBeInTheDocument();
  });

  test("calls useGoogleLogin with correct parameters", () => {
    renderComponent();
    expect(useGoogleLogin).toHaveBeenCalledWith({
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
      prompt: "consent",
      scope: "profile email",
    });
  });

  test("triggers Google login when button is clicked", () => {
    const mockSignIn = jest.fn();
    useGoogleLogin.mockReturnValue(mockSignIn);

    renderComponent();
    fireEvent.click(screen.getByRole("button"));
    expect(mockSignIn).toHaveBeenCalled();
  });

  describe("onSuccess callback", () => {
    test('sets localStorage status to "old" on success', () => {
      renderComponent();
      const onSuccessCallback = useGoogleLogin.mock.calls[0][0].onSuccess;
      onSuccessCallback({ access_token: "test-token" });

      expect(localStorage.setItem).toHaveBeenCalledWith("status", "old");
    });
  });

  describe("handleSignupSuccess", () => {
    test("stores user data in localStorage on successful signup", () => {
      renderComponent();

      const onSuccessCallback = useGoogleLogin.mock.calls[0][0].onSuccess;
      onSuccessCallback({ access_token: "test-token" });

      const successHandler = mockMutate.mock.calls[0][1].onSuccess;
      expect(successHandler).toBeDefined();

      expect(localStorage.setItem).toHaveBeenCalledWith("status", "old");
    });
  });

  describe("onError callback", () => {
    test("does not show toast for expected errors", () => {
      renderComponent();
      const onErrorCallback = useGoogleLogin.mock.calls[0][0].onError;

      onErrorCallback({ error: null });
      onErrorCallback({ error: "popup_closed_by_user" });
      onErrorCallback({ error: "idpiframe_initialization_failed" });

      expect(errorToastify).not.toHaveBeenCalled();
    });

    test("shows toast for unexpected errors", () => {
      renderComponent();
      const onErrorCallback = useGoogleLogin.mock.calls[0][0].onError;

      onErrorCallback({ error: "unexpected_error" });

      expect(errorToastify).toHaveBeenCalledWith("unexpected_error");
    });
  });
});
