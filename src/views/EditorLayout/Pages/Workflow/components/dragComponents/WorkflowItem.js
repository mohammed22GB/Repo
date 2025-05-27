import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Tooltip } from "@mui/material";
import { toolTipTitleReference } from "../../../../../common/helpers/helperFunctions";

export const WorkflowItem = ({ type, ports, properties, icon, orient }) => {
  const useStyles = makeStyles((theme) => ({
    workflowToolbarItemWrapper: {
      display: "flex",
      flexDirection: "column",
      // marginRight: 20,
      textAlign: "center",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 10,
      minWidth: 65,
      height: 50,
      borderRadius: 5,
      paddingLeft: 3,
      paddingRight: 3,
      boxShadow: "0 0 3px #ccc",
      opacity: 0.75,
      "&:hover": {
        opacity: 1,
        cursor: "pointer",
        boxShadow: "0 0 7px #ccc",
      },
      // "&:last-of-type": {
      //   marginRight: 0,
      // },
    },
    workflowToolbarItem: {
      fontSize: 27,
      display: "block",
    },
  }));
  const classes = useStyles();

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <Tooltip title={toolTipTitleReference(orient)}>
      <div
        className={`dndnode ${orient} ${classes.workflowToolbarItemWrapper}`}
        /* style={{
        display: "flex",
        flexDirection: "column",
        margin: "0px 15px",
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.8em",
        width: 50,
        height: 50,
        borderRadius: 5,
        boxShadow: "0 0 3px #ccc",
        opacity: 0.65,
        "&:hover": {
          opacity: 1,
          cursor: "pointer",
        }
      }} */
        draggable={true}
        onDragStart={(event) => onDragStart(event, orient)}
      >
        {icon}
        {type}
      </div>
    </Tooltip>
  );
};

// export default WorkflowItem;
