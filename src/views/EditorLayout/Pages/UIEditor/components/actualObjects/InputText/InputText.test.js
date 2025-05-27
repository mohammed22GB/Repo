import { cleanup, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import InputText from ".";
import { mockThemeAndRouter } from "../../../../../../../test-utilities/testMocks/themeRouter";
import { APP_DESIGN_MODES } from "../../../../../../common/utils/constants";
import * as dynamicContentReplaceHelper from "../../../../../../common/utils/dynamicContentReplace";

jest.mock("react-pdf", () => ({
  pdfjs: {
    GlobalWorkerOptions: { workerSrc: {} },
  },
  Document: () => () => <div>Document</div>,
  Page: () => () => <div>Page</div>,
  default: (...args) => mockFunc((...args) => ({})),
}));

describe("InputText", () => {
  let props;

  beforeEach(() => {
    props = { id: "item-id", readOnly: false, onChange: jest.fn() };
  });
  afterEach(() => {
    cleanup();
  });

  const renderInputTextComponent = (props, options) =>
    mockThemeAndRouter(
      <MemoryRouter initialEntries={["/login"]}>
        <InputText {...props} />
      </MemoryRouter>,
      { ...options }
    );

  it("renders InputText Component'", () => {
    renderInputTextComponent(props);

    const InputText = screen.getByRole("textbox");

    expect(InputText).toBeInTheDocument();
  });

  it("should be readonly if readonly is true'", () => {
    props.readOnly = true;
    renderInputTextComponent(props);

    const inputField = screen.getByRole("textbox");

    expect(inputField).toHaveAttribute("readonly");
  });

  it("should not be readonly if readonly is false", () => {
    props.readOnly = false;
    renderInputTextComponent(props);

    const inputField = screen.getByRole("textbox");

    expect(inputField).not.toHaveAttribute("readonly");
  });

  it("must display value from autonumber if field is configured as autonumber", async () => {
    jest
      .spyOn(dynamicContentReplaceHelper, "searchAndReplace")
      .mockReturnValue("item-dynamic-value");
    jest
      .spyOn(
        dynamicContentReplaceHelper,
        "getComputedValuePassedIntoFormulaBuilder"
      )
      .mockReturnValue("item-computed-value");

    props.appDesignMode = APP_DESIGN_MODES.LIVE;
    props.itemDetails = {
      dataType: "autoNumber",
      isDynamic: true,
    };
    props.values = {
      computed: true,
    };
    props.appSequence = { currentSequence: "item-sequence-value" };
    props.name = "item-name";
    props.val = "item-prop-value";
    props.screenId = "item-screen-id";
    props.dynamicData = {
      [props.screenId]: {
        [props.name]: "item-dynamic-value",
      },
    };

    renderInputTextComponent(props);

    const inputField = screen.getByRole("textbox");

    await waitFor(() => {
      expect(inputField).toHaveValue("item-sequence-value");
      expect(props.onChange).toHaveBeenCalledTimes(1);
      expect(props.onChange).toHaveBeenCalledWith(
        "item-sequence-value",
        "item-id"
      );
    });
  });

  it("must display value from dynamic data if field is configured as dynamic and not autonumber", async () => {
    jest
      .spyOn(dynamicContentReplaceHelper, "searchAndReplace")
      .mockReturnValue("item-dynamic-value");
    jest
      .spyOn(
        dynamicContentReplaceHelper,
        "getComputedValuePassedIntoFormulaBuilder"
      )
      .mockReturnValue("item-computed-value");

    props.appDesignMode = APP_DESIGN_MODES.LIVE;
    props.itemDetails = {
      dataType: "not-autoNumber",
      isDynamic: true,
    };
    props.values = {
      computed: true,
    };
    props.appSequence = { currentSequence: "item-sequence-value" };
    props.name = "item-name";
    props.val = "item-prop-value";
    props.screenId = "item-screen-id";
    props.dynamicData = {
      [props.screenId]: {
        [props.name]: "item-dynamic-value",
      },
    };

    renderInputTextComponent(props);

    const inputField = screen.getByRole("textbox");

    await waitFor(() => {
      expect(inputField).toHaveValue("item-dynamic-value");
    });
    expect(props.onChange).toHaveBeenCalledTimes(1);
    expect(props.onChange).toHaveBeenCalledWith(
      "item-dynamic-value",
      "item-id"
    );
  });

  it("must display value from computed data if field is configured as computed and not dynamic or autonumber", async () => {
    jest
      .spyOn(dynamicContentReplaceHelper, "searchAndReplace")
      .mockReturnValue("item-dynamic-value");
    jest
      .spyOn(
        dynamicContentReplaceHelper,
        "getComputedValuePassedIntoFormulaBuilder"
      )
      .mockReturnValue("item-computed-value");

    props.appDesignMode = APP_DESIGN_MODES.LIVE;
    props.itemDetails = {
      dataType: "not-autoNumber",
      isDynamic: false,
    };
    props.values = {
      computed: true,
    };
    props.appSequence = { currentSequence: "item-sequence-value" };
    props.name = "item-name";
    props.val = "item-prop-value";
    props.screenId = "item-screen-id";
    props.dynamicData = {
      [props.screenId]: {
        [props.name]: "item-dynamic-value",
      },
    };

    renderInputTextComponent(props);

    const inputField = screen.getByRole("textbox");

    await waitFor(() => {
      expect(inputField).toHaveValue("item-computed-value");
      expect(props.onChange).toHaveBeenCalledTimes(1);
      expect(props.onChange).toHaveBeenCalledWith(
        "item-computed-value",
        "item-id"
      );
    });
  });

  it("must display value passed into component if not confiugured as computed data or dynamic or autonumber", async () => {
    jest
      .spyOn(dynamicContentReplaceHelper, "searchAndReplace")
      .mockReturnValue("item-dynamic-value");
    jest
      .spyOn(
        dynamicContentReplaceHelper,
        "getComputedValuePassedIntoFormulaBuilder"
      )
      .mockReturnValue("item-computed-value");

    props.appDesignMode = APP_DESIGN_MODES.LIVE;
    props.itemDetails = {
      dataType: "not-autoNumber",
      isDynamic: false,
    };
    props.values = {
      computed: false,
    };
    props.appSequence = { currentSequence: "item-sequence-value" };
    props.name = "item-name";
    props.val = "item-prop-value";
    props.screenId = "item-screen-id";
    props.dynamicData = {
      [props.screenId]: {
        [props.name]: "item-dynamic-value",
      },
    };

    renderInputTextComponent(props);

    const inputField = screen.getByRole("textbox");

    await waitFor(() => {
      expect(inputField).toHaveValue("item-prop-value");
      expect(props.onChange).toHaveBeenCalledTimes(1);
      expect(props.onChange).toHaveBeenCalledWith("item-prop-value", "item-id");
    });
  });

  it("must display value passed into component if it's a returnedLookupObj", async () => {
    props.appDesignMode = APP_DESIGN_MODES.LIVE;
    props.id = "item-id";
    props.returnedLookupObj = {
      "item-id": "item-returned-lookup-value",
    };

    renderInputTextComponent(props);

    const inputField = screen.getByRole("textbox");

    await waitFor(() => {
      expect(inputField).toHaveValue("item-returned-lookup-value");
      expect(props.onChange).toHaveBeenCalledTimes(1);
      expect(props.onChange).toHaveBeenCalledWith(
        "item-returned-lookup-value",
        "item-id"
      );
    });
  });
});
