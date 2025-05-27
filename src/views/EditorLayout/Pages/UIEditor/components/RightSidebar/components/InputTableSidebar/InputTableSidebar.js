import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { InputBase } from "@material-ui/core";
import SidebarNameSection from "../components/SidebarNameSection";
import SidebarFieldPreferenceSection from "../components/SidebarFieldPreferenceSection";
import InputTableColumns from "../components/InputTableColumns";
import InputTableAggregate from "../components/InputTableAggregates";

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
  inline: {
    display: "inline-flex",
  },
  percent: {
    padding: "2px 10px 5px",
    border: "1px solid #ABB3BF",
    borderLeft: "none",
    borderRadius: "0 3px 3px 0",
  },
}));

const currencies = [
  {
    name: "Nigerian Naira (N)",
    key: "nigeria",
  },
];

export default function DataTableSidebar(props) {
  const {
    id,
    itemRef,
    style,
    type: itemType,
    title,
    parent: container,
    name,
    values,
    dataType,
    showStyling,
  } = props;

  const classes = useStyles();

  const { updateProp, borderColor, backgroundColor, hideInvoicetableLabel } =
    props;

  return (
    <div className="sidebar-container">
      <SidebarNameSection
        itemId={id}
        itemRef={itemRef}
        itemType={itemType}
        name={name}
        title={title}
      />

      <div className="sidebar-container-scroll">
        <SidebarFieldPreferenceSection
          itemRef={itemRef}
          itemType={itemType}
          name={name}
          title={title}
          values={{ ...values }}
          dataType={dataType}
        />
        <InputTableColumns
          itemRef={itemRef}
          itemType={itemType}
          name={name}
          title={title}
          values={{ ...values }}
        />
        <InputTableAggregate
          itemRef={itemRef}
          itemType={itemType}
          name={name}
          title={title}
          values={{ ...values }}
        />
      </div>

      {/* <div className={classes.section}>
        <Typography gutterBottom className={classes.sectionTitle}>
          Style
        </Typography>
        <div>
          <div style={{ display: "inline-flex", marginTop: 5 }}>
            <Typography gutterBottom className={classes.sectionLabel}>
              Border Color
            </Typography>
            <ColorPicker identity="borderColor" selectedColor={borderColor} />
          </div>
        </div>
        <div>
          <div style={{ display: "inline-flex", marginTop: 5 }}>
            <Typography gutterBottom className={classes.sectionLabel}>
              Background Color
            </Typography>
            <ColorPicker
              identity="backgroundColor"
              selectedColor={backgroundColor}
            />
          </div>
        </div>
      </div>

      <Divider />

      <div className={classes.section}>
        <LabelControl />
      </div>

      <Divider />

      <div className={classes.section}>
        <Typography gutterBottom className={classes.sectionTitle}>
          Preferences
        </Typography>

        <div className={classes.inline}>
          <Typography gutterBottom className={classes.sectionLabel}>
            Tax Rate
          </Typography>

          <div className={classes.inline}>
            <InputText
              size="small"
              style={{ width: "10ch" }}
              inputProps={{
                className: classes.input,
                style: { borderRadius: "3px 0 0 3px" },
              }}
            />
            <InputText
              size="small"
              defaultValue="%"
              disabled
              style={{ width: "4ch" }}
              inputProps={{
                min: 0,
                style: {
                  textAlign: "center",
                  borderLeft: "none",
                  borderRadius: "0 3px 3px 0",
                },
              }}
            />
          </div>
        </div>

        <div className={classes.inline}>
          <Typography gutterBottom className={classes.sectionLabel}>
            Street Placeholder
          </Typography>
          <Select
            labelId="demo-customized-select-label"
            id="demo-customized-select"
            value={"nigeria"}
            // onChange={handleChange}
            input={<SelectInput />}
          >
            {currencies.map((currency) => (
              <MenuItem key={currency.key} value={currency.key}>
                {currency.name}
              </MenuItem>
            ))}
          </Select>
        </div>

        <TooltipControl />
        <Divider style={{ margin: "10px 0" }} />
        <RequiredEditable />
      </div> */}
    </div>
  );
}
