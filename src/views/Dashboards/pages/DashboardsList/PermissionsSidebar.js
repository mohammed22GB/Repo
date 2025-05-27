import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Slide from "@material-ui/core/Slide";
import CancelIcon from "@material-ui/icons/Cancel";
import {
  Typography,
  Collapse,
  FormControlLabel,
  Switch,
  IconButton,
} from "@material-ui/core";
import { CheckCircleOutlineOutlined } from "@material-ui/icons";
import { useQueryClient } from "react-query";

import SelectOnSteroids from "../../../EditorLayout/Pages/Workflow/components/RightSidebar/components/sidebarActions/common/SelectOnSteroids";
import { errorToastify, successToastify } from "../../../common/utils/Toastify";
import useCustomMutation from "../../../common/utils/CustomMutation";
import {
  groupResourcePermissions,
  removeResourcePermissions,
  updateResourcePermissions,
} from "../../../common/components/Query/DataSheets/datasheetQuery";
import { getTaskVariables } from "../../../EditorLayout/Pages/Workflow/components/utils/workflowFuncs";
import { uniqWith } from "lodash";
import { PERMS_DETAILS } from "../../../common/utils/constants";

const useStyles = makeStyles((theme) => ({
  sideHeading: {
    color: "#091540",
    // fontWeight: 600,
    fontSize: 11,
    // paddingLeft: 10,
    paddingTop: 10,
    // textTransform: "capitalize",
    display: "inline-flex",
    alignItems: "center",
  },
  divider: {
    marginTop: 15,
    marginBottom: 15,
  },
  section: {
    padding: 10,
    paddingBottom: 20,
  },
  // container: {
  //   //overflow: "hidden",
  //   height: "100%",
  //   "&:hover": {
  //     //overflow: "overlay",
  //   },
  // },
  actionsListItem: {
    width: "30%",
    height: 80,
    margin: 5,
    display: "inline-block",
    textAlign: "center",
    backgroundColor: "white",
    border: "solid 1px white",
    boxShadow: "1px 1px 3px #ccc",
    borderRadius: 10,
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "#fafafa",
      border: "solid 1px #eaeaea",
      boxShadow: "none",
      color: "#1846c8",
    },
  },
  closeIcon: {
    fontSize: 16,
    color: "#AAAAAA",
    marginRight: 10,
    cursor: "pointer",
    "&:hover": {
      color: "#091540",
    },
  },
  sectionTitle: {
    color: "#999",
    fontSize: 12,
    marginBottom: 5,
  },
  input: {
    color: "#091540",
    fontSize: 12,
    marginBottom: 12,
  },
  select: {
    color: "#091540",
    fontSize: 12,
    padding: 10,
  },
  switchLabel: {
    width: "100%",
    justifyContent: "space-between",
    margin: 0,
  },
  matchingFields: {
    borderRadius: 5,
    border: "dashed 1.5px #999",
    padding: "10px 5px 10px 10px",
    backgroundColor: "#f8f8f8",
    marginTop: 7,
  },
  mappingTitle: {
    fontSize: 12,
    flex: 1,
    color: "#f7a712",
    display: "flex",
    justifyContent: "space-between",
  },
  pair: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    "& > div, & > p": {
      flex: 1,
      "&:first-child": {
        marginRight: 5,
      },
    },
  },
  multiSelect: {
    display: "flex",
    flexWrap: "wrap",
  },
  sideDialogTitleWrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 10,
  },
  selectedFields: {
    backgroundColor: "#f8f8f8",
    marginRight: 5,
    marginBottom: 5,
    padding: 5,
    border: "dashed 1px #999",
    borderRadius: 8,
    color: "#888",
  },
  sectionEntry: {
    marginBottom: 13,
  },
  addMatch: {
    fontSize: 20,
    boxShadow: "0px 2px 3px #aaa",
    borderRadius: "14%",
    marginTop: 10,
  },
  menuSubs: {
    fontSize: "0.8em",
    color: "#0c7b93",
    fontWeight: "normal",
  },
  selected: {
    "& span": {
      display: "none",
    },
  },

  floatFieldOnSteriod: {
    width: "70px",
    height: "inherit",
    position: "absolute",
    right: "0%",
    bottom: "6%",
    // backgroundColor: "red",
  },
}));

