import React from "react";
import { useDispatch } from "react-redux";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Divider, Typography, Grid } from "@material-ui/core";
import LabelControl from "../LabelControls";
import PlainToggleSwitch from "../PlainToggleSwitch";
import InputBase from "@material-ui/core/InputBase";
import Select from "../Selector";
import RequiredEditable from "../RequiredEditable";
// import { updateStylesAndValues } from "../../../../utils/canvasHelpers";
import titleCase from "../../../../../../../common/helpers/titleCase";

const InputText = withStyles((theme) => ({
  input: {
    color: "#091540",
    borderRadius: 3,
    position: "relative",
    border: "1px solid #ABB3BF",
    fontSize: 10,
    paddingLeft: 2,
    transition: theme?.transitions.create(["border-color", "box-shadow"]),
  },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
  root: {},
  sideHeading: {
    color: "#091540",
    fontWeight: 600,
    fontSize: 13,
    padding: "10px 5px 0px 5px",
    display: "flex",
    justifyContent: "space-between",
    "& span": {
      textAlign: "right",
      "& input": {
        paddingLeft: 10,
      },
    },
  },
  section: {
    padding: 10,
  },
  sectionTitle: {
    color: "#999",
    fontSize: 12,
  },
  sectionLabel: {
    color: "#999",
    fontSize: 10,
    marginRight: 5,
    marginTop: 5,
  },
  fullWidthText: {
    margin: "10px 0",
  },
  input: {
    color: "#091540",
    fontSize: 10,
  },
  center: {
    textAlign: "center",
  },
}));

