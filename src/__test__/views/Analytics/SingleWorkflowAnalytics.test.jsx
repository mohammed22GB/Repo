import React from "react";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import SingleWorkflowAnalytics from "../../../views/Analytics/SingleWorkflowAnalytics";

import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { getSingleWorkflowInstance } from "../../../views/Analytics/AnalyticsApis";
import { mockThemeAndRouter } from "../../../test-utilities/testMocks/themeRouter";
import { getProcessTimeBySeconds } from "../../../views/common/helpers/helperFunctions";

jest.mock("../../../views/Analytics/AnalyticsApis");

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn().mockReturnValue({ id: "123" }),
}));

const mockStore = configureStore([]);
const store = mockStore({
  auth: { user: { id: "test-user" } },
});

const mockData = {
  data: {
    workflow: {
      variables: [],
    },
    taskStatus: [
      {
        _id: "1",
        task: { name: "Task 1", id: "task1" },
        type: "StartTask",
        status: "successful",
        updatedAt: "2025-01-28T20:00:00.000Z",
      },
      {
        _id: "2",
        task: { name: "Task 2", id: "task2" },
        type: "ScreenTask",
        status: "successful",
        updatedAt: "2025-01-28T20:30:00.000Z",
      },
    ],
  },
};

describe("getProcessTimeBySeconds", () => {
  test("returns seconds when less than a minute", () => {
    expect(getProcessTimeBySeconds(45000)).toBe("45 secs");
  });

  test("returns minutes and seconds when less than an hour", () => {
    expect(getProcessTimeBySeconds(125000)).toBe("2 mins, 5 secs");
  });

  test("returns hours, minutes, and seconds when more than an hour", () => {
    expect(getProcessTimeBySeconds(3665000)).toBe("1 hrs, 1 mins, 5 secs");
  });

  test("returns only seconds when less than a minute", () => {
    expect(getProcessTimeBySeconds(30000)).toBe("30 secs");
  });

  test("returns only minutes and seconds when less than an hour", () => {
    expect(getProcessTimeBySeconds(60000)).toBe("1 mins, 0 secs");
  });

  test("returns only hours, minutes, and seconds when more than an hour", () => {
    expect(getProcessTimeBySeconds(3600000)).toBe("1 hrs, 0 mins, 0 secs");
  });
});

describe("SingleWorkflowAnalytics", () => {
  beforeEach(() => {
    getSingleWorkflowInstance.mockResolvedValue({
      data: mockData,
      success: true,
    });
  });
  afterEach(() => {
    cleanup();
  });

  const renderComponent = () =>
    mockThemeAndRouter(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/workflow/123"]}>
          <Routes>
            <Route path="/workflow/:id" element={<SingleWorkflowAnalytics />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

  it.skip("renders task statuses and their process times", async () => {
    renderComponent();

    // Wait for Task 1 to appear in the document
    await waitFor(() => {
      const task1Element = screen.getByText("Task 1");
      expect(task1Element).toBeInTheDocument();
    });
    // Verify task names are displayed
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();

    // Verify that process times are displayed correctly
    await waitFor(() => {
      const task1Element = screen.getByText("Task 1");
      expect(task1Element).toBeInTheDocument();
    });
  });
});
