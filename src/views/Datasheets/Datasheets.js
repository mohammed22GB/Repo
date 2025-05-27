import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import PropTypes from "prop-types";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  IconButton,
  makeStyles,
  Button,
  TextField,
  Typography,
  FormControl,
  Select,
  Paper,
} from "@material-ui/core";
import moment from "moment";
import MoreVert from "@material-ui/icons/MoreVert";
import { DataGrid } from "@material-ui/data-grid";
import { useStyles } from "./utils/DataStyle";
import NewSheetDialog from "./components/newSheetDialog";
import { useQueryClient } from "react-query";

import MenuList from "./components/MenuList";
import DatasheetSidebar from "./utils/DatasheetSidebar";
import { getUsersAPI } from "../SettingsLayout/Pages/UserManagement/utils/usersAPIs";
import { groupPermissionsByAccess, filterDuplicateItems } from "./utils";
import { SetAppStatus } from "../common/helpers/helperFunctions";
import useCustomQuery from "../common/utils/CustomQuery";
import {
  fetchDatasheets,
  getResourcePermissions,
  updateDatasheetsApi,
} from "../common/components/Query/DataSheets/datasheetQuery";
import useCustomMutation from "../common/utils/CustomMutation";
import { updateDatasheet } from "../common/components/Mutation/Datasheets/datasheetMutation";
import { setDataPermissions } from "../common/helpers/Data";
import { mainNavigationListNames } from "../common/utils/lists";
import MainPageLayout from "../common/components/AppLayout/MainPageLayout";

