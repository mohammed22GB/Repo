import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: "flex",
  },
  switchBase: {
    padding: 2,
    color: theme?.palette.grey[500],
    "&$checked": {
      transform: "translateX(16px)",
      color: theme?.palette.common.white,
      "& + $track": {
        opacity: 1,
        backgroundColor: "#11B8A4",
        borderColor: "#11B8A4",
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: "none",
  },
  track: {
    border: `1px solid ${theme?.palette.grey[500]}`,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme?.palette.common.white,
  },
  checked: {},
}));

export default function SimplePaper(props) {
  const classes = useStyles();

  const { toggleHide, toolTipToggle, itemType, value } = props;

  const handleChange = (event) => {
    if (itemType === "togglehide") {
      toggleHide(event.target.checked);
    } else if (itemType === "tooltip") {
      toolTipToggle(event.target.checked);
    }
  };

  return (
    <div>
      <Switch
        focusVisibleClassName={classes.focusVisible}
        disableRipple
        checked={value}
        onChange={handleChange}
        classes={{
          root: classes.root,
          switchBase: classes.switchBase,
          thumb: classes.thumb,
          track: classes.track,
          checked: classes.checked,
        }}
      />
    </div>
  );
}
