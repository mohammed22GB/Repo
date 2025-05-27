import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Divider, Typography, Collapse, Tooltip } from "@material-ui/core";
import {
  ErrorOutlineOutlined,
  CheckCircleOutlineOutlined,
  Delete,
  AddBox,
  Edit,
  AccountTree,
} from "@material-ui/icons";
import MyWindowsDimensions from "../../../../../utils/windowsDimension";
import { NameDescription } from "./sidebarActions/common/NameDescription";
import {
  getTaskVariables,
  globalSetTaskInfo,
  isConnectedTo,
} from "../../utils/workflowFuncs";
import DataActivitiesModule from "./sidebarActions/common/DataActivitiesModule";
import { useStyles } from "./Helpers/rightSidebarStyles";
import { v4 } from "uuid";
import { CONDITION_OPERATORS } from "../../utils/constants";
import ExecutionVariables from "./Helpers/ExecutionVariables";

const DataTaskSidebar = ({
  activeTaskId,
  activeTaskType,
  workflowTasks,
  workflowCanvas,
  allVariables,
  dispatch,
}) => {
  const activeTask = workflowTasks[activeTaskId];
  const variables = getTaskVariables(activeTaskId, allVariables);

  const operationsCount = activeTask?.properties?.dataOperations?.length || 0;
  const tempOperationValidStatus = Array(operationsCount).fill(false);

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
  const [visibleOperation, setVisibleOperation] = useState(-1);
  const [editNameIndex, setEditNameIndex] = useState(-1);
  const [operationValidStatus, setOperationValidStatus] = useState([
    ...tempOperationValidStatus,
  ]);

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

    const showSection_ = { ...showSection };
    const makeTrue = !showSection[sect];
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

  const checkOperationStatus = (operation, index) => {
    const {
      dataSourceType,
      dataSheet,
      integration,
      table,
      worksheetTab,
      externalDB,
      dataMethod,
      dataUpdateParams,
      dataMatching,
      aggregationFunction,
      aggregatedField,
      retrievedDataVariableName,
      hasDecision,
      decisionCriterion,
      decisionActions,
    } = operation || {};
    // && (!!info?.triggeredByWebhook || !!info?.triggeredByWorkflow);
    const isNewOperation = dataMethod === "new";
    const isUpdateOperation = dataMethod === "update";
    const isRetrieveOperation = dataMethod === "retrieve";

    const validDatasheet = dataSourceType === "datasheet" && !!dataSheet;
    const validGoogleSheet =
      dataSourceType === "googleSheet" &&
      !!integration &&
      !!table &&
      !!worksheetTab;
    const validExternalDB =
      dataSourceType === "externalDatabase" &&
      !!externalDB &&
      !!integration &&
      !!table;

    const validDataUpdateParams =
      isNewOperation ||
      (!!dataUpdateParams?.length &&
        !dataUpdateParams?.find((paramLine) => {
          const check =
            !paramLine.dataUpdateIdentifierField ||
            paramLine.dataUpdateIdentifierField === "choose" ||
            !paramLine.dataUpdateIdentifierColumn ||
            paramLine.dataUpdateIdentifierColumn === "choose";
          // !paramLine.dataUpdateIdentifierOperator ||   //  this value is set by default
          // paramLine.dataUpdateIdentifierOperator === "choose";
          return check;
        }));

    const validRetrieveAggregationEntry =
      !(!!aggregationFunction && aggregationFunction !== "NONE") ||
      !!aggregatedField;
    const validDecisionEntry =
      !hasDecision ||
      (!!decisionCriterion?.operator &&
        ([
          CONDITION_OPERATORS.IS_NULL,
          CONDITION_OPERATORS.IS_NOT_NULL,
        ].includes(decisionCriterion?.operator) ||
          !!decisionCriterion?.operand));

    const validRetrieveEntry =
      !isRetrieveOperation ||
      // retrievedDataVariableName &&
      (!!validRetrieveAggregationEntry && validDecisionEntry);

    const validDataMatching =
      isRetrieveOperation ||
      (!!dataMatching?.length &&
        !dataMatching?.find((matchingLine) => {
          const checkReplace =
            (!matchingLine.updateType ||
              matchingLine.updateType === "replace") &&
            (!matchingLine.targetField ||
              matchingLine.targetField === "choose" ||
              !matchingLine.targetValue?.length);
          const checkCompute =
            matchingLine.updateType === "compute" &&
            (!matchingLine.targetField ||
              matchingLine.targetField === "choose" ||
              !matchingLine.leftArgument?.length ||
              !matchingLine.rightArgument?.length ||
              !matchingLine.operator ||
              matchingLine.operator === "choose");

          return checkReplace || checkCompute;
        }));

    const operationStatus =
      (validDatasheet || validGoogleSheet || validExternalDB) &&
      validRetrieveEntry &&
      validDataMatching &&
      validDataUpdateParams;

    // const opsStatus = [...tempOperationValidStatus];
    tempOperationValidStatus[index] = !!operationStatus;
    // setOperationValidStatus(opsStatus);

    return operationStatus;
  };
  const checkSetupStatus = (info) => {
    const infoStatus = !!info?.name;
    // && (!!info?.triggeredByWebhook || !!info?.triggeredByWorkflow);

    const { properties } = info || {};
    const dataOperations = properties?.dataOperations?.length
      ? properties?.dataOperations
      : [properties];

    const actionsStatus = !dataOperations?.some(
      (operation, index) => !checkOperationStatus(operation, index)
    );

    setOperationValidStatus(tempOperationValidStatus);

    const status = infoStatus && actionsStatus;

    setIsInfoConfigured(infoStatus);
    setIsActionsConfigured(actionsStatus);

    // if (status === preStatus) return null;
    return status;
  };

  const updateOperation = (evt, index, action, e, ppty, isGrouped) => {
    evt && evt.stopPropagation();

    const { dataOperations, hasDecision, ...otherDataProperties } =
      activeTask?.properties;
    const newDataOperations = [
      ...(dataOperations?.length ? dataOperations : [otherDataProperties]),
    ];
    let makeGroupDecision = hasDecision;
    let makeGroupDecisionActions = null;
    let notAffectVariables = true;

    switch (action) {
      case "add":
        newDataOperations.splice(index + 1, 0, {
          dataOperationId: v4(),
          retrievedDataVariableName: `dataoperation-${Math.ceil(
            Math.random() * 1000000
          )}`,
          triggerDateTime: {
            value: [],
          },
          dataMatching: [{}],
          dataSourceType: "datasheet",
          updateType: "replace",
          dataMethod: "new",
          dataUpdateParams: [],
          triggerIntervalCount: [],
        });

        visibleOperation === index && setVisibleOperation(-1);

        const opStatusAdd = [...operationValidStatus];
        opStatusAdd.splice(index + 1, 0, false);
        setOperationValidStatus(opStatusAdd);

        break;

      case "delete":
        newDataOperations.splice(index, 1);
        visibleOperation === index && setVisibleOperation(-1);
        notAffectVariables = false;

        const opStatusDel = [...operationValidStatus];
        opStatusDel.splice(index, 1);
        setOperationValidStatus(opStatusDel);

        break;

      default:
        newDataOperations[index] = {
          ...newDataOperations[index],
          ...(isGrouped
            ? e
            : {
                [e?.target?.name || ppty]:
                  e?.target?.value || e?.target?.checked,
              }),
        };

        const checkDecisionInUpdate =
          e?.target?.name === "hasDecision" && e?.target?.checked;
        const checkHasDecisionInArray = newDataOperations.some(
          (operation) => !!operation?.hasDecision
        );

        makeGroupDecision = checkDecisionInUpdate || checkHasDecisionInArray;

        const checkDecisionActionsInUpdate =
          e?.target?.name === "decisionActions" && !!e?.target?.value?.length
            ? e?.target?.value
            : null;

        const checkHasDecisionActionsInArray = newDataOperations.find(
          (operation) =>
            makeGroupDecision && !!operation.decisionActions?.length
        );

        makeGroupDecisionActions =
          (makeGroupDecision && checkDecisionActionsInUpdate) ||
          checkHasDecisionActionsInArray?.decisionActions;

        if (
          (!isGrouped &&
            ([
              "dataMethod",
              "retrievedDataVariableName",
              "aggregationFunction",
            ].includes(e?.target?.name) ||
              [
                "dataMethod",
                "retrievedDataVariableName",
                "aggregationFunction",
              ].includes(ppty))) ||
          (isGrouped &&
            !!Object.keys(e).some((field) =>
              [
                "dataMethod",
                "retrievedDataVariableName",
                "aggregationFunction",
              ].includes(field)
            ))
        ) {
          notAffectVariables = false;
        }

        break;
    }

    _setTaskInfo(
      {
        notAffectVariables,
        dataOperations: newDataOperations,
        hasDecision: makeGroupDecision,
        ...(makeGroupDecisionActions
          ? { decisionActions: makeGroupDecisionActions }
          : {}),
      },
      null,
      true
    );
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

      <Collapse in={!!showSection.action} style={{ padding: 10 }}>
        {(!!activeTask?.properties?.dataOperations?.length
          ? activeTask?.properties?.dataOperations
          : [activeTask?.properties]
        ).map((operation, opIndex, theArray) => (
          <div key={`operation-${opIndex}`}>
            <div
              style={{
                paddingBottom: 5,
                cursor: "pointer",
                borderBottom: "1px #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 10,
                ...(visibleOperation === opIndex
                  ? {
                      borderBottomStyle: "dashed",
                      color: "rgb(36, 87, 193)",
                      fontWeight: 500,
                    }
                  : { borderBottomStyle: "solid" }),
              }}
              onClick={() =>
                setVisibleOperation(visibleOperation === opIndex ? "" : opIndex)
              }
            >
              <div style={{ marginRight: "auto", display: "flex" }}>
                <div
                  contentEditable={editNameIndex === opIndex}
                  autoFocus={editNameIndex === opIndex}
                  onBlur={(e) => {
                    updateOperation(null, opIndex, "update", {
                      target: {
                        name: "dataOperationTitle",
                        value: e.target.innerText,
                      },
                    });
                    setEditNameIndex(-1);
                  }}
                  style={{
                    ...(editNameIndex === opIndex
                      ? {
                          backgroundColor: "#f1f1a5",
                        }
                      : !operationValidStatus[opIndex]
                      ? { color: "red" }
                      : {}),
                  }}
                >
                  {operation?.dataOperationTitle || `Operation #${opIndex + 1}`}
                </div>
                {editNameIndex !== opIndex && (
                  <Edit
                    style={{ fontSize: 14, marginLeft: 8 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditNameIndex(opIndex);
                    }}
                  />
                )}
                {operation?.hasDecision && (
                  <AccountTree
                    style={{ fontSize: 14, marginLeft: 8, color: "green" }}
                  />
                )}
              </div>
              <Tooltip title="Add">
                <AddBox
                  style={{
                    fontSize: 26,
                    cursor: "pointer",
                    color: "#8890a2",
                  }}
                  onClick={(e) => updateOperation(e, opIndex, "add")}
                />
              </Tooltip>

              <Tooltip title="Remove">
                <Delete
                  onClick={(e) => updateOperation(e, opIndex, "delete")}
                  style={{
                    fontSize: 14,
                    margin: 5,
                    cursor: theArray.length > 1 ? "pointer" : "default",
                    color: theArray.length > 1 ? "#965e57" : "#aaaaaa",
                  }}
                />
              </Tooltip>
            </div>
            <Collapse
              in={visibleOperation === opIndex}
              style={{
                borderBottom: "1px solid rgb(204, 204, 204)",
                padding: 5,
                ...(visibleOperation === opIndex ? { marginBottom: 10 } : {}),
              }}
            >
              <div>
                <DataActivitiesModule
                  moduleSource={"dataNode"}
                  data={operation}
                  dataOperationIds={activeTask?.properties?.dataOperations?.map(
                    (op) => op.dataOperationId
                  )}
                  updateData={(...value) =>
                    updateOperation(null, opIndex, "update", ...value)
                  }
                  dataFlow="destination"
                  taskHasDecision={activeTask?.properties?.hasDecision}
                  taskDecisionActions={activeTask?.properties?.decisionActions}
                />
              </div>
            </Collapse>
          </div>
        ))}
      </Collapse>
      <Divider style={{ marginBottom: 100 }} />
    </div>
  );
};

export default connect((state) => {
  return {
    activeTaskId: state.workflows.activeTask?.id,
    activeTaskType: state.workflows.activeTask?.type,
    workflowTasks: state.workflows.workflowTasks,
    workflowCanvas: state.workflows.workflowCanvas,
    allVariables: state.workflows.variables,
    integrations: state.workflows.workflowIntegrations,
  };
})(DataTaskSidebar);
