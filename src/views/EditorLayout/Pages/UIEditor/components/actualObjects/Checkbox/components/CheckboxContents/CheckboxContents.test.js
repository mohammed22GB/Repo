import { render, screen, fireEvent } from "@testing-library/react";
import CheckboxContent from "./index";
import { APP_DESIGN_MODES } from "../../../../../../../../common/utils/constants";

describe("<CheckboxContent />", () => {
  const baseProps = {
    selections: [],
    values: {
      options: [
        { dataText: "A", dataValue: "A" },
        { dataText: "B", dataValue: "B" },
      ],
      label: "Pick some",
      required: false,
      labelHide: false,
      optionsArrangement: "vertical",
    },
    name: "testName",
    appDesignMode: APP_DESIGN_MODES.LIVE,
    disabled: false,
    readOnly: false,
    reuseValue: [],
    _onChange: jest.fn(),
    props: {},
  };

  it("renders static options", () => {
    render(<div>{CheckboxContent(baseProps, {}, [])}</div>);
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox")).toHaveLength(2);
  });

  it("checks the correct checkboxes when selections match", () => {
    render(
      <div>{CheckboxContent({ ...baseProps, reuseValue: ["A"] }, {}, [])}</div>
    );
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it("disables checkboxes in EDIT or PREVIEW mode", () => {
    render(
      <div>
        {CheckboxContent(
          { ...baseProps, appDesignMode: APP_DESIGN_MODES.EDIT },
          {},
          []
        )}
      </div>
    );
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).toBeDisabled();
    expect(checkboxes[1]).toBeDisabled();
  });

  it("renders dynamic options from dynamicContentObj", () => {
    const dynamicContentObj = { testName: ["X", "Y"] };
    render(
      <div>
        {CheckboxContent(
          {
            ...baseProps,
            name: "testName",
            values: { ...baseProps.values, options: [] },
          },
          dynamicContentObj,
          []
        )}
      </div>
    );
    expect(screen.getByText("X")).toBeInTheDocument();
    expect(screen.getByText("Y")).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox")).toHaveLength(2);
  });

  it("calls _onChange when a checkbox is clicked", () => {
    const onChange = jest.fn();
    render(
      <div>
        {CheckboxContent({ ...baseProps, _onChange: onChange }, {}, [])}
      </div>
    );
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[1]);
    expect(onChange).toHaveBeenCalled();
  });

  it("renders checkboxes horizontally when optionsArrangement is 'horizontal'", () => {
    render(
      <div>
        {CheckboxContent(
          {
            ...baseProps,
            values: {
              ...baseProps.values,
              optionsArrangement: "horizontal",
              maxOptionsPerRow: 2,
            },
          },
          {},
          []
        )}
      </div>
    );
    expect(screen.getAllByRole("checkbox")).toHaveLength(2);
  });

  it("applies required when values.required is true and no selections", () => {
    render(
      <div>
        {CheckboxContent(
          {
            ...baseProps,
            values: { ...baseProps.values, required: true },
            selections: [],
          },
          {},
          []
        )}
      </div>
    );
    // The required attribute is set on the input
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).toHaveAttribute("required");
    expect(checkboxes[1]).toHaveAttribute("required");
  });

  it("does not apply required when values.required is false", () => {
    render(
      <div>
        {CheckboxContent(
          {
            ...baseProps,
            values: { ...baseProps.values, required: false },
            selections: [],
          },
          {},
          []
        )}
      </div>
    );
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).not.toHaveAttribute("required");
    expect(checkboxes[1]).not.toHaveAttribute("required");
  });

  it("disables checkboxes when readOnly or disabled is true", () => {
    render(
      <div>{CheckboxContent({ ...baseProps, readOnly: true }, {}, [])}</div>
    );
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).toBeDisabled();
    expect(checkboxes[1]).toBeDisabled();
  });
});
