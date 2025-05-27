import React, { Fragment, useState } from "react";
import { useHistory } from "react-router";
import {
  Menu,
  MenuItem,
  Backdrop,
  Dialog,
  DialogTitle,
  IconButton,
} from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";

import { EditAccountForm } from "../EditAccountForm";
import { UserDump } from "../UserDump";

import CustomAlertBox from "../../../common/components/CustomAlertBox/CustomAlertBox";

/**
 * @param {{ data: Account }}
 */
export const ActionMenu = ({ data }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const initialModalValues = {
    open: false,
    component: null,
    title: "",
  };
  const [modal, setModal] = useState(initialModalValues);
  const [showPrompt, setShowPrompt] = useState(false);

  const isMenuOpen = Boolean(anchorEl);
  const history = useHistory();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseModal = () => {
    setModal(initialModalValues);
  };

  const handleUserDump = ({ _id }) => {
    setModal({
      open: true,
      component: <UserDump handleClose={handleCloseModal} accountId={_id} />,
      title: "Export User Dump",
    });
  };

  const handleClosePrompt = () => {
    setShowPrompt(false);
  };

  return (
    <Fragment>
      <IconButton
        aria-controls="action-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVert />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        id="action-menu"
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isMenuOpen}
        onClose={handleClose}
      >
        {[
          {
            name: "View details",
            active: true,
            routesOnClick: true,
            onClick: () => {
              if (data.slug) {
                history.push({
                  pathname: `/administration/${data.slug}`,
                  state: data,
                });
              } else {
                setShowPrompt(true);
              }
            },
          },
          {
            name: "Edit details",
            active: true,
            onClick: () => {
              setModal({
                open: true,
                title: "Edit organization",
                component: (
                  <EditAccountForm
                    initialValues={data}
                    handleClose={handleCloseModal}
                    id={data._id}
                  />
                ),
              });
            },
          },
          {
            name: "View users",
            active: true,
            routesOnClick: true,
            href: `/settings/user-management?account=${data._id}`,
          },
          {
            name: "Export users",
            active: true,
            onClick: () => {
              handleUserDump(data);
            },
          },
        ].map(({ name, active, onClick, href }, idx) => {
          return (
            <MenuItem
              button
              key={idx}
              disabled={!active}
              onClick={onClick}
              href={href}
              component={href ? "a" : "div"}
              style={{
                fontSize: 12,
              }}
            >
              {name}
            </MenuItem>
          );
        })}
      </Menu>

      <Dialog
        open={modal.open}
        onClose={handleCloseModal}
        aria-labelledby="edit-dialog"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <DialogTitle
          id="edit-dialog"
          style={{
            borderBottom: "1px solid #EEEEEE",
          }}
        >
          {modal.title}
        </DialogTitle>
        {modal.component}
      </Dialog>

      <CustomAlertBox
        open={showPrompt}
        closeConfirmBox={handleClosePrompt}
        text="Invalid account"
      />
    </Fragment>
  );
};