export default function Slider(props) {
  const classes = useStyles();

  const { fileTooltipText } = props;
  const {
    labelToggleHide,
    labelHide,
    labelName,
    selectedSize,
    selectedWeight,
    selectedAlign,
    textColorCallback,
  } = props;

  // const classes = useStyles();

  const { style, id, type, parent: container, index } = props;
  const dispatch = useDispatch();

  const onStyleChangeOrValues = (value, parent, property) => {
    dispatch();
    // updateStylesAndValues({
    //   value,
    //   parent,
    //   property,
    //   id,
    //   type,
    //   container,
    //   index,
    // })
  };

  const orientation = [
    ["horizontal", "horizontal"],
    ["vertical", "vertical"],
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
      <Typography gutterBottom className={classes.sideHeading}>
        Slider
        <span>
          Name:{" "}
          <InputText
            variant="outlined"
            size="small"
            onChange={(e) =>
              onStyleChangeOrValues(e.target.value, "values", "name")
            }
            value={style?.values?.name}
            placeholder="Name"
            style={{ width: "60%" }}
            inputProps={{
              min: 0,
              style: { textAlign: "center" },
              className: classes.input,
            }}
          />
        </span>
      </Typography>
      <Divider />
      <div className={classes.section}>
        <Typography gutterBottom className={classes.sectionTitle}>
          Style
        </Typography>
        <div style={{ display: "inline-flex" }}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <div style={{ display: "inline-flex" }}>
                <Typography gutterBottom className={classes.sectionLabel}>
                  Width
                </Typography>
                <InputText
                  variant="outlined"
                  size="small"
                  placeholder="1"
                  value={style?.dimensions?.width}
                  onChange={(e) =>
                    onStyleChangeOrValues(e.target.value, "dimensions", "width")
                  }
                  style={{ width: "30%" }}
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
                Height
              </Typography>
              <InputText
                variant="outlined"
                size="small"
                placeholder="1"
                value={style?.dimensions?.height}
                style={{ width: "30%" }}
                onChange={(e) =>
                  onStyleChangeOrValues(e.target.value, "dimensions", "height")
                }
                inputProps={{
                  min: 0,
                  style: { textAlign: "center" },
                  className: classes.input,
                }}
              />
            </Grid>
          </Grid>
        </div>

        {/* <StyleOption
          fontSize={style?.label?.fontSize}
          fontWeight={titleCase(style?.label?.fontWeight)}
          textAlign={titleCase(style?.label?.textAlign)}
          color={style?.label?.color}
          selectedSize={(e) => onStyleChangeOrValues(e, "label", "fontSize")}
          selectedWeight={(e) => onStyleChangeOrValues(e, "label", "fontWeight")}
          selectedAlign={(e) => onStyleChangeOrValues(e, "label", "textAlign")}
          textColorCallback={(e) => onStyleChangeOrValues(e, "label", "color")}
        /> */}
      </div>
      <Divider />
      <div className={classes.section}>
        <LabelControl
          labelValue={style?.values?.label}
          fontSize={style?.label?.fontSize}
          fontWeight={titleCase(style?.label?.fontWeight)}
          textAlign={titleCase(style?.label?.textAlign)}
          labelName={(e) => onStyleChangeOrValues(e, "values", "label")}
          color={style?.label?.color}
          selectedSize={(e) => onStyleChangeOrValues(e, "label", "fontSize")}
          selectedWeight={(e) =>
            onStyleChangeOrValues(e, "label", "fontWeight")
          }
          selectedAlign={(e) => onStyleChangeOrValues(e, "label", "textAlign")}
          textColorCallback={(e) => onStyleChangeOrValues(e, "label", "color")}
          labelToggleHide={(e) =>
            onStyleChangeOrValues(e, "values", "labelHide")
          }
          labelHide={style?.values?.labelHide}
        />
      </div>
      <Divider />
      <div className={classes.section}>
        <Typography gutterBottom className={classes.sectionTitle}>
          Preferences
        </Typography>
        <div style={{ display: "inline-flex" }}>
          <Typography gutterBottom className={classes.sectionLabel}>
            Show Minimum & Maximum
          </Typography>
          <PlainToggleSwitch />
        </div>
        <div style={{ display: "inline-flex" }}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <div style={{ display: "inline-flex" }}>
                <Typography gutterBottom className={classes.sectionLabel}>
                  Minimum
                </Typography>
                <InputText
                  variant="outlined"
                  size="small"
                  placeholder="1"
                  value={style?.values?.min}
                  onChange={(e) =>
                    onStyleChangeOrValues(e.target.value, "values", "min")
                  }
                  style={{ width: "30%" }}
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
                Maximum
              </Typography>
              <InputText
                variant="outlined"
                size="small"
                placeholder="1"
                value={style?.values?.max}
                style={{ width: "30%" }}
                onChange={(e) =>
                  onStyleChangeOrValues(e.target.value, "values", "max")
                }
                inputProps={{
                  min: 0,
                  style: { textAlign: "center" },
                  className: classes.input,
                }}
              />
            </Grid>
          </Grid>
        </div>
        <Divider />
        <div style={{ display: "inline-flex" }}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <div style={{ display: "inline-flex" }}>
                <Typography gutterBottom className={classes.sectionLabel}>
                  Orientation
                </Typography>
                <div style={{ display: "inline-flex" }}>
                  <Select
                    items={orientation}
                    key="orientation"
                    itemType={"labelSize"}
                    selectedValue={style?.values?.orientation}
                    selectedSize={(e) =>
                      onStyleChangeOrValues(e, "values", "orientation")
                    }
                  />
                  {/* <Select
                    items={labelWeight}
                    key="labelWeight"
                    itemType={"labelWeight"}
                    selectedWeight={selectedWeight}
                  />
                  <Select
                    items={labelAlignment}
                    key="labelAlignment"
                    itemType={"labelAlignment"}
                    selectedAlign={selectedAlign}
                  />
                  <ColorPicker
                    identity="textColor"
                    textColorCallback={textColorCallback}
                  /> */}
                </div>
                {/* <InputText
                  variant="outlined"
                  size="small"
                  placeholder="1"
                  defaultValue={"Horizontal"}
                  style={{ width: "50%" }}
                  inputProps={{
                    min: 0,
                    style: { textAlign: "center" },
                    className: classes.input,
                  }}
                /> */}
              </div>
            </Grid>
            <Grid item xs={6} style={{ display: "inline-flex" }}>
              <Typography gutterBottom className={classes.sectionLabel}>
                Steps
              </Typography>
              <InputText
                variant="outlined"
                size="small"
                placeholder="1"
                value={style?.values?.step}
                onChange={(e) =>
                  onStyleChangeOrValues(e.target.value, "values", "step")
                }
                style={{ width: "30%" }}
                inputProps={{
                  min: 0,
                  style: { textAlign: "center" },
                  className: classes.input,
                }}
              />
            </Grid>
          </Grid>
        </div>
      </div>
      <Divider />
      <div className={classes.section}>
        <RequiredEditable />
      </div>
    </div>
  );
}
