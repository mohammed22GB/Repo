import { Divider, Grid, InputBase, Typography } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import ButtonStyle from "../ButtonStyle";
import ButtonText from "../ButtonText/ButtonText";
import { Navigation } from "../Navigation/Navigation";
import // updateComponentAttribute,

// updateScreenItemPropertyValues,
// updateStyles,
"../../../../utils/uieditorHelpers";
import titleCase from "../../../../../../../common/helpers/titleCase";
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

function InvoiceTableSidebar(props) {
  const [screens, setScreens] = useState([]);
  const { style, values, name, id, type, itemRef, showStyling } = props;
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

  const onSelectScreen = ({ value, property }) => {
    const screen = screens.find(
      (v) => v.name.toLowerCase() === value.toLowerCase()
    );
    if (!screen) return;
    onValuesChange({
      property,
      value: {
        name: screen.name,
        link: value.toLowerCase() === "external" ? "" : screen.value,
      },
    });
  };

  const onExternalLinkChange = ({ value, property }) => {
    onValuesChange({
      value: { name: "External", link: value, value: "external" },
      property,
    });
  };
  return (
    <div>
      <Typography gutterBottom className={classes.sideHeading}>
        <span>ActionButton</span>
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
        <Typography gutterBottom className={classes.sectionTitle}>
          Button Style
        </Typography>

        <ButtonStyle
          dimensions={style?.dimensions}
          onChange={(value, property, root) =>
            onStyleChange({ value, root, property })
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
          onChange={(value, property, root) => {
            if (root === "values")
              return onValuesChange({ value, root, property });
            onStyleChange({ value, root, property });
          }}
          buttonStyle={style?.button}
          values={values}
        />
      </div>

      <div className={classes.section}>
        <Grid container style={{ marginBottom: 30 }} spacing={1}>
          <Grid item xs={4}>
            <Typography gutterBottom className={classes.sectionLabel}>
              Navigation
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Navigation
              onChange={(value) =>
                onSelectScreen({ value, property: "navigation" })
              }
              items={screens}
              selectedValue={titleCase(values?.navigation?.name)}
              externalLink={values?.navigation?.link}
              externalLinkChange={(value) =>
                onExternalLinkChange({ value, property: "navigation" })
              }
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default connect(null, {
  addHideInvoiceTableLabelProp,
  addInvoiceTableBackColorProp,
  addInvoiceTableBorderColorProp,
})(InvoiceTableSidebar);
