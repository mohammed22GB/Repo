import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider, setLogger } from "react-query";

import { AccountDump } from "./index";
import { exportAccountsAPI } from "../../../common/components/Mutation/ProfileSetting/userMutations";
import { successToastify, errorToastify } from "../../../common/utils/Toastify";
import { clickMultiSelect } from "../../../../test-utilities/clickMultiSelect";
import { transformData } from "../dumpHandlers";

import userEvent from "@testing-library/user-event";

jest.setTimeout(12000);

jest.mock(
  "../../../common/components/Mutation/ProfileSetting/userMutations",
  () => {
    return {
      ...jest.requireActual(
        "../../../common/components/Mutation/ProfileSetting/userMutations"
      ),
      exportAccountsAPI: jest.fn(),
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

describe("AccountDump", () => {
  const queryClient = new QueryClient();
  const mockHandleClose = jest.fn();

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
    return render(<AccountDump {...props} />, {
      wrapper: ({ children }) => {
        return (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        );
      },
    });
  };

  it("renders account dump form", () => {
    renderComponent({
      handleClose: mockHandleClose,
    });

    expect(screen.getByText("Select account fields")).toBeInTheDocument();
    expect(screen.getByText("File name")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Export" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    renderComponent({
      handleClose: mockHandleClose,
    });

    const exportButton = screen.getByRole("button", { name: "Export" });
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(
        screen.getByText("Account field must have at least 1 items")
      ).toBeInTheDocument();
    });
  });

  it("calls export API with correct values on submit", async () => {
    exportAccountsAPI.mockResolvedValueOnce({ data: { data: [] } });

    renderComponent({
      handleClose: mockHandleClose,
    });

    clickMultiSelect("Select account", ["Id", "Name"]);

    const filenameInput = screen.getByDisplayValue("Account Dump");
    userEvent.type(filenameInput, "test-export");

    const downloadButton = screen.queryByText("Download");
    expect(downloadButton).not.toBeInTheDocument();

    transformData.mockReturnValueOnce([
      {
        _id: "test-id",
        name: "Test Account",
        id: "test-id",
      },
    ]);

    const exportButton = screen.getByText("Export");
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(exportAccountsAPI).toHaveBeenCalledWith(
        expect.objectContaining({
          all: true,
          selection: ["_id", "name"],
        })
      );

      expect(successToastify).toHaveBeenCalledWith(
        "Account dump exported successfully"
      );
    });

    const downloadButtonAfterSuccess = screen.getByText("Download");
    expect(downloadButtonAfterSuccess).toBeInTheDocument();
  });

  it("shows error toast on export failure", async () => {
    exportAccountsAPI.mockRejectedValueOnce(new Error("Export failed"));

    renderComponent({
      handleClose: mockHandleClose,
    });

    clickMultiSelect("Select account", ["Id", "Name"]);

    const downloadButton = screen.queryByText("Download");
    expect(downloadButton).not.toBeInTheDocument();

    const exportButton = screen.getByText("Export");
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(errorToastify).toHaveBeenCalledWith(
        "Failed to export account dump"
      );
    });

    const downloadButtonAfterError = screen.queryByText("Download");
    expect(downloadButtonAfterError).not.toBeInTheDocument();
  });

  it("closes dialog when cancel is clicked", () => {
    renderComponent({
      handleClose: mockHandleClose,
    });

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelButton);

    expect(mockHandleClose).toHaveBeenCalled();
  });
});
