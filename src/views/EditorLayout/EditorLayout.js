import React, { useEffect, useMemo, useState, useRef } from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { DragDropContext } from "react-beautiful-dnd";
import { CssBaseline } from "@material-ui/core";

import EditorPageSwitch from "./components/EditorPageSwitch";
import EditorNavigations from "./components/EditorNavigations";

import "./styles.scss";

import { updateUieCanvas } from "./Pages/UIEditor/utils/uieditorHelpers";
import EditorFooter from "./components/EditorFooter";
import {
  loadScreenStyle,
  rAddToWorkflow,
  rLoadWorkflowTasks,
  rRemoteUpdateCanvasElements,
  rSelectActiveTask,
  rSetActiveWorkflow,
  rSetWorkflowIntegrations,
  rSetWorkflowVariables,
  rSetWorkflowsList,
  rSetupBackDrop,
  rToggleUIEditorFullScreen,
  rToggleWorkflowFullScreen,
  rUpdateWorkflowCanvas,
  rSaveActiveScreen,
  setCanvasZoomLevel,
  saveDisplayTableColumn,
  setDropZone,
  rUpdateScreensList,
  toggleWorkflowPanel,
  rOpenAppDetailsDialog,
  rSelectApp,
  rSetAppsControlMode,
  rUieSetDragStart,
  rUieSetCanvasStructure,
  rUieActivateItem,
  rUieSetScreensItems,
  rHideRightSideBar,
  rUieSetCanvasMode,
} from "../../store/actions/properties";
import { APPS_CONTROL_MODES } from "./Pages/Workflow/components/utils/constants";
import { manageAppLocalStorage } from "../common/helpers/helperFunctions";
import {
  editorNavigationList,
  mainNavigationUrls,
  otherProtectedUrls,
} from "../common/utils/lists";
import GeneralError from "../common/components/ProtectedRoute/components/GeneralError";
import ErrorBoundary from "../common/components/ProtectedRoute/ErrorBoundary";
import AppLayout from "../common/components/AppLayout";
import EditorNavBar from "./components/EditorNavBar";
import CustomAlertBox from "../common/components/CustomAlertBox/CustomAlertBox";
import CustomConfirmBox from "../common/components/CustomConfirmBox/CustomConfirmBox";

import packageFile from "../../../package.json";
import {
  retrieveApp,
  upgradeApp,
} from "../common/components/Mutation/Apps/AppsMutation";
import { APP_DESIGN_MODES, AUTO_UPGRADE_APP } from "../common/utils/constants";
import { errorToastify } from "../common/utils/Toastify";
const { version } = packageFile;

