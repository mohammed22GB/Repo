import { useState } from "react";
import { withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useStyles } from "../utils/DataStyle";
import { makeStyles } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "@material-ui/icons/CancelRounded";
import { useDispatch } from "react-redux";
import { useQueryClient } from "react-query";

import { SetAppStatus } from "../../common/helpers/helperFunctions";
import useCustomMutation from "../../common/utils/CustomMutation";
import { createNewDataSheet } from "../../common/components/Mutation/Datasheets/datasheetMutation";
import { errorToastify } from "../../common/utils/Toastify";

const NewSheetDialog = (props) => {
  const { history, open, setOpen, setHasUpdate, formattedRows } = props;
  const classes = useStyles(makeStyles);
  const [dataName, setDataName] = useState("");
  // const {
  //   dataReducer: { dataOwner, dataSheetNames },
  // } = useSelector((state) => state);

  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const onSuccess = async ({ data }) => {
    dispatch(SetAppStatus({ type: "success", msg: data?._meta?.message }));
    await queryClient.invalidateQueries(["datasheetLists"]);
  };

  const { mutate: addNewDataSheet } = useCustomMutation({
    apiFunc: createNewDataSheet,
    onSuccess,
    retries: 0,
  });

  const handleClose = () => {
    setOpen(false);
    setDataName("");
  };

  const handleChange = (event) => {
    event.persist();
    setDataName(() => event.target.value);
  };

  const handleCreateData = (e) => {
    e.persist();
    const nameExists = formattedRows.find((row) => row?.name === dataName);
    if (nameExists) {
      return errorToastify("Unable to create with an existing name");
    }
    addNewDataSheet({ name: dataName });
    handleClose();
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
            Create new datasheet
          </DialogTitle>
          <IconButton
            aria-label="close"
            className={classes.sideDialogCloseButton}
            onClick={handleClose}
            size="small"
            title="closeBtn"
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
            placeholder="Enter DataSheet name"
            type="text"
            inputMode="text"
            variant="outlined"
            value={dataName}
            fullWidth
            onChange={handleChange}
            style={{ fontSize: 12 }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            id="cancel-new-datasheet-btn"
            onClick={handleClose}
            color="primary"
            variant="outlined"
            className={classes.sideDialogActionButton}
            size="small"
          >
            Cancel
          </Button>
          <Button
            id="create-new-datasheet-btn"
            onClick={handleCreateData}
            color="primary"
            variant="outlined"
            className={classes.sideDialogActionButton}
            size="small"
            disabled={dataName === ""}
            title="submitBtn"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default withRouter(NewSheetDialog);
