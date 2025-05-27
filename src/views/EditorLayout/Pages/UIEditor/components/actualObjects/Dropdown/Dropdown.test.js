import { screen, cleanup, waitFor, within } from "@testing-library/react";

import {
  mockThemeAndRouter,
  fireEvent,
} from "../../../../../../../test-utilities/testMocks/themeRouter";
import { MemoryRouter } from "react-router-dom";
import { APP_DESIGN_MODES } from "../../../../../../common/utils/constants";
import Dropdown from ".";

describe("<Dropdown />", () => {
  afterEach(() => {
    cleanup();
  });

  let props;

  beforeEach(() => {
    props = {
      onChange: jest.fn(),
      // readOnly: false,
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
        <Dropdown {...props} />
      </MemoryRouter>,
      { ...option }
    );
  };

  test("Render 'No options' when both values.options and dynamicContentObj[name] are empty", async () => {
    const testProps = {
      ...props,
      values: {
        options: [],
        labelHide: false,
      },
      screenId: "testScreen",
      name: "testName",
    };

    component(testProps);

    const element = screen.getByRole("button");
    expect(element).toBeInTheDocument();
    fireEvent.mouseDown(element);

    await waitFor(() => {
      const menu = screen.getByRole("listbox");

      const options = within(menu).getByRole("option", {
        name: "No options",
      });

      expect(options).toBeInTheDocument();
      expect(screen.queryByRole("textbox")).toBeNull();
    });
  });

  test("Return null when dynamicContentObj is defined, name starts with '@', and dynamicContentObj[name] is undefined", async () => {
    const testProps = {
      ...props,
      values: {},
      name: "@testName",
      appDesignMode: APP_DESIGN_MODES.LIVE,
      trackLookupVal: [],
      dynamicContentObj: {}, // dynamicContentObj[name] is undefined
    };

    component(testProps);

    const element = screen.getByRole("button");
    fireEvent.mouseDown(element);

    await waitFor(() => {
      const menu = screen.getByRole("listbox");

      const options = within(menu).getByRole("option", {
        name: "No options",
      });

      expect(options).toBeInTheDocument();
    });
  });

  test("Handle and render options when dynamicContentObj[name] is an object with values", async () => {
    const testProps = {
      ...props,
      screenId: "testScreen",
      values: { isFormatted: false },
      name: "testName",
      //trackLookupVal: [],
      dynamicContentObj: {
        testName: ["Option 1", "Option 2", "Option 3"],
      },
      dynamicData: {
        testScreen: {
          testName: ["Option 1", "Option 2", "Option 3"],
        },
      },
    };

    component(testProps);

    const element = screen.getByRole("button");
    fireEvent.mouseDown(element);

    await waitFor(() => {
      const menu = screen.getByRole("listbox");

      const options = within(menu).getAllByRole("option");

      expect(options).toHaveLength(4);
      expect(options[0]).toHaveTextContent("Select");
      expect(options[1]).toHaveTextContent("Option 1");
      expect(options[2]).toHaveTextContent("Option 2");
      expect(options[3]).toHaveTextContent("Option 3");
    });
  });

  test("Update trackLookupVal and value when returnedLookupObj[props.id] changes", async () => {
    const testProps = {
      ...props,
      values: { options: [] },
      name: "testName",
      returnedLookupObj: { testId: "newValue" },
      dynamicData: {},
      screenId: "testScreen",
      id: "testId",
    };

    component(testProps);

    const element = screen.getByRole("button");
    fireEvent.mouseDown(element);

    await waitFor(() => {
      const menu = screen.getByRole("listbox");

      const options = within(menu).getAllByRole("option");

      expect(options).toHaveLength(2);
      expect(options[0]).toHaveTextContent("Select");
      expect(options[1]).toHaveTextContent("newValue");

      expect(props.onChange).toHaveBeenCalled();
    });
  });

  test("Format numbers with commas when isFormatted is true", async () => {
    const testProps = {
      ...props,
      values: { isFormatted: true },
      name: "testName",
      trackLookupVal: [],
      screenId: "testScreen",
      dynamicData: {
        testScreen: {
          testName: ["1000", "2000", "3000"],
        },
      },
    };

    component(testProps);

    const element = screen.getByRole("button");
    fireEvent.mouseDown(element);

    await waitFor(() => {
      const menu = screen.getByRole("listbox");

      const options = within(menu).getAllByRole("option");

      expect(options).toHaveLength(4);
      expect(options[0]).toHaveTextContent("Select");
      expect(options[1]).toHaveTextContent("1,000");
      expect(options[2]).toHaveTextContent("2,000");
      expect(options[3]).toHaveTextContent("3,000");
    });
  });

  test("Render InputBase instead of Select when isDocument is true", async () => {
    const testProps = {
      ...props,
      values: {
        labelHide: false,
        placeholder: "Enter value",
      },
      name: "testName",
      screenId: "testScreen",
      id: "testId",
      isDocument: true,
    };

    component(testProps);

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });
});
