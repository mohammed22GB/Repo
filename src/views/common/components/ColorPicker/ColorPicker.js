import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { BlockPicker, SketchPicker, ChromePicker } from "react-color";
import { Popover } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: (props) => ({
    display: "flex",
    alignItems: "center",
    height: 26,
    borderRadius: props?.borderRadius ?? 3,
    padding: "11px 10px",
    border: props?.border ?? "1px solid #ABB3BF",
    boxSizing: "border-box",
  }),
  selectedHex: {
    color: "white",
    mixBlendMode: "difference",
    textAlign: "center",
    width: "100%",
    fontSize: 11,
  },
}));

export default function ColorPicker(props) {
  const {
    identity,
    colorCallback,
    textColorCallback,
    color = "#091540",
    showPopOver = true,
    showSelectedColorCode = true,
    borderRadius,
    border,
    // selectedColor: defaultColor,
  } = props;
  const classes = useStyles({ borderRadius, border });
  const [defaultColor, setDefaultColor] = useState(color);
  const [anchorEl, setAnchorEl] = React.useState(null);
  // const [background, setBackground] = React.useState("");
  const open = Boolean(anchorEl);
  const id = open ? identity : undefined;
  const [selectedColor, setSelectedColor] = React.useState(defaultColor);

  const handleClick = (event) => {
    if (!showPopOver) {
      colorCallback(color);
    }
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    colorCallback(selectedColor);
  };

  useEffect(() => {
    setSelectedColor(defaultColor);
  }, [defaultColor]);

  const handleChangeComplete = (color, event) => {
    // setBackground(color.hex);
    setSelectedColor(color.hex);
  };

  return (
    <div style={{ ...props.style, flex: 1, cursor: "pointer" }}>
      <div
        id={identity}
        className={classes.root}
        onClick={handleClick}
        style={{ background: selectedColor }}
      >
        {/* <StopIcon style={{ color: selectedColor }} /> */}
        {!!showSelectedColorCode && (
          <span className={classes.selectedHex}>{selectedColor}</span>
        )}
      </div>
      {showPopOver && (
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <ChromePicker
            color={selectedColor}
            onChangeComplete={handleChangeComplete}
          />
        </Popover>
      )}
    </div>
  );
}
