import React, { useState } from "react";
import { connect, useSelector } from "react-redux";
import { Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import AddIcon from "@material-ui/icons/Add";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";
import Button from "@material-ui/core/Button";
import RemoveIcon from "@material-ui/icons/Remove";

import { setCanvasZoomLevel } from "../../../store/actions/properties";
import { toggleWorkflowFullScreen } from "../Pages/Workflow/utils/workflowHelpers";
import runLoading from "../../../assets/images/flat_hourglass.gif";
import { toggleUIEditorFullScreen } from "../Pages/UIEditor/utils/uieditorHelpers";
import RequeryModal from "./RequeryModal";
import { statusBarWaitMessages } from "../../common/utils/lists";

const BottomAppBar = (props) => {
  const {
    reducers: { plugBackendUpdateErrorBank },
  } = useSelector((state) => state);
  const drawerWidth =
    props.drawerOpen && props.page === "data"
      ? 170
      : !props.drawerOpen && props.page === "data"
      ? 50
      : (props.drawerOpen ? 376 : 285) -
        (props.page === "workflows" && props.workflowFullScreen
          ? 235
          : props.page === "uieditor" && props.uiEditorFullScreen
          ? 235
          : 0);

  const [showRequeryModal, setShowRequeryModal] = useState(false);

  const appStatus = props.appStatus;

  const getStatusColors = (statusType) => {
    switch (statusType) {
      case "info":
        return {
          borderColor: "#DDDDDD",
          backgroundColor: "#fafbff",
          color: "#263238",
        };

      case "loading":
        return {
          borderColor: "#DDDDDD",
          backgroundColor: "#fafbff",
          color: "#263238",
        };

      case "success":
        return {
          borderColor: "#c6e0da",
          backgroundColor: "#f5fffd",
          color: "#0b7e63",
        };

      case "warning":
        return {
          borderColor: "#ece4d4",
          backgroundColor: "#fffbf4",
          color: "#a58337",
        };

      case "error":
        return {
          borderColor: "#efd2d2",
          backgroundColor: "#fff7f7",
          color: "#e60000",
        };

      default:
        break;
    }
  };

  const _toggleWorkflowFullScreen = () => {
    props.dispatch(toggleWorkflowFullScreen());
  };
  const _toggleUIEditorFullScreen = () => {
    console.log(`1 - - T O G G L I N G  F U L L  S C R E E N`);
    props.dispatch(toggleUIEditorFullScreen());
  };

  const useStyles = makeStyles((theme) => ({
    appBar: {
      top: "auto",
      bottom: 0,
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      zIndex: 5,
      boxShadow: "none",
      borderTop: "solid 0.5px #B8B8B8",
    },
    grow: {
      flexGrow: 1,
    },
    buttons: {
      border: "1px solid #ABB3BF",
      color: "#ABB3BF",
      margin: theme?.spacing(1),
      textTransform: "capitalize",
      fontSize: 12,
      borderRadius: 3,
    },
    buttons1: {
      border: "1px solid #ABB3BF",
      color: "#ABB3BF",
      textTransform: "capitalize",
      fontSize: 12,
      minWidth: 20,
      borderRadius: 3,
    },
    barHeight: {
      minHeight: 50,
      padding: 0,
      marginRight: 10,
    },
    statusBar: {
      display: "flex",
      alignItems: "center",
      height: 32,
      marginLeft: 10,
      marginRight: 10,
      padding: "1px 2px 1px 10px",
      paddingRight: 13,
      border: "solid 1px #DDDDDD",
      backgroundColor: getStatusColors(appStatus?.type)?.backgroundColor, //"#FCFCFC",
      borderColor: getStatusColors(appStatus?.type)?.borderColor, //"#FCFCFC",
      color: getStatusColors(appStatus?.type)?.color, //"#FCFCFC",
      borderRadius: 2,
      // fontFamily: "monospace",
      fontSize: 13,
      fontWeight: 600,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      // textTransform: "capitalize",
    },
  }));

  const classes = useStyles();

  const _zoomCanvas = (direction) => {
    switch (direction) {
      case 0:
        props.dispatch(setCanvasZoomLevel(100));
        break;

      case 1:
        props.dispatch(setCanvasZoomLevel(props.zoomLevel + 10));
        break;

      case -1:
        props.dispatch(setCanvasZoomLevel(props.zoomLevel - 10));
        break;

      default:
        break;
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar color="inherit" className={classes.appBar}>
        <Toolbar className={classes.barHeight}>
          <div className={classes.grow}>
            <div className={classes.statusBar}>
              {/* { (appStatus.message !== "...") ? appStatus.message : <HourglassEmptyRounded style={{ fontSize: 16, color: "grey" }} /> } */}
              {appStatus.message !== "..." ? (
                appStatus.message || ""
              ) : (
                <div style={{ display: "flex" }}>
                  <img
                    className={classes.image}
                    src={runLoading}
                    width={20}
                    alt=""
                    style={{ marginRight: 10, opacity: 0.8 }}
                  />
                  {
                    statusBarWaitMessages[
                      Math.floor(
                        Math.random() * statusBarWaitMessages.length - 1
                      )
                    ]
                  }
                </div>
              )}
              {!!Object.keys(plugBackendUpdateErrorBank).length && (
                <Tooltip title="You have unsaved changes. Click for action.">
                  <div
                    className="unsaved-changes blink"
                    onClick={() => setShowRequeryModal(true)}
                  >
                    UNSAVED CHANGES
                  </div>
                </Tooltip>
              )}
            </div>
          </div>
          {/* <Button outlined="true" size="small" className={classes.buttons}>
            Reset Zoom
          </Button> */}

          <div
            style={
              props.page === "uieditor" || props.page === "screens"
                ? { marginRight: 16 }
                : { display: "none" }
            }
          >
            <Tooltip title="Zoom out to see a broader view of your screen design canvas">
              <Button
                outlined="true"
                size="small"
                disabled={props.zoomLevel < 60}
                className={classes.buttons1}
                onClick={() => _zoomCanvas(-1)}
              >
                <RemoveIcon fontSize="small" />
              </Button>
            </Tooltip>
            <Button
              outlined="true"
              size="small"
              disabled={props.zoomLevel === 100}
              className={classes.buttons}
              onClick={() => _zoomCanvas(0)}
            >
              {props.zoomLevel}%
            </Button>
            <Tooltip title="Zoom in to get a closer view of your screen design canvas">
              <Button
                outlined="true"
                size="small"
                disabled={props.zoomLevel > 190}
                className={classes.buttons1}
                onClick={() => _zoomCanvas(1)}
              >
                <AddIcon fontSize="small" />
              </Button>
            </Tooltip>
          </div>

          <div
          /* style={
              props.page === "workflows"
                ? { marginRight: 9 }
                : { display: "none" }
            } */
          >
            <Button
              outlined="true"
              size="small"
              className={classes.buttons1}
              style={{ padding: 0 }}
              onClick={
                props.page === "workflows"
                  ? _toggleWorkflowFullScreen
                  : _toggleUIEditorFullScreen
              }
            >
              {((props.page === "workflows" && !props.workflowFullScreen) ||
                (props.page === "uieditor" && !props.uiEditorFullScreen)) && (
                <FullscreenIcon fontSize="small" style={{ fontSize: 30 }} />
              )}
              {((props.page === "workflows" && props.workflowFullScreen) ||
                (props.page === "uieditor" && props.uiEditorFullScreen)) && (
                <FullscreenExitIcon fontSize="small" style={{ fontSize: 30 }} />
              )}
            </Button>
          </div>
          {showRequeryModal && (
            <RequeryModal closeModal={() => setShowRequeryModal(false)} />
          )}
        </Toolbar>
      </AppBar>
      {/* <Toolbar /> */}
    </React.Fragment>
  );
};

export default connect((state) => {
  return {
    zoomLevel: state.uieditor.zoomLevel,
    uiEditorFullScreen: state.uieditor.uiEditorFullScreen,
    workflowFullScreen: state.workflows.workflowFullScreen,
    appStatus: state.reducers.appStatus,
  };
})(BottomAppBar);
