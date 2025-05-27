import React from "react";

import CheckIcon from "../../icons/CheckIcon";
import ElementIcon from "../../icons/ElementIcon";
import ElementPlusIcon from "../../icons/ElementPlusIcon";
import RowverticalIcon from "../../icons/RowVerticalIcon";
import StarIcon from "../../icons/StarIcon";
import TextIcon from "../../icons/TextIcon";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import CalendarIcon from "../../icons/CalendarIcon";

const useStyles = makeStyles(() =>
  createStyles({
    floatingMenuBar: {
      position: "absolute",
      left: "50%",
      bottom: 32,
      transform: "translateX(-50%)",
      background: "#ffffff",
      borderRadius: 16,
      boxShadow: "0 4px 24px 0 rgba(0,0,0,0.08)",
      display: "flex",
      alignItems: "center",
      padding: "16px",
      gap: 24,
      zIndex: 3,
      border: "1px solid #F0F0F0",
      transition: "padding 0.2s, gap 0.2s, bottom 0.2s",
    },
    menuIcon: {
      fontSize: 22,
      color: "#222",
      cursor: "pointer",
      background: "none",
      border: "none",
      outline: "none",
      padding: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "color 0.2s, font-size 0.2s",
    },
  })
);

const FloatingAppToolbar = () => {
  const classes = useStyles();

  return (
    <div className={classes.floatingMenuBar}>
      <button className={classes.menuIcon} title="Star">
        <StarIcon />
      </button>
      <button className={classes.menuIcon} title="Element">
        <ElementIcon />
      </button>
      <button className={classes.menuIcon} title="Text">
        <TextIcon />
      </button>
      <button className={classes.menuIcon} title="Checkbox">
        <CheckIcon />
      </button>
      <button className={classes.menuIcon} title="Date">
        <CalendarIcon />
      </button>
      <button className={classes.menuIcon} title="RowVertical">
        <RowverticalIcon />
      </button>
      <button className={classes.menuIcon} title="AddMoreElement">
        <ElementPlusIcon />
      </button>
    </div>
  );
};

export default FloatingAppToolbar;
