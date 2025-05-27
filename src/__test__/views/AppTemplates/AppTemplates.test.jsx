import {
  mockThemeAndRouter,
  fireEvent,
  queryWrapper,
  waitFor,
  cleanup,
  screen,
} from "../../../test-utilities/testMocks/themeRouter";
import { act } from "react-dom/test-utils";
import { renderHook } from "@testing-library/react-hooks";
//import { getIntegrations } from "../../../test-utilities/testMocks/handlers/integrations";
import { AppTemplates } from "../../../views";
// import { getCategories } from "../../../components/Query/AppsQuery/queryApp";
import { server } from "../../../setupTests";
import { rest } from "msw";
import { MemoryRouter } from "react-router-dom";
import useCustomMutation from "../../../views/common/utils/CustomMutation";
import { getCategories } from "../../../test-utilities/testMocks/handlers/apps";
import {
  createAppFromTemplate,
  createTemplate,
  deleteTemplate,
  duplicateTemplates,
  updateTemplates,
} from "../../../views/common/components/Mutation/Templates/TemplateMutation";
import { getTemplates } from "../../../test-utilities/testMocks/handlers/appTemplates";

// jest.mock("../../../common/util/userRoleEvaluation", () => {
//   const getUserRole = () => ["PlugAdmin"];

//   const tempPermissions = (roles) =>
//     roles?.includes("PlugAdmin") ? true : false;

//   const handleRoleActionAccess = () => true;
//   const handleRolePageAccess = () => true;

//   return {
//     getUserRole,
//     tempPermissions,
//     handleRoleActionAccess,
//     handleRolePageAccess,
//   };
// });

