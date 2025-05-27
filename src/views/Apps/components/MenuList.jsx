import React from "react";
import { withRouter } from "react-router-dom";
import { Menu, MenuItem } from "@material-ui/core";
import { APPS_CONTROL_MODES } from "../../EditorLayout/Pages/Workflow/components/utils/constants";
import { getUserRole, PLUG_ROLES } from "../../common/utils/userRoleEvaluation";

const MenuList = ({
  setAnchorEl,
  anchorEl,
  active,
  sendMenuAction,
  appsControlMode,
}) => {
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        id={"screens-menu"}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        {[
          // { name: "Duplicate" },
          ...(active && appsControlMode === APPS_CONTROL_MODES.APP
            ? [{ name: "Copy link" }]
            : []),
          { name: "Properties" },
          ...(getUserRole().includes(PLUG_ROLES.ROLE_PLUGADMIN)
            ? [{ name: "Export" }]
            : []),
          { name: "Delete" },
        ].map(({ name }, idx) => (
          <MenuItem
            button
            key={idx}
            onClick={(e) => {
              sendMenuAction(name);
              handleMenuClose();
            }}
            style={{ fontWeight: 300, lineHeight: "19px" }}
          >
            {name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default withRouter(MenuList);
