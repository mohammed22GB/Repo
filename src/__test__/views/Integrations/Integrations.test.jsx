import {
  mockThemeAndRouter,
  fireEvent,
  waitFor,
  cleanup,
  screen,
} from "../../../test-utilities/testMocks/themeRouter";
import { Route } from "react-router-dom";
import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import Integrations from "../../../views/Integrations";
import { getIntegrationDataAPI } from "../../../views/Integrations/utils/integrationsAPIs";

//import IntegrationsRightPanel from "../components/IntegrationsRightPanel";
//import InitIntegrationPanel from "../components/IntegrationFlowPanels/InitIntegrationPanel";

// jest.mock("../../../common/util/userRoleEvaluation", () => {
//   const getUserRole = () => ["PlugAdmin"];

//   const tempPermissions = (roles) =>
//     roles?.includes("PlugAdmin") ? true : false;

//   const appPermissions = (roles = ["Admin"]) =>
//     roles?.includes("Admin") ? true : true;

//   const handleRoleActionAccess = () => true;
//   const handleRolePageAccess = () => true;

//   return {
//     getUserRole,
//     tempPermissions,
//     appPermissions,
//     handleRoleActionAccess,
//     handleRolePageAccess,
//   };
// });

// jest.mock(
//   "../components/IntegrationFlowPanels/InitIntegrationPanel",
//   () => (props) => {
//     const { changeIntegrationPage } = props;
//     const iList = [
//       {
//         name: "Gmail",
//         type: "Google Mail",
//         logo: "/static/media/restapi.a84dc8f19886a9a8c455.png",
//       },
//       {
//         name: "REST API",
//         type: "RestApiIntegration",
//         logo: "/static/media/restapi.a84dc8f19886a9a8c455.png",
//       },
//     ];

//     return (
//       <>
//         <h2>Create new</h2>
//         <div onClick={() => changeIntegrationPage(iList[1])} title={"iItem"}>
//           <img src={iList[1].logo} alt={iList[1].name} />
//           <div>{iList[1].name}</div>
//         </div>
//       </>
//     );
//   }
// );

