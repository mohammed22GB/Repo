import React from "react";
import { Switch, makeStyles, Typography } from "@material-ui/core";
import { APP_DESIGN_MODES } from "../../../../../../common/utils/constants";

const ToggleButton = ({ style, values, ...props }) => {
  const toggleStyle = makeStyles((theme) => style);
  const classes = toggleStyle();
  return (
    <div className={`${classes?.container} ${classes?.dimensions}`}>
      {!values?.labelHide && (
        <Typography gutterBottom className={classes?.label}>
          {values?.label}
        </Typography>
      )}

      <Switch
        classes={{
          track: classes?.switch_track,
          switchBase: classes?.switch_base,
        }}
        checked={values?.checked}
        onChange={props.onChange}
        className={classes?.toggle}
        disabled={props.appDesignMode === APP_DESIGN_MODES.EDIT}
        name="checkedA"
        inputProps={{ "aria-label": "secondary checkbox" }}
      />
    </div>
  );
};

export default ToggleButton;
