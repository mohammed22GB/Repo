import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Divider, Typography } from "@material-ui/core";
import LabelControl from "../LabelControls";
import Switch from "../PlainToggleSwitch";
import { useDispatch } from "react-redux";
import // updateStyles,
// updateStylesAndValues,
"../../../../utils/uieditorHelpers";
import ColorPicker from "../../../../../../../common/components/ColorPicker";
import titleCase from "../../../../../../../common/helpers/titleCase";

const useStyles = makeStyles((theme) => ({
  root: {},
  sideHeading: {
    color: "#091540",
    fontWeight: 600,
    fontSize: 13,
    paddingLeft: 10,
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

export default function FileUploadSidebar(props) {
  const {
    style,
    values,
    id,
    type,
    parent: container,
    index,
    showStyling,
  } = props;
  const dispatch = useDispatch();
  const onStyleChangeOrValues = (value, parent, property, changeType) => {
    dispatch();
    // updateStylesAndValues({
    //   value,
    //   parent,
    //   property,
    //   id,
    //   type,
    //   changeType,
    //   container,
    //   index,
    // })
  };
  const classes = useStyles();

  const onStyleChange = ({ value, root, property }) => {
    dispatch();
    // updateStyles({
    //   value,
    //   root,
    //   property,
    //   id,
    //   index,
    //   type,
    // })
  };

  return (
    <div>
      <Typography gutterBottom className={classes.sideHeading}>
        Toggle
      </Typography>
      <Divider />
      <div className={classes.section}>
        <Typography gutterBottom className={classes.sectionTitle}>
          Style
        </Typography>
        <div style={{ display: "inline-flex" }}>
          <Typography gutterBottom className={classes.sectionLabel}>
            Color
          </Typography>
          <ColorPicker
            identity="textColor"
            textColorCallback={(e) =>
              onStyleChange({
                value: e,
                root: "switch_base",
                property: "color",
              })
            }
            color={style?.switch_base?.color}
          />
          {/* <InputText
            variant="outlined"
            size="small"
            placeholder=""
            defaultValue={""}
            style={{ width: "20%" }}
            inputProps={{
              min: 0,
              style: { textAlign: "center" },
              className: classes.input,
            }}
          /> */}
        </div>
      </div>
      <Divider />
      <div className={classes.section}>
        <LabelControl
          labelValue={values?.label}
          fontSize={style?.label?.fontSize}
          fontWeight={titleCase(style?.label?.fontWeight)}
          textAlign={titleCase(style?.label?.textAlign)}
          labelName={(e) => onStyleChangeOrValues(e, "values", "label")}
          color={style?.label?.color}
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
            onStyleChangeOrValues(e, "values", "labelHide")
          }
          labelHide={values?.labelHide}
        />
      </div>
      <Divider />
      <div className={classes.section}>
        <Divider />
        <div>
          <div style={{ display: "inline-flex" }}>
            <Typography gutterBottom className={classes.sectionLabel}>
              Required
            </Typography>
            <Switch
              itemType="togglehide"
              value={values?.required}
              toggleHide={(v) => onStyleChangeOrValues(v, "values", "required")}
            />
          </div>
        </div>
        <div>
          <div style={{ display: "inline-flex" }}>
            <Typography gutterBottom className={classes.sectionLabel}>
              Not Editable
            </Typography>
            <Switch
              itemType="togglehide"
              value={values?.notEditable}
              toggleHide={(v) =>
                onStyleChangeOrValues(v, "values", "notEditable")
              }
            />
          </div>
        </div>
        <div>
          <div style={{ display: "inline-flex" }}>
            <Typography gutterBottom className={classes.sectionLabel}>
              Place label by the side
            </Typography>
            <Switch />
          </div>
        </div>
      </div>
    </div>
  );
}
