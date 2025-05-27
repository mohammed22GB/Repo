import { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Tooltip } from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import aiStar from "../../../assets/images/ai-star.svg";

import {
  clearWorkflowCanvas,
  getAllWorkflows,
} from "../Pages/Workflow/utils/workflowHelpers";
import {
  clearUIEditorCanvas,
  reloadScreen,
} from "../Pages/UIEditor/utils/uieditorHelpers";
import { APPS_CONTROL_MODES } from "../Pages/Workflow/components/utils/constants";
import clearEditorIcon from "../../../assets/images/editor-clear-icon.svg";
import { successToastify } from "../../common/utils/Toastify";
import { mainNavigationUrls } from "../../common/utils/lists";
import { SetAppStatus } from "../../common/helpers/helperFunctions";
import useCustomMutation from "../../common/utils/CustomMutation";
import { publishApp } from "../../common/components/Mutation/Apps/AppsMutation";
import { publishTemplates } from "../../common/components/Mutation/Templates/TemplateMutation";
import {
  getUserRole,
  userManagementPermission,
} from "../../common/utils/userRoleEvaluation";
import CustomConfirmBox from "../../common/components/CustomConfirmBox/CustomConfirmBox";
import { Refresh } from "@material-ui/icons";
import AIModal from "../../common/components/AI-Modal/AIModal";
import {
  rHideRightSideBar,
  rLoadWorkflowTasks,
} from "../../../store/actions/properties";

