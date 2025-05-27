import { Menu, MenuItem } from "@material-ui/core";
import {
  userManagementPermission,
  getUserRole,
} from "../../../common/utils/userRoleEvaluation";

const PendingTaskMenuList = ({
  setAnchorEl,
  anchorEl,
  id,
  setShowSideBar,
  anchorRef,
  handleReminderMail,
}) => {
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      id={"screens-menu"}
      keepMounted
      transformOrigin={{ vertical: "bottom", horizontal: "left" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {[
        {
          name: "Send reminder",
          anchorRef,
          onClick: () => {
            handleReminderMail();
            setAnchorEl(null);
          },
        },
        userManagementPermission(getUserRole()) && {
          name: "Reassign task",
          anchorRef,
          onClick: () => {
            setShowSideBar(true);
            setAnchorEl(null);
          },
        },
      ].map((data, idx) => {
        return (
          <MenuItem
            button
            key={idx}
            onClick={data.onClick}
            anchorRef={data.anchorRef}
          >
            {data.name}
          </MenuItem>
        );
      })}
    </Menu>
  );
};

export default PendingTaskMenuList;
