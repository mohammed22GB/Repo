import { useEffect, useState } from "react";
import { Button, Dialog, makeStyles } from "@material-ui/core";
import { useStyle } from "../confirmBoxStyles";

const colorCodes = {
  info: "#00529D",
  error: "red",
  warning: "#ffe032",
};

const CustomConfirmBoxV2 = ({
  closeConfirmBox,
  text,
  open,
  confirmAction,
  type = "info",
  activateActionBtn = true,
  trueText = "Yes",
  falseText = "No",
  hasFalseButton = false,
}) => {
  const classes = useStyle(makeStyles);

  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(open);

  return (
    <Dialog
      aria-labelledby="simple-dialog-title"
      open={showModal}
      classes={{
        paper: classes.customModaltwo,
      }}
      tabIndex={0}
    >
      <div className={classes.iconOuterBoxtwo}>
        <div
          className={classes.iconInnerBox}
          style={{ backgroundColor: colorCodes[type] }}
        >
          <img
            src="../../../../../../images/notification_dialog_qmark.svg"
            alt="confirm"
          />
        </div>
      </div>
      <div className={classes.modalTwoText}>
        {text || "Are you sure you want to publish this app?"}
      </div>
      <div
        style={{
          paddingTop: 40,
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        {hasFalseButton && (
          <Button className={classes.modalButton}>{falseText}</Button>
        )}

        <Button
          className={classes.modalButton}
          variant="contained"
          onClick={() => setShowModal(false)}
        >
          {isLoading ? "..." : trueText}
        </Button>
      </div>
    </Dialog>
  );
};

export default CustomConfirmBoxV2;
