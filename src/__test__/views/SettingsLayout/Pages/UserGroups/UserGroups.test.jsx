import {
  mockThemeAndRouter,
  fireEvent,
  waitFor,
  cleanup,
  queryWrapper,
  screen,
} from "../../../../../test-utilities/testMocks/themeRouter";
import { act } from "react-dom/test-utils";
import UserGroups from "../../../../../views/SettingsLayout/Pages/UserGroups/UserGroups";
import { server } from "../../../../../setupTests";
import { rest } from "msw";
import { MemoryRouter } from "react-router-dom";
import { getUserGroupsList } from "../../../../../test-utilities/testMocks/handlers/userGroups";
import { getUsers } from "../../../../../test-utilities/testMocks/handlers/userManagement";
import useCustomMutation from "../../../../../views/common/utils/CustomMutation";
import { getUserGroupsAPI } from "../../../../../views/SettingsLayout/Pages/UserGroups/utils/usergroupsAPIs";
import { getUsersAPI } from "../../../../../views/SettingsLayout/Pages/UserManagement/utils/usersAPIs";
import NewUserModal from "../../../../../views/SettingsLayout/Pages/UserGroups/components/NewUserGroupModal";
import AlertUserInUserGroupModal from "../../../../../views/SettingsLayout/Pages/UserGroups/components/AlertUserAlreadyInUserGroupModal";
import UserGroupCardbox from "../../../../../views/SettingsLayout/Pages/UserGroups/components/UserGroupCardbox";

jest.mock("../../../../../views/common/utils/userRoleEvaluation", () => {
  const getUserRole = () => ["PlugAdmin"];

  const tempPermissions = (roles) =>
    roles?.includes("PlugAdmin") ? true : false;

  const appPermissions = (roles = ["Admin"]) =>
    roles?.includes("Admin") ? true : true;

  const handleRoleActionAccess = () => true;
  const handleRolePageAccess = () => true;

  return {
    getUserRole,
    tempPermissions,
    appPermissions,
    handleRoleActionAccess,
    handleRolePageAccess,
  };
});

describe("<UserGroups />", () => {
  afterEach(() => {
    cleanup();
  });

  const query = {
    queryKey: [
      "allUserGroups",
      {
        query: {
          population: [{ path: "users", select: "id firstName lastName" }],
        },
      },
      10,
      1,
    ],
  };

  const component = (option) => {
    return mockThemeAndRouter(
      <MemoryRouter initialEntries={["/settings/user-groups"]}>
        <UserGroups />
      </MemoryRouter>,
      { ...option }
    );
  };

  const modalComponent = (option) => {
    return mockThemeAndRouter(
      <MemoryRouter>
        <NewUserModal />
      </MemoryRouter>,
      { ...option }
    );
  };

  const AlertmodalComponent = (option) => {
    return mockThemeAndRouter(
      <MemoryRouter>
        <AlertUserInUserGroupModal open={true} />
      </MemoryRouter>,
      { ...option }
    );
  };

  const mockFunctionalStatus = jest.fn();
  const UserGroupCardboxComponent = (option) => {
    return mockThemeAndRouter(
      <MemoryRouter>
        <UserGroupCardbox functionalStatus={mockFunctionalStatus} />
      </MemoryRouter>,
      { ...option }
    );
  };

  test("UserGroups components are present", async () => {
    component();

    //screen.debug(undefined, Infinity);
    expect(document.title).toBe("Settings | User Groups");
  });

  test("Get UserGroup list", async () => {
    component();

    const { getByText, getAllByTitle } = screen;

    await act(async () => {
      //console.log(server);
      server.use(getUserGroupsList);
      const userGroupData = await getUserGroupsAPI(query);

      expect(userGroupData.data).toHaveLength(2);
    });
    const userGroupItem = await waitFor(() => getAllByTitle("userGroupItem"));
    //Having a length of one is because of the "active" property check
    expect(userGroupItem).toHaveLength(2);
  });

  test.skip("Get usergroup list failure", async () => {
    component();

    await act(async () => {
      server.use(
        rest.get(
          `${process.env.REACT_APP_ENDPOINT}/user-groups`,
          (req, res, ctx) => {
            return res(
              ctx.status(500),
              ctx.json({
                message: "Request failed with status code 500",
              })
            );
          }
        )
      );

      try {
        const appsData = await getUserGroupsAPI(query);
      } catch (err) {
        console.log(err.message);
        expect(err.message).toEqual("Request failed with status code 500");
      }

      //   getAppsList(query).catch((err) =>
      //   expect(err).toEqual({ message: "Request failed with status code 500", status: 401 })
      // )
    });
  });

  test("Usergroups item renders with necessary properties", async () => {
    component();

    const { getAllByTestId, getByText, getAllByTitle } = screen;

    await act(async () => {
      await getUserGroupsAPI(query);
    });
    // const editAppItem = await waitFor(() => getByTitle("editApp"));
    // expect(editAppItem).toBeInTheDocument();

    const editUserGroupItem = await waitFor(() =>
      getAllByTitle("editGroupIcon")
    );
    expect(editUserGroupItem[0]).toBeInTheDocument();
    const userGroupListItem = await waitFor(() =>
      getAllByTitle("groupListIcon")
    );
    expect(userGroupListItem[0]).toBeInTheDocument();
    const deleteGroupItem = await waitFor(() =>
      getAllByTitle("deleteGroupIcon")
    );
    expect(deleteGroupItem[0]).toBeInTheDocument();
  });

  test("Ensure NewUserGroupModal is rendered when called", () => {
    // Render the modal component
    modalComponent();

    // Assert that the modal is in the document
    const modal = screen.getByTestId("user-group-modal");
    expect(modal).toBeInTheDocument();
  });

  test("Ensure AlertUserInUserGroupModal is rendered when called", () => {
    // Render the modal component
    AlertmodalComponent();

    // Assert that the modal is in the document
    const modal = screen.getByTestId("alert-user-group-already-exist");
    expect(modal).toBeInTheDocument();
  });

  test("Render user group card box, when the add icon is clicked, let it call the functionalStatus function to open the edituser modal", () => {
    UserGroupCardboxComponent();

    const { getByTestId } = screen;

    const triggerIcon = getByTestId("user-group-cardbox");

    expect(triggerIcon).toBeInTheDocument();

    fireEvent.click(triggerIcon);

    expect(mockFunctionalStatus).toHaveBeenCalledTimes(1);
  });

  test("List user group members", async () => {
    component();

    const { getAllByTitle, getByText, getByTitle } = screen;
    const userGroupListItem = await waitFor(() =>
      getAllByTitle("groupListIcon")
    );
    expect(userGroupListItem[0]).toBeInTheDocument();

    await act(async () => {
      server.use(getUsers);
      const usersData = await getUsersAPI();
      //console.log(usersData);

      expect(usersData.data).toHaveLength(4);
    });
    fireEvent.click(userGroupListItem[1]);

    //screen.debug(undefined, Infinity);
    const popupTitle = getByTitle("popupTitle");
    expect(popupTitle).toBeInTheDocument();
    // const groupMemberItem = getByTitle("groupMember");
    // expect(groupMemberItem).toBeInTheDocument();
  });
});
