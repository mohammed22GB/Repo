import {
  ListItem,
  ListItemText,
  Typography,
  IconButton,
} from "@material-ui/core";
import React, { useState } from "react";
import MoreVert from "@material-ui/icons/MoreVert";

import useStyles from "./style";
import Tiler from "./Tiler";
import { StatusSwitchStyles } from "./SwitchStyles";
import MenuList from "./MenuList";
import { removeUserAPI, resendMailAPI } from "../utils/usersAPIs";
import { successToastify } from "../../../../common/utils/Toastify";
import CustomConfirmBox from "../../../../common/components/CustomConfirmBox/CustomConfirmBox";

const SingleUser = ({
  item,
  handleModalOpen,
  doRemove,
  switchStatus,
  userGroups,
}) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  // const [isActive, setIsActive] = React.useState(item.status === 'Active' ? true : false);
  const [isDeleted, setIsDeleted] = React.useState(false);
  const [toDeleteUser, setToDeleteUser] = React.useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const anchorRef = React.useRef(null);
  //const statusSwitch = statusSwitchStyles();

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const handleListKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  };

  const _deleteUser = async () => {
    const resp = await removeUserAPI({ data: { id: item.id } });
    if (resp._meta.success) {
      setIsDeleted(true);
      doRemove(item.id);
      setToDeleteUser(false);
      // successToastify('User removed successfully');
    } else {
      // errorToastify(resp.message);
    }
  };

  const handleResendMail = async (email) => {
    const response = await resendMailAPI(email);
    //console.log(response);
    if (response._meta.success) {
      successToastify("Mail sent successfully");
    }
  };

  const _handleSwitch = async (value) => {
    switchStatus(value);

    /* setIsActive(value);

      const resp = { status: "fail" }; // await handleUserActions(item, value ? 'Active' : 'Inactive');
      if(resp.status === "success") {
          doRemove(item.id);
          setToDeleteUser(false);
          // successToastify('Status changed successfully');
      } else {
          // errorToastify(resp.message);
      } */
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const handleMoreOptionClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  return (
    <ListItem
      key={`item-${item}`}
      style={{
        fontSize: 12,
        padding: 0,
        // paddingTop: 12,
        // paddingBottom: 12,
        // marginBottom: 3,
        backgroundColor: "#FFFFFF",
        display: isDeleted ? "none" : "flex",
      }}
    >
      {/* <ListItemText
        style={{ flex: 1 }}
        primary={
          <Checkbox
            color="primary"
            size="small"
            inputProps={{ "aria-label": "secondary checkbox" }}
          />
        }
      /> */}
      <ListItemText
        style={{ flex: 2.5 }}
        primary={
          <Typography style={{ overflowWrap: "anywhere", fontSize: 12 }}>
            {item.firstName || "--"}
          </Typography>
        }
      />
      <ListItemText
        style={{ flex: 2.5 }}
        primary={
          <Typography style={{ overflowWrap: "anywhere", fontSize: 12 }}>
            {item.lastName || "--"}
          </Typography>
        }
      />
      <ListItemText
        style={{ flex: 4.5 }}
        primary={
          <Typography style={{ overflowWrap: "anywhere", fontSize: 12 }}>
            {item.email || "--"}
          </Typography>
        }
      />
      <ListItemText
        style={{ flex: 3 }}
        primary={<Tiler items={item.roles || []} />}
      />
      <ListItemText
        style={{ flex: 3 }}
        primary={
          <Tiler items={item.userGroups || []} userGroups={userGroups} />
        }
      />
      <ListItemText
        style={{ flex: 2, textAlign: "center" }}
        primary={
          <StatusSwitchStyles
            //classes={statusSwitch}
            //color="primary"
            //size="small"
            checked={item.active}
            disabled={item.newUser}
            onChange={(e) => _handleSwitch(e.target.checked)}
          />
        }
      />
      <ListItemText
        style={{ flex: 2 }}
        primary={
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <IconButton
              style={{ padding: 7 }}
              onClick={(e) => handleMoreOptionClick(e)}
            >
              <MoreVert style={{ fontSize: 18 }} />
            </IconButton>{" "}
            <MenuList
              handleModalOpen={handleModalOpen}
              setToDeleteUser={setToDeleteUser}
              setAnchorEl={setAnchorEl}
              anchorEl={anchorEl}
              anchorRef={anchorRef}
              item={item}
              handleResendMail={handleResendMail}
            />
          </div>
        }
      />
      {toDeleteUser && (
        <CustomConfirmBox
          closeConfirmBox={() => setToDeleteUser(false)}
          text={`Are you sure you want to REMOVE user ${item.firstName} ${item.lastName}?`}
          open={toDeleteUser}
          confirmAction={_deleteUser}
        />
      )}
    </ListItem>
  );
};

export default SingleUser;
