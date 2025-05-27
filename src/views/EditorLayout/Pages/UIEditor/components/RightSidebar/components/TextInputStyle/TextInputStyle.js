import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Grid, Typography } from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase";
import ColorPicker from "../../../../../../../common/components/ColorPicker";

const InputText = withStyles((theme) => ({
  input: {
    color: "#091540",
    borderRadius: 3,
    position: "relative",
    border: "1px solid #ABB3BF",
    fontSize: 11,
    padding: "5px 12px",
    transition: theme?.transitions.create(["border-color", "box-shadow"]),
  },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
  root: {},

  sectionTitle: {
    color: "#999",
    fontSize: 12,
  },
  sectionLabel: {
    color: "#999",
    fontSize: 10,
    marginRight: 18,
    marginTop: 5,
  },
  fullWidthText: {
    marginBottom: 10,
  },
  input: {
    color: "#091540",
    fontSize: 10,
  },
  center: {
    textAlign: "center",
  },
}));

export default function SimplePaper(props) {
  const classes = useStyles();

  const {
    onWidthChange,
    onHeightChange,
    onBorderRadiusChange,
    style,
    onBorderRadiusColorChange,
    onBorderBackgroundColorChange,
    dimensions,
  } = props;

  return (
    <div>
      <Typography gutterBottom className={classes.sectionTitle}>
        Style
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <div style={{ display: "inline-flex" }}>
            <Typography gutterBottom className={classes.sectionLabel}>
              W
            </Typography>
            <InputText
              variant="outlined"
              size="small"
              placeholder="100%"
              onChange={(e) => onWidthChange(e.target.value)}
              value={dimensions?.width}
              style={{ width: "60%" }}
              inputProps={{
                min: 0,
                style: { textAlign: "center" },
                className: classes.input,
              }}
            />
          </div>
        </Grid>
        {/* <Grid item xs={4} style={{ display: "inline-flex" }}>
            <Typography gutterBottom className={classes.sectionLabel}>
              H
            </Typography>
            <InputText
              variant="outlined"
              size="small"
              placeholder="100%"
              onChange={(e) => onHeightChange(e.target.value)}
              value={dimensions?.height}
              style={{ width: "60%" }}
              inputProps={{
                min: 0,
                style: { textAlign: "center" },
                className: classes.input,
              }}
            />
          </Grid> */}
      </Grid>

      <Grid container spacing={1}>
        <Grid item xs={6}>
          <div style={{ display: "inline-flex" }}>
            <Typography gutterBottom className={classes.sectionLabel}>
              Radius
            </Typography>
            <InputText
              variant="outlined"
              size="small"
              onChange={(e) => onBorderRadiusChange(e.target.value)}
              value={style?.borderRadius}
              // placeholder="1"
              // defaultValue={1}
              style={{ width: "100%" }}
              inputProps={{
                min: 0,
                style: { textAlign: "center" },
                className: classes.input,
              }}
            />
          </div>
        </Grid>
        <Grid item xs={6} style={{ display: "inline-flex" }}>
          <Typography gutterBottom className={classes.sectionLabel}>
            Border
          </Typography>
          <ColorPicker
            color={style?.borderColor}
            identity="borderColor"
            colorCallback={onBorderRadiusColorChange}
          />
        </Grid>
      </Grid>

      <div style={{ display: "inline-flex", marginTop: 5 }}>
        <Typography gutterBottom className={classes.sectionLabel}>
          Background color
        </Typography>
        <ColorPicker
          color={style?.backgroundColor}
          identity="backgroundColor"
          colorCallback={onBorderBackgroundColorChange}
        />
      </div>
    </div>
  );
}
