import {
  mockThemeAndRouter,
  fireEvent,
  //queryWrapper,
  waitFor,
  cleanup,
  screen,
  queryWrapper,
} from "../../../test-utilities/testMocks/themeRouter";
import { act } from "react-dom/test-utils";
import { renderHook } from "@testing-library/react-hooks";
import { MemoryRouter } from "react-router-dom";
import useCustomMutation from "../../../views/common/utils/CustomMutation";
import { server } from "../../../setupTests";
import {
  getDeleteDatasheetPermissions,
  getEditDatasheetPermissions,
  emptyDatasheetPermissions,
  getViewDatasheetPermissions,
} from "../../../test-utilities/testMocks/handlers/datasheet/permissions";
import {
  updateResourcePermissions,
  groupResourcePermissions,
  getDatasheetById,
} from "../../../views/common/components/Query/DataSheets/datasheetQuery";
import {
  createNewDataSheet,
  duplicateDataSheet,
} from "../../../views/common/components/Mutation/Datasheets/datasheetMutation";
import Datasheets from "../../../views/Datasheets";

// jest.mock("../../../common/util/userRoleEvaluation", () => {
//   const getUserRole = () => ["PlugAdmin"];
//   const roles = "PlugAdmin";

//   const handleRoleActionAccess = () => true;
//   const handleRolePageAccess = () => true;

//   return { getUserRole, handleRoleActionAccess, handleRolePageAccess };
// });