describe.skip("<AppTemplates />", () => {
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

  const component = (option) => {
    return mockThemeAndRouter(
      <MemoryRouter initialEntries={["/app-templates"]}>
        <AppTemplates />
      </MemoryRouter>,
      { ...option }
    );
  };

  test.skip("Static elements are present", async () => {
    component();

    const { getByText, getByTestId, getAllByText, getByTitle } = screen;
    //screen.debug(undefined, Infinity);

    const sortBy = await waitFor(() => getByText("Sort by"));
    const AppsInterfaceTitle = await waitFor(() => getAllByText("Templates"));
    const createBtn = await waitFor(() => getByTestId("createButton"));
    expect(sortBy).toBeInTheDocument();
    expect(AppsInterfaceTitle).toHaveLength(2);
    expect(createBtn).toBeInTheDocument();
    expect(document.title).toBe("App Templates");
  });

  //NOTE: Many subsequents tests  below depend on the API calls
  //      made in this test suite below so they won't pass if
  //      the test suite directly below is not run at least once.
  test.skip("Get templates list and a load more btn", async () => {
    component();

    const { getByText, getAllByTitle, getByPlaceholderText } = screen;

    await act(async () => {
      //console.log(server);
      //server.use(getTemplateMocks);

      const templatesData = await getTemplates(query);
      const categoriesData = await getCategories();

      const searchBar = await waitFor(() => getByPlaceholderText("Search..."));
      expect(searchBar).toBeInTheDocument();

      expect(templatesData.data.data).toHaveLength(2);
      expect(categoriesData.data.data).toHaveLength(2);
    });
    const templateItem = await waitFor(() => getAllByTitle("templateItem"));
    expect(templateItem).toHaveLength(2);

    //LOAD MORE
    const loadMore = await waitFor(() => getByText("Load more templates"));
    expect(loadMore).toBeInTheDocument();
  });

  test.skip("Get templates list failure", async () => {
    component();

    const { getAllByTestId, getByText } = screen;

    await act(async () => {
      server.use(
        rest.get(
          `${process.env.REACT_APP_ENDPOINT}/templates`,
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
        const templatesData = await getTemplates(query);
      } catch (err) {
        console.log(err.response.status);
        expect(err.response.status).toEqual(500);
        expect(err.response.data.message).toEqual(
          "Request failed with status code 500"
        );
      }

      //   getTemplates(query).catch((err) =>
      //   expect(err).toEqual({ message: "Request failed with status code 500", status: 401 })
      // )
    });
  });

  test.skip("Show how many template items are present", async () => {
    component();

    const { getAllByTestId, getAllByTitle } = screen;

    const duplicateTemplateItem = await waitFor(() =>
      getAllByTestId("duplicateIcon")
    );
    expect(duplicateTemplateItem).toHaveLength(2);
    //expect(duplicateTemplateItem).toBeInTheDocument();
    const menuAppItem = await waitFor(() => getAllByTitle("menuIcon"));
    //expect(menuAppItem).toBeInTheDocument();
    expect(menuAppItem).toHaveLength(2);
    const editAppItem = await waitFor(() => getAllByTitle("editIcon"));
    expect(editAppItem).toHaveLength(2);
    //expect(editAppItem).toBeInTheDocument();
  });

  test.skip("show duplicate template popUp and its details", async () => {
    component();

    const { getAllByTestId, getByText, getByPlaceholderText } = screen;

    const duplicateTemplateItem = await waitFor(() =>
      getAllByTestId("duplicateIcon")
    );

    fireEvent.click(duplicateTemplateItem[0]);
    const popupTitle = await waitFor(() => getByText("Duplicate Template"));
    expect(popupTitle).toBeInTheDocument();
    const nameField = await waitFor(() =>
      getByPlaceholderText("Enter name here")
    );
    expect(nameField.value).toContain("copy");
  });

  test.skip("Duplicate app on button click", async () => {
    component();

    const { getAllByTestId, getByTitle, getAllByPlaceholderText } = screen;

    const duplicateTemplateItem = await waitFor(() =>
      getAllByTestId("duplicateIcon")
    );

    fireEvent.click(duplicateTemplateItem[1]);

    //This field has to selected because it is currently empty by default
    const selectField = await waitFor(() =>
      getAllByPlaceholderText("Select from the options")
    );
    expect(selectField[1]).toBeInTheDocument();
    fireEvent.change(selectField[1], { target: { value: true } });

    const { result } = renderHook(
      () =>
        useCustomMutation({
          apiFunc: duplicateTemplates,
          onSuccess: jest.fn(),
          retries: 0,
        }),
      { wrapper: queryWrapper }
    );

    act(() => {
      result.current.mutate(() => ({
        template: "64e5fb3e02ef258965301c04",
        name: "Timplenta 1 copy",
        description: "sdcasd",
        category: "64a2880fd2e3ff52ee53994e",
        isPublic: true,
      }));
    });

    const submitBtn = await waitFor(() => getByTitle("submitBtn"));
    fireEvent.click(submitBtn);

    await waitFor(() => expect(result.current.isError).toBe(false));
    expect(result.current.data).toBeDefined();
  }, 11000);

  test.skip("Show template list menu", async () => {
    component();

    const { getAllByText, getAllByTitle } = screen;

    const menuAppItem = await waitFor(() => getAllByTitle("menuIcon"));
    fireEvent.click(menuAppItem[1]);
    const propertiesBtn = await waitFor(() => getAllByText("Properties"));
    const deleteBtn = await waitFor(() => getAllByText("Delete"));
    expect(propertiesBtn).toHaveLength(2);
    expect(deleteBtn).toHaveLength(2);
  });

  test.skip("Template properties popUp", async () => {
    component();

    const { getByTestId, getByText, getAllByText, getAllByTitle, getByTitle } =
      screen;

    const menuAppItem = await waitFor(() => getAllByTitle("menuIcon"));
    fireEvent.click(menuAppItem[1]);
    const propertiesBtn = await waitFor(() => getAllByText("Properties"));
    fireEvent.click(propertiesBtn[1]);
    const popupTitle = await waitFor(() => getByText("Template Details"));
    expect(popupTitle).toBeInTheDocument();
    const closeBtn = await waitFor(() => getByTitle("closeBtn"));
    expect(closeBtn).toBeInTheDocument();
    fireEvent.click(closeBtn);
  });

  test.skip("Edit template properties", async () => {
    component();

    const {
      getAllByPlaceholderText,
      getByTitle,
      getAllByTitle,
      getAllByText,
      getByPlaceholderText,
    } = screen;

    const menuAppItem = await waitFor(() => getAllByTitle("menuIcon"));
    fireEvent.click(menuAppItem[1]);
    const propertiesBtn = await waitFor(() => getAllByText("Properties"));
    fireEvent.click(propertiesBtn[1]);
    const nameField = await waitFor(() =>
      getByPlaceholderText("Enter name here")
    );
    fireEvent.change(nameField, {
      target: { value: "Template's Name" },
    });

    const selectField = await waitFor(() =>
      getAllByPlaceholderText("Select from the options")
    );
    fireEvent.change(selectField[1], { target: { value: true } });

    const { result } = renderHook(
      () =>
        useCustomMutation({
          apiFunc: updateTemplates,
          onSuccess: jest.fn(),
          retries: 0,
        }),
      { wrapper: queryWrapper }
    );

    act(() => {
      result.current.mutate(() => ({
        name: "Timplenta 1",
        description: "Template's Description",
        category: "64a2880fd2e3ff52ee53994e",
        isPublic: "true",
      }));
    });

    const submitBtn = await waitFor(() => getByTitle("submitBtn"));
    fireEvent.click(submitBtn);

    await waitFor(() => expect(result.current.isError).toBe(false));
    expect(result.current.data).toBeDefined();
  }, 12000);

  test.skip("Show template deletion popper", async () => {
    component();

    const { getByPlaceholderText, getAllByText, getAllByTitle } = screen;

    const menuAppItem = await waitFor(() => getAllByTitle("menuIcon"));
    fireEvent.click(menuAppItem[0]);
    const deletePopup = await waitFor(() => getAllByText("Delete"));
    fireEvent.click(deletePopup[0]);
    const confirmDel = await waitFor(() => getByPlaceholderText("delete"));
    expect(confirmDel).toBeInTheDocument();
  });

  test.skip("Deletion of template", async () => {
    component();

    const { getByPlaceholderText, getAllByText, getByTitle, getAllByTitle } =
      screen;

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
          apiFunc: deleteTemplate,
          onSuccess: jest.fn(),
          retries: 0,
        }),
      { wrapper: queryWrapper }
    );

    act(() => {
      result.current.mutate("651f55a7550a2192fae83d4d");
    });

    const deleteBtn = await waitFor(() => getByTitle("deleteBtn"));
    fireEvent.click(deleteBtn);
    //console.log(result.current.data.data.data._id);

    await waitFor(() => expect(result.current.isError).toBe(false));
    expect(result.current.data).toBeDefined();
  }, 11000);

  test.skip("Create App from New Template", async () => {
    component();

    const { getAllByTestId, getByText, getAllByPlaceholderText, getByTitle } =
      screen;

    const createAppBtn = await waitFor(() => getByText("Create App"));
    expect(createAppBtn).toBeInTheDocument();
    fireEvent.click(createAppBtn);

    const selectField = await waitFor(() =>
      getAllByPlaceholderText("Select from the options")
    );
    fireEvent.change(selectField[1], { target: { value: true } });

    const { result } = renderHook(
      () =>
        useCustomMutation({
          apiFunc: createAppFromTemplate,
          onSuccess: jest.fn(),
          retries: 0,
        }),
      { wrapper: queryWrapper }
    );

    act(() => {
      result.current.mutate(() => ({
        templateId: "64e5fb3e02ef258965301c04",
        name: "Timplenta 1",
        description: "Template's Description",
        category: "64a2880fd2e3ff52ee53994e",
        isPublic: "false",
      }));
    });

    const submitBtn = await waitFor(() => getByTitle("submitBtn"));
    fireEvent.click(submitBtn);

    await waitFor(() => expect(result.current.isError).toBe(false));
    expect(result.current.data).toBeDefined();
  }, 10000);

  test.skip("Create new template", async () => {
    component();

    const {
      getAllByTestId,
      getByText,
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
      target: { value: "The Template's Name" },
    });
    const descriptionField = await waitFor(() =>
      getByPlaceholderText("Enter name here")
    );
    fireEvent.change(descriptionField, {
      target: { value: "The New Template's Description" },
    });

    const selectField = await waitFor(() =>
      getAllByPlaceholderText("Select from the options")
    );
    fireEvent.change(selectField[0], {
      target: { value: "64b65db8771c6bb33ee86fe1" },
    });
    fireEvent.change(selectField[1], { target: { value: true } });

    const { result } = renderHook(
      () =>
        useCustomMutation({
          apiFunc: createTemplate,
          onSuccess: jest.fn(),
          retries: 0,
        }),
      { wrapper: queryWrapper }
    );

    act(() => {
      result.current.mutate(() => ({
        name: "The Newest Template",
        description: "A New Template",
        category: "64b65db8771c6bb33ee86fe1",
        isPublic: "true",
      }));
    });

    const submitBtn = await waitFor(() => getByTitle("submitBtn"));
    fireEvent.click(submitBtn);

    await waitFor(() => expect(result.current.isError).toBe(false));
    expect(result.current.data).toBeDefined();
  });
});
