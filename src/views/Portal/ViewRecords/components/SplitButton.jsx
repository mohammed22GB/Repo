import React, { useEffect, useRef, useState } from "react";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import { MdKeyboardArrowDown } from "react-icons/md";
import { makeStyles } from "@material-ui/core/styles";

const SplitButton = ({
  splitBtnOptions,
  filterLevel,
  setFilterLevel,
  adminUG,
}) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(1);

  const btnStyles = makeStyles((theme) => {
    return {
      customButton: {
        backgroundColor: "#F8F8F8",
        color: "black",
        "&:hover": {
          backgroundColor: "lightgray",
        },
      },

      splitBtnCover: {
        "& .MuiListItem-button:hover": {
          backgroundColor: "#DE54391F !important",
          borderRight: "none",
          padding: "6px 16px",
          height: "auto ",
        },
      },
    };
  });
  const classes = btnStyles();

  const handleClick = () => {
    console.info(`You clicked ${splitBtnOptions[selectedIndex]}`);
  };

  const handleMenuItemClick = (event, option) => {
    //console.log(option?.value);
    setFilterLevel(option?.value);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => {
      return !prevOpen;
    });
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <div style={{ position: "relative" }} className={classes.splitBtnCover}>
      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        aria-label="split button"
        data-testid="split_button"
        style={{ height: "2.5rem" }}
      >
        <Button
          title="menu_btn"
          color="primary"
          style={{ textTransform: "none", minWidth: "6rem" }}
          onClick={handleClick}
        >
          {
            splitBtnOptions?.find((val) => {
              return val?.value === filterLevel;
            })?.title
          }
        </Button>
        <Button
          size="small"
          aria-haspopup="menu"
          onClick={handleToggle}
          title="arrow_down"
          className={classes.customButton}
        >
          <MdKeyboardArrowDown size={26} />
        </Button>
      </ButtonGroup>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        style={{ width: "100%", zIndex: "50" }}
      >
        {({ TransitionProps, placement }) => {
          return (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper style={{ width: "100%" }}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu">
                    {splitBtnOptions?.map((option, index) => {
                      return (
                        <MenuItem
                          title={"menu_item"}
                          key={option?.value}
                          selected={filterLevel === option?.value}
                          onClick={(event) => {
                            return handleMenuItemClick(event, option);
                          }}
                        >
                          {option?.title}
                        </MenuItem>
                      );
                    })}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          );
        }}
      </Popper>
    </div>
  );
};

export default SplitButton;
