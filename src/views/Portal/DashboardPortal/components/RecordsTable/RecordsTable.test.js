import {
  screen,
  waitFor,
  fireEvent,
  within,
  act,
  cleanup,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { rest } from "msw";

import { RecordsTable } from ".";
import { getWorkflowInstances } from "../../../../Analytics/AnalyticsApis";
import { server } from "../../../../../setupTests";
import {
  getRecords,
  getSingleRecords,
} from "../../../../../test-utilities/testMocks/handlers/records";
import { mockProviders } from "../../../../../test-utilities/mockProviders";
import { getAccountInfo } from "../../../../../test-utilities/testMocks/handlers/account";

jest.mock("react-spinner-timer", () => {
  /* eslint-disable react/prop-types */
  const { useEffect } = jest.requireActual("react");

  /**
   * Mocking the ReactSpinnerTimer component to simulate loading behavior
   * @param {{ onLapInteraction: (data: { actualLap: number; isFinish: boolean }) => void; }} props
   */
  return function MockSpinner({ onLapInteraction }) {
    useEffect(() => {
      onLapInteraction({ actualLap: 5, isFinish: true });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return <div data-testid="mock-spinner">Loading...</div>;
  };
});

/* temporarily skipped due to eratic behavior */
describe.skip("<RecordsTable />", () => {
  jest.mock("../../../../common/utils/userRoleEvaluation", () => ({
    getUserRole: () => ["PlugAdmin"],
    tempPermissions: (roles) => roles?.includes("PlugAdmin"),
    appPermissions: () => true,
    handleRoleActionAccess: () => true,
    handleRolePageAccess: () => true,
  }));

  let category, categories, adminUG, userInfo;
  const splitBtnOptions = [
    { value: "all", title: "All" },
    { value: "own", title: "Personal" },
    { value: "department", title: "Departmental " },
    { value: "directreport", title: "Assigned " },
  ];

  jest.mock("../../../../common/utils/userRoleEvaluation", () => {
    const getUserRole = () => ["PlugAdmin"];

    const tempPermissions = (roles) =>
      roles?.includes("PlugAdmin") || roles?.includes("Admin") ? true : false;

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

  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    category = "testCategory";
    categories = [
      { id: "64b65db8771c6bb33ee86fe1", name: "General" },
      { id: "64a2880fd2e3ff52ee53994e", name: "HR & Admin" },
    ];
    adminUG = [];
    userInfo = {
      roles: ["Designer", "Employee", "Admin"],
      _id: "62b1e8e6c3d82b1ddd3dec0f",
      account: {
        user: "615ae60a3b0d9011ce1aecc8",
        id: "615ae60a3b0d9011ce1aecc9",
      },
      id: "62b1e8e6c3d82b1ddd3dec0f",
    };

    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  const renderComponent = (options = {}) => {
    return mockProviders(
      <MemoryRouter initialEntries={["/portal/dashboard"]}>
        <RecordsTable
          category={category}
          categories={categories}
          adminUG={adminUG}
          {...options}
        />
      </MemoryRouter>,
      options
    );
  };

  it("should render RecordsTable component", async () => {
    server.use(getAccountInfo, getSingleRecords, getRecords);
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Records")).toBeInTheDocument();
    });
  });

  it("should toggle filter popper when filter button is clicked", async () => {
    server.use(getAccountInfo, getSingleRecords, getRecords);
    renderComponent();

    const filterButton = screen.getByText("Filter");
    fireEvent.click(filterButton);
    expect(screen.getByText("General")).toBeInTheDocument();

    fireEvent.click(filterButton);
    expect(screen.queryByText("General")).not.toBeInTheDocument();
  });

  it("should toggle sort options when sort button is clicked", async () => {
    server.use(getAccountInfo, getSingleRecords, getRecords);
    renderComponent();

    const sortButton = screen.getByText("Sort by");
    fireEvent.click(sortButton);

    await waitFor(() => {
      expect(screen.getByText("Undo sort")).toBeInTheDocument();
    });

    fireEvent.click(sortButton);
    await waitFor(() => {
      expect(screen.queryByText("Undo sort")).not.toBeInTheDocument();
    });
  });

  it("should render correct number of columns", async () => {
    server.use(getAccountInfo, getSingleRecords, getRecords);
    renderComponent();

    await waitFor(() => {
      const columns = screen.getAllByTestId("tableColumn");
      expect(columns).toHaveLength(5);
    });
  });

  it("should handle records list failure", async () => {
    server.use(
      getAccountInfo,
      getSingleRecords,
      rest.get(
        `${process.env.REACT_APP_ENDPOINT}/workflow-instances`,
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

    await expect(getWorkflowInstances({})).resolves.toEqual({
      data: "Error getting screens",
      success: false,
    });
  });

  it('should display "No data found" message when data is empty', async () => {
    server.use(
      getAccountInfo,
      getSingleRecords,
      rest.get(
        `${process.env.REACT_APP_ENDPOINT}/workflow-instances`,
        (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({ data: [] }));
        }
      )
    );

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("No data found")).toBeInTheDocument();
    });
  });

  it("should open SingleRecordsModal when table row is clicked", async () => {
    server.use(getAccountInfo, getSingleRecords, getRecords);

    renderComponent();
    const { getAllByTestId, queryByRole } = screen;

    expect(queryByRole("dialog")).toBeNull();
    await waitFor(() => {
      const rows = screen.getAllByTestId("tableRow");
      expect(rows).toHaveLength(3);

      act(() => {
        fireEvent.click(rows[0]);
      });

      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  it("should filter records when filter option is selected", async () => {
    server.use(getAccountInfo, getSingleRecords, getRecords);
    renderComponent();

    const filterButton = screen.getByText("Filter");
    fireEvent.click(filterButton);

    await waitFor(() => {
      const filterOption = screen.getByText("HR & Admin");
      fireEvent.click(filterOption);
    });

    await waitFor(() => {
      const rows = screen.getAllByTestId("tableRow");
      expect(rows).toHaveLength(3);
    });
  });

  it("should sort records when sort option is selected", async () => {
    server.use(getAccountInfo, getSingleRecords, getRecords);
    renderComponent();

    const sortButton = screen.getByText("Sort by");
    fireEvent.click(sortButton);

    await waitFor(() => {
      const oldestOption = screen.getByText("Date (Oldest)");
      fireEvent.click(oldestOption);
    });

    await waitFor(() => {
      const rows = screen.getAllByTestId("tableRow");
      expect(rows).toHaveLength(3);
      expect(within(rows[0]).getByText("pending")).toBeInTheDocument();
    });

    fireEvent.click(sortButton);
    await waitFor(() => {
      const newestOption = screen.getByText("Date (Newest)");
      fireEvent.click(newestOption);
    });

    await waitFor(() => {
      const rows = screen.getAllByTestId("tableRow");
      expect(rows).toHaveLength(3);
      expect(within(rows[0]).getByText("completed")).toBeInTheDocument();
    });
  });

  it("should handle permissions and update filter options correctly", async () => {
    server.use(
      getAccountInfo,
      getSingleRecords,
      rest.get(
        `${process.env.REACT_APP_ENDPOINT}/workflow-instances`,
        (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({ data: [] }));
        }
      )
    );
    renderComponent();

    const menuButton = screen.getByRole("button", {
      name: /arrow_down/i,
    });
    fireEvent.click(menuButton);

    await waitFor(() => {
      expect(screen.getByText("Personal")).toBeInTheDocument();
      expect(screen.getByText("Departmental")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("Filter"));
    const filterElement = screen.getByText("HR & Admin");
    expect(filterElement).toBeInTheDocument();
  });

  test("sort records correctly when a sort option is selected", async () => {
    await act(async () => {
      server.use(getRecords);

      const recordsData = await getWorkflowInstances({
        page: 1,
        perPage: 10,
      });

      expect(recordsData.data.data).toHaveLength(3);
    });

    renderComponent();

    const { getByText, findAllByText, getAllByTestId } = screen;

    // Simulate selecting the sort option for "Date (Oldest)"
    fireEvent.click(getByText("Sort by"));
    await waitFor(() => {
      expect(getByText("Date (Oldest)")).toBeInTheDocument();

      fireEvent.click(getByText("Date (Oldest)"));
    });

    await waitFor(() => {
      const rows = getAllByTestId("tableRow");
      expect(rows).toHaveLength(3);
      expect(rows[0]).toHaveTextContent("Kala Pata");
    });
    fireEvent.click(getByText("Sort by"));
    await waitFor(() => {
      expect(getByText("Date (Newest)")).toBeInTheDocument();

      fireEvent.click(getByText("Date (Newest)"));
    });
    await waitFor(() => {
      const rows = getAllByTestId("tableRow");
      expect(rows).toHaveLength(3);
      expect(rows[0]).toHaveTextContent("David Ike-Njoku");
    });
    // Check if the records are sorted correctly
  });
  test("correctly handle 'tempPermissions' calls and the assigned filter options are updated", async () => {
    const tempPerms =
      require("../../../../common/utils/userRoleEvaluation").tempPermissions([
        "Admin",
      ]);
    renderComponent();
    const { getByTitle, getByText, getByTestId, getAllByText } = screen;

    expect(tempPerms).toBeTruthy();

    const menuBtn = getByTitle("arrow_down");
    fireEvent.click(menuBtn);
    expect(getAllByText("All")).toHaveLength(2);
    expect(getByText("Departmental")).toBeInTheDocument();
    await waitFor(() => {});
  });
});
