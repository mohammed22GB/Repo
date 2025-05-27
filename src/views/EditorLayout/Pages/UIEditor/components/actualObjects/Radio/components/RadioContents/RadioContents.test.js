import { render, screen, fireEvent } from "@testing-library/react";
import RadioContent from "./index";
import { APP_DESIGN_MODES } from "../../../../../../../../common/utils/constants";

describe("<RadioContent />", () => {
  const baseProps = {
    selection: "",
    values: {
      options: [
        { dataText: "A", dataValue: "A" },
        { dataText: "B", dataValue: "B" },
      ],
      label: "Pick one",
      required: false,
      labelHide: false,
    },
    name: "testName",
    appDesignMode: APP_DESIGN_MODES.LIVE,
    disabled: false,
    readOnly: false,
    reuseValue: "",
    _onChange: jest.fn(),
    props: {},
  };

  it("renders static options", () => {
    render(<div>{RadioContent(baseProps, {}, [])}</div>);
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(2);
  });

  it("checks the correct radio when selection matches", () => {
    render(<div>{RadioContent({ ...baseProps, selection: "B" }, {}, [])}</div>);
    const radios = screen.getAllByRole("radio");
    expect(radios[1]).toBeChecked();
  });

  it("disables radios in EDIT or PREVIEW mode", () => {
    render(
      <div>
        {RadioContent(
          { ...baseProps, appDesignMode: APP_DESIGN_MODES.EDIT },
          {},
          []
        )}
      </div>
    );
    const radios = screen.getAllByRole("radio");
    expect(radios[0]).toBeDisabled();
    expect(radios[1]).toBeDisabled();
  });

  it("renders dynamic options from dynamicContentObj", () => {
    const dynamicContentObj = { testName: ["X", "Y"] };
    render(
      <div>
        {RadioContent(
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
    expect(screen.getAllByRole("radio")).toHaveLength(2);
  });

  it("calls _onChange when a radio is clicked", () => {
    const onChange = jest.fn();
    render(
      <div>{RadioContent({ ...baseProps, _onChange: onChange }, {}, [])}</div>
    );
    const radios = screen.getAllByRole("radio");
    fireEvent.click(radios[1]);
    expect(onChange).toHaveBeenCalled();
  });
});
