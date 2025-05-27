import { useEffect, useState } from "react";
import { Fade, Modal } from "@material-ui/core";
import useStyles from "./components/style";
import FileSaver from "file-saver";
import { ddDownload, getDownloadInfo } from "./utils";

const Download = ({ match, location }) => {
  const classes = useStyles();
  const [message, setMessage] = useState({
    type: "info",
    text: "Download in progress...",
  });

  const fileId = match.params.id;

  useEffect(() => {
    const doDownload = async () => {
      const preDownload = await getDownloadInfo(fileId);

      if (!preDownload?._meta?.success) {
        setMessage({
          type: "error",
          text: "Invalid file request",
        });
        return;
      }

      const dd = await ddDownload(
        fileId,
        location?.pathname?.includes("/public/")
      );

      const { data } = dd;

      if (dd?.status === "error") {
        setMessage({
          type: "error",
          text: dd?.response.statusText || "Error with File",
        });
      } else {
        await FileSaver.saveAs(data, preDownload.data.name);

        setMessage({
          type: "info",
          text: "Download completed.",
        });
      }
    };

    !!fileId && doDownload();
  }, [fileId, location]);

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={true}
      // onClose={closeModal}
      closeAfterTransition
      // BackdropComponent={Backdrop}
    >
      <Fade in={true}>
        <div className={classes.paper2}>
          <div
            style={{
              ...(message.type === "error" ? { color: "#FF0000" } : {}),
            }}
          >
            {message.text}
          </div>
        </div>
      </Fade>
    </Modal>
  );
};

export default Download;
