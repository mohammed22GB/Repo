import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { IconButton, Slide, Tooltip } from "@material-ui/core";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { useStep } from "react-hooks-helper";
import { debounce, isEqual } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

import SingleAppItem from "./components/SingleAppItem";
import { VERIFYSSO } from "../../store/actions/appsActions";
import { useStyles } from "./util/appsStyle";
import AppDetailsDialog from "./components/AppDetailsDialog";
import {
  APPS_CONTROL_MODES,
  APPS_PER_PAGE,
} from "../EditorLayout/Pages/Workflow/components/utils/constants";
import {
  rSaveAppsList,
  rSetAppsControlMode,
} from "../../store/actions/properties";
import {
  getAppsList,
  getCategories,
} from "../common/components/Query/AppsQuery/queryApp";
import useCustomMutation from "../common/utils/CustomMutation";
import {
  createAppFromFile,
  deleteApp,
} from "../common/components/Mutation/Apps/AppsMutation";
import useCustomQuery from "../common/utils/CustomQuery";
import MainPageLayout from "../common/components/AppLayout/MainPageLayout";
import { mainNavigationListNames } from "../common/utils/lists";
import CustomPromptBox from "../common/components/CustomPromptBox/CustomPromptBox";
import { PLUG_ROLES } from "../common/utils/userRoleEvaluation";
import { MdUploadFile } from "react-icons/md";
import {
  errorToastify,
  infoToastify,
  successToastify,
} from "../common/utils/Toastify";
import { appDialogModes } from "../common/utils/constants";
import { v4 } from "uuid";

const steps = [{ id: "welcome" }, { id: "tour" }];

const appsControlMode = APPS_CONTROL_MODES.APP;

const initPaging = {
  currentPage: 1,
  hasMore: false,
  currentCategory: "All",
};

