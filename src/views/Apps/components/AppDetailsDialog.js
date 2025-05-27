import { useEffect, useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import CancelIcon from "@material-ui/icons/Cancel";
import {
  Typography,
  FormControlLabel,
  IconButton,
  Switch,
  TextField,
  Button,
  Dialog,
  Select,
  FormHelperText,
  MenuItem,
} from "@material-ui/core";
import validate from "validate.js";

import { APPS_CONTROL_MODES } from "../../EditorLayout/Pages/Workflow/components/utils/constants";
import {
  rOpenAppDetailsDialog,
  rSetAppsControlMode,
} from "../../../store/actions/properties";
import SelectOnSteroids from "../../EditorLayout/Pages/Workflow/components/RightSidebar/components/sidebarActions/common/SelectOnSteroids";
import {
  compareByValue,
  groupPermissionsByAccess,
} from "../../Datasheets/utils";
import useCustomQuery from "../../common/utils/CustomQuery";
import { getResourcePermissions } from "../../common/components/Query/DataSheets/datasheetQuery";
import {
  appDialogModes,
  DEFAULT_APP_LAUNCH_BUTTON_TEXT,
  PERMS_DETAILS,
} from "../../common/utils/constants";
import {
  filterDuplicateObjects,
  manageAppLocalStorage,
  SetAppStatus,
} from "../../common/helpers/helperFunctions";
import {
  errorToastify,
  infoToastify,
  successToastify,
} from "../../common/utils/Toastify";
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
import packageFile from "../../../../package.json";
import CircularIndeterminate from "../../common/components/ProgressLoader/ProgressLoader";
import { getTaskVariables } from "../../EditorLayout/Pages/Workflow/components/utils/workflowFuncs";
import { getUserGroupsAPI } from "../../SettingsLayout/Pages/UserGroups/utils/usergroupsAPIs";
const { version } = packageFile;

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
  section: {
    //padding: "0px, 4px",
    paddingTop: theme?.spacing(3),
  },
  switchElem: {
    //paddingTop: theme?.spacing(3),
    fontStyle: "normal",
    fontWeight: 300,
    fontSize: 12,
    //lineHeight: "132.24%",
    display: "flex",
    // color: "#091540",
    color: "#646874",
  },
  switchLabel: {
    //paddingTop: theme?.spacing(3),
    fontSize: 12,
    lineHeight: "132.24%",
    display: "flex",
  },
  sectionEntry: {
    marginBottom: 13,
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
  const [loadingPerms, setLoadingPerms] = useState(true);
  const [togglePermsData, setTogglePermsData] = useState({ read: [] });
  const [permsResource, setPermsResource] = useState({ read: [] });
  const [emptyPermsList, setEmptyPermsList] = useState(false);
  const newMode = mode === appDialogModes?.NEW;
  const propertyMode = mode === appDialogModes?.PROPERTIES;
  const duplicateMode = mode === appDialogModes?.DUPLICATE;
  const [ownerGroups, setOwnerGroups] = useState([]);
  const [perPageOwnerGroup, setPerPageOwnerGroup] = useState(500);
  const [pageNoOwnerGroup, setPageNoOwnerGroup] = useState(1);

  const {
    workflows: { activeTask, variables: allVariables },
  } = useSelector((state) => state);
  const {
    appsReducer: { appsControlMode },
  } = useSelector((state) => state);
  //setting the tags based on the operation that was passed
  const [headingTag, setHeadingTag] = useState("");
  const [formState, setFormState] = useState({
    isValid: false,
    values: newMode
      ? {
          // isPublic: "choose",
          grantedList: [],
          permissionAccess: "read",
          isAllEmployees: true,
        }
      : {
          name: `${appData?.name || ""}${duplicateMode ? " copy" : ""}`,
          description: appData?.description,
          category: appData?.category?.id,
          appLaunchButtonText:
            appData?.appLaunchButtonText || DEFAULT_APP_LAUNCH_BUTTON_TEXT,
          isPublic: appData?.isPublic, // review this
          // grantedList: [],
          permissionAccess: "read",
          ownerGroup: appData?.ownerGroup?.id || null,
          // isAllEmployees: true,
        },
    touched: {},
    errors: {},
  });

  const variables = getTaskVariables(activeTask.id, allVariables, true);

  const {
    values: { isAllEmployees, grantedList, permissionAccess },
  } = formState;
  const internalFacing =
    formState?.values?.isPublic === false || appData?.isPublic === false;
  const validateBtn = appsControlMode === appsControlMode?.APP && propertyMode;

  //FETCH PERMS REQUEST

  const onSuccessPerms = ({ data }) => {
    const filterDataPerms = groupPermissionsByAccess(data?.data);
    let tooglePermsVal = { ...togglePermsData };
    setLoadingPerms(false);

    for (let key in permsResource) {
      if (!filterDataPerms[key]) {
        filterDataPerms[key] = [];
      }
      if (filterDataPerms[key]?.length) {
        tooglePermsVal = {
          ...tooglePermsVal,
          [key]: filterDataPerms[key].filter(
            (permsD) => permsD.identity === "employees"
          ),
        };
        filterDataPerms[key] = filterDataPerms[key].filter(
          (permsD) => permsD.identity !== "employees"
        );
      }
      if (!filterDataPerms[key]?.length) {
        tooglePermsVal = {
          ...tooglePermsVal,
          [key]: [{ identity: "employees" }],
        };
      }
    }
    setTogglePermsData((prev) => ({
      ...prev,
      ...tooglePermsVal,
    }));
    setPermsResource((prev) => ({ ...prev, ...filterDataPerms }));

    setFormState((prev) => ({
      ...prev,
      values: {
        ...prev?.values,
        permissionAccess: "read",
        isAllEmployees: tooglePermsVal?.[permissionAccess]?.length
          ? true
          : false,
        grantedList: prev?.values?.grantedList?.length
          ? [...prev?.values?.grantedList, ...filterDataPerms["read"]]
          : filterDataPerms["read"],
      },
    }));
  };
  const { refetch } = useCustomQuery({
    queryKey: [
      "getDatasheetPerms",
      { resourceId: appData?.id, resourceType: "app", access: "read" },
    ],
    apiFunc: getResourcePermissions,
    onSuccess: onSuccessPerms,
    enabled: !!appData?.id && propertyMode,
    onError: () => setLoadingPerms(false),
  });

  useEffect(() => {
    return () => {
      dispatch(rOpenAppDetailsDialog(null));
    };
  }, []);

  // TOGGLE UPDATE All USERS' PERMISSIONS
  const handleToggleUserPerms = (data) => {
    const { permsType } = data;

    setFormState((prev) => ({
      ...prev,
      values: {
        ...prev?.values,
        permissionAccess: "read",
        isAllEmployees: data[permsType],
        grantedList: [],
      },
      isValid: propertyMode ? true : prev?.isValid,
    }));
  };

  useEffect(() => {
    if (!propertyMode) {
      if (
        !formState?.values?.grantedList?.length &&
        !formState?.values?.isAllEmployees
      ) {
        setEmptyPermsList(true);
      } else {
        setEmptyPermsList(false);
      }
    } else {
      if (
        !formState?.values?.grantedList?.length &&
        !formState?.values?.isAllEmployees &&
        permsResource?.["read"].length
      ) {
        setEmptyPermsList(true);
      } else {
        setEmptyPermsList(false);
      }
    }
  }, [formState.values, mode]);

  useEffect(() => {
    !propertyMode && setLoadingPerms(false);
  }, [mode]);

  const handleOwnerGroupList = ({ data }) => {
    const ownerGroupData = data?.data?.map((ownergroup) => {
      return { id: ownergroup.id, name: ownergroup.name };
    });

    return setOwnerGroups(ownerGroupData);
  };

  const options = {
    query: {
      population: [{ path: "users", select: "id firstName lastName" }],
    },
  };
  useCustomQuery({
    queryKey: ["allUserGroups", options, perPageOwnerGroup, pageNoOwnerGroup],
    apiFunc: getUserGroupsAPI,
    onSuccess: handleOwnerGroupList,
    enabled: !!pageNoOwnerGroup,
  });

  const _setTaskInfo = (e, ppty) => {
    if (!e && Object.keys(e).length) {
      return;
    }

    const newPermsUser = !e?.identity && e?.selection === "added" && e;
    const oldPermsUser = e?.selection === "removed" && e;

    if (newPermsUser && newPermsUser?.permissionIdentityType) {
      const newGrantedList = [
        {
          identity: PERMS_DETAILS[newPermsUser?.permissionIdentityType],
          value: newPermsUser.id,
        },
      ];

      setFormState((prev) => ({
        ...prev,
        values: {
          ...prev?.values,
          permissionAccess: "read",
          isAllEmployees: false,
          grantedList: prev?.values?.grantedList
            ? [...prev?.values?.grantedList, ...newGrantedList]
            : newGrantedList,
        },
        isValid: propertyMode ? true : prev?.isValid,
      }));
    }
    if (oldPermsUser && oldPermsUser?.selection) {
      let filterOldUsers = [];
      if (grantedList?.length) {
        const filteredUsers = grantedList?.filter(
          (permsR) => permsR?.value !== oldPermsUser?.id
        );
        filterOldUsers = [...filterOldUsers, ...filteredUsers];
      }

      if (permsResource?.[ppty]?.length && !grantedList?.length) {
        const filteredUsers = permsResource?.[ppty]?.filter(
          (permsR) => permsR?.value !== oldPermsUser?.id
        );
        filterOldUsers = [...filterOldUsers, ...filteredUsers];
      }

      filterOldUsers = filterDuplicateObjects(
        filterOldUsers,
        compareByValue,
        "value"
      );

      setFormState((prev) => ({
        ...prev,
        values: {
          ...prev.values,
          permissionAccess: "read",
          //isAllEmployees: filterOldUsers?.length ? false : true,
          grantedList: filterOldUsers,
        },
        isValid: propertyMode ? true : prev?.isValid,
      }));
    }
  };

  const onCreateSuccess = async ({ data: datas }) => {
    const {
      _meta,
      data: { id, app },
    } = datas?.data;

    setMessage(_meta?.message);
    dispatch(SetAppStatus({ type: "success", msg: _meta?.message }));
    setLoading(false);
    manageAppLocalStorage("set", app || id, "isNew", true);
    handleClose();

    openToManage(app || id);
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
    //console.log(`E R R O R >> ${JSON.stringify(err)}`);
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

    const publicFacing =
      event?.target?.name === "isPublic" && event?.target?.value === true;

    const newState = {
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === "checkbox"
            ? event.target.checked
            : event.target.value,
        grantedList: publicFacing ? [] : grantedList,
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
    if (internalFacing && emptyPermsList) {
      errorToastify("At least one user must be selected for permissions");
      return;
    }

    setLoading(true);

    switch (mode) {
      case appDialogModes.NEW:
        return createAppOrTemplate({
          ...formState.values,
          feVersion: version,
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
        isValid: validateBtn,
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
              // helperText={formState.errors.name}
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
              // helperText={formState.errors.description}
              FormHelperTextProps={{
                className: classes.helperText,
              }}
              value={formState.values.description || ""}
              multiline
              minRows={4}
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
              // helperText={formState.errors.category}
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
                <MenuItem
                  key={idx}
                  value={id}
                  className={classes.selectOption}
                  data-testid={`category-selector-${idx}`}
                >
                  {name}
                </MenuItem>
              ))}
            </Select>
            <Typography className={classes.formLabels} gutterBottom>
              Launch app button text
            </Typography>
            <TextField
              className={classes.FormTextField}
              size="small"
              name="appLaunchButtonText"
              onChange={handleChange}
              fullWidth
              value={
                formState.values.appLaunchButtonText ??
                DEFAULT_APP_LAUNCH_BUTTON_TEXT
              }
              placeholder="Enter launch app button text name here"
              type="text"
              inputMode="text"
              variant="outlined"
              InputProps={{
                className: classes.inputColor,
              }}
            />

            <Typography className={classes.formLabels} gutterBottom>
              Owner
            </Typography>
            <Select
              name="ownerGroup"
              fullWidth
              FormHelperTextProps={{
                className: classes.helperText,
              }}
              value={formState.values.ownerGroup || "choose"}
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
                Select owner
              </MenuItem>
              {ownerGroups?.map(({ name, id }, idx) => (
                <MenuItem
                  key={idx}
                  value={id}
                  className={classes.selectOption}
                  data-testid={`ownerGroups-selector-${idx}`}
                >
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
              // helperText={formState.errors.isPublic}
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
              <MenuItem value={false} className={classes.selectOption}>
                Internal or employee-facing
              </MenuItem>
              <MenuItem value={true} className={classes.selectOption}>
                External or customer-facing
              </MenuItem>
            </Select>

            {internalFacing && (
              <>
                {!loadingPerms ? (
                  <div className={classes.section}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        margin: "0px 7px 8px 4px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                        //onClick={(e) => _toggleSection(e, "view")}
                      >
                        <Typography className={classes.switchElem}>
                          Who can use this app:
                          {!formState.values.isAllEmployees && (
                            <span
                              style={{
                                fontSize: "10px",
                                fontWeight: "700",
                                color: "black",
                              }}
                            >
                              {" "}
                              ( <i>Add yourself here to access the app</i> )
                            </span>
                          )}
                        </Typography>
                      </div>
                      <FormControlLabel
                        classes={{
                          root: classes.switchLabel,
                          label: classes.switchElem,
                        }}
                        control={
                          <Switch
                            key={isAllEmployees}
                            name="checkedC"
                            color="primary"
                            size="small"
                            data-testid="employeeViewPermsSwitch"
                            checked={isAllEmployees}
                            onChange={(e) => {
                              handleToggleUserPerms({
                                read: !isAllEmployees,
                                permsType: "read",
                              });
                            }}
                          />
                        }
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        label="All employees"
                        labelPlacement="start"
                      />
                    </div>
                    {!isAllEmployees && (
                      <div className={classes.sectionEntry}>
                        <SelectOnSteroids
                          trackChange
                          hideVariableSelect
                          source="permissionIdentity"
                          variables={variables}
                          onChange={(e) => _setTaskInfo(e, "read")}
                          value={permsResource["read"]}
                          type="user"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <h4 style={{ color: "red" }}>
                    <i>Fetching permissions....</i>
                  </h4>
                )}
              </>
            )}
          </div>
          {loading ? (
            mode !== appDialogModes.NEW ? (
              <CircularIndeterminate />
            ) : (
              <div className="general-overlay">
                <div className="dialog-loading"></div>
                <div
                  style={{ color: "#ffffff", fontSize: 14, fontWeight: 700 }}
                >
                  Please wait while we set up your new app...
                </div>
              </div>
            )
          ) : null}
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
            {newMode ? "Create" : "Update"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AppDetailsDialog;
