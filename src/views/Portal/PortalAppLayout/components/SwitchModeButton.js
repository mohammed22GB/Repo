import { Link } from "react-router-dom";
import { Button, Tooltip } from "@material-ui/core";
import SwitchModeBrush from "./SwitchModeBrush";
import usePortalStyles from "./portalstyles";

export const SwitchModeButton = ({ text, icon, switchLink, tooltip }) => {
  const classes = usePortalStyles();

  return (
    <Tooltip title={tooltip} placement="bottom-end">
      <Link to={switchLink}>
        <Button
          variant="contained"
          className={classes.switchModeButton}
          disableElevation
          endIcon={icon ?? <SwitchModeBrush />}
        >
          {text ?? "Switch Mode"}
        </Button>
      </Link>
    </Tooltip>
  );
};
