import { screen, render, fireEvent } from "@testing-library/react";
import ToggleUserPortalActivationButton from "../../../../../../views/SettingsLayout/Pages/UserManagement/components/ToggleUserPortalActivationButton";

let props = {
  buttonClassName: "toggle-button-class-name",
  isUserPortalEnabled: false,
  userPortalLoading: false,
  showActivateUserPortalModal: () => {},
  toggleUserPortalActivationAndDeactivation: () => {},
};

let mockShowActivateUserPortalModal;
let mockToggleUserPortalActivationAndDeactivation;

beforeEach(() => {
  mockShowActivateUserPortalModal = jest.fn();
  mockToggleUserPortalActivationAndDeactivation = jest.fn();
});

afterEach(() => {
  props = {};
});

const ToggleUserPortalActivationButtonComponent = () => {
  render(<ToggleUserPortalActivationButton {...props} />);
};

describe("ToggleUserPortalActivationButton", () => {
  test("render ToggleUserPortalActivationButton", () => {
    ToggleUserPortalActivationButtonComponent();

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  /** When user portal is enabled in the component */
  test("button text should show `Deactivate user portal` if isUserPortalEnabled is true", () => {
    props = {
      ...props,
      isUserPortalEnabled: true,
    };

    ToggleUserPortalActivationButtonComponent(props);

    expect(screen.getByRole("button")).toHaveTextContent(
      "Deactivate user portal"
    );
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  test("button text should show `Deactivating user portal` if isUserPortalEnabled is true and userPortalLoading is true", () => {
    props = {
      ...props,
      userPortalLoading: true,
      isUserPortalEnabled: true,
    };

    ToggleUserPortalActivationButtonComponent(props);

    expect(screen.getByRole("button")).toHaveTextContent(
      "Deactivating user portal"
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });

  test("onClick of button if isUserPortalEnabled is true it calls the toggleUserPortalActivationAndDeactivation function", () => {
    props = {
      ...props,
      isUserPortalEnabled: true,
      toggleUserPortalActivationAndDeactivation:
        mockToggleUserPortalActivationAndDeactivation,
      showActivateUserPortalModal: mockShowActivateUserPortalModal,
    };
    ToggleUserPortalActivationButtonComponent(props);
    const button = screen.getByRole("button");

    fireEvent.click(button);
    expect(mockToggleUserPortalActivationAndDeactivation).toHaveBeenCalledTimes(
      1
    );
    expect(mockShowActivateUserPortalModal).not.toHaveBeenCalled();
  });

  /** When user portal is not enabled in the component */
  test("button text should show `Activate user portal` if isUserPortalEnabled is false", () => {
    props = {
      ...props,
      isUserPortalEnabled: false,
    };

    ToggleUserPortalActivationButtonComponent(props);

    expect(screen.getByRole("button")).toHaveTextContent(
      "Activate user portal"
    );
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  test("button text should show `Activating user portal` if isUserPortalEnabled is false and userPortalLoading is true", () => {
    props = {
      ...props,
      userPortalLoading: true,
      isUserPortalEnabled: false,
    };

    ToggleUserPortalActivationButtonComponent(props);

    expect(screen.getByRole("button")).toHaveTextContent(
      "Activating user portal"
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });

  test("onClick of button if isUserPortalEnabled is false it calls the showActivateUserPortalModal function", () => {
    props = {
      ...props,
      isUserPortalEnabled: false,
      toggleUserPortalActivationAndDeactivation:
        mockToggleUserPortalActivationAndDeactivation,
      showActivateUserPortalModal: mockShowActivateUserPortalModal,
    };
    ToggleUserPortalActivationButtonComponent(props);
    const button = screen.getByRole("button");

    fireEvent.click(button);
    expect(mockShowActivateUserPortalModal).toHaveBeenCalledTimes(1);
    expect(
      mockToggleUserPortalActivationAndDeactivation
    ).not.toHaveBeenCalled();
  });
});