const EditorLayout = (props) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

  const [currentAppId, setCurrentAppId] = useState("");
  const lastAppId = useRef();

  const [page, setPage] = useState(null);
  const [open, setOpen] = useState(true);
  const [pageHeaderTitle, setPageHeaderTitle] = useState("");
  const [isAppRegistered, setIsAppRegistered] = useState(false);
  const [showNewAppPrompt, setShowNewAppPrompt] = useState(false);
  const [upgradesTotalCount, setUpgradesTotalCount] = useState(0);
  const [upgradesCurrentCount, setUpgradesCurrentCount] = useState(0);
  const [showUpgradeAppPrompt, setShowUpgradeAppPrompt] = useState(false);
  const [showUpgradingLoading, setShowUpgradingLoading] = useState(false);
  const [upgradeAppPromptText, setUpgradeAppPromptText] = useState(
    `Plug has been upgraded. Your old apps therefore need to be upgraded also. Click OK to proceed with upgrade.`
  );

  useEffect(() => {
    return () => {
      //  clear uieditor states
      dispatch(rToggleUIEditorFullScreen(false));
      dispatch(loadScreenStyle({}));
      dispatch(saveDisplayTableColumn(false));
      dispatch(setDropZone({}));
      dispatch(setCanvasZoomLevel(100));

      //  clear screen states
      dispatch(rUpdateScreensList([]));
      dispatch(rSaveActiveScreen({}));
      dispatch(rUieSetCanvasStructure({}));
      dispatch(rUieSetScreensItems({}));
      dispatch(rUieActivateItem({}));

      dispatch(rHideRightSideBar(true));

      // //  clear workflow states
      dispatch(toggleWorkflowPanel(false));
      dispatch(rSetWorkflowsList([]));
      dispatch(rToggleWorkflowFullScreen(false));
      dispatch(rUpdateWorkflowCanvas([]));
      dispatch(rLoadWorkflowTasks({}));
      dispatch(rSetActiveWorkflow({}));
      dispatch(rSelectActiveTask({}));
      dispatch(rAddToWorkflow(0));
      dispatch(
        rSetupBackDrop({
          show: false,
          clickToHideBackdrop: true,
        })
      );
      dispatch(rSetWorkflowVariables([]));
      dispatch(rRemoteUpdateCanvasElements([]));
      dispatch(rSetWorkflowIntegrations({}));

      // //  clear app/templates states
      dispatch(rSelectApp({}));
      dispatch(rOpenAppDetailsDialog(null));

      //  clear app-centric localstorage
      manageAppLocalStorage("clear", lastAppId.current, "app");
    };
  }, []);

  useEffect(() => {
    if (!!currentAppId) lastAppId.current = currentAppId;

    if (currentAppId) {
      const verifyNewApp = manageAppLocalStorage("get", currentAppId, "isNew");
      if (verifyNewApp) {
        dispatch(rUieSetCanvasMode(APP_DESIGN_MODES.EDIT));
        setShowNewAppPrompt(true);
      }
    }
  }, [currentAppId]);

  useEffect(() => {
    const page = location.pathname.split("/")[3];
    const title = editorNavigationList.find(
      (item) => item.url === `/${page}`
    )?.title;
    setPageHeaderTitle(title);

    const appId = location.pathname.split("/")[2];
    setCurrentAppId(appId);
  }, [location.pathname]);

  useEffect(() => {
    const currentAppId = location.pathname.split("/")[2];
    setCurrentAppId(currentAppId);
  }, [location]);

  useEffect(() => {
    if (!currentAppId) return;

    initializeAppRegistration();
  }, [currentAppId]);

  useEffect(() => {
    if (upgradesTotalCount > 0) {
      if (AUTO_UPGRADE_APP) {
        setShowUpgradeAppPrompt(true);
        initiateAppUpgrade();
      } else {
        setShowUpgradeAppPrompt(true);
      }
    }
  }, [upgradesTotalCount]);

  useEffect(() => {
    // if (upgradeStatus?.data?.data?.upgrades_required) {
    const nextUpgrade = async () => {
      await initiateAppUpgrade();
    };
    if (
      upgradesCurrentCount > 1 &&
      upgradesCurrentCount <= upgradesTotalCount
    ) {
      nextUpgrade();
    } else if (
      upgradesCurrentCount > 1 &&
      upgradesCurrentCount >= upgradesTotalCount
    ) {
      setShowUpgradingLoading(false);
      setUpgradeAppPromptText(
        <>
          <div>Your app has been successfully upgraded.</div>
          <div>
            Kindly confirm that all your configurations are fine and then
            "Publish"
          </div>
        </>
      );
      // window.location.reload();
    }
  }, [upgradesCurrentCount, upgradesTotalCount]);

  const registerApp = (appId, history) => async (dispatch, getState) => {
    if (!appId) {
      return;
    }
    const { user } = getState().auth;

    const selectedApp = await retrieveApp({ id: appId });

    if (selectedApp?.data?._meta?.success) {
      if (selectedApp.data?.data?.account !== user?.account?.id) {
        history.push(mainNavigationUrls.APPS);
        errorToastify("Invalid app access. Kindly check and try again.");
      }

      dispatch(rSelectApp(selectedApp?.data?.data));
      return selectedApp?.data?.data;
    } else {
      if (
        !(selectedApp.message || selectedApp)
          ?.toLowerCase()
          ?.includes("network")
      ) {
        history.push(mainNavigationUrls.APPS);
        errorToastify("Invalid URL. Kindly check and try again.");
      }
      return false;
    }
  };

  const initializeAppRegistration = async () => {
    if (!currentAppId) return;
    const registeredApp = await dispatch(registerApp(currentAppId, history));
    if (registeredApp) {
      dispatch(
        rSetAppsControlMode(
          registeredApp.template
            ? APPS_CONTROL_MODES.TEMPLATE
            : APPS_CONTROL_MODES.APP
        )
      );
      setIsAppRegistered(true);

      // if (!registeredApp?.feVersion) {
      if (registeredApp?.upgrades_required) {
        setUpgradesCurrentCount(1);
        setUpgradesTotalCount(registeredApp?.upgrades_required);
      }
    }
  };

  const initiateAppUpgrade = async () => {
    setShowUpgradingLoading(true);
    const upgradeStatus = await upgradeApp({
      id: currentAppId,
      version,
    });

    if (upgradeStatus?.data?._meta?.success) {
      if (!upgradeStatus?.data?.data?.upgrades_required) {
        setShowUpgradingLoading(false);
        setUpgradeAppPromptText(
          <>
            <div>Your app has been successfully upgraded.</div>
            <div>
              Kindly confirm that all your configurations are fine and then
              "Publish"
            </div>
          </>
        );
        // window.location.reload();
      } else {
        const newCount = upgradesCurrentCount + 1;
        setUpgradesCurrentCount(Math.min(newCount, upgradesTotalCount));
      }
    }
  };

  const completeAppUpgrade = () => {
    window.location.reload();
  };

  const onDragStart = (result) => {
    const { source, destination } = result;

    dispatch(rUieSetDragStart(result));
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    dispatch(updateUieCanvas({ action: "move", destination }));
  };
  const toggleSideBar = () => setOpen((prev) => !prev);
  const memoizedEditorPage = useMemo(() => {
    return (
      <ErrorBoundary render={() => <GeneralError section="editors" />}>
        <Route
          exact
          path={`${otherProtectedUrls.EDITOR}/:appId/:editor`}
          component={() => (
            <EditorPageSwitch setPage={(pg) => setPage(pg)} page={page} />
          )}
        />
      </ErrorBoundary>
    );
  }, [page]);

  const getMarginLeft = () => {
    // if (!open && page === "uieditor" && props.uiEditorFullScreen) return 4;

    // if (!open && page === "workflows" && props.workflowFullScreen) return 4;
    if (page === "uieditor") return props.uiEditorFullScreen ? 4 : 234;
    else if (page === "workflows" && props.workflowFullScreen) return 4;
    // return open ? 234 : 4;
    return 234;
  };
  // localStorage.setItem("sideNavigationWidth", 290);

  const sideToolbarVisibility = () => {
    const hideSideToolbarFor = ["workflows"];

    if (hideSideToolbarFor.includes(page)) return false;
    return true;
  };

  return (
    <ErrorBoundary render={() => <GeneralError />}>
      <div
        className={`editor-pages ${
          sideToolbarVisibility() ? "" : "hideSideToolbar"
        }`}
        style={{ height: "100vh" }}
      >
        <CssBaseline />
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <AppLayout
            headerTitle={pageHeaderTitle}
            hideSearbar
            extraToolBar={<EditorNavBar page={page} />}
            CustomSideNavigation={
              <>
                <div
                  style={{
                    display: "flex",
                    minWidth: 50,
                  }}
                >
                  {/* <div style={{ display: "contents" }}> */}
                  <div
                    style={{
                      position: "fixed",
                      display: "flex",
                      // display: "contents",
                      backgroundColor: "#fff",
                      zIndex: 2,
                    }}
                  >
                    {/* THE EXTREME LEFT VERTICAL BAR */}
                    <EditorNavigations
                      drawerOpen={open}
                      toggleSideBar={toggleSideBar}
                      page={page}
                      appId={currentAppId}
                    />
                  </div>
                </div>
              </>
            }
          >
            <div
              className="allZone"
              style={{ height: "100%", flex: 1, backgroundColor: "#FCFCFC" }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  marginLeft: 0, // getMarginLeft(),
                  // marginLeft: 419,
                  overflowY:
                    page === "uieditor" || page === "screens"
                      ? "auto"
                      : "hidden",
                }}
              >
                {memoizedEditorPage}
                <EditorFooter drawerOpen={open} page={page} />
              </div>
            </div>
          </AppLayout>
        </DragDropContext>
        {showNewAppPrompt && (
          <CustomAlertBox
            open={showNewAppPrompt}
            type="success"
            closeConfirmBox={() => {
              manageAppLocalStorage("clear", currentAppId, "isNew");
              setShowNewAppPrompt(false);
            }}
            text={`Your app was created successfully, click OK to start designing the app interface`}
          />
        )}
        {showUpgradeAppPrompt && (
          <CustomConfirmBox
            open={showUpgradeAppPrompt}
            type="success"
            trueText="OK"
            showCloseIcon={false}
            closeConfirmBox={() => {}}
            // confirmAction={initiateAppUpgrade}
            confirmAction={completeAppUpgrade}
            isCompulsoryPrompt
            text={upgradeAppPromptText}
            isLoadingDialog={showUpgradingLoading}
            loadingDialogText={`Upgrading... please wait... ${upgradesCurrentCount} / ${upgradesTotalCount}`}
            loadingAnimation="anim2"
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default connect((state) => {
  return {
    uiEditorFullScreen: state.uieditor.uiEditorFullScreen,
    workflowFullScreen: state.workflows.workflowFullScreen,
  };
})(EditorLayout);
