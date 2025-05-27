import React from "react";
import "@testing-library/jest-dom";
import {
  mockThemeAndRouter,
  fireEvent,
  waitFor,
  screen,
} from "../../../../../test-utilities/testMocks/themeRouter";
import { MemoryRouter } from "react-router-dom";
import CustomizationModal from "../../../../../views/SettingsLayout/Pages/Customizations/components/CustomizationModal";
import {
  ModalMode,
  DetailsMode,
} from "../../../../../views/SettingsLayout/Pages/Customizations/utils/customizationutils";
import { getAppsList } from "../../../../../views/common/components/Query/AppsQuery/queryApp";

jest.setTimeout(12000);

const CustomizationModalcomponent = (option) => {
  return mockThemeAndRouter(
    <MemoryRouter initialEntries={["/settings/customizations"]}>
      <CustomizationModal
        open={true}
        modalMode={ModalMode.QuickAccess}
        detailsMode={DetailsMode.MenuItemDetails}
        modalDetails={{}}
        id="test-modal-id"
        menuSettingItems={[]}
        onModalSave={jest.fn()}
        onDelete={jest.fn()}
        handleClose={jest.fn()}
      />
    </MemoryRouter>,
    { ...option }
  );
};

jest.mock(
  "../../../../../views/common/components/Query/AppsQuery/queryApp",
  () => {
    return {
      getAppsList: jest.fn(),
    };
  }
);

describe("CustomizationModal Quick Access", () => {
  test('calls getAppsList when "Load More" is clicked to add more apps', async () => {
    const mockPage1Data = {
      data: {
        data: [
          {
            _id: "appId1",
            name: "Mock App One",
            description: "Random-app-one",
            slug: "mock-app-one",
          },
          {
            _id: "appId2",
            name: "Mock App Two",
            description: "Random-app-two",
            slug: "mock-app-two",
          },
        ],
        _meta: { pagination: { next: 2 } },
      },
    };

    const mockPage2Data = {
      data: {
        data: [
          {
            _id: "appId3",
            name: "Mock App Three",
            description: "Random-app-three",
            slug: "mock-app-three",
          },
          {
            _id: "appId4",
            name: "Mock App Four",
            description: "Random-app-four",
            slug: "mock-app-four",
          },
        ],
        _meta: { pagination: { next: 3 } },
      },
    };

    getAppsList
      .mockResolvedValueOnce(mockPage1Data)
      .mockResolvedValueOnce(mockPage2Data);

    CustomizationModalcomponent({
      open: true,
      modalMode: ModalMode.QuickAccess,
    });

    // 1) Check that the heading and subheading for Quick Access are present
    expect(screen.getByText("Select for quick access")).toBeInTheDocument();

    expect(
      screen.getByText(
        "Select all default quick access apps (must be maximum of 5)"
      )
    ).toBeInTheDocument();

    // 2) Verify getAppsList is called on mount (once):
    expect(getAppsList).toHaveBeenCalledTimes(1);

    // Wait for the apps from the first mock call to appear.
    expect(await screen.findByText("Mock App One")).toBeInTheDocument();
    expect(screen.getByText("Mock App Two")).toBeInTheDocument();

    // 3) Check that the Save button is in the document and is disabled
    const saveButton = screen.getByRole("button", { name: /save/i });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toBeDisabled();

    const loadMoreButton = await screen.findByRole("button", {
      name: /Load More/i,
    });
    expect(loadMoreButton).toBeInTheDocument();

    // 4) Click "Load More" and verify a second API call:
    fireEvent.click(loadMoreButton);
    expect(getAppsList).toHaveBeenCalledTimes(2);

    // 5) Mock data for second call should now appear in the DOM:
    await waitFor(() => {
      expect(screen.getByText("Mock App Three")).toBeInTheDocument();
      expect(screen.getByText("Mock App Four")).toBeInTheDocument();
    });
  });
});
