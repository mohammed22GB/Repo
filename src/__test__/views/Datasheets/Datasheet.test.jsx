import {
  mockThemeAndRouter,
  //,
  waitFor,
  cleanup,
  screen,
  fireEvent,
  queryWrapper,
} from "../../../test-utilities/testMocks/themeRouter";
import { MemoryRouter } from "react-router-dom";
import { server } from "../../../setupTests";
import { act } from "react-dom/test-utils";
import { renderHook } from "@testing-library/react-hooks";
import { getEditDatasheetPermissions } from "../../../test-utilities/testMocks/handlers/datasheet/permissions";
// import {
//   delDataSheetColumn,
//   updateColumnData,
//   updateDatasheet,
// } from "../../../components/Mutation/Datasheets/datasheetMutation";
import useCustomMutation from "../../../views/common/utils/CustomMutation";
import {
  updateColumnData,
  updateDatasheet,
  delDataSheetColumn,
} from "../../../views/common/components/Mutation/Datasheets/datasheetMutation";
import Datasheet from "../../../views/Datasheets/Pages/Datasheet";

// jest.mock("../../../common/util/userRoleEvaluation", () => {
//   const getUserRole = () => ["PlugAdmin"];
//   const roles = "PlugAdmin";

//   const handleRoleActionAccess = () => true;
//   const handleRolePageAccess = () => true;

//   return { getUserRole, handleRoleActionAccess, handleRolePageAccess };
// });

