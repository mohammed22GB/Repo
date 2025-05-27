import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { InputBase } from "@material-ui/core";

import Selector from "../Selector";
import ColorPicker from "../../../../../../../common/components/ColorPicker";

const InputText = withStyles((theme) => ({
  input: {
    color: "#091540",
    borderRadius: 3,
    position: "relative",
    border: "1px solid #ABB3BF",
    fontSize: 10,
    paddingLeft: 3,
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

  inline: {
    display: "inline-flex",
  },
}));

const labelSize = [
  ["12", "12"],
  ["14", "14"],
  ["16", "16"],
];

const labelWeight = [
  ["light", "Light"],
  ["regular", "Regular"],
  ["bold", "Bold"],
];

const labelAlignment = [
  ["left", "Left"],
  ["center", "Center"],
  ["right", "Right"],
  ["justify", "Justify"],
];

function ButtonText({ buttonStyle, values, onChange }) {
  const classes = useStyles();
  //const colorCall = props.colorCallback;

  return (
    <div>
      <div className={classes.inline}>
        <Typography gutterBottom className={classes.sectionLabel}>
          Text
        </Typography>

        <InputText
          variant="outlined"
          size="small"
          onChange={(e) => onChange(e.target.value, "buttonText", "values")}
          value={values?.buttonText}
        />
      </div>

      <div className={classes.inline} style={{ marginTop: 10 }}>
        <Selector
          items={labelSize}
          key="labelSize"
          itemType={"labelSize"}
          selectedSize={(e) => onChange(e, "fontSize", "button")}
          selectedValue={buttonStyle?.fontSize}
        />
        <Selector
          items={labelWeight}
          key="labelWeight"
          itemType={"labelWeight"}
          selectedWeight={(e) => onChange(e, "fontWeight", "button")}
          selectedValue={buttonStyle?.fontWeight}
        />
        <Selector
          items={labelAlignment}
          key="labelAlignment"
          itemType={"labelAlignment"}
          selectedAlign={(e) => onChange(e, "textAlign", "button")}
          selectedValue={buttonStyle?.textAlign}
        />
        <ColorPicker
          identity="textColor"
          color={buttonStyle?.color}
          textColorCallback={(e) => onChange(e, "color", "button")}
        />
      </div>
    </div>
  );
}

export default ButtonText;
