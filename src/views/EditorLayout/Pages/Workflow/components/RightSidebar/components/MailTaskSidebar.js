import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  Divider,
  Typography,
  Select,
  MenuItem,
  Collapse,
  Tooltip,
} from "@material-ui/core";
import {
  ErrorOutlineOutlined,
  CheckCircleOutlineOutlined,
  RefreshOutlined,
} from "@material-ui/icons";
import MyWindowsDimensions from "../../../../../utils/windowsDimension";
import MailActions from "./sidebarActions/MailActions";
import {
  getTaskVariables,
  globalSetTaskInfo,
  isConnectedTo,
} from "../../utils/workflowFuncs";
import { NameDescription } from "./sidebarActions/common/NameDescription";
import { INVALID_FIELD_LABEL_STYLE } from "../../utils/constants";
import { useStyles } from "./Helpers/rightSidebarStyles";
import ExecutionVariables from "./Helpers/ExecutionVariables";

const MailTaskSidebar = ({
  activeTaskId,
  workflowTasks,
  workflowCanvas,
  allVariables,
  dispatch,
  activeTaskType,
  integrations,
  refreshIntegrations,
}) => {
  const activeTask = workflowTasks[activeTaskId];
  const variables = getTaskVariables(activeTaskId, allVariables);

  const classes = useStyles(makeStyles);

  const [windowDimensions, setWindowDimensions] = useState({});
  const [showSection, setShowSection] = useState({
    settings: true,
    action: false,
  });
  const [taskUpdated, setTaskUpdated] = useState(false);
  const [isInfoConfigured, setIsInfoConfigured] = useState(false);
  const [isActionsConfigured, setIsActionsConfigured] = useState(false);
  const [nodeIsConnectedToAny, setNodeIsConnectedToAny] = useState(false);
  const [nodeIsConnectedToStart, setNodeIsConnectedToStart] = useState(false);

  const [isLoadingIntegrations, setIsLoadingIntegrations] = useState(false);

  useEffect(() => {
    checkSetupStatus(activeTask);
  }, []);

  useEffect(() => {
    checkSetupStatus(activeTask);
  }, [activeTask]);

  useEffect(() => {
    const isConnectedToAnySource = isConnectedTo(
      activeTaskId,
      workflowCanvas,
      "anyNode"
    );
    const isConnectedToStartNode = isConnectedTo(
      activeTaskId,
      workflowCanvas,
      "startNode"
    );
    setNodeIsConnectedToAny(isConnectedToAnySource);
    setNodeIsConnectedToStart(isConnectedToStartNode);
  }, [workflowCanvas, activeTask]);

  const _toggleSection = (e, sect) => {
    e && e.stopPropagation();

    const makeTrue = !showSection[sect];
    const showSection_ = { ...showSection };
    Object.keys(showSection_).forEach((p) => (showSection_[p] = false));
    if (makeTrue) showSection_[sect] = true;
    setShowSection(showSection_);
  };

  const _setTaskInfo = (e, ppty, isGrouped) => {
    !!e.persist && e.persist();

    globalSetTaskInfo(
      dispatch,
      e,
      ppty,
      isGrouped,
      activeTask,
      setTaskUpdated,
      [],
      checkSetupStatus
    );
  };

  const preSetTaskInfo = async (e, ppty) => {
    let val;
    const value = e.target.value;
    if (value === "Plug") {
      val = {
        name: "Plug",
        integration: null,
      };
    } else {
      val = {
        name: integrations?.mail?.[value]?.type,
        integration: value,
      };
    }
    _setTaskInfo(val, ppty);
  };

  const checkSetupStatus = (info) => {
    const infoStatus =
      !!info?.name &&
      (!!info?.triggeredByWebhook || !!info?.triggeredByWorkflow);

    const actionsStatus =
      (!!info?.properties?.emailServiceType?.name ||
        !!info?.properties?.emailServiceType?.integration) &&
      !!info?.properties?.emailTarget?.length &&
      !!info?.properties?.emailSubject &&
      !!info?.properties?.emailBody?.trim();

    const status = infoStatus && actionsStatus;

    const preStatus = isInfoConfigured && isActionsConfigured;

    setIsInfoConfigured(infoStatus);
    setIsActionsConfigured(actionsStatus);

    if (status === preStatus) return null;
    return status;
  };

  return (
    <div className={classes.container}>
      <MyWindowsDimensions setWinDim={setWindowDimensions} />
      <div
        className={classes.sideHeadingBar}
        onClick={(e) => _toggleSection(e, "settings")}
      >
        <Typography gutterBottom className={classes.sideHeading}>
          {activeTask?.type || ""} information
          {isInfoConfigured && (
            <CheckCircleOutlineOutlined
              style={{ fontSize: 16, marginLeft: 10, color: "green" }}
            />
          )}
          {!isInfoConfigured && (
            <ErrorOutlineOutlined
              style={{ fontSize: 16, marginLeft: 10, color: "red" }}
            />
          )}
        </Typography>
        {/* <Tooltip title="Close"><CancelIcon className={classes.closeIcon} onClick={cancelNewTask} /></Tooltip> */}
      </div>
      <Collapse in={!!showSection.settings}>
        <Divider style={{ marginBottom: 10 }} />
        <div className={classes.section}>
          <NameDescription
            activeTask={activeTask}
            _setTaskInfo={_setTaskInfo}
            nodeIsConnectedToAny={nodeIsConnectedToAny}
            nodeIsConnectedToStart={nodeIsConnectedToStart}
            noBottomBorder
          />
        </div>

        <ExecutionVariables
          activeTask={activeTask}
          setTaskInfo={_setTaskInfo}
          activeTaskId={activeTaskId}
          variables={allVariables}
          classes={classes}
        />
      </Collapse>
      <Divider />
      <div
        className={classes.sideHeadingBar}
        onClick={(e) => _toggleSection(e, "action")}
      >
        <Typography gutterBottom className={classes.sideHeading}>
          Action details
          {isActionsConfigured && (
            <CheckCircleOutlineOutlined
              style={{ fontSize: 16, marginLeft: 10, color: "green" }}
            />
          )}
          {!isActionsConfigured && (
            <ErrorOutlineOutlined
              style={{ fontSize: 16, marginLeft: 10, color: "red" }}
            />
          )}
        </Typography>
        {/* <Tooltip title="Close"><CancelIcon className={classes.closeIcon} onClick={cancelNewTask} /></Tooltip> */}
      </div>
      <Divider style={{ marginBottom: 10 }} />

      <Collapse in={!!showSection.action}>
        <div className={classes.section}>
          <div className={classes.sectionEntry}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                gutterBottom
                className={classes.sectionTitle}
                style={
                  !activeTask?.properties?.emailServiceType?.name &&
                  !activeTask?.properties?.emailServiceType?.integration
                    ? INVALID_FIELD_LABEL_STYLE
                    : {}
                }
              >
                Mail type/Integration*
              </Typography>
              <Tooltip title="Refresh integrations">
                <RefreshOutlined
                  className={isLoadingIntegrations ? "icon-spin" : ""}
                  style={{
                    fontSize: 16,
                    ...(isLoadingIntegrations
                      ? { color: "#06188f", cursor: "default" }
                      : { color: "#999", cursor: "pointer" }),
                  }}
                  onClick={() =>
                    !isLoadingIntegrations && refreshIntegrations(true)
                  }
                />
              </Tooltip>
            </div>

            <Select
              key={
                activeTask?.properties?.emailServiceType?.name === "Plug"
                  ? "Plug"
                  : activeTask?.properties?.emailServiceType?.integration ||
                    "choose"
              }
              variant="outlined"
              size="small"
              fullWidth
              classes={{
                root: classes.select,
              }}
              // value={selectedActionDataSheet.id || "choose"}
              // onChange={(e) => setSelectedActionDataSheet(decoyDataSheets.find(dd => dd.id === e.target.value))}
              defaultValue={
                activeTask?.properties?.emailServiceType?.name === "Plug"
                  ? "Plug"
                  : activeTask?.properties?.emailServiceType?.integration ||
                    "choose"
              }
              onChange={(e) => preSetTaskInfo(e, "emailServiceType")}
            >
              <MenuItem value="choose" disabled>
                Select one
              </MenuItem>
              <MenuItem value="Plug" selected>
                Plug Mail
              </MenuItem>
              {(Object.keys(integrations?.mail || {}) || []).map((intg) => (
                <MenuItem value={intg} key={intg}>
                  {integrations?.mail?.[intg]?.type}{" "}
                  <b>: {integrations?.mail?.[intg]?.name}</b>
                </MenuItem>
              ))}
            </Select>
          </div>

          <MailActions
            show={true}
            activeTask={activeTask}
            setTaskInfo={_setTaskInfo}
            properties={activeTask?.properties}
            variables={variables}
            workflowTasks={workflowTasks}
          />
        </div>
      </Collapse>
      {/* <Divider style={{ marginBottom: 100 }} /> */}
    </div>
  );
};

export default connect((state) => {
  return {
    activeTaskId: state.workflows.activeTask?.id,
    workflowTasks: state.workflows.workflowTasks,
    workflowCanvas: state.workflows.workflowCanvas,
    allVariables: state.workflows.variables,
    activeTaskType: state.workflows.activeTask?.type,
    integrations: state.workflows.workflowIntegrations,
  };
})(MailTaskSidebar);
