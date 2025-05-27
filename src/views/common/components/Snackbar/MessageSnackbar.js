import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "./Alert";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme?.spacing(2),
    },
  },
}));

export default function MessageSnackbar(props) {
  const classes = useStyles();
  const message = props.message;
  const severity = props.severity;
  const open = props.open;
  const close = props.close;

  return (
    <div className={classes.root}>
      <Snackbar autoHideDuration={6000} onClose={close} open={open}>
        <Alert onClose={close} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
