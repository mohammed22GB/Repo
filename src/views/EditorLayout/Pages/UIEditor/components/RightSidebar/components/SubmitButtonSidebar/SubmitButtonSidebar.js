import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Divider, Typography } from "@material-ui/core";
import { InputBase, Select } from "@material-ui/core";
import { connect, useDispatch } from "react-redux";
import ButtonStyle from "../ButtonStyle";
import ButtonText from "../ButtonText/ButtonText";
import Switch from "../PlainToggleSwitch";
// import { updateStylesAndValues } from "../../../../utils/canvasHelpers";
import {
  addHideInvoiceTableLabelProp,
  addInvoiceTableBackColorProp,
  addInvoiceTableBorderColorProp,
} from "../../../../../../../../store/actions/properties";

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
  inline: {
    display: "inline-flex",
  },
  percent: {
    padding: "2px 10px 5px",
    border: "1px solid #ABB3BF",
    borderLeft: "none",
    borderRadius: "0 3px 3px 0",
  },
  color: {
    marginTop: 3,
  },
}));

const SelectInput = withStyles((theme) => ({
  root: {
    "label + &": {
      marginTop: theme?.spacing(3),
    },
  },
  input: {
    color: "#091540",
    borderRadius: 3,
    position: "relative",
    border: "1px solid #ABB3BF",
    fontSize: 10,
    padding: "5px 8px",
    transition: theme?.transitions.create(["border-color", "box-shadow"]),
  },
}))(InputBase);

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

function SubmitButtonSidebar(props) {
  const {
    style,
    id,
    type,
    parent: container,
    index,
    showStyling,
    containerType,
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
    //   containerType,
    // })
  };
  const classes = useStyles();

  return (
    <div>
      <Typography gutterBottom className={classes.sideHeading}>
        Submit button name:{" "}
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
      </Typography>
      <Divider />

      <div className={classes.section}>
        <Typography gutterBottom className={classes.sectionTitle}>
          Button style
        </Typography>

        <ButtonStyle
          dimensions={style?.dimensions}
          onChange={(value, property, parent) =>
            onStyleChangeOrValues(value, parent, property)
          }
          buttonStyle={style?.button}
        />
      </div>

      <Divider />

      <div className={classes.section}>
        <Typography gutterBottom className={classes.sectionTitle}>
          Text
        </Typography>
        <ButtonText
          onChange={(value, property, parent) =>
            onStyleChangeOrValues(value, parent, property)
          }
          buttonStyle={style?.button}
          values={style?.values}
        />
      </div>
      <Divider />

      <div className={classes.section}>
        <Typography gutterBottom className={classes.sectionTitle}>
          Preference
        </Typography>
        <div className={classes.inline}>
          <Typography gutterBottom className={classes.sectionLabel}>
            Trigger workflow
          </Typography>
          <Select
            labelId="demo-customized-select-label"
            id="demo-customized-select"
            value={"nigeria"}
            placeholder="   Select Workflow"
            // fullWidth
            // onChange={handleChange}
            input={<SelectInput />}
          >
            {/* {currencies.map((currency) => (
              <MenuItem key={currency.key} value={currency.key}>
                {currency.name}
              </MenuItem>
            ))} */}
          </Select>
        </div>
      </div>

      <Divider />
      <div className={classes.section}>
        <Typography gutterBottom className={classes.sectionTitle}>
          Confirmation pop-up
        </Typography>
        <div className={classes.inline}>
          <Typography gutterBottom className={classes.sectionLabel}>
            Enable pop-up
          </Typography>
          <Switch
            itemType={"togglehide"}
            value={style?.values?.enablePopUp}
            toggleHide={(e) =>
              onStyleChangeOrValues(e, "values", "enablePopUp")
            }
          />
        </div>
        {style?.values?.enablePopUp && (
          <>
            <Typography gutterBottom className={classes.sectionLabel}>
              Pop-up title
            </Typography>
            <InputText
              onChange={(e) =>
                onStyleChangeOrValues(e.target.value, "values", "popUpTitle")
              }
              placeholder="Enter Title"
              fullWidth
            />

            <Typography gutterBottom className={classes.sectionLabel}>
              Pop-up message
            </Typography>
            <InputText
              onChange={(e) =>
                onStyleChangeOrValues(e.target.value, "values", "popUpMessage")
              }
              placeholder="Enter Message here"
              multiline
              rows={6}
              fullWidth
            />
          </>
        )}
      </div>
    </div>
  );
}

export default connect(null, {
  addHideInvoiceTableLabelProp,
  addInvoiceTableBackColorProp,
  addInvoiceTableBorderColorProp,
})(SubmitButtonSidebar);
