import React from "react";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Welcome from ".";
import queryString from "query-string";
import { mockProviders } from "../../test-utilities/mockProviders";
import { CustomAxios } from "../common/utils/CustomAxios";

// Mock query-string
jest.mock("query-string", () => ({
  parse: jest.fn(),
}));

// Mock axios
jest.mock("axios", () => ({
  CancelToken: {
    source: jest.fn(() => ({
      token: "mock-cancel-token",
      cancel: jest.fn(),
    })),
  },
}));

jest.mock("../common/utils/CustomAxios", () => ({
  CustomAxios: jest.fn(),
}));

jest.mock("../common/utils/lists", () => ({
  unprotectedUrls: {
    LOGIN: "/login",
  },
}));

const mockHistoryPush = jest.fn();
const mockLocation = {
  search: "?email=test%40example.com&code=12345&token=mockToken123",
};
const mockHistory = {
  push: mockHistoryPush,
};

describe("Welcome Component", () => {
  const renderComponent = () => {
    return mockProviders(() => (
      <Welcome history={mockHistory} location={mockLocation} />
    ));
  };

  // Set a mock for process.env
  const originalEnv = process.env;
  beforeAll(() => {
    process.env = { ...originalEnv, REACT_APP_ENDPOINT: "http://mockapi.com" };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    // Mock queryString.parse for each test
    queryString.parse.mockReturnValue({
      email: "test@example.com",
      code: "12345",
      token: "mockToken123",
    });

    // Mock document.title
    Object.defineProperty(document, "title", {
      writable: true,
      value: "",
    });

    // Mock window.location.href
    Object.defineProperty(window, "location", {
      writable: true,
      value: { href: "" },
    });
  });

  test("renders without crashing and sets document title", async () => {
    renderComponent();
    expect(screen.getByText("Activation successful!")).toBeInTheDocument();
    expect(screen.getByText(/Your email is activated./i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Go to Login" })
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(document.title).toBe("Plug | Welcome");
    });
  });

  test('navigates to login page when "Go to Login" button is clicked', () => {
    renderComponent();

    const loginButton = screen.getByRole("button", { name: "Go to Login" });
    fireEvent.click(loginButton);

    expect(window.location.href).toBe("/login");
  });

  test("calls verify email API with expected params", async () => {
    const mockPut = jest.fn().mockResolvedValue({ data: {} });
    CustomAxios.mockReturnValue({ put: mockPut });

    renderComponent();

    await waitFor(() => {
      expect(mockPut).toHaveBeenCalledTimes(1);
      expect(mockPut).toHaveBeenCalledWith(
        expect.stringContaining("/auth/verify-email"),
        {
          email: "test@example.com",
          emailVerificationCode: "12345",
        },
        expect.objectContaining({
          headers: {
            Authorization: "Bearer mockToken123",
          },
        })
      );
    });
  });

  test("handles email with spaces correctly in API call", async () => {
    queryString.parse.mockReturnValue({
      email: "test example@test.com", // Email with a space
      code: "67890",
      token: "anotherMockToken",
    });

    const mockPut = jest.fn().mockResolvedValue({ data: {} });
    CustomAxios.mockReturnValue({ put: mockPut });

    renderComponent();

    await waitFor(() => {
      expect(mockPut).toHaveBeenCalledTimes(1);
      expect(mockPut).toHaveBeenCalledWith(
        expect.stringContaining("/auth/verify-email"),
        {
          email: "test+example@test.com",
          emailVerificationCode: "67890",
        },
        expect.objectContaining({
          headers: {
            Authorization: "Bearer anotherMockToken",
          },
        })
      );
    });
  });
});
