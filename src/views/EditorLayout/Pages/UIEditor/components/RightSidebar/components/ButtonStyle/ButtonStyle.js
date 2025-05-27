import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { InputBase, Grid } from "@material-ui/core";

import Selector from "../Selector";
import ColorPicker from "../../../../../../../common/components/ColorPicker";

const InputText = withStyles((theme) => ({
  input: {
    color: "#091540",
    borderRadius: 3,
    position: "relative",
    border: "1px solid #ABB3BF",
    fontSize: 10,
    // paddingLeft: 3,
    transition: theme?.transitions.create(["border-color", "box-shadow"]),
  },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
  sectionLabel: {
    color: "#999",
    fontSize: 10,
    marginRight: 5,
    marginTop: 5,
  },

  input: {
    color: "#091540",
    fontSize: 10,
  },
  center: {
    textAlign: "center",
  },
  inline: {
    display: "inline-flex",
  },
}));

const layout = [
  ["fill", "Filled"],
  ["outline", "Outlined"],
];

function ButtonStyle(props) {
  const classes = useStyles();

  const { dimensions, onChange, buttonStyle } = props;
  return (
    <div>
      <Grid container spacing={1}>
        <Grid item xs={3} className={classes.inline}>
          <Typography gutterBottom className={classes.sectionLabel}>
            W
          </Typography>
          <InputText
            variant="outlined"
            size="small"
            onChange={(e) => onChange(e.target.value, "width", "dimensions")}
            value={dimensions?.width}
            inputProps={{
              min: 0,
              style: { textAlign: "center" },
              className: classes.input,
            }}
          />
        </Grid>
        <Grid item xs={3} className={classes.inline}>
          <Typography gutterBottom className={classes.sectionLabel}>
            H
          </Typography>
          <InputText
            variant="outlined"
            size="small"
            onChange={(e) => onChange(e.target.value, "height", "dimensions")}
            value={dimensions?.height}
            inputProps={{
              min: 0,
              style: { textAlign: "center" },
              className: classes.input,
            }}
          />
        </Grid>
        <Grid item xs={6} className={classes.inline}>
          <Selector
            items={layout}
            key="layout"
            itemType={"layout"}
            // selectorCall={addFileUploadLayoutProp}
          />
        </Grid>
      </Grid>

      <div className={classes.inline} style={{ marginTop: 10 }}>
        <Typography gutterBottom className={classes.sectionLabel}>
          Border Radius
        </Typography>
        <InputText
          variant="outlined"
          size="small"
          placeholder="12"
          onChange={(e) => onChange(e.target.value, "borderRadius", "button")}
          value={buttonStyle?.borderRadius}
          defaultValue={12}
          style={{ width: "20%", marginRight: 10 }}
          inputProps={{
            min: 0,
            style: { textAlign: "center" },
            className: classes.input,
          }}
        />
        <div style={{ marginTop: 4 }}>
          <ColorPicker
            color={buttonStyle?.background}
            identity="backgroundColor"
            colorCallback={(value) => onChange(value, "background", "button")}
          />
        </div>
      </div>
    </div>
  );
}

export default ButtonStyle;
