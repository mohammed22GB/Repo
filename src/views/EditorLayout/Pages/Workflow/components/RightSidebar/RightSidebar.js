import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Divider, Paper } from "@material-ui/core";
import CancelOutlinedIcon from "@material-ui/icons/Cancel";

import {
  updateProp,
  rHideRightSideBar,
  rSetupBackDrop,
} from "../../../../../../store/actions/properties";

import InfoSidebar from "./components/InfoSidebar";
import ScreenTaskSidebar from "./components/ScreenTaskSidebar";
import MailTaskSidebar from "./components/MailTaskSidebar";
import DataTaskSidebar from "./components/DataTaskSidebar";
import ApprovalTaskSidebar from "./components/ApprovalTaskSidebar";
import ComputationTaskSidebar from "./components/ComputationTaskSidebar";
import CalendarTaskSidebar from "./components/CalendarTaskSidebar";
import DocumentTaskSidebar from "./components/DocumentTaskSidebar";
import PaymentTaskSidebar from "./components/PaymentTaskSidebar";
import { useQueryClient } from "react-query";
import CustomTaskSidebar from "./components/CustomTaskSidebar";
import {
  getAllWorkflowDatasheets,
  getAllWorkflowIntegrations,
} from "../../utils/workflowHelpers";
import * as taskTypes from "../utils/taskTypes";
import CircularIndeterminate from "../../../../../common/components/ProgressLoader/ProgressLoader";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100%",
    backgroundColor: "transparent",
    position: "relative",
    // paddingBottom: 100
  },
  settings: {
    // margin: "4px 4px 0",
    color: "#999",
  },
  settingsBox: {
    // border: "solid #0C7B93", */
    boxShadow: "-4px 4px 7px #bbb",
    borderWidth: "1px 0 1px 2px",
    backgroundColor: "#FFFFFF",
    borderRadius: "15px 0 0 15px",
    width: 29,
    height: 29,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  controls: {
    borderLeft: "0.2px solid #ABB3BF",
    width: "100%",
    backgroundColor: "#FFFFFF",
  },
}));