describe.skip("<Datasheet />", () => {
  beforeAll(() => {
    waitFor(() => {
      server.use(getEditDatasheetPermissions);
    });
  });
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
      <MemoryRouter initialEntries={["/datasheets/:id"]}>
        <Datasheet />
      </MemoryRouter>,
      { ...option }
    );
  };

  test.skip("Static elements are present", async () => {
    component();

    const { getByText, getByTestId, getByPlaceholderText, getAllByText } =
      screen;

    //screen.debug(undefined, Infinity);
    await waitFor(() => {
      //expect(getByText("Sort by")).toBeInTheDocument();
      expect(getAllByText("Datasheets")).toHaveLength(2);
      expect(getByTestId("createButton")).toBeInTheDocument();
      expect(getByPlaceholderText(/Search/i)).toBeInTheDocument();
      //expect(document.title).toBe("Datasheets");
    });
  });

  test.skip("Column menu dropdown", async () => {
    component();

    const { getByText, getAllByTitle } = screen;

    await waitFor(
      () => {
        //screen.debug(undefined, Infinity);
        const menuIcon = getAllByTitle("Menu");
        expect(menuIcon).toHaveLength(2);
        expect(
          document.querySelectorAll(".MuiDataGrid-columnHeader")
        ).toHaveLength(3);
        act(() => {
          fireEvent.click(menuIcon[1]);
        });
        expect(getByText("Show columns")).toBeInTheDocument();
      },
      { timeOut: 50 }
    );
  });

  test.skip("Edit Column Properties", async () => {
    component();

    const {
      getByText,
      getAllByTitle,
      getByTitle,
      getAllByPlaceholderText,
      getByPlaceholderText,
    } = screen;

    //edit column sidebar on datasheet is not prefilled

    await waitFor(
      () => {
        const menuIcon = getAllByTitle("Menu");
        fireEvent.click(menuIcon[1]);
      },
      { timeOut: 50 }
    );

    fireEvent.click(getByText("Edit column"));
    fireEvent.click(getByTitle("closeBtn"));
    fireEvent.click(getByText("Edit column"));
    const inputField = getAllByPlaceholderText("Enter name here");
    const defaultInputField = getByPlaceholderText(
      "Enter default value for this column"
    );
    expect(inputField).toHaveLength(5);
    fireEvent.change(inputField[0], { target: { value: "Email Column" } });
    fireEvent.change(inputField[1], { target: { value: "email" } });
    fireEvent.change(inputField[2], { target: { value: true } });
    fireEvent.change(inputField[3], { target: { value: false } });
    fireEvent.change(defaultInputField, { target: { value: "user@user.com" } });
    fireEvent.change(inputField[4], { target: { value: 1 } });

    const { result } = renderHook(
      () =>
        useCustomMutation({
          apiFunc: updateColumnData,
          onSuccess: jest.fn(),
          retries: 0,
        }),
      { wrapper: queryWrapper }
    );

    act(() => {
      result.current.mutate(() => ({
        datasheetId: "622622992bb1b71cac6f88b6",
        newColumn: {
          name: "Email",
          dataType: "email",
          isUnque: true,
          hasNull: true,
          defaultValue: "",
          order: "0",
        },
      }));
    });

    fireEvent.click(getByText("Save Column"));
    // await waitFor(() => {
    //    console.log("LJSLFJGS====FLDJFL", server);
    //    expect(server.request).toHaveLength(1);
    // });
    await waitFor(() => {
      expect(result.current.isError).toBe(false);
      expect(result.current.data).toBeDefined();
    });
  }, 12000);

  test.skip("Delete datasheet Column", async () => {
    component();

    const { getByText, getAllByTitle } = screen;

    //edit column sidebar on datasheet is not prefilled

    await waitFor(
      () => {
        const menuIcon = getAllByTitle("Menu");
        fireEvent.click(menuIcon[1]);
      },
      { timeOut: 50 }
    );

    fireEvent.click(getByText("Show columns"));
    fireEvent.click(getByText("Sort by ASC"));
    fireEvent.click(getByText("Delete column"));
    fireEvent.click(getByText("Cancel"));
    fireEvent.click(getByText("Delete column"));

    const { result } = renderHook(
      () =>
        useCustomMutation({
          apiFunc: delDataSheetColumn,
          onSuccess: jest.fn(),
          retries: 0,
        }),
      { wrapper: queryWrapper }
    );

    act(() => {
      result.current.mutate(() => ({
        datasheetId: "622622992bb1b71cac6f88b6",
        columnId: "622622992bb1b71cac6f88ba",
      }));
    });

    fireEvent.click(getByText("Delete!"));
    // await waitFor(() => {
    //    console.log("LJSLFJGS====FLDJFL", server);
    //    expect(server.request).toHaveLength(1);
    // });
    await waitFor(() => {
      expect(result.current.isError).toBe(false);
      expect(result.current.data).toBeDefined();
    });
  }, 12000);

  test.skip("Create datasheet Column", async () => {
    component();

    const {
      getByText,
      getAllByTitle,
      getByTitle,
      getByTestId,
      getAllByPlaceholderText,
      getByPlaceholderText,
    } = screen;

    //edit column sidebar on datasheet is not prefilled

    fireEvent.click(getByTestId("createButton"));
    fireEvent.click(getByText("Add column"));
    fireEvent.click(getByTitle("addColumnBtn"));

    const inputField = getAllByPlaceholderText("Enter name here");
    const defaultInputField = getByPlaceholderText(
      "Enter default value for this column"
    );
    fireEvent.change(inputField[0], { target: { value: "New Column" } });
    fireEvent.change(inputField[1], { target: { value: "text" } });
    fireEvent.change(inputField[2], { target: { value: false } });
    fireEvent.change(inputField[3], { target: { value: true } });
    fireEvent.change(defaultInputField, { target: { value: "user name" } });
    fireEvent.change(inputField[4], { target: { value: 1 } });
    fireEvent.click(getByText("Clear"));
    fireEvent.change(inputField[0], { target: { value: "New Column" } });
    fireEvent.change(inputField[1], { target: { value: "text" } });
    fireEvent.change(inputField[2], { target: { value: false } });
    fireEvent.change(inputField[3], { target: { value: true } });
    fireEvent.change(defaultInputField, { target: { value: "user name" } });
    fireEvent.change(inputField[4], { target: { value: 1 } });

    const { result } = renderHook(
      () =>
        useCustomMutation({
          apiFunc: updateDatasheet,
          onSuccess: jest.fn(),
          retries: 0,
        }),
      { wrapper: queryWrapper }
    );

    act(() => {
      result.current.mutate(() => ({
        id: "622622992bb1b71cac6f88b6",
        columns: [
          {
            isHidden: false,
            isDefault: false,
            hasNull: false,
            isUnique: false,
            _id: "622622992bb1b71cac6f88ba",
            name: "Email",
            id: "d585d633-0e64-4a01-8a8d-2de4597f6245",
          },
          {
            id: "5c6c273a-510b-49ea-b20e-618d427f074c",
            name: "New Col",
            dataType: "text",
            isUnque: false,
            hasNull: true,
            defaultValue: "Other Name",
          },
        ],
      }));
    });

    fireEvent.click(getByTitle("addColumnBtn"));
    await waitFor(() => {
      expect(result.current.isError).toBe(false);
      expect(result.current.data).toBeDefined();
    });
  }, 12000);

  test.skip("Create datasheet Row", async () => {
    component();

    const {
      getByText,
      getAllByRole,
      getByTitle,
      getAllByTitle,
      getByTestId,
      getAllByPlaceholderText,
      getByPlaceholderText,
    } = screen;

    // await waitFor(() => {
    //   screen.debug(undefined, Infinity);
    //   const inputs = getAllByTitle("input");

    //   console.log(inputs.length);
    // });

    //edit column sidebar on datasheet is not prefilled

    fireEvent.click(getByTestId("createButton"));
    fireEvent.click(getByText("Add data row"));
    fireEvent.click(getByTitle("addRowBtn"));

    // await waitFor(
    //   () => {
    //     //screen.debug(undefined, Infinity);

    //     console.log(inputs.length);
    //     const inputField = getByPlaceholderText("Enter Email here");
    //     fireEvent.change(inputField, {
    //       target: { value: "newuser@email.com" },
    //     });
    //   },
    //   { timeOut: 100 }
    // );
    const { result } = renderHook(
      () =>
        useCustomMutation({
          apiFunc: updateDatasheet,
          onSuccess: jest.fn(),
          retries: 0,
        }),
      { wrapper: queryWrapper }
    );

    act(() => {
      result.current.mutate(() => ({
        data: [
          {
            "b16819bb-8a25-4668-a10b-9e8a35699c5e": "Sample Name",
            created: new Date(),
            id: "07731b7d-6a71-4974-8d5e-7aff9affec48",
          },
          {
            "b16819bb-8a25-4668-a10b-9e8a35699c5e": "Chidinma Artist",
            created: new Date(),
            "802d1734-5442-451a-a9e9-8ba8f471cdb8": "sdasd@sda.dcs",
            id: "0b1d77e3-01b6-4c31-b106-36e6eaf5a64c",
          },
        ],
      }));
    });

    fireEvent.click(getByTitle("addRowBtn"));
    await waitFor(() => {
      expect(result.current.isError).toBe(false);
      expect(result.current.data).toBeDefined();
    });
  }, 12000);
});

//Create New Row
//Toggle Group Permissions
