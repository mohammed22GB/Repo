import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  IconButton,
  makeStyles,
  Typography,
  Button,
  Paper,
} from "@material-ui/core";
import { useLocation } from "react-router-dom";
import { useQueryClient } from "react-query";
import { debounce } from "lodash";
import { v4 } from "uuid";
import moment from "moment";
import MoreVert from "@material-ui/icons/MoreVert";
import { DataGrid } from "@material-ui/data-grid";

import noDashboardsImage from "../../../../assets/images/no-reports-img.png";
import NewDashboardDialog from "../../components/NewDashboardDialog";
import {
  createDashboardAPI,
  deleteDashboardAPI,
  duplicateDashboardAPI,
  getDashboardStructureAPI,
  getDashboardsAPI,
  updateDashboardAPI,
} from "../../utils/dashboardsAPIs";
import { useStyles } from "../../utils/dashboardsStyle";
import ChooseTemplateDialog from "../../components/ChooseTemplateDialog";
import MenuList from "../../components/MenuList";
import DashboardPerms from "./components/DashboardPerms";
import { getUsersAPI } from "../../../SettingsLayout/Pages/UserManagement/utils/usersAPIs";
import {
  filterDuplicateItems,
  groupPermissionsByAccess,
} from "../../../Datasheets/utils";
import { SetAppStatus } from "../../../common/helpers/helperFunctions";
import useCustomQuery from "../../../common/utils/CustomQuery";
import {
  mainNavigationListNames,
  otherProtectedUrls,
} from "../../../common/utils/lists";
import useCustomMutation from "../../../common/utils/CustomMutation";
import { getResourcePermissions } from "../../../common/components/Query/DataSheets/datasheetQuery";
import { setDataPermissions } from "../../../common/helpers/Data";
import { successToastify } from "../../../common/utils/Toastify";
import MainPageLayout from "../../../common/components/AppLayout/MainPageLayout";
import { handleRoleActionAccess } from "../../../common/utils/userRoleEvaluation";

