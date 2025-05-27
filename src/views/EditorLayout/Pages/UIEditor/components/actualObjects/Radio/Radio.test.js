import { screen, cleanup, fireEvent } from "@testing-library/react";
import { mockThemeAndRouter } from "../../../../../../../test-utilities/testMocks/themeRouter";
import { MemoryRouter } from "react-router-dom";
import { APP_DESIGN_MODES } from "../../../../../../common/utils/constants";
import RadioButton from "./index";

describe("<RadioButton />", () => {
  afterEach(() => {
    cleanup();
  });

  let props;

  beforeEach(() => {
    props = {
      onChange: jest.fn(),
      isDocument: false,
      val: "",
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
        <RadioButton {...props} />
      </MemoryRouter>,
      { ...option }
    );
  };

  test("Render 'No options' when both values.options and dynamicContentObj[name] are empty", () => {
    const testProps = {
      ...props,
      values: {
        options: [],
        labelHide: false,
        label: "Enter label name",
      },
      screenId: "testScreen",
      name: "testName",
    };

    component(testProps);

    expect(screen.queryByRole("radio")).not.toBeInTheDocument();
    expect(screen.getByText(/Enter label name/i)).toBeInTheDocument();
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
    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });

  test("Update selection and call onChange when a radio is clicked", () => {
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

    const radios = screen.getAllByRole("radio");
    fireEvent.click(radios[1]);
    expect(props.onChange).toHaveBeenCalledWith("B", "");
  });

  test("Update selection when val prop changes", () => {
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
      val: "B",
    };

    component(testProps);

    const radios = screen.getAllByRole("radio");
    expect(radios[1]).toBeChecked();
  });

  test("Disables radios in EDIT or PREVIEW mode", () => {
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

    const radios = screen.getAllByRole("radio");
    expect(radios[0]).toBeDisabled();
    expect(radios[1]).toBeDisabled();
  });

  test("Renders label and Required indicator", () => {
    const testProps = {
      ...props,
      values: {
        options: [{ dataText: "A", dataValue: "A" }],
        label: "Pick one",
        required: true,
        labelHide: false,
      },
      name: "testName",
    };

    component(testProps);

    expect(screen.getByText("Pick one")).toBeInTheDocument();
    expect(screen.getByText("*")).toBeInTheDocument();
  });
});
