import { useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import { Menu, MenuItem } from "@material-ui/core";
import { useQueryClient } from "react-query";

import DownloadUserCSVButton from "./CSVExport";
import useCustomMutation from "../../common/utils/CustomMutation";
import {
  deleteDataSheet,
  duplicateDataSheet,
} from "../../common/components/Mutation/Datasheets/datasheetMutation";
import { SetAppStatus } from "../../common/helpers/helperFunctions";
import { getDatasheetById } from "../../common/components/Query/DataSheets/datasheetQuery";

const MenuList = ({
  history,
  setAnchorEl,
  anchorEl,
  id,
  setShowSideBar,
  verifiedPerms,
  userID,
}) => {
  const isMenuOpen = Boolean(anchorEl);
  //console.log(isMenuOpen);
  const dispatch = useDispatch();

  const onDeleteDatasheetSuccess = async () => {
    setAnchorEl(() => null);
    await queryClient.invalidateQueries(["datasheetLists"]);
  };

  const onDuplicateDatasheetSuccess = async () => {
    setAnchorEl(() => null);
    await queryClient.invalidateQueries(["datasheetLists"]);
  };

  const queryClient = useQueryClient();
  const { mutate: deleteDatasheet } = useCustomMutation({
    apiFunc: deleteDataSheet,
    onSuccess: onDeleteDatasheetSuccess,
    retries: 0,
  });

  const { mutate: duplicateDatasheet } = useCustomMutation({
    apiFunc: duplicateDataSheet,
    onSuccess: onDuplicateDatasheetSuccess,
    retries: 0,
  });

  const handleExportDataSheet = async () => {
    dispatch(SetAppStatus({ type: "info", msg: "..." }));
    setAnchorEl(null);
    const respData = await getDatasheetById({ queryKey: [null, { id }] });
    const { data, columns, name } = respData?.data ?? {};

    const headers = columns?.map((col) => {
      return {
        label: col.name,
        key: col.id,
      };
    });

    return { headers, data, filename: name };
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDataSheetSwitch = ({
    name,
    id,
    setAnchorEl,
    deleteDatasheet,
    duplicateDatasheet,
  }) => {
    switch (name?.toLowerCase()) {
      case "delete":
        setAnchorEl(null);
        const prompt = window.prompt(
          'Are you sure you want to delete this DataSheet? Type "delete" to confirm'
        );
        if (!!prompt && prompt?.toLowerCase() === "delete")
          deleteDatasheet({ id });
        break;

      case "duplicate":
        duplicateDatasheet({ datasheet: id });
        break;

      case "export":
        handleExportDataSheet();
        break;

      case "permissions":
        setShowSideBar(true);
        setAnchorEl(() => null);
        // handleExportDataSheet({ sheets, id, setAnchorEl });
        break;

      default:
        break;
    }
  };

  return (
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
        { name: "Export", disabled: !verifiedPerms["read"].includes(userID) },
        {
          name: "Duplicate",
          disabled: !verifiedPerms["modify"].includes(userID),
        },
        { name: "Delete", disabled: !verifiedPerms["delete"].includes(userID) },
        verifiedPerms["create"].includes(userID) && {
          name: "Permissions",
          disabled: !verifiedPerms["delete"].includes(userID),
        },
        // { name: "Import" },
      ].map(({ name, disabled }, idx) => (
        <MenuItem
          button
          key={idx}
          disabled={disabled}
          onClick={(e) => {
            handleDataSheetSwitch({
              name,
              id,
              setAnchorEl,
              deleteDatasheet,
              duplicateDatasheet,
            });
          }}
        >
          {name !== "Export" ? (
            name
          ) : (
            <DownloadUserCSVButton asyncExportMethod={handleExportDataSheet}>
              {name}
            </DownloadUserCSVButton>
          )}
        </MenuItem>
      ))}
    </Menu>
  );
};

export default withRouter(MenuList);
