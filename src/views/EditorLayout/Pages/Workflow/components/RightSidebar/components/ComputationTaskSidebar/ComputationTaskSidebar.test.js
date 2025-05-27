import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import * as reactRedux from "react-redux";
import ComputationTaskSidebar from "./index";
import { rRemoteUpdateCanvasElements } from "../../../../../../../../store/actions/properties";
import { mockThemeAndRouter } from "../../../../../../../../test-utilities/testMocks/themeRouter";
import MockProvider from "../../../../../../../../test-utilities/testMocks/reduxStore";
import { MemoryRouter } from "react-router";
import * as workflowFuncs from "../../../utils/workflowFuncs";

// Mock the useDispatch hook
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("../../../../../../../../store/actions/properties", () => ({
  rRemoteUpdateCanvasElements: jest.fn(),
}));

jest.mock("../../../utils/workflowFuncs", () => ({
  ...jest.requireActual("../../../utils/workflowFuncs"),
  isConnectedTo: jest.fn().mockReturnValue(false),
  globalSetTaskInfo: jest.fn(),
  getTaskVariables: jest.fn(),
}));

describe("ComputationTaskSidebar", () => {
  let storeData;

  beforeEach(() => {
    storeData = {
      workflows: {
        activeTask: {
          id: "task1",
          type: "ComputationTask",
        },
        workflowTasks: {
          task1: {
            id: "task1",
            type: "ComputationTask",
            name: "Computation Task",
            properties: {
              functions: [],
              hasDecision: false,
              decisionActions: [],
              name: "Computation Task",
              description: "This is a computation task",
            },
          },
          task2: {
            id: "task2",
            type: "StartTask",
            name: "Start Task",
            properties: {},
          },
          task3: {
            id: "task3",
            type: "EndTask",
            name: "End Task",
            properties: {},
          },
        },
        pos: "",
        workflowCanvas: [
          {
            source: "task1",
          },
        ],
      },
    };

    rRemoteUpdateCanvasElements.mockClear();

    jest.clearAllMocks();
    require("react-redux").useSelector.mockImplementation((callback) => {
      return callback({
        workflows: {
          variables: [{ id: "var1", info: { name: "Variable 1" } }],
          workflowTasks: storeData.workflowTasks,
          workflowCanvas: storeData.workflowCanvas,
        },
      });
    });
    // Mock window.confirm
    global.confirm = jest.fn();
  });

  const renderComputationTaskSidebarComponent = (
    props,
    updatedStoreData,
    options
  ) =>
    mockThemeAndRouter(
      <MockProvider storeData={updatedStoreData || storeData}>
        <MemoryRouter>
          <ComputationTaskSidebar {...props} />
        </MemoryRouter>
      </MockProvider>,
      { ...(options || {}) }
    );

  it("renders without crashing", () => {
    renderComputationTaskSidebarComponent(storeData);
    expect(
      screen.getByText(/ComputationTask information/i)
    ).toBeInTheDocument();
  });
  it("should call updateWorkflowCanvas when makeComputationDecision is called and links are present and user confirms", async () => {
    jest.spyOn(workflowFuncs, "getTaskVariables").mockReturnValue([]);
    jest
      .spyOn(reactRedux, "useDispatch")
      .mockImplementation(() => jest.fn((...args) => args[0]));

    const updatedStoreData = {
      ...storeData,
      workflows: {
        ...storeData.workflows,
        workflowTasks: {
          ...storeData.workflows.workflowTasks,
          task1: {
            ...storeData.workflows.workflowTasks.task1,
            properties: {
              ...storeData.workflows.workflowTasks.task1.properties,
              functions: [
                {
                  id: "function1",
                  name: "My Function",
                  functionType: "comparison",
                  dataType: "text",
                  lines: [
                    {
                      leftArgument: [],
                      rightArgument: [],
                      operator: "EQUALS",
                    },
                  ],
                  ifTrue: "trueVar",
                  ifFalse: "falseVar",
                },
              ],
              hasDecision: false,
            },
          },
        },
      },
    };

    global.confirm.mockReturnValue(true);
    renderComputationTaskSidebarComponent({}, updatedStoreData);
    const switchElement = screen.getByLabelText(/Use for decision/i);

    fireEvent.click(switchElement);

    await waitFor(() => {
      expect(global.confirm).toHaveBeenCalled();
      expect(rRemoteUpdateCanvasElements).toHaveBeenCalled();
    });
    expect(
      require("../../../utils/workflowFuncs").globalSetTaskInfo
    ).toHaveBeenCalled();
  });
  it("should call add function step", async () => {
    jest.spyOn(workflowFuncs, "getTaskVariables").mockReturnValue([]);
    renderComputationTaskSidebarComponent(storeData);

    const actionSection = screen.getByTestId("taskbar-action-section");
    expect(actionSection).toBeInTheDocument();
    fireEvent.click(actionSection);

    const addButton = screen.getByRole("button", {
      name: /Add function step/i,
    });
    fireEvent.click(addButton);

    const menu = screen.getByRole("menu");
    expect(menu).toBeInTheDocument();
    const comparisonMenuItem = screen.getByRole("menuitem", {
      name: "Comparison expressions",
    });
    expect(comparisonMenuItem).toBeVisible();
    fireEvent.click(comparisonMenuItem);
    await waitFor(() => {
      expect(screen.getByText(/Operation\*/i)).toBeInTheDocument();
      expect(
        require("../../../utils/workflowFuncs").globalSetTaskInfo
      ).toHaveBeenCalled();
    });
  });
  it("should call setTaskInfo with hasDecision", async () => {
    jest.spyOn(workflowFuncs, "getTaskVariables").mockReturnValue([]);

    global.confirm.mockReturnValue(true);
    renderComputationTaskSidebarComponent(
      {},
      {
        ...storeData,
        workflows: {
          ...storeData.workflows,
          workflowTasks: {
            ...storeData.workflows.workflowTasks,
            task1: {
              ...storeData.workflows.workflowTasks.task1,
              properties: {
                ...storeData.workflows.workflowTasks.task1.properties,
                functions: [
                  {
                    id: "function1",
                    name: "My Function",
                    functionType: "comparison",
                    dataType: "text",
                    lines: [],
                    ifTrue: "trueVar",
                    ifFalse: "falseVar",
                  },
                ],
                hasDecision: false,
              },
            },
          },
        },
      }
    );
    const switchElement = screen.getByLabelText(/Use for decision/i);

    fireEvent.click(switchElement);

    await waitFor(() => {
      expect(global.confirm).toHaveBeenCalled();
      expect(
        require("../../../utils/workflowFuncs").globalSetTaskInfo
      ).toHaveBeenCalledWith(
        expect.anything(),
        true,
        "hasDecision",
        undefined,
        {
          id: "task1",
          name: "Computation Task",
          properties: {
            decisionActions: [],
            description: "This is a computation task",
            functions: [
              {
                dataType: "text",
                functionType: "comparison",
                id: "function1",
                ifFalse: "falseVar",
                ifTrue: "trueVar",
                lines: [],
                name: "My Function",
              },
            ],
            hasDecision: false,
            name: "Computation Task",
          },
          type: "ComputationTask",
        },
        expect.anything(),
        [],
        expect.anything()
      );
    });
  });
  it("should add a new arithmetic function", async () => {
    jest.spyOn(workflowFuncs, "getTaskVariables").mockReturnValue([]);

    renderComputationTaskSidebarComponent(storeData);

    const actionSection = screen.getByTestId("taskbar-action-section");
    expect(actionSection).toBeInTheDocument();
    fireEvent.click(actionSection);

    const addButton = screen.getByRole("button", {
      name: /Add function step/i,
    });
    fireEvent.click(addButton);
    const menu = screen.getByRole("menu");
    const arithmeticMenuItem = screen.getByText("Arithmetic expression");
    expect(menu).toBeInTheDocument();
    fireEvent.click(arithmeticMenuItem);
    await waitFor(() => {
      expect(screen.getByText(/arithmetic/i)).toBeInTheDocument();
      expect(
        require("../../../utils/workflowFuncs").globalSetTaskInfo
      ).toHaveBeenCalled();
    });
  });
  it("should add a new nestedIf function", async () => {
    jest.spyOn(workflowFuncs, "getTaskVariables").mockReturnValue([]);

    renderComputationTaskSidebarComponent(storeData);

    const actionSection = screen.getByTestId("taskbar-action-section");
    expect(actionSection).toBeInTheDocument();
    fireEvent.click(actionSection);

    const addButton = screen.getByRole("button", {
      name: /Add function step/i,
    });
    fireEvent.click(addButton);
    const menu = screen.getByRole("menu");
    const nestedIfMenuItem = screen.getByText("Nested If expressions");
    expect(menu).toBeInTheDocument();
    fireEvent.click(nestedIfMenuItem);
    await waitFor(() => {
      expect(screen.getByText(/nestedIf/i)).toBeInTheDocument();
      expect(
        require("../../../utils/workflowFuncs").globalSetTaskInfo
      ).toHaveBeenCalled();
    });
  });
});
