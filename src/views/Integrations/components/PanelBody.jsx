import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "@material-ui/icons/Cancel";
import ArrowForwardIos from "@material-ui/icons/ArrowForwardIos";
import {
  DialogTitle,
  DialogActions,
  CircularProgress,
} from "@material-ui/core";
import { useStyles } from "../utils/IntegrationsPanelStyle";
import { Check } from "@material-ui/icons";
import { useDispatch } from "react-redux";
import { SET_EDIT_INTEGRATION_FLAG } from "../../../store/actions/integrationActions";

const PanelBody = ({
  title,
  mode,
  children,
  steps,
  step,
  setStep,
  formCompleted,
  isResourceSelected,
  overLookResourceSelectedList,
  loading,
}) => {
  const classes = useStyles(makeStyles);
  const dispatch = useDispatch();
  const location = useLocation();

  const queries = location.search;
  const progress = new URLSearchParams(queries).get("progress");

  const [endIcon, setEndIcon] = useState(null);
  const [disabledSubmitButton, setDisabledSubmitButton] = useState(true);

  useEffect(() => {
    const endIconComponent = loading ? (
      <CircularProgress size={20} />
    ) : steps > step ? (
      <ArrowForwardIos style={{ fontSize: 18 }} />
    ) : (
      <Check style={{ fontSize: 18 }} />
    );

    setEndIcon(endIconComponent);
  }, [loading, step, steps]);

  useEffect(() => {
    const condition_1 = steps > step && !formCompleted;
    const condition_2 =
      steps === step && !isResourceSelected && !overLookResourceSelectedList;
    const condition_3 = steps === step && !formCompleted;
    const condition_4 = loading === true;

    const shouldBeDisabled =
      condition_1 || condition_2 || condition_3 || condition_4;

    setDisabledSubmitButton(shouldBeDisabled);
  }, [
    loading,
    step,
    steps,
    formCompleted,
    isResourceSelected,
    overLookResourceSelectedList,
  ]);

  // close  row dialog
  const handleClose = () => {
    const conf = window?.confirm(`Cancel ${mode?.toLowerCase()} integration?`);
    // if integration configuration was open automatically from backend redirect
    if (progress === "proceed") {
      window.location.replace(`${process.env.REACT_APP_BASE_URL}/integrations`);
    } else {
      dispatch({ type: SET_EDIT_INTEGRATION_FLAG, payload: false });
      if (conf) setStep(0);
    }
  };

  return (
    <div className={classes.sideFlowDialogContainer}>
      <div className={classes.sideFlowDialogTitleWrapper}>
        <DialogTitle
          id="form-dialog-title"
          style={{ fontSize: 14, fontWeight: "bold" }}
          title={"sidebarHeader"}
        >
          {mode} {title} Integration
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

      <form onSubmit={setStep} style={{ height: "100%" }}>
        {children}

        <DialogActions className={classes.sideDialogActions}>
          <Button
            variant="outlined"
            title={"submitBtn"}
            color="primary"
            className={classes.sideDialogActionButton}
            endIcon={endIcon}
            type="submit"
            disabled={disabledSubmitButton}
          >
            {steps > step ? "Next" : "Finish"}
          </Button>
        </DialogActions>
      </form>
    </div>
  );
};

export default PanelBody;
