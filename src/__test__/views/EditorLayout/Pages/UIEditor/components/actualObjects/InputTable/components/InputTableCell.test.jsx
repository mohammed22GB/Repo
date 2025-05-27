import { cleanup, fireEvent, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { mockThemeAndRouter } from "../../../../../../../../../test-utilities/testMocks/themeRouter";
import InputTableCell from "../../../../../../../../../views/EditorLayout/Pages/UIEditor/components/actualObjects/InputTable/components/InputTableCell";

describe("InputTableCell", () => {
  let props;

  beforeEach(() => {
    props = {
      type: "column",
      row: {},
      col: {
        id: "col-id",
        inputType: "dropdown",
        header: "col-header",
      },
      rowIndex: 0,
      valuesData: {
        columns: [
          {
            "col-id": "",
          },
        ],
      },
      screenId: "screen-id",
    };
  });
  afterEach(() => {
    cleanup();
  });

  const component = (props, options) =>
    mockThemeAndRouter(
      <MemoryRouter initialEntries={["/login"]}>
        <InputTableCell {...props} />
      </MemoryRouter>,
      { ...options }
    );

  it("renders dropdown field if inputType is 'dropdown'", () => {
    component(props);

    const getDropdown = screen.getByRole("listbox");

    expect(getDropdown).toBeInTheDocument();
  });

  it("displays value from dynamic content if present", () => {
    props.dynamicData = {
      "screen-id": {
        "col-header": "my dynamic value",
      },
    };
    props.col = {
      ...props.col,
      isDynamic: true,
    };

    component(props);

    const getDropdown = screen.getByDisplayValue("my dynamic value");

    expect(getDropdown).toBeInTheDocument();
  });

  it("displays value from dynamic content if it's present; shouldn't disable dropdown", () => {
    props.dynamicData = {
      "screen-id": {
        "col-header": "my dynamic value",
      },
    };
    props.col = {
      ...props.col,
      isDynamic: true,
    };

    component(props);

    const getDropdown = screen.getByDisplayValue("my dynamic value");

    expect(getDropdown).toBeInTheDocument();
    expect(getDropdown).toBeEnabled();
  });

  it("displays value from dynamic content if it's present; should disable inputText", () => {
    props.col.inputType = "inputText";
    props.dynamicData = {
      "screen-id": {
        "col-header": "my dynamic value",
      },
    };
    props.col = {
      ...props.col,
      isDynamic: true,
    };

    component(props);

    const getDropdown = screen.getByDisplayValue("my dynamic value");

    expect(getDropdown).toBeInTheDocument();
    expect(getDropdown).toBeDisabled();
  });

  it("displays dropdown options list from dynamic content if it's present", async () => {
    const dynamicOptions = ["option-1", "option-2", "optin-3"];
    props.dynamicData = {
      "screen-id": {
        "col-header": dynamicOptions,
      },
    };
    props.col = {
      ...props.col,
      isDynamic: true,
    };

    component(props);

    const selectEl = await screen.findByRole("listbox", {
      class: "MuiInputBase-root MuiInput-root MuiInput-underline",
    });

    const button = within(selectEl).getByRole("button");
    fireEvent.mouseDown(button);

    const getDropdownOptions = screen.getAllByRole("option");

    expect(getDropdownOptions).toHaveLength(dynamicOptions.length);
  });

  it("displays the value in input table aggregateCell", () => {
    props.type = "aggregate";
    props.col.inputType = "inputText";

    props.row = {
      id: "387538d8-7950-41a7-b464-dbfc63840ebb",
      inputType: "aggregation", // not "variable", so it should be disabled
      header: "",
      label: "some-aggregate-cell",
    };

    props.valuesData = {
      columns: [
        {
          "col-id": "some-other-value",
        },
      ],
      aggregateCells: {
        "6d889c13-49f3-44d2-b6f8-6bbb8576ebfa": 10,
        "2bda61b9-2d5b-4ee6-a7c3-a8e94eeaa290": 45,
        "387538d8-7950-41a7-b464-dbfc63840ebb": 45, // we'll assert this because we Provide matching value in aggregateCells
      },
    };

    component(props);

    const input = screen.getByDisplayValue("45");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("45");

    // Because row.inputType is 'aggregation' (not 'variable'), the input should be disabled
    expect(input).toBeDisabled();
  });
});
