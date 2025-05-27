import { useEffect, useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CancelIcon from "@material-ui/icons/Cancel";
import Button from "@material-ui/core/Button";
import { Select, MenuItem } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import MuiDialogActions from "@material-ui/core/DialogActions";
import validate from "validate.js";

import { APPS_CONTROL_MODES } from "../../EditorLayout/Pages/Workflow/components/utils/constants";
import {
  rOpenAppDetailsDialog,
  rSetAppsControlMode,
} from "../../../store/actions/properties";
import {
  manageAppLocalStorage,
  SetAppStatus,
} from "../../common/helpers/helperFunctions";
import { infoToastify, successToastify } from "../../common/utils/Toastify";
import useCustomMutation from "../../common/utils/CustomMutation";
import {
  createApp,
  duplicateApps,
  updateApps,
} from "../../common/components/Mutation/Apps/AppsMutation";
import {
  getUserRole,
  tempPermissions,
} from "../../common/utils/userRoleEvaluation";
import {
  createAppFromTemplate,
  createTemplate,
  duplicateTemplates,
  updateTemplates,
} from "../../common/components/Mutation/Templates/TemplateMutation";
import SignupAlert from "../../common/components/Alert/SignupAlert";
import CircularIndeterminate from "../../common/components/ProgressLoader/ProgressLoader";
import { appDialogModes } from "../../common/utils/constants";

const schema = {
  name: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 64,
    },
  },
  description: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 128,
    },
  },
  category: {
    presence: { allowEmpty: false, message: "is required" },
  },
  isPublic: {
    presence: { allowEmpty: false, message: "is required" },
  },
};

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: 16,
  },
  iconStyle: {
    fontSize: 50,
    color: "#0C7B93",
    borderRadius: "50px",
  },
  closeButton: {
    position: "absolute",
    right: 4,
    top: 4,
    color: "#E7E9EE",
  },
  helperText: {
    margin: "5px 0 0 0",
    fontFamily: "GT Eesti Pro Test",
  },
});

const useStyles = makeStyles((theme) => ({
  content: {
    paddingTop: 40,
  },
  tiles: {
    display: "flex",
  },
  formLabels: {
    paddingTop: theme?.spacing(3),
    fontStyle: "normal",
    fontWeight: 300,
    fontSize: 12,
    lineHeight: "132.24%",
    display: "flex",
    // color: "#091540",
    color: "#646874",
  },

  formTextField: {
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: 12,
    lineHeight: 16,
    display: "flex",
    color: "#091540",
  },
  nextButton: {
    fontStyle: "normal",
    backgroundColor: "#010A43",
    color: "#fff",
    textTransform: "capitalize",
    padding: "4px 30px",
    borderRadius: 3,

    "&$disabled": {
      background: "#ABB3BF",
      color: "#fff",
    },
  },
  selectOption: {
    padding: "5px 10px",
    "&:hover": {
      backgroundColor: "#3469ff",
      color: "#ffffff",
    },
  },
  inputColor1: {
    padding: "10.5px 14px",
  },

  disabled: {},
}));

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;

  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography style={{ fontWeight: "bold" }}>{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="Close"
          title="closeBtn"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CancelIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme?.spacing(3),
    justifyContent: "center",
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme?.spacing(1),
  },
}))(MuiDialogActions);

const appsControlMode = APPS_CONTROL_MODES.TEMPLATE;

