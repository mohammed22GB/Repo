import DashboardPortal from "./";
import useCustomQuery from "../../common/utils/CustomQuery";

import { cleanup, waitFor } from "@testing-library/react";

import { mockProviders } from "../../../test-utilities/mockProviders";
import { getWorkflowInstances } from "../../Analytics/AnalyticsApis";
import { socket } from "../../../App";

jest.mock("socket.io-client", () => ({
  __esModule: true,
  ...jest.requireActual("socket.io-client"),
  default: jest.fn().mockReturnValue({
    on: jest.fn(),
    off: jest.fn(),
  }),
}));

jest.mock("../../Analytics/AnalyticsApis", () => ({
  ...jest.requireActual("../../Analytics/AnalyticsApis"),
  getWorkflowInstances: jest.fn(),
}));

jest.mock("../../common/utils/CustomQuery", () => jest.fn());

jest.mock(
  "../../SettingsLayout/Pages/SsoConfiguration/utils/ssoAccountsAPI",
  () => ({
    getAccountInfo: jest.fn(),
  })
);

describe("<DashboardPortal />", () => {
  beforeEach(() => {
    getWorkflowInstances.mockResolvedValue({
      success: true,
      data: {
        tasks: [],
      },
    });

    useCustomQuery.mockReturnValue({
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
      isLoading: false,
      isError: false,
    });
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  const component = (options) => {
    return mockProviders(<DashboardPortal isLookupField={true} />, {
      ...options,
      memoryOptions: {
        initialEntries: ["/portal/dashboard"],
      },
    });
  };

  it("should call fetchPendingTask on initial render", async () => {
    component();

    await waitFor(() => {
      expect(getWorkflowInstances).toHaveBeenCalledWith({
        page: 0,
        perPage: 10,
        filterLevel: "directreport",
        category: "All",
        statusVal: "pending",
      });
    });
  });

  it("should subscribe to socket events and handle task status updates", async () => {
    component();

    // Verify socket subscription
    expect(socket.on).toHaveBeenCalledWith(
      "task:status-updated",
      expect.any(Function)
    );

    // Get the callback function that was passed to socket.on
    const [, socketCallback] = socket.on.mock.calls.find(
      ([arg]) => arg === "task:status-updated"
    );

    // Simulate socket event
    socketCallback();

    // Verify fetchPendingTask was called again
    await waitFor(() => {
      expect(getWorkflowInstances).toHaveBeenCalledTimes(2);
    });
  });

  it("should handle workflow instances API error", async () => {
    getWorkflowInstances.mockResolvedValue({
      success: false,
      data: "Error getting screens",
    });

    component();

    await waitFor(() => {
      expect(getWorkflowInstances).toHaveBeenCalled();
      expect(getWorkflowInstances).toHaveBeenCalledWith({
        page: 0,
        perPage: 10,
        filterLevel: "directreport",
        category: "All",
        statusVal: "pending",
      });
    });
  });
});