const Datasheets = () => {
  const classes = useStyles(makeStyles);
  const history = useHistory();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { pageSearchText } = useSelector(({ reducers }) => reducers);

  const [rawData, setRawData] = useState([]);
  const [formattedColumns, setFormattedColumns] = useState([]);
  const [formattedRows, setFormattedRows] = useState([]);
  const [presentedRows, setPresentedRows] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [datasheetId, setDatasheetId] = useState("");
  const [datasheetName, setDatasheetName] = useState("");
  const [pageError, setPageError] = useState(false);

  const [open, setOpen] = useState(false);
  // const [filterSearch, setFilterSearch] = useState("");
  const [sheetName, setSheetName] = useState("");
  const [showSideBar, setShowSideBar] = useState(false);
  const [canView, setCanView] = useState(false);
  const [usersLists, setUsersLists] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [perPageArr, setPerPageArr] = useState([10, 25, 50, 100]);
  const [entries, setEntries] = useState(0);
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
  const [permissionToggle, setPermissionToggle] = useState({
    modify: [],
    read: [],
    delete: [],
  });
  const [isDatasheetLoading, setDatasheetLoading] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userRoles = userInfo?.roles;
  const userID = userInfo?.id;

  useEffect(() => {
    document.title = "Datasheets";
  }, []);

  useEffect(() => {
    handleSearchChange(pageSearchText);
  }, [pageSearchText]);

  const dataHeads = [
    //  consider moving this off here! to db or the data page
    {
      field: "name",
      headerName: "Name",
      type: "string",
      order: 1,
      editable: true,
      width: 250,
    },
    // {
    //   field: "owner",
    //   headerName: "Owner",
    //   type: "string",
    //   order: 2,
    //   editable: false,
    //   width: 220,
    // },
    {
      field: "created",
      headerName: "Created",
      type: "date",
      order: 3,
      editable: false,
      width: 220,
    },
  ];

  const onSuccess = ({ data }) => {
    setRawData(data?.data || []);

    setEntries(data._meta.pagination.total_count);
    const formattedRows_ = data?.data?.map((d, i) => {
      return {
        id: d.id,
        name: d.name,
        //owner: d.user,
        created: moment(d.createdAt).format("YYYY-MM-DD HH:mm:ss"),
        action: "Actions",
      };
    });

    const dataHeads_ = [...dataHeads];
    dataHeads_.push({
      field: "Actions",
      // type: 'actions',
      width: 150,
      headerAlign: "center",
      sortable: false,
      editable: false,
      // disableColumnSelector: true,
      renderCell: (params, others) => {
        return (
          <>
            <Button
              // disabled={!verifiedPerms["read"]?.includes(userID)}
              title={"viewBtn"}
              onClick={(e) => {
                e.preventDefault();
                openSheet(params.row);
              }}
              style={{ textTransform: "capitalize", fontSize: 12 }}
            >
              View
            </Button>
            <IconButton
              title="menuIcon"
              style={{ padding: 7 }}
              onClick={(e) =>
                handleMoreOptionClick(e, params.row.id, params.row.name)
              }
            >
              <MoreVert style={{ fontSize: 18 }} />
            </IconButton>
          </>
        );
      },
    });

    setFormattedColumns(dataHeads_);
    setFormattedRows(formattedRows_);
    setPresentedRows(formattedRows_);
    setDatasheetId(() => data?.data[0]?.id);
    setDatasheetName(() => data?.data[0]?.name);
  };

  const onError = () => {
    setPageError(true);
    dispatch(SetAppStatus({ type: "error", msg: "Network failure" }));
  };

  // fetch datasheets
  const { isLoading, isFetching } = useCustomQuery({
    queryKey: ["datasheetLists", pageNo, perPage],
    apiFunc: fetchDatasheets,
    onSuccess,
    onError,
    enabled: !!perPage,
  });

  const handleCreateNewData = () => {
    setOpen(true);
  };

  const handlePageChange = (e) => {
    if (e.target.value) {
      setPageNo(e.target.value - 1);
    }
  };
  // close the dialog
  const handleCloseSidebar = () => {
    // dispatch({ type: SHOW_COLUMNBOX, payload: false });
    setShowSideBar(false);
  };
  const handleSearchChange = (input) => {
    const rows = !!input
      ? formattedRows.filter((row) =>
          row?.name?.toLowerCase()?.includes(input.toLowerCase())
        )
      : formattedRows;
    setPresentedRows(rows);
  };

  const handleMoreOptionClick = (e, id, name) => {
    setAnchorEl(e.currentTarget);
    setDatasheetId(() => id);
    setDatasheetName(() => name);
  };

  const openSheet = ({ name, id }) => {
    history.push({
      pathname: `/datasheets/${id}`,
    });
  };

  // SUCCESS UPDATE
  const onSuccessSheetUpdate = (data) => {
    queryClient.invalidateQueries(["datasheetLists"]);
  };
  const { mutate: UpdateSheetData } = useCustomMutation({
    apiFunc: updateDatasheetsApi,
    onSuccess: onSuccessSheetUpdate,
    retries: 0,
  });
  const handleDataSheetUpdate = (name) => {
    UpdateSheetData({ name, id: datasheetId });
    return;
  };

  // ====> PERMISSIONS

  const onSuccessPerms = ({ data }) => {
    const groupedPermissions = groupPermissionsByAccess(data.data);
    const usersPerms = groupPermissionsByAccess(data.data);

    for (let key in permsResource) {
      if (!groupedPermissions[key]) {
        groupedPermissions[key] = [];
      }
      if (!usersPerms[key]) {
        usersPerms[key] = [];
      }
      if (groupedPermissions[key]?.length) {
        setPermissionToggle({
          ...permissionToggle,
          [key]: groupedPermissions?.[key]?.filter(
            (permsD) => permsD?.identity === "employees"
          ),
        });

        groupedPermissions[key] = groupedPermissions?.[key].filter(
          (permsD) => permsD?.identity !== "employees"
        );
      } else {
        if (permissionToggle[key]?.length) {
          setPermissionToggle({
            ...permissionToggle,
            [key]: [],
          });
        }
      }
      usersPerms[key] = usersPerms?.[key].filter(
        (permsD) => permsD?.identity !== "employees"
      );
    }
    setPermsResource((prev) => ({ ...prev, ...usersPerms }));
  };
  // FETCH PERMS REQUEST
  const { refetch } = useCustomQuery({
    queryKey: ["getDatasheetPerms", { resourceId: datasheetId }],
    apiFunc: getResourcePermissions,
    onSuccess: onSuccessPerms,
    enabled: !!datasheetId,
  });

  const VerifyPemissions = (permsType) => {
    const mergedPerms = [
      ...permsResource[permsType]?.map((rsrce) => rsrce?.value),
    ];

    if (userRoles?.includes("Admin") || !permsResource?.permsType?.length)
      mergedPerms.push(userID);
    const results = filterDuplicateItems(mergedPerms);
    return results;
  };

  useEffect(() => {
    if (/*usersLists.length &&*/ Object.keys(permsResource).length) {
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
      verifiedPerms["read"]?.length ||
      verifiedPerms["modify"]?.length ||
      verifiedPerms["delete"]?.length
    )
      dispatch(setDataPermissions({ datasheets: verifiedPerms }));
  }, [verifiedPerms]);

  // FETCH ALL USERS REQUEST
  const optionsU = {
    query: {
      selection: ["id", "firstName", "lastName", "roles"],
    },
    perpage: 100,
  };

  const onLoadItemsSuccessU = (res) => {
    if (!res?.data?.data) return;
    const newVals = res?.data?.data;
    setUsersLists(newVals);
  };
  const { isLoadingUsr, isFetchingUsr } = useCustomQuery({
    queryKey: ["allUsers", optionsU],
    apiFunc: getUsersAPI,
    onSuccess: onLoadItemsSuccessU,
  });
  const handleChange = (lap) => {
    if (lap.isFinish) {
      // setIsLoading(false);
    }
  };

  /* const topBar = (!!presentedRows.length || !!filterSearch) && (
    <div className={classes.rightView}>
      <TextField
        id="input-with-icon-textfield"
        placeholder="Enter search item here"
        size="small"
        inputMode="search"
        value={filterSearch}
        onChange={(e) => handleSearchChange(e)}
        InputProps={{
          className: classes.inputRoot,
          endAdornment: (
            <InputAdornment position="start">
              <SearchIcon htmlColor="#999" />
            </InputAdornment>
          ),
        }}
        variant="outlined"
      />
    </div>
  ); */

  return (
    <>
      <MainPageLayout
        headerTitle={mainNavigationListNames.DATASHEETS}
        pageTitle=""
        pageSubtitle="Spreadsheets for data records"
        appsControlMode={null}
        categories={null}
        isLoading={isLoading}
        handleChange={handleChange}
        // topBar={topBar}
        onAddNew={{
          fn: verifiedPerms["create"]?.includes(userID)
            ? handleCreateNewData
            : null,
          tooltip: "Add new datasheet",
        }}
      >
        {isLoading || isFetching ? (
          <div style={{ width: "100%", textAlign: "center" }}>
            <img
              src="../../../images/dashboard-no-post.svg"
              alt="No Posts"
              width={100}
              style={{ marginTop: 50 }}
            />
            <div style={{ color: "#091540", fontWeight: 500 }}>
              Loading Datasheets, please wait a moment...
            </div>
          </div>
        ) : (
          <>
            {!rawData.length ? (
              <div style={{ width: "100%", textAlign: "center" }}>
                <img
                  src="../../../images/dashboard-no-post.svg"
                  alt="No Posts"
                  width={100}
                  style={{ marginTop: 50 }}
                />
                {pageError ? (
                  <div
                    style={{
                      color: "#a12121",
                      fontWeight: 400,
                      fontStyle: "italic",
                      fontSize: 12,
                      marginTop: 20,
                    }}
                  >
                    An error occured. Please check your connection and refresh.
                  </div>
                ) : (
                  <div style={{ color: "#091540", fontWeight: 500 }}>
                    No datasheet created yet. Create your first datasheet.
                  </div>
                )}
              </div>
            ) : (
              <div style={{ flex: 1, height: "100%" }}>
                {
                  !!presentedRows.length && (
                    <Paper className={classes.dataGridPaper} elevation={0}>
                      <div style={{ height: "100%", width: "100%" }}>
                        <DataGrid
                          rows={presentedRows}
                          columns={formattedColumns}
                          rowHeight={44}
                          isCellEditable={(params) =>
                            verifiedPerms["read"]?.includes(userID) ||
                            verifiedPerms["modify"]?.includes(userID)
                          }
                          onEditCellPropsChange={(params, event) => {
                            setDatasheetId(() => params?.id);
                            setSheetName(event.target.value);
                          }}
                          onCellEditStop={(params, event) => {
                            sheetName.length &&
                              params.value !== sheetName &&
                              handleDataSheetUpdate(sheetName);
                          }}
                          //style={{ border: "4px solid red" }}
                          hideFooterPagination
                          classes={{
                            root: classes.dataGrid,
                          }}
                        />
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            background: "white",
                            //border: "2px solid red",
                            margin: "auto",
                            paddingRight: "8rem",
                            paddingBottom: "1.5rem",
                            minHeight: "3.5rem",
                          }}
                        >
                          {!!perPageArr.length && (
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Typography>Rows per page:</Typography>
                                <FormControl className="perpage-dropdown">
                                  <Select
                                    className={classes.perPageInput}
                                    defaultValue={perPage}
                                    style={{
                                      marginLeft: "2px",
                                      marginRight: "6px",
                                      borderRadius: "3px",
                                      background: "whitesmoke",
                                    }}
                                    onChange={(e) => {
                                      setPerPage(e.target.value);
                                    }}
                                    displayEmpty
                                    native
                                    //className={classes.null}
                                    inputProps={{
                                      "aria-label": "Without label",
                                      disableUnderline: true,
                                    }}
                                  >
                                    {perPageArr.map((num) => (
                                      <option
                                        style={{
                                          borderBottom: "0 !important",
                                          marginLeft: "6px",
                                        }}
                                        key={num}
                                        value={num}
                                      >
                                        {num}
                                      </option>
                                    ))}
                                  </Select>
                                </FormControl>
                              </div>
                            </div>
                          )}
                          <div style={{ margin: "0 10px" }}>
                            <Typography>{entries} entries. </Typography>
                          </div>
                          <div>
                            <Typography>Showing</Typography>
                          </div>
                          <div style={{ width: 60, margin: "0 10px" }}>
                            <TextField
                              id="outlined-password-input"
                              type="number"
                              autoComplete="current-password"
                              variant="outlined"
                              size="small"
                              InputProps={{
                                inputProps: {
                                  min: 1,
                                  max: Math.ceil(entries / perPage),
                                },
                              }}
                              defaultValue={pageNo + 1}
                              onChange={(e) => handlePageChange(e)}
                            />
                          </div>
                          <div>
                            <Typography>
                              of {Math.ceil(entries / perPage)}{" "}
                              {entries / 10 > 1 ? "pages" : "page"}
                            </Typography>
                          </div>
                        </div>
                      </div>
                      <MenuList
                        setAnchorEl={setAnchorEl}
                        anchorEl={anchorEl}
                        id={datasheetId}
                        verifiedPerms={verifiedPerms}
                        userID={userID}
                        setShowSideBar={setShowSideBar}
                      />
                    </Paper>
                  ) /* : (
                  !isFetching &&
                  !isLoading &&
                  !pageError && (
                    <div className={classes.newDataView}>
                      <img src={noDataImage} alt="art and design" />
                      <Typography
                        style={{
                          color: "#999999",
                          fontSize: 12,
                          margin: "30px 0",
                        }}
                      >
                        You have no item record yet
                      </Typography>

                      {verifiedPerms["create"]?.includes(userID) && (
                        <Button
                          size="medium"
                          variant="contained"
                          className={classes.button}
                          onClick={handleCreateNewData}
                        >
                          New Data
                        </Button>
                      )}
                    </div>
                  )
                ) */
                }
              </div>
            )}
          </>
        )}
      </MainPageLayout>
      <NewSheetDialog
        open={open}
        setOpen={setOpen}
        formattedRows={formattedRows}
      />
      {!!showSideBar && (
        <DatasheetSidebar
          handleCloseSidebar={handleCloseSidebar}
          showMe={showSideBar}
          datasheetId={datasheetId}
          datasheetName={datasheetName}
          setShowMe={setShowSideBar}
          usersLists={usersLists}
          permissionToggle={permissionToggle}
          permsResource={permsResource}
          setPermsResource={setPermsResource}
          refetch={refetch}
        />
      )}
    </>
  );
};

function mapStateToProps(state) {
  return {
    isLoggingOut: state.auth.isLoggingOut,
    logoutError: state.auth.logoutError,
  };
}

Datasheets.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};
export default connect(mapStateToProps)(Datasheets);
