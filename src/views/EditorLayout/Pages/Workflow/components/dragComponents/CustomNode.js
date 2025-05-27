import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Handle } from "react-flow-renderer";
import { makeStyles } from "@material-ui/core/styles";
import { Node } from "./Node";
import * as taskTypes from "../utils/taskTypes";
import { updateWorkflowCanvas } from "../../utils/workflowHelpers";

export const CustomNode = (props) => {
  const { id, type, isConnectable } = props;
  const dispatch = useDispatch();
  const {
    workflowTasks,
    workflowCanvas,
    activeTask: { id: activeTaskId },
  } = useSelector(({ workflows }) => workflows);

  const getAlternateLabel = (sourceHandle) => {
    const actions =
      workflowTasks?.[id]?.properties?.approvalActions ||
      workflowTasks?.[id]?.properties?.decisionActions ||
      [];

    const label = actions.find(
      (action) => action.sourceHandle === sourceHandle
    )?.label;
    return label;
  };

  const updateBranches = async (isDown, isSides) => {
    isProcessing = true;
    const movedB = {};
    const linksToRemove = [];
    let linkToAdd;

    const newWorkflowCanvas = [...(workflowCanvas || [])]
      .map((element) => {
        if (element.source === activeTaskId) {
          if (!movedB.hasOwnProperty(id)) movedB[id] = false;

          if (isDown && !isSides) {
            if (movedB[id]) {
              linksToRemove.push(element);
              element = "";
            } else if (element.sourceHandle === "b") {
              linksToRemove.push(element);
              element.sourceHandle = "d";
              element.label = "";
              element.id = `reactflow__edge-${element.source}${element.sourceHandle}-${element.target}${element.targetHandle}`;
              linkToAdd = { ...element };
              movedB[id] = true;
            } else if (element.sourceHandle === "c") {
              linksToRemove.push(element);
              element.sourceHandle = "d";
              element.label = "";
              element.id = `reactflow__edge-${element.source}${element.sourceHandle}-${element.target}${element.targetHandle}`;
              linkToAdd = { ...element };
            }
          }

          if (isSides && !isDown) {
            if (element.sourceHandle === "d") {
              linksToRemove.push(element);
              element.sourceHandle = "b";
              element.label =
                element.label || getAlternateLabel(element.sourceHandle);
              element.id = `reactflow__edge-${element.source}${element.sourceHandle}-${element.target}${element.targetHandle}`;
              linkToAdd = { ...element };
            }
          }
        }

        return element;
      })
      .filter((element) => !!element);

    if (linksToRemove.length) {
      await dispatch(updateWorkflowCanvas(linksToRemove, "del"));
    }

    if (linkToAdd) {
      await dispatch(updateWorkflowCanvas(linkToAdd, "connect"));
    }
    isProcessing = false;
  };

  const getDownAndSides = (hasDecision, shouldUpdateBranch = true) => {
    const isApproval = type === taskTypes.WORKFLOWS_TASK_APPROVAL;
    const isComputation = type === taskTypes.WORKFLOWS_TASK_COMPUTATION;
    const isData = type === taskTypes.WORKFLOWS_TASK_DATA;

    const isDown = isApproval || (!hasDecision && (isComputation || isData));
    const isSides = isApproval || (!!hasDecision && (isComputation || isData));

    shouldUpdateBranch && updateBranches(isDown, isSides);

    return { isDown, isSides };
  };

  const taskOnCanvas = workflowCanvas.find((c) => c.id === id);
  const initDownAndSides = getDownAndSides(taskOnCanvas?.hasDecision, false);

  const [showDown, setShowDown] = useState(initDownAndSides.isDown);
  const [showSides, setShowSides] = useState(initDownAndSides.isSides);

  const useStyles = makeStyles((theme) => ({
    terminalNode: {
      // position: "absolute",
      width: 150,
      height: 45,
      padding: 10,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#c2cdd3",
      // color: "white",
      borderRadius: 45,
      textAlign: "center",
      color: "#2a3a41",
    },
    handle: {
      // position: "absolute",
      background: "#555",
      width: 16,
      height: 16,
      border: "solid 4px #fff",
    },
    defaultNodes: {
      // position: "absolute",
      border:
        !!workflowTasks?.[id]?.configured ||
        workflowCanvas.find((c) => c.id === id)?.configured
          ? "solid 1px #CCC"
          : "solid red",
      width: 220,
      height: 60,
      padding: 10,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#fff",
      borderRadius: 5,
      textAlign: "center",
      fontSize: 12,
      color: "#546e7a",
    },
    defaultNodesActive: {
      // position: "absolute",
      border:
        !!workflowTasks?.[id]?.configured ||
        workflowCanvas.find((c) => c.id === id)?.configured
          ? "solid 1px #CCC"
          : "solid #d69b9b",
      width: 220,
      height: 60,
      padding: 10,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#fff",
      borderRadius: 5,
      textAlign: "center",
      fontSize: 12,
      color: "#546e7a",
      transition: "0.3s ease box-shadow,0.3s ease margin-top",
      boxShadow: "0 10px 20px rgb(0 0 0 / 10%)",
      marginTop: -2,
    },
    otherNodesInner: {
      position: "relative",
      display: "flex",
      padding: "15px 0",
      alignItems: "center",
    },
    otherNodesInnerRight: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      marginLeft: 5,
      textAlign: "left",
      maxHeight: 53,
      overflow: "hidden",
    },
    otherNodesInnerType: {
      fontStyle: "italic",
      opacity: 0.6,
    },
  }));
  const classes = useStyles();

  let isProcessing = false;

  useEffect(() => {
    if (activeTaskId !== id) return;
    if (isProcessing) return;

    const nodePositions = getDownAndSides(taskOnCanvas?.hasDecision);

    setShowDown(nodePositions.isDown);
    setShowSides(nodePositions.isSides);
  }, [taskOnCanvas]);

  useEffect(() => {
    if (!workflowTasks[id]) return;
    if (activeTaskId !== id) return;
    if (isProcessing) return;

    const nodePositions = getDownAndSides(
      workflowTasks[id]?.properties?.hasDecision
    );

    setShowDown(nodePositions.isDown);
    setShowSides(nodePositions.isSides);
  }, [workflowTasks]);

  return (
    <Node {...props}>
      <Handle
        id="a"
        type="target"
        position="top"
        className={classes.handle}
        style={{ top: -8 }}
        // onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      />
      {showSides && (
        <Handle
          id="b"
          type="source"
          position="left"
          className={classes.handle}
          style={{ left: -8, background: "#3dd60b" }}
          isConnectable={isConnectable}
        />
      )}
      {showSides && (
        <Handle
          id="c"
          type="source"
          position="right"
          className={classes.handle}
          style={{ right: -8, background: "#9b0bd6" }}
          isConnectable={isConnectable}
        />
      )}
      {showDown && (
        <Handle
          id="d"
          type="source"
          position="bottom"
          className={classes.handle}
          style={{ bottom: -8, background: "#0b9ed6" }}
          isConnectable={isConnectable}
        />
      )}
    </Node>
  );
};
