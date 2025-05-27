import * as reactRedux from "react-redux";
import { act } from "react-dom/test-utils";
import { renderHook } from "@testing-library/react-hooks";
import { rest } from "msw";
import { MemoryRouter } from "react-router-dom";
import {
  mockThemeAndRouter,
  fireEvent,
  waitFor,
  cleanup,
  queryWrapper,
  screen,
} from "../../test-utilities/testMocks/themeRouter";
import { server } from "../../setupTests";
import {
  getApps,
  createNewApp,
} from "../../test-utilities/testMocks/handlers/apps";
import useCustomMutation from "../../views/common/utils/CustomMutation";
import {
  getAppsList,
  getCategories,
} from "../../views/common/components/Query/AppsQuery/queryApp";
import {
  deleteApp,
  duplicateApps,
  updateApps,
  createApp,
} from "../../views/common/components/Mutation/Apps/AppsMutation";
import * as userRoleEvaluation from "../../views/common/utils/userRoleEvaluation";
import Apps from ".";
import MockProvider from "../../test-utilities/testMocks/reduxStore";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
}));
jest.mock("react-pdf", () => ({
  pdfjs: {
    GlobalWorkerOptions: { workerSrc: {} },
  },
  Document: () => () => <div>Document</div>,
  Page: () => () => <div>Page</div>,
  default: (...args) => mockFunc((...args) => ({})),
}));
jest.mock("pdfjs-dist/build/pdf.worker.entry", () => ({
  default: (...args) => mockFunc((...args) => ({})),
}));

jest.mock("../../views/common/utils/userRoleEvaluation", () => {
  const getUserRole = () => ["PlugAdmin"];

  const tempPermissions = (roles) =>
    roles?.includes("PlugAdmin") ? true : false;

  const appPermissions = (roles = ["Admin"]) =>
    roles?.includes("Admin") ? true : true;

  const handleRoleActionAccess = jest.fn(() => true);
  const handleRolePageAccess = jest.fn(() => true);

  return {
    ...jest.requireActual("../../views/common/utils/userRoleEvaluation"),
    getUserRole,
    tempPermissions,
    appPermissions,
    handleRoleActionAccess,
    handleRolePageAccess,
  };
});

jest.mock("./components/SingleAppItem", () => ({
  __esModule: true,
  default: () => <div data-testid="appItem">SINGLE APP ITEM</div>,
}));
jest.mock("./components/AppDetailsDialog", () => ({
  __esModule: true,
  default: () => <div data-testid="appItem">APP DETAILS DIALOG</div>,
}));

