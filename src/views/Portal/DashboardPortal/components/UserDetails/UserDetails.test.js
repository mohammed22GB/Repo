import {
  mockThemeAndRouter,
  cleanup,
  screen,
} from "../../../../../test-utilities/testMocks/themeRouter";
import { MemoryRouter } from "react-router-dom";
import DashboardContainer from ".";

describe("<UserDetails />", () => {
  const mockData = {
    data: {
      data: [
        {
          id: 1,
          app: { name: "App1", category: { name: "Category1" } },
          user: { firstName: "John", lastName: "Doe" },
          createdAt: "2023-10-01T10:00:00Z",
          updatedAt: "2023-10-01T12:00:00Z",
          status: "completed",
        },
        {
          id: 2,
          app: { name: "App2", category: { name: "Category2" } },
          user: { firstName: "Jane", lastName: "Smith" },
          createdAt: "2023-10-02T11:00:00Z",
          updatedAt: "2023-10-02T13:00:00Z",
          status: "pending",
        },
      ],
      _meta: { pagination: { total_count: 2 } },
    },
  };

  afterEach(() => {
    cleanup();
  });

  let classes, taskData, isTaskLoading, accountInfo;

  beforeEach(() => {
    classes = {};
    accountInfo = {};
    taskData = [];
    isTaskLoading = false;
  });

  const component = (option) => {
    return mockThemeAndRouter(
      <MemoryRouter initialEntries={["/portal/dashboard"]}>
        <DashboardContainer
          classes={classes}
          accountInfo={accountInfo}
          taskData={taskData}
          isTaskLoading={isTaskLoading}
        />
      </MemoryRouter>,
      { ...option }
    );
  };

  test.skip("should toggle the filter popper open and closed when the filter button is clicked", async () => {
    component();

    const { getByText, getByTestId, getAllByText } = screen;

    expect(getByTestId("firstDropdown")).toBeInTheDocument();
    expect(getByTestId("secondDropdown")).toBeInTheDocument();
  });
  test.skip("should render the ComponentCard with Skeletons when isLoading is true", () => {
    classes = {
      componentWidth: "componentWidth",
      nameTitle: "nameTitle",
      approvalText: "approvalText",
      truncated: "truncated",
      userName: "userName",
    };

    taskData = [
      {
        app: {
          name: "App Name",
          account: { slug: "account-slug" },
          slug: "app-slug",
        },
        user: { firstName: "John", lastName: "Doe" },
        task: { name: "approval", id: "task-id" },
        taskStatus: { workflowInstance: "workflow-instance-id" },
        screensInfo: { slug: "screen-slug" },
      },
    ];

    component();

    const { getByText, queryByText } = screen;

    expect(getByText("Pending Tasks")).toBeInTheDocument();
    expect(queryByText("App Name")).not.toBeInTheDocument();
    expect(queryByText("John Doe")).not.toBeInTheDocument();
    expect(getByText("No pending task data found")).not.toBeInTheDocument();
  });
  test.skip("should render the ComponentCard with Body content when isLoading is false", () => {
    classes = {
      nameTitle: "nameTitle",
      approvalText: "approvalText",
      truncated: "truncated",
      userName: "userName",
    };

    taskData = [
      {
        app: {
          name: "App Name",
          account: { slug: "account-slug" },
          slug: "app-slug",
        },
        user: { firstName: "John", lastName: "Doe" },
        task: { name: "Task Name", id: "task-id" },
        taskStatus: {
          workflowInstance: "workflow-instance-id",
          task: "task-status-id",
        },
        screensInfo: { slug: "screen-slug" },
      },
    ];

    component();

    const { getByText, queryByText } = screen;

    expect(getByText("App Name")).toBeInTheDocument();
    expect(getByText("John Doe")).toBeInTheDocument();
    expect(getByText("Pending Tasks")).toBeInTheDocument();
  });
  test.skip("Should render SideElement component if provided", () => {
    classes = {
      componentWidth: "componentWidth",
      nameTitle: "nameTitle",
      approvalText: "approvalText",
      truncated: "truncated",
      userName: "userName",
    };
    taskData = [];
    isTaskLoading = false;

    component();

    const { getByText, queryByText } = screen;

    expect(wrapper.find(Link).exists()).toBe(true);

    expect(getByText("See all")).toBeInTheDocument();
  });
  test('should display "No data found" when the data is empty', () => {
    classes = {
      nameTitle: "nameTitle",
      approvalText: "approvalText",
      truncated: "truncated",
      userName: "userName",
    };

    component();

    expect(screen.getAllByText("No data found")).toHaveLength(3);
    expect(screen.getAllByText("No data found")[0]).toBeInTheDocument();
  });
  test("should render a link with correct URL in PendingTasks based on taskData content", () => {
    classes = {
      nameTitle: "nameTitle",
      approvalText: "approvalText",
      truncated: "truncated",
      userName: "userName",
    };

    taskData = {
      data: [
        {
          _id: "655c971ac7c1932233516c8b",
          status: "completed",
          active: true,
          deleted: false,
          app: {
            active: true,
            deleted: false,
            _id: "6547f297fff86f13935cb4e6",

            name: "Test App 2",
            category: {
              _id: "65469e1efff86f13935caee0",
              name: "New Category",
              id: "65469e1efff86f13935caee0",
            },
            slug: "test-app-2",
            id: "6547f297fff86f13935cb4e6",
          },
          account: "65434cdd2422247d541255fe",
          workflow: "6547f297fff86f13935cb4e8",
          task: null,
          createdAt: "2023-11-21T11:40:10.930Z",
          updatedAt: "2023-11-21T12:07:07.492Z",
          __v: 1,
          user: null,
          dynamicContents: {},
          metadata: {
            "c9bbd26a-d854-4a5a-93d5-929b2f8c0e32": "Eniola Agbaje",
            "4f954521-8642-4783-8c76-98b062815cdb": "eniolatesting@gmail.com",
            "53c2ddf4-d26a-4436-99e0-bc8a3de3d4d3": "64f9aed391656cd5c436247b",
            "34b7a864-6c85-477a-ba11-ac0abb5e79b1": "2023-11-21T12:07:03.320Z",
            "55611cb2-d5ea-4e7a-a58a-8a94027796db": "No",
            "3fd314f5-15f2-4ec0-96f6-7f44d69fed6d": "None",
          },
          variables: [],
          taskStatus: {
            _id: "655c976ac7c1932233516d00",
            active: true,
            deleted: false,
            app: "6547f297fff86f13935cb4e6",
            workflowInstance: "655c971ac7c1932233516c8b",
            account: "65434cdd2422247d541255fe",
            task: "65483b08fff86f13935cbc81",
            type: "ApprovalTask",
            output: "Email sent to user",
            status: "pending",
            assignedTo: [
              {
                assignedOn: 1700284771764,
                _id: "65483bdafff86f13935cbcd3",
                id: "65434cdc2422247d541255fb",
                name: "John  Wick",
                emailType: "User",
                active: false,
              },
              {
                assignedOn: 1700284771764,
                _id: "655ca117c7c1932233516dfc",
                id: "65589c36c7c1932233514b58",
                name: "Ali Wai",
                emailType: "User",
                active: true,
              },
            ],
            createdAt: "2023-11-21T11:41:30.251Z",
            updatedAt: "2023-11-21T12:22:47.065Z",
            __v: 2,
          },
        },
      ],
    };
    component();

    expect(screen.getByText("John Wick")).toBeInTheDocument();
    expect(screen.getByText("Test App 2")).toBeInTheDocument();
  });
});
