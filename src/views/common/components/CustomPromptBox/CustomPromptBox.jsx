import React, { useState } from "react";
import {
  Button,
  Dialog,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useStyles } from "../customDialogStyle";
import CancelIcon from "@material-ui/icons/Cancel";

import { errorToastify } from "../../utils/Toastify";

const CustomPromptBox = ({
  title = "Confirm Deletion",
  actionText = "Kindly type “delete” in the text field below to continue this action. Note that you lose the app and all its contents.",
  handleCloseDialog,
  confirmAction,
  open,
}) => {
  const [text, setText] = useState("");
  const classes = useStyles(makeStyles);

  const handleConfirm = () => {
    if (text?.toLowerCase() === "delete") {
      confirmAction();
      handleCloseDialog();
    } else {
      errorToastify("Wrong text. Kindly enter text correctly");
    }
  };

  return (
    <Dialog
      onClose={() => handleCloseDialog(false)}
      aria-labelledby="simple-dialog-title"
      open={open}
      classes={{
        paper: classes.size,
      }}
    >
      <Grid item className={classes.topView}>
        <Typography className={classes.title}>{title}</Typography>
        <IconButton size="small" onClick={() => handleCloseDialog()}>
          <CancelIcon />
        </IconButton>
      </Grid>
      <Grid item className={classes.actionText}>
        <p>{actionText}</p>
      </Grid>
      <Grid item className={classes.formWrapper}>
        <form>
          <TextField
            fullWidth
            type="text"
            placeholder="delete"
            variant="outlined"
            inputMode="text"
            size="small"
            value={text}
            className={classes.input}
            inputProps={{
              className: classes.formInput,
            }}
            onChange={(e) => setText(e.target.value)}
          />
        </form>
      </Grid>

      <div className={classes.buttonView}>
        <Button onClick={() => handleCloseDialog()}>Cancel</Button>
        <Button title={"deleteBtn"} variant="contained" onClick={handleConfirm}>
          Done
        </Button>
      </div>
    </Dialog>
  );
};

export default CustomPromptBox;