describe.skip("<Integrations />", () => {
  afterEach(() => {
    cleanup();
  });

  const component = (option) => {
    return mockThemeAndRouter(
      <MemoryRouter initialEntries={["/integrations"]}>
        <Integrations />
      </MemoryRouter>,
      { ...option }
    );
  };

  test.skip("Integration components are present", async () => {
    component();

    // mockThemeAndRouter(
    //   <MainPageLayout
    //     headerTitle={"integrations"}
    //     pageTitle=""
    //     pageSubtitle="Create and manage your applications from this page."
    //     paging={null}
    //     appsControlMode={null}
    //     categories={null}
    //     isLoading={false}
    //     handleChange={() => jest.fn()}
    //     onAddNew={{
    //       fn: () => jest.fn(),
    //       tooltip: "Add new integration",
    //     }}
    //   >
    //     <div>children</div>
    //   </MainPageLayout>
    // );

    //console.log(document.title);
    const {
      getByText,
      getByTestId,
      getAllByText,
      getByPlaceholderText,
      getByTitle,
    } = screen;
    //screen.debug(undefined, Infinity);

    const searchBar = await waitFor(() => getByPlaceholderText("Search..."));
    expect(searchBar).toBeInTheDocument();
    const interfaceTitle = await waitFor(() => getAllByText("Integrations"));
    const createButton = await waitFor(() => getByTitle("Add new integration"));
    const createBtn = await waitFor(() => getByTestId("createButton"));
    const filterBy = await waitFor(() => getByText("Filter"));
    const sortBy = await waitFor(() => getByText("Sort by"));
    expect(interfaceTitle).toHaveLength(2);
    expect(createBtn).toBeInTheDocument();
    expect(createButton).toBeInTheDocument();
    expect(filterBy).toBeInTheDocument();
    expect(sortBy).toBeInTheDocument();
    expect(document.title).toBe("Integrations");
  });

  test.skip("Get integrations list", async () => {
    let testHistory, testLocation;
    mockThemeAndRouter(
      <MemoryRouter initialEntries={["/integrations"]}>
        <Integrations />
        <Route
          path="*"
          render={({ history, location }) => {
            testHistory = history;
            testLocation = location;
            return null;
          }}
        />
      </MemoryRouter>
    );
    const { getAllByTestId } = screen;
    await act(async () => {
      const data = await getIntegrationDataAPI();

      expect(data.data).toHaveLength(3);
    });
    //screen.debug(undefined, Infinity);
    const integrationsItem = await waitFor(() =>
      getAllByTestId("integrationsItem")
    );
    expect(integrationsItem).toHaveLength(2);
  });

  test.skip("Grouped integrations pop up", async () => {
    component();

    const { getByTitle, getAllByTestId } = screen;

    await act(async () => {
      await getIntegrationDataAPI();
    });
    const integrationsItem = await waitFor(() =>
      getAllByTestId("integrationsItem")
    );

    fireEvent.click(integrationsItem[0]);

    await waitFor(
      async () => {
        //screen.debug(undefined, Infinity);

        const groupedIntegrations = await waitFor(() =>
          getByTitle("groupedIntegrations")
        );
        expect(groupedIntegrations).toBeInTheDocument();
      },
      { timeout: 100 }
    );
    //expect(integrationsItem).toHaveLength(2);
  });

  test.skip("integrations list selection sidebar (create new)", async () => {
    component();

    const { getByText, getByTestId } = screen;
    //screen.debug(undefined, Infinity);
    const createBtn = await waitFor(() => getByTestId("createButton"));
    //expect(createBtn).toBeInTheDocument();

    fireEvent.click(createBtn);

    const newIntegrations = await waitFor(() => getByText("Create new"));
    expect(newIntegrations).toBeInTheDocument();
  });

  test.skip("Create new Rest APi integrations", async () => {
    component();

    const { getByText, getByTestId, getAllByText, getByTitle } = screen;
    //screen.debug(undefined, Infinity);
    const createBtn = await waitFor(() => getByTestId("createButton"));

    fireEvent.click(createBtn);

    //screen.debug(undefined, Infinity);
    const integrationItem = await waitFor(() => getByTitle("iItem"));
    expect(integrationItem).toBeInTheDocument();
    fireEvent.click(integrationItem);

    const integrationSidebar = await waitFor(() =>
      getByText("New REST API Integration")
    );
    expect(integrationSidebar).toBeInTheDocument();

    //Test on this to be continued later on
  });

  test.skip("Clicking of Integrations item and clicking of menu list item ", async () => {
    component();

    const { getAllByTestId, getByText, getByTestId, getByTitle } = screen;

    // await act(async () => {
    //   const data = await getIntegrationDataAPI();
    // });

    //screen.debug(undefined, Infinity);
    const integrationsItem = await waitFor(() =>
      getAllByTestId("integrationsItem")
    );
    fireEvent.click(integrationsItem[0]);

    const IntegrationGroupItem = await waitFor(() =>
      getAllByTestId("IntegrationGroupItem")
    );
    fireEvent.click(IntegrationGroupItem[0]);

    const editMenuItem = await waitFor(() => getByTitle("editBtn"));
    expect(editMenuItem).toBeInTheDocument();
    fireEvent.click(editMenuItem);

    const sidebarTitle = await waitFor(() => getByTitle("sidebarHeader"));
    expect(sidebarTitle).toBeInTheDocument();
  });

  test.skip("Updating an existing Integration item ", async () => {
    component();

    const { getAllByTestId, getByTitle, getByPlaceholderText, getByText } =
      screen;

    //screen.debug(undefined, Infinity);
    const integrationsItem = await waitFor(() =>
      getAllByTestId("integrationsItem")
    );

    fireEvent.click(integrationsItem[0]);

    const IntegrationGroupItem = await waitFor(() =>
      getAllByTestId("IntegrationGroupItem")
    );
    fireEvent.click(IntegrationGroupItem[0]);

    const editMenuItem = await waitFor(() => getByTitle("editBtn"));
    fireEvent.click(editMenuItem);

    const nameField = await waitFor(() => getByPlaceholderText("Enter here"));
    expect(nameField.value).toBe("g-dev-na-hv,,hvhj");

    fireEvent.change(nameField, {
      target: { value: "Rest API Name" },
    });
    const submitAPIBtn = await waitFor(() => getByTitle("submitBtn"));
    fireEvent.click(submitAPIBtn);
    const secondStepTitle = await waitFor(() => getByText("Endpoints"), {
      timeout: 400,
    });
    expect(secondStepTitle).toBeInTheDocument();
  }, 10000);
});
