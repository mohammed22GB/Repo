import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import * as reactRedux from "react-redux";
import configureStore from "redux-mock-store";
import SidebarLabelPreferenceSection from ".";
import { MemoryRouter } from "react-router";
import MockProvider from "../../../../../../../../../test-utilities/testMocks/reduxStore";
import { mockThemeAndRouter } from "../../../../../../../../../test-utilities/testMocks/themeRouter";

const mockStore = configureStore([]);

describe("SidebarLabelPreferenceSection", () => {
  let store;
  const mockDispatch = jest.fn();

  beforeEach(() => {
    store = mockStore({});
    // store.dispatch = mockDispatch;
    jest.spyOn(reactRedux, "useDispatch").mockReturnValue(mockDispatch);
    // reactRedux.useDispatch.mockReturnValue(mockDispatch);
  });

  const defaultProps = {
    itemType: "input",
    values: {
      labelHide: false,
      label: "Test Label",
      setRange: false,
      hasDuration: false,
    },
    index: 0,
    itemRef: "test-ref",
  };

  const renderSidebarLabelPreferencesSection = (
    props,
    updatedStoreData,
    options
  ) =>
    mockThemeAndRouter(
      <MockProvider storeData={updatedStoreData || store}>
        <MemoryRouter initialEntries={["/login"]}>
          <SidebarLabelPreferenceSection {...props} />
        </MemoryRouter>
      </MockProvider>,
      { ...(options || {}) }
    );

  it("renders without crashing", () => {
    renderSidebarLabelPreferencesSection(defaultProps);

    expect(screen.getByText("Label Preferences")).toBeInTheDocument();
  });

  it("toggles preferences section when header is clicked", () => {
    renderSidebarLabelPreferencesSection(defaultProps);

    const header = screen.getByText("Label Preferences");
    expect(screen.queryByPlaceholderText("Enter label text")).not.toBeVisible();

    fireEvent.click(header);
    expect(screen.queryByPlaceholderText("Enter label text")).toBeVisible();

    waitFor(() => {
      fireEvent.click(header);
      expect(screen.queryByPlaceholderText("Enter label text")).toBeNull();
    });

    fireEvent.click(header);
    expect(screen.queryByPlaceholderText("Enter label text")).toBeVisible();
  });

  it("dispatches update when label text is changed", () => {
    renderSidebarLabelPreferencesSection(defaultProps);

    fireEvent.click(screen.getByText("Label Preferences"));
    const input = screen.getByPlaceholderText("Enter label text");

    fireEvent.change(input, { target: { value: "New Label" } });
    fireEvent.blur(input);

    waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "UPDATE_SCREEN_ITEM_PROPERTY_VALUES",
        payload: {
          value: "New Label",
          property: "label",
          index: 0,
          itemRef: "test-ref",
          type: "input",
        },
      });
    });
  });

  it("dispatches update when label hide toggle is changed", () => {
    renderSidebarLabelPreferencesSection(defaultProps);

    fireEvent.click(screen.getByText("Label Preferences"));
    const toggle = screen.getByRole("checkbox");

    fireEvent.click(toggle);

    waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "UPDATE_SCREEN_ITEM_PROPERTY_VALUES",
        payload: {
          value: true,
          property: "labelHide",
          index: 0,
          itemRef: "test-ref",
          type: "input",
        },
      });
    });
  });

  it("renders range and duration fields when setRange is true", async () => {
    const propsWithRange = {
      ...defaultProps,
      values: {
        ...defaultProps.values,
        setRange: true,
        hasDuration: true,
        labelDateEnd: "End date",
        labelDuration: "Duration",
      },
    };

    renderSidebarLabelPreferencesSection(propsWithRange);

    fireEvent.click(screen.getByText("Label Preferences"));

    waitFor(() => {
      expect(screen.getByDisplayValue("End date")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Duration")).toBeInTheDocument();
    });
  });

  it("disables input fields when label is hidden", () => {
    const propsWithHiddenLabel = {
      ...defaultProps,
      values: {
        ...defaultProps.values,
        labelHide: true,
      },
    };

    renderSidebarLabelPreferencesSection(propsWithHiddenLabel);

    fireEvent.click(screen.getByText("Label Preferences"));

    waitFor(() => {
      const input = screen.getByPlaceholderText("Enter label text");
      expect(input).toHaveClass("Mui-disabled");
      expect(input).toBeDisabled();
    });
  });
});
