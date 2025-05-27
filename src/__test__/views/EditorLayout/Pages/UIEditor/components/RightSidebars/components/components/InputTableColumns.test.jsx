import { cleanup, fireEvent, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { mockThemeAndRouter } from "../../../../../../../../../test-utilities/testMocks/themeRouter";
import InputTableColumns from "../../../../../../../../../views/EditorLayout/Pages/UIEditor/components/RightSidebar/components/components/InputTableColumns";

describe("InputTableColumn", () => {
  let props;

  beforeEach(() => {
    props = {
      values: {
        columns: [
          {
            inputType: "dropdown",
            isDynamic: true,
          },
          {
            inputType: "inputText",
            isDynamic: true,
          },
          {
            inputType: "fileUpload",
            isDynamic: true,
          },
          {
            inputType: "computed",
            isDynamic: true,
          },
        ],
      },
      itemRef: "3r2-23123-123-23-23a2ea",
      title: "some-title",
    };
  });
  afterEach(() => {
    cleanup();
  });

  const component = (props, options) =>
    mockThemeAndRouter(
      <MemoryRouter initialEntries={["/login"]}>
        <InputTableColumns {...props} />
      </MemoryRouter>,
      { ...(options || {}) }
    );

  it("renders with switch toggle dynamic, for all inputTypes except 'fileUpload' and 'computed'", () => {
    component(props);

    const getDropdown = screen.getAllByText("Make column dynamic?");

    expect(getDropdown).toHaveLength(2);
  });
});
