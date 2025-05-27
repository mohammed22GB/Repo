import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider, setLogger } from "react-query";

import { UserDump } from "./index";
import { exportUserAPI } from "../../../common/components/Mutation/ProfileSetting/userMutations";
import { successToastify, errorToastify } from "../../../common/utils/Toastify";
import { clickMultiSelect } from "../../../../test-utilities/clickMultiSelect";
import { transformData } from "../dumpHandlers";

jest.setTimeout(120000); // Increased timeout to prevent flakiness due to slow API responses or complex rendering.

jest.mock(
  "../../../common/components/Mutation/ProfileSetting/userMutations",
  () => {
    return {
      ...jest.requireActual(
        "../../../common/components/Mutation/ProfileSetting/userMutations"
      ),
      exportUserAPI: jest.fn(),
    };
  }
);

jest.mock("../../../common/utils/Toastify", () => {
  return {
    ...jest.requireActual("../../../common/utils/Toastify"),
    successToastify: jest.fn(),
    errorToastify: jest.fn(),
  };
});

jest.mock("../dumpHandlers", () => {
  return {
    ...jest.requireActual("../dumpHandlers"),
    transformData: jest.fn(),
  };
});

describe("UserDump", () => {
  const queryClient = new QueryClient();
  const mockHandleClose = jest.fn();
  const mockAccountId = "test-account-id";

  beforeAll(() => {
    setLogger({
      ...console,
      error: jest.fn(),
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  const renderComponent = (props = defaultProps) => {
    return render(<UserDump {...props} />, {
      wrapper: ({ children }) => {
        return (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        );
      },
    });
  };

  it("renders required form fields", () => {
    renderComponent({
      handleClose: mockHandleClose,
      accountId: mockAccountId,
    });

    expect(screen.getByText("Select user fields")).toBeInTheDocument();
    expect(screen.getByText("File name")).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    renderComponent({
      handleClose: mockHandleClose,
      accountId: mockAccountId,
    });

    const exportButton = screen.getByText("Export");
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(
        screen.getByText("User field must have at least 1 items")
      ).toBeInTheDocument();
    });
  });

  it("calls export API with correct values on submit", async () => {
    exportUserAPI.mockResolvedValueOnce({ data: { data: [] } });

    renderComponent({
      handleClose: mockHandleClose,
      accountId: mockAccountId,
    });

    clickMultiSelect("Select user", ["Email"]);

    const filenameInput = screen.getByDisplayValue("User Dump");
    fireEvent.change(filenameInput, { target: { value: "test-export" } });

    const downloadButton = screen.queryByText("Download");
    expect(downloadButton).not.toBeInTheDocument();

    transformData.mockReturnValueOnce([
      {
        _id: "test-id",
        email: "test-email",
        id: "test-id",
      },
    ]);

    const exportButton = screen.getByText("Export");
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(exportUserAPI).toHaveBeenCalledWith(
        expect.objectContaining({
          query: { account: mockAccountId },
          all: true,
          selection: ["email"],
        })
      );
      expect(successToastify).toHaveBeenCalledWith(
        "User dump exported successfully"
      );
    });

    const downloadButtonAfterSuccess = screen.getByText("Download");
    expect(downloadButtonAfterSuccess).toBeInTheDocument();
  });

  it("shows error toast on API failure", async () => {
    exportUserAPI.mockRejectedValueOnce(new Error("API Error"));

    renderComponent({
      handleClose: mockHandleClose,
      accountId: mockAccountId,
    });

    clickMultiSelect("Select user", ["Email"]);

    const filenameInput = screen.getByDisplayValue("User Dump");
    fireEvent.change(filenameInput, { target: { value: "test-export" } });

    const downloadButton = screen.queryByText("Download");
    expect(downloadButton).not.toBeInTheDocument();

    const exportButton = screen.getByText("Export");
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(errorToastify).toHaveBeenCalledWith("Failed to export user dump");
    });

    const downloadButtonAfterError = screen.queryByText("Download");
    expect(downloadButtonAfterError).not.toBeInTheDocument();
  });
});
