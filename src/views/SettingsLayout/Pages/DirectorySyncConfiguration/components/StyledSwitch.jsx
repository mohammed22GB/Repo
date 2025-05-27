import Switch from "@material-ui/core/Switch";
import { withStyles } from "@material-ui/core/styles";

export const StatusSwitchStyles = withStyles({
  root: {
    width: 85,
    height: 42,
    padding: 8,
  },
  switchBase: {
    padding: 11,
    color: "#11B8A4",
    "&:hover": {
      background: "none",
    },
  },
  thumb: {
    width: 18,
    height: 18,
    backgroundColor: "#fff",
  },
  track: {
    background: "linear-gradient(to right, #E3E8EC, #E3E8EC)",
    opacity: "1 !important",
    borderRadius: 20,
    position: "relative",
    "&:before, &:after": {
      display: "inline-block",
      position: "absolute",
      top: "50%",
      width: "50%",
      transform: "translateY(-47%)",
      textAlign: "center",
      fontSize: "12px",
      //fontWeight: "bold",
    },
    "&:before": {
      content: '"Active"',
      left: 8,
      opacity: 0,
      letterSpacing: "0.2px",
      color: "#fff",
    },
    "&:after": {
      content: '"Inactive"',
      right: 11.8,
      color: "#091540",
      letterSpacing: "0.1px",
    },
  },
  checked: {
    "&$switchBase": {
      color: "#11B8A4",
      transform: "translateX(44px)",
      "&:hover": {
        background: "none",
      },
    },
    "& $thumb": {
      backgroundColor: "#fff",
    },
    "& + $track": {
      background: "linear-gradient(to right, #11B8A4, #11B8A4)",
      "&:before": {
        opacity: 1,
      },
      "&:after": {
        opacity: 0,
      },
    },
  },
})(({ classes, ...props }) => {
  return (
    <Switch
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

export const TwoFactor = withStyles({
  root: {
    width: 78,
    height: 39,
    padding: 8,
  },
  switchBase: {
    padding: 11,
    color: "#11B8A4",
    "&:hover": {
      background: "none",
    },
  },
  thumb: {
    width: 18,
    height: 18,
    backgroundColor: "#fff",
  },
  track: {
    background: "linear-gradient(to right, #E3E8EC, #E3E8EC)",
    opacity: "1 !important",
    borderRadius: 20,
    position: "relative",
    "&:before, &:after": {
      display: "inline-block",
      position: "absolute",
      top: "50%",
      width: "50%",
      transform: "translateY(-50%)",
      textAlign: "center",
      fontSize: "12px",
      //fontWeight: "bold",
    },
    "&:before": {
      content: '"ON"',
      left: 8,
      opacity: 0,
      letterSpacing: "0.2px",
      color: "#fff",
    },
    "&:after": {
      content: '"OFF"',
      right: 6,
      color: "#091540",
      letterSpacing: "0.1px",
    },
  },
  checked: {
    "&$switchBase": {
      color: "#11B8A4",
      transform: "translateX(39px)",
      "&:hover": {
        background: "none",
      },
    },
    "& $thumb": {
      backgroundColor: "#fff",
    },
    "& + $track": {
      background: "linear-gradient(to right, #11B8A4, #11B8A4)",
      "&:before": {
        opacity: 1,
      },
      "&:after": {
        opacity: 0,
      },
    },
  },
})(({ classes, ...props }) => {
  return (
    <Switch
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});
