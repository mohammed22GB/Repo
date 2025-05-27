import {
  mockThemeAndRouter,
  cleanup,
  screen,
  waitFor,
  fireEvent,
} from "../../../../../../../../../../test-utilities/testMocks/themeRouter";
import { MemoryRouter } from "react-router-dom";
import LookupMatchingPair from ".";

describe("<LookupMatchingPair />", () => {
  afterEach(() => {
    cleanup();
  });

  let lookupContents,
    dataObj,
    valuesDataz,
    matchedLine,
    matchedLines,
    mockUpdateMatching;

  beforeEach(() => {
    lookupContents = [
      {
        id: "6eb772b8-64cc-41fa-a68b-de0fb89a1894",
        info: {
          name: "inputText-1734199135934",
          nodeType: "ScreenTask",
          parent: "6408585a-a4f4-4921-adff-36754340a883",
          dataType: ["text"],
          group: "Form",
          matching: {
            valueSourceType: "form",
            valueSourceId: "",
            valueSourceInput: "675dc761c3fdac3b5dffa97f",
          },
        },
        tasks: ["6408585a-a4f4-4921-adff-36754340a883"],
      },
      {
        id: "92df9fa6-1796-4eda-97e8-f59fae316d90",
        info: {
          name: "textArea-22222",
          nodeType: "ScreenTask",
          parent: "6408585a-a4f4-4921-adff-36754340a883",
          dataType: ["text"],
          group: "Form",
          matching: {
            valueSourceType: "form",
            valueSourceId: "",
            valueSourceInput: "6787adf25440f30777d380ba",
          },
        },
        tasks: ["6408585a-a4f4-4921-adff-36754340a883"],
      },
      {
        id: "499181a7-ac99-45cf-a0f0-b83f30ad1b07",
        info: {
          name: "inputText1",
          nodeType: "ScreenTask",
          parent: "6408585a-a4f4-4921-adff-36754340a883",
          dataType: ["text"],
          group: "Form",
          matching: {
            valueSourceType: "form",
            valueSourceId: "",
            valueSourceInput: "6787adf45440f30777d380c8",
          },
        },
        tasks: ["6408585a-a4f4-4921-adff-36754340a883"],
        activeSelection: true,
        lookupField: "6787adf45440f30777d380c8",
        dataMatching: [
          {
            targetField: "b19404cc-088c-453e-8296-66196c9fe1f4",
            targetValue: [
              {
                dataType: ["text"],
                id: "92df9fa6-1796-4eda-97e8-f59fae316d90",
                info: "Screeny (ScreenTask)",
                name: "textArea-22222",
                variableType: "Variable",
              },
            ],
          },
          {
            targetField: "4221ccd3-09d8-4e5c-b070-a9ce6a37d3e1",
            targetValue: [
              {
                dataType: ["number"],
                id: "2ab31152-69c6-41ec-8773-f52b51eadab2",
                info: "Screeny (ScreenTask)",
                name: "inputText-Prefiller",
                variableType: "Variable",
              },
            ],
          },
          {
            targetField: "c891467e-5513-4a6e-ad0d-204fda2b2c34",
            targetValue: [
              {
                dataType: ["text"],
                id: "5c21ca8b-93af-4e0d-9ecf-f50f666cd8bc",
                info: "Screeny (ScreenTask)",
                name: "inputText-Second",
                variableType: "Variable",
              },
            ],
          },
        ],
        dataMethod: "new",
        dataUpdateParams: [],
        aggregationFunction: null,
        aggregatedField: null,
        selectedFields: [],
        hasDecision: false,
        dataSourceType: "datasheet",
        externalDB: null,
        worksheetTab: null,
        table: null,
        dataSheet: "66c71df61fa8ecb2c4fa4b6b",
        integration: null,
        valueColumn: null,
        selectionConditions: [
          {
            conditionOperator: "EQUALS",
            conditionColumn: "7e6af8ec-da53-4faf-b479-2cbbcc55ad28",
          },
        ],
      },
      {
        id: "2ab31152-69c6-41ec-8773-f52b51eadab2",
        info: {
          name: "inputText-Prefiller",
          nodeType: "ScreenTask",
          parent: "6408585a-a4f4-4921-adff-36754340a883",
          dataType: ["number"],
          group: "Form",
          matching: {
            valueSourceType: "form",
            valueSourceId: "",
            valueSourceInput: "67a073ef4c795e4d4793c167",
          },
        },
        tasks: ["6408585a-a4f4-4921-adff-36754340a883"],
        lookupField: "67a073ef4c795e4d4793c167",
        activeSelection: false,
      },
      {
        id: "5c21ca8b-93af-4e0d-9ecf-f50f666cd8bc",
        info: {
          name: "inputText-Second",
          nodeType: "ScreenTask",
          parent: "6408585a-a4f4-4921-adff-36754340a883",
          dataType: ["text"],
          group: "Form",
          matching: {
            valueSourceType: "form",
            valueSourceId: "",
            valueSourceInput: "67aa03c08e271990553a434f",
          },
        },
        tasks: ["6408585a-a4f4-4921-adff-36754340a883"],
      },
    ];

    dataObj = {
      id: "499181a7-ac99-45cf-a0f0-b83f30ad1b07",
      info: {
        name: "inputText1",
        nodeType: "ScreenTask",
        parent: "6408585a-a4f4-4921-adff-36754340a883",
        dataType: ["text"],
        group: "Form",
        matching: {
          valueSourceType: "form",
          valueSourceId: "",
          valueSourceInput: "6787adf45440f30777d380c8",
        },
      },
      tasks: ["6408585a-a4f4-4921-adff-36754340a883"],
      activeSelection: true,
      lookupField: "6787adf45440f30777d380c8",
      dataMatching: [
        {
          targetField: "b19404cc-088c-453e-8296-66196c9fe1f4",
          targetValue: [
            {
              dataType: ["text"],
              id: "92df9fa6-1796-4eda-97e8-f59fae316d90",
              info: "Screeny (ScreenTask)",
              name: "textArea-22222",
              variableType: "Variable",
            },
          ],
        },
        {
          targetField: "4221ccd3-09d8-4e5c-b070-a9ce6a37d3e1",
          targetValue: [
            {
              dataType: ["number"],
              id: "2ab31152-69c6-41ec-8773-f52b51eadab2",
              info: "Screeny (ScreenTask)",
              name: "inputText-Prefiller",
              variableType: "Variable",
            },
          ],
        },
        {
          targetField: "c891467e-5513-4a6e-ad0d-204fda2b2c34",
          targetValue: [
            {
              dataType: ["text"],
              id: "5c21ca8b-93af-4e0d-9ecf-f50f666cd8bc",
              info: "Screeny (ScreenTask)",
              name: "inputText-Second",
              variableType: "Variable",
            },
          ],
        },
      ],
      dataMethod: "new",
      dataUpdateParams: [],
      aggregationFunction: null,
      aggregatedField: null,
      selectedFields: [],
      hasDecision: false,
      dataSourceType: "datasheet",
      externalDB: null,
      worksheetTab: null,
      table: null,
      dataSheet: "66c71df61fa8ecb2c4fa4b6b",
      integration: null,
      valueColumn: null,
      selectionConditions: [
        {
          conditionOperator: "EQUALS",
          conditionColumn: "7e6af8ec-da53-4faf-b479-2cbbcc55ad28",
        },
      ],
      isLookupField: true,
    };

    matchedLines = [
      {
        targetField: "b19404cc-088c-453e-8296-66196c9fe1f4",
        targetValue: [
          {
            dataType: ["text"],
            id: "92df9fa6-1796-4eda-97e8-f59fae316d90",
            info: "Screeny (ScreenTask)",
            name: "textArea-22222",
            variableType: "Variable",
          },
        ],
      },
      {
        targetField: "4221ccd3-09d8-4e5c-b070-a9ce6a37d3e1",
        targetValue: [
          {
            dataType: ["number"],
            id: "2ab31152-69c6-41ec-8773-f52b51eadab2",
            info: "Screeny (ScreenTask)",
            name: "inputText-Prefiller",
            variableType: "Variable",
          },
        ],
      },
      {
        targetField: "c891467e-5513-4a6e-ad0d-204fda2b2c34",
        targetValue: [
          {
            dataType: ["text"],
            id: "5c21ca8b-93af-4e0d-9ecf-f50f666cd8bc",
            info: "Screeny (ScreenTask)",
            name: "inputText-Second",
            variableType: "Variable",
          },
        ],
      },
    ];
    matchedLine = {
      targetField: "c891467e-5513-4a6e-ad0d-204fda2b2c34",
      targetValue: [
        {
          dataType: ["text"],
          id: "5c21ca8b-93af-4e0d-9ecf-f50f666cd8bc",
          info: "Screeny (ScreenTask)",
          name: "inputText-Second",
          variableType: "Variable",
        },
      ],
    };

    valuesDataz = [
      {
        isHidden: false,
        isDefault: false,
        hasNull: true,
        isUnique: false,
        _id: "66c71e181fa8ecb2c4fa4ba0",
        id: "7e6af8ec-da53-4faf-b479-2cbbcc55ad28",
        name: "First Name",
        dataType: "text",
        defaultValue: "",
        order: "0",
      },
      {
        isHidden: false,
        isDefault: false,
        hasNull: true,
        isUnique: false,
        _id: "66c71e0d1fa8ecb2c4fa4b88",
        id: "b19404cc-088c-453e-8296-66196c9fe1f4",
        name: "Phone number",
        dataType: "number",
        defaultValue: "",
        order: "1",
      },
      {
        isHidden: false,
        isDefault: false,
        hasNull: true,
        isUnique: false,
        _id: "676587a966283700f90fdbfb",
        id: "c891467e-5513-4a6e-ad0d-204fda2b2c34",
        name: "Execution Time Screen one",
        dataType: "text",
        defaultValue: "",
        order: "2",
      },
      {
        isHidden: false,
        isDefault: false,
        hasNull: true,
        isUnique: false,
        _id: "67a076aa4c795e4d4793c253",
        id: "4221ccd3-09d8-4e5c-b070-a9ce6a37d3e1",
        name: "What is It",
        dataType: "number",
        defaultValue: "",
        order: "3",
      },
    ];

    mockUpdateMatching = jest.fn();
  });

  const component = (option) => {
    return mockThemeAndRouter(
      <MemoryRouter initialEntries={["/editor/:id"]}>
        <LookupMatchingPair
          isLookupField={true}
          lookupContents={lookupContents}
          dataObj={dataObj}
          matchedLine={matchedLine}
          matchedLines={matchedLines}
          valuesData={valuesDataz}
          updateMatching={mockUpdateMatching}
        />
      </MemoryRouter>,
      { ...option }
    );
  };

  test("should toggle the filter popper open and closed when the filter button is clicked", async () => {
    component();

    const { getByText, getByTestId, getAllByText } = screen;

    expect(getByTestId("firstDropdown")).toBeInTheDocument();
    expect(getByTestId("secondDropdown")).toBeInTheDocument();
  });

  test("render options in the first dropdown and update the dropdown when selected", async () => {
    component();

    const firstDropdown = screen.getAllByRole("button", {
      name: "Execution Time Screen one",
    });
    fireEvent.mouseDown(firstDropdown[0]);
    expect(screen.getByText("Assign data field")).toBeInTheDocument();
    const firstNameOption = screen.getByText("First Name");
    expect(firstNameOption).toBeInTheDocument();
    fireEvent.mouseDown(firstNameOption);
    expect(screen.getByPlaceholderText("Select data options")).toHaveValue(
      "c891467e-5513-4a6e-ad0d-204fda2b2c34"
    );
  });

  test("render options in the second dropdown and update the dropdown when selected", async () => {
    component();
    const { getByText, getByTestId, getAllByText, getByPlaceholderText } =
      screen;

    const secondDropdown = screen.getByRole("button", {
      name: "inputText-Second",
    });
    fireEvent.mouseDown(secondDropdown);

    expect(getByText("Select lookup field")).toBeInTheDocument();
    const textAreaOption = getByText("textArea-22222");
    expect(textAreaOption).toBeInTheDocument();
    fireEvent.mouseDown(textAreaOption);
    expect(textAreaOption).toHaveClass("Mui-disabled");
    expect(getByPlaceholderText("Select form screen")).toHaveValue(
      "5c21ca8b-93af-4e0d-9ecf-f50f666cd8bc"
    );
  });

  test("should render and call the switch mode element", async () => {
    component();
    const { getByText, getByTestId, getAllByText } = screen;

    const switchMode = screen.getByTitle("Switch entry mode");
    expect(switchMode).toBeInTheDocument();

    fireEvent.click(switchMode);

    await waitFor(() => {
      expect(mockUpdateMatching).toHaveBeenCalled();
    });
  });

  test("should render and call the remove line element", async () => {
    component();
    const { getByText, getByTestId, getAllByText } = screen;

    expect(getByText("=")).toBeInTheDocument();

    const removeline = screen.getByTitle("Remove line");
    expect(removeline).toBeInTheDocument();
  });
});
