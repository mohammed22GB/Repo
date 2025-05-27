import {
  mockThemeAndRouter,
  fireEvent,
  waitFor,
  cleanup,
  screen,
} from "../../../test-utilities/testMocks/themeRouter";
import { MemoryRouter } from "react-router-dom";
import AppDetailsDialog from "../../../views/Apps/components/AppDetailsDialog";

describe("<AppDetailsDialog />", () => {
  afterEach(() => {
    cleanup();
  });

  const query = {
    queryKey: [
      {
        appSortParams: { updatedAt: "desc" },
        selectedCategory: "HR & Admin",
        page: 1,
        perPage: 10,
      },
    ],
  };

  const component = (option) => {
    return mockThemeAndRouter(
      <MemoryRouter initialEntries={["/apps"]}>
        <AppDetailsDialog openAppDialog={true} />
      </MemoryRouter>,
      { ...option }
    );
  };

  test("Apps components are present", async () => {
    component();

    const { getByText, getAllByPlaceholderText } = screen;
    // Find all Select fields by placeholder
    const selectFields = await waitFor(() =>
      getAllByPlaceholderText("Select from the options")
    );

    // Iterate through each Select field
    for (const field of selectFields) {
      // Click the Select field
      fireEvent.click(field);

      await waitFor(() => getByText("Select Category"));

      await waitFor(() => getByText("Select owner"));
    }
  });
});
