import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { MenuItem, Select } from "@material-ui/core";

export default function CustomDropdown(props: any) {
  const useStyles = makeStyles((theme) => ({
    root: {
      marginRight: 5,
    },
    dropdown: {
      width: "100%",
      "&.MuiFilledInput-underline": {
        border: "none ",
        borderBottom: "none ",
        "&:after": {
          border: "none ",
          borderBottom: "none ",
        },
        "&:before": {
          border: "none ",
          borderBottom: "none ",
        },
        "& .MuiSelect-icon": {
          top: "unset",
        },
      },
      "& .MuiFilledInput-input": {
        padding: "0px 2px",
        height: "32px",
        display: "flex",
        alignItems: "center",
      },
    },
    selectMenu: {
      boxShadow: "none",
    },
    select: {
      //paddingRight: "5px",
      background: "#F8F8F8",
      borderRadius: 8,
      "&:focus": {
        background: "#F8F8F8",
        borderRadius: 8,
      },
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
    selectorLabel,
    selectType,
    onChange,
    disabled,
  } = props;

  const handleChange = (event: any) => {
    onChange(event.target.value);
  };

  return (
    <Select
      id={new Date().getTime().toString()}
      variant="filled"
      onChange={handleChange}
      disabled={disabled}
      className={classes.dropdown}
      value={selectedValue || ""}
      style={{
        background: "#F8F8F8",
        paddingLeft: 12,
        paddingTop: 4,
      }}
      classes={{
        root: classes.root,
        selectMenu: classes.selectMenu,
        select: classes.select,
      }}
      displayEmpty
    >
      <MenuItem
        key={selectorLabel}
        value={""}
        style={{
          paddingLeft: 12,
          paddingRight: 12,
          paddingTop: 1,
          paddingBottom: 2,
          fontSize: 10,
          fontWeight: 300,
        }}
        disabled={true}
        selected
      >
        {selectorLabel || "Select"}
      </MenuItem>
      {items?.map((item: any) => (
        <MenuItem
          key={item?.value}
          value={item?.value}
          style={{
            paddingLeft: 12,
            paddingRight: 12,
            paddingTop: 1,
            paddingBottom: 2,
            fontSize: 10,
            fontWeight: 300,
          }}
        >
          {item?.name}
        </MenuItem>
      ))}
    </Select>
  );
}
