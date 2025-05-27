import {
  mockThemeAndRouter,
  cleanup,
  screen,
  waitFor,
  fireEvent,
  act,
} from "../../../../test-utilities/testMocks/themeRouter";
import { MemoryRouter } from "react-router-dom";
import { server } from "../../../../setupTests";
import { rest } from "msw";
import Appendage from "./Appendage";

describe("<Appendage />", () => {
  afterEach(() => {
    cleanup();
  });

  let app,
    taskName,
    history,
    onSubmit,
    onChange,
    decisions,
    taskRunning,
    userInputs,
    error,
    detachMode;

  beforeEach(() => {
    app = {};
    taskName = "";
    history = [];
    onSubmit = jest.fn();
    onChange = jest.fn();
    decisions = [];
    taskRunning = false;
    userInputs = {
      mappedValues: {},
      tableProp: { tableRows: [], tableHead: "", tableAggregates: [] },
    };
    error = "";
    detachMode = false;
  });

  const component = (option) => {
    return mockThemeAndRouter(
      <MemoryRouter initialEntries={["/approval"]}>
        <Appendage
          app={app}
          taskName={taskName}
          history={history}
          onSubmit={onSubmit}
          onChange={onChange}
          decisions={decisions}
          taskRunning={taskRunning}
          userInputs={userInputs}
          error={error}
          detachMode={detachMode}
        />
      </MemoryRouter>,
      { ...option }
    );
  };

  test("render an error message when the error prop is provided", async () => {
    error = "This is a test error message...";
    component();

    const { getByText, getByTestId, getAllByText, findByText } = screen;

    expect(await screen.findByText(`Error: ${error}`)).toBeInTheDocument();
  });
  test("render the Header component when detachMode is true", async () => {
    app = { name: "Test App" };
    taskName = "Test Task";
    detachMode = true;
    component();

    const { queryByText } = screen;

    expect(queryByText("Test App (Approval Overview)")).not.toBeInTheDocument();
  });
  test("render the screen details with their mappedValues and labels", async () => {
    userInputs = {
      mappedValues: {
        Initiator: [
          {
            approval: {
              metaDataTitle: ["Initiator (name)"],
              screenName: "Initiator",
              label: "Initiator (name)",
              name: "John Wick",
            },
            approvalValue: "John Wick",
          },
        ],
        "Screen 1": [
          {
            approvalValue: "one 1",
            approval: {
              screenName: "Screen 1",
              label: "name",
              metaDataTitle: ["name"],
              reuseName: "",
            },
          },
        ],
        "Reusable Screens": [
          {
            approvalValue: "two 1",
            approval: {
              screenName: "Screen 1",
              label: "staffid",
              metaDataTitle: ["staffid (R2)"],
              reuseName: "Reusable Screens",
            },
          },
        ],
        "Screen 2": [
          {
            approvalValue: "Oner 2",
            approval: {
              screenName: "Screen 2",
              label: "screen2Inp",
              metaDataTitle: ["screen2Inp"],
              reuseName: "",
            },
          },
        ],
      },
      tableProp: {
        tableRows: [{ name: "Row 1", values: ["Value 1"] }],
        tableHead: "Test Table",
        tableAggregates: [],
      },
    };

    app = { name: "Test App" };
    taskName = "Test Task";
    detachMode = true;
    component();

    const { getByText } = screen;

    expect(getByText("John Wick")).toBeInTheDocument();
    expect(getByText("Initiator (name):")).toBeInTheDocument();
    expect(getByText("staffid (R2):")).toBeInTheDocument();
    expect(getByText("Screen 2")).toBeInTheDocument();
  });
  test("display 'No information to display' when mappedValues and tableRows are empty", async () => {
    component();
    expect(
      await screen.findByText("No information to display")
    ).toBeInTheDocument();
  });
  test("display the table headers and rows", async () => {
    userInputs = {
      mappedValues: {},
      tableProp: {
        tableRows: [{ name: "Row 1", values: ["Value 1"] }],
        tableHead: "Test Table",
        tableAggregates: [],
      },
    };

    component();

    const tableHeader = screen.getByText("Test Table");
    expect(screen.getByText("Value 1")).toBeInTheDocument();
    expect(tableHeader).toBeInTheDocument();
  });
  test("display the correct number of decision options based on the decisions prop", async () => {
    decisions = [
      { _id: "1", label: "Approve", nextTask: "task1" },
      { _id: "2", label: "Reject", nextTask: "task2" },
      { _id: "3", label: "Review", nextTask: "task3" },
    ];

    component();

    const decisionOptions = screen.getAllByRole("checkbox");
    expect(decisionOptions).toHaveLength(decisions.length);
  });
  test("disable the submit button when taskRunning is true", async () => {
    taskRunning = true;
    component();

    const submitButton = screen.getByRole("button", { name: /submitting.../i });
    expect(submitButton).toBeDisabled();
  });
  test("update the comment state when the textarea value changes", async () => {
    component();

    const textarea = screen.getByPlaceholderText("Enter your comments here...");

    fireEvent.change(textarea, {
      target: { value: "New comment" },
    });

    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
    });
  });
  test("call onChange with the correct values when a decision is selected", async () => {
    decisions = [
      { _id: "1", label: "Approve", nextTask: "task1" },
      { _id: "2", label: "Reject", nextTask: "task2" },
    ];
    component();

    const approveCheckbox = screen.getByLabelText("Approve");
    await fireEvent.click(approveCheckbox);

    expect(onChange).toHaveBeenCalledWith({
      value: "Approve",
      name: "decision",
    });
    expect(onChange).toHaveBeenCalledWith({
      value: "task1",
      name: "nextTask",
    });
  });
  test("render approval history only for 'User' comments when detachMode is false", async () => {
    history = [
      {
        updatedAt: "2023-10-01T10:00:00Z",
        user: { firstName: "John", lastName: "Doe" },
        decision: "Approved",
        comment: "Looks good",
        commentBy: "User",
      },
      {
        updatedAt: "2023-10-02T11:00:00Z",
        user: { firstName: "Jane", lastName: "Smith" },
        decision: "Rejected",
        comment: "Needs changes",
        commentBy: "Admin",
      },
    ];
    component();

    expect(await screen.findByText("John Doe")).toBeInTheDocument();
    expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
  });
  test("render the correct aggregate values based on tableAggregates and tableRows", async () => {
    const tableRows = [
      { name: "Row 1", values: ["Value 1", "Value 2"] },
      { name: "Row 2", values: ["Value 3", "Value 4"] },
    ];
    const tableAggregates = [
      { name: "Total", value: "Value 5" },
      { name: "Average", value: "Value 6" },
    ];

    userInputs = {
      mappedValues: {},
      tableProp: { tableRows, tableHead: "Test Table", tableAggregates },
    };

    component();

    const tableHeader = screen.getByText("Test Table");
    expect(tableHeader).toBeInTheDocument();

    fireEvent.click(tableHeader);

    await waitFor(() => {
      tableAggregates.forEach((aggregate) => {
        expect(screen.getByText(aggregate.name)).toBeInTheDocument();
        expect(screen.getByText(aggregate.value)).toBeInTheDocument();
      });
    });
  });
});
