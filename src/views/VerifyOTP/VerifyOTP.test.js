import { fireEvent, waitFor, cleanup, screen } from "@testing-library/react";
import { mockProviders } from "../../test-utilities/mockProviders";
import { MemoryRouter } from "react-router-dom";
import VerifyOTP from "./index";
import * as redux from "react-redux";
import userEvent from "@testing-library/user-event";
import { sendVerifyEmailOTP, verifyPhoneOTP } from "../../store/actions";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
}));

jest.mock("../../store/actions", () => ({
  loginOTP: jest.fn(() => jest.fn()),
  sendVerifyEmailOTP: jest.fn(),
  sendVerifyPhoneOTP: jest.fn(() => jest.fn()),
  verifyPhoneOTP: jest.fn(() => jest.fn()),
  verifyEmailOTP: jest.fn(() => jest.fn()),
  loginUser: jest.fn(),
  verifyAuth: () => jest.fn(),
}));

jest.mock("../common/utils/Toastify", () => {
  return {
    ...jest.requireActual("../common/utils/Toastify"),
    errorToastify: jest.fn(),
    successToastify: jest.fn(),
  };
});

describe("<VerifyOTP />", () => {
  const mockDispatch = jest.fn();
  const mockUseLocation = {
    search: "?redirect=/dashboard",
  };

  beforeEach(() => {
    jest.spyOn(redux, "useDispatch").mockReturnValue(mockDispatch);
    require("react-router-dom").useLocation.mockImplementation(
      () => mockUseLocation
    );
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  const mockHistory = {
    goBack: jest.fn(),
    push: jest.fn(),
  };

  const component = (option) => {
    return mockProviders(
      <MemoryRouter initialEntries={["/verify-otp"]}>
        <VerifyOTP history={mockHistory} />
      </MemoryRouter>,
      { ...option }
    );
  };

  test("renders VerifyOTP page and form elements", async () => {
    component();
    const otpText = screen.getByText(/Enter OTP/i);
    expect(otpText).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter code...")).toBeInTheDocument();
    expect(document.title).toBe("Plug | Verify OTP");
  });

  test("displays the correct message for where the OTP was sent", async () => {
    jest.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
      if (key === "login_preotp_email") {
        return "test@example.com";
      }
      return null;
    });
    component();

    const otpMessage = screen.getByText(
      /A one-time code has been sent to your email \(test@example.com\)/i
    );
    expect(otpMessage).toBeInTheDocument();
  });

  test("disables submit button when OTP is empty", async () => {
    component();

    const otpInput = screen.getByPlaceholderText("Enter code...");
    const submitButton = screen.getByRole("button", {
      name: "Login",
    });

    userEvent.type(otpInput, "");

    await waitFor(() => {
      screen.debug(submitButton);
      expect(otpInput.value).toBe("");
      expect(submitButton).toBeDisabled();
    });
  });

  test("disables submit button when OTP is incomplete", async () => {
    component();

    const otpInput = screen.getByPlaceholderText("Enter code...");
    const submitButton = screen.getByRole("button", {
      name: "Login",
    });

    // Clear any existing value first
    fireEvent.change(otpInput, { target: { value: "" } });

    // Now set a value that's incomplete (less than 6 digits)
    fireEvent.change(otpInput, { target: { value: "123" } });

    await waitFor(() => {
      expect(otpInput.value).toBe("123");
      expect(submitButton).toBeDisabled();
    });
  });

  test("enables submit button when OTP is entered", async () => {
    component();

    const otpInput = screen.getByPlaceholderText("Enter code...");
    fireEvent.change(otpInput, { target: { value: "123456" } });

    const submitButton = screen.getByRole("button", {
      name: "Login",
    });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  test("resend button shows countdown before enabling", async () => {
    component();
    const countdownText = screen.getByText(/Resend in/i);
    expect(countdownText).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/Resend in/i)).not.toBeNull();
    });
  });

  test("calls history.goBack when back button is clicked", async () => {
    component();

    const backButton = screen.getByRole("button", { name: /Back/i });
    fireEvent.click(backButton);

    expect(mockHistory.goBack).toHaveBeenCalled();
  });

  test("countdown resets after resend OTP", async () => {
    jest.mocked(sendVerifyEmailOTP).mockResolvedValue({
      data: {
        _meta: {
          success: true,
        },
      },
    });

    component();

    const resendButton = screen.getByText(/Resend/i);
    fireEvent.click(resendButton);

    await waitFor(() => {
      expect(screen.getByText(/Resend in/i)).toBeInTheDocument();
    });
  });

  test("redirects to the correct page after successful OTP verification", async () => {
    jest.mocked(verifyPhoneOTP).mockResolvedValue({
      data: {
        _meta: {
          success: true,
        },
      },
    });

    component();

    const otpInput = screen.getByPlaceholderText("Enter code...");
    const submitButton = screen.getByRole("button", { name: "Login" });

    fireEvent.change(otpInput, { target: { value: "123456" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockHistory.goBack).toHaveBeenCalled();
    });
  });
});
