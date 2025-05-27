import React from "react";
import { makeStyles, Typography } from "@material-ui/core";

const Video = ({ onClick, style, values }) => {
  const videoStyles = makeStyles((theme) => style);
  const classes = videoStyles();
  return (
    <React.Fragment>
      {!values?.labelHide && (
        <Typography gutterBottom className={classes?.label}>
          {values?.label}
        </Typography>
      )}
      <div
        onClick={onClick}
        className={`${classes?.container} ${classes?.dimensions}`}
      >
        <img
          className={classes?.imageIcon}
          alt="player-play-circle"
          src="/images/player-play-circle.png"
        />
      </div>
    </React.Fragment>
  );
};

export default Video;
