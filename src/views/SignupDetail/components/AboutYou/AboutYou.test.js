import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import AboutYou from "./index";

jest.mock("@material-ui/core/styles", () => ({
  ...jest.requireActual("@material-ui/core/styles"),
  useTheme: () => ({
    breakpoints: {
      down: () => false,
    },
  }),
  makeStyles: () => () => ({}),
}));

jest.mock("@material-ui/core/useMediaQuery");

jest.mock("react-phone-input-2", () => ({
  __esModule: true,
  default: (props) => (
    <div>
      <input
        data-testid="phone-input"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  ),
}));

jest.mock("../../../common/components/DropDown/CustomDropDown", () => ({
  __esModule: true,
  default: (props) => (
    <select
      data-testid="business-role-dropdown"
      value={props.value}
      onChange={(e) =>
        props.onChange({
          target: {
            name: props.name,
            value: e.target.value,
          },
        })
      }
    >
      {props.data?.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
}));

jest.mock("validate.js", () => jest.fn(() => null));

describe("AboutYou Component", () => {
  const mockFormState = {
    values: {
      firstName: "",
      lastName: "",
      mobile: "",
      businessRole: "",
    },
    touched: {},
    errors: {},
    isValid: false,
  };

  const mockSetFormState = jest.fn();
  const mockNavigation = { next: jest.fn() };
  const mockClasses = {
    title: "mock-title",
    subtitle: "mock-subtitle",
    formLabels: "mock-formLabels",
    formTextField: "mock-formTextField",
    notched: "mock-notched",
    inputField: "mock-inputField",
    phoneInputClass: "mock-phoneInput",
    phoneButtonClass: "mock-phoneButton",
    pageButton: "mock-pageButton",
    disabled: "mock-disabled",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Storage.prototype.setItem = jest.fn();
  });

  const renderComponent = () => {
    const history = createMemoryHistory();
    return render(
      <Router history={history}>
        <AboutYou
          formState={mockFormState}
          setFormState={mockSetFormState}
          navigation={mockNavigation}
          classes={mockClasses}
        />
      </Router>
    );
  };

  it("renders without crashing", () => {
    renderComponent();
    expect(
      screen.getByText("Tell us a bit about yourself")
    ).toBeInTheDocument();
  });

  it("displays all form fields", () => {
    renderComponent();
    expect(
      screen.getByPlaceholderText("Enter your first name")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your first name")
    ).toBeInTheDocument();
    expect(screen.getByTestId("phone-input")).toBeInTheDocument();
    expect(screen.getByTestId("business-role-dropdown")).toBeInTheDocument();
  });

  it("handles form field changes", () => {
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("Enter your first name"), {
      target: { name: "firstName", value: "John" },
    });
    expect(mockSetFormState).toHaveBeenCalled();

    fireEvent.change(screen.getByTestId("phone-input"), {
      target: { value: "+1234567890" },
      persist: jest.fn(),
    });
    expect(mockSetFormState).toHaveBeenCalled();
  });

  it("enables next button when form is valid", () => {
    const validFormState = {
      ...mockFormState,
      values: {
        firstName: "John",
        lastName: "Doe",
        mobile: "+2348012345678",
        businessRole: "Developer",
      },
      isValid: true,
    };

    render(
      <Router history={createMemoryHistory()}>
        <AboutYou
          formState={validFormState}
          setFormState={mockSetFormState}
          navigation={mockNavigation}
          classes={mockClasses}
        />
      </Router>
    );

    expect(screen.getByText("Next")).not.toBeDisabled();
  });

  it("saves form data to sessionStorage and navigates on submit", () => {
    const validFormState = {
      ...mockFormState,
      values: {
        firstName: "John",
        lastName: "Doe",
        mobile: "+2348012345678",
        businessRole: "Developer",
      },
      isValid: true,
    };

    render(
      <Router history={createMemoryHistory()}>
        <AboutYou
          formState={validFormState}
          setFormState={mockSetFormState}
          navigation={mockNavigation}
          classes={mockClasses}
        />
      </Router>
    );

    fireEvent.click(screen.getByText("Next"));

    expect(sessionStorage.setItem).toHaveBeenCalledWith(
      "about_you",
      JSON.stringify(validFormState.values)
    );
    expect(mockNavigation.next).toHaveBeenCalled();
  });
});
