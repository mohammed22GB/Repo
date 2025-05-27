import React from "react";
import { makeStyles } from "@material-ui/core";
import { APP_DESIGN_MODES } from "../../../../../../common/utils/constants";
import { getDynamicImageSrc } from "../../../../../../common/utils/dynamicContentReplace";

const Image = ({
  onClick,
  style,
  values,
  dynamicData,
  screenId,
  appDesignMode,
  name,
}) => {
  const imageStyles = makeStyles((theme) => style);
  const classes = imageStyles();
  const dynamicContentObj = dynamicData?.[screenId];

  return (
    <div
      onClick={onClick}
      className={`${classes?.container}`}
      style={{ textAlign: values?.textAlign }}
    >
      <img
        className={classes?.imageIcon}
        alt="player-play-circle"
        src={
          appDesignMode === APP_DESIGN_MODES.LIVE
            ? getDynamicImageSrc(dynamicContentObj, name, values)
            : values?.src || `/images/image-component.png`
        }
        style={{ width: `${values?.width}${values?.unit}` }}
      />
    </div>
  );
};

export default Image;