const DashboardsList = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  const { pageSearchText } = useSelector(({ reducers }) => reducers);
  const { user } = useSelector(({ auth }) => auth);
  const classes = useStyles(makeStyles);
  const client = useQueryClient();

  const [formattedColumns, setFormattedColumns] = useState([]);
  const [showSideBar, setShowSideBar] = useState(false);
  const [formattedRows, setFormattedRows] = useState([]);
  const [presentedRows, setPresentedRows] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [slug, setSlug] = useState("");
  const [activeId, setActiveId] = useState("");
  const [dashboardId, setDashboardId] = useState("");
  const [dashboardName, setDashboardName] = useState("");
  const [pageError, setPageError] = useState(false);
  const [step, setStep] = useState(0);
  const [usersLists, setUsersLists] = useState([]);
  const [newData, setNewData] = useState({});
  const [permsResource, setPermsResource] = useState({
    modify: [],
    read: [],
    delete: [],
  });
  const [permissionToggle, setPermissionToggle] = useState({
    modify: [],
    read: [],
    delete: [],
  });
  const [verifiedPerms, setVerifiedPerms] = useState({
    modify: [],
    read: [],
    delete: [],
  });

  const [open, setOpen] = useState(false);
  const [isLap, setIsLap] = useState(true);

  const id1 = v4();
  const id2 = v4();
  const id3 = v4();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userRoles = userInfo?.roles;
  const userID = userInfo?.id;

  const initTemplateStructure = {
    type: "basic",
    templateStructure: [
      [
        { key: id1, sectionType: "card" },
        { key: id2, sectionType: "card" },
      ],
      [{ key: id3, sectionType: "chart" }],
    ],
  };

  const initDashboardConfiguration = {
    [id1]: {
      title: "",
      sectionType: "card",
      data: { dataSourceType: "datasheet" },
    },
    [id2]: {
      title: "",
      sectionType: "card",
      data: { dataSourceType: "googleSheet" },
    },
    [id3]: {
      title: "",
      sectionType: "chart",
      chartType: "",
      data: { dataSourceType: "externaDB" },
    },
  };

  useEffect(() => {
    document.title = "Dashboards";
  }, []);

  const updateDashboard = React.useRef(
    debounce(async (id, objs) => {
      const result = await updateDashboardAPI({ id, ...objs });
    }, 800)
  ).current;
  const handleDashboardUpdate = (dbID, evt) => {
    updateDashboard(dbID, { [evt.target.name]: evt.target.value });
  };

  useEffect(() => {
    const createDashboard = async () => {
      createNewDashboard({
        ...newData,
        configuration: {
          ...newData.configuration,
          ...initDashboardConfiguration,
        },
        properties: {
          ...newData.properties,
          ...initTemplateStructure,
        },
      });
    };

    if (step === 0) {
      //  create new dashboardardard
      setNewData({});
    } else if (step === 3) {
      //  create new dashboard
      createDashboard();
    }
  }, [step]);

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
    const formattedRows_ = data?.data?.map((d, i) => {
      return {
        id: d.id,
        slug: d.slug,
        name: d.name,
        //owner: d.user,
        created: moment(d.createdAt).format("YYYY-MM-DD HH:mm:ss"),
        action: "Actions",
      };
    });

    if (
      ["development", "localhost"].includes(process.env.REACT_APP_ENVIRONMENT)
    ) {
      formattedRows_.unshift({
        id: "p-o-w-e-r--b-i",
        slug: "min-of-finance-dashboard",
        name: "Min. of Finance Dashboard",
        //owner: d.user,
        created: moment().format("YYYY-MM-DD HH:mm:ss"),
        action: "Actions",
      });
    }
    const dataHeads_ = [...dataHeads];
    dataHeads_.push({
      field: "Actions",
      // type: 'actions',
      width: 150,
      headerAlign: "center",
      sortable: false,
      editable: false,
      // disableColumnSelector: true,
      renderCell: (params, others) => (
        <>
          <Button
            onClick={(e) => {
              e.preventDefault();
              openDashboard(params.row);
            }}
            style={{ textTransform: "capitalize", fontSize: 12 }}
          >
            View
          </Button>
          <IconButton
            style={{ padding: 7 }}
            onClick={(e) => {
              handleMoreOptionClick(e, params.row.id, params.row.slug);
              setDashboardName(params.row.name);
              setDashboardId(params.row.id);
            }}
          >
            <MoreVert style={{ fontSize: 18 }} />
          </IconButton>
        </>
      ),
    });
    setFormattedColumns(dataHeads_);
    setFormattedRows(formattedRows_);
    setPresentedRows(formattedRows_);
  };

  const onError = () => {
    setPageError(true);
    dispatch(SetAppStatus({ type: "error", msg: "Network failure" }));
  };

  // fetch dashboards
  const { isLoading, isFetching } = useCustomQuery({
    queryKey: ["dashboardsList"],
    apiFunc: getDashboardsAPI,
    onSuccess,
    onError,
  });

  const onCreateSuccess = ({ data }) => {
    setStep(0);
    setNewData({});
    !!data?.data?.slug &&
      history.push({
        pathname: `${otherProtectedUrls.DASHBOARDS_EDITOR}/${data.data.slug}`,
      });
    client.invalidateQueries(["dashboardsList"]);
  };

  const { mutate: createNewDashboard } = useCustomMutation({
    apiFunc: createDashboardAPI,
    onSuccess: onCreateSuccess,
    retries: 0,
  });

  // PERMISSIONS >>>>>
  const onSuccessPerms = ({ data }) => {
    const filterDataPerms = groupPermissionsByAccess([...data?.data]);
    const usersPerms = groupPermissionsByAccess([...data?.data]);

    for (let key in permsResource) {
      if (!filterDataPerms[key]) {
        filterDataPerms[key] = [];
      }
      if (!usersPerms[key]) {
        usersPerms[key] = [];
      }

      if (filterDataPerms[key]?.length) {
        setPermissionToggle({
          ...permissionToggle,
          [key]: filterDataPerms?.[key],
          // [key]: filterDataPerms?.[key]?.filter(
          //   (permsD) => permsD?.identity === "employees"
          // ),
        });
        filterDataPerms[key] = filterDataPerms[key].filter(
          (permsD) => permsD.identity !== "employees"
        );
      }
      usersPerms[key] = usersPerms[key].filter(
        (permsD) => permsD.identity !== "employees"
      );
    }
    setPermsResource((prev) => ({ ...prev, ...usersPerms }));
  };

  // FETCH PERMS REQUEST
  const { refetch } = useCustomQuery({
    queryKey: [
      "getDashboardPerms",
      { resourceId: dashboardId, resourceType: "report" },
    ],
    apiFunc: getResourcePermissions, //>>>>>
    onSuccess: onSuccessPerms,
    enabled: !!dashboardId,
  });

  // FOR ENFORCEMENT OF THE PERMISSIONS
  const VerifyPemissions = (permsType) => {
    const mergedPerms = [
      ...permsResource[permsType]?.map((rsrce) => rsrce?.value),
    ];

    // For Default Toggle All Permissions
    //if (userRoles?.includes("Admin")) mergedPerms.push(userID);
    if (!permsResource?.permsType?.length) mergedPerms.push(userID);

    const results = filterDuplicateItems(mergedPerms);
    return results;
  };

  useEffect(() => {
    if (/*usersLists.length &&*/ Object.keys(permsResource)?.length) {
      const readPerms = VerifyPemissions("read");
      const modifyPerms = VerifyPemissions("modify");
      const deletePerms = VerifyPemissions("delete");
      //console.log(readPerms);
      setVerifiedPerms((prev) => ({
        ...prev,
        read: readPerms,
        modify: modifyPerms,
        delete: deletePerms,
      }));
    }
  }, [permsResource]);

  useEffect(() => {
    //console.log(verifiedPerms);
    if (
      verifiedPerms["read"]?.length ||
      verifiedPerms["modify"]?.length ||
      verifiedPerms["delete"]?.length
    )
      dispatch(setDataPermissions({ dashboards: verifiedPerms }));
  }, [verifiedPerms]);

  // FETCH ALL USERS REQUEST
  const optionsU = {
    query: {
      selection: ["id", "firstName", "lastName", "roles"],
    },
    perpage: 100,
  };

  const onLoadItemsSuccessU = (res) => {
    //console.log(res?.data);
    if (!res?.data?.data) return;
    const newVals = res?.data?.data;
    setUsersLists(newVals);
  };
  const { isLoadingUsr, isFetchingUsr } = useCustomQuery({
    queryKey: ["allUsers", optionsU],
    apiFunc: getUsersAPI,
    onSuccess: onLoadItemsSuccessU,
  });

  const handleSearchChange = (input) => {
    const rows = !!input
      ? formattedRows.filter((row) =>
          row.name.toLowerCase().includes(input.toLowerCase())
        )
      : formattedRows;
    setPresentedRows(rows);
  };

  const handleMoreOptionClick = (e, id, slg) => {
    setAnchorEl(e.currentTarget);
    setActiveId(id);
    setSlug(slg);
  };

  const openDashboard = (data) => {
    history.push({
      pathname: `/dashboards/editor/${data.slug}`,
    });
  };

  const handleChange = (lap) => {
    if (lap.isFinish) {
      setIsLap(false);
    }
  };

  const onDuplicateDashboardSuccess = async ({ data }) => {
    successToastify(data?._meta?.message);
    await queryClient.invalidateQueries(["dashboardsList"]);
  };

  const onDeleteDashboardSuccess = async ({ data }) => {
    //console.log(`> > data >> ${JSON.stringify(data)}`);
    successToastify(data?._meta?.message);
    await queryClient.invalidateQueries(["dashboardsList"]);
  };

  const queryClient = useQueryClient();
  const { mutate: deleteDashboard } = useCustomMutation({
    apiFunc: deleteDashboardAPI,
    onSuccess: onDeleteDashboardSuccess,
    retries: 0,
  });

  const { mutate: duplicateDashboard } = useCustomMutation({
    apiFunc: duplicateDashboardAPI,
    onSuccess: onDuplicateDashboardSuccess,
    retries: 0,
  });

  const handleExportDashboard = async () => {
    dispatch(SetAppStatus({ type: "info", msg: "..." }));
    setAnchorEl(null);
    const respData = await getDashboardStructureAPI({
      queryKey: [null, { slug }],
    });
    const { data, columns, name } = respData.data;

    const headers = columns.map((col) => {
      return {
        label: col.name,
        key: col.slug,
      };
    });

    return { headers, data, filename: name };
  };

  const handleDashboardMenu = ({ id, name, slug, setAnchorEl }) => {
    switch (name?.toLowerCase()) {
      case "edit":
        setAnchorEl(null);
        history.push({
          pathname: `${otherProtectedUrls.DASHBOARDS_EDITOR}/${slug}`,
        });
        break;

      case "delete":
        setAnchorEl(null);
        const prompt = window.prompt(
          'Are you sure you want to delete this Dashboard? Type "delete" to confirm'
        );
        if (!!prompt && prompt?.toLowerCase() === "delete")
          deleteDashboard({ id });
        break;

      case "duplicate":
        setAnchorEl(() => null);
        duplicateDashboard({ id });
        break;

      case "export":
        setAnchorEl(() => null);
        // handleExportDashboard({ sheets, slug, setAnchorEl });
        break;

      case "permissions":
        setShowSideBar(true);
        setAnchorEl(() => null);
        break;

      default:
        break;
    }
  };

  return (
    <>
      <MainPageLayout
        headerTitle={mainNavigationListNames.DASHBOARDS}
        pageTitle=""
        pageSubtitle=""
        appsControlMode={null}
        categories={null}
        isLoading={isLoading}
        handleChange={handleChange}
        onAddNew={{ fn: () => setStep(1), tooltip: "Add new dashboard" }}
      >
        {!isLoading && !isFetching ? (
          <div
            style={{
              flex: 1,
              height: "100%",
            }}
          >
            {!!presentedRows?.length ? (
              <Paper style={{ height: "100%" }}>
                <div style={{ height: "100%", width: "100%" }}>
                  <DataGrid
                    rows={presentedRows}
                    columns={formattedColumns}
                    rowHeight={44}
                    onEditCellPropsChange={(params, e) => {
                      handleDashboardUpdate(params.id, {
                        target: { name: "name", value: e.target.value },
                      });
                    }}
                    //style={{ border: "4px solid red" }}
                  />
                </div>
                <MenuList
                  setAnchorEl={setAnchorEl}
                  anchorEl={anchorEl}
                  id={activeId}
                  slug={slug}
                  userID={userID}
                  dashboardId={dashboardId}
                  verifiedPerms={verifiedPerms}
                  handleDashboardMenu={handleDashboardMenu}
                  handleExportDashboard={handleExportDashboard}
                />
              </Paper>
            ) : (
              !isFetching &&
              !isLoading &&
              !pageError && (
                <div className={classes.newDataView}>
                  <img src={noDashboardsImage} alt="art and design" />
                  <Typography
                    style={{
                      color: "#999999",
                      fontSize: 12,
                      margin: "30px 0",
                    }}
                  >
                    You have no dashboards created yet
                  </Typography>
                  {handleRoleActionAccess(
                    {
                      pageTitle: "",
                      headerTitle: mainNavigationListNames.DASHBOARDS,
                    },
                    "POST"
                  ) && (
                    <Button
                      size="medium"
                      variant="contained"
                      className={classes.button}
                      onClick={() => setStep(1)}
                    >
                      New Dashboard
                    </Button>
                  )}
                </div>
              )
            )}
          </div>
        ) : (
          <div style={{ width: "100%", textAlign: "center" }}>
            <img
              src="../../../images/dashboard-no-post.svg"
              alt="No Posts"
              width={100}
              style={{ marginTop: 50 }}
            />
            <div style={{ color: "#091540", fontWeight: 500 }}>
              Loading Dashboards, Please wait a moment...
            </div>
          </div>
        )}
      </MainPageLayout>
      {!!showSideBar && (
        <DashboardPerms
          handleCloseSidebar={() => setShowSideBar(false)}
          showMe={showSideBar}
          dashboardId={dashboardId}
          dashboardName={dashboardName}
          setShowMe={setShowSideBar}
          usersLists={usersLists}
          permsResource={permsResource}
          setPermsResource={setPermsResource}
          permissionToggle={permissionToggle}
          refetch={refetch}
        />
      )}
      <NewDashboardDialog
        open={step === 1}
        setStep={setStep}
        newData={newData}
        setNewData={(data) =>
          setNewData((prev) => {
            return { ...prev, ...data };
          })
        }
      />
      <ChooseTemplateDialog
        open={step === 2}
        setStep={setStep}
        newData={newData}
        setNewData={(data) =>
          setNewData((prev) => {
            return { ...prev, ...data };
          })
        }
      />
    </>
  );
};

DashboardsList.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};
export default DashboardsList;
