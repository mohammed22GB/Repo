import { useState } from "react";
import { withRouter } from "react-router-dom";
import { Menu, MenuItem } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import DownloadUserCSVButton from "./CSVExport";

const MenuList = ({
  history,
  setAnchorEl,
  anchorEl,
  slug,
  id,
  userID,
  verifiedPerms,
  handleDashboardMenu,
  handleExportDashboard,
}) => {
  const isMenuOpen = Boolean(anchorEl);
  const dispatch = useDispatch();
  const [uid, setUid] = useState(uuidv4());
  const [menuPerms, setMenuPerms] = useState({
    read: false,
    modify: false,
  });

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // useEffect(() => {
  //   setMenuPerms((prev) => ({
  //     ...prev,
  //     modify: verifiedPerms["modify"].includes(userID),
  //     read: verifiedPerms["read"].includes(userID),
  //   }));
  // }, [verifiedPerms]);

  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={"screens-menu"}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      key={uid}
    >
      {[
        { name: "Edit", active: verifiedPerms["modify"].includes(userID) },
        { name: "Export", active: verifiedPerms["read"].includes(userID) },
        { name: "Delete", active: verifiedPerms["modify"].includes(userID) },
        {
          name: "Permissions",
          active: verifiedPerms["modify"].includes(userID),
        },
        // { name: "Import" },
      ].map(({ name, active }, idx) => (
        <MenuItem
          button
          key={idx}
          disabled={!active}
          onClick={(e) => {
            handleDashboardMenu({
              name,
              id,
              slug,
              setAnchorEl,
            });
          }}
        >
          {name !== "Export" ? (
            name
          ) : (
            <DownloadUserCSVButton asyncExportMethod={handleExportDashboard}>
              {name}
            </DownloadUserCSVButton>
          )}
        </MenuItem>
      ))}
    </Menu>
  );
};

export default withRouter(MenuList);
