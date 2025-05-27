import { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { Button, Grid, Menu, MenuItem, Tooltip } from "@material-ui/core";
import moment from "moment";
import {
  DataGrid,
  GridFilterForm,
  GridFilterPanel,
} from "@material-ui/data-grid";
import { useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { FiUpload, FiDownload } from "react-icons/fi";

import ActionDialog from "./Components/ActionDialog";
import ColumnDialog from "./Components/ColumnDialog";
import NewRowDialog from "./Components/NewRowDialog";
import DataAppBar from "./Components/DataAppBar";
import DownloadUserCSVButton from "../../components/CSVExport";
import useCustomQuery from "../../../common/utils/CustomQuery";
import {
  getDatasheetById,
  getResourcePermissions,
} from "../../../common/components/Query/DataSheets/datasheetQuery";
import { SetAppStatus } from "../../../common/helpers/helperFunctions";
import { successToastify } from "../../../common/utils/Toastify";
import useCustomMutation from "../../../common/utils/CustomMutation";
import {
  delDataSheetColumn,
  delDataSheetRow,
  UpdateRowData,
} from "../../../common/components/Mutation/Datasheets/datasheetMutation";
import { filterDuplicateItems, groupPermissionsByAccess } from "../../utils";
import { setDataPermissions } from "../../../common/helpers/Data";
import MainPageLayout from "../../../common/components/AppLayout/MainPageLayout";
import { mainNavigationListNames } from "../../../common/utils/lists";
import CustomColumnMenu from "../../utils/CustomColumnMenu";
import UploadDragDrop from "../../../common/components/UploadDragDrop";

const Datasheet = ({ match }) => {
  const queryClient = useQueryClient();
  const { pageSearchText } = useSelector(({ reducers }) => reducers);
  const { permissions } = useSelector(({ dataReducer }) => dataReducer);

  const [initialColumns, setInitialColumns] = useState([]);

  const [selectedColumn, setSelectedColumn] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);

  const [activeColumnId, setActiveColumnId] = useState({});
  const [formattedColumns, setFormattedColumns] = useState([]);
  const [initialRows, setInitialRows] = useState([]);
  const [formattedRows, setFormattedRows] = useState([]);
  const [presentedRows, setPresentedRows] = useState([]);
  const [filterSearch, setFilterSearch] = useState("");
  const [specifiedSheet, setSpecifiedSheet] = useState({});
  const [columnEditor, setColumnEditor] = useState("new");
  const [actionMode, setActionMode] = useState({});
  const [rowValues, setRowValues] = useState({});
  const [dataItems, setDataItems] = useState({ name: "", type: "" });
  const [rowIDs, setRowIDs] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showNewColumnDialog, setShowNewColumnDialog] = useState(false);
  const [openBulkUploadDialog, setOpenBulkUploadDialog] = useState(false);
  const [showNewRowDialog, setShowNewRowDialog] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    dataType: "text",
    isUnique: false,
    hasNull: true,
    defaultValue: "",
    order: 0,
  });
  const [permsResource, setPermsResource] = useState({
    modify: [],
    read: [],
    delete: [],
    create: [],
  });
  const [verifiedPerms, setVerifiedPerms] = useState({
    modify: [],
    read: [],
    delete: [],
    create: [],
  });

  useEffect(() => {
    document.title = `Datasheet | ${specifiedSheet?.name}`;
  }, [specifiedSheet]);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userRoles = userInfo?.roles;
  const userID = userInfo?.id;

  useEffect(() => {
    const selectedColumn_ = initialColumns.find(
      (col) => col.id === activeColumnId
    );
    setSelectedColumn(selectedColumn_);
  }, [activeColumnId]);

  useEffect(() => {
    if (!Object.values(actionMode).length) return;

    switch (actionMode.action) {
      case "edit":
        if (actionMode.type === "column") {
          setActiveColumnId(actionMode.id);
          setColumnEditor("edit");
          setShowNewColumnDialog(true);
        } else if (actionMode.type === "row") {
        }
        break;

      case "delete":
        if (actionMode.type === "column") {
          setActiveColumnId(actionMode.id);
        } else if (actionMode.type === "row") {
        }
        break;

      default:
        break;
    }
  }, [actionMode]);

  useEffect(() => {
    setFormState({
      ...formState,
      name: selectedColumn?.name,
      dataType: selectedColumn?.dataType,
      isUnique: selectedColumn?.isUnique,
      hasNull: selectedColumn?.hasNull,
      order: selectedColumn?.order,
      id: selectedColumn?.id,
    });
  }, [selectedColumn]);

  useEffect(() => {
    if (!specifiedSheet.columns) return;

    const columns_ = specifiedSheet.columns;
    const rows_ = specifiedSheet.data;

    setInitialColumns(columns_);
    setInitialRows(rows_);
  }, [specifiedSheet]);

  useEffect(() => {
    doSearch(pageSearchText);
  }, [pageSearchText]);

  useEffect(() => {
    let createdOnId, defaultVal;
    const formattedColumns_ = initialColumns.map((column, i) => {
      if (column.name === "createdOn") {
        createdOnId = column.id;
      }
      if (column?.defaultValue) {
        defaultVal = { [column.id]: column.defaultValue };
      }
      return {
        field: column.id,
        headerName: column.name,
        type: column.dataType === "text" ? "string" : column.dataType,
        editable:
          !column.unique &&
          column.name !== "created" &&
          column.name !== "createdOn",
        order: i + 1,
        width: 180,
        align: "left",
        headerAlign: "left",
        renderCell: (params) => (
          <Tooltip title={params.formattedValue} placement="right-start">
            <span>{params.formattedValue}</span>
          </Tooltip>
        ),
      };
    });

    const formattedRows_ = initialRows.map((row, i) => {
      const cdate = moment(row[createdOnId]).format("YYYY-MM-DD HH:mm:ss");
      let rowData = { ...row };
      if (defaultVal) {
        if (!row[Object.keys(defaultVal)[0]]) {
          rowData = {
            ...rowData,
            [Object.keys(defaultVal)[0]]: [Object.values(defaultVal)[0]],
          };
        }
      }
      return { ...rowData, [createdOnId]: cdate };
    });

    setFormattedColumns(formattedColumns_);
    setFormattedRows(formattedRows_);
    setPresentedRows(formattedRows_);
  }, [initialColumns, initialRows]);

  const doSearch = (str) => {
    setFilterSearch(str);
    const rows = !!str
      ? formattedRows.filter((row) => {
          for (let r = 0; r < Object.keys(row).length; r++) {
            const field = Object.keys(row)[r];
            if ((row[field] || "").toLowerCase().includes(str.toLowerCase()))
              return true;
          }
          return false;
        })
      : formattedRows;
    setPresentedRows(rows);
  };

  const dispatch = useDispatch();
  const { id } = match.params;

  const onSuccess = ({ data }) => {
    setSpecifiedSheet(data.data);
  };

  // fetch specified dataSheet
  const { isLoading, isFetching } = useCustomQuery({
    queryKey: ["getOneDatasheet", { id }],
    apiFunc: getDatasheetById,
    onSuccess,
  });
  const updateSuccessStatus = (message) => {
    dispatch(SetAppStatus({ type: "success", msg: message }));
    successToastify(message);
    queryClient.invalidateQueries(["getOneDatasheet"]);
  };

  const handleItemDelete = (type) => {
    switch (type) {
      case "column":
        deleteColumnApi({ columnId: selectedColumn?.id, datasheetId: id });
        break;

      case "row":
        deleteRowAPI({ rowIds: rowIDs, datasheetId: id });
        break;

      default:
        break;
    }

    setActionMode({});
    setSelectedColumn({});
    setSelectedRows([]);
  };
  const onSuccessColDelete = (data) => {
    setFormState({});
    updateSuccessStatus("Column deleted successfully");
  };
  const { mutate: deleteColumnApi } = useCustomMutation({
    apiFunc: delDataSheetColumn,
    onSuccess: onSuccessColDelete,
    retries: 0,
  });

  const handleRowDelete = async (data) => {
    deleteRowAPI({ rowIds: data, datasheetId: id });
  };
  const onSuccessRowDelete = () => {
    updateSuccessStatus("Row(s) deleted successfully");
  };
  const onDeleteRowError = ({ error }) => {
    return error;
  };
  const { mutate: deleteRowAPI } = useCustomMutation({
    apiFunc: delDataSheetRow,
    onSuccess: onSuccessRowDelete,
    onError: onDeleteRowError,
    retries: 0,
  });

  const handleRowEdit = () => {
    editRowAPI({ rowValues, datasheetId: id });
  };
  const onSuccessRowEdit = () => {
    updateSuccessStatus("Row cell edit successful");
  };
  const { mutate: editRowAPI } = useCustomMutation({
    apiFunc: UpdateRowData,
    onSuccess: onSuccessRowEdit,
    retries: 0,
  });

  //PERMISSIONS

  const onSuccessPerms = ({ data }) => {
    const filterDataPerms = groupPermissionsByAccess(data.data);

    for (let key in permsResource) {
      if (!filterDataPerms[key]) {
        filterDataPerms[key] = [];
      }
    }
    setPermsResource((prev) => ({ ...prev, ...filterDataPerms }));
  };
  // FETCH PERMS REQUEST
  const { isLoadingPerms, isFetchingPerms, refetch } = useCustomQuery({
    queryKey: ["getDatasheetPerms", { resourceId: id }],
    apiFunc: getResourcePermissions,
    onSuccess: onSuccessPerms,
    enabled: !!id,
    retries: 0,
  });

  const VerifyPemissions = (permsType) => {
    const mergedPerms = [
      ...permsResource[permsType].map((rsrce) => rsrce.value),
    ];

    if (userRoles.includes("Admin") || !permsResource?.[permsType]?.length)
      mergedPerms.push(userID);
    const results = filterDuplicateItems(mergedPerms);
    return results;
  };

  useEffect(() => {
    if (Object.keys(permsResource).length) {
      const readPerms = VerifyPemissions("read");
      const modifyPerms = VerifyPemissions("modify");
      const deletePerms = VerifyPemissions("delete");
      const createPerms = VerifyPemissions("create");

      setVerifiedPerms((prev) => ({
        ...prev,
        read: readPerms,
        modify: modifyPerms,
        delete: deletePerms,
        create: createPerms,
      }));
    }
  }, [permsResource]);

  useEffect(() => {
    if (
      verifiedPerms["read"].length ||
      verifiedPerms["modify"].length ||
      verifiedPerms["delete"].length
    )
      dispatch(setDataPermissions({ datasheets: verifiedPerms }));
  }, [verifiedPerms]);

  const handleNewColumnEditor = () => {
    setColumnEditor("new");
    setFormState({
      name: "",
      dataType: "text",
      isUnique: false,
      hasNull: true,
      defaultValue: "",
      order: initialColumns?.length,
    });
    setShowNewColumnDialog(true);
  };

  const handleExportDataSheet = async () => {
    dispatch(SetAppStatus({ type: "info", msg: "..." }));
    //setAnchorEl(null);
    // const respData = await getDatasheetById({ queryKey: [null, { id }] });
    // const { data, columns, name } = respData.data;
    const { data, columns, name } = specifiedSheet;

    const headers = columns.map((col) => {
      return {
        label: col.name,
        key: col.id,
      };
    });

    return { headers, data, filename: name };
  };

  const AddMenu = (
    <Menu
      // setAnchorEl={setAnchorEl}
      anchorEl={anchorEl}
      open={!!anchorEl}
      id={id}
      onClose={() => setAnchorEl(null)}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "center", horizontal: "right" }}
      // verifiedPerms={verifiedPerms}
      // userID={userID}
      // setShowSideBar={setShowSideBar}
    >
      <MenuItem
        disabled={!initialColumns.length}
        onClick={() => {
          setAnchorEl(null);
          setShowNewRowDialog(true);
        }}
      >
        Add data row
      </MenuItem>
      <MenuItem
        onClick={() => {
          setAnchorEl(null);
          handleNewColumnEditor();
        }}
      >
        Add column
      </MenuItem>
    </Menu>
  );

  const topBar = (
    <div>
      {" "}
      {/*  style={{ margin: "30px 0" }}> */}
      <Grid container alignItems="center" justifyContent="flex-end" spacing={1}>
        <Grid item>
          {verifiedPerms?.["modify"]?.includes(userID) ? (
            <Button
              className="filter-bar-btn"
              onClick={() => setOpenBulkUploadDialog(true)}
            >
              Upload <FiUpload />
              {/* <img src={filterIcon} alt="filter" style={{ marginLeft: 5 }} /> */}
            </Button>
          ) : (
            ""
          )}
        </Grid>

        <Grid item>
          {verifiedPerms?.["modify"]?.includes(userID) ? (
            <DownloadUserCSVButton asyncExportMethod={handleExportDataSheet}>
              <Button className="filter-btn-variant">
                Export <FiDownload />
                {/* <img src={sortIcon} alt="sort" style={{ marginLeft: 5 }} /> */}
              </Button>
            </DownloadUserCSVButton>
          ) : (
            ""
          )}
        </Grid>
      </Grid>
    </div>
  );

  const handleChange = (lap) => {
    if (lap.isFinish) {
      // setIsLoading(false);
    }
  };

  return (
    <>
      <MainPageLayout
        headerTitle={mainNavigationListNames.DATASHEETS}
        pageTitle={specifiedSheet?.name}
        pageSubtitle=""
        appsControlMode={null}
        categories={null}
        isLoading={isLoading}
        handleChange={handleChange}
        topBar={topBar}
        hasGoBack={true}
        onAddNew={{
          fn: (e) => {
            setAnchorEl(e.currentTarget);
          },
          tooltip: "Add new row/column",
          menu: AddMenu,
        }}
      >
        {!isLoading && (
          <div
            style={{
              height: 300,
              width: "100%",
              flex: 1,
              //border: "2px solid red",
            }}
          >
            {presentedRows.length ? (
              <DataAppBar
                sheetData={specifiedSheet}
                dataSheetColumns={initialColumns}
                setColumns={setInitialColumns}
                setSearchString={doSearch}
                showNewColumnDialog={showNewColumnDialog}
                setShowNewColumnDialog={setShowNewColumnDialog}
                columnEditor={columnEditor}
                setColumnEditor={setColumnEditor}
                dataItems={dataItems}
                setDataItems={setDataItems}
                formState={formState}
                //rowCount={rowCount}
                rowIDs={rowIDs}
                actionMode={actionMode}
                setActionMode={setActionMode}
                selectedRows={selectedRows}
                //setActionDialogVisible={setActionDialogVisible}
                setOpenUploadDragDrop={setOpenBulkUploadDialog}
                id={id}
                setFormState={setFormState}
                verifiedPerms={verifiedPerms}
                permissions={permissions}
                userID={userID}
              />
            ) : (
              ""
            )}
            <DataGrid
              rows={presentedRows}
              columns={formattedColumns}
              rowHeight={44}
              checkboxSelection={verifiedPerms?.["modify"]?.includes(userID)} //={showCheckbox}
              onSelectionModelChange={(model) => {
                setRowIDs(model);
              }}
              isCellEditable={(data) => {
                return verifiedPerms?.["modify"]?.includes(userID);
              }}
              onEditCellPropsChange={(params, event) => {
                setRowValues({
                  rowId: params.id,
                  [params.field]: event.target.value,
                });
              }}
              onCellEditStop={(params, event) => {
                Object.values(rowValues).length &&
                  Object.values(rowValues).indexOf(params.value) < 1 &&
                  handleRowEdit();
              }}
              disableSelectionOnClick
              components={{
                ColumnMenu: CustomColumnMenu,
                //FilterForm: DateRangePickerFilterPanel,
              }}
              componentsProps={{
                columnMenu: {
                  // columnEditor: columnEditor,
                  // setColumnEditor: setColumnEditor,
                  // initialColumns: initialColumns,
                  // id: id,
                  // selectedColumn: selectedColumn,
                  // setActiveColumnId: setActiveColumnId,
                  // setActionDialogVisible: setActionDialogVisible,
                  // dataItems: dataItems,
                  // setDataItems: setDataItems,
                  // columnOrder: columnOrder,

                  permissions: permissions,
                  verifiedPerms: verifiedPerms,
                  userID: userID,
                  setActionMode: setActionMode,
                },
              }}
            />
          </div>
        )}
      </MainPageLayout>

      <ColumnDialog
        sheetData={specifiedSheet}
        showMe={showNewColumnDialog}
        setShowMe={setShowNewColumnDialog}
        columns={initialColumns}
        columnEditor={columnEditor}
        // setColumnEditor={setColumnEditor}
        // columnName={dataItems?.name}
        formState={formState}
        setFormState={setFormState}
        datasheetId={id}
      />

      <NewRowDialog
        sheetData={specifiedSheet}
        showMe={showNewRowDialog}
        setShowMe={setShowNewRowDialog}
        columns={initialColumns}
        setColumns={setInitialColumns}
      />

      {actionMode.action === "delete" && (
        <ActionDialog
          actionMode={actionMode}
          setActionMode={setActionMode}
          handleItemDelete={handleItemDelete}
          selectedItem={{ column: selectedColumn, row: actionMode }}
        />
      )}

      {openBulkUploadDialog && (
        <UploadDragDrop
          setOpenUploadDragDrop={setOpenBulkUploadDialog}
          openUploadDragDrop={openBulkUploadDialog}
          columnHeaders={initialColumns}
          headerNameObj
          dataSheet
          dataSheetId={id}
          updateKey={"getOneDatasheet"}
        />
      )}
    </>
  );
};

export default withRouter(Datasheet);

const DateRangePickerFilterPanel = (props) => {
  return (
    <GridFilterPanel {...props}>
      <GridFilterForm>hj</GridFilterForm>
    </GridFilterPanel>
  );
};