const EditorNavBar = (props) => {
  const drawerWidth = props.drawerWidth;

  const appType =
    props.appsControlMode === APPS_CONTROL_MODES.APP ? "app" : "template";

  const useStyles = makeStyles((theme) => ({
    grow: {
      flexGrow: 1,
    },
    title: {
      color: "#424874",
      fontSize: 11,
    },
    appBar: {
      [theme?.breakpoints?.up("sm")]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
      boxShadow: "0px 1px 1px -1px rgba(0,0,0,0.2)",
    },
    sectionDesktop: {
      display: "none",
      [theme?.breakpoints?.up("md")]: {
        display: "flex",
      },
    },
    sectionMobile: {
      display: "flex",
      [theme?.breakpoints?.up("sm")]: {
        display: "none",
      },
      paddingTop: 10,
      paddingBottom: 10,
    },
    navIcons: {
      color: "#999",
      fontSize: 18,
    },
    dot: {
      background: "#0C7B93",
    },
    changes: {
      textAlign: "center",
      color: "#ABB3BF",
      fontSize: 12,
    },
    controlTopBar: {
      color: "#091540",
      // fontSize: 12,
      textTransform: "uppercase",
      fontWeight: 300,
    },
    publish: {
      fontSize: 12,
      margin: theme?.spacing(1),
      backgroundColor: "#010A43",
      color: "#fff",
      textTransform: "none",
      borderRadius: 3,
    },
    edit: {
      fontSize: 12,
      margin: theme?.spacing(1),
      color: "#424874",
      textTransform: "none",
      borderRadius: 3,
      borderColor: "#010A43",
    },
    preview: {
      fontSize: 12,
      margin: theme?.spacing(1),
      backgroundColor: "#E7E9EE",
      color: "#424874",
      textTransform: "none",
      borderRadius: 3,
    },
    badge: {
      height: 16,
      minWidth: 12,
      fontSize: 8,
    },
    topBar: {
      boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2)",
      minHeight: 0,
      zIndex: 5,
    },
    nav: {
      minHeight: 0,
      borderTop: "solid 1px #ccc",
    },
    avatar: {
      backgroundColor: blue[100],
      color: blue[600],
    },
    size: {
      width: 469,
      height: 319,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundImage: `url(../../../../../../images/dialog_bg.svg)`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "left bottom",
    },

    dialogSize: {
      width: 750,
      borderRadius: 10,
    },
  }));
  const classes = useStyles();
  const dispatch = useDispatch();
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const isMenuOpen = Boolean(mobileMoreAnchorEl);
  const [saveMessage, setSaveMessage] = useState("");
  const [undoDisabled, setUndoDisabled] = useState(false);
  const [redoDisabled, setRedoDisabled] = useState(false);
  const [networkOnline, setNetworkOnline] = useState(navigator.onLine);
  const [showPublishAppDialog, setShowPublishAppDialog] = useState("");
  const [showAiModal, setShowAiModal] = useState(false);
  const [showEditAppDialog, setShowEditAppDialog] = useState("");
  const [showClearCanvasDialog, setShowClearCanvasDialog] = useState(false);
  const [showPublishingLoading, setShowPublishingLoading] = useState(false);
  const [showPublishingFinished, setShowPublishingFinished] = useState(false);
  const [publishDialogType, setPublishDialogType] = useState(`info`);
  const [publishDialogText, setPublishDialogText] = useState(
    `Are you sure you want to publish this ${appType}?`
  );
  const [publishDialogFalseText, setPublishDialogFalseText] = useState(`No`);
  const history = useHistory();
  const location = useLocation();

  /**
   * @param data - The data returned from the server.
   */
  const onPublishSuccess = (data) => {
    if (!data?.data?.data?._meta?.success) {
      onPublishError({ error: "Network error" });
      return;
    }
    successToastify(`"${props.selectedApp?.name}" was published successfully`);
    !history.location.state
      ? history.push(mainNavigationUrls.APPS)
      : history.push(history.location.state.path);
  };
  const onPublishError = ({ error }) => {
    setShowPublishingFinished(true);
    setShowPublishingLoading(false);

    setPublishDialogType("error");
    const errorMessage = error?.response?.data?._meta?.error;
    const detailMessage = errorMessage?.messages
      ? `[ ${Object.keys(errorMessage?.messages)
          .map((fieldKey) => `"${fieldKey}"`)
          .join(", ")} ]`
      : "";

    const message = `${errorMessage?.message || JSON.stringify(error)} ${
      detailMessage ? ` : ${detailMessage}` : ""
    }`;
    setPublishDialogText(message);
    setPublishDialogFalseText("OK");

    dispatch(
      SetAppStatus({
        type: "error",
        msg: "Publishing failed",
      })
    );
  };

  const { mutate: publishMutate } = useCustomMutation({
    apiFunc:
      props.appsControlMode === APPS_CONTROL_MODES.APP
        ? publishApp
        : props.appsControlMode === APPS_CONTROL_MODES.TEMPLATE &&
          //userManagementPermission(getUserRole()) &&
          publishTemplates,
    onSuccess: onPublishSuccess,
    onError: onPublishError,
    overrideNotification: true,
    retries: 0,
  });

  const { changesText } = props;

  useEffect(() => {
    /* Checking if the browser is online or offline. */
    window.addEventListener("online", () =>
      setNetworkOnline(!!navigator.onLine)
    );
    /* Checking if the browser is online or offline. */
    window.addEventListener("offline", () =>
      setNetworkOnline(!!navigator.onLine)
    );

    return () => {
      /* Removing the event listener for the online event. */
      window.removeEventListener("online", () =>
        setNetworkOnline(!!navigator.onLine)
      );

      /* Removing an event listener. */
      window.removeEventListener("offline", () =>
        setNetworkOnline(!!navigator.onLine)
      );
    };
  }, [setNetworkOnline]);

  useEffect(() => {
    setSaveMessage(changesText);
  }, [changesText]);

  useEffect(() => {
    if (props?.undoCursor !== -1 && props?.activityHistory?.length > 0) {
      setUndoDisabled(false);
    } else {
      setUndoDisabled(true);
    }

    if (
      props?.undoCursor < props?.activityHistory?.length - 1 &&
      props?.activityHistory?.length > 0
    ) {
      setRedoDisabled(false);
    } else {
      setRedoDisabled(true);
    }
  }, [props.undoCursor, props.activityHistory]);

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const mobileMenuId = "primary-search-account-menu-mobile";

  const handlePreview = () => {
    // Get the ID of the current screen
    const screenId = props.activeScreen?.id;
    //  now navigate
    setMobileMoreAnchorEl(null);
    window.open(`/editor/uieditor/preview/${screenId}`);
  };

  const handleEdit = () => {
    setMobileMoreAnchorEl(null);
    setShowEditAppDialog("edit_app");
    // }
  };

  /**
   * It sets the state of the showPublishAppDialog variable to the value of the string "publish_app".
   */
  const handlePublish = () => {
    // if (props.page === "uieditor" || props.page === "screens") {
    setMobileMoreAnchorEl(null);
    setShowPublishAppDialog("publish_app");
    // }
  };

  /**
   * If the user is in the APPS_CONTROL_MODES.APP tab, then publish the app. If the user is in the APPS_CONTROL_MODES.TEMPLATE tab
   * and the user is a PlugAdmin, then publish the app.
   * @returns Nothing.
   */
  const handlePublishAppTemp = () => {
    setShowPublishingLoading(true);
    setShowPublishingFinished(false);

    if (props.appsControlMode === APPS_CONTROL_MODES.APP) {
      dispatch(
        SetAppStatus({
          type: "loading",
          msg: `Publishing ${props.selectedApp?.name}...`,
        })
      );
      /* Publishing a mutation to the server. */
      publishMutate({
        id: props.selectedApp?.id || props.selectedApp?._id,
        active: true,
      });
      // setShowPublishAppDialog(() => "");
      return;
    } else if (
      props.appsControlMode === APPS_CONTROL_MODES.TEMPLATE &&
      userManagementPermission(getUserRole())
    ) {
      dispatch(
        SetAppStatus({
          type: "loading",
          msg: `Publishing template ${props.selectedApp?.name}...`,
        })
      );
      publishMutate({
        id: props.selectedApp?.template,
        active: true,
      });
      // setShowPublishAppDialog(() => "");

      return;
    }
  };

  const dialogResponse = (use, resp, clearDialog = true) => {
    if (resp === true) {
      switch (use) {
        case "publish_app":
          return handlePublishAppTemp();

        case "public": {
          // public({

          // })
          break;
        }
        default:
          break;
      }
    }

    if (clearDialog) {
      setShowEditAppDialog("");
      setShowPublishAppDialog("");
    }
  };

  const reloadCanvas = () => {
    if (props.page === "workflows") {
      dispatch(
        getAllWorkflows(
          props.selectedApp?.id || props.selectedApp?._id,
          true,
          history,
          true
        )
      );
      dispatch(rHideRightSideBar(true));
      dispatch(rLoadWorkflowTasks({}));
    } else if (props.page === "uieditor") {
      dispatch(
        reloadScreen(props.selectedApp?.id || props.selectedApp?._id, true)
      );
    }
  };

  /**
   * If the user confirms that they want to clear the canvas, then clear the canvas.
   */
  const _clearCanvas = () => {
    if (props.page === "workflows") {
      dispatch(clearWorkflowCanvas());
    } else if (props.page === "uieditor") {
      dispatch(clearUIEditorCanvas());
    }
  };

  const initDialog = () => {
    setShowPublishAppDialog("");
    setShowPublishingFinished(false);
    setShowPublishingLoading(false);
    setPublishDialogType(`info`);
    setPublishDialogText(`Are you sure you want to publish this ${appType}?`);
    setPublishDialogFalseText(`No`);
  };

  return (
    <>
      <div className="app-editor-toolbar">
        <div className="editor-app-info">
          {props.appsControlMode === APPS_CONTROL_MODES.TEMPLATE && (
            <div className="template-nav-tag">Template</div>
          )}
          <Typography
            className={classes.controlTopBar}
            style={{ marginRight: 10, fontSize: 12 }}
          >
            {props.selectedApp?.name || "..."}
          </Typography>

          <div className={classes.grow} />
          <div className={classes.sectionDesktop}></div>
        </div>
        <div className="app-editor-toolbar-right">
          <div style={{ display: "none" }} className="_ai-suggestion">
            <Tooltip title="Generate fields using AI">
              <div
                className="ai-suggestion-btn"
                onClick={() => setShowAiModal(true)}
              >
                <Typography
                  style={{ fontSize: 12, fontWeight: 700, color: "#2457C1" }}
                >
                  Create with AI
                </Typography>
                <img src={aiStar} alt="AI suggestion" />
              </div>
            </Tooltip>
          </div>

          <Tooltip title="Reload canvas">
            <div onClick={reloadCanvas}>
              <Refresh />
            </div>
          </Tooltip>
          <Tooltip title="Clear canvas">
            <div
              disabled={
                // (props.page === "uieditor" && !props?.canvasItems?.length) ||
                props.page === "workflows" && props?.workflowCanvas?.length < 3
              }
              onClick={() => setShowClearCanvasDialog(true)}
            >
              <img src={clearEditorIcon} alt="clear" />
            </div>
          </Tooltip>
          <Tooltip title="Click to save your app changes">
            <div className="_btn">
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#06188F",
                  textTransform: "capitalize",
                  // padding: "0 10px",
                  height: 26,
                  fontSize: 12,
                  color: "#FFFFFF",
                }}
                onClick={handlePublish}
                disabled={props.appStatus === "live"}
              >
                Publish
              </Button>
            </div>
          </Tooltip>
        </div>
      </div>

      {showPublishAppDialog && (
        <CustomConfirmBox
          closeConfirmBox={() => initDialog()}
          text={publishDialogText}
          open={showPublishAppDialog}
          confirmAction={() =>
            dialogResponse(showPublishAppDialog, true, false)
          }
          type={publishDialogType}
          isAlertPrompt={showPublishingFinished}
          closeDialogOnAction={false}
          falseText={publishDialogFalseText}
          isLoadingDialog={showPublishingLoading}
          loadingDialogText="Publishing... please wait..."
          loadingAnimation="anim1"
        />
      )}

      {showEditAppDialog && (
        <CustomConfirmBox
          closeConfirmBox={() => setShowEditAppDialog("")}
          text={`Are you sure you want to take this ${appType} offline to edit?`}
          open={showEditAppDialog}
          confirmAction={() => dialogResponse(showEditAppDialog, true)}
        />
      )}
      {showClearCanvasDialog && (
        <CustomConfirmBox
          closeConfirmBox={() => setShowClearCanvasDialog(false)}
          text={`Are you sure you want to clear this ${
            props.page === "uieditor" ? "screen canvas" : props.page
          }?`}
          type="warning"
          open={showClearCanvasDialog}
          confirmAction={_clearCanvas}
        />
      )}

      {showAiModal && (
        <AIModal
          showAiModal={showAiModal}
          setShowAiModal={setShowAiModal}
          page={props?.page}
          appId={props?.selectedApp?.id || props?.selectedApp?._id}
          activeScreenId={props?.activeScreen?.id}
          reloadCanvas={reloadCanvas}
        />
      )}
    </>
  );
};

export default connect((state) => {
  return {
    selectedApp: state.appsReducer.selectedApp,
    appStatus: state.appsReducer.appStatus,
    appsControlMode: state.appsReducer.appsControlMode,
    showDialog: state.reducers.showDialog,
    activeScreen: state.screens.activeScreen,
    activityHistory: state.uieditor.activityHistory,
    undoCursor: state.uieditor.undoCursor,
    workflowCanvas: state.workflows.workflowCanvas,
  };
})(EditorNavBar);
