import React from "react";
import moment from "moment";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { useLocation } from "react-router-dom";
import AccountDetails from "./index";
import * as administrationAPIs from "../utils/administrationAPIs";
import * as billingSubscriptionAPIs from "../../SettingsLayout/Pages/BillingSubscription/utils/billingSubscriptionAPIs";
import { successToastify } from "../../common/utils/Toastify";
import * as useCustomQuery from "../../common/utils/CustomQuery";
import { mockThemeAndRouter } from "../../../test-utilities/testMocks/themeRouter";

// Mock dependencies
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
}));
jest.mock("../utils/administrationAPIs", () => {
  return {
    ...jest.requireActual("../utils/administrationAPIs"),
    getOrganizationDetails: jest.fn(),
  };
});
jest.mock(
  "../../SettingsLayout/Pages/BillingSubscription/utils/billingSubscriptionAPIs"
);
jest.mock("../../common/utils/Toastify");
jest.mock("react-spinner-timer", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-spinner">Mock Spinner</div>,
}));
jest.mock("../../common/components/AppLayout/MainPageLayout", () => ({
  __esModule: true,
  default: ({ children, isLoading }) => (
    <div data-testid="mock-main-page-layout">
      {isLoading ? <div data-testid="loading">Loading...</div> : children}
    </div>
  ),
}));
jest.mock("../components/UpdateSubscriptionDialog", () => ({
  __esModule: true,
  default: ({ closeModal, subscriptionData, saveData, holdData }) => {
    if (!subscriptionData._id && !subscriptionData.id) {
      subscriptionData.metrics = [
        {
          metricName: "apps",
          totalUnits: 10,
        },
      ];
    }
    return (
      <div data-testid="mock-update-subscription-dialog">
        <button onClick={closeModal}>Close</button>
        <button onClick={() => saveData(subscriptionData)}>Save</button>
        <button
          onClick={() =>
            holdData({ ...subscriptionData, tier: "Updated Tier" })
          }
        >
          Hold
        </button>
      </div>
    );
  },
}));

const mockOrgDetails = {
  _id: "org123",
  name: "Test Org",
  createdAt: "2023-02-01T14:22:36.636Z",
  email: "test@org.com",
  phone: "1234567890",
  industry: "Tech",
  country: "USA",
  noOfEmployee: 100,
  sessions: 60,
  totalUsers: [{ total: 50 }],
  totalApps: [{ total: 25 }],
  integrations: ["integration1", "integration2"],
  login: "2023-10-27",
};

const mockSubscriptionData = {
  id: "sub123",
  tier: "Basic",
  status: "ACTIVE",
  invoice: "inv123",
  amount: 1000,
  createdAt: "2023-09-01T14:22:36.636Z",
  expiryDate: "2024-09-01",
  metrics: [
    { metricName: "users", totalUnits: 100, unitsUsed: 50 },
    { metricName: "apps", totalUnits: 10, unitsUsed: 5 },
  ],
};

const mockEmptySubscriptionData = {
  _meta: { success: true },
  data: { activeSubscription: { account: null } },
};

const mockFullSubscriptionData = {
  _meta: { success: true },
  data: {
    activeSubscription: { ...mockSubscriptionData, account: "someAccount" },
  },
};

const mockOrgDetailsResponse = {
  _meta: { success: true },
  data: [mockOrgDetails],
};

const renderAccountDetailsComponent = (props, updatedStoreData, options) =>
  mockThemeAndRouter(
    <MemoryRouter>
      <AccountDetails {...props} />
    </MemoryRouter>,
    { ...(options || {}) }
  );

