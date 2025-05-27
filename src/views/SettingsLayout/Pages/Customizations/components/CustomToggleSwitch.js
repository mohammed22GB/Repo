import Switch from "@material-ui/core/Switch";
import { withStyles } from "@material-ui/core/styles";

const CustomToggleSwitch = withStyles((theme) => ({
  root: {
    width: 45,
    height: 20,
    padding: 0,
    display: "flex",
    marginLeft: 20,
  },
  switchBase: {
    padding: 2,
    // color: theme?.palette.grey[500],
    color: "#FFFFFF",
    "&$checked": {
      transform: "translateX(23px)",
      color: theme?.palette.common.white,
      "& + $track": {
        opacity: 1,
        // backgroundColor: theme?.palette.primary.main,
        backgroundColor: "#29CF44",
        // borderColor: theme?.palette.primary.main,
      },
    },
  },
  thumb: {
    width: 16,
    height: 16,
    boxShadow: "none",
  },
  track: {
    // border: `1px solid ${theme?.palette.grey[500]}`,
    borderRadius: 10,
    opacity: 1,
    // backgroundColor: theme?.palette.common.white,
    backgroundColor: "#E6E6E6",
  },
  checked: {},
}))(Switch);

export default CustomToggleSwitch;
