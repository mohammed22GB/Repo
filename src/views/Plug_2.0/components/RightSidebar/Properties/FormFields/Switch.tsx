import React from "react";
import { makeStyles } from "@material-ui/core/styles";
// import TextField from '@material-ui/core/TextField';
import Switch from "@material-ui/core/Switch";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 36,
    height: 20,
    padding: 0,
    // margin: theme?.spacing(1),
  },
  switchBase: {
    padding: 1,
    "&$checked": {
      transform: "translateX(16px)",
      color: theme?.palette.common.white,
      "& + $track": {
        backgroundColor: "#292929",
        opacity: 1,
        border: "none",
      },
    },
    "&$focusVisible $thumb": {
      color: "#52d869",
      border: "6px solid #fff",
    },
  },
  thumb: {
    width: 18,
    height: 18,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme?.palette.grey[400]}`,
    backgroundColor: theme?.palette.grey[50],
    opacity: 1,
    transition: theme?.transitions.create(["background-color", "border"]),
    height: "auto",
  },
  checked: {},
  focusVisible: {},
}));

export default function CustomSwitch(props: any) {
  const classes = useStyles();

  const {
    id, //  added to update state
    toggleHide,
    toolTipToggle,
    itemType,
    value,
    defaultValue,
    onChange,
    name,
  } = props;

  const handleChange = (event: any) => {
    if (onChange) {
      onChange(event);
      return;
    }

    if (itemType === "togglehide") {
      toggleHide(event.target.checked);
    } else if (itemType === "tooltip") {
      toolTipToggle(event.target.checked);
    }
  };

  return (
    <>
      <Switch
        focusVisibleClassName={classes.focusVisible}
        disableRipple
        disabled={props.disabled}
        defaultChecked={defaultValue}
        checked={value}
        onChange={handleChange}
        key={name}
        classes={{
          root: classes.root,
          switchBase: classes.switchBase,
          thumb: classes.thumb,
          track: classes.track,
          checked: classes.checked,
        }}
      />
    </>
  );
}