/* temporarily skipped due to eratic behavior */
describe.skip("<Apps />", () => {
  beforeEach(() => {
    jest
      .spyOn(userRoleEvaluation, "handleRoleActionAccess")
      .mockReturnValue(true);
  });
  afterEach(() => {
    cleanup();
  });

  const query = {
    queryKey: [
      {
        appSortParams: { updatedAt: "desc" },
        selectedCategory: "HR & Admin",
        page: 1,
        perPage: 10,
      },
    ],
  };

  const AppsComponent = (props, updatedStoreData, option) => {
    return mockThemeAndRouter(
      <MockProvider storeData={updatedStoreData || storeData}>
        <MemoryRouter initialEntries={["/apps"]}>
          <Apps />
        </MemoryRouter>
      </MockProvider>,
      { ...option }
    );
  };

  test("Apps components are present", async () => {
    AppsComponent();

    const {
      getByText,
      getByTestId,
      getAllByText,
      getByTitle,
      getByPlaceholderText,
    } = screen;

    await waitFor(() => {
      /* test display of "Apps & Templates" & "Apps" */
      expect(getAllByText(/Apps/i)).toHaveLength(2);
    });
    const createBtn = await waitFor(() => getByTestId("createButton"));

    const searchBar = await waitFor(() =>
      getByPlaceholderText("Search apps...")
    );
    expect(searchBar).toBeInTheDocument();

    expect(createBtn).toBeInTheDocument();
    expect(document.title).toBe("Apps");
  });

  //NOTE: Many subsequents tests  below depend on the API calls
  //      made in this test suite below so they won't pass if
  //      the test suite directly below is not run at least once.
  test("Get apps list and load more  btn", async () => {
    AppsComponent();

    const { getByText, getAllByTitle, getAllByTestId } = screen;

    await act(async () => {
      server.use(getApps);
      const appsData = await getAppsList(query);
      const categoriesData = await getCategories();

      expect(appsData.data.data).toHaveLength(2);
      expect(categoriesData.data.data).toHaveLength(2);
    });

    const appItem = await waitFor(() => getAllByTestId("appItem"));
    //Having a length of one is because of the "active" property check
    expect(appItem).toHaveLength(2);

    //LOAD MORE
    const loadMore = await waitFor(() => getByText("Load more apps"));
    expect(loadMore).toBeInTheDocument();
  });

  test.skip("Get apps list failure", async () => {
    AppsComponent();

    await act(async () => {
      server.use(
        rest.get(`${process.env.REACT_APP_ENDPOINT}/apps`, (req, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({
              message: "Request failed with status code 500",
            })
          );
        })
      );

      try {
        const appsData = await getAppsList(query);
      } catch (err) {
        console.log(err.message);
        expect(err.message).toEqual("Request failed with status code 500");
      }

      //   getAppsList(query).catch((err) =>
      //   expect(err).toEqual({ message: "Request failed with status code 500", status: 401 })
      // )
    });
  });

  test.skip("Show apps item renders necessary properties", async () => {
    AppsComponent();

    const { getAllByTestId, getByText, getByTitle, getAllByTitle } = screen;

    await act(async () => {
      await getAppsList(query);
      await getCategories();
    });
    // const editAppItem = await waitFor(() => getByTitle("editApp"));
    // expect(editAppItem).toBeInTheDocument();

    const duplicateAppItem = await waitFor(() =>
      getAllByTestId("duplicateIcon")
    );
    expect(duplicateAppItem[0]).toBeInTheDocument();
    const menuAppItem = await waitFor(() => getAllByTitle("menuIcon"));
    expect(menuAppItem[0]).toBeInTheDocument();
    const editAppItem = await waitFor(() => getAllByTitle("editApp"));
    expect(editAppItem[0]).toBeInTheDocument();
  });

  test.skip("show duplicate app popUp and duplicate details", async () => {
    AppsComponent();

    const { getAllByTestId, getByText, getByPlaceholderText } = screen;

    // await act(async () => {
    //   await getAppsList(query);
    //   await getCategories();
    // });
    // const editAppItem = await waitFor(() => getByTitle("editApp"));
    // expect(editAppItem).toBeInTheDocument();

    const duplicateAppIcon = await waitFor(() =>
      getAllByTestId("duplicateIcon")
    );
    fireEvent.click(duplicateAppIcon[0]);
    const popupTitle = await waitFor(() => getByText("Duplicate App"));
    expect(popupTitle).toBeInTheDocument();
    const nameField = await waitFor(() =>
      getByPlaceholderText("Enter name here")
    );
    expect(nameField.value).toContain("copy");
  });

  test.skip("Duplicate app on button click", async () => {
    AppsComponent();

    const { getByTestId, getByTitle, getAllByTestId } = screen;

    // await act(async () => {
    //   await getAppsList(query);
    //   await getCategories();
    // });

    const duplicateAppIcon = await waitFor(() =>
      getAllByTestId("duplicateIcon")
    );
    fireEvent.click(duplicateAppIcon[0]);

    const { result } = renderHook(
      () =>
        useCustomMutation({
          apiFunc: duplicateApps,
          onSuccess: jest.fn(),
          retries: 0,
        }),
      { wrapper: queryWrapper }
    );

    act(() => {
      result.current.mutate(() => ({
        app: "64be3973b1c14f4983a775e7",
        name: "CROSS XJ copy Duplicate",
        description: "sdsdcdse",
        category: "64a2880fd2e3ff52ee53994e",
        isPublic: false,
      }));
    });

    const submitBtn = await waitFor(() => getByTitle("submitBtn"));
    fireEvent.click(submitBtn);

    // await act(async () => {
    //   await waitFor(() => result.current.isSuccess);
    // });

    await waitFor(() => expect(result.current.isError).toBe(false));
    expect(result.current.data).toBeDefined();
  });

  test.skip("Show apps list menu popUp", async () => {
    AppsComponent();

    const { getByTestId, getByText, getAllByText, getByTitle, getAllByTitle } =
      screen;

    const menuAppItem = await waitFor(() => getAllByTitle("menuIcon"));
    fireEvent.click(menuAppItem[0]);
    const propertiesBtn = await waitFor(() => getAllByText("Properties"));
    const deleteBtn = await waitFor(() => getAllByText("Delete"));
    expect(propertiesBtn[0]).toBeInTheDocument();
    expect(deleteBtn[0]).toBeInTheDocument();
  });

  test.skip("Apps properties popUp", async () => {
    AppsComponent();

    const { getByTestId, getByText, getAllByText, getByTitle, getAllByTitle } =
      screen;

    // await act(async () => {
    //   await getAppsList(query);
    //   await getCategories();
    // });

    const menuAppItem = await waitFor(() => getAllByTitle("menuIcon"));
    fireEvent.click(menuAppItem[0]);
    const propertiesBtn = await waitFor(() => getAllByText("Properties"));
    fireEvent.click(propertiesBtn[0]);
    const popupTitle = await waitFor(() => getByText("App Details"));
    expect(popupTitle).toBeInTheDocument();
    const closeBtn = await waitFor(() => getByTitle("closeBtn"));
    expect(closeBtn).toBeInTheDocument();
    fireEvent.click(closeBtn);
  });

  test.skip("Edit Apps properties", async () => {
    AppsComponent();

    const {
      getByText,
      getByTitle,
      getAllByText,
      getByPlaceholderText,
      getAllByTitle,
    } = screen;

    const menuAppItem = await waitFor(() => getAllByTitle("menuIcon"));
    fireEvent.click(menuAppItem[0]);
    const propertiesBtn = await waitFor(() => getAllByText("Properties"));
    fireEvent.click(propertiesBtn[1]);
    const nameField = await waitFor(() =>
      getByPlaceholderText("Enter name here")
    );
    fireEvent.change(nameField, {
      target: { value: "Description for new app" },
    });

    const { result } = renderHook(
      () =>
        useCustomMutation({
          apiFunc: updateApps,
          onSuccess: jest.fn(),
          retries: 0,
        }),
      { wrapper: queryWrapper }
    );

    act(() => {
      result.current.mutate(() => ({
        name: "CROSS XJ",
        description: "New Descriptions",
        category: "64a2880fd2e3ff52ee53994e",
        isPublic: false,
      }));
    });

    const submitBtn = await waitFor(() => getByTitle("submitBtn"));
    fireEvent.click(submitBtn);

    await waitFor(() => expect(result.current.isError).toBe(false));
    expect(result.current.data).toBeDefined();
  }, 10000);

  test.skip("Copy app link", async () => {
    AppsComponent();

    const { getByText, getByTitle, getAllByTitle } = screen;

    const menuAppItem = await waitFor(() => getAllByTitle("menuIcon"));
    fireEvent.click(menuAppItem[0]);
    const CopyLink = await waitFor(() => getByText("Copy link"));
    expect(CopyLink).toBeInTheDocument();
    fireEvent.click(CopyLink);
  });

  test.skip("Show apps deletion popper", async () => {
    AppsComponent();

    const {
      getByPlaceholderText,
      getByText,
      getAllByText,
      getByTitle,
      getAllByTitle,
    } = screen;

    const menuAppItem = await waitFor(() => getAllByTitle("menuIcon"));
    fireEvent.click(menuAppItem[0]);
    const deletePopup = await waitFor(() => getAllByText("Delete"));
    fireEvent.click(deletePopup[0]);
    const confirmDel = await waitFor(() => getByPlaceholderText("delete"));
    expect(confirmDel).toBeInTheDocument();
  });

  test.skip("Deletion of an app", async () => {
    AppsComponent();

    const {
      getByPlaceholderText,
      getByText,
      getAllByText,
      getByTitle,
      getAllByTitle,
    } = screen;

    const menuAppItem = await waitFor(() => getAllByTitle("menuIcon"));
    fireEvent.click(menuAppItem[0]);
    const deletePopup = await waitFor(() => getAllByText("Delete"));
    fireEvent.click(deletePopup[0]);
    const confirmDel = await waitFor(() => getByPlaceholderText("delete"));

    fireEvent.change(confirmDel, {
      target: { value: "delete" },
    });

    const { result } = renderHook(
      () =>
        useCustomMutation({
          apiFunc: deleteApp,
          onSuccess: jest.fn(),
          retries: 0,
        }),
      { wrapper: queryWrapper }
    );

    act(() => {
      result.current.mutate("64be3973b1c14f4983a775e7");
    });

    const deleteBtn = await waitFor(() => getByTitle("deleteBtn"));
    fireEvent.click(deleteBtn);

    await waitFor(() => expect(result.current.isError).toBe(false));
    expect(result.current.data).toBeDefined();
  }, 10000);

  test("Create new app", async () => {
    AppsComponent();

    const {
      getByTestId,
      getByPlaceholderText,
      getAllByPlaceholderText,
      getByTitle,
    } = screen;

    const createBtn = await waitFor(() => getByTestId("createButton"));
    fireEvent.click(createBtn);

    const nameField = await waitFor(() =>
      getByPlaceholderText("Enter name here")
    );
    fireEvent.change(nameField, {
      target: { value: "The App's Name" },
    });
    const descriptionField = await waitFor(() =>
      getByPlaceholderText("Enter name here")
    );
    fireEvent.change(descriptionField, {
      target: { value: "The App's Description" },
    });

    const selectField = await waitFor(() =>
      getAllByPlaceholderText("Select from the options")
    );
    fireEvent.change(selectField[0], {
      target: { value: "64a2880fd2e3ff52ee53994e" },
    });
    fireEvent.change(selectField[1], {
      target: { value: "6408be0f7efbca662474adbb" },
    });
    fireEvent.change(selectField[2], { target: { value: true } });

    server.use(createNewApp);

    const { result } = renderHook(
      () =>
        useCustomMutation({
          apiFunc: createApp,
          onSuccess: jest.fn(),
          retries: 0,
        }),
      { wrapper: queryWrapper }
    );

    act(() => {
      result.current.mutate(() => ({
        name: "The Newest App",
        description: "A New App Description",
        category: "64a2880fd2e3ff52ee53994e",
        ownerGroup: "6408be0f7efbca662474adbb",
        isPublic: "true",
      }));
    });

    const submitBtn = await waitFor(() => getByTitle("submitBtn"));
    fireEvent.click(submitBtn);

    await waitFor(() => expect(result.current.isError).toBe(false));
    expect(result.current.data).toBeDefined();
  });

  describe("Import from file", () => {
    const storeData = {
      auth: { user: { roles: ["PlugAdmin"] } },
      appsReducer: {
        appsAndTemplatesData: {},
        selectedCategory: {},
        appSortParams: {},
        openAppDetailsDialogToken: {},
      },
      reducers: {},
      workflows: { activeTask: {}, variables: {} },
    };

    beforeEach(() => {
      const mockDispatch = jest.fn();
      reactRedux.useDispatch.mockReturnValue(mockDispatch);
    });

    test("renders button to import from file", async () => {
      AppsComponent(null, storeData);

      const { getByTestId, getByRole, getByAllByRole } = screen;

      const createBtns = await waitFor(() => getByAllByRole("button"));

      expect(createBtns).toHaveLength(4);
    });
  });
});
