import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PreviewDownloadModal from "./PreviewDownloadModal";
import { getDownloadInfo, ddDownload } from "./utils";

// Mock dependencies
jest.mock("./utils", () => ({
  getDownloadInfo: jest.fn(),
  ddDownload: jest.fn(),
}));

jest.mock("@material-ui/core/styles", () => ({
  makeStyles: () => () => ({
    modal: "modal-class",
    paperPreview: "paper-preview-class",
    closeButton: "close-button-class",
  }),
}));

global.URL.createObjectURL = jest.fn();

describe("PreviewDownloadModal Component", () => {
  const mockProps = {
    openModal: true,
    closeModal: jest.fn(),
    pageUrl: "https://example.com/files/preview/test-file-id",
  };

  const mockBlob = new Blob(["file content"], { type: "application/pdf" });
  const mockFileUrl = "blob:https://example.com/mock-blob-url";

  beforeEach(() => {
    jest.clearAllMocks();
    URL.createObjectURL.mockReturnValue(mockFileUrl);
  });

  test("renders loading state initially", () => {
    render(<PreviewDownloadModal {...mockProps} />);

    expect(screen.getByText("Generating preview...")).toBeInTheDocument();
    expect(document.querySelector(".activity-loader")).toBeInTheDocument();
  });

  test("displays PDF preview correctly", async () => {
    getDownloadInfo.mockResolvedValue({
      _meta: { success: true },
      data: {
        name: "test-document.pdf",
        mimeType: "application/pdf",
      },
    });

    ddDownload.mockResolvedValue({
      data: mockBlob,
    });

    render(<PreviewDownloadModal {...mockProps} />);

    // Wait for preview to load
    await waitFor(() => {
      expect(screen.getByText("test-document.pdf")).toBeInTheDocument();
    });

    // Check that the iframe is rendered with correct props
    const iframe = screen.getByTitle("PDF Preview");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("src", mockFileUrl);
  });

  test("displays image preview correctly", async () => {
    getDownloadInfo.mockResolvedValue({
      _meta: { success: true },
      data: {
        name: "test-image.jpg",
        mimeType: "image/jpeg",
      },
    });

    ddDownload.mockResolvedValue({
      data: new Blob(["image data"], { type: "image/jpeg" }),
    });

    render(<PreviewDownloadModal {...mockProps} />);

    // Wait for preview to load
    await waitFor(() => {
      expect(screen.getByText("test-image.jpg")).toBeInTheDocument();
    });

    // Check that the image is rendered with correct props
    const image = screen.getByAltText("Previewing");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", mockFileUrl);
  });

  test("shows message for file types that cannot be previewed", async () => {
    getDownloadInfo.mockResolvedValue({
      _meta: { success: true },
      data: {
        name: "test-audio.mp3",
        mimeType: "audio/mpeg",
      },
    });

    ddDownload.mockResolvedValue({
      data: new Blob(["audio data"], { type: "audio/mpeg" }),
    });

    render(<PreviewDownloadModal {...mockProps} />);

    // Wait for preview message
    await waitFor(() => {
      expect(
        screen.getByText(/Preview for Audio files is currently not available/)
      ).toBeInTheDocument();
    });
  });

  test("shows message for Word document files that cannot be previewed", async () => {
    getDownloadInfo.mockResolvedValue({
      _meta: { success: true },
      data: {
        name: "test-document.docx",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      },
    });

    ddDownload.mockResolvedValue({
      data: new Blob(["document data"], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      }),
    });

    render(<PreviewDownloadModal {...mockProps} />);

    // Wait for preview message
    await waitFor(() => {
      expect(
        screen.getByText(
          /Preview for Text or Word Documents files is currently not available/
        )
      ).toBeInTheDocument();
    });
  });

  test("shows error when download info fetch fails", async () => {
    // Setup mock for failed pre-download
    getDownloadInfo.mockResolvedValue({
      _meta: { success: false },
    });

    render(<PreviewDownloadModal {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText("Invalid file request")).toBeInTheDocument();
    });
  });

  test("shows error when download fails", async () => {
    getDownloadInfo.mockResolvedValue({
      _meta: { success: true },
      data: { name: "test-file.pdf", mimeType: "application/pdf" },
    });

    ddDownload.mockResolvedValue({
      status: "error",
      response: { statusText: "File not found" },
    });

    render(<PreviewDownloadModal {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText("File not found")).toBeInTheDocument();
    });
  });

  test("close button calls closeModal function", async () => {
    getDownloadInfo.mockResolvedValue({
      _meta: { success: true },
      data: { name: "test-file.pdf", mimeType: "application/pdf" },
    });

    ddDownload.mockResolvedValue({
      data: mockBlob,
    });

    render(<PreviewDownloadModal {...mockProps} />);

    // Wait for the close button to appear
    await waitFor(() => {
      expect(screen.getByText("test-file.pdf")).toBeInTheDocument();
    });

    // Click the close button
    userEvent.click(screen.getByLabelText("close"));

    // Check if closeModal was called with false
    expect(mockProps.closeModal).toHaveBeenCalledWith(false);
  });
});
