import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import Subscribe from "./index";
import { sendVerificationEmail } from "../../../../store/actions";
import { errorToastify, successToastify } from "../../../common/utils/Toastify";

jest.mock("../../../../store/actions", () => ({
  sendVerificationEmail: jest.fn(),
}));

jest.mock("../../../common/utils/Toastify", () => ({
  errorToastify: jest.fn(),
  successToastify: jest.fn(),
}));

jest.mock("validate.js", () => jest.fn(() => null));

jest.mock("@material-ui/core", () => ({
  Typography: ({ children, className }) => (
    <div className={className}>{children}</div>
  ),
  Link: ({ children, className, onClick, href }) => (
    <a className={className} onClick={onClick} href={href}>
      {children}
    </a>
  ),
}));

jest.mock("../../../common/components/outerPagesStyle", () => ({
  useStyles: () => ({
    SubscribeForm: "mock-subscribe-form",
    SubscribeMail: "mock-subscribe-mail",
    SubscribeTitle: "mock-subscribe-title",
    SubscribeConfirmMail: "mock-subscribe-confirm-mail",
    SubscribeSpam: "mock-subscribe-spam",
    SubscribeLinks: "mock-subscribe-links",
  }),
}));

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
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

describe("Subscribe Component", () => {
  const mockFormState = {
    values: {},
    touched: {},
    errors: {},
    isValid: false,
  };
  const mockSetFormState = jest.fn();
  const mockNavigation = { next: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue("test-user-id");
    sessionStorageMock.getItem.mockReturnValue(
      JSON.stringify({ email: "test@example.com" })
    );
  });

  const renderComponent = () => {
    return render(
      <Subscribe
        formState={mockFormState}
        setFormState={mockSetFormState}
        navigation={mockNavigation}
      />
    );
  };

  it("renders without crashing", () => {
    renderComponent();
    expect(screen.getByText("Thank you for signing up.")).toBeInTheDocument();
  });

  it("displays all content elements", () => {
    renderComponent();

    expect(screen.getByText("Thank you for signing up.")).toBeInTheDocument();
    expect(
      screen.getByText(
        /We will send you a confirmation email shortly with an activation link/i
      )
    ).toBeInTheDocument();
    expect(screen.getByText("plug_admin@plugonline.io")).toBeInTheDocument();
    expect(screen.getByText("Send again")).toBeInTheDocument();
  });

  it("displays the mail image", () => {
    renderComponent();
    const image = screen.getByAltText("mail");
    expect(image).toHaveClass("mock-subscribe-mail");
  });

  it("handles resend email successfully", async () => {
    sendVerificationEmail.mockResolvedValue({
      type: "success",
      msg: "Email resent successfully",
    });

    renderComponent();
    fireEvent.click(screen.getByText("Send again"));

    await waitFor(() => {
      expect(sendVerificationEmail).toHaveBeenCalledWith("test@example.com");
      expect(successToastify).toHaveBeenCalledWith("Email resent successfully");
    });
  });

  it("handles resend email failure", async () => {
    sendVerificationEmail.mockResolvedValue({
      type: "error",
      msg: "Failed to resend email",
    });

    renderComponent();
    fireEvent.click(screen.getByText("Send again"));

    await waitFor(() => {
      expect(errorToastify).toHaveBeenCalledWith("Failed to resend email");
    });
  });

  it("shows loading indicator during resend", async () => {
    sendVerificationEmail.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    renderComponent();
    fireEvent.click(screen.getByText("Send again"));

    expect(screen.getByText("Send again")).toContainHTML("activity-loader");
  });

  it("applies correct styling classes", () => {
    renderComponent();

    expect(screen.getByText("Thank you for signing up.")).toHaveClass(
      "mock-subscribe-title"
    );
    expect(
      screen.getByText(
        /We will send you a confirmation email shortly with an activation link/i
      )
    ).toHaveClass("mock-subscribe-confirm-mail");
    expect(screen.getByText("plug_admin@plugonline.io")).toHaveClass(
      "mock-subscribe-links"
    );
  });
});
