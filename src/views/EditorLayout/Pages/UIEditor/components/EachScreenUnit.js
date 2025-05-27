import React, { useState, useRef } from "react";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import { Delete, Edit, FileCopy, MoreVert, Tune } from "@material-ui/icons";
import { errorToastify, infoToastify } from "../../../../common/utils/Toastify";

const SCREEN_MENU_LIST = Object.freeze({
  Design: "design",
  Rename: "rename",
  Duplicate: "duplicate",
  Delete: "delete",
});

const EachScreenUnit = ({
  screen,
  activeScreen,
  setUieCanvasMode,
  selectScreen,
  screensList,
  saveNameDebounce,
  duplicateSelectedScreen,
  deleteSelectedScreen,
  classes,
}) => {
  const renameRef = useRef();
  const [renameMode, setRenameMode] = useState(false);
  const [originalNameAndId, setOriginalNameAndId] = useState({});
  const [originalScreensNameList, setOriginalScreensNameList] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOptionsOpen = ({ evt, id, index }) => {
    evt.stopPropagation();

    // setActiveEntity({ id, name, type, slug, layout });
    setAnchorEl(evt.currentTarget);
  };

  const setPageInUieMode = (selectedScreen) => {
    const newActiveScreen = [...screensList]?.find(
      (screen) => screen?.id === selectedScreen?.id
    );

    selectScreen({ ...newActiveScreen });
    setUieCanvasMode();
  };

  const getMenuIcon = (option) => {
    switch (option) {
      case SCREEN_MENU_LIST.Design:
        return <Tune style={{ fontSize: 12, marginRight: 7 }} />;

      case SCREEN_MENU_LIST.Rename:
        return <Edit style={{ fontSize: 12, marginRight: 7 }} />;

      case SCREEN_MENU_LIST.Duplicate:
        return <FileCopy style={{ fontSize: 12, marginRight: 7 }} />;

      case SCREEN_MENU_LIST.Delete:
        return <Delete style={{ fontSize: 12, marginRight: 7 }} />;

      default:
        break;
    }
  };

  const handleScreenActions = (mode, screen) => {
    switch (mode) {
      case SCREEN_MENU_LIST.Design:
        setPageInUieMode(screen);
        break;

      case SCREEN_MENU_LIST.Rename:
        setOriginalNameAndId({ name: screen?.name, id: screen?.id });
        setOriginalScreensNameList(
          [...screensList].map((screen) => screen.name)
        );
        setRenameMode(true);
        break;

      case SCREEN_MENU_LIST.Duplicate:
        duplicateSelectedScreen(screen.id);
        break;

      case SCREEN_MENU_LIST.Delete:
        deleteSelectedScreen(screen.id);
        break;

      default:
        break;
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // handleMobileMenuClose();
  };

  const checkCharsOfScreenName = (evt) => {
    (evt.key === "Enter" || !/[0-9a-zA-Z ()]/.test(evt.key)) &&
      evt.preventDefault();
  };

  const nameChanged = (newName) =>
    newName?.trim()?.toLowerCase() !==
    originalNameAndId?.name?.trim()?.toLowerCase();
  const isNewNameBlank = (newName) => !newName?.trim();
  const isNewNameExisting = (newName) =>
    originalScreensNameList?.some(
      (screenName) =>
        screenName?.trim()?.toLowerCase() === newName?.trim()?.toLowerCase()
    );

  const saveScreenName = () => {
    const newName = renameRef.current.innerText;

    if (!isNewNameBlank(newName) && !isNewNameExisting(newName)) {
      //  debounce save name
      try {
        saveNameDebounce.current({
          name: newName,
          id: originalNameAndId?.id,
          xScreensList: screensList,
          xActiveScreen: activeScreen,
        });
      } catch (error) {
        errorToastify(
          "An error occured. Please try searching again after a while."
        );
        renameRef.current.innerText = originalNameAndId?.name;
      }
    }
  };

  const exitScreenName = () => {
    setRenameMode(false);
    const newName = renameRef.current.innerText;

    if (isNewNameBlank(newName)) {
      infoToastify("Screen name cannot be blank");
      renameRef.current.innerText = originalNameAndId?.name;
    }

    if (isNewNameExisting(newName) && nameChanged(newName)) {
      infoToastify("Name already exists in app");
      renameRef.current.innerText = originalNameAndId?.name;
    }
  };

  return (
    <>
      <div
        className={classes.elementButton}
        style={
          screen.id === activeScreen.id
            ? { borderWidth: 2.5, fontWeight: 700 }
            : {}
        }
        onClick={() => selectScreen(screen)}
        onDoubleClick={() => setPageInUieMode(screen)}
      >
        <div
          ref={renameRef}
          style={{
            padding: 5,
            borderRadius: 3,
            border: renameMode ? "inset 1px #999" : "solid 1px transparent",
            outline: "none",
          }}
          onClick={(e) => renameMode && e.stopPropagation()}
          onDoubleClick={(e) => renameMode && e.stopPropagation()}
          contentEditable={renameMode}
          onBlur={exitScreenName}
          onKeyDown={checkCharsOfScreenName}
          onKeyUp={saveScreenName}
        >
          {screen.name}
        </div>
        <IconButton
          onClick={(evt) =>
            handleMenuOptionsOpen({
              evt,
              screen,
            })
          }
        >
          <MoreVert style={{ color: "inherit" }} />
        </IconButton>
      </div>

      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        id={"entity-menu"}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        {Object.values(SCREEN_MENU_LIST).map((value, menuIndex) => (
          <MenuItem
            button
            key={menuIndex}
            disabled={
              value === SCREEN_MENU_LIST.Delete && screensList.length < 2
            }
            onClick={(e) => {
              e.stopPropagation();
              handleMenuClose();
              handleScreenActions(value.toLowerCase(), screen);
            }}
            style={{ fontWeight: 300, lineHeight: "19px" }}
          >
            {getMenuIcon(value)}
            <span style={{ textTransform: "capitalize" }}>{value}</span>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default EachScreenUnit;
