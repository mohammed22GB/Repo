import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import FileSaver from "file-saver";
import Download from "./index";
import { getDownloadInfo, ddDownload } from "./utils";

// Mock dependencies
jest.mock("file-saver", () => ({
  saveAs: jest.fn(),
}));

jest.mock("./utils", () => ({
  getDownloadInfo: jest.fn(),
  ddDownload: jest.fn(),
}));

jest.mock("@material-ui/core/styles", () => ({
  makeStyles: () => () => ({
    modal: "modal-class",
    paper2: "paper-class",
  }),
}));

describe("Download Component", () => {
  const mockMatch = {
    params: {
      id: "test-file-id",
    },
  };

  const mockLocation = {
    pathname: "/files/download/test-file-id",
  };

  const mockPublicLocation = {
    pathname: "/public/files/download/test-file-id",
  };

  const mockFile = new Blob(["file content"], { type: "text/plain" });
  const mockFileName = "test-file.txt";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders download modal with loading message initially", () => {
    render(
      <MemoryRouter>
        <Download match={mockMatch} location={mockLocation} />
      </MemoryRouter>
    );

    expect(screen.getByText("Download in progress...")).toBeInTheDocument();
  });

  test("downloads file successfully and shows completion message", async () => {
    getDownloadInfo.mockResolvedValue({
      _meta: { success: true },
      data: { name: mockFileName },
    });

    ddDownload.mockResolvedValue({
      data: mockFile,
    });

    render(
      <MemoryRouter>
        <Download match={mockMatch} location={mockLocation} />
      </MemoryRouter>
    );

    // Initial loading state
    expect(screen.getByText("Download in progress...")).toBeInTheDocument();

    // Wait for the download to complete
    await waitFor(() => {
      expect(screen.getByText("Download completed.")).toBeInTheDocument();
    });

    // Verify API calls
    expect(getDownloadInfo).toHaveBeenCalledWith("test-file-id");
    expect(ddDownload).toHaveBeenCalledWith("test-file-id", false);
    expect(FileSaver.saveAs).toHaveBeenCalledWith(mockFile, mockFileName);
  });

  test("handles public file download correctly", async () => {
    getDownloadInfo.mockResolvedValue({
      _meta: { success: true },
      data: { name: mockFileName },
    });

    ddDownload.mockResolvedValue({
      data: mockFile,
    });

    render(
      <MemoryRouter>
        <Download match={mockMatch} location={mockPublicLocation} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Download completed.")).toBeInTheDocument();
    });

    // Verify it was called with public flag
    expect(ddDownload).toHaveBeenCalledWith("test-file-id", true);
  });

  test("shows error message when download info fetch fails", async () => {
    // Setup mock for failed pre-download
    getDownloadInfo.mockResolvedValue({
      _meta: { success: false },
    });

    render(
      <MemoryRouter>
        <Download match={mockMatch} location={mockLocation} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Invalid file request")).toBeInTheDocument();
    });

    // Verify that download was not attempted
    expect(ddDownload).not.toHaveBeenCalled();
    expect(FileSaver.saveAs).not.toHaveBeenCalled();
  });

  test("shows error message when download fails", async () => {
    getDownloadInfo.mockResolvedValue({
      _meta: { success: true },
      data: { name: mockFileName },
    });

    ddDownload.mockResolvedValue({
      status: "error",
      response: { statusText: "File not found" },
    });

    render(
      <MemoryRouter>
        <Download match={mockMatch} location={mockLocation} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("File not found")).toBeInTheDocument();
    });

    // Verify that saveAs was not called
    expect(FileSaver.saveAs).not.toHaveBeenCalled();
  });

  test("handles error with no statusText gracefully", async () => {
    getDownloadInfo.mockResolvedValue({
      _meta: { success: true },
      data: { name: mockFileName },
    });

    ddDownload.mockResolvedValue({
      status: "error",
      response: {},
    });

    render(
      <MemoryRouter>
        <Download match={mockMatch} location={mockLocation} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Error with File")).toBeInTheDocument();
    });
  });

  test("does not attempt download when fileId is missing", () => {
    const emptyMatch = { params: {} };

    render(
      <MemoryRouter>
        <Download match={emptyMatch} location={mockLocation} />
      </MemoryRouter>
    );

    expect(getDownloadInfo).not.toHaveBeenCalled();
    expect(ddDownload).not.toHaveBeenCalled();
  });
});
