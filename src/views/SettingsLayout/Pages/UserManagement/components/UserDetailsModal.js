import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  Modal,
  Fade,
  Backdrop,
  IconButton,
} from "@material-ui/core";
import Cancel from "@material-ui/icons/Cancel";
import ReactSpinnerTimer from "react-spinner-timer";

import useStyles from "./style";
import SelectOnSteroids from "../../../../EditorLayout/Pages/Workflow/components/RightSidebar/components/sidebarActions/common/SelectOnSteroids";
import { validateEmail } from "../../../../common/helpers/validation";
import {
  getHighestRole,
  PLUG_ROLES,
} from "../../../../common/utils/userRoleEvaluation";

export default function UserDetailsModal({
  closeModal,
  mode,
  data,
  dialogLoading,
}) {
  const classes = useStyles();
  const relevantFields_ = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    mobile: data.mobile,
    employeeId: data?.employeeId,
    lineManager: data?.lineManager,
    roles: data.roles,
    userGroups: data.userGroups,
  };
  const [relevantFields, setRelevantFields] = useState(relevantFields_);
  const [formData, setFormData] = useState({});
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [directorySyncUsers, setDirectorySyncUsers] = useState([]);
  const checkEmailError = validateEmail(relevantFields?.email);
  const [selectedNewUser, setSelectedNewUser] = useState([]);
  const [isConfigLoading, setIsConfigLoading] = useState(false);
  const [pageNo, setPageNo] = useState(0);

  useEffect(() => {
    const updatedFields = { ...relevantFields, ...formData };
    setRelevantFields(updatedFields);

    const isEmailValid = validateEmail(updatedFields.email);

    if (
      !updatedFields.firstName ||
      !updatedFields.lastName ||
      !isEmailValid ||
      !updatedFields.roles?.length
    ) {
      setDisableSubmit(true);
    } else {
      setDisableSubmit(false);
    }
  }, [formData]);

  const _handleNewUserForm = async () => {
    closeModal({
      mode,
      data:
        mode === "add"
          ? {
              ...formData,
              lineManager: formData?.lineManager?.id,
              userGroups: formData.userGroups?.map((userGroup) => userGroup.id),
            }
          : {
              id: data?.id,
              ...formData,
              lineManager: formData?.lineManager?.id,
              userGroups: formData.userGroups?.map((userGroup) => userGroup.id),
            },
    });
  };
  const handleSpinner = (lap) => {
    if (lap.isFinish) {
      setIsConfigLoading(false);
    }
  };

  if (isConfigLoading) {
    return (
      <div className={classes.loadingPage}>
        <ReactSpinnerTimer
          timeInSeconds={3}
          totalLaps={2}
          isRefresh={false}
          onLapInteraction={handleSpinner}
        />
      </div>
    );
  }

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      id="user-modal-outer"
      className={classes.modal}
      open={true}
      onClose={closeModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={true}>
        <div className={classes.paper2} id="user-modal-box">
          <div>
            <div className={classes.modalHead}>
              <Typography
                variant="h5"
                component="h2"
                style={{ textTransform: "capitalize" }}
              >
                {mode} User
              </Typography>
              <IconButton
                aria-label="cancel"
                color="inherit"
                onClick={closeModal}
              >
                <Cancel fontSize="small" />
              </IconButton>
            </div>

            <div className={classes.modalMain} id="user-modal-main">
              <Grid container direction="column" spacing={3}>
                <Grid item>
                  <Typography variant="h6" className={classes.formLabel}>
                    First name
                    <span style={{ color: "red" }}>{"*"}</span>
                  </Typography>
                  <TextField
                    name="firstName"
                    defaultValue={relevantFields?.firstName}
                    error={!relevantFields?.firstName}
                    disabled={mode === "view" ? true : false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    fullWidth
                    id="outlined-basic"
                    variant="outlined"
                    placeholder="Enter first name here"
                    size="small"
                  />
                </Grid>
                <Grid item>
                  <Typography variant="h6" className={classes.formLabel}>
                    Last name
                    <span style={{ color: "red" }}>{"*"}</span>
                  </Typography>
                  <TextField
                    name="lastName"
                    defaultValue={relevantFields?.lastName}
                    error={!relevantFields?.lastName}
                    disabled={mode === "view" ? true : false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    fullWidth
                    id="outlined-basic"
                    variant="outlined"
                    placeholder="Enter last name here"
                    size="small"
                  />
                </Grid>
                <Grid item>
                  <Typography variant="h6" className={classes.formLabel}>
                    Email address
                    <span style={{ color: "red" }}>{"*"}</span>
                  </Typography>
                  <TextField
                    name="email"
                    error={
                      (!checkEmailError && formData.email) ||
                      !relevantFields?.email
                    }
                    helperText={
                      !checkEmailError && formData.email
                        ? "Please provide a valid email address"
                        : null
                    }
                    defaultValue={relevantFields?.email}
                    disabled={mode !== "add" ? true : false}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        [e.target.name]: e.target.value,
                      });
                    }}
                    fullWidth
                    id="outlined-basic"
                    variant="outlined"
                    placeholder="Enter email address here"
                    size="small"
                  />
                </Grid>
                <Grid item>
                  <Typography variant="h6" className={classes.formLabel}>
                    Phone
                  </Typography>
                  <TextField
                    name="mobile"
                    defaultValue={relevantFields?.mobile}
                    disabled={mode === "view" ? true : false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    fullWidth
                    id="outlined-basic"
                    variant="outlined"
                    placeholder="Enter phone here"
                    size="small"
                    inputMode="tel"
                    type="number"
                    className={classes.phoneInput}
                  />
                </Grid>
                <Grid item>
                  <Typography variant="h6" className={classes.formLabel}>
                    Employee ID
                  </Typography>
                  <TextField
                    name="employeeId"
                    defaultValue={relevantFields?.employeeId}
                    disabled={mode === "view" ? true : false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [e.target.name]: e.target.value,
                      })
                    }
                    fullWidth
                    id="outlined-basic"
                    variant="outlined"
                    placeholder="Enter employee ID here"
                    size="small"
                  />
                </Grid>
                <Grid item>
                  <Typography variant="h6" className={classes.formLabel}>
                    Line manager
                  </Typography>
                  <FormControl
                    name="lineManager"
                    id="lineManager"
                    className={classes.formControl}
                    variant="outlined"
                    size="small"
                    fullWidth
                  >
                    <SelectOnSteroids
                      name="lineManager"
                      type="user"
                      source="users"
                      multiple={false}
                      value={
                        relevantFields?.lineManager
                          ? [
                              {
                                id: relevantFields?.lineManager?.id,
                                name:
                                  relevantFields?.lineManager?.name ||
                                  relevantFields?.lineManager?.firstName +
                                    " " +
                                    relevantFields?.lineManager?.lastName,
                                usersType: "User",
                              },
                            ]
                          : []
                      }
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          lineManager: e?.[0],
                        });
                      }}
                      contents={["users"]}
                      disabled={mode === "view" ? true : false}
                    />
                  </FormControl>
                </Grid>
                <Grid item>
                  <Typography variant="h6" className={classes.formLabel}>
                    Roles
                    <span style={{ color: "red" }}>{"*"}</span>
                  </Typography>
                  <FormControl
                    className={classes.formControl}
                    variant="outlined"
                    size="small"
                    fullWidth
                  >
                    <Select
                      name="roles"
                      disabled={mode === "view" ? true : false}
                      error={!relevantFields.roles?.length}
                      value={getHighestRole(relevantFields?.roles) || []}
                      onChange={(e) => {
                        const singleRole = e.target.value;
                        const singleRoleArray = [singleRole];
                        setFormData({
                          ...formData,
                          roles: singleRoleArray,
                        });
                      }}
                      displayEmpty
                      className={classes.selectEmpty}
                      defaultValue={10}
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem value="" disabled>
                        <em>None</em>
                      </MenuItem>
                      {Object.values(PLUG_ROLES)
                        .filter((role) => role !== PLUG_ROLES.ROLE_PLUGADMIN)
                        .map((role, ind) => (
                          <MenuItem
                            key={ind}
                            value={role}
                            data-testid={`user-management-roles-selector-${role
                              .replace(" ", "-")
                              .toLowerCase()}`}
                          >
                            {role}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item>
                  <Typography variant="h6" className={classes.formLabel}>
                    User groups
                  </Typography>
                  <FormControl
                    name="userGroups"
                    id="userGroups"
                    className={classes.formControl}
                    variant="outlined"
                    size="small"
                    fullWidth
                  >
                    <SelectOnSteroids
                      name="userGroups"
                      type="user"
                      source="userGroups"
                      value={relevantFields?.userGroups?.map((userGroup) => ({
                        id: userGroup.id,
                        name: userGroup.name,
                        userGroupsType: "UserGroups",
                      }))}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          userGroups: e, //e?.map((eachSelect) => eachSelect.id),
                        });
                      }}
                      contents={["userGroups"]}
                      disabled={mode === "view" ? true : false}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </div>

            <div className={classes.modalBase}>
              <FormControl>
                <Button
                  id="new-user-cancel-btn"
                  onClick={closeModal}
                  variant="contained"
                  color="primary"
                  type="button"
                  classes={{
                    root: classes.customButton,
                    label: classes.customButtonLabel,
                  }}
                  disabled={dialogLoading}
                >
                  Cancel
                </Button>
              </FormControl>
              {mode !== "view" && (
                <FormControl size="small" style={{ marginLeft: 10 }}>
                  <Button
                    id="new-user-submit-btn"
                    onClick={_handleNewUserForm}
                    variant="contained"
                    color="primary"
                    type="button"
                    classes={{
                      root: classes.customButton,
                      label: classes.customButtonLabel,
                    }}
                    disabled={dialogLoading || disableSubmit}
                  >
                    Save
                  </Button>
                </FormControl>
              )}
            </div>
          </div>
        </div>
      </Fade>
    </Modal>
  );
}
