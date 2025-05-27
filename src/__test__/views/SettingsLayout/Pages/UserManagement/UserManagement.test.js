import {
  mockThemeAndRouter,
  waitFor,
  screen,
} from "../../../../../test-utilities/testMocks/themeRouter";
import { MemoryRouter } from "react-router-dom";
import UserManagement from "../../../../../views/SettingsLayout/Pages/UserManagement";
import userEvent from "@testing-library/user-event";

jest.setTimeout(12000);

const UserManagementComponent = (option) => {
  return mockThemeAndRouter(
    <MemoryRouter initialEntries={["/settings/user-management"]}>
      <UserManagement />
    </MemoryRouter>,
    { ...option }
  );
};

describe("<UserManagement />", () => {
  test("activate user portal when ToggleUserPortalActivationButton is clicked", async () => {
    // go to the user management page
    UserManagementComponent();

    // look for the activate user portal button and click on it
    const activateBtn = await screen.findByRole("button", {
      name: /activate user portal/i,
    });
    expect(activateBtn).toBeInTheDocument();
    userEvent.click(activateBtn);

    // let it get proceed in the dialog compnent
    const proceedButton = await screen.findByRole("button", {
      name: /proceed/i,
    });

    expect(proceedButton).toBeInTheDocument();

    userEvent.click(proceedButton);

    // Confirm the modal disappears
    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: /proceed/i })
      ).not.toBeInTheDocument();
    });
  });
});
