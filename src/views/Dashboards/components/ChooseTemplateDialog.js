import { useState } from "react";
import { withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "@material-ui/icons/CancelRounded";
import { useDispatch } from "react-redux";
import { useQueryClient } from "react-query";

import { useStyles } from "../utils/dashboardsStyle";
import { SetAppStatus } from "../../common/helpers/helperFunctions";
import useCustomMutation from "../../common/utils/CustomMutation";
import { createNewDataSheet } from "../../common/components/Mutation/Datasheets/datasheetMutation";

const ChooseTemplateDialog = ({
  history,
  open,
  newData,
  setNewData,
  setStep,
}) => {
  const classes = useStyles(makeStyles);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [dataName, setDataName] = useState("");
  // const [selected, setSelected] = useState("");
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

  // const {
  //   dataReducer: { dataOwner, dataSheetNames },
  // } = useSelector((state) => state);

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
    setStep(0);
  };

  const handleChange = (event) => {
    event.persist();
    setDataName(() => event.target.value);
  };

  const handleCreateData = (e) => {
    e.persist();
    addNewDataSheet({ name: dataName });
    handleClose();
  };

  const setSelected_ = (tmp) => {
    // setSelected(tmp);
    setNewData({ properties: { template: tmp } });
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
            Choose Template
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
          <div className="dashboard-templates">
            <div
              className={`template ${
                newData?.properties?.template === "A" ? "active" : ""
              }`}
              onClick={() =>
                setSelected_(newData?.properties?.template === "A" ? "" : "A")
              }
            >
              A
            </div>
            <div
              className={`template ${
                newData?.properties?.template === "B" ? "active" : ""
              }`}
              onClick={() =>
                setSelected_(newData?.properties?.template === "B" ? "" : "B")
              }
            >
              B
            </div>
            <div
              className={`template ${
                newData?.properties?.template === "C" ? "active" : ""
              }`}
              onClick={() =>
                setSelected_(newData?.properties?.template === "C" ? "" : "C")
              }
            >
              C
            </div>
            <div
              className={`template ${
                newData?.properties?.template === "D" ? "active" : ""
              }`}
              onClick={() =>
                setSelected_(newData?.properties?.template === "D" ? "" : "D")
              }
            >
              D
            </div>
            <div
              className={`template ${
                newData?.properties?.template === "E" ? "active" : ""
              }`}
              onClick={() =>
                setSelected_(newData?.properties?.template === "E" ? "" : "E")
              }
            >
              E
            </div>
            <div
              className={`template ${
                newData?.properties?.template === "F" ? "active" : ""
              }`}
              onClick={() =>
                setSelected_(newData?.properties?.template === "F" ? "" : "F")
              }
            >
              F
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setStep(1)}
            color="primary"
            variant="outlined"
            className={classes.sideDialogActionButton}
            size="small"
          >
            Back
          </Button>
          <Button
            onClick={() => setStep(3)}
            color="primary"
            variant="outlined"
            className={classes.sideDialogActionButton}
            size="small"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default withRouter(ChooseTemplateDialog);
