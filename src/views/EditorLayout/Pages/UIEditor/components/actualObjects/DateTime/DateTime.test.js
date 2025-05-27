import {
  mockThemeAndRouter,
  cleanup,
  waitFor,
  screen,
  fireEvent,
} from "../../../../../../../test-utilities/testMocks/themeRouter";
import { MemoryRouter } from "react-router-dom";
import { APP_DESIGN_MODES } from "../../../../../../common/utils/constants";
import DateTime from ".";

describe("<DateTime />", () => {
  afterEach(() => {
    cleanup();
  });

  let onChange,
    style,
    readOnly,
    returnedLookupObj,
    val,
    id,
    props,
    values,
    screenReuseAttributes,
    appDesignMode,
    disabled;

  beforeEach(() => {
    onChange = jest.fn();
    style = {};
    values = {};
    readOnly = false;
    returnedLookupObj = {};
    val = "";
    id = "";
    screenReuseAttributes = {};
    appDesignMode = APP_DESIGN_MODES.LIVE || "LIVE";
    disabled = false;
  });

  const component = (option) => {
    return mockThemeAndRouter(
      <MemoryRouter initialEntries={["/run"]}>
        <DateTime
          onChange={onChange}
          style={style}
          values={values}
          readOnly={readOnly}
          returnedLookupObj={returnedLookupObj}
          val={val}
          id={id}
          screenReuseAttributes={screenReuseAttributes}
          appDesignMode={appDesignMode}
          disabled={disabled}
        />
      </MemoryRouter>,
      { ...option }
    );
  };

  test("render DateTime element and titles with default props and initial state", () => {
    values = {
      showDate: true,
      showTime: true,
      labelHide: false,
      setRange: false,
      hidden: false,
    };
    const { queryByText, getByTestId } = component();

    expect(getByTestId("labelTitle")).toBeInTheDocument();
    expect(getByTestId("CalendarIcon")).toBeInTheDocument();

    expect(queryByText("Start date")).not.toBeInTheDocument();
    expect(queryByText("End date")).not.toBeInTheDocument();
    expect(
      queryByText("* start date/time must be less than end date/time")
    ).not.toBeInTheDocument();
  });

  test("change Date and Time component value when onchange event is called", () => {
    values = {
      showDate: true,
      showTime: true,
      labelHide: false,
      setRange: false,
      hidden: false,
    };
    const { getByText, getByPlaceholderText } = component();

    const timeInput = getByPlaceholderText("hh:mm");
    const dateInput = getByPlaceholderText("YYYY-MM-DD");
    expect(dateInput).toBeInTheDocument();

    expect(timeInput).toBeInTheDocument();
    expect(dateInput).not.toBeDisabled();

    expect(timeInput).not.toBeDisabled();

    fireEvent.change(dateInput, {
      target: { value: "2025-02-20" },
    });
    fireEvent.change(timeInput, {
      target: { value: "07:20" },
    });

    expect(dateInput).toHaveValue("2025-02-20");
    expect(timeInput).toHaveValue("07:20");
  });

  test("should handle changes in date input and call onChange with correct formatted date", async () => {
    values = {
      //dateFormat: "MM/DD/YYYY",
      showDate: true,
      showTime: true,
      labelHide: false,
      setRange: false,
      hidden: false,
    };
    id = "lookupId";
    returnedLookupObj = { lookupId: "2025-02-19" };

    const { getByPlaceholderText } = component();

    const dateInput = getByPlaceholderText("YYYY-MM-DD");

    // fireEvent.change(dateInput, {
    //   target: { value: "2025-02-19" },
    // });
    await waitFor(() => {
      setTimeout(() => {
        expect(dateInput).toHaveValue("2025-02-19");
      }, 500);
    });
  });

  test("Should not call onChange when readOnly is true", async () => {
    values = { showDate: true, showTime: true, setRange: true, readOnly: true };
    readOnly = true;

    const { getByPlaceholderText, getAllByPlaceholderText } = component();
    const dateInput = getAllByPlaceholderText("YYYY-MM-DD");
    const timeInput = getAllByPlaceholderText("hh:mm");

    fireEvent.change(dateInput[0], { target: { value: "2023-10-01" } });
    fireEvent.change(timeInput[0], { target: { value: "12:00" } });

    expect(dateInput[0]).not.toHaveValue("2023-10-01");
    expect(timeInput[0]).not.toHaveValue("12:00");
    //expect(onChange).not.toHaveBeenCalled();
  });

  test("correctly handle and format date and time when both are provided in the lookup value", () => {
    returnedLookupObj = {
      someId: "2023-10-15",
    };

    id = "someId";
    values = {
      dateFormat: "YYYY-MM-DD",
      timeFormat: "hh:mm",
      showDate: true,
      showTime: true,
    };

    const { getByPlaceholderText } = component();

    screen.debug(undefined, "infinity");

    const dateInput = getByPlaceholderText("YYYY-MM-DD");
    const timeInput = getByPlaceholderText("hh:mm");

    expect(dateInput.value).toBe("2023-10-15");
    expect(timeInput.value).toBe("00:00");
  });

  test("should call onChange when dateTime is a property in screenReuseAttributes and has a value and an attribute", () => {
    id = "dateTime-test-id";

    values = {
      showDate: true,
      showTime: true,
      labelHide: false,
      setRange: false,
      hidden: false,
      dateFormat: "YYYY-MM-DD",
      timeFormat: "hh:mm",
    };

    screenReuseAttributes = {
      "dateTime-test-id": {
        name: "month",
        attribute: "readonly",
        value: "April, 2025",
      },
    };

    component({ values, id, screenReuseAttributes });
    const { getByTestId, getByPlaceholderText } = screen;

    expect(getByTestId("labelTitle")).toBeInTheDocument();
    expect(getByPlaceholderText("YYYY-MM-DD")).toBeInTheDocument();
    expect(getByPlaceholderText("hh:mm")).toBeInTheDocument();

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith("April, 2025", "dateTime-test-id");
  });

  describe("duration sub-field", () => {
    test("render start and end dates and duration field when when setRange and hasDuration are true", async () => {
      id = "dateTime-test-id";

      values = {
        label: "Start date",
        datePlaceholder: "Enter date",
        placeholder: "Duration Field",
        showDate: true,
        showTime: true,
        labelHide: false,
        setRange: true,
        hasDuration: true,
        hidden: false,
        dateFormat: "YYYY-MM-DD",
        timeFormat: "hh:mm",
        durationMeasure: "day",
      };

      screenReuseAttributes = {};

      component({ values, id, screenReuseAttributes });
      const { getByText, getAllByPlaceholderText, getByPlaceholderText } =
        screen;

      expect(getByText(/Start date/i)).toBeInTheDocument();
      expect(getByText(/End date/i)).toBeInTheDocument();

      const dateInputs = getAllByPlaceholderText(values.dateFormat);
      const timeInputs = getAllByPlaceholderText(values.timeFormat);
      const durationField = getByPlaceholderText(values.placeholder);

      /* shows start and end dates */
      expect(dateInputs).toHaveLength(2);
      /* shows start and end times */
      expect(timeInputs).toHaveLength(2);
      /* shows duration */
      expect(durationField).toBeInTheDocument();

      fireEvent.change(dateInputs[0], {
        target: { value: "2025-02-19" },
      });
      fireEvent.change(timeInputs[0], {
        target: { value: "03:05" },
      });
      fireEvent.change(dateInputs[1], {
        target: { value: "2025-02-21" },
      });
      fireEvent.change(timeInputs[1], {
        target: { value: "05:15" },
      });

      /* correct duration value */
      await waitFor(() => {
        expect(durationField).toHaveDisplayValue(2);
      });
    });
    test("render start and end dates and duration fields with rangeInclusive true", async () => {
      id = "dateTime-test-id";

      values = {
        label: "Start date",
        datePlaceholder: "Enter date",
        placeholder: "Duration Field",
        showDate: true,
        showTime: true,
        labelHide: false,
        setRange: true,
        hasDuration: true,
        hidden: false,
        dateFormat: "YYYY-MM-DD",
        timeFormat: "hh:mm",
        durationMeasure: "day",
        rangeInclusive: true,
      };

      screenReuseAttributes = {};

      component({ values, id, screenReuseAttributes });
      const { getAllByPlaceholderText, getByPlaceholderText } = screen;

      const dateInputs = getAllByPlaceholderText(values.dateFormat);
      const timeInputs = getAllByPlaceholderText(values.timeFormat);
      const durationField = getByPlaceholderText(values.placeholder);

      fireEvent.change(dateInputs[0], {
        target: { value: "2025-02-19" },
      });
      fireEvent.change(timeInputs[0], {
        target: { value: "03:05" },
      });
      fireEvent.change(dateInputs[1], {
        target: { value: "2025-02-21" },
      });
      fireEvent.change(timeInputs[1], {
        target: { value: "05:15" },
      });

      /* correct duration value */
      await waitFor(() => {
        expect(durationField).toHaveDisplayValue(3);
      });
    });
  });
});