describe("AccountDetails", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    administrationAPIs.getOrganizationDetails.mockResolvedValue(
      mockOrgDetailsResponse
    );
    billingSubscriptionAPIs.getBillingSubscriptionAPI.mockResolvedValue(
      mockEmptySubscriptionData
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", async () => {
    useLocation.mockReturnValue({ state: { _id: "org123" } });
    renderAccountDetailsComponent();

    await waitFor(() =>
      expect(screen.getByTestId("mock-main-page-layout")).toBeInTheDocument()
    );
  });

  it("fetches and displays organization details", async () => {
    useLocation.mockReturnValue({ state: { _id: "org123" } });
    renderAccountDetailsComponent();

    await waitFor(() => {
      expect(administrationAPIs.getOrganizationDetails).toHaveBeenCalled();
      expect(screen.getAllByText("Test Org").length).toBe(2);

      expect(
        screen.getByText(
          moment(mockOrgDetails.createdAt).format("YYYY-MM-DD | HH:mm")
        )
      ).toBeInTheDocument();
      expect(screen.getByText("test@org.com")).toBeInTheDocument();
      expect(screen.getByText("1234567890")).toBeInTheDocument();
      expect(screen.getByText("Tech")).toBeInTheDocument();
      expect(screen.getByText("USA")).toBeInTheDocument();
      expect(screen.getByText("100")).toBeInTheDocument();
      expect(screen.getByText("60")).toBeInTheDocument();
      expect(screen.getByText("50")).toBeInTheDocument();
      expect(screen.getAllByText("25").length).toBe(2);
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("2023-10-27")).toBeInTheDocument();
    });
  });

  it("displays loading state", async () => {
    useLocation.mockReturnValue({ state: { _id: "org123" } });
    jest
      .spyOn(useCustomQuery, "default")
      .mockReturnValue({ isLoading: true, isFetching: false });

    renderAccountDetailsComponent({ _id: "org123" });

    await waitFor(() =>
      expect(screen.getByTestId("loading")).toBeInTheDocument()
    );
  });

  it("fetches and displays subscription data", async () => {
    billingSubscriptionAPIs.getBillingSubscriptionAPI.mockResolvedValue(
      mockFullSubscriptionData
    );
    useLocation.mockReturnValue({ state: { _id: "org123" } });
    renderAccountDetailsComponent();

    await waitFor(() => expect(screen.getByText("Basic")).toBeInTheDocument());
    expect(screen.getByText("active")).toBeInTheDocument();
    expect(screen.getByText("inv123")).toBeInTheDocument();
    expect(screen.getByText("1000")).toBeInTheDocument();
    expect(
      screen.getByText(
        moment(mockSubscriptionData.createdAt).format("YYYY-MM-DD | HH:mm")
      )
    ).toBeInTheDocument();
    expect(screen.getByText("2024-09-01")).toBeInTheDocument();
    expect(screen.getByText("Service name")).toBeInTheDocument();
    expect(screen.getByText("Total units")).toBeInTheDocument();
    expect(screen.getByText("Units used")).toBeInTheDocument();
    expect(screen.getByText("Usage")).toBeInTheDocument();
    expect(screen.getAllByText("users").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("apps").length).toBeGreaterThanOrEqual(1);
  });

  it("displays no subscription message", async () => {
    useLocation.mockReturnValue({ state: { _id: "org123" } });
    renderAccountDetailsComponent();

    await waitFor(() => expect(screen.getByText("(None)")).toBeInTheDocument());
  });

  it("opens and closes the update subscription dialog", async () => {
    billingSubscriptionAPIs.getBillingSubscriptionAPI.mockResolvedValue(
      mockFullSubscriptionData
    );
    useLocation.mockReturnValue({ state: { _id: "org123" } });
    renderAccountDetailsComponent();

    await waitFor(() => expect(screen.getByText("Update")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Update"));
    await waitFor(() =>
      expect(
        screen.getByTestId("mock-update-subscription-dialog")
      ).toBeInTheDocument()
    );
    fireEvent.click(screen.getByText("Close"));
    await waitFor(() =>
      expect(
        screen.queryByTestId("mock-update-subscription-dialog")
      ).not.toBeInTheDocument()
    );
  });

  it("creates a new subscription", async () => {
    billingSubscriptionAPIs.newBillingSubscriptionAPI.mockResolvedValue({
      _meta: { success: true, message: "Subscription created" },
    });
    useLocation.mockReturnValue({ state: { _id: "org123" } });
    renderAccountDetailsComponent();

    await waitFor(() => expect(screen.getByText("Create")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Create"));
    await waitFor(() =>
      expect(
        screen.getByTestId("mock-update-subscription-dialog")
      ).toBeInTheDocument()
    );
    fireEvent.click(screen.getByText("Save"));
    await waitFor(() =>
      expect(successToastify).toHaveBeenCalledWith("Subscription created")
    );
    expect(
      billingSubscriptionAPIs.newBillingSubscriptionAPI
    ).toHaveBeenCalled();
  });

  it("updates an existing subscription", async () => {
    billingSubscriptionAPIs.getBillingSubscriptionAPI.mockResolvedValue(
      mockFullSubscriptionData
    );
    billingSubscriptionAPIs.updateBillingSubscriptionAPI.mockResolvedValue({
      _meta: { success: true, message: "Subscription updated" },
    });
    useLocation.mockReturnValue({ state: { _id: "org123" } });
    renderAccountDetailsComponent();

    await waitFor(() => expect(screen.getByText("Update")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Update"));
    await waitFor(() =>
      expect(
        screen.getByTestId("mock-update-subscription-dialog")
      ).toBeInTheDocument()
    );
    fireEvent.click(screen.getByText("Save"));
    await waitFor(() =>
      expect(successToastify).toHaveBeenCalledWith("Subscription updated")
    );
    expect(
      billingSubscriptionAPIs.updateBillingSubscriptionAPI
    ).toHaveBeenCalled();
  });

  it("updates subscription data when hold is clicked", async () => {
    billingSubscriptionAPIs.getBillingSubscriptionAPI.mockResolvedValue(
      mockFullSubscriptionData
    );
    useLocation.mockReturnValue({ state: { _id: "org123" } });
    renderAccountDetailsComponent();

    await waitFor(() => expect(screen.getByText("Update")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Update"));
    await waitFor(() =>
      expect(
        screen.getByTestId("mock-update-subscription-dialog")
      ).toBeInTheDocument()
    );
    fireEvent.click(screen.getByText("Hold"));
    await waitFor(() =>
      expect(screen.getByText("Updated Tier")).toBeInTheDocument()
    );
  });

  it("renders no record when isLap is false and no data", async () => {
    jest
      .spyOn(useCustomQuery, "default")
      .mockReturnValue({ isLoading: false, isFetching: false });
    billingSubscriptionAPIs.getBillingSubscriptionAPI.mockResolvedValue(
      mockFullSubscriptionData
    );
    useLocation.mockReturnValue({ state: { _id: "org123" } });
    renderAccountDetailsComponent();

    await waitFor(() => expect(screen.getByText("Update")).toBeInTheDocument());
    await waitFor(() =>
      expect(
        screen.queryByText("No organisations available yet.")
      ).not.toBeInTheDocument()
    );
  });
});
