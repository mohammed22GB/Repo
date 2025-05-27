import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import { APP_DESIGN_MODES } from "../../../../../../common/utils/constants";

export default function DiscreteSlider({ style, values, ...props }) {
  const sliderStyle = makeStyles((theme) => style);
  const classes = sliderStyle();
  function valueText(value) {
    return (
      <span style={{ width: 10, backgroundColor: "red" }}>{`${value}°C`}</span>
    );
  }
  return (
    <>
      <div className={`${classes?.container} ${classes?.dimensions}`}>
        {!values?.labelHide && (
          <Typography
            className={classes?.label}
            id="discrete-slider-custom"
            gutterBottom
          >
            {values?.label}
          </Typography>
        )}
        <Slider
          orientation={values?.orientation}
          getAriaValueText={valueText}
          aria-labelledby="discrete-slider-custom"
          step={values?.step}
          disabled={props.appDesignMode === APP_DESIGN_MODES.EDIT}
          valueLabelDisplay="auto"
          marks={props.data}
          min={values?.min}
          max={values?.max}
        />
      </div>
    </>
  );
}