const PermissionsSidebar = (props) => {
  const {
    activeTaskId,
    workflowTasks,
    allVariables,
    showMe, //= true,
    handleClose,
    componentName,
    permsResource,
    refetch,
    resourceId,
    queryType,
    permissionToggle,
    setPermsResource,
    resourceType,
    handleToggleAdminPerms,
    component = "datasheet",
  } = props;

  const node = "screen";
  const activeTask = workflowTasks[activeTaskId];
  const properties = activeTask?.properties || {};
  const classes = useStyles();
  const [allTogglePerms, setAllTogglePerms] = useState({
    adminPerms: {
      read: true,
      modify: true,
      delete: true,
    },
    userPerms: {
      read: true,
      modify: true,
      delete: true,
    },
  });
  const { userPerms, adminPerms } = allTogglePerms;

  const [showSection, setShowSection] = useState({
    view: true,
    modify: false,
    delete: false,
  });

  const variables = getTaskVariables(activeTaskId, allVariables);

  const queryClient = useQueryClient();

  useEffect(() => {
    refetch();
  }, []);

  //COLLAPSE SECTION
  const _toggleSection = (e, sect) => {
    e && e.stopPropagation();

    const makeTrue = !showSection[sect];
    const showSection_ = { ...showSection };
    Object.keys(showSection_).forEach((p) => (showSection_[p] = false));
    if (makeTrue) showSection_[sect] = true;
    setShowSection(showSection_);
  };

  useEffect(() => {
    if (component !== "datasheet") {
      setAllTogglePerms((prev) => ({
        ...prev,
        userPerms: {
          modify: !permissionToggle?.modify?.length ? true : false,
          read: !permissionToggle?.read?.length ? true : false,
          delete: !permissionToggle?.delete?.length ? true : false,
        },
      }));
    } else {
      setAllTogglePerms((prev) => ({
        ...prev,
        userPerms: {
          modify: !permissionToggle?.modify?.length ? false : true,
          read: !permissionToggle?.read?.length ? false : true,
          delete: !permissionToggle?.delete?.length ? false : true,
        },
      }));
    }
  }, [permissionToggle]);

  //
  // TOGGLE UPDATE All USERS' PERMISSIONS
  const handleToggleUserPerms = (data) => {
    const { permsType } = data;
    setAllTogglePerms((prev) => ({
      ...prev,
      userPerms: {
        ...userPerms,
        [permsType]: data[permsType],
      },
    }));

    if (data[permsType]) {
      groupUpdatePermissions({
        permsType,
        grantedList: [],
        resourceId,
        isAllEmployees: true,
        resourceType: resourceType ?? "report",
        action: "add",
      });
    } else {
      if (permsResource[permsType]?.length) {
        groupUpdatePermissions({
          permsType,
          grantedList: [...permsResource?.[permsType]],
          resourceId,
          isAllEmployees: false,
          action: "delete",
          resourceType: resourceType ?? "report",
        });
      } else {
        if (component === "datasheet") {
          groupUpdatePermissions({
            permsType,
            grantedList: [...permsResource?.[permsType]],
            resourceId,
            isAllEmployees: false,
            action: "delete",
            resourceType: resourceType ?? "report",
          });
        } else {
          return;
        }
      }
    }
  };

  // SUCCESS GROUP UPDATE
  const onSuccessGroupPerms = (data) => {
    successToastify(
      data?.data?._meta?.message || "Permissions was successfully updated"
    );
    queryClient.invalidateQueries([queryType ?? "getDashboardPerms"]);
  };

  // GROUP UPDATE REQUEST
  const { mutate: groupUpdatePermissions } = useCustomMutation({
    apiFunc: groupResourcePermissions,
    onSuccess: onSuccessGroupPerms,
    onError: () => errorToastify("Error updating permissions"),
    retries: 0,
  });

  // REMOVE SINGLE USERS' PERMISSIONS
  // SUCCESS REMOVAL
  const onSuccessPermsRemove = (data) => {
    successToastify(data?.data?._meta?.message);
  };

  const { mutate: removeUserPermissions } = useCustomMutation({
    apiFunc: removeResourcePermissions,
    onSuccess: onSuccessPermsRemove,
    retries: 0,
  });

  // UPDATE SINGLE USERS' PERMISSIONS
  // SUCCESS
  const onSuccessPermsUpdate = (data) => {
    successToastify(
      data?.data?._meta?.message || "Permissions updated successfully"
    );
    //queryClient.invalidateQueries([queryType ?? "getDashboardPerms"]);
  };

  // UPDATE REQUEST
  const { mutate: updatePermissions } = useCustomMutation({
    apiFunc: updateResourcePermissions,
    onSuccess: onSuccessPermsUpdate,
    retries: 0,
  });

  // UPDATE A SINGLE USER'S PERMISSION
  const _setTaskInfo = (value, ppty) => {
    if (!resourceType) return;

    //  enforce selection uniqueness
    const uniqueSelections = uniqWith(
      value,
      (oneValue, anotherValue) =>
        oneValue.id === anotherValue.id &&
        oneValue.permissionIdentityType === anotherValue.permissionIdentityType
    );

    const grantedList = uniqueSelections.map((selection) => ({
      identity: PERMS_DETAILS[selection.permissionIdentityType],
      value: selection.id,
    }));

    setPermsResource((prev) => ({
      ...permsResource,
      [ppty]: value,
    }));

    updatePermissions({
      permsType: ppty,
      grantedList,
      resourceId,
      resourceType,
    });

    setAllTogglePerms((prev) => ({
      ...prev,
      userPerms: {
        ...userPerms,
        [ppty]: false,
      },
    }));
  };

  return (
    <Slide direction="left" in={showMe} mountOnEnter unmountOnExit>
      <div className="side-dialog-container">
        {/* <div className={classes.sideDialogTitleWrapper}>
        </div> */}
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#60718e",
              fontWeight: 700,
              color: "#ffffff",
              padding: 10,
            }}
          >
            {componentName} {component} permissions
            <IconButton
              aria-label="close"
              className="_close-button"
              title="closeBtn"
              onClick={handleClose}
              style={{
                color: "#ffffff",
              }}
              size="small"
            >
              <CancelIcon style={{ fontSize: 18 }} />
            </IconButton>
          </div>
          <div
            className="_heading _collapsible"
            onClick={(e) => _toggleSection(e, "view")}
          >
            <Typography gutterBottom className={classes.sideHeading}>
              Select who can view the {component}
              <CheckCircleOutlineOutlined
                style={{ fontSize: 16, marginLeft: 10, color: "green" }}
              />
            </Typography>
          </div>
          <Collapse in={showSection?.view}>
            <div className={classes.section}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  alightItems: "center",
                  margin: "10px 0px 5px",
                  width: "80%",
                }}
              >
                <FormControlLabel
                  classes={{
                    root: classes.switchLabel,
                    label: classes.sectionTitle,
                  }}
                  control={
                    <Switch
                      name="adminView"
                      color="primary"
                      size="small"
                      data-testid="adminViewPermsSwitch"
                      checked={/*adminPerms.read*/ true}
                      onChange={(e) => {
                        handleToggleAdminPerms({
                          read: !adminPerms.read,
                          permsType: "read",
                        });
                      }}
                      disabled
                    />
                  }
                  label="Admins"
                  labelPlacement="start"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  margin: "10px 0px 5px",
                  width: "80%",
                }}
              >
                <FormControlLabel
                  classes={{
                    root: classes.switchLabel,
                    label: classes.sectionTitle,
                  }}
                  control={
                    <Switch
                      name="checkedC"
                      color="primary"
                      size="small"
                      data-testid="employeeViewPermsSwitch"
                      checked={userPerms?.read}
                      onChange={(e) => {
                        handleToggleUserPerms({
                          read: !userPerms?.read,
                          permsType: "read",
                        });
                      }}
                    />
                  }
                  label="All Employees"
                  labelPlacement="start"
                />
              </div>
              {!userPerms?.read && (
                <>
                  {" "}
                  <Typography
                    style={{ fontWeight: 300 }}
                    gutterBottom
                    className={classes.sectionTitle}
                  >
                    Select users or user groups
                  </Typography>
                  <div className={classes.sectionEntry}>
                    <SelectOnSteroids
                      // trackChange
                      source="permissionIdentity"
                      onChange={(e) => _setTaskInfo(e, "read")}
                      value={permsResource?.["read"]}
                      type="user"
                      contents={["users", "userGroups"]}
                    />
                  </div>
                </>
              )}
              {/* <div className={classes.sectionEntry}></div> */}
            </div>
          </Collapse>
        </>
        <>
          <div
            className="_heading _collapsible"
            onClick={(e) => _toggleSection(e, "modify")}
          >
            <Typography gutterBottom className={classes.sideHeading}>
              Select who can edit the {component}
              <CheckCircleOutlineOutlined
                style={{ fontSize: 16, marginLeft: 10, color: "green" }}
              />
            </Typography>
          </div>
          <Collapse in={showSection?.modify}>
            <div className={classes.section}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  margin: "10px 0px 5px",
                  width: "80%",
                }}
              >
                <FormControlLabel
                  classes={{
                    root: classes.switchLabel,
                    label: classes.sectionTitle,
                  }}
                  control={
                    <Switch
                      name="checkedC"
                      color="primary"
                      size="small"
                      data-testid="adminEditPermsSwitch"
                      checked={/*adminPerms.modify*/ true}
                      onChange={(e) => {
                        handleToggleAdminPerms({
                          modify: !adminPerms.modify,
                          permsType: "modify",
                        });
                      }}
                    />
                  }
                  label="Admins"
                  labelPlacement="start"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  margin: "10px 0px 5px",
                  width: "80%",
                }}
              >
                <FormControlLabel
                  classes={{
                    root: classes.switchLabel,
                    label: classes.sectionTitle,
                  }}
                  control={
                    <Switch
                      name="checkedC"
                      color="primary"
                      size="small"
                      data-testid="employeeEditPermsSwitch"
                      checked={userPerms?.modify}
                      onChange={(e) => {
                        handleToggleUserPerms({
                          modify: !userPerms?.modify,
                          permsType: "modify",
                        });
                      }}
                    />
                  }
                  label="All Employees"
                  labelPlacement="start"
                />
              </div>
              {!userPerms?.modify && (
                <>
                  <Typography
                    style={{ fontWeight: 300 }}
                    gutterBottom
                    className={classes.sectionTitle}
                  >
                    Select users or user groups
                  </Typography>
                  <div className={classes.sectionEntry}>
                    <SelectOnSteroids
                      // trackChange
                      source="permissionIdentity"
                      variables={variables}
                      onChange={(e) => _setTaskInfo(e, "modify")}
                      value={permsResource?.["modify"]}
                      type="user"
                      contents={["users", "userGroups"]}
                    />
                  </div>
                </>
              )}
            </div>
          </Collapse>
        </>
        <>
          <div
            className="_heading _collapsible"
            onClick={(e) => _toggleSection(e, "delete")}
          >
            <Typography gutterBottom className={classes.sideHeading}>
              Select who can delete the {component}
              <CheckCircleOutlineOutlined
                style={{ fontSize: 16, marginLeft: 10, color: "green" }}
              />
            </Typography>
          </div>
          <Collapse in={showSection?.delete}>
            <div className={classes.section}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  margin: "10px 0px 5px",
                  width: "80%",
                }}
              >
                <FormControlLabel
                  classes={{
                    root: classes.switchLabel,
                    label: classes.sectionTitle,
                  }}
                  control={
                    <Switch
                      name="checkedC"
                      color="primary"
                      size="small"
                      data-testid="adminDeletePermsSwitch"
                      checked={/*adminPerms.delete*/ true}
                      onChange={(e) => {
                        handleToggleAdminPerms({
                          delete: !adminPerms.delete,
                          permsType: "delete",
                        });
                      }}
                    />
                  }
                  label="Admins"
                  labelPlacement="start"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  margin: "10px 0px 5px",
                  width: "80%",
                }}
              >
                <FormControlLabel
                  classes={{
                    root: classes.switchLabel,
                    label: classes.sectionTitle,
                  }}
                  control={
                    <Switch
                      name="checkedC"
                      color="primary"
                      size="small"
                      data-testid="employeeDeletePermsSwitch"
                      checked={userPerms?.delete}
                      onChange={(e) => {
                        handleToggleUserPerms({
                          delete: !userPerms?.delete,
                          permsType: "delete",
                        });
                      }}
                    />
                  }
                  label="All Employees"
                  labelPlacement="start"
                />
              </div>
              {!userPerms?.delete && (
                <>
                  <Typography
                    style={{ fontWeight: 300 }}
                    gutterBottom
                    className={classes.sectionTitle}
                  >
                    Select users or user groups
                  </Typography>
                  <div className={classes.sectionEntry}>
                    <SelectOnSteroids
                      // trackChange
                      source="permissionIdentity"
                      variables={variables}
                      onChange={(e) => _setTaskInfo(e, "delete")}
                      value={permsResource?.["delete"]}
                      type="user"
                      contents={["users", "userGroups"]}
                    />
                  </div>
                </>
              )}
            </div>
          </Collapse>
        </>
        {/* <Button
          variant="contained"
          color="secondary"
          className={classes.createnewDataBtn}
          startIcon={<AddIcon />}
          onClick={handleCreateNewData}
        >
          Submit
        </Button> */}
      </div>
    </Slide>
  );
};

export default connect((state) => {
  return {
    activeTaskId: state.workflows.activeTask?.id,
    workflowTasks: state.workflows.workflowTasks,
    allVariables: state.workflows.variables,
    integrations: state.workflows.workflowIntegrations,
  };
})(PermissionsSidebar);
