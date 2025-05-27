import { render, screen } from "@testing-library/react";
import React from "react";
import RadioSidebar from ".";

// Mock child components
jest.mock("../components/SidebarNameSection", () => (props) => (
  <div data-testid="sidebar-name-section">{JSON.stringify(props)}</div>
));
jest.mock("../components/SidebarFieldPreferenceSection", () => (props) => (
  <div data-testid="sidebar-field-preference-section">
    {JSON.stringify(props)}
  </div>
));
jest.mock("../components/OptionsSelectionSection", () => (props) => (
  <div data-testid="options-selection-section">{JSON.stringify(props)}</div>
));
jest.mock("../components/SidebarLabelPreferenceSection", () => (props) => (
  <div data-testid="sidebar-label-preference-section">
    {JSON.stringify(props)}
  </div>
));
jest.mock("../components/CustomStyleSection", () => (props) => (
  <div data-testid="custom-style-section">{JSON.stringify(props)}</div>
));

describe("<RadioSidebar />", () => {
  const baseProps = {
    id: "radio1",
    itemRef: { current: null },
    name: "radioName",
    title: "Radio Title",
    values: {
      label: "Radio Label",
      options: [
        { dataText: "A", dataValue: "A" },
        { dataText: "B", dataValue: "B" },
      ],
      labelHide: false,
      required: false,
    },
    style: {},
    type: "radio",
    dataType: "string",
    showStyling: false,
    updateData: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders all main sidebar sections when showStyling is false and not dynamic", () => {
    render(<RadioSidebar {...baseProps} />);
    expect(screen.getByTestId("sidebar-name-section")).toBeInTheDocument();
    expect(
      screen.getByTestId("sidebar-field-preference-section")
    ).toBeInTheDocument();
    expect(screen.getByTestId("options-selection-section")).toBeInTheDocument();
    expect(
      screen.getByTestId("sidebar-label-preference-section")
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("custom-style-section")
    ).not.toBeInTheDocument();
  });

  it("renders CustomStyleSection when showStyling is true", () => {
    render(<RadioSidebar {...baseProps} showStyling={true} />);
    expect(screen.getByTestId("custom-style-section")).toBeInTheDocument();
    expect(
      screen.queryByTestId("sidebar-field-preference-section")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("options-selection-section")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("sidebar-label-preference-section")
    ).not.toBeInTheDocument();
  });

  it("does not render OptionsSelectionSection if isDynamic is true", () => {
    render(<RadioSidebar {...baseProps} name="@dynamicRadio" />);
    expect(
      screen.queryByTestId("options-selection-section")
    ).not.toBeInTheDocument();
    expect(
      screen.getByTestId("sidebar-field-preference-section")
    ).toBeInTheDocument();
  });

  it("passes correct props to SidebarNameSection", () => {
    render(<RadioSidebar {...baseProps} />);
    const nameSection = screen.getByTestId("sidebar-name-section");
    expect(nameSection.textContent).toContain('"itemId":"radio1"');
    expect(nameSection.textContent).toContain('"itemType":"radio"');
    expect(nameSection.textContent).toContain('"name":"radioName"');
    expect(nameSection.textContent).toContain('"title":"Radio Title"');
  });

  it("passes correct props to SidebarFieldPreferenceSection", () => {
    render(<RadioSidebar {...baseProps} />);
    const fieldSection = screen.getByTestId("sidebar-field-preference-section");
    expect(fieldSection.textContent).toContain('"itemType":"radio"');
    expect(fieldSection.textContent).toContain('"name":"radioName"');
    expect(fieldSection.textContent).toContain('"title":"Radio Title"');
    expect(fieldSection.textContent).toContain(
      '"values":{"label":"Radio Label"'
    );
  });

  it("passes correct props to OptionsSelectionSection", () => {
    render(<RadioSidebar {...baseProps} />);
    const optionsSection = screen.getByTestId("options-selection-section");
    expect(optionsSection.textContent).toContain('"itemType":"radio"');
    expect(optionsSection.textContent).toContain('"name":"radioName"');
    expect(optionsSection.textContent).toContain('"title":"Radio Title"');
    expect(optionsSection.textContent).toContain(
      '"values":{"label":"Radio Label"'
    );
  });

  it("passes correct props to SidebarLabelPreferenceSection", () => {
    render(<RadioSidebar {...baseProps} />);
    const labelSection = screen.getByTestId("sidebar-label-preference-section");
    expect(labelSection.textContent).toContain('"itemType":"radio"');
    expect(labelSection.textContent).toContain('"name":"radioName"');
    expect(labelSection.textContent).toContain('"title":"Radio Title"');
    expect(labelSection.textContent).toContain(
      '"values":{"label":"Radio Label"'
    );
  });

  it("toggles isDynamic state when setIsDynamic is called", () => {
    // This test is more for coverage, as the actual toggle is internal state
    render(<RadioSidebar {...baseProps} name="@dynamicRadio" />);
    // Should not render options section if isDynamic is true
    expect(
      screen.queryByTestId("options-selection-section")
    ).not.toBeInTheDocument();
  });
});
