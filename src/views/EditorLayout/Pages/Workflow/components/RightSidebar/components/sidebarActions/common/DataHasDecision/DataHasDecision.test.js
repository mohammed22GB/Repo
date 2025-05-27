import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import DataHasDecision from "./index";
import { rRemoteUpdateCanvasElements } from "../../../../../../../../../../store/actions/properties";
import MockProvider from "../../../../../../../../../../test-utilities/testMocks/reduxStore";
import { MemoryRouter } from "react-router";
import { mockThemeAndRouter } from "../../../../../../../../../../test-utilities/testMocks/themeRouter";

// Mock the useDispatch hook
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => jest.fn(),
}));

jest.mock("../../../../../../../../../../store/actions/properties", () => ({
  rRemoteUpdateCanvasElements: jest.fn(),
}));

jest.mock("../SelectOnSteroids", () => {
  return jest.fn(() => () => <div>Mocked AnotherComponent</div>);
});

const mockStore = configureStore([]);

describe("DataHasDecision", () => {
  let storeData;
  const classes = {
    switchLabel: "switchLabel",
    sectionTitle: "sectionTitle",
    matchingFields: "matchingFields",
    sectionEntry: "sectionEntry",
    select: "select",
    selected: "selected",
    functionTrueFalse: "functionTrueFalse",
    decisionPrefix: "decisionPrefix",
  };

  const commonProps = {
    classes,
    hasDecision: false,
    updateData: jest.fn(),
    dataOperationId: "op1",
    aggregationFunction: "SUM",
    decisionCriterion: {},
    retrievedDataVariableName: "dataVar1",
    variables: [],
    activeTaskId: "task1",
    taskDecisionActions: [],
    taskHasDecision: false,
    workflowCanvas: [],
  };

  beforeEach(() => {
    storeData = mockStore({});
    rRemoteUpdateCanvasElements.mockClear();
    commonProps.updateData.mockClear();

    // Mock window.confirm
    global.confirm = jest.fn();
  });

  const renderDataHasDecisionComponent = (props, updatedStoreData, options) =>
    mockThemeAndRouter(
      <MockProvider storeData={updatedStoreData || storeData}>
        <MemoryRouter>
          <DataHasDecision {...props} />
        </MemoryRouter>
      </MockProvider>,
      { ...(options || {}) }
    );

  it("renders without crashing", () => {
    renderDataHasDecisionComponent(commonProps);
    expect(screen.getByText(/Use for decision/i)).toBeInTheDocument();
  });

  it("calls rRemoteUpdateCanvasElements when makeDataDecision is called and links are present and user confirms", async () => {
    const updatedProps = {
      ...commonProps,
      workflowCanvas: [{ source: "task1", target: "task2", id: "link1" }],
    };
    global.confirm.mockReturnValue(true);
    renderDataHasDecisionComponent(updatedProps);

    const switchElement = screen.getByRole("checkbox", {
      name: /Use for decision/i,
    });

    fireEvent.click(switchElement);

    await waitFor(() => {
      expect(global.confirm).toHaveBeenCalled();
      expect(rRemoteUpdateCanvasElements).toHaveBeenCalled();
    });
    expect(commonProps.updateData).toHaveBeenCalled();
  });

  it("does not call rRemoteUpdateCanvasElements when makeDataDecision is called and user cancels", async () => {
    const updatedProps = {
      ...commonProps,
      workflowCanvas: [{ source: "task1", target: "task2", id: "link1" }],
    };
    global.confirm.mockReturnValue(false);

    renderDataHasDecisionComponent(updatedProps);

    const switchElement = screen.getByRole("checkbox", {
      name: /Use for decision/i,
    });

    fireEvent.click(switchElement);

    await waitFor(() => {
      expect(global.confirm).toHaveBeenCalled();
      expect(rRemoteUpdateCanvasElements).not.toHaveBeenCalled();
    });

    expect(commonProps.updateData).not.toHaveBeenCalled();
  });

  it("does not call rRemoteUpdateCanvasElements when makeDataDecision is called and links are not present", async () => {
    renderDataHasDecisionComponent(commonProps);
    global.confirm.mockClear();
    rRemoteUpdateCanvasElements.mockClear();

    const switchElement = screen.getByRole("checkbox", {
      name: /Use for decision/i,
    });

    fireEvent.click(switchElement);

    await waitFor(() => {
      expect(global.confirm).not.toHaveBeenCalled();
      expect(rRemoteUpdateCanvasElements).not.toHaveBeenCalled();
    });
    expect(commonProps.updateData).toHaveBeenCalled();
  });

  it("calls updateData with correct parameters when _updateCriterion is called", async () => {
    const updatedProps = {
      ...commonProps,
      hasDecision: true,
      decisionCriterion: { operator: "IS_NULL" },
    };

    renderDataHasDecisionComponent(updatedProps);

    const selectElement = screen.getByRole("button", {
      name: "= null (is null/empty)",
    }); // assuming default value is none

    await waitFor(async () => {
      await userEvent.click(selectElement);
      const equalsOption = screen.getByRole("option", {
        name: "== (equals)",
      });
      await userEvent.click(equalsOption);

      expect(commonProps.updateData).toHaveBeenCalledWith({
        target: {
          name: "decisionCriterion",
          value: expect.objectContaining({ operator: "EQUALS" }),
        },
      });
    });
  });
  it("disables operators correctly based on aggregationFunction", async () => {
    const updatedProps = {
      ...commonProps,
      hasDecision: true,
      aggregationFunction: "NONE",
      decisionCriterion: { operator: "IS_NULL" },
    };
    renderDataHasDecisionComponent(updatedProps);
    const selectElement = screen.getByRole("button", {
      name: "= null (is null/empty)",
    });

    await waitFor(async () => {
      await userEvent.click(selectElement);
      const equalsOption = screen.getByRole("option", { name: "== (equals)" });
      const isNullOption = screen.getByRole("option", {
        name: "= null (is null/empty)",
      });

      expect(equalsOption).toHaveAttribute("aria-disabled", "true");
      expect(isNullOption).toBeInTheDocument();
    });
  });
  it("disables switch if taskHasDecision is true and hasDecision is false", async () => {
    const updatedProps = {
      ...commonProps,
      hasDecision: false,
      taskHasDecision: true,
    };
    renderDataHasDecisionComponent(updatedProps);

    const switchElement = screen.getByRole("checkbox", {
      name: /Use for decision/i,
    });

    expect(switchElement).toBeDisabled();
  });
});
