import React, { memo } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Handle } from "react-flow-renderer";
import { Tooltip } from "@mui/material";
import { toolTipTitleReference } from "../../../../../common/helpers/helperFunctions";

export const TerminalNode = (props) => {
  const { id, type, selected, data, isConnectable } = props;

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
      border: "solid 4px #c2cdd3",
    },
  }));
  const classes = useStyles();

  // alert(props.selected)

  return (
    <Tooltip title={toolTipTitleReference(type)} placement="right">
      <div className={classes.terminalNode}>
        <div>
          {type === "StartTask" ? "START" : ""}
          {type === "EndTask" ? "END" : ""}
        </div>

        {type === "StartTask" && (
          <Handle
            type="source"
            position="bottom"
            className={classes.handle}
            style={{ bottom: -8, background: "#0b9ed6" }}
            onConnect={(params) => params}
            isConnectable={isConnectable}
          />
        )}
        {type === "EndTask" && (
          <Handle
            type="target"
            position="top"
            style={{ top: -8 }}
            className={classes.handle}
            onConnect={(params) => params}
            isConnectable={isConnectable}
          />
        )}
      </div>
    </Tooltip>
  );
};
