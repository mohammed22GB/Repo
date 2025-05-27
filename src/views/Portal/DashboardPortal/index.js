import { useState, useEffect } from "react";
import { connect } from "react-redux";

import { useStyles } from "./components/dashboardStyle";
import { APPS_CONTROL_MODES } from "../../EditorLayout/Pages/Workflow/components/utils/constants";
import useCustomQuery from "../../common/utils/CustomQuery";
import DashboardContainer from "./components/UserDetails";
import PortalLayout from "../PortalAppLayout/PortalLayout";
import { RecordsTable } from "./components/RecordsTable";
import QuickAccess from "../AppsPortal/components/QuickAccess";
import { getAccountInfo } from "../../SettingsLayout/Pages/SsoConfiguration/utils/ssoAccountsAPI";
import {
  getAppsList,
  getCategories,
} from "../../common/components/Query/AppsQuery/queryApp";
import { getWorkflowInstances } from "../../Analytics/AnalyticsApis";
import { useQuery } from "react-query";
import { getUserGroupsAPI } from "../../SettingsLayout/Pages/UserGroups/utils/usergroupsAPIs";
import { socket } from "../../../App";

const steps = [{ id: "welcome" }, { id: "tour" }];

const appsControlMode = APPS_CONTROL_MODES.APP;

const colors = [
  { pri: "#FF4BA61F", sec: "#FF45A3" },
  { pri: "#3374F51F", sec: "#2C6FF4" },
  { pri: "#14E0AE1F", sec: "#0EDEAB" },
];
const DashboardPortal = (props) => {
  const classes = useStyles();
  const [isAppsLoading, setIsAppsLoading] = useState(false);
  const [accountInfo, setAccountInfo] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filteredAppsData, setFilteredAppsData] = useState([]);
  const [appsCategory, setAppsCategory] = useState("All");

  //Records
  const [perPage, setPerPage] = useState(10);
  const [pageNo, setPageNo] = useState(0);
  const [category, setCategory] = useState("All");
  const [filterLevel, setFilterLevel] = useState("directreport");
  const [categoryVal, setCategoryVal] = useState("All");
  const [taskData, setTaskData] = useState(null);
  const [isTaskLoading, setIsTaskLoading] = useState(null);
  const [perPageUG, setPerPageUG] = useState(30);
  const [pageNoUG, setPageNoUG] = useState(1);
  const [adminUG, setAdminUG] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userID = userInfo?.id;

  useEffect(() => {
    document.title = "Dashboard Portal";
  }, []);

  const onGetUserGroupsSuccess = ({ data }) => {
    if (data?.data?.length < 1) {
      setAdminUG(false);
    }
  };

  // fetch usergroups
  const options = {
    query: {
      population: [{ path: "users", select: "id firstName lastName" }],
    },
  };

  const { data: dataUG, isLoading: isLoadingUG } = useCustomQuery({
    queryKey: ["allUserGroups", options, perPageUG, pageNoUG, userID],
    apiFunc: getUserGroupsAPI,
    onSuccess: onGetUserGroupsSuccess,
    enabled: !!perPageUG,
  });

  const appsQueryObj = {
    queryKey: [
      {
        selectedCategory: appsCategory,
        page: 1,
        perPage: 10,
      },
    ],
  };

  const runFetch = async () => {
    setIsAppsLoading(true);
    const result = await getAppsList(appsQueryObj);

    if (result?.data?._meta?.success) {
      setFilteredAppsData(result.data.data);
    }
    setIsAppsLoading(false);
  };

  useEffect(() => {
    runFetch();
  }, []);

  const handleCategoriesListSuccess = (data) => {
    const categoriesData = data?.data?.data?.data?.map((category) => {
      return { id: category.id, name: category.name };
    });
    return setCategories(categoriesData);
  };

  useCustomQuery({
    apiFunc: getCategories,
    queryKey: ["listCategories"],
    onSuccess: handleCategoriesListSuccess,
  });

  const fetchPendingTask = async (task) => {
    setIsTaskLoading(true);

    const queryObj = {
      page: pageNo,
      perPage,
      filterLevel,
      category: categoryVal,
      statusVal: "pending",
    };

    const result = await getWorkflowInstances(queryObj);

    setTaskData(result?.data);
    setIsTaskLoading(false);
  };

  useEffect(() => {
    fetchPendingTask();

    socket.on("task:status-updated", () => {
      fetchPendingTask();
    });
  }, []);

  const accountInfoSuccess = async (data) => {
    setAccountInfo(data?.data?.data?.customisations?.internalPage);
  };
  const {
    data: accountData,
    isLoading: isAccountLoading,
    isFetching,
  } = useQuery(["accountInfo"], getAccountInfo, {
    onSuccess: accountInfoSuccess,
    refetchOnMount: true,
    cacheTime: 0,
  });
  return (
    <>
      <PortalLayout>
        <>
          <div>
            <DashboardContainer
              colors={colors}
              accountInfo={accountData?.data?.customisations?.internalPage}
              isAccountLoading={isAccountLoading}
              taskData={taskData}
              isTaskLoading={isTaskLoading}
              userInfo={userInfo}
            />
            <div className={classes.wrapper}>
              <RecordsTable
                categories={categories}
                category={category}
                adminUG={adminUG}
                isLoadingUG={isLoadingUG}
                categoryVal={categoryVal}
                setCategoryVal={setCategoryVal}
                filterLevel={"All"}
              />
              <div
                style={{
                  width: "32%",
                  background: "#FFFFFF",
                  minHeight: "100%",
                  border: "1px solid #F0F0F0",
                  borderRadius: "10px",
                  padding: "24px",
                }}
              >
                <QuickAccess
                  categories={categories}
                  colors={colors}
                  classes={classes}
                  appsControlMode={appsControlMode}
                  filteredAppsData={filteredAppsData}
                  accountData={accountData?.data}
                  isAccountLoading={isAccountLoading}
                  setIsAppsLoading={setIsAppsLoading}
                  setAccountInfo={setAccountInfo}
                  useApi={false}
                />
              </div>
            </div>
          </div>
        </>
      </PortalLayout>
    </>
  );
};

function mapStateToProps(state) {
  return {
    isLoggingOut: state.auth.isLoggingOut,
    logoutError: state.auth.logoutError,
  };
}

export default connect(mapStateToProps)(DashboardPortal);
