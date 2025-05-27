import ViewRecords from "./ViewRecords";
import {
  mockThemeAndRouter,
  fireEvent,
  cleanup,
  waitFor,
  screen,
} from "../../../test-utilities/testMocks/themeRouter";
import { MemoryRouter } from "react-router-dom";
import { server } from "../../../setupTests";
import { act } from "react-dom/test-utils";
import { getRecords } from "../../../test-utilities/testMocks/handlers/records";
import { getWorkflowInstances } from "../../../views/Analytics/AnalyticsApis";

describe.skip("<ViewRecords />", () => {
  afterEach(() => {
    cleanup();
  });

  jest.mock("../../../views/common/utils/userRoleEvaluation", () => {
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

  const component = (option) => {
    return mockThemeAndRouter(
      <MemoryRouter initialEntries={["/portal/records"]}>
        <ViewRecords />
      </MemoryRouter>,
      { ...option }
    );
  };

  test.skip("should toggle the filter popper open and closed when the filter button is clicked", async () => {
    component();

    const { getByText, getByTestId, getAllByText } = screen;

    expect(getAllByText("Records").length).toBeGreaterThan(0);

    const filterButton = getByText("Filter");
    const sortButton = getByText("Sort by");
    fireEvent.click(filterButton);

    const generalTxt = await waitFor(() => getByText("HR & Admin"));

    expect(generalTxt).toBeInTheDocument();

    fireEvent.click(filterButton);

    expect(generalTxt).not.toBeInTheDocument();

    fireEvent.click(sortButton);
    const undoSortTxt = await waitFor(() => getByText("Undo sort"));

    expect(undoSortTxt).toBeInTheDocument();

    fireEvent.click(sortButton);

    expect(undoSortTxt).not.toBeInTheDocument();
  });

  test.skip("should render the table with the correct number of rows", () => {
    component();

    const tableRows = screen.getAllByRole("row");
    // One header row and one data row
    expect(tableRows.length).toBeGreaterThan(1);
  });

  test.skip("Should update the selected option in SplitButton when a menu item is clicked", async () => {
    component();

    const { getByTitle, getAllByTitle } = screen;
    const toggleButton = getByTitle("arrow_down");
    const menuButton = await waitFor(() => getByTitle("menu_btn"));

    expect(menuButton).toBeInTheDocument();
  });

  test.skip("Should render the FullWidthTabs with the correct initial active tab", () => {
    component();

    const { getByRole, getByText } = screen;
    const activeTab = getByRole("tab", { selected: true });
    expect(activeTab).toHaveTextContent("All");
  });

  test.skip("Should switch to the correct tab content when a tab is clicked in FullWidthTabs", () => {
    component();

    const { getByText, getByRole, getByTestId } = screen;

    fireEvent.click(getByRole("tab", { name: /Departmental/i }));
    expect(getByText("Departmental")).toBeInTheDocument();
    expect(getByTestId("department")).toBeInTheDocument();

    fireEvent.click(getByRole("tab", { name: /All/i }));

    expect(getByText("Initiator")).toBeInTheDocument();
    //screen.debug(undefined, Infinity);

    fireEvent.click(getByRole("tab", { name: /Assigned/i }));

    expect(getByText("Assigned")).toBeInTheDocument();

    expect(getByTestId("directreport")).toBeInTheDocument();

    fireEvent.click(getByRole("tab", { name: /Personal/i }));

    expect(getByText("Personal")).toBeInTheDocument();
    expect(getByTestId("own")).toBeInTheDocument();
  });

  test.skip("Should fetch the list of workflow instances", async () => {
    component();

    const { getByText, getByRole } = screen;

    await act(async () => {
      server.use(getRecords);

      const recordsData = await getWorkflowInstances({
        page: 1,
        perPage: 10,
      });
      //const categoriesData = await getCategories();

      expect(recordsData.data.data).toHaveLength(3);
      //expect(categoriesData.data.data).toHaveLength(2);
    });
  });
});
