import { screen, fireEvent, within } from "@testing-library/react";
import * as reactRedux from "react-redux";
import configureStore from "redux-mock-store";
import { v4 } from "uuid";
import ExecutionVariables from "./index";
import { updateTaskVariables } from "../../../../../utils/workflowHelpers";
import MockProvider from "../../../../../../../../../test-utilities/testMocks/reduxStore";
import { MemoryRouter } from "react-router";
import { mockThemeAndRouter } from "../../../../../../../../../test-utilities/testMocks/themeRouter";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

// Mock dependencies
jest.mock("../../../../../utils/workflowHelpers", () => ({
  updateTaskVariables: jest.fn(),
}));

const mockStore = configureStore([]);

describe("ExecutionVariables", () => {
  let store;
  let mockSetTaskInfo;
  let mockActiveTask;
  let mockVariables;
  let classes = {
    switchLabel: "switchLabelMock",
    sectionTitle: "sectionTitleMock",
  };
  let props = {};

  beforeEach(() => {
    mockSetTaskInfo = jest.fn();
    mockActiveTask = {
      id: "task-1",
      name: "Task Name",
      taskId: "task_id",
      executorVariablesConfig: {},
      properties: {},
    };

    mockVariables = [
      {
        id: "var-1",
        info: {
          group: "EXECUTOR",
          parent: "task_id",
          matching: { valueSourceInput: "name" },
          name: "Name",
          dataType: "text",
        },
      },
      {
        id: "var-2",
        info: {
          group: "EXECUTOR",
          parent: "task_id",
          matching: { valueSourceInput: "email" },
          name: "Email",
          dataType: "email",
        },
      },
      {
        id: "var-3",
        info: {
          group: "EXECUTOR",
          parent: "task_id",
          matching: { valueSourceInput: "date" },
          name: "Date",
          dataType: "date",
        },
      },
      {
        id: "var-4",
        info: {
          group: "SOME_OTHER_GROUP",
          parent: "task_id",
        },
      },
      {
        id: "var-5",
        info: {
          group: "EXECUTOR",
          parent: "some_other_task_id",
        },
      },
    ];

    props = {
      setTaskInfo: mockSetTaskInfo,
      activeTask: mockActiveTask,
      variables: mockVariables,
      classes,
    };

    store = mockStore({});
    jest.clearAllMocks();
    v4.mockReturnValue("unique-mock-key"); // Mock v4 to return a predictable value
  });

  const ExecutionVariablesComponent = (props, updatedStoreData, options) =>
    mockThemeAndRouter(
      <MockProvider storeData={updatedStoreData}>
        <MemoryRouter>
          <ExecutionVariables {...props} />
        </MemoryRouter>
      </MockProvider>,
      { ...(options || {}) }
    );

  it("should render without errors", () => {
    ExecutionVariablesComponent({
      mockSetTaskInfo,
      mockActiveTask,
      mockVariables,
      classes,
    });
    expect(screen.getByText("Save execution variable")).toBeInTheDocument();
  });

  it("should render the switch with correct default value", () => {
    ExecutionVariablesComponent(props);

    const switchElement = screen.getByRole("checkbox");
    expect(switchElement).not.toBeChecked();
  });

  it("should call setTaskInfo when the switch is toggled", () => {
    ExecutionVariablesComponent(props);

    const switchElement = screen.getByRole("checkbox");
    fireEvent.click(switchElement);
    expect(mockSetTaskInfo).toHaveBeenCalledWith(
      expect.anything(),
      "executorVariablesConfig.active"
    );
  });

  it("should render the correct executor checkboxes based on variables", () => {
    ExecutionVariablesComponent(props);

    expect(
      screen.getByText(`Exec. name - [${mockActiveTask.name}]`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Exec. email - [${mockActiveTask.name}]`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Exec. time - [${mockActiveTask.name}]`)
    ).toBeInTheDocument();
  });

  it("should update task variables when checkbox is toggled", async () => {
    jest
      .spyOn(reactRedux, "useDispatch")
      .mockImplementation(() => jest.fn((...args) => args[0]));

    ExecutionVariablesComponent(props);

    const nameCheckbox = screen.getByLabelText(
      `Exec. time - [${mockActiveTask.name}]`
    );

    fireEvent.click(nameCheckbox);
    expect(updateTaskVariables).toHaveBeenCalled();
  });

  it("should create executorVariablesConfig if saveExecutorVariables is true and executorVariablesConfig.upgradedOldVersion is false", () => {
    const testProps = {
      ...props,
      activeTask: {
        ...mockActiveTask,
        executorVariablesConfig: {
          upgradedOldVersion: false,
        },
        properties: { saveExecutorVariables: true },
      },
    };

    ExecutionVariablesComponent(testProps);

    expect(mockSetTaskInfo).toHaveBeenCalledWith(
      expect.objectContaining({
        "executorVariablesConfig.active": true,
        "executorVariablesConfig.upgradedOldVersion": true,
      }),
      "executorVariablesConfig",
      true,
      "refreshTask"
    );
  });

  it("should not call setTaskInfo if saveExecutorVariables and executorVariablesConfig are already set", () => {
    const testProps = {
      ...props,
      activeTask: {
        ...mockActiveTask,
        properties: { saveExecutorVariables: true },
        executorVariablesConfig: { active: true },
      },
    };

    ExecutionVariablesComponent(testProps);
    expect(mockSetTaskInfo).not.toHaveBeenCalledWith(
      expect.objectContaining({
        "executorVariablesConfig.active": true,
        "executorVariablesConfig.upgradedOldVersion": true,
      }),
      "executorVariablesConfig",
      true,
      "refreshTask"
    );
  });

  it("should toggle on checkbox", () => {
    const testProps = {
      ...props,
      activeTask: {
        ...mockActiveTask,
        properties: { saveExecutorVariables: true },
        executorVariablesConfig: { active: true },
      },
    };

    ExecutionVariablesComponent(testProps);

    const checkboxesGroup = screen.getByTestId(
      "execution-variables-checkboxes"
    );
    const checkBoxesGroupWithin = within(checkboxesGroup);

    const nameCheckboxes = checkBoxesGroupWithin.getAllByRole("checkbox");

    expect(nameCheckboxes).toHaveLength(3);

    const nameCheckbox = nameCheckboxes[0];
    const emailCheckbox = nameCheckboxes[1];
    const timeCheckbox = nameCheckboxes[2];

    expect(nameCheckbox).not.toBeChecked();
    expect(emailCheckbox).not.toBeChecked();
    expect(timeCheckbox).not.toBeChecked();

    // Check that when we check the checkbox it toggles to checked
    fireEvent.click(nameCheckbox);
    expect(nameCheckbox).toBeChecked();

    fireEvent.click(emailCheckbox);
    expect(emailCheckbox).toBeChecked();

    fireEvent.click(timeCheckbox);
    expect(timeCheckbox).toBeChecked();
  });
});
