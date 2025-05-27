import { Button, Dialog, TextField } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

import "./runStyle.css";
import { uploadFile } from "../common/helpers/LiveData";
import { uploadFileService } from "../common/helpers/LiveData/service";

const useStyles = makeStyles((theme) => ({
  /* dialogBox: {
    minWidth: "500",
  }, */
  topTabs: {
    // display: "flex",
    display: "none",
    justifyContent: "center",
    alignItems: "center",
    gap: 30,
    marginBottom: 7,
    fontSize: 12,
    "& > div": {
      padding: 10,
      position: "relative",
      cursor: "pointer",
      "&:hover::after": {
        bottom: 3,
        left: 10,
        width: 35,
        height: 2,
        content: '""',
        position: "absolute",
        backgroundColor: "#cccccc",
        zIndex: 1000,
      },
      "&.active::after": {
        bottom: 3,
        left: 10,
        width: 35,
        height: 2,
        content: '""',
        position: "absolute",
        backgroundColor: "#08014d",
      },
    },
  },
  signatureCanvas: {
    border: "inset 2px",
    height: 150,
    backgroundColor: "#f7f9fa",
    position: "relative",
  },
  typeInput: {
    position: "absolute",
    width: "60%",
    left: "20%",
    top: 10,
    backgroundColor: "#ffffff",
  },
}));

const SignatureModal = ({
  loading,
  message,
  fileName,
  signatureComponentID,
  setShowSignatureModal,
  workflowInstanceID,
}) => {
  const classes = useStyles();
  const [active, setActive] = useState("pen");
  const [signText, setSignText] = useState("");
  const [isWorking, setIsWorking] = useState(false);

  // if (!loading) return null;
  const splitFileName = fileName.substring(0, fileName.indexOf("."));
  const file_Name =
    splitFileName + "_" + Date.now() + workflowInstanceID + ".png";

  const dispatch = useDispatch();
  const sigPad = useRef();

  const createBlob = (dataURL) => {
    const BASE64_MARKER = ";base64,";
    let parts, contentType, raw;

    if (dataURL.indexOf(BASE64_MARKER) === -1) {
      parts = dataURL.split(",");
      contentType = parts[0].split(":")[1];
      raw = decodeURIComponent(parts[1]);
      return new Blob([raw], { type: contentType });
    }
    parts = dataURL.split(BASE64_MARKER);
    parts = dataURL.split(BASE64_MARKER);
    contentType = parts[0].split(":")[1];
    raw = window.atob(parts[1]);
    const rawLength = raw.length;

    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  };

  const saveSignatureCanvas = async () => {
    setIsWorking(true);

    const bodyFormData = new FormData();
    var img = sigPad.current.getTrimmedCanvas().toDataURL("image/png");
    bodyFormData.append("file", createBlob(img), file_Name);

    dispatch(uploadFile(signatureComponentID, bodyFormData, (v) => {}));

    const upload = await dispatch(uploadFileService(bodyFormData));
    if (upload?.success) {
      clearSignatureCanvas();
      setShowSignatureModal(false);
    } else {
      setIsWorking(false);
    }
  };

  const clearSignatureCanvas = () => {
    sigPad.current.clear();
    setSignText("");
  };

  return (
    <Dialog
      // onClose={() => handleCloseDialog()}
      aria-labelledby="simple-dialog-title"
      open={true}
      // className={classes.dialogBox}
      className="dialog-box"
      classes={{
        paper: "dialog-box",
      }}
    >
      <div className={classes.runDialogHeader}>
        <div className="header-text">Signature Pad</div>
        <div className="close-button"></div>
      </div>
      <div className="dialog-main">
        <div className={classes.topTabs}>
          <div
            className={active === "pen" ? "active" : ""}
            onClick={() => setActive("pen")}
          >
            Sign with pen
          </div>
          <div
            className={active === "type" ? "active" : ""}
            onClick={() => setActive("type")}
          >
            Type name
          </div>
        </div>
        <div className={classes.signatureCanvas}>
          {active === "type" && (
            <TextField
              variant="outlined"
              size="small"
              value={signText}
              onChange={(e) => setSignText(e.target.value)}
              fullWidth
              placeholder="Type in name"
              classes={{
                root: classes.typeInput,
              }}
              /* InputProps={{
                className: classes.typeInput,
              }} */
              // onChange={(e) => _setTaskInfo(e, "name")}
            />
          )}
          <SignatureCanvas
            penColor="green"
            ref={sigPad}
            canvasProps={{
              className: "sigCanvas",
            }}
          />
        </div>
      </div>
      <div className="dialog-footer">
        <Button
          variant="outlined"
          color="primary"
          className={classes._clear}
          style={{ marginRight: "auto" }}
          onClick={clearSignatureCanvas}
        >
          Clear
        </Button>
        <Button
          variant="outlined"
          color="primary"
          className={classes._cancel}
          onClick={() => setShowSignatureModal(false)}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={classes._okay}
          disabled={isWorking}
          onClick={saveSignatureCanvas}
        >
          Done
        </Button>
      </div>
    </Dialog>
  );
};

export default SignatureModal;
