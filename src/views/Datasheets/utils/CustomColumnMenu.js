import {
  GridColumnMenuContainer,
  GridFilterMenuItem,
  SortGridMenuItems,
  HideGridColMenuItem,
  GridColumnsMenuItem,
} from "@material-ui/data-grid";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const CustomColumnMenu = (props) => {
  const {
    hideMenu,
    currentColumn,
    setActionMode,
    verifiedPerms,
    permissions,
    userID,
  } = props;

  const handleClickActions = (e, action) => {
    let actionMode;

    switch (action) {
      case "edit":
        actionMode = {
          action,
          type: "column",
          id: currentColumn?.field,
        };
        break;

      case "delete":
        actionMode = {
          action,
          type: "column",
          id: currentColumn?.field,
        };
        break;

      default:
        break;
    }

    setActionMode(actionMode);
    hideMenu(e);
  };

  return (
    <GridColumnMenuContainer hideMenu={hideMenu} currentColumn={currentColumn}>
      <SortGridMenuItems onClick={hideMenu} column={currentColumn} />
      <GridFilterMenuItem onClick={hideMenu} column={currentColumn} />
      <HideGridColMenuItem onClick={hideMenu} column={currentColumn} />
      <GridColumnsMenuItem onClick={hideMenu} column={currentColumn} />
      {verifiedPerms["modify"]?.includes(userID) ? (
        <ListItem
          button
          style={{
            paddingTop: 2,
            paddingBottom: 2,
          }}
          onClick={(e) => handleClickActions(e, "edit")}
          column={currentColumn}
        >
          <ListItemText
            disableTypography
            style={{ fontSize: 12 }}
            primary="Edit column"
          />
        </ListItem>
      ) : (
        ""
      )}

      {verifiedPerms["modify"]?.includes(userID) ? (
        <ListItem
          button
          style={{
            paddingTop: 2,
            paddingBottom: 2,
          }}
          onClick={(e) => handleClickActions(e, "delete")}
          column={currentColumn}
        >
          <ListItemText
            disableTypography
            style={{ fontSize: 12 }}
            primary="Delete column"
          />
        </ListItem>
      ) : (
        ""
      )}
    </GridColumnMenuContainer>
  );
};

export default CustomColumnMenu;
