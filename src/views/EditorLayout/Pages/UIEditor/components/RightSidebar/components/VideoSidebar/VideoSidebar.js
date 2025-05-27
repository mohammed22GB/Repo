import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Divider, Typography, TextField, Grid } from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase";
import { useDispatch } from "react-redux";

import LabelControls from "../LabelControls";
import // updateComponentAttribute,
// updateScreenItemPropertyValues,
// updateStyles,
"../../../../utils/uieditorHelpers";
import titleCase from "../../../../../../../common/helpers/titleCase";

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
  sideHeading: {
    color: "#091540",
    fontWeight: 600,
    fontSize: 13,
    padding: "10px 5px 0px 5px",
    paddingLeft: 10,
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
    marginRight: 12,
    marginTop: 5,
  },
  fullWidthText: {
    margin: "10px 0",
  },
  center: {
    textAlign: "center",
  },
  divider: {
    marginTop: 15,
    marginBottom: 15,
  },
  input: {
    color: "#091540",
    fontSize: 10,
    "&::placeholder": {
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: 12,
      color: "#091540!important",
      LineHeight: 15.6,
    },
  },
}));

export default function FileUploadSidebar(props) {
  const { style, id, type, itemRef, name, values, showStyling } = props;
  const dispatch = useDispatch();

  const onStyleChange = ({ value, root, property }) => dispatch();
  // updateStyles({
  //   value,
  //   root,
  //   property,
  //   id,
  //   itemRef,
  //   type,
  // })
  const onNameChange = ({ target: { name, value } }) => dispatch();
  // updateComponentAttribute({
  //   attrib: "name",
  //   value,
  //   itemRef,
  // })
  const onValuesChange = ({ value, property }) => dispatch();
  // updateScreenItemPropertyValues({
  //   value,
  //   property,
  //   itemRef,
  //   type,
  // })

  const classes = useStyles();
  return (
    <div>
      <Typography gutterBottom className={classes.sideHeading}>
        Video
        <span>
          Name:{" "}
          <InputText
            variant="outlined"
            size="small"
            onChange={onNameChange}
            value={name}
            name="name"
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
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <div style={{ display: "inline-flex" }}>
              <Typography gutterBottom className={classes.sectionLabel}>
                W
              </Typography>
              <InputText
                variant="outlined"
                size="small"
                onChange={(e) =>
                  onStyleChange({
                    value: e.target.value,
                    root: "dimensions",
                    property: "width",
                  })
                }
                value={style?.dimensions?.width}
                style={{ width: "60%" }}
                inputProps={{
                  min: 0,
                  style: { textAlign: "center" },
                  className: classes.input,
                }}
              />
            </div>
          </Grid>
          <Grid item xs={4} style={{ display: "inline-flex" }}>
            <Typography gutterBottom className={classes.sectionLabel}>
              H
            </Typography>
            <InputText
              variant="outlined"
              size="small"
              onChange={(e) =>
                onStyleChange({
                  value: e.target.value,
                  root: "dimensions",
                  property: "height",
                })
              }
              value={style?.dimensions?.height}
              style={{ width: "60%" }}
              inputProps={{
                min: 0,
                style: { textAlign: "center" },
                className: classes.input,
              }}
            />
          </Grid>
        </Grid>
        <div style={{ display: "inline-flex" }}>
          <Typography gutterBottom className={classes.sectionLabel}>
            Border Radius
          </Typography>
          <InputText
            variant="outlined"
            size="small"
            placeholder="2px"
            onChange={(e) =>
              onStyleChange({
                value: e.target.value,
                root: "container",
                property: "borderRadius",
              })
            }
            value={style?.container?.borderRadius}
            style={{ width: "20%" }}
            inputProps={{
              min: 0,
              style: { textAlign: "center" },
              className: classes.input,
            }}
          />
        </div>
      </div>
      <Divider />
      <div className={classes.section}>
        <Typography gutterBottom className={classes.sectionTitle}>
          Video Source
        </Typography>
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          multiline
          rows={4}
          onChange={(e) =>
            onValuesChange({ value: e.target.value, property: "videoSource" })
          }
          placeholder="Enter URL"
          InputProps={{
            style: {
              fontFamily: "Inter",
              fontStyle: "normal",
              fontWeight: 400,
              fontSize: 10,
              color: "#091540!important",
              LineHeight: 17.1,
            },
          }}
        />
      </div>
      <Divider style={{ marginTop: 20 }} />
      <div className={classes.section}>
        <LabelControls
          labelValue={values?.label}
          fontSize={style?.label?.fontSize}
          fontWeight={titleCase(style?.label?.fontWeight)}
          textAlign={titleCase(style?.label?.textAlign)}
          color={style?.label?.color}
          labelName={(e) => onValuesChange({ value: e, property: "label" })}
          selectedSize={(e) =>
            onStyleChange({ value: e, root: "label", property: "fontSize" })
          }
          selectedWeight={(e) =>
            onStyleChange({ value: e, root: "label", property: "fontWeight" })
          }
          selectedAlign={(e) =>
            onStyleChange({ value: e, root: "label", property: "textAlign" })
          }
          textColorCallback={(e) =>
            onStyleChange({ value: e, root: "label", property: "color" })
          }
          labelToggleHide={(e) =>
            onValuesChange({ value: e, property: "labelHide" })
          }
          labelHide={values?.labelHide}
        />
      </div>
    </div>
  );
}
