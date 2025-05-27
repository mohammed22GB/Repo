import React from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Handle } from "react-flow-renderer";
import { Node } from "./Node";

export const DefaultNode = (props) => {
  const { id, isConnectable } = props;
  const { workflowTasks: activeTasks, workflowCanvas } = useSelector(
    ({ workflows }) => workflows
  );

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
  }));
  const classes = useStyles();

  return (
    <Node {...props}>
      <Handle
        type="source"
        position="bottom"
        className={classes.handle}
        style={{ bottom: -8, background: "#0b9ed6" }}
        // onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
        // isValidConnection={args => { args.workflowCanvas = workflowCanvas; return isValidConnection(args)}}
      />
      <Handle
        type="target"
        position="top"
        style={{ top: -8 }}
        className={classes.handle}
        // onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      />
    </Node>
  );
};

// export default memo(DefaultNode);