const AppDetailsDialog = ({
  openAppDialog,
  handleClose,
  categories,
  appData,
  mode,
  reloadAppsList,
  openToManage,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorOpen, setErrorOpen] = useState(false);
  //setting the tags based on the operation that was passed
  const [headingTag, setHeadingTag] = useState("");
  const [formState, setFormState] = useState({
    isValid: false,
    values:
      mode === appDialogModes.NEW
        ? {}
        : {
            name: `${appData?.name || ""}${
              mode === appDialogModes.DUPLICATE ? " copy" : ""
            }`,
            description: appData?.description,
            category: appData?.category?.id,
            isPublic: appData?.isPublic, // review this
          },
    touched: {},
    errors: {},
  });

  useEffect(() => {
    return () => {
      dispatch(rOpenAppDetailsDialog(null));
    };
  }, []);

  const onCreateSuccess = async ({ data: datas }) => {
    const {
      _meta,
      data: { id, app },
    } = datas?.data;

    setMessage(_meta?.message);
    dispatch(SetAppStatus({ type: "success", msg: _meta?.message }));
    setLoading(false);
    handleClose();

    openToManage(app || id);
    manageAppLocalStorage("set", app || id, "isNew", true);
  };

  const onMutationSuccess = async ({ data: datas }) => {
    const { _meta } = datas?.data;
    successToastify(_meta.message);
    dispatch(SetAppStatus({ type: "success", msg: _meta?.message }));
    setLoading(false);
    reloadAppsList();
    handleClose();
  };

  const onMutationSuccess2 = async ({ data: datas }) => {
    const { _meta } = datas?.data;
    successToastify(_meta.message);
    dispatch(SetAppStatus({ type: "success", msg: _meta?.message }));
    dispatch(rSetAppsControlMode(APPS_CONTROL_MODES.APP));
    setLoading(false);
    reloadAppsList(APPS_CONTROL_MODES.APP);
    handleClose();
  };

  const onError = (err) => {
    console.log(`E R R O R >> ${JSON.stringify(err)}`);
    setLoading(false);
  };

  // create mutation
  const { mutate: createAppOrTemplate } = useCustomMutation({
    apiFunc:
      appsControlMode === APPS_CONTROL_MODES.APP
        ? createApp
        : appsControlMode === APPS_CONTROL_MODES.TEMPLATE &&
          tempPermissions(getUserRole()) &&
          createTemplate,
    onSuccess: onCreateSuccess,
    onError,
    retries: 0,
  });

  // duplicate mutation
  const { mutate: duplicateAppOrTemplate } = useCustomMutation({
    apiFunc:
      appsControlMode === APPS_CONTROL_MODES.APP
        ? duplicateApps
        : appsControlMode === APPS_CONTROL_MODES.TEMPLATE &&
          tempPermissions(getUserRole()) &&
          duplicateTemplates,
    onSuccess: onMutationSuccess,
    onError,
    retries: 0,
  });

  // update apps mutation
  const { mutate: updateAppOrTemplate } = useCustomMutation({
    apiFunc:
      appsControlMode === APPS_CONTROL_MODES.APP
        ? updateApps
        : appsControlMode === APPS_CONTROL_MODES.TEMPLATE &&
          tempPermissions(getUserRole())
        ? updateTemplates
        : updateApps,
    onSuccess: onMutationSuccess,
    onError,
    retries: 0,
  });

  // duplicate mutation
  const { mutate: cloneAppFromTemplate } = useCustomMutation({
    apiFunc:
      appsControlMode === APPS_CONTROL_MODES.TEMPLATE &&
      tempPermissions(getUserRole()) &&
      createAppFromTemplate,
    onSuccess: onMutationSuccess2,
    onError,
    retries: 0,
  });

  const handleChange = (event) => {
    event.persist();

    const newState = {
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === "checkbox"
            ? event.target.checked
            : event.target.value,
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true,
      },
    };
    const errors = validate(newState.values, schema);
    newState.errors = errors || {};
    newState.isValid = !errors;

    setFormState(newState);
  };

  const _handleClose = (e) => {
    e && e.stopPropagation();
    handleClose();
  };

  const handleCheckAuthorize = () => {
    infoToastify("You are not allowed to perform this action.");
    handleClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    switch (mode) {
      case appDialogModes.NEW:
        return createAppOrTemplate({
          ...formState.values,
        });

      case appDialogModes.DUPLICATE:
        return duplicateAppOrTemplate({
          app: appData?.id,
          ...formState.values,
        });

      case appDialogModes.PROPERTIES:
        return updateAppOrTemplate({
          app: appData?.id,
          ...formState.values,
        });

      case appDialogModes.CLONE:
        return cloneAppFromTemplate({
          templateId: appData?.id,
          ...formState.values,
        });

      default:
        break;
    }
  };

  useEffect(() => {
    const headingTags = () => {
      switch (mode) {
        case appDialogModes.NEW:
          setHeadingTag(
            `New ${
              appsControlMode === APPS_CONTROL_MODES.APP ? "App" : "Template"
            }`
          );
          break;
        case appDialogModes.DUPLICATE:
          setHeadingTag(
            `Duplicate ${
              appsControlMode === APPS_CONTROL_MODES.APP ? "App" : "Template"
            }`
          );
          break;
        case appDialogModes.PROPERTIES:
          setHeadingTag(
            `${
              appsControlMode === APPS_CONTROL_MODES.APP ? "App" : "Template"
            } Details`
          );
          break;
        case appDialogModes.CLONE:
          setHeadingTag(`Create App from Template`);
          break;

        default:
          break;
      }
    };

    if (mode !== appDialogModes.NEW) {
      setFormState({
        ...formState,
        isValid:
          appsControlMode === appsControlMode.APP &&
          mode === appDialogModes.PROPERTIES,
      });
    }
    headingTags();
  }, [mode, appsControlMode]);

  return (
    <div>
      {/* <AddBoxIcon className={classes.iconStyle}  /> */}

      <Dialog
        maxWidth="sm"
        fullWidth
        onClose={(e) => _handleClose(e)}
        aria-labelledby="customized-dialog-title"
        open={openAppDialog}
      >
        <DialogTitle
          id="customized-dialog-title"
          onClose={(e) => _handleClose(e)}
        >
          {errorOpen ? (
            <SignupAlert
              close={(e) => _handleClose(e)}
              message={message}
              open={openAppDialog}
              // severity={severity}
            />
          ) : (
            <Typography
              variant="h5"
              component="span"
              className={classes.subtitle}
              style={{ fontSize: 14, lineHeight: "17px" }}
              gutterBottom
            >
              {headingTag}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent dividers>
          <div style={{ width: "90%" }}>
            <Typography
              className={classes.formLabels}
              style={{ paddingTop: 0 }}
              gutterBottom
            >
              {appsControlMode === APPS_CONTROL_MODES.APP
                ? "App name"
                : appsControlMode === APPS_CONTROL_MODES.TEMPLATE &&
                  tempPermissions(getUserRole())
                ? "Template name"
                : APPS_CONTROL_MODES.APP}
              *
            </Typography>
            <TextField
              className={classes.FormTextField}
              size="small"
              name="name"
              onChange={handleChange}
              error={!!formState.errors.name}
              fullWidth
              helperText={formState.errors.name}
              FormHelperTextProps={{
                className: classes.helperText,
              }}
              value={formState.values.name || ""}
              placeholder="Enter name here"
              type="text"
              inputMode="text"
              variant="outlined"
              InputProps={{
                className: classes.inputColor,
              }}
              focused
              autoFocus
            />
            <Typography className={classes.formLabels} gutterBottom>
              Description*
            </Typography>
            <TextField
              className={classes.FormTextField}
              name="description"
              onChange={handleChange}
              error={!!formState.errors.description}
              fullWidth
              helperText={formState.errors.description}
              FormHelperTextProps={{
                className: classes.helperText,
              }}
              value={formState.values.description || ""}
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

            <Typography className={classes.formLabels} gutterBottom>
              Category*
            </Typography>
            <Select
              name="category"
              error={!!formState.errors.category}
              fullWidth
              helperText={formState.errors.category}
              FormHelperTextProps={{
                className: classes.helperText,
              }}
              value={formState.values.category || "choose"}
              size="small"
              placeholder="Select from the options"
              onChange={handleChange}
              variant="outlined"
              classes={{
                root: classes.inputColor1,
              }}
            >
              <MenuItem
                value="choose"
                disabled
                selected
                style={{ padding: "5px 10px" }}
              >
                Select Category
              </MenuItem>
              {categories?.map(({ name, id }, idx) => (
                <MenuItem key={idx} value={id} className={classes.selectOption}>
                  {name}
                </MenuItem>
              ))}
            </Select>
            <Typography className={classes.formLabels} gutterBottom>
              Is this app customer-facing or internal?*
            </Typography>
            <Select
              name="isPublic"
              error={!!formState.errors.isPublic}
              fullWidth
              helperText={formState.errors.isPublic}
              FormHelperTextProps={{
                className: classes.helperText,
              }}
              value={formState?.values?.isPublic ?? "choose"}
              size="small"
              placeholder="Select from the options"
              onChange={handleChange}
              variant="outlined"
              classes={{
                root: classes.inputColor1,
              }}
            >
              <MenuItem
                value="choose"
                disabled
                selected
                style={{ padding: "5px 10px" }}
              >
                Choose
              </MenuItem>
              <MenuItem value="false" className={classes.selectOption}>
                Internal or employee-facing
              </MenuItem>
              <MenuItem value="true" className={classes.selectOption}>
                External or customer-facing
              </MenuItem>
            </Select>
          </div>
          {loading ? <CircularIndeterminate /> : null}
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            style={{
              border: "1px solid #010A43",
              textTransform: "capitalize",
              borderRadius: 3,
              padding: "3px 30px",
              fontSize: 12,
            }}
            onClick={_handleClose}
          >
            Cancel
          </Button>
          <Button
            disabled={!formState.isValid}
            classes={{
              root: classes.nextButton,
              disabled: classes.disabled,
            }}
            onClick={handleSubmit}
            size="large"
            type="submit"
            title="submitBtn"
            variant="contained"
            style={{ fontSize: 12 }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AppDetailsDialog;