describe.skip("<Datasheets />", () => {
  afterEach(() => {
    cleanup();
  });

  //

  const userData = {
    roles: ["Designer", "Employee", "Admin"],
    _id: "62b1e8e6c3d82b1ddd3dec0f",
    account: {
      user: "615ae60a3b0d9011ce1aecc8",
      id: "615ae60a3b0d9011ce1aecc9",
    },
    id: "62b1e8e6c3d82b1ddd3dec0f",
  };
  const userInfo = JSON.stringify(userData);
  localStorage.setItem("userInfo", userInfo);
  //
  //
  let grantedList = [
    {
      identity: "user",
      value: "631532a3c8bb7111243301fc",
    },
  ];
  const datasheetId = "64d5ec00cd320ce56274c2fc";
  let action = "add";
  let permsType = "read";

  //

  const component = (option) => {
    return mockThemeAndRouter(
      <MemoryRouter initialEntries={["/datasheets"]}>
        <Datasheets />
      </MemoryRouter>,
      { ...option }
    );
  };

  test.skip("Static elements are present", async () => {
    component();

    const { getByText, getByTestId, getByPlaceholderText, getAllByText } =
      screen;

    server.use(emptyDatasheetPermissions);
    //screen.debug(undefined, Infinity);
    await waitFor(() => {
      //expect(getByText("Sort by")).toBeInTheDocument();
      expect(getAllByText("Datasheets")).toHaveLength(2);
      expect(getByTestId("createButton")).toBeInTheDocument();
      expect(getByPlaceholderText(/Search/i)).toBeInTheDocument();
      expect(document.title).toBe("Datasheets");
    });
  });

  test.skip("New datasheet popup", async () => {
    component();

    const { getByText, getByTestId, getByTitle } = screen;
    server.use(emptyDatasheetPermissions);

    fireEvent.click(getByTestId("createButton"));

    //screen.debug(undefined, Infinity);
    await waitFor(() => {
      expect(getByText("Create new datasheet")).toBeInTheDocument();
      expect(getByTitle("submitBtn")).toBeInTheDocument();
      expect(getByTitle("submitBtn")).toBeDisabled();
      fireEvent.click(getByTitle("closeBtn"));
    });
  });

  test.skip("Create new datasheet", async () => {
    component();

    const { getByPlaceholderText, getByTestId, getByTitle, getAllByTitle } =
      screen;
    server.use(emptyDatasheetPermissions);

    fireEvent.click(getByTestId("createButton"));

    fireEvent.change(getByPlaceholderText("Enter DataSheet name"), {
      target: { value: "A New Datasheet" },
    });

    const { result } = renderHook(
      () =>
        useCustomMutation({
          apiFunc: createNewDataSheet,
          onSuccess: jest.fn(),
          retries: 0,
        }),
      { wrapper: queryWrapper }
    );

    act(() => {
      result.current.mutate(() => ({
        name: "A New Datasheet",
      }));
    });
    fireEvent.click(getByTitle("submitBtn"));
    await waitFor(() => {
      expect(result.current.isError).toBe(false);
      expect(result.current.data).toBeDefined();
    });
    //await waitFor(() => console.log(result.current.data), { timeout: 400 });
  });

  test.skip("Show menu dropdown on click of options menu", async () => {
    component();

    const { getByText, getByTestId, getAllByTitle } = screen;
    server.use(emptyDatasheetPermissions);

    //screen.debug(undefined, Infinity);

    const menuIcon = await waitFor(() => getAllByTitle("menuIcon"));
    expect(menuIcon).toHaveLength(2);
    fireEvent.click(menuIcon[0]);
  });

  test.skip("Delete a datasheet item", async () => {
    component();

    const { getByText, getByTestId, getAllByTitle } = screen;
    server.use(emptyDatasheetPermissions);

    //screen.debug(undefined, Infinity);

    const menuIcon = await waitFor(() => getAllByTitle("menuIcon"));
    fireEvent.click(menuIcon[0]);

    //window.prompt = jest.fn().mockReturnValueOnce("delete");

    const confirmSpy = jest.spyOn(window, "prompt");
    confirmSpy.mockReturnValueOnce("delete");
    fireEvent.click(getByText("Delete"));
    expect(window.prompt).toHaveBeenCalled();
    //expect(window.prompt).toHaveBeenCalledWith("delete");
    //screen.debug(undefined, Infinity);
  });

  test.skip("Export a datasheet item", async () => {
    component();

    const { getByText, getByTestId, getAllByTitle } = screen;
    server.use(emptyDatasheetPermissions);

    //screen.debug(undefined, Infinity);

    const menuIcon = await waitFor(() => getAllByTitle("menuIcon"));
    fireEvent.click(menuIcon[1]);

    await act(async () => {
      const ID = "6546e7cbfff86f13935cb11b";

      const respData = await getDatasheetById({ queryKey: [null, { id: ID }] });

      fireEvent.click(getByText("Export"));

      expect(respData.data).toBeDefined();
    });
  });

  test.skip("Duplicate a datasheet item", async () => {
    component();

    const { getByText, getAllByTitle } = screen;
    server.use(emptyDatasheetPermissions);

    //screen.debug(undefined, Infinity);

    const menuIcon = await waitFor(() => getAllByTitle("menuIcon"));
    fireEvent.click(menuIcon[1]);

    const { result } = renderHook(
      () =>
        useCustomMutation({
          apiFunc: duplicateDataSheet,
          onSuccess: jest.fn(),
          retries: 0,
        }),
      { wrapper: queryWrapper }
    );

    act(() => {
      result.current.mutate(() => ({
        datasheet: "638f663175acc02d07f9526e",
      }));
    });

    fireEvent.click(getByText("Duplicate"));
    await waitFor(() => {
      expect(result.current.isError).toBe(false);
      expect(result.current.data).toBeDefined();
    });
  }, 15000);

  test.skip("Configurations sidebar for a datasheet", async () => {
    component();

    const { getByText, getByTestId, getAllByTitle, getByTitle } = screen;
    server.use(emptyDatasheetPermissions);

    //screen.debug(undefined, Infinity);

    const menuIcon = await waitFor(() => getAllByTitle("menuIcon"));
    fireEvent.click(menuIcon[1]);

    fireEvent.click(getByText("Permissions"));
    const closeButton = await waitFor(() => getAllByTitle("closeBtn"));
    fireEvent.click(closeButton[0]);
  });

  test.skip("View Permissions for a datasheet", async () => {
    component();

    const { getByText, getByTestId, getAllByTitle, getByRole } = screen;
    server.use(getViewDatasheetPermissions);

    const menuIcon = await waitFor(() => getAllByTitle("menuIcon"));
    fireEvent.click(menuIcon[1]);
    fireEvent.click(getByText("Permissions"));

    expect(getByText("Select who can view the datasheet")).toBeInTheDocument();
    //screen.debug(undefined, Infinity);

    const adminInput = getByTestId("adminViewPermsSwitch").querySelector(
      "input"
    );
    //console.log(inputElement);
    expect(adminInput.checked).toBeTruthy();
    const employeeViewInput = getByTestId(
      "employeeViewPermsSwitch"
    ).querySelector("input");
    expect(employeeViewInput.checked).toBeFalsy();
  }, 12000);

  test.skip("Select datasheet view permissions for an employee", async () => {
    component();

    const { getByText, getByTestId, getAllByTitle, getByTitle } = screen;
    server.use(getViewDatasheetPermissions);

    const menuIcon = await waitFor(() => getAllByTitle("menuIcon"));
    fireEvent.click(menuIcon[1]);
    fireEvent.click(getByText("Permissions"));

    //screen.debug(undefined, Infinity);

    const selectDropDown = await waitFor(() => getAllByTitle("selectDropDown"));
    expect(selectDropDown).toHaveLength(3);
    fireEvent.click(selectDropDown[0]);
    expect(getByText("== Users ==")).toBeInTheDocument();
    const userItem = await waitFor(() => getAllByTitle("userItem"));
    expect(userItem).toHaveLength(4);
    expect(getByText("== User Groups ==")).toBeInTheDocument();
    const userGroupItem = await waitFor(() => getAllByTitle("userGroupItem"));
    expect(userGroupItem).toHaveLength(4);

    //fireEvent.click(userItem[0]);
    //const selectedItem = await waitFor(() => getAllByTitle("selectedItem"));

    const data = { permsType, grantedList, resourceId: datasheetId };

    const { result } = renderHook(
      () =>
        useCustomMutation({
          apiFunc: updateResourcePermissions,
          onSuccess: jest.fn(),
          retries: 0,
        }),
      { wrapper: queryWrapper }
    );

    act(() => {
      result.current.mutate(() => data);
    });
    fireEvent.click(userItem[0]);
    await waitFor(() => {
      expect(result.current.isError).toBe(false);
      expect(result.current.data).toBeDefined();
    });
    fireEvent.click(getByTitle("cancelSelected"));
  }, 12000);

  test.skip("Toogle datasheet view permissions for employees", async () => {
    component();

    const { getByText, getByTestId, getAllByTitle, getByRole } = screen;
    server.use(getViewDatasheetPermissions);

    const menuIcon = await waitFor(() => getAllByTitle("menuIcon"));
    fireEvent.click(menuIcon[1]);
    fireEvent.click(getByText("Permissions"));

    //screen.debug(undefined, Infinity);

    const employeeViewSwitch = await waitFor(() =>
      getByTestId("employeeViewPermsSwitch")
    );
    const employeeViewInput = employeeViewSwitch.querySelector("input");

    const selectDropDown = await waitFor(() => getAllByTitle("selectDropDown"));
    fireEvent.click(selectDropDown[0]);

    //fireEvent.click(userItem[0]);
    //const selectedItem = await waitFor(() => getAllByTitle("selectedItem"));
    grantedList = [
      {
        identity: "user",
        value: "640b7e02c9b936457885113e",
      },
      {
        identity: "user",
        value: "631532a3c8bb7111243301fc",
      },
    ];
    const data = { permsType, grantedList, resourceId: datasheetId, action };

    const { result } = renderHook(
      () =>
        useCustomMutation({
          apiFunc: groupResourcePermissions,
          onSuccess: jest.fn(),
          retries: 0,
        }),
      { wrapper: queryWrapper }
    );

    act(() => {
      result.current.mutate(() => data);
    });

    fireEvent.change(employeeViewInput, { target: { checked: true } });
    await waitFor(() => {
      expect(result.current.isError).toBe(false);
      expect(result.current.data).toBeDefined();
      expect(employeeViewInput.checked).toBeTruthy();
    });
    fireEvent.change(employeeViewInput, { target: { checked: false } });
  }, 12000);

  test.skip("Edit Permissions for a datasheet", async () => {
    component();

    const { getByText, getByTestId, getAllByTitle, getByRole } = screen;
    server.use(getEditDatasheetPermissions);

    const menuIcon = await waitFor(() => getAllByTitle("menuIcon"));
    fireEvent.click(menuIcon[1]);
    fireEvent.click(getByText("Permissions"));

    expect(getByText("Select who can edit the datasheet")).toBeInTheDocument();
    //screen.debug(undefined, Infinity);

    const adminInput = getByTestId("adminEditPermsSwitch").querySelector(
      "input"
    );
    //console.log(inputElement);
    expect(adminInput.checked).toBeTruthy();
    const employeeEditInput = getByTestId(
      "employeeEditPermsSwitch"
    ).querySelector("input");
    expect(employeeEditInput.checked).toBeFalsy();
  }, 12000);

  test.skip("Select datasheet edit permissions for an employee", async () => {
    component();

    const { getByText, getByTestId, getAllByTitle, getByTitle } = screen;
    server.use(getEditDatasheetPermissions);

    const menuIcon = await waitFor(() => getAllByTitle("menuIcon"));
    fireEvent.click(menuIcon[1]);
    fireEvent.click(getByText("Permissions"));

    //screen.debug(undefined, Infinity);

    const selectDropDown = await waitFor(() => getAllByTitle("selectDropDown"));
    expect(selectDropDown).toHaveLength(3);
    fireEvent.click(selectDropDown[1]);
    const userItem = await waitFor(() => getAllByTitle("userItem"));
    permsType = "modify";

    const data = { permsType, grantedList, resourceId: datasheetId };

    const { result } = renderHook(
      () =>
        useCustomMutation({
          apiFunc: updateResourcePermissions,
          onSuccess: jest.fn(),
          retries: 0,
        }),
      { wrapper: queryWrapper }
    );

    act(() => {
      result.current.mutate(() => data);
    });
    fireEvent.click(userItem[0]);
    await waitFor(() => {
      expect(result.current.isError).toBe(false);
      expect(result.current.data).toBeDefined();
    });
    fireEvent.click(getByTitle("cancelSelected"));
  }, 12000);

  test.skip("Toogle datasheet edit permissions for employees", async () => {
    component();

    const { getByText, getByTestId, getAllByTitle, getByRole } = screen;
    server.use(getEditDatasheetPermissions);

    const menuIcon = await waitFor(() => getAllByTitle("menuIcon"));
    fireEvent.click(menuIcon[1]);
    fireEvent.click(getByText("Permissions"));

    //screen.debug(undefined, Infinity);

    const employeeEditSwitch = await waitFor(() =>
      getByTestId("employeeEditPermsSwitch")
    );
    const employeeEditInput = employeeEditSwitch.querySelector("input");

    const selectDropDown = await waitFor(() => getAllByTitle("selectDropDown"));
    fireEvent.click(selectDropDown[1]);

    //fireEvent.click(userItem[0]);
    //const selectedItem = await waitFor(() => getAllByTitle("selectedItem"));
    grantedList = [
      {
        identity: "user",
        value: "640b7e02c9b936457885113e",
      },
      {
        identity: "user",
        value: "631532a3c8bb7111243301fc",
      },
    ];
    permsType = "modify";
    const data = { permsType, grantedList, resourceId: datasheetId, action };

    const { result } = renderHook(
      () =>
        useCustomMutation({
          apiFunc: groupResourcePermissions,
          onSuccess: jest.fn(),
          retries: 0,
        }),
      { wrapper: queryWrapper }
    );

    act(() => {
      result.current.mutate(() => data);
    });

    fireEvent.change(employeeEditInput, { target: { checked: true } });
    await waitFor(() => {
      expect(result.current.isError).toBe(false);
      expect(result.current.data).toBeDefined();
      expect(employeeEditInput.checked).toBeTruthy();
    });
    fireEvent.change(employeeEditInput, { target: { checked: false } });
  }, 12000);

  test.skip("Delete Permissions for a datasheet", async () => {
    component();

    const { getByText, getByTestId, getAllByTitle, getByRole } = screen;
    server.use(getDeleteDatasheetPermissions);

    const menuIcon = await waitFor(() => getAllByTitle("menuIcon"));
    fireEvent.click(menuIcon[1]);
    fireEvent.click(getByText("Permissions"));

    expect(
      getByText("Select who can delete the datasheet")
    ).toBeInTheDocument();
    //screen.debug(undefined, Infinity);

    const adminInput = getByTestId("adminDeletePermsSwitch").querySelector(
      "input"
    );
    //console.log(inputElement);
    expect(adminInput.checked).toBeTruthy();
    const employeeInput = getByTestId(
      "employeeDeletePermsSwitch"
    ).querySelector("input");
    expect(employeeInput.checked).toBeFalsy();
  }, 12000);

  test.skip("Select datasheet delete permissions for an employee", async () => {
    component();

    const { getByText, getByTestId, getAllByTitle, getByTitle } = screen;
    server.use(getDeleteDatasheetPermissions);

    const menuIcon = await waitFor(() => getAllByTitle("menuIcon"));
    fireEvent.click(menuIcon[1]);
    fireEvent.click(getByText("Permissions"));

    //screen.debug(undefined, Infinity);

    const selectDropDown = await waitFor(() => getAllByTitle("selectDropDown"));
    expect(selectDropDown).toHaveLength(3);
    fireEvent.click(selectDropDown[2]);
    const userItem = await waitFor(() => getAllByTitle("userItem"));
    permsType = "delete";

    const data = { permsType, grantedList, resourceId: datasheetId };

    const { result } = renderHook(
      () =>
        useCustomMutation({
          apiFunc: updateResourcePermissions,
          onSuccess: jest.fn(),
          retries: 0,
        }),
      { wrapper: queryWrapper }
    );

    act(() => {
      result.current.mutate(() => data);
    });
    fireEvent.click(userItem[0]);
    await waitFor(() => {
      expect(result.current.isError).toBe(false);
      expect(result.current.data).toBeDefined();
    });
    fireEvent.click(getByTitle("cancelSelected"));
  }, 12000);

  test.skip("Toogle datasheet delete permissions for employees", async () => {
    component();

    const { getByText, getByTestId, getAllByTitle, getByRole } = screen;
    server.use(getDeleteDatasheetPermissions);

    const menuIcon = await waitFor(() => getAllByTitle("menuIcon"));
    fireEvent.click(menuIcon[1]);
    fireEvent.click(getByText("Permissions"));

    //screen.debug(undefined, Infinity);

    const employeeDeleteSwitch = await waitFor(() =>
      getByTestId("employeeDeletePermsSwitch")
    );
    const employeeDeleteInput = employeeDeleteSwitch.querySelector("input");

    const selectDropDown = await waitFor(() => getAllByTitle("selectDropDown"));
    fireEvent.click(selectDropDown[1]);

    //fireEvent.click(userItem[0]);
    //const selectedItem = await waitFor(() => getAllByTitle("selectedItem"));
    grantedList = [
      {
        identity: "user",
        value: "640b7e02c9b936457885113e",
      },
      {
        identity: "user",
        value: "631532a3c8bb7111243301fc",
      },
    ];
    permsType = "delete";
    const data = { permsType, grantedList, resourceId: datasheetId, action };

    const { result } = renderHook(
      () =>
        useCustomMutation({
          apiFunc: groupResourcePermissions,
          onSuccess: jest.fn(),
          retries: 0,
        }),
      { wrapper: queryWrapper }
    );

    act(() => {
      result.current.mutate(() => data);
    });

    fireEvent.change(employeeDeleteInput, { target: { checked: true } });
    await waitFor(() => {
      expect(result.current.isError).toBe(false);
      expect(result.current.data).toBeDefined();
      expect(employeeDeleteInput.checked).toBeTruthy();
    });
    fireEvent.change(employeeDeleteInput, { target: { checked: false } });
  }, 12000);

  test.skip("View a datasheet", async () => {
    component();

    const { getAllByTitle } = screen;

    const viewBtn = await waitFor(() => getAllByTitle("viewBtn"));
    fireEvent.click(viewBtn[1]);
    //screen.debug(undefined, Infinity);
  });
});
