import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { clearActiveTask } from "../utils/workflowHelpers";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme?.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme?.shadows[5],
    padding: theme?.spacing(2, 4, 3),
  },
}));

const MyBackDrop = ({ showBackDrop, setShowBackDrop, clickToHideBackdrop }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const _handleClick = () => {
    if (clickToHideBackdrop) {
      setShowBackDrop(false);
      dispatch(clearActiveTask());
    }
  };

  return showBackDrop ? (
    <div
      onClick={_handleClick}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 5,
      }}
    ></div>
  ) : null;
};

export default MyBackDrop;
