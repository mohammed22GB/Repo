import { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import { useStyles } from "../../../utils/DataMutationViewStyle";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  SHOW_FIELD,
  SHOW_COLUMNBOX,
} from "../../../../../store/actions/dataAction";
import { SetAppStatus } from "../../../../common/helpers/helperFunctions";
import { getDatasheetById } from "../../../../common/components/Query/DataSheets/datasheetQuery";

const DataAppBar = (props) => {
  const {
    sheetData,
    dataSheetColumns,
    setColumns,
    setSearchString,
    showNewColumnDialog,
    setShowNewColumnDialog,
    columnEditor,
    setColumnEditor,
    formState,
    setFormState,
    rowCount,
    id,
    rowIDs,
    dataItems,
    setDataItems,
    setDeleteItem,
    setActionMode,
    selectedRows,
    setOpenUploadDragDrop,
    permissions,
    verifiedPerms,
    userID,
  } = props;
  const classes = useStyles(makeStyles);
  const [showNewRowDialog, setShowNewRowDialog] = useState(false);

  // assign dispatch for use
  const dispatch = useDispatch();

  const [searchQuery, setsearchQuery] = useState("");

  // display row dialog for new rows
  const handleShowField = () => {
    dispatch({ type: SHOW_FIELD, payload: true });
  };

  // display column dialog for new columns
  const handleShowColumnField = () => {
    dispatch({ type: SHOW_COLUMNBOX, payload: true });
  };

  const handleSearchQuery = ({ target }) => {
    setSearchString(target.value);
    setsearchQuery(target.value);
  };

  const handleNewColumnEditor = () => {
    setColumnEditor("new");
    setFormState({});
    setShowNewColumnDialog(true);
  };
  const handleExportDataSheet = async () => {
    dispatch(SetAppStatus({ type: "info", msg: "..." }));
    //setAnchorEl(null);
    const respData = await getDatasheetById({ queryKey: [null, { id }] });
    const { data, columns, name } = respData.data;

    const headers = columns.map((col) => {
      return {
        label: col.name,
        key: col.id,
      };
    });

    return { headers, data, filename: name };
  };
  return (
    <div className={[classes.root, "filter-bar"].join(" ")}>
      <AppBar position="static" color="inherit">
        <Toolbar>
          <div className={classes.toolbarWrapper}>
            <div className={classes.leftView}>
              <div style={{ display: "flex" }}>
                {rowIDs.length ? (
                  <Button
                    variant="contained"
                    color="secondary"
                    disabled={!verifiedPerms["modify"]?.includes(userID)}
                    className={classes.deleteRowBtn}
                    startIcon={
                      <DeleteIcon
                        fontSize="small"
                        className={classes.buttonIcon}
                      />
                    }
                    onClick={() => {
                      // setDataItems({
                      //   ...dataItems,
                      //   name: `${"the selected"} row`,
                      //   type: "row",
                      // });
                      setActionMode({
                        action: "delete",
                        type: "row",
                        id: `the selected ${
                          rowIDs.length > 1 ? "rows" : "row"
                        } `,
                      });
                    }}
                    style={{ right: 20 }}
                  >
                    Delete
                  </Button>
                ) : (
                  ""
                )}
                {/* <Button
                  color="secondary"
                  disabled={!permissions["delete"]?.includes(userID)}
                  className={classes.deleteRowBtn}
                  startIcon={
                    <FileCopyIcon
                      //color="primary"
                      fontSize="small"
                      className={classes.buttonIcon}
                    />
                  }
                  onClick={() => {
                    setDataItems({
                      ...dataItems,
                      name: `${"the selected"} row`,
                      type: "row",
                    });
                    setDeleteItem(true);
                  }}
                  style={{ left: 0 }}
                  variant="contained"
                >
                  Copy
                </Button> */}
              </div>
            </div>
            {/* <div className={classes.grow} /> */}
            <div className={classes.rightView}>
              {/* {rowIDs.length ? (
                <Button
                  variant="contained"
                  color="secondary"
                  disabled={!permissions["delete"]?.includes(userID)}
                  className={classes.deleteRowBtn}
                  endIcon={<MdDeleteOutline style={{ fontSize: 18 }} />}
                  onClick={() => {
                    setDataItems({
                      ...dataItems,
                      name: `${"the selected"} row`,
                      type: "row",
                    });
                    setDeleteItem(true);
                  }}
                  style={{ right: 10 }}
                >
                  Delete {rowCount > 1 ? " Rows" : " Row"}
                </Button>
              ) : (
                ""
              )} */}
              {/* {permissions["modify"]?.includes(userID) ? (
                <IconButton
                  style={{ right: 5 }}
                  onClick={() => setOpenUploadDragDrop(true)}
                >
                  <Tooltip title="Upload">
                    <FiUpload style={{ fontSize: 18 }} />
                  </Tooltip>
                </IconButton>
              ) : (
                ""
              )}
              {permissions["view"]?.includes(userID) ? (
                <DownloadUserCSVButton
                  asyncExportMethod={handleExportDataSheet}
                >
                  <IconButton style={{ marginRight: 5 }}>
                    <Tooltip title="Download">
                      <GetAppIcon style={{ fontSize: 18 }} />
                    </Tooltip>
                  </IconButton>
                </DownloadUserCSVButton>
              ) : (
                ""
              )}
              <TextField
                id="input-with-icon-textfield"
                placeholder="Enter search item here"
                size="small"
                inputMode="search"
                InputProps={{
                  className: classes.inputRoot,
                  endAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon htmlColor="#999" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                value={searchQuery}
                onChange={(e) => handleSearchQuery(e)}
              />

              {permissions["modify"]?.includes(userID) ? (
                <div className={classes.createBtns}>
                  <Button
                    variant="contained"
                    color="secondary"
                    className={classes.createrowBtn}
                    startIcon={<AddIcon />}
                    onClick={() => setShowNewRowDialog(true)}
                  >
                    New Row
                  </Button>

                  <Button
                    variant="contained"
                    color="secondary"
                    className={classes.createcolBtn}
                    startIcon={<AddIcon />}
                    onClick={() => handleNewColumnEditor()}
                  >
                    New Column
                  </Button>
                </div>
              ) : (
                ""
              )} */}
            </div>
          </div>
        </Toolbar>
      </AppBar>
      {/* <ColumnDialog
        sheetData={sheetData}
        showMe={showNewColumnDialog}
        setShowMe={setShowNewColumnDialog}
        columns={dataSheetColumns}
        columnEditor={columnEditor}
        setColumnEditor={setColumnEditor}
        columnName={dataItems?.name}
        formState={formState}
        setFormState={setFormState}
        datasheetId={id}
      />
      <NewRowDialog
        sheetData={sheetData}
        showMe={showNewRowDialog}
        setShowMe={setShowNewRowDialog}
        columns={dataSheetColumns}
        setColumns={setColumns}
      /> */}
    </div>
  );
};

export default DataAppBar;
