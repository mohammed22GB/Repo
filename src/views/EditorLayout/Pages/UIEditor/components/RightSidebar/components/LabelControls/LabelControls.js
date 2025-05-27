import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import Switch from "../PlainToggleSwitch";
import Select from "../Selector";
import InputBase from "@material-ui/core/InputBase";
import { connect } from "react-redux";
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
    lineHeight: 3,
    fontSize: 10,
    marginRight: 15,
  },
  fullWidthText: {
    marginBottom: 10,
  },
  center: {
    textAlign: "center",
  },
}));

function SimplePaper(props) {
  const classes = useStyles();
  const {
    labelToggleHide,
    labelHide,
    labelName,
    selectedSize,
    selectedWeight,
    selectedAlign,
    textColorCallback,
    fontSize,
    fontWeight,
    textAlign,
    color,
    labelValue,
    noHeader,
  } = props;

  const labelSize = [
    ["12px", "12px"],
    ["14px", "14px"],
    ["16px", "16px"],
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

  return (
    <div>
      {!noHeader && (
        <>
          <Typography gutterBottom className={classes.sectionTitle}>
            Label
          </Typography>
          <div style={{ display: "inline-flex" }}>
            <Typography gutterBottom className={classes.sectionLabel}>
              Hide Label
            </Typography>
            <Switch
              value={labelHide}
              toggleHide={labelToggleHide}
              itemType={"togglehide"}
            />
          </div>
        </>
      )}

      {labelHide ? (
        ""
      ) : (
        <>
          <InputText
            variant="outlined"
            size="small"
            fullWidth
            multiline
            rows={2}
            className={classes.fullWidthText}
            value={labelValue}
            onChange={(e) => labelName(e.target.value)}
            inputProps={{
              style: {
                fontFamily: "Inter",
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: 12,
                color: "#091540!important",
                LineHeight: 15.6,
              },
            }}
          />

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Select
              items={labelSize}
              key="labelSize"
              itemType={"labelSize"}
              selectedSize={selectedSize}
              selectedValue={fontSize}
            />
            <Select
              items={labelWeight}
              key="labelWeight"
              itemType={"labelWeight"}
              selectedWeight={selectedWeight}
              selectedValue={fontWeight}
            />
            <Select
              items={labelAlignment}
              key="labelAlignment"
              itemType={"labelAlignment"}
              selectedAlign={selectedAlign}
              selectedValue={textAlign}
            />
            <ColorPicker
              identity="textColor"
              textColorCallback={textColorCallback}
              color={color}
            />
          </div>
        </>
      )}
    </div>
  );
}

function mapStateToProps(state) {
  return {
    hideLabel: state.reducers.hide_label,
  };
}

export default connect(mapStateToProps)(SimplePaper);
