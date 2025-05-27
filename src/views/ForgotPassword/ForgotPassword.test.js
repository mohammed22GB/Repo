import { cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import { mockProviders } from "../../test-utilities/mockProviders";
import ForgotPassword from "./ForgotPassword";
import { useStep } from "react-hooks-helper";

jest.mock("../common/utils/CustomMutation", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("react-hooks-helper", () => ({
  useStep: jest.fn().mockImplementation(() => ({
    step: { id: "input" }, // Default to the first step
    navigation: {
      next: jest.fn(),
      previous: jest.fn(),
      go: jest.fn(),
      reset: jest.fn(),
    },
  })),
}));

const renderForgotPasswordComponent = () => {
  return mockProviders(<ForgotPassword />);
};

describe("ForgotPassword", () => {
  let forgotPasswordMutateStub;
  let mockNext;
  let localStorageSetItemSpy;

  beforeEach(() => {
    mockNext = jest.fn();
    forgotPasswordMutateStub = jest.fn();
    localStorageSetItemSpy = jest.spyOn(
      Object.getPrototypeOf(localStorage),
      "setItem"
    );

    // Reset all mocks
    jest.clearAllMocks();

    // Setup useStep mock
    useStep.mockReturnValue({
      step: { id: "input" },
      navigation: {
        next: mockNext,
        previous: jest.fn(),
        go: jest.fn(),
        reset: jest.fn(),
      },
    });

    // Setup CustomMutation mock
    require("../common/utils/CustomMutation").default.mockImplementation(
      ({ onSuccess }) => {
        forgotPasswordMutateStub.mockImplementation(() => {
          return Promise.resolve({
            _meta: {
              status_code: 200,
              success: true,
              message: "Password reset successfully",
            },
            data: {
              data: { email: "testuser@testmail.com" },
            },
          }).then(() =>
            onSuccess({
              data: {
                data: { email: "testuser@testmail.com" },
              },
            })
          );
        });

        return {
          mutate: forgotPasswordMutateStub,
          isLoading: false,
        };
      }
    );
  });

  afterEach(() => {
    localStorageSetItemSpy.mockRestore();
    cleanup();
  });

  test("should render ForgotPassword and on input of a valid email Reset Password Button should be enabled", () => {
    renderForgotPasswordComponent();

    const ForgotPasswordText = screen.getByText(/Forgot Password/i);
    const inputTextField = screen.getByTestId("email-input");
    const resetPasswordButton = screen.getByTestId("reset-password-button");

    fireEvent.change(inputTextField, {
      target: { value: "testuser@testmail.com" },
    });

    expect(ForgotPasswordText).toBeInTheDocument();
    expect(inputTextField.value).toBe("testuser@testmail.com");
    expect(resetPasswordButton).not.toBeDisabled();
  });

  test("should disable ResetButton if email is not a valid email", () => {
    renderForgotPasswordComponent();

    const ForgotPasswordText = screen.getByText(/Forgot Password/i);
    const inputTextField = screen.getByTestId("email-input");
    const resetPasswordButton = screen.getByTestId("reset-password-button");

    fireEvent.change(inputTextField, {
      target: { value: "testuser46475" },
    });

    expect(ForgotPasswordText).toBeInTheDocument();
    expect(inputTextField.value).toBe("testuser46475");
    expect(resetPasswordButton).toBeDisabled();
  });

  test("should route to login on click of 'Go to login'", () => {
    const { history } = renderForgotPasswordComponent();

    const goToLoginButton = screen.getByTestId("go-to-login");

    fireEvent.click(goToLoginButton);

    expect(history.location.pathname).toBe("/login");
  });

  test("should show email sent success after inputting valid email and on click of Reset Password", async () => {
    renderForgotPasswordComponent();

    const inputTextField = screen.getByTestId("email-input");
    const resetPasswordButton = screen.getByTestId("reset-password-button");

    fireEvent.change(inputTextField, {
      target: { value: "testuser@testmail.com" },
    });

    fireEvent.click(resetPasswordButton);

    await waitFor(() => {
      expect(forgotPasswordMutateStub).toHaveBeenCalled();
      expect(localStorageSetItemSpy).toHaveBeenCalledWith(
        "resendmail",
        "testuser@testmail.com"
      );
      expect(mockNext).toHaveBeenCalled();
    });

    // Update the step to 'check' and re-render
    useStep.mockReturnValue({
      step: { id: "check" },
      navigation: {
        next: mockNext,
        previous: jest.fn(),
        go: jest.fn(),
        reset: jest.fn(),
      },
    });

    renderForgotPasswordComponent();

    expect(
      screen.getByText(/We have sent a reset link to your mail box/i)
    ).toBeInTheDocument();
  });

  test("should handle error when password reset fails", async () => {
    require("../common/utils/CustomMutation").default.mockImplementationOnce(
      ({ onError }) => {
        forgotPasswordMutateStub.mockImplementation(() => {
          return Promise.reject({
            response: {
              data: {
                _meta: {
                  statusCode: 400,
                  error: {
                    code: 400,
                    message: "There are problems with your input",
                    messages: {
                      redirectUrl: ["The redirectUrl format is invalid."],
                    },
                  },
                  app_version: "1.3.1",
                },
              },
            },
          }).catch((error) => onError(error));
        });

        return {
          mutate: forgotPasswordMutateStub,
          isLoading: false,
        };
      }
    );

    renderForgotPasswordComponent();

    const inputTextField = screen.getByTestId("email-input");
    const resetPasswordButton = screen.getByTestId("reset-password-button");

    fireEvent.change(inputTextField, {
      target: { value: "nonexistent@testmail.com" },
    });

    fireEvent.click(resetPasswordButton);

    await waitFor(() => {
      expect(localStorageSetItemSpy).not.toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
