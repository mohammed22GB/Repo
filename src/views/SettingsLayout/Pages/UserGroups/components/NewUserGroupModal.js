import { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  Button,
  FormControl,
  Modal,
  Fade,
  Backdrop,
  IconButton,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Box,
} from "@material-ui/core";
import Cancel from "@material-ui/icons/Cancel";
import useStyles from "./style";
import {
  updateUserGroupAPI,
  getDirectorySyncGroups,
  addGroupFromDirectorySync,
} from "../utils/usergroupsAPIs";
import { useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { userGroupSelection } from "../utils/usergrouputils";
import useCustomQuery from "../../../../common/utils/CustomQuery";
import {
  errorToastify,
  successToastify,
} from "../../../../common/utils/Toastify";
import ReactSpinnerTimer from "react-spinner-timer";

export default function NewUserModal({
  closeModal,
  saveNewUserGroup,
  id,
  name,
  description,
  mode,
  reloadPage,
  showSelectUserGroupType,
  userGroupType,
}) {
  const classes = useStyles();
  const queryClient = useQueryClient();
  const [newFormData, setNewFormData] = useState({
    name: name || "",
    description: description || "",
    type: userGroupType ?? "",
  });
  const [emptyFieldCheck, setEmptyFieldCheck] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const [directorySyncGroups, setDirectorySyncGroups] = useState([]);
  const [updatedGroup, setUpdatedGroup] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [isConfigLoading, setIsConfigLoading] = useState(false);

  const _updateForm = (orig, val) => {
    setNewFormData({
      ...newFormData,
      [orig]: val,
    });
  };

  const _handleNewUserForm = async () => {
    if (!newFormData.name || !newFormData.description) {
    } else if (mode === "edit") {
      setEmptyFieldCheck(true);

      const editedResponse = await updateUserGroupAPI({
        data: { id, ...newFormData },
      });
      setNewFormData({});

      if (editedResponse) {
        queryClient.invalidateQueries(["allUserGroups"]);
      }
    } else {
      closeModal({ mode: "add", data: newFormData });
      setNewFormData({});
    }
  };

  useEffect(() => {
    const isEmptyField =
      !newFormData.name || !newFormData.description || !newFormData.type;

    setEmptyFieldCheck(isEmptyField);
  }, [newFormData]);

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
      data-testid="user-group-modal"
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
        <div className={classes.paper2}>
          <div>
            <div className={classes.modalHead}>
              <Typography
                variant="h5"
                component="h2"
                style={{
                  textTransform: "capitalize",
                  fontWeight: 500,
                }}
              >
                {mode === "edit" ? "Edit user group" : " Create new user group"}
              </Typography>
              <IconButton
                aria-label="cancel"
                color="inherit"
                onClick={closeModal}
              >
                <Cancel fontSize="large" htmlColor="#ABB3BF" />
              </IconButton>
            </div>
            <div className={classes.modalMain}>
              <Grid
                container
                direction="column"
                spacing={3}
                classes={{
                  root: classes.gridRoot,
                }}
              >
                <Grid item>
                  <Typography variant="h6" className={classes.formLabel}>
                    Name<span style={{ color: "red" }}>{"*"}</span>
                  </Typography>
                  <TextField
                    data-testid="name"
                    onChange={(e) => _updateForm("name", e.target.value)}
                    fullWidth
                    id="outlined-basic"
                    variant="outlined"
                    placeholder="Enter user group name"
                    size="medium"
                    classes={{
                      root: classes.rootTextField,
                    }}
                    defaultValue={name ?? ""}
                  />
                </Grid>

                {mode !== "edit" && (
                  <>
                    {showSelectUserGroupType && (
                      <Grid item>
                        <Typography variant="h6" className={classes.formLabel}>
                          Type<span style={{ color: "red" }}>{"*"}</span>
                        </Typography>
                        <Select
                          data-testid="type"
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={newFormData.type || "Choose"}
                          onChange={(e) => {
                            setNewFormData({
                              type: e.target.value,
                            });
                            _updateForm("type", e.target.value);
                          }}
                          fullWidth
                          variant="outlined"
                          classes={{
                            root: classes.selectRootField,
                          }}
                        >
                          <MenuItem value={"Choose"} selected disabled>
                            Choose user group type
                          </MenuItem>
                          {userGroupSelection.map((item, index) => (
                            <MenuItem key={index} value={item.value}>
                              {item.type}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                    )}
                  </>
                )}

                <Grid item>
                  <Typography variant="h6" className={classes.formLabel}>
                    Description<span style={{ color: "red" }}>{"*"}</span>
                  </Typography>
                  <TextField
                    data-testid="description"
                    onChange={(e) => _updateForm("description", e.target.value)}
                    fullWidth
                    id="outlined-basic"
                    variant="outlined"
                    placeholder="Enter group description"
                    multiline
                    size="medium"
                    defaultValue={description ?? ""}
                    classes={{
                      root: classes.selectDescriptionField,
                    }}
                  />
                </Grid>
              </Grid>
            </div>

            <div className={classes.modalBase}>
              <FormControl>
                <Button
                  onClick={closeModal}
                  variant="outlined"
                  color="primary"
                  style={{
                    backgroundColor: "#FFFFFF",
                    color: "#2457C1",
                    border: "1px solid #2457C1",
                  }}
                  classes={{
                    root: classes.customButton,
                  }}
                >
                  Cancel
                </Button>
              </FormControl>
              <FormControl size="small" style={{ marginLeft: 10 }}>
                <Button
                  onClick={_handleNewUserForm}
                  variant="contained"
                  color="primary"
                  disabled={emptyFieldCheck}
                  classes={{
                    root: classes.customButton,
                  }}
                  style={{
                    backgroundColor: emptyFieldCheck ? "#ccc" : "#2457c1",
                    color: "#fff",
                  }}
                >
                  Save
                </Button>
              </FormControl>
            </div>
          </div>
        </div>
      </Fade>
    </Modal>
  );
}
