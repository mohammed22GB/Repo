import { cleanup, screen } from "@testing-library/react";
import SidebarFieldPreferenceSection from ".";
import { mockProviders } from "../../../../../../../../../test-utilities/mockProviders";
import * as reactRedux from "react-redux";
import { updateScreenItemPropertyValues } from "../../../../../utils/uieditorHelpers";
import userEvent from "@testing-library/user-event";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
}));

jest.mock("../../../../../utils/uieditorHelpers", () => ({
  updateScreenItemPropertyValues: jest.fn(),
}));

let props = {
  itemType: "dateTime",
  name: "dateTime-1744801776954",
  title: "Date-Time",
  itemRef: "6780749c-4266-43b0-afce-7879c9748add",
  values: {
    init: true,
    label: "Enter date label here",
    datePlaceholder: "Enter date placeholder here",
    timePlaceholder: "Enter time placeholder here",
    toolTip: "Enter toolTip",
    hideLabel: false,
    showDate: true,
    showTime: true,
    showTooltip: false,
    rangeStartId: "d2adef05-d22f-45de-9fb7-745228ea1983",
    rangeEndId: "56a931af-558b-4980-a737-50b04e134734",
    rangeDurationId: "745104df-713f-482c-9ff2-4213c20c5345",
    setRange: true,
    hasDuration: false,
  },
};

const SidebarFieldPreferenceSectionComponent = (props) => {
  return mockProviders(<SidebarFieldPreferenceSection {...props} />);
};

describe("SidebarFieldPreferenceSection", () => {
  beforeEach(() => {
    const mockDispatch = jest.fn();
    const mockResponse = jest.fn();

    reactRedux.useDispatch.mockReturnValue(mockDispatch);
    updateScreenItemPropertyValues.mockImplementation(
      () => async (dispatch) => {
        dispatch(mockResponse);
        return mockResponse;
      }
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("should pass false for property 'notAffectVariables' onChange of Switch with property 'setRange', inorder to trigger workflow reload when user routes to the workflow page", async () => {
    props.values.setRange = false;

    SidebarFieldPreferenceSectionComponent(props);

    const switchButton = screen.getByTestId(
      `toggle-switch-setRange-${props.itemRef}`
    );

    expect(switchButton).toBeInTheDocument();

    userEvent.click(switchButton);

    expect(updateScreenItemPropertyValues).toHaveBeenCalledTimes(1);
    expect(updateScreenItemPropertyValues).toHaveBeenCalledWith(
      expect.objectContaining({
        value: true,
        property: "setRange",
        itemRef: props.itemRef,
        type: "dateTime",
        notAffectVariables: false,
      })
    );
  });

  test("should pass false for property 'notAffectVariables' onChange of Switch with property 'hasDuration', inorder to trigger workflow reload when user routes to the workflow page", async () => {
    props.values.setRange = true;
    props.values.hasDuration = false;

    SidebarFieldPreferenceSectionComponent(props);

    const switchButton = screen.getByTestId(
      `toggle-switch-hasDuration-${props.itemRef}`
    );

    expect(switchButton).toBeInTheDocument();

    userEvent.click(switchButton);

    expect(updateScreenItemPropertyValues).toHaveBeenCalledTimes(1);
    expect(updateScreenItemPropertyValues).toHaveBeenCalledWith(
      expect.objectContaining({
        value: true,
        property: "hasDuration",
        itemRef: props.itemRef,
        type: "dateTime",
        notAffectVariables: false,
      })
    );
  });

  describe("datetime preferences", () => {
    test("render SidebarFieldPreferenceSection component", () => {
      SidebarFieldPreferenceSectionComponent();

      expect(screen.getByText(/Component preferences/i)).toBeInTheDocument();
    });

    test("render SidebarFieldPreferenceSection component", async () => {
      props = {
        itemType: "dateTime",
      };

      SidebarFieldPreferenceSectionComponent(props);

      expect(screen.getByText(/Component preferences/i)).toBeInTheDocument();
      expect(screen.getByText(/Show date/i)).toBeInTheDocument();
      expect(screen.getByText(/Show time/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Format/i)).toHaveLength(2);
      expect(screen.getByText(/Set range/i)).toBeInTheDocument();
      expect(screen.getByText(/Stack date\/time/i)).toBeInTheDocument();
      expect(screen.queryByText(/Duration/i)).toBeNull();
      expect(screen.queryByText(/Measure/i)).toBeNull();
      expect(screen.queryByText(/Days inclusive/i)).toBeNull();
    });

    test("render show datetime properties based on values props", async () => {
      props = {
        itemType: "dateTime",
        values: {
          setRange: true,
          hasDuration: true,
          durationMeasure: "day",
        },
      };

      SidebarFieldPreferenceSectionComponent(props);

      expect(screen.getByText(/Component preferences/i)).toBeInTheDocument();
      expect(screen.getByText(/Show date/i)).toBeInTheDocument();
      expect(screen.getByText(/Show time/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Format/i)).toHaveLength(2);
      expect(screen.getByText(/Set range/i)).toBeInTheDocument();
      expect(screen.getByText(/Stack date\/time/i)).toBeInTheDocument();
      expect(screen.getByText(/Duration/i)).toBeInTheDocument();
      expect(screen.getByText(/Measure/i)).toBeInTheDocument();
      expect(screen.getByText(/Days inclusive/i)).toBeInTheDocument();
    });
  });
});