const WorkflowRightSidebar = (props) => {
  const classes = useStyles();

  const { activeTask } = useSelector(({ workflows }) => workflows);
  const dispatch = useDispatch();

  const [activeData, setActiveData] = useState({});
  const [renderComponents, setRenderComponents] = useState([]);
  const [updatedActiveComponent, setUpdatedActiveComponent] = useState({});
  const theme = useTheme();
  const queryClient = useQueryClient();
  // const [ activeTask, setActiveTask ] = useState(null);

  useEffect(() => {
    props.dispatch(rHideRightSideBar(true));
    props.dispatch(
      rSetupBackDrop({
        show: false,
        clickToHideBackdrop: true,
      })
    );
  }, []);

  /* useEffect(() => {
    const mode = "";

    if (activeTask?.id || mode === "single") {
      const { id, type } = activeTask;
      const activeComponent = { id, type };

      if (activeComponent.type) {
        // setUpdatedActiveComponent(activeComponent);
      }
    } else if (mode === "multi") {
      setUpdatedActiveComponent({
        type: "multi",
      });
    } else {
      setUpdatedActiveComponent({
        type: "info",
      });
    }
  }, [activeTask]); */

  const _toggleRightSideBar = () => {
    props.dispatch(rHideRightSideBar(!props.hiddenRightSideBar));
  };

  const updatePropCallback = (prop, value) => dispatch(updateProp(prop, value));

  const refreshIntegrations = async (refresh = true) => {
    await dispatch(getAllWorkflowIntegrations(refresh));
    const options = {
      query: {
        active: true,
        per_page: 1000,
      },
    };
  };

  const refreshDatasheets = async (refresh = true) => {
    await dispatch(getAllWorkflowDatasheets(refresh));
    const options = {
      query: {
        active: true,
        per_page: 1000,
      },
    };
  };

  const SelectedRightPanel = () => {
    switch (activeTask.type) {
      case taskTypes.WORKFLOWS_TASK_SCREEN:
        return (
          <ScreenTaskSidebar
            updateProp={updatePropCallback}
            refreshIntegrations={refreshIntegrations}
            refreshDatasheets={refreshDatasheets}
          />
        );

      case taskTypes.WORKFLOWS_TASK_MAIL:
        return (
          <MailTaskSidebar
            updateProp={updatePropCallback}
            refreshIntegrations={refreshIntegrations}
          />
        );

      case taskTypes.WORKFLOWS_TASK_DATA:
        return (
          <DataTaskSidebar
            refreshIntegrations={refreshIntegrations}
            updateProp={updatePropCallback}
            refreshDatasheets={refreshDatasheets}
          />
        );

      case taskTypes.WORKFLOWS_TASK_APPROVAL:
        return <ApprovalTaskSidebar updateProp={updatePropCallback} />;

      case taskTypes.WORKFLOWS_TASK_COMPUTATION:
        return <ComputationTaskSidebar updateProp={updatePropCallback} />;

      case taskTypes.WORKFLOWS_TASK_CALENDAR:
        return (
          <CalendarTaskSidebar
            updateProp={updatePropCallback}
            refreshIntegrations={refreshIntegrations}
          />
        );

      case taskTypes.WORKFLOWS_TASK_DOCUMENT:
        return (
          <DocumentTaskSidebar
            updateProp={updatePropCallback}
            refreshIntegrations={refreshIntegrations}
          />
        );

      case taskTypes.WORKFLOWS_TASK_PAYMENT:
        return (
          <PaymentTaskSidebar
            updateProp={updatePropCallback}
            refreshIntegrations={refreshIntegrations}
          />
        );

      case taskTypes.WORKFLOWS_TASK_CUSTOM:
        return (
          <CustomTaskSidebar
            updateProp={updatePropCallback}
            refreshIntegrations={refreshIntegrations}
          />
        );

      default:
        return <InfoSidebar updateProp={updatePropCallback} />;
    }
  };

  return (
    <Paper className={classes.root} variant="outlined" square>
      <div
        onClick={_toggleRightSideBar}
        style={{
          backgroundColor: "transparent",
          position: "absolute",
          left: -29,
          top: 0,
          zIndex: 999,
          cursor: "pointer",
        }}
      >
        {!props.hiddenRightSideBar &&
          (updatedActiveComponent.type === "action-pane" ? (
            <div>
              <CancelOutlinedIcon
                fontSize="small"
                className={classes.settings}
                // onClick={handleDecisionRightSwitch}
              />
            </div>
          ) : (
            <div className={classes.settingsBox}>
              <CancelOutlinedIcon
                fontSize="small"
                className={classes.settings}
                // onClick={handleDrawer}
              />
            </div>
          ))}
        {updatedActiveComponent.type === "decision-button" ? (
          updatedActiveComponent.type === "action-pane" ? (
            <div className={classes.settingsBox}>
              <div style={{ padding: "7px 6px 4px" }}>
                <img
                  src="../../../../images/icons/direction.svg"
                  alt=""
                  // onClick={handleRightSwitch}
                />
              </div>
              <Divider />
            </div>
          ) : (
            <div>
              <div style={{ padding: "7px 6px 4px" }}>
                <img
                  src="../../../../images/icons/direction.svg"
                  alt=""
                  // onClick={handleRightSwitch}
                />
              </div>
              <Divider />
            </div>
          )
        ) : (
          ""
        )}
      </div>

      <div
        className={classes.controls}
        id="drawer-container"
        style={{
          position: "relative",
          boxShadow: "-3px 5px 12px #bbb",
          paddingBottom: 60,
        }}
      >
        {SelectedRightPanel()}
        {props.loadingRightSideBar ? (
          <CircularIndeterminate color="#ffffff" />
        ) : props.erroLoadingRightSideBar ? (
          <div
            style={{
              position: "absolute",
              top: 0,
              background: "#f9f3f2e6",
              bottom: 50,
              right: 0,
              left: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Network error
          </div>
        ) : null}
      </div>
    </Paper>
  );
};
export default connect((state) => {
  return {
    hiddenRightSideBar: state.reducers.hiddenRightSideBar,
    loadingRightSideBar: state.reducers.loadingRightSideBar,
    erroLoadingRightSideBar: state.reducers.erroLoadingRightSideBar,
  };
})(WorkflowRightSidebar);
