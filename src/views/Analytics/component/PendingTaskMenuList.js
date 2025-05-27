import { Menu, MenuItem } from "@material-ui/core";
import {
  getUserRole,
  userManagementPermission,
} from "../../common/utils/userRoleEvaluation";

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
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      id={"screens-menu"}
      keepMounted
      transformOrigin={{ vertical: "bottom", horizontal: "left" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {[
        {
          name: "Send Reminder",
          anchorRef,
          onClick: () => {
            handleReminderMail();
            setAnchorEl(null);
          },
        },
        userManagementPermission(getUserRole()) && {
          name: "Reassign Task",
          anchorRef,
          onClick: () => {
            setShowSideBar(true);
            setAnchorEl(null);
          },
        },
      ].map((data, idx) => (
        <MenuItem
          button
          key={idx}
          onClick={data.onClick}
          anchorRef={data.anchorRef}
        >
          {data.name}
        </MenuItem>
      ))}
    </Menu>
  );
};

export default PendingTaskMenuList;
