import React from "react";
import { createStyles, makeStyles, Typography } from "@material-ui/core";

interface Props {}

const useStyles = makeStyles(() =>
  createStyles({
    formWrapper: {
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      position: "relative",
      zIndex: 2,
      background: "#ffffff",
      height: "100%",
      overflow: "auto",
      padding: 16,
      marginBottom: 10,
    },
    formBody: {
      border: "1px dashed #292929",
      padding: 8,
      background: "#FFFFFF",
      borderRadius: 4,
      height: "100%",
    },
    formPlaceholder: {
      border: "1px dashed #ABABAB",
      padding: 32,
      borderRadius: 2,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  })
);

const Forms = (props: Props) => {
  const classes = useStyles();
  return (
    <>
      <Typography gutterBottom>Untitled Form</Typography>
      <div className={classes.formWrapper}>
        <div className={classes.formBody}>
          <div className={classes.formPlaceholder}>
            <p> Drag item here</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Forms;