const Apps = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles(makeStyles);

  const [paging, setPaging] = useState(initPaging);
  const [nextPage, setNextPage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [displayToTopBtn, setDisplayToTopBtn] = useState(false);
  const [forOtherTab, setForOtherTab] = useState("first");
  const [fromLoadMore, setFromLoadMore] = useState(false);
  const [showLoadMoreButton, setLoadMoreShowButton] = useState(false);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [openAppDialog, setOpenAppDialog] = useState(false);
  const [dialogAppDetails, setDialogAppDetails] = useState({});
  const [dialogAppMode, setDialogAppMode] = useState(appDialogModes.NEW);
  const [isListUpdated, setIsListUpdated] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLap, setIsLap] = useState(true);
  const [filteredAppsData, setFilteredAppsData] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [importFileKey, setImportFileKey] = useState(v4());

  const {
    appsReducer: {
      appsAndTemplatesData,
      selectedCategory,
      appSortParams,
      openAppDetailsDialogToken,
    },
  } = useSelector((state) => state);

  const { pageSearchText } = useSelector(({ reducers }) => reducers);
  const { user } = useSelector(({ auth }) => auth);

  const queryObj = {
    queryKey: [
      {
        appSortParams,
        selectedCategory: paging.currentCategory,
        page: paging.currentPage,
        perPage: APPS_PER_PAGE,
      },
    ],
  };

  const runSearch = useRef(
    debounce(async (query, searchText) => {
      setIsLoading(true);
      const result = await getAppsList(query, searchText);
      setIsLoading(false);

      if (result?.data?._meta?.success) {
        //onSuccess(result);
        setFilteredAppsData(result.data.data);
      } else {
        onError();
      }
    }, 1000)
  );

  useEffect(() => {
    //handleSearchChange(pageSearchText);
    setSearchPerformed(!!pageSearchText);
    if (pageSearchText) {
      runSearch.current(queryObj, pageSearchText);
    } else {
      setFilteredAppsData(appsAndTemplatesData?.[appsControlMode]);
    }
  }, [pageSearchText, appsAndTemplatesData]);

  const handleSearchChange = (input) => {
    setSearchPerformed(!!input);
    const filtered = !!input
      ? appsAndTemplatesData?.[appsControlMode]?.filter((appData) =>
          appData.name.toLowerCase().includes(input?.toLowerCase())
        )
      : appsAndTemplatesData?.[appsControlMode];
    setFilteredAppsData(filtered);
  };

  useEffect(() => {
    document.title = "Apps";
  }, []);

  useEffect(() => {
    return () => {
      dispatch({ type: VERIFYSSO, payload: false });
    };
  }, [dispatch]);

  useEffect(() => {
    if (!!openAppDetailsDialogToken && !openAppDialog) {
      setOpenAppDialog(true);
      setDialogAppDetails({});
      setDialogAppMode(appDialogModes.NEW);
    }
  }, [openAppDetailsDialogToken]);
  const { navigation } = useStep({ initialStep: 0, steps });

  const handleOpen = () => {
    setOpenAppDialog(true);
  };

  const onAddNewFunc = () => {
    setDialogAppDetails({});
    setDialogAppMode(appDialogModes.NEW);
    handleOpen();
  };

  const handleClose = () => {
    rSetAppsControlMode();
    setOpenAppDialog(false);
  };

  const onSuccess = ({ data }) => {
    setHasLoadError(false);
    const currentListData = appsAndTemplatesData[appsControlMode] || [];
    const updatedList = [
      ...(fromLoadMore ? currentListData : []),
      ...data?.data,
    ];
    dispatch(
      rSaveAppsList({
        ...appsAndTemplatesData,
        [appsControlMode]: updatedList,
      })
    );

    const hasMore = !!data?._meta?.pagination?.next;
    setPaging({
      ...paging,
      hasMore,
    });
    setFromLoadMore(false);
    setLoadMoreShowButton(true);
  };

  const onError = () => {
    setHasLoadError(true);
  };

  useEffect(() => {
    setPaging({
      ...initPaging,
      currentCategory: selectedCategory,
    });
  }, [selectedCategory]);
  useEffect(() => {
    setPaging({
      ...initPaging,
      currentCategory: selectedCategory,
    });
    setIsListUpdated(false);
  }, [isListUpdated]);

  useEffect(() => {
    runFetch();
  }, [
    appSortParams,
    paging.currentPage,
    paging.currentCategory,
    APPS_PER_PAGE,
    forOtherTab,
  ]);

  const runFetch = async () => {
    setIsLoading(true);
    const result = await getAppsList(queryObj, "");
    setIsLoading(false);

    if (result?.data?._meta?.success) {
      onSuccess(result);
    } else {
      onError();
    }
  };

  /* hope to optimize/replace this function */
  const reloadAppsList = (controlMode) => {
    let activeControlMode = appsControlMode;
    /* if (isValidControlMode(controlMode)) {
      activeControlMode = controlMode;
    } */

    const newPaging = {
      ...initPaging,
      hasMore: false,
    };
    const newPaging_ = {
      ...paging,
      hasMore: false,
    };
    if (!isEqual(newPaging_, newPaging)) {
      setPaging(newPaging);
    } else {
      runFetch();
    }
  };

  props = { navigation };

  const doLoadMore = () => {
    setLoadMoreShowButton(false);
    setFromLoadMore(true);
    paging.hasMore &&
      setPaging({
        ...paging,
        currentPage: paging.currentPage + 1,
      });
  };

  useLayoutEffect(() => {
    const handleBrowserScroll = () => {
      let scrollTop = window.document.children[0].scrollTop;
      let shouldAllowTopNavigation = Math.floor(scrollTop) >= 500;
      setDisplayToTopBtn(() => shouldAllowTopNavigation);
    };

    window.addEventListener("scroll", handleBrowserScroll);

    return () => {
      return window.removeEventListener("scroll", handleBrowserScroll);
    };
  }, [nextPage]);

  const { mutate: doDeleteApp } = useCustomMutation({
    apiFunc: deleteApp,
    onSuccess: reloadAppsList,
    retries: 0,
  });

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

  const sendMenuAction = (action, appDetails) => {
    switch (action) {
      case "Duplicate":
        setOpenAppDialog(true);
        setDialogAppDetails(appDetails);
        setDialogAppMode(appDialogModes.DUPLICATE);
        break;

      case "Clone":
        setOpenAppDialog(true);
        setDialogAppDetails(appDetails);
        setDialogAppMode(appDialogModes.CLONE);
        break;

      case "Properties":
        setOpenAppDialog(true);
        setDialogAppDetails(appDetails);
        setDialogAppMode(appDialogModes.PROPERTIES);
        break;

      case "Delete":
        setDialogAppDetails(appDetails);
        setOpenConfirmDialog(true);
        break;

      default:
        break;
    }
  };

  const openToManage = (appId) => {
    history.push(`/editor/${appId}/uieditor`);
  };

  const handleChange = (lap) => {
    if (lap.isFinish) {
      setIsLap(false);
    }
  };

  const doCreateAppFromFile = async (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      errorToastify("No file selected.");
      return;
    }

    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await createAppFromFile(formData);
      infoToastify("App import in progress... Please wait...");

      if (response?.data?._meta?.success) {
        successToastify(response?.data?._meta?.message);
        runFetch();
      }
      setImportFileKey(v4());
    } catch (error) {
      errorToastify(
        error.response?.data?._meta?.error?.message ||
          "Sorry, an error occured."
      );
      setImportFileKey(v4());
    }
  };

  return (
    <>
      <MainPageLayout
        headerTitle={mainNavigationListNames.APPS_N_TEMPLATES.APPS_N_TEMPLATES}
        pageTitle={mainNavigationListNames.APPS_N_TEMPLATES.APPS}
        pageSubtitle=""
        appsControlMode={null}
        categories={null}
        isLoading={isLoading}
        handleChange={handleChange}
        onAddNew={{ fn: onAddNewFunc, tooltip: "Add new app" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            flexWrap: "wrap",
            rowGap: 11,
            columnGap: 6,
          }}
        >
          {(!isLoading || paging.currentPage !== 1) &&
            filteredAppsData?.map((appData, index) => (
              <SingleAppItem
                key={index}
                appDetails={appData}
                appsAndTemplatesData={appsAndTemplatesData} //  querying the importance of this...
                appsControlMode={appsControlMode}
                color={appData.category?.color}
                classes={classes}
                categories={categories}
                sendMenuAction={sendMenuAction}
              />
            ))}

          <div style={{ clear: "both" }} />
          {!isLoading && !filteredAppsData?.length && (
            <div style={{ width: "100%", textAlign: "center" }}>
              <img
                src="../../../images/dashboard-no-post.svg"
                alt="No Posts"
                width={100}
                style={{ marginTop: 50 }}
              />
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
                <div style={{ color: "#091540", fontWeight: 500 }}>
                  {searchPerformed
                    ? "App not found."
                    : ` Welcome ${
                        JSON.parse(localStorage.userInfo || "{}")?.firstName
                      }! Create your first app.`}
                </div>
              )}
            </div>
          )}
        </div>
        {paging?.hasMore && !searchPerformed && (
          <div>
            {!isLoading && showLoadMoreButton && (
              <div className={classes.paginate}>
                <span onClick={() => doLoadMore()}>{`Load more apps`}</span>
              </div>
            )}
          </div>
        )}

        {user?.roles?.includes(PLUG_ROLES.ROLE_PLUGADMIN) && (
          <IconButton
            data-testid="hellohello"
            style={{
              position: "fixed",
              bottom: 16,
              right: 67,
              height: 35,
              width: 35,
              borderRadius: "50%",
              border: "dashed 1px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
            component="label"
          >
            <Tooltip title="Import from file" style={{ display: "flex" }}>
              <div>
                <input
                  name="import-file"
                  key={importFileKey}
                  hidden
                  style={{ position: "absolute", zIndex: -1 }}
                  accept=".pax"
                  type="file"
                  onChange={doCreateAppFromFile}
                />

                <MdUploadFile style={{ fontSize: 18 }} />
              </div>
            </Tooltip>
          </IconButton>
        )}
      </MainPageLayout>
      {displayToTopBtn && (
        <Slide in={displayToTopBtn} mountOnEnter unmountOnExit>
          <div
            className={classes.toTopIcon}
            onClick={() =>
              window.document.children[0].scrollIntoView({
                block: "start",
                behavior: "smooth",
                inline: "nearest",
              })
            }
          >
            <FontAwesomeIcon
              icon={faArrowUp}
              style={{ fontSize: 20 }}
              color={"#000"}
            />
          </div>
        </Slide>
      )}{" "}
      {openAppDialog && (
        <AppDetailsDialog
          handleClose={handleClose}
          openAppDialog={openAppDialog}
          categories={categories}
          appData={dialogAppDetails}
          mode={dialogAppMode}
          reloadAppsList={reloadAppsList}
          openToManage={openToManage}
        />
      )}
      {openConfirmDialog && (
        <CustomPromptBox
          title="confirm deletion"
          // actionText={actionText}
          handleCloseDialog={setOpenConfirmDialog}
          open={openConfirmDialog}
          confirmAction={() => doDeleteApp(dialogAppDetails?.id)}
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
