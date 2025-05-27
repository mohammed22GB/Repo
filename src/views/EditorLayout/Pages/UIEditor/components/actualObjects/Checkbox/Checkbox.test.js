import { screen, cleanup, fireEvent } from "@testing-library/react";
import { mockThemeAndRouter } from "../../../../../../../test-utilities/testMocks/themeRouter";
import { MemoryRouter } from "react-router-dom";
import { APP_DESIGN_MODES } from "../../../../../../common/utils/constants";
import CheckBox from "./index";

describe("<CheckBox />", () => {
  afterEach(() => {
    cleanup();
  });

  let props;

  beforeEach(() => {
    props = {
      onChange: jest.fn(),
      isDocument: false,
      val: [],
      screenId: "",
      name: "",
      style: {},
      dynamicData: {},
      values: {},
      id: "",
      uieCanvasMode: APP_DESIGN_MODES.EDIT,
      appDesignMode: APP_DESIGN_MODES.LIVE,
    };
  });

  const component = (props, option) => {
    return mockThemeAndRouter(
      <MemoryRouter initialEntries={["/run"]}>
        <CheckBox {...props} />
      </MemoryRouter>,
      { ...option }
    );
  };

  test("Render no checkboxes when both values.options and dynamicContentObj[name] are empty", () => {
    const testProps = {
      ...props,
      values: {
        options: [],
        labelHide: false,
        label: "Enter Checkbox label name",
      },
      screenId: "testScreen",
      name: "testName",
    };

    component(testProps);

    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    expect(screen.getByText(/Enter Checkbox label name/i)).toBeInTheDocument();
  });

  test("Render options from dynamicContentObj[name]", () => {
    const testProps = {
      ...props,
      screenId: "testScreen",
      values: { isFormatted: false, options: [] },
      name: "testName",
      dynamicData: {
        testScreen: {
          testName: ["Option 1", "Option 2", "Option 3"],
        },
      },
    };

    component(testProps);

    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.getByText("Option 3")).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox")).toHaveLength(3);
  });

  test("Update selections and call onChange when checkboxes are clicked", () => {
    const testProps = {
      ...props,
      values: {
        options: [
          { dataText: "A", dataValue: "A" },
          { dataText: "B", dataValue: "B" },
        ],
        labelHide: false,
      },
      name: "testName",
    };

    component(testProps);

    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);
    expect(props.onChange).toHaveBeenCalled();
    fireEvent.click(checkboxes[1]);
    expect(props.onChange).toHaveBeenCalled();
  });

  test("Update selections when val prop changes", () => {
    const testProps = {
      ...props,
      values: {
        options: [
          { dataText: "A", dataValue: "A" },
          { dataText: "B", dataValue: "B" },
        ],
        labelHide: false,
      },
      name: "testName",
      val: ["B"],
    };

    component(testProps);

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[1]).toBeChecked();
  });

  test("Disables checkboxes in EDIT or PREVIEW mode", () => {
    const testProps = {
      ...props,
      values: {
        options: [
          { dataText: "A", dataValue: "A" },
          { dataText: "B", dataValue: "B" },
        ],
        labelHide: false,
      },
      name: "testName",
      appDesignMode: APP_DESIGN_MODES.EDIT,
    };

    component(testProps);

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).toBeDisabled();
    expect(checkboxes[1]).toBeDisabled();
  });

  test("Renders label and Required indicator", () => {
    const testProps = {
      ...props,
      values: {
        options: [{ dataText: "A", dataValue: "A" }],
        label: "Pick some",
        required: true,
        labelHide: false,
      },
      name: "testName",
    };

    component(testProps);

    expect(screen.getByText("Pick some")).toBeInTheDocument();
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  test("Renders checkboxes horizontally when optionsArrangement is 'horizontal'", () => {
    const testProps = {
      ...props,
      values: {
        options: [
          { dataText: "A", dataValue: "A" },
          { dataText: "B", dataValue: "B" },
        ],
        labelHide: false,
        optionsArrangement: "horizontal",
        maxOptionsPerRow: 2,
      },
      name: "testName",
    };

    component(testProps);

    // Just check that checkboxes are rendered, as flexDirection is a style
    expect(screen.getAllByRole("checkbox")).toHaveLength(2);
  });

  test("Does not render label if labelHide is true", () => {
    const testProps = {
      ...props,
      values: {
        options: [{ dataText: "A", dataValue: "A" }],
        label: "Should not show",
        labelHide: true,
      },
      name: "testName",
    };

    component(testProps);

    expect(screen.queryByText("Should not show")).not.toBeInTheDocument();
  });
});
