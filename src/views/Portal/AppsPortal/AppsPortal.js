import { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

import { useStyles } from "./appsStyle";
import AppDetailsDialog from "./components/AppDetailsDialog";
import { APPS_CONTROL_MODES } from "../../EditorLayout/Pages/Workflow/components/utils/constants";
import {
  getCategoryAndAppsList,
  getCategories,
} from "../../common/components/Query/AppsQuery/queryApp";
import useCustomQuery from "../../common/utils/CustomQuery";
import AppsByCategory from "./components/AppsByCategory";
import QuickAccess from "./components/QuickAccess";
import PortalLayout from "../PortalAppLayout/PortalLayout";
import { getAccountInfo } from "../../SettingsLayout/Pages/SsoConfiguration/utils/ssoAccountsAPI";
import MainPortalLayout from "../MainPortalLayout";
import { appDialogModes } from "../../common/utils/constants";

const steps = [{ id: "welcome" }, { id: "tour" }];

const appsControlMode = APPS_CONTROL_MODES.APP;

const initPaging = {
  currentPage: 1,
  hasMore: false,
  currentCategory: "All",
};

const colors = [
  { pri: "#FF4BA61F", sec: "#FF45A3" },
  { pri: "#3374F51F", sec: "#2C6FF4" },
  { pri: "#14E0AE1F", sec: "#0EDEAB" },
];

const Apps = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles(makeStyles);
  const [paging, setPaging] = useState(initPaging);
  const [categories, setCategories] = useState([]);
  const [displayToTopBtn, setDisplayToTopBtn] = useState(false);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [openAppDialog, setOpenAppDialog] = useState(false);
  const [dialogAppDetails, setDialogAppDetails] = useState({});
  const [dialogAppMode, setDialogAppMode] = useState(appDialogModes.NEW);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLap, setIsLap] = useState(true);
  const [appsCategory, setAppsCategory] = useState("All");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [accountInfo, setAccountInfo] = useState([]);
  const [isAppsLoading, setIsAppsLoading] = useState(false);

  const [categoryAppsData, setCategoryAppsData] = useState({});
  const [filteredAppsData, setFilteredAppsData] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [pageNo, setPageNo] = useState(0);

  useEffect(() => {
    document.title = "Apps";
  }, []);

  const runFetch = async () => {
    setIsAppsLoading(true);

    const queryObj = {
      appSortParams: {},
      selectedCategory: "All",
      page: pageNo,
      perPage: perPage,
    };

    const result = await getCategoryAndAppsList({ queryKey: [queryObj] });

    if (result?.data?._meta?.success) {
      setCategoryAppsData(result.data);
      setFilteredAppsData(result.data.data);
    }
    setIsAppsLoading(false);
  };

  useEffect(() => {
    runFetch();
  }, [pageNo, perPage]);
  /**
   * It takes an object with a data property, and returns a function that takes no arguments and
   * returns the data property of the data property of the data property of the object.
   * @returns The return value is a function that returns the data.
   */
  const handleCategoriesListSuccess = ({ data }) => {
    const categoriesData = data?.data?.data?.map((category) => {
      return { id: category.id, name: category.name };
    });

    return setCategories(categoriesData);
  };

  /* Calling the useCustomQuery hook, which is a custom hook that is used to fetch the categories. */
  useCustomQuery({
    apiFunc: getCategories,
    queryKey: ["listCategories"],
    onSuccess: handleCategoriesListSuccess,
  });

  const openToManage = (appId) => {
    history.push(`/editor/${appId}/uieditor`);
  };

  const accountInfoSuccess = async ({ data }) => {
    setAccountInfo(data?.data);
  };
  //fetch account info
  const {
    data: accountData,
    isLoading: isAccountLoading,
    isFetching,
  } = useCustomQuery({
    apiFunc: getAccountInfo,
    queryKey: ["accountInfo"],
    onSuccess: accountInfoSuccess,
  });

  return (
    <>
      <PortalLayout>
        <MainPortalLayout
          pageTitle={"Apps"}
          pageSubtitle={
            "These apps helps you to create and manage initiations or applications"
          }
        >
          <>
            <div className={classes.categoryAccess}>
              <AppsByCategory
                categories={categories}
                colors={colors}
                classes={classes}
                filteredAppsData={filteredAppsData}
                categoryAppsData={categoryAppsData}
                isAppsLoading={isAppsLoading}
                pageNo={pageNo}
                perPage={perPage}
                onPageChange={(newPage) => setPageNo(newPage)}
                onRowsPerPageChange={(newPerPage) => setPerPage(newPerPage)}
              />
              <div
                style={{
                  width: "42%",
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
                  useApi={true}
                  classes={classes}
                  accountData={accountData?.data}
                  isAccountLoading={isAccountLoading}
                />
              </div>
            </div>
            {!isAppsLoading && !filteredAppsData?.length && (
              <div style={{ width: "100%", textAlign: "center" }}>
                {hasLoadError ? (
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
                  <img
                    src="../../../images/dashboard-no-post.svg"
                    alt="No Posts"
                    width={100}
                    style={{ marginTop: 50 }}
                  />
                )}
              </div>
            )}
          </>
        </MainPortalLayout>
      </PortalLayout>
      {openAppDialog && (
        <AppDetailsDialog
          //handleClose={handleClose}
          openAppDialog={openAppDialog}
          categories={categories}
          appData={dialogAppDetails}
          mode={dialogAppMode}
          //reloadAppsList={reloadAppsList}
          openToManage={openToManage}
        />
      )}
    </>
  );
};
/**
 * MapStateToProps is a function that takes in the state of the Redux store and returns an object that
 * is passed to the component as props.
 * @param state - The current Redux store state.
 * @returns The state of the application.
 */

function mapStateToProps(state) {
  return {
    isLoggingOut: state.auth.isLoggingOut,
    logoutError: state.auth.logoutError,
  };
}

Apps.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};
export default connect(mapStateToProps)(Apps);
