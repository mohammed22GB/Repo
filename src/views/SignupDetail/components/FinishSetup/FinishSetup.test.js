import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import FinishSetup from "./index";

jest.mock("@material-ui/core", () => ({
  Grid: ({ children }) => <div>{children}</div>,
  Button: ({ children, onClick, className }) => (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  ),
  Typography: ({ children, className }) => (
    <div className={className}>{children}</div>
  ),
}));

jest.mock("@material-ui/styles", () => ({
  makeStyles: () => () => ({
    form: "mock-form",
    mail: "mock-mail",
    finishsetup: "mock-finishsetup",
    title: "mock-title",
    confirmmail: "mock-confirmmail",
    finish: "mock-finish",
  }),
}));

jest.mock("validate.js", () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

const mockPush = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockPush,
  }),
}));

describe("FinishSetup Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    const history = createMemoryHistory();
    return render(
      <Router history={history}>
        <FinishSetup />
      </Router>
    );
  };

  it("renders successfully", () => {
    renderComponent();
    expect(screen.getByText("Thank you for signing up")).toBeInTheDocument();
  });

  it("displays all content elements", () => {
    renderComponent();

    expect(screen.getByText("Thank you for signing up")).toBeInTheDocument();
    expect(
      screen.getByText("Your email has been confirmed and account activated")
    ).toBeInTheDocument();
    expect(screen.getByText("Complete")).toBeInTheDocument();
    expect(screen.getByAltText("mail")).toBeInTheDocument();
  });

  it("navigates to login when Complete is clicked", () => {
    renderComponent();
    fireEvent.click(screen.getByText("Complete"));
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining("login"));
  });

  it("applies correct styling classes", () => {
    renderComponent();

    const title = screen.getByText("Thank you for signing up");
    const button = screen.getByText("Complete");

    expect(title).toHaveClass("mock-title");
    expect(button).toHaveClass("mock-finish");
  });
});
