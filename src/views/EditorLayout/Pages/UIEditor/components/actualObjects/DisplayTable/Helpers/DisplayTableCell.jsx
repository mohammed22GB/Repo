import React, { useEffect } from "react";
import { InputBase, makeStyles } from "@material-ui/core";
import { APP_DESIGN_MODES } from "../../../../../../../common/utils/constants";

const DisplayTableCell = ({
  row,
  col,
  rowIndex,
  handleDataUpdate,
  appDesignMode,
  isDynamic,
}) => {
  const useStyles = makeStyles((theme) => ({
    inputBase: {
      width: "100%",
      "&.Mui-disabled ": {
        filter: "none !important",
        background: "none !important",
        opacity: "1 !important",
      },
      "&>input ": {
        filter: "none !important",
        background: "none !important",
        opacity: "1 !important",
      },
    },
  }));
  const classes = useStyles();

  return (
    <InputBase
      disabled={appDesignMode !== APP_DESIGN_MODES.EDIT}
      value={
        appDesignMode !== APP_DESIGN_MODES.EDIT || !isDynamic ? row[col.id] : ""
      }
      className={classes.inputBase}
      onChange={(e) => handleDataUpdate(e, rowIndex, col.id)}
      readOnly={isDynamic}
      classes={{
        root: classes.inputBase,
      }}
    />
  );
};

export default DisplayTableCell;
