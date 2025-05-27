import { Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { APP_DESIGN_MODES } from "../../../../../../common/utils/constants";

export default function ButtonComponent({ style, values, action, ...props }) {
  const useStyles = makeStyles((theme) => style);
  const classes = useStyles();

  if (props.disabled) return null;
  // This is a hack to hide submit buttons on form during approvals
  return (
    <>
      <Typography className={classes?.label}>{values.label}</Typography>
      <Button
        disabled={props.appDesignMode === APP_DESIGN_MODES.EDIT}
        className={`${classes?.button} ${classes?.dimensions}`}
        onClick={action}
      >
        {values.buttonText}
      </Button>
    </>
  );
}
