import { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { FormHelperText, makeStyles } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "@material-ui/icons/CancelRounded";
import { useStyles } from "../utils/dashboardsStyle";

const NewDashboardDialog = ({ open, newData, setNewData, setStep }) => {
  const classes = useStyles(makeStyles);

  const [dataName, setDataName] = useState("");
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
  });

  /**
   * If the field has been touched and has an error, return true, otherwise return false.
   * @param field - The name of the field that we want to check for errors.
   */
  const hasError = (field) =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const handleClose = () => {
    setStep(0);
  };

  const handleChange = (event) => {
    event.persist();
    setNewData({ [event.target.name]: event.target.value });
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        fullWidth={true}
        maxWidth={"sm"}
      >
        <div className={classes.sideDialogTitleWrapper}>
          <DialogTitle
            id="form-dialog-title"
            style={{ fontSize: 14, fontWeight: "bold" }}
          >
            New Dashboard
          </DialogTitle>
          <IconButton
            aria-label="close"
            className={classes.sideDialogCloseButton}
            onClick={handleClose}
            size="small"
          >
            <CancelIcon style={{ fontSize: 18 }} />
          </IconButton>
        </div>

        <DialogContent dividers className={classes.dialogContDiv}>
          <DialogContentText style={{ marginBottom: 0, fontSize: 12 }}>
            Name
          </DialogContentText>
          <TextField
            name="name"
            margin="dense"
            id=""
            placeholder="Enter name here"
            type="text"
            inputMode="text"
            variant="outlined"
            fullWidth
            onChange={handleChange}
            value={newData.name}
            style={{ fontSize: 12 }}
          />
          <DialogContentText
            style={{ marginBottom: 0, marginTop: 20, fontSize: 12 }}
          >
            Description
          </DialogContentText>
          {/* <TextField
            margin="dense"
            id=""
            placeholder="Enter description"
            type="text"
            inputMode="text"
            variant="outlined"
            value={dataName}
            fullWidth
            onChange={handleChange}
            style={{ fontSize: 12 }}
          /> */}
          <TextField
            className={classes.FormTextField}
            name="description"
            error={hasError("description")}
            fullWidth
            helperText={hasError("description") ? "Invalid description" : null}
            FormHelperTextProps={{
              className: classes.helperText,
            }}
            onChange={handleChange}
            value={newData.description}
            multiline
            rows={4}
            placeholder="Enter description"
            type="text"
            inputMode="text"
            variant="outlined"
            InputProps={{
              className: classes.inputColor,
            }}
          />
          <FormHelperText style={{ fontWeight: 300, fontStyle: "italic" }}>
            Not more than 100 words
          </FormHelperText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="primary"
            variant="outlined"
            className={classes.sideDialogActionButton}
            size="small"
          >
            Cancel
          </Button>
          <Button
            onClick={() => setStep(3)}
            color="primary"
            variant="outlined"
            className={classes.sideDialogActionButton}
            size="small"
          >
            Next
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NewDashboardDialog;
