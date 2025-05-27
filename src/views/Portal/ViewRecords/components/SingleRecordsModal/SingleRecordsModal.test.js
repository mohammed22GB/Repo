import {
  mockThemeAndRouter,
  cleanup,
  screen,
  waitFor,
  fireEvent,
} from "../../../../../test-utilities/testMocks/themeRouter";
import { MemoryRouter } from "react-router-dom";
import { server } from "../../../../../setupTests";
import { act } from "react-dom/test-utils";
import { getSingleRecords } from "../../../../../test-utilities/testMocks/handlers/records";
import { getSingleWorkflowInstance } from "../../../../Analytics/AnalyticsApis";
import SingleRecordsModal from ".";

jest.mock("../../../../../views/Analytics/AnalyticsApis");

describe("<SingleRecordsModal />", () => {
  beforeEach(async () => {
    await act(async () => {
      server.use(getSingleRecords);
      const data = await getSingleWorkflowInstance({
        id: "6765651ab05df3e64437c476",
      });
    });
  });
  afterEach(() => {
    cleanup();
  });

  const component = (option) => {
    return mockThemeAndRouter(
      <MemoryRouter initialEntries={["/portal/records"]}>
        <SingleRecordsModal
          selectedID={"6765651ab05df3e64437c476"}
          open={true}
        />
      </MemoryRouter>,
      { ...option }
    );
  };

  test.skip("it should render Records header details", async () => {
    component();
    const { getByText, getByTestId, getAllByText } = screen;

    const appTxt = await waitFor(() => getAllByText("Som app a"));
    expect(appTxt).toHaveLength(2);
    const categoryTxt = await waitFor(() =>
      getAllByText("Software engineering")
    );
    expect(categoryTxt).toHaveLength(2);

    //screen.debug(undefined, Infinity);
  });
  test.skip("it should render summary section details", async () => {
    component();
    const { getByText, getByRole, getAllByText } = screen;

    const summaryArea = await waitFor(() => getByRole("summaryArea"));
    expect(summaryArea).toBeInTheDocument();
    const titleTxt = await waitFor(() => getAllByText("HR Approval"));
    expect(titleTxt[0]).toBeInTheDocument();
  });
  test.skip("it should render task history section details", async () => {
    component();
    const { getByText, getByRole } = screen;

    const taskHistory = await waitFor(() => getByText("Task History"));
    expect(taskHistory).toBeInTheDocument();
    const menuIcon = await waitFor(() => getByRole("moreIcon"));
    expect(menuIcon).toBeInTheDocument();
    const timeStampRowText = await waitFor(() => getByText("20-Dec 13:37"));
    expect(timeStampRowText).toBeInTheDocument();

    // Check for process time in task history
    const processTimeText = await waitFor(() => getByText("30 mins, 0 secs"));
    expect(processTimeText).toBeInTheDocument();
  });

  test.skip("it should render Menu popup on Task history section", async () => {
    component();
    const { getByText, getByRole, getAllByText } = screen;

    const taskHistory = await waitFor(() => getByText("Task History"));
    const menuIcon = await waitFor(() => getByRole("moreIcon"));
    expect(menuIcon).toBeInTheDocument();

    fireEvent.click(menuIcon);
    const reminderButton = await waitFor(() => getByText("Send Reminder"));
    expect(reminderButton).toBeInTheDocument();
    fireEvent.click(taskHistory);

    setTimeout(() => {
      expect(reminderButton).not.toBeInTheDocument();
    }, 500);
  });

  test.skip("it should render Approval history section details", async () => {
    component();
    const { getByText } = screen;

    const approvalTitle = await waitFor(() => getByText("Approval History"));
    expect(approvalTitle).toBeInTheDocument();
    const noContent = await waitFor(() =>
      getByText("No approval history found")
    );
    expect(noContent).toBeInTheDocument();

    // Check for process time in approval history
    const approvalProcessTimeText = await waitFor(() =>
      getByText("1 hrs, 0 mins, 0 secs")
    );
    expect(approvalProcessTimeText).toBeInTheDocument();
  });
});
