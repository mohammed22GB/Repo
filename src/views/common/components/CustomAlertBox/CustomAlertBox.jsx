import { useState } from "react";
import { Button, Dialog, IconButton, makeStyles } from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import { useStyle } from "../confirmBoxStyles";

const colorCodes = {
  info: "#00529D",
  error: "#CC0000",
  warning: "#FFE032",
  success: "#41AD49",
};
const CustomAlertBox = ({
  closeConfirmBox,
  text,
  open,
  type = "warning",
  activateActionBtn = true,
  trueText = "OK",
}) => {
  const classes = useStyle(makeStyles);

  const [isLoading, setIsLoading] = useState(false);
  const generalIcon = "../../../../../../images/notification_dialog_qmark.svg";
  const successIcon = "../../../../../../images/sucess_green.svg";

  const handleOnKeyDown = (event) => {
    if (event.key === "Enter" && activateActionBtn) {
      closeConfirmBox();
    }
  };

  return (
    <Dialog
      onClose={closeConfirmBox}
      onKeyDown={handleOnKeyDown}
      aria-labelledby="simple-dialog-title"
      open={!!open}
      classes={{
        paper: classes.size,
      }}
      tabIndex={0}
    >
      <IconButton
        size="small"
        style={{ position: "absolute", top: 10, right: 10 }}
        onClick={closeConfirmBox}
      >
        <CancelIcon />
      </IconButton>
      <div className={classes.iconOuterBox}>
        <div
          className={classes.iconInnerBox}
          style={{
            backgroundColor: type === "success" ? "none" : colorCodes[type],
          }}
        >
          <img
            src={type === "success" ? successIcon : generalIcon}
            alt="confirm"
          />
        </div>
      </div>
      <div
        style={{
          color: "#010A43",
          fontSize: 14,
          marginTop: 22,
          textAlign: "center",
          maxWidth: "80%",
        }}
      >
        {text || "This feature is coming soon"}
      </div>
      <div style={{ marginTop: 40 }}>
        <Button
          style={{
            width: 60,
            height: 30,
            textTransform: "none",
            border: "solid 1.5px #000000",
          }}
          variant="contained"
          disabled={!activateActionBtn || isLoading}
          onClick={() => {
            //setIsLoading(true);
            //confirmAction();
            closeConfirmBox();
          }}
        >
          {isLoading ? "..." : trueText}
        </Button>
      </div>
    </Dialog>
  );
};

export default CustomAlertBox;
