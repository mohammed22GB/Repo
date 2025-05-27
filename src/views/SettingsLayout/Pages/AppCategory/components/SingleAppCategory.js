import { useState } from "react";
import {
  Button,
  Typography,
  ListItem,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import moment from "moment";
import DeleteOutlined from "@material-ui/icons/DeleteOutlined";
import EditOutlined from "@material-ui/icons/EditOutlined";

import useStyles from "./style";
import {
  getUserRole,
  userManagementPermission,
} from "../../../../common/utils/userRoleEvaluation";

const SingleUser = ({
  data,
  deleteMe,
  actions,
  handleModalOpen,
  deleteErr,
}) => {
  const classes = useStyles();
  const [openAssignMembers, setOpenAssignMembers] = useState(false);
  const [groupData, setGroupData] = useState({});
  const [isDeleted, setIsDeleted] = useState(false);
  const [toDeleteApp, setToDeleteApp] = useState(false);
  const [fakeGroupMemebersCount, setFakeGroupMemebersCount] = useState(
    data?.users?.length
  );

  const handleAssignMembers = () => {
    setOpenAssignMembers(true);
    setGroupData(data);
  };

  const handleRemoveGroup = async () => {
    // const conf = prompt('Are you sure? Type "delete" to confirm');
    // if (conf !== "delete") return;
    deleteMe();
    setToDeleteApp(false);
    if (!deleteErr) {
      setIsDeleted(true);
    }
  };

  // const fakeDeltaMembersLength = (delta) => {
  //   setFakeGroupMemebersCount(fakeGroupMemebersCount + delta);
  // };

  const renderAlert = (
    <Dialog
      open={toDeleteApp}
      onClose={() => setToDeleteApp(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Confirm Remove</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to REMOVE {data.name} Category?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setToDeleteApp(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={() => handleRemoveGroup()} color="primary" autoFocus>
          Remove!
        </Button>
      </DialogActions>
    </Dialog>
  );
  return (
    <>
      <div
        key={`data-${data._id}`}
        style={{
          display: isDeleted ? "none" : "flex",
        }}
      >
        <ListItem className={classes.root}>
          <ListItemText
            style={{ flex: 1.5 }}
            primary={
              <div className={classes.name}>
                <div className="description">
                  <Typography style={{ overflowWrap: "anywhere" }}>
                    {data.name}
                  </Typography>
                  {/* <Typography
                    style={{ overflowWrap: "anywhere", color: "grey" }}
                  >
                    Created on: {moment(data.createdAt).format("Do MMM YYYY")}
                  </Typography> */}
                </div>
              </div>
            }
          />
          {/* <ListItemText
            style={{ flex: 1 }}
            primary={
              <Typography style={{ overflowWrap: "anywhere" }}>
                Administrator
              </Typography>
            }
          /> */}
          <ListItemText
            style={{ flex: 1.5 }}
            primary={
              <Typography style={{ overflowWrap: "anywhere" }}>
                {moment(data.createdAt).format("Do MMM YYYY") || "--"}
              </Typography>
            }
          />
          <ListItemText
            style={{ flex: 1.2 }}
            primary={
              <div>
                <Typography
                  style={{
                    borderRadius: "50%", // 40,
                    width: 20, // 45
                    height: 20, // 21
                    background: data.color,
                    marginLeft: 8,
                    boxShadow: "0 0 6px #aaa",
                  }}
                ></Typography>
              </div>
            }
          />
          {userManagementPermission(getUserRole()) && (
            <ListItemText
              style={{ flex: 0.5 }}
              primary={
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      justifyContent: "flex-start",
                    }}
                  >
                    <EditOutlined
                      className={classes.accounticon}
                      style={{ marginLeft: 3 }}
                      onClick={() => handleModalOpen("update", data)}
                    />
                    <DeleteOutlined
                      className={classes.accounticon}
                      style={{ marginLeft: 10 }}
                      onClick={() => {
                        setToDeleteApp(true);
                      }}
                    />
                    {/* <Typography
                      style={{
                        cursor: "pointer",
                        textDecoration: "underline",
                        paddingLeft: 5,
                      }}
                    >
                      Expand
                    </Typography> */}
                  </div>
                </div>
              }
            />
          )}
        </ListItem>
      </div>
      {renderAlert}
    </>
  );
};

export default SingleUser;
