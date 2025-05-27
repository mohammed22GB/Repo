import React from "react";
import { makeStyles } from "@material-ui/core";

const PageBreak = ({ style, values }) => {
  const pageBreakStyles = makeStyles((theme) => ({
    ...style,
    separator: {
      display: "flex",
      alignItems: "center",
      textAlign: "center",
      fontWeight: "normal",
      fontSize: "12px",
      color: "#000",
      "&::before": {
        content: '""',
        flex: 1,
        borderBottom: "1px solid #000",
      },
      "&::after": {
        content: '""',
        flex: 1,
        borderBottom: "1px solid #000",
      },
      "&:not(:empty)::before": {
        marginRight: "1em",
      },
      "&:not(:empty)::after": {
        marginLeft: "1em",
      },
    },
    separator1: {
      width: 345,
      margin: "10px 0",
      display: "flex",
      alignItems: "center",
      textAlign: "center",
      whiteSpace: "nowrap",
      "&::before": {
        content: '""',
        flex: 1,
        borderBottom: "solid 1px #000",
        fontWeight: 100,
        marginTop: -17,
        margin: "-17px 10px 0",
        color: "transparent",
      },
      "&::after": {
        content: '""',
        flex: 1,
        borderBottom: "solid 1px #000",
        fontWeight: 100,
        marginTop: -17,
        margin: "-17px 10px 0",
        color: "transparent",
      },
    },
  }));

  const classes = pageBreakStyles();
  return (
    <div
      className={`${classes?.separator} ${classes?.dimensions}`}
      style={{ ...style?.label }}
    >
      {values?.value}
    </div>
  );
};

export default PageBreak;
