import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme?.spacing(2),
    },
  },

  alertBox: {
    color: "#999",
    border: "0.5px solid #D00026",
    borderRadius: 1,
    boxShadow: " 0px 0px 10px rgba(0, 0, 0, 0.07)",
  },
}));

export default function SignupAlert(props) {
  const classes = useStyles();
  // const [open, setOpen] = React.useState(false);

  const message = props.message;
  // const severity = props.severity;
  const open = props.open;
  const close = props.close;

  return (
    <div className={classes.root}>
      <Collapse in={open}>
        <Alert
          variant="outlined"
          icon={false}
          className={classes.alertBox}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                close();
              }}
            >
              <HighlightOffIcon fontSize="inherit" style={{ color: "#000" }} />
            </IconButton>
          }
        >
          {message}
        </Alert>
      </Collapse>
    </div>
  );
}
