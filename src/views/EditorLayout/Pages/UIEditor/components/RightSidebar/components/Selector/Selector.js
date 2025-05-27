import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import NativeSelect from "@material-ui/core/NativeSelect";
import { MenuItem, Select } from "@material-ui/core";

const BootstrapInput = withStyles((theme) => ({
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

export default function CustomizedSelects(props) {
  const useStyles = makeStyles((theme) => ({
    root: {
      marginRight: 5,
    },
    selectMenu: {
      border: "none",
      boxShadow: "none",
    },
    select: {
      paddingRight: "5px !important",
    },
  }));

  const classes = useStyles();

  const {
    items,
    itemType,
    selectorCall,
    selectedWeight,
    selectedAlign,
    selectedUploadFrom,
    selectedSize,
    selectedValue,
    selectType,
    onChange,
    disabled,
  } = props;

  const handleChange = (event) => {
    // if (itemType === "layout") {
    //   selectorCall(event.target.value);
    // } else if (itemType === "labelSize") {
    //   selectedSize(event.target.value);
    // } else if (itemType === "labelWeight") {
    //   selectedWeight(event.target.value);
    // } else if (itemType === "labelAlignment") {
    //   selectedAlign(event.target.value);
    // } else if (itemType === "uploadFrom") {
    //   selectedUploadFrom(event.target.value);
    // } else if (itemType === "selectType") {
    //   selectType(event.target.value);
    // }
    onChange(event.target.value);
  };

  /* return (
    <NativeSelect
      id={new Date().getTime()}
      // variant="outlined"
      onChange={handleChange}
      input={<BootstrapInput />}
      IconComponent="none"
      value={selectedValue}
      classes={{
        root: classes.root,
        selectMenu: classes.selectMenu,
        select: classes.select,
      }}
    >
      {items.map(([value, name]) => (
        <option key={value} value={name}>
          {name}
        </option>
      )
      )}
    </NativeSelect>
  ); */
  return (
    <Select
      id={new Date().getTime().toString()}
      variant="outlined"
      onChange={handleChange}
      disabled={disabled}
      value={selectedValue || ""}
      style={props.width ? { width: props.width, flex: "unset" } : {}}
      classes={{
        root: classes.root,
        selectMenu: classes.selectMenu,
        select: classes.select,
      }}
    >
      {items?.map(([value, name]) => (
        <MenuItem
          key={value}
          value={value}
          style={{
            paddingLeft: 12,
            paddingRight: 12,
            paddingTop: 1,
            paddingBottom: 2,
            fontSize: 10,
            fontWeight: 300,
          }}
        >
          {name}
        </MenuItem>
      ))}
    </Select>
  );
}
