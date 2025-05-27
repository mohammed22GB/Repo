import { useEffect, useState } from "react";
import { Fade, Modal } from "@material-ui/core";
import useStyles from "./components/style";
import { ddDownload, getDownloadInfo } from "./utils";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

const PreviewDownloadModal = ({ openModal, closeModal, pageUrl }) => {
  const classes = useStyles();
  const urlPath = pageUrl?.toString().split("/");
  const fileId = urlPath[urlPath?.length - 1];

  const [message, setMessage] = useState({
    type: "info",
    text: "Generating preview...",
  });

  const [previewFileUrl, setPreviewFileUrl] = useState(null);
  const [mimeType, setMimeType] = useState(null);

  const fileTypes = {
    Image: "image/",
    Video: "video/",
    Audio: "audio/",
    PDF: "application/pdf",
    Text: [
      "application/msword",
      "application/vnd.ms-excel",
      "application/vnd.ms-powerpoint",
      "text/plain",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    Zip: [
      "zip",
      "application/octet-stream",
      "application/zip",
      "application/x-zip",
      "application/x-zip-compressed",
    ],
  };

  useEffect(() => {
    const handlePreviewDownload = async () => {
      const preDownload = await getDownloadInfo(fileId);

      if (!preDownload?._meta?.success) {
        setMessage({
          type: "error",
          text: "Invalid file request",
        });
        return;
      }

      const downloadedData = await ddDownload(
        fileId,
        pageUrl?.includes("/public/")
      );

      const { data: blobData } = downloadedData;

      if (downloadedData?.status === "error") {
        setMessage({
          type: "error",
          text: downloadedData?.response.statusText || "Error with File",
        });
      } else {
        const fileBlob = new Blob([blobData], {
          type: preDownload?.data?.mimeType,
        });
        setMimeType(preDownload?.data?.mimeType);
        setMessage({
          type: "info",
          text: `${preDownload?.data?.name}`,
        });

        // preview the file
        const fileBlobToUrl = URL.createObjectURL(fileBlob); // create url from the blob data
        setPreviewFileUrl(fileBlobToUrl);
      }
    };

    !!pageUrl && handlePreviewDownload();
  }, [pageUrl]);

  const getNotAvailableToPreviewMimeTypes = (mimeType) => {
    if (mimeType?.includes(fileTypes.Audio)) {
      return "Audio files";
    }

    if (mimeType?.includes(fileTypes.Video)) {
      return "Video files";
    }
    if (fileTypes.Zip?.includes(mimeType)) {
      return "ZIP files";
    }
    if (fileTypes.Text?.includes(mimeType)) {
      return "Text or Word Documents files";
    }

    return "Uploaded file";
  };

  const isPreviewNotAvailable =
    mimeType?.includes(fileTypes.Audio) ||
    mimeType?.includes(fileTypes.Video) ||
    fileTypes.Text?.includes(mimeType) ||
    fileTypes.Zip?.includes(mimeType);

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={openModal}
      onClose={() => closeModal(null)}
      closeAfterTransition
    >
      <Fade in={true}>
        <div className={classes.paperPreview}>
          <>
            <p
              style={{
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {" "}
              {message.text}{" "}
              {!mimeType && !previewFileUrl && (
                <div className="activity-loader"></div>
              )}
            </p>

            {mimeType && previewFileUrl && (
              <IconButton
                aria-label="close"
                className={classes.closeButton}
                onClick={() => closeModal(false)}
              >
                <CloseIcon />
              </IconButton>
            )}

            {mimeType === fileTypes.PDF && previewFileUrl && (
              <iframe
                src={previewFileUrl}
                width="100%"
                height="600px"
                style={{ border: "none" }}
                title="PDF Preview"
              />
            )}

            {mimeType?.includes(fileTypes.Image) && previewFileUrl && (
              <img
                src={previewFileUrl}
                alt="Previewing"
                style={{
                  maxWidth: "100%",
                  maxHeight: "600px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            )}

            {isPreviewNotAvailable && previewFileUrl && (
              <p
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 500,
                  fontSize: "16px",
                }}
              >
                Preview for {getNotAvailableToPreviewMimeTypes(mimeType)} is
                currently not available.
              </p>
            )}
          </>
        </div>
      </Fade>
    </Modal>
  );
};

export default PreviewDownloadModal;
