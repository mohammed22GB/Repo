import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import WarningRoundedIcon from "@material-ui/icons/WarningRounded";
import { CancelRounded } from "@material-ui/icons";

import { rRemoteUpdateCanvasElements } from "../../../../../../store/actions/properties";
import * as taskTypes from "../utils/taskTypes";
import CustomConfirmBox from "../../../../../common/components/CustomConfirmBox/CustomConfirmBox";
import NodeIcons from "../NodeIcons";

export const Node = (props) => {
  const { id, type, selected, data, children } = props;
  const dispatch = useDispatch();
  const {
    workflowTasks: activeTasks,
    workflowCanvas,
    activeTask,
  } = useSelector(({ workflows }) => workflows);
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
  const taskOnCanvas = workflowCanvas.find((c) => c.id === id);

  const label =
    activeTasks?.[id]?.name ||
    taskOnCanvas?.name ||
    data.label ||
    "[Not configured]";

  const subLabel =
    type === taskTypes.WORKFLOWS_TASK_SCREEN
      ? `Screen (${
          activeTasks[id]?.properties?.screenType ||
          taskOnCanvas?.screenType ||
          "?"
        })`
      : type?.replace("Task", "");

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
        !!activeTasks?.[id]?.configured ||
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
        !!activeTasks?.[id]?.configured ||
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
      color: "#546e7a",
      fontSize: 12,
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
      "& > div:first-of-type": {
        lineHeight: 1.1,
      },
    },
    otherNodesInnerType: {
      fontStyle: "italic",
      opacity: 0.6,
    },
    reuseableScreenIndicator: {
      position: "absolute",
      backgroundColor: "#4b4bf1",
      color: "#ffffff",
      fontSize: 10,
      width: 18,
      borderRadius: 3,
      top: 11,
      left: -5,
    },
  }));
  const classes = useStyles();

  const [validatedLinks, setValidatedLinks] = useState(false);

  useEffect(() => {
    const validateLinking = () => {
      const chkIn = workflowCanvas?.find((c) => c?.source === id);
      const chkOut = workflowCanvas?.find((c) => c?.target === id);

      setValidatedLinks(!!chkIn && !!chkOut);
    };

    validateLinking();
  }, [workflowCanvas]);

  const getNodesBreakdown = () => {
    const exitingNodes = [],
      remainingNodes = [];

    workflowCanvas.forEach((node) => {
      if ([node.id, node.source, node.target].includes(id)) {
        exitingNodes.push(node);
      } else {
        remainingNodes.push(node);
      }
    });

    return { exitingNodes, remainingNodes };
  };

  const deleteThisNode = async () => {
    const { exitingNodes, remainingNodes } = getNodesBreakdown();

    dispatch(rRemoteUpdateCanvasElements(exitingNodes));
  };

  return (
    <>
      <div
        className={selected ? classes.defaultNodesActive : classes.defaultNodes}
      >
        <div style={{ width: "100%" }}>
          <div className={classes.otherNodesInner}>
            {/* <div className={classes.reuseableScreenIndicator}>RE</div> */}
            <NodeIcons nodeType={type} />
            <div className={classes.otherNodesInnerRight}>
              <div>{label}</div>
              <div className={classes.otherNodesInnerType}>{subLabel}</div>
            </div>

            <Tooltip title="Delete node">
              <CancelRounded
                style={{
                  position: "absolute",
                  top: -5,
                  right: -23, //-20,
                  // color: "#ffbc00",
                  fontSize: 20,
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setShowDeleteConfirmDialog(e);
                }}
              />
            </Tooltip>

            {!validatedLinks && (
              <Tooltip title="Node not properly connected">
                <WarningRoundedIcon
                  style={{
                    position: "absolute",
                    // top: -8,
                    bottom: -1,
                    right: -26, //-20,
                    color: "#ffbc00",
                    fontSize: 26,
                  }}
                />
              </Tooltip>
            )}
          </div>
        </div>

        {children}
      </div>
      {showDeleteConfirmDialog && (
        <CustomConfirmBox
          closeConfirmBox={() => {
            setShowDeleteConfirmDialog(false);
            // dispatch(clearActiveTask());
          }}
          text={`Delete this ${type} node? This action cannot be undone.`}
          open={showDeleteConfirmDialog}
          activateActionBtn={id === activeTask?.id}
          confirmAction={deleteThisNode}
        />
      )}
    </>
  );
};

// export default memo(Node);
