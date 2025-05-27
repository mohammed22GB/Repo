import { useState } from "react";
import { Button, Dialog, IconButton, makeStyles } from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import { useStyle } from "../confirmBoxStyles";
import PriorityHighOutlinedIcon from "@mui/icons-material/PriorityHighOutlined";

const lineColorCodes = {
  info: "#333333",
  error: "#690000",
  warning: "#6b4300",
};

const fillColorCodes = {
  info: "#00529D",
  error: "#df2c2c",
  warning: "#ffa000",
  // error: "#CC0000",
  // warning: "#FFE032",
};

const CustomConfirmBox = ({
  closeConfirmBox,
  showCloseIcon = true,
  text,
  open,
  confirmAction,
  type = "info",
  activateActionBtn = true,
  trueText = "Yes",
  falseText = "No",
  isAlertPrompt = false,
  isCompulsoryPrompt = false,
  closeDialogOnAction = true,
  isLoadingDialog = false,
  loadingDialogText = "Loading...",
  loadingAnimation = "anim1",
}) => {
  const classes = useStyle(makeStyles);

  const [isLoading, setIsLoading] = useState(false);

  const handleOnKeyDown = (event) => {
    if (event.key === "Enter" && activateActionBtn) {
      if (isAlertPrompt) {
        closeConfirmBox();
      } else {
        confirmAction();
        closeDialogOnAction && closeConfirmBox();
      }
    }
  };

  return open ? (
    <Dialog
      onClose={closeConfirmBox}
      onKeyDown={handleOnKeyDown}
      aria-labelledby="simple-dialog-title"
      open={!!open}
      classes={{
        paper: classes.size,
      }}
      tabIndex={0}
      className={isLoadingDialog ? "no-box-bg" : ""}
    >
      {!isLoadingDialog ? (
        <>
          {showCloseIcon && !isCompulsoryPrompt && (
            <IconButton
              size="small"
              style={{ position: "absolute", top: 10, right: 10 }}
              onClick={closeConfirmBox}
            >
              <CancelIcon />
            </IconButton>
          )}
          <div
            className={classes.iconOuterBox}
            style={{ borderColor: lineColorCodes[type] }}
          >
            <div
              className={classes.iconInnerBox}
              style={{ backgroundColor: fillColorCodes[type] }}
            >
              {type !== "error" && !isCompulsoryPrompt ? (
                <img
                  src="../../../../../../images/notification_dialog_qmark.svg"
                  alt="confirm"
                />
              ) : (
                <PriorityHighOutlinedIcon
                  style={{ color: "#ffffff", fontSize: 60 }}
                />
              )}
            </div>
          </div>
          <div
            style={{
              color: "#010A43",
              fontSize: 14,
              lineHeight: 1.7,
              marginTop: 22,
              textAlign: "center",
              maxWidth: "80%",
              maxHeight: 115,
              overflow: "auto",
            }}
          >
            {text || "Are you sure you want to publish this app?"}
          </div>
          <div
            style={{
              display: "flex",
              gap: 20,
              marginTop: 40,
              width: "100%",
              justifyContent: "center",
            }}
          >
            {!isCompulsoryPrompt && (
              <Button
                style={{
                  width: isAlertPrompt ? 100 : 60,
                  height: 30,
                  textTransform: "none",
                  border: "solid 1.5px #666666",
                  minWidth: "fit-content",
                }}
                disabled={isLoading}
                onClick={() => closeConfirmBox(true)}
              >
                {falseText}
              </Button>
            )}
            {!isAlertPrompt && (
              <Button
                style={{
                  width: isCompulsoryPrompt ? 100 : 60,
                  height: 30,
                  textTransform: "none",
                  border: "solid 1.5px #000000",
                  minWidth: "fit-content",
                }}
                variant="contained"
                disabled={!activateActionBtn || isLoading}
                onClick={() => {
                  setIsLoading(closeDialogOnAction); //  closeDialogOnAction is added so (false-) button stays active, for post-loading
                  confirmAction();
                  closeDialogOnAction && closeConfirmBox();
                }}
              >
                {isLoading ? "..." : trueText}
              </Button>
            )}
          </div>
        </>
      ) : (
        <>
          <div
            className={
              loadingAnimation === "anim2"
                ? "dialog-loading2"
                : "dialog-loading"
            }
          ></div>
          <div style={{ color: "#ffffff", fontSize: 14, fontWeight: 700 }}>
            {loadingDialogText}
          </div>
        </>
      )}
    </Dialog>
  ) : null;
};

export default CustomConfirmBox;
