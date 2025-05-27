import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { useMsal } from "@azure/msal-react";
import SignupMicrosoft from "./index";
import useCustomMutation from "../../../common/utils/CustomMutation";
import { errorToastify } from "../../../common/utils/Toastify";

jest.mock("@azure/msal-react", () => ({
  useMsal: jest.fn(),
}));

jest.mock("../../../common/utils/CustomMutation");

jest.mock("../../../common/utils/Toastify");

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

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

Object.defineProperty(window, "sessionStorage", {
  value: sessionStorageMock,
});

describe("SignupMicrosoft Component", () => {
  let history;
  let mockInstance;
  let mockMutate;

  beforeEach(() => {
    history = createMemoryHistory();
    mockInstance = {
      loginPopup: jest.fn(),
    };
    mockMutate = jest.fn();

    useMsal.mockReturnValue({ instance: mockInstance });
    useCustomMutation.mockImplementation(() => ({
      mutate: mockMutate,
    }));
    // mutationCallbacks = {}
    jest.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  const renderComponent = () => {
    const defaultProps = {
      classes: {
        signUpButton: "signUpButton",
        microsoftIcon: "microsoftIcon",
      },
      btnMessage: "Sign up with Microsoft",
    };

    return render(
      <Router history={history}>
        <SignupMicrosoft {...defaultProps} />
      </Router>
    );
  };

  test("renders without crashing", () => {
    renderComponent();
    expect(screen.getByText("Sign up with Microsoft")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("displays the correct button text", () => {
    renderComponent();
    expect(screen.getByText("Sign up with Microsoft")).toBeInTheDocument();
  });

  test("calls Microsoft login when button is clicked", () => {
    mockInstance.loginPopup.mockResolvedValue({
      accessToken: "test-token",
      uniqueId: "test-id",
      account: { username: "test@example.com" },
    });

    renderComponent();
    fireEvent.click(screen.getByRole("button"));

    expect(mockInstance.loginPopup).toHaveBeenCalled();
  });

  describe("Microsoft login success", () => {
    beforeEach(() => {
      mockInstance.loginPopup.mockResolvedValue({
        accessToken: "test-token",
        uniqueId: "test-id",
        account: { username: "test@example.com" },
      });
    });

    test("calls mutate with correct parameters on successful login", async () => {
      renderComponent();
      fireEvent.click(screen.getByRole("button"));

      await Promise.resolve();

      expect(mockMutate).toHaveBeenCalledWith({
        accessToken: "test-token",
        socialAuthId: "test-id",
        socialAuthType: "microsoft",
        email: "test@example.com",
      });
    });
  });

  describe("Microsoft login failure", () => {
    test("handles login error silently", async () => {
      mockInstance.loginPopup.mockRejectedValue(new Error("Login failed"));

      renderComponent();
      fireEvent.click(screen.getByRole("button"));

      expect(errorToastify).not.toHaveBeenCalled();
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });
});
