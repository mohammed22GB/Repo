import React from "react";
import { useDispatch } from "react-redux";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Divider, Typography, TextField } from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase";

import LabelControl from "../LabelControls";
import ColouredToggleSwitch from "../ColoredToggleSwitch";
import ChipSelect from "../ChipSelector";
import TextInputStyle from "../TextInputStyle";
import RequiredEditable from "../RequiredEditable";
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

const CurrencySidebar = (props) => {
  const { style, values, name, id, type, itemRef, showStyling, data } = props;
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
  /*  const onDataChange = ({ value, root, action }) =>
    dispatch(
      updateData({
        value,
        root,
        action,
        id,
        index,
        type,
        component: "currency",
      })
    ); */
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

  const { fileTooltipText } = props;
  const items = [
    { name: "NGN", value: "NGN" },
    { name: "EGP", value: "EGP" },
  ];

  return (
    <div>
      <Typography gutterBottom className={classes.sideHeading}>
        Currency
        <span>
          Name:{" "}
          <InputText
            variant="outlined"
            size="small"
            onChange={onNameChange}
            value={name}
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
        <TextInputStyle
          dimensions={style?.dimensions}
          style={style?.formTextField}
          onBorderRadiusChange={(value) =>
            onStyleChange({ value, root: "root", property: "borderRadius" })
          }
          onBorderRadiusColorChange={(e) =>
            onStyleChange({
              value: e,
              root: "selectInput",
              property: "borderColor",
            })
          }
          onBorderBackgroundColorChange={(e) =>
            onStyleChange({
              value: e,
              root: "selectInput",
              property: "backgroundColor",
            })
          }
          onWidthChange={(e) =>
            onStyleChange({ value: e, root: "dimensions", property: "width" })
          }
          onHeightChange={(e) =>
            onStyleChange({ value: e, root: "dimensions", property: "height" })
          }
        />
      </div>

      <Divider />

      <div className={classes.section}>
        <LabelControl
          labelValue={values?.label}
          fontSize={style?.label?.fontSize}
          fontWeight={titleCase(style?.label?.fontWeight)}
          textAlign={titleCase(style?.label?.textAlign)}
          labelName={(e) => onValuesChange({ value: e, property: "label" })}
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
            onValuesChange({ value: e, property: "labelHide" })
          }
          labelHide={values?.labelHide}
        />
      </div>

      <Divider />

      <div className={classes.section}>
        <Typography gutterBottom className={classes.sectionTitle}>
          Preferences
        </Typography>

        <div style={{ display: "inline-flex" }}>
          <Typography gutterBottom className={classes.sectionLabel}>
            Placeholder
          </Typography>
          <InputText
            size="small"
            value={values?.placeholder}
            placeholder="Enter Placeholder text"
            onChange={(e) =>
              onValuesChange({ value: e.target.value, property: "placeholder" })
            }
            inputProps={{
              className: classes.input,
            }}
          />
        </div>

        <div style={{ display: "inline-flex" }}>
          <Typography gutterBottom className={classes.sectionLabel}>
            Default Currency
          </Typography>
          <ChipSelect
            data={data}
            items={items}
            // handleChange={(value) => onDataChange({ value, action: "add" })}
            // handleDelete={(value) => onDataChange({ value, action: "remove" })}
          />
        </div>

        <div style={{ display: "inline-flex" }}>
          <Typography gutterBottom className={classes.sectionLabel}>
            Allow other currencies to be selected
          </Typography>
          <ColouredToggleSwitch
            value={values?.allowOtherCountriesSelection}
            itemType="togglehide"
            toggleHide={(e) =>
              onValuesChange({
                value: e,
                property: "allowOtherCountriesSelection",
              })
            }
          />
        </div>

        <div style={{ display: "inline-flex" }}>
          <Typography gutterBottom className={classes.sectionLabel}>
            Decimal Precision
          </Typography>
          <InputText
            variant="outlined"
            size="small"
            placeholder="0"
            value={values?.decimalPrecision}
            onChange={(e) =>
              onValuesChange({
                value: e.target.value,
                property: "decimalPrecision",
              })
            }
            style={{ width: "20%" }}
            inputProps={{
              min: 0,
              style: { textAlign: "center" },
              className: classes.input,
            }}
          />
        </div>
        <div style={{ display: "inline-flex" }}>
          <Typography gutterBottom className={classes.sectionLabel}>
            Maximum Figure No
          </Typography>
          <InputText
            variant="outlined"
            size="small"
            placeholder="0"
            defaultValue={0}
            style={{ width: "20%" }}
            value={values?.maximumFigure}
            onChange={(e) =>
              onValuesChange({
                value: e.target.value,
                property: "maximumFigure",
              })
            }
            inputProps={{
              min: 0,
              style: { textAlign: "center" },
              className: classes.input,
            }}
          />
        </div>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center" }}>
            <Typography gutterBottom className={classes.sectionLabel}>
              Include tooltip
            </Typography>
            <ColouredToggleSwitch
              value={values?.showTooltip}
              itemType="togglehide"
              toggleHide={(e) =>
                onValuesChange({ value: e, property: "showTooltip" })
              }
            />
          </div>
        </div>
        {values?.showTooltip && (
          <TextField
            variant="outlined"
            size="small"
            value={values?.tooltip}
            //value={selectedText}
            onChange={(e) =>
              onValuesChange({ value: e.target.value, property: "toolTip" })
            }
            fullWidth
            multiline
            rows={2}
            className={classes.fullWidthText}
            placeholder="Enter tooltip text"
          />
        )}
      </div>
      <Divider />
      <div className={classes.section}>
        <RequiredEditable
          // required={values?.required}
          setRequired={(v) =>
            onValuesChange({ value: v, property: "required" })
          }
          editable={values?.editable}
          setEditable={(v) =>
            onValuesChange({ value: v, property: "editable" })
          }
        />
      </div>
    </div>
  );
};

export default CurrencySidebar;
