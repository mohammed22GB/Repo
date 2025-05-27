import { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import {
  Button,
  ClickAwayListener,
  Collapse,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import {
  manageAppLocalStorage,
  wrapAPI,
} from "../../../../common/helpers/helperFunctions";
import {
  rUieSetCanvasStructure,
  rUpdateScreensList,
  rSaveActiveScreen,
  rUieSetCanvasMode,
  rHideRightSideBar,
} from "../../../../../store/actions/properties";
import UiePanelSearchBar from "./UiePanelSearchBar";
import ElementTiles from "./ElementTiles";
import { ChevronLeft, Settings } from "@material-ui/icons";
import EachScreenUnit from "./EachScreenUnit";
import { debounce } from "lodash";
import { updateScreen } from "../utils/screenAPIs";
import {
  APP_DESIGN_MODES,
  DEBOUNCE_TIME,
} from "../../../../common/utils/constants";
import {
  createAndAddScreen,
  deleteScreenAndUpdate,
  duplicateAndAddScreen,
  getSearchedElements,
  setActiveItem,
} from "../utils/uieditorHelpers";
import CustomConfirmBox from "../../../../common/components/CustomConfirmBox/CustomConfirmBox";
import { getAllActiveScreenItems } from "../utils/screenUtilities";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "99%",
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",

    width: 240,
    minWidth: 240,
    position: "fixed",
    top: 0,
    left: 0,
    marginLeft: 50,
    zIndex: 1,
    backgroundColor: "#ffffff",
    borderRight: "solid 1px #b8b8b8",
  },
  buttonTabs: {
    textTransform: "capitalize",
    background: "#424874",
    color: "#E7E9EE",
    minWidth: "fit-content",
  },
  selected: {
    background: "#010A43",
    color: "#fff",
  },
  panel: {
    position: "relative",
    // overflowY: "scroll",
    // overflowX: "clip",
    width: "100%",
    height: "100%",
    flex: "1 1 0%",
    // marginTop: 16,
    "& .MuiBox-root": {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },

  elementButton: {
    border: "solid 0.5px #2457c1",
    margin: "0 3px",
    background: "transparent",
    boxShadow: "0px 2px 6px 0px #71717140",
    borderRadius: 5,
    height: 48,
    marginBottom: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 11,
    fontSize: 13,
    fontWeight: 500,
    userSelect: "none",
    "&:hover": {
      cursor: "pointer",
      background: "#2457c1",
      color: "#ffffff",
      "& button": {
        color: "#ffffff",
      },
    },
  },
  heading: {
    color: "#ABB3BF",
    fontSize: 14,
    maxWidth: "85%",
  },
  keepMargin: {
    margin: "12px 0 !important",
  },
  tileSpacing: {
    marginBottom: 10,
    borderRadius: 3,
    // background: "#010A43",
    "&::before": {
      position: "unset",
    },
    normalMargin: {
      marginTop: "0 !important",
      marginBottom: "10px !important",
    },
    cursor: "pointer",
    "&:hover": {
      background: "#0c7b93", //"#151c4b"
    },
    "&:hover span": {
      color: "#ffffff !important",
    },
  },
  normalHeight: {
    minHeight: "50px !important",
  },
  newEntity: {
    color: "#fff",
    background: "#010A43",
    fontSize: "0.8rem",
  },

  grid: {
    background: "#2457C1",
    width: "100%",
    // marginBottom: "26px",
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    textTransform: "capitalize",
    fontSize: 10,
    fontWeight: 600,
  },
  select: {
    color: "#091540",
    fontSize: 12,
    padding: 10,
    // width: "100",
  },
  newScreenMenu: {
    border: "solid #b8b8b8",
    borderWidth: "1px 0",
    textAlign: "center",
    fontSize: 12,
    boxShadow: "0 0 5px -2px #2457c1",
    margin: -5,
    marginTop: -10,
    marginBottom: 20,
    "& > div": {
      padding: 7,
      "&:hover": {
        backgroundColor: "#e3e9f7",
        fontWeight: 600,
        cursor: "pointer",
      },
    },
  },
}));

const UieComponentsPanel = (props) => {
  const { activeScreen, screensList } = useSelector(({ screens }) => screens);
  const { uieCanvasMode } = useSelector(({ uieditor }) => uieditor);
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const [currentAppId, setCurrentAppId] = useState(null);
  const [hasUpdate, setHasUpdate] = useState(false);
  const [isAppRegistered, setIsAppRegistered] = useState(false);
  const [screenSearchText, setScreenSearchText] = useState("");
  const [isSearchingElements, setIsSearchingElements] = useState(false);
  const [showNewScreenMenu, setShowNewScreenMenu] = useState(false);
  const [toDeleteScreenId, setToDeleteScreenId] = useState(null);
  const [showDeleteScreenDialog, setShowDeleteScreenDialog] = useState(false);
  const [shakeABit, setShakeABit] = useState(false);
  const dispatchAction = useRef();
  const trackRerender = useRef(false);

  const buttonCallback = props.buttonCallback;

  const _useDispatch = (dispatchAction.current = dispatch);

  useEffect(() => {
    const appId = location.pathname.split("/")[2];
    setCurrentAppId(appId);
  }, [location.pathname]);

  useEffect(() => {
    if (uieCanvasMode !== APP_DESIGN_MODES.EDIT) {
      //  force close of rightsidebar
      dispatch(rHideRightSideBar(true));
    }

    if (
      !uieCanvasMode ||
      (screensList.length &&
        !screensList.some((screen) => screen.id === activeScreen.id))
    ) {
      const isNew = manageAppLocalStorage("get", currentAppId, "isNew");
      const designMode = isNew
        ? APP_DESIGN_MODES.EDIT
        : APP_DESIGN_MODES.PREVIEW;

      dispatch(rUieSetCanvasMode(designMode));
      dispatch(setActiveItem({ clear: true }));
      manageAppLocalStorage("set", currentAppId, "uieCanvasMode", designMode);
    }
  }, [uieCanvasMode, activeScreen, screensList]);

  useEffect(() => {
    //if (props.panelType !== "list" || !isAppRegistered) return;
    if (props.panelType !== "list") return;

    if (props.page && !!currentAppId) {
      props.panelActions.fetchAllAndSetDefaultEntity(
        props.page,
        _useDispatch,
        currentAppId,
        hasUpdate,
        history
      );

      if (!trackRerender.current) {
        trackRerender.current = true;
        setHasUpdate((prev) => !prev);
      } else {
        trackRerender.current = false;
      }
    }
  }, [hasUpdate, isAppRegistered]);

  const updateGlobalState = ({ id, name }, xActiveScreen, xScreensList) => {
    const updatedScreensList = [...xScreensList].map((screen) => {
      if (screen.id === id) {
        screen.name = name;
      }
      return screen;
    });

    dispatch(rUpdateScreensList(updatedScreensList));

    if (xActiveScreen.id === id) {
      const updatedActiveScreen = { ...xActiveScreen };
      updatedActiveScreen.name = name;

      dispatch(rSaveActiveScreen(updatedActiveScreen));
    }
  };

  const saveScreenNameDebounce = useRef(
    debounce(async ({ id, name, xScreensList, xActiveScreen }) => {
      //  Save to DB
      await dispatch(
        wrapAPI(updateScreen, "Screen name updated successfully", {
          id,
          name,
          requestSource: "UI Editor",
          category: "Screen",
          callback: updateGlobalState(
            { id, name },
            xActiveScreen,
            xScreensList
          ),
        })
      );
    }, DEBOUNCE_TIME)
  );

  const createNewScreen = async (screenType) => {
    dispatch(createAndAddScreen(screenType));
    setShowNewScreenMenu(false);
  };

  const duplicateSelectedScreen = async (screenId) => {
    dispatch(duplicateAndAddScreen(screenId));
  };

  const deleteSelectedScreen = () => {
    dispatch(deleteScreenAndUpdate(toDeleteScreenId));
    setToDeleteScreenId(null);
  };

  const dialogResponse = (resp, clearDialog = true) => {
    if (resp === true) {
      deleteSelectedScreen();
    }

    if (clearDialog) {
      setShowDeleteScreenDialog(false);
    }
  };

  const selectScreen = (screen) => {
    dispatch(getAllActiveScreenItems(screen?.id));
    dispatch(rSaveActiveScreen(screen));
    dispatch(rUieSetCanvasStructure(screen.layout));
    manageAppLocalStorage("set", currentAppId, "activeScreen", {
      id: screen.id,
      name: screen.name,
      type: screen.type,
      slug: screen.slug,
    });
  };

  const updatePageInScreenMode = (mode) => {
    dispatch(rUieSetCanvasMode(mode));
    dispatch(setActiveItem({ clear: true }));
    manageAppLocalStorage("set", currentAppId, "uieCanvasMode", mode);
  };

  const openPageProperties = (e) => {
    e.stopPropagation();
    dispatch(setActiveItem({ itemRef: null, type: "screen" }));
    dispatch(rHideRightSideBar(false));
  };

  const setElementsSearchText = (searchText) => {
    setIsSearchingElements(!!searchText);
    dispatch(getSearchedElements(searchText));
  };

  const ScreensMode = (
    <div style={{ padding: "0 5px", overflow: "auto" }}>
      <div style={{ paddingBottom: 10 }}>
        <Button
          variant="contained"
          color="secondary"
          className={classes.grid}
          startIcon={<AddIcon />}
          id="basic-button"
          onClick={() => setShowNewScreenMenu(true)}
          style={{ fontSize: 12 }}
        >
          New screen
        </Button>
      </div>
      <Collapse in={showNewScreenMenu}>
        {showNewScreenMenu && (
          <ClickAwayListener onClickAway={() => setShowNewScreenMenu(false)}>
            <div className={classes.newScreenMenu}>
              <div
                style={{ borderBottom: "solid 1px #b8b8b8" }}
                onClick={() => createNewScreen("app")}
              >
                App screen
              </div>
              <div onClick={() => createNewScreen("document")}>Document</div>
            </div>
          </ClickAwayListener>
        )}
      </Collapse>
      <div style={{ paddingBottom: 10 }}>
        <UiePanelSearchBar
          setSearch={setScreenSearchText}
          placeholder="Search screens"
        />
      </div>

      <Tooltip title="Double-click to edit design">
        <div>
          {screensList
            ?.filter((screen) =>
              screen?.name?.toLowerCase().includes(screenSearchText)
            )
            ?.map((screen, index) => (
              <EachScreenUnit
                key={index}
                screen={screen}
                activeScreen={activeScreen}
                setUieCanvasMode={() =>
                  updatePageInScreenMode(APP_DESIGN_MODES.EDIT)
                }
                selectScreen={selectScreen}
                screensList={screensList}
                saveNameDebounce={saveScreenNameDebounce}
                duplicateSelectedScreen={duplicateSelectedScreen}
                deleteSelectedScreen={(screenId) => {
                  setToDeleteScreenId(screenId);
                  setShowDeleteScreenDialog(true);
                }}
                classes={classes}
              />
            ))}
        </div>
      </Tooltip>
    </div>
  );

  const UieMode = (
    <>
      <div
        style={{
          position: "relative",
          height: 41,
          minHeight: 41,
          border: "solid #b8b8b8",
          borderWidth: "1px 0",
          margin: "0 5px 10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 12,
          fontWeight: 800,
          color: "#2457c1",
          cursor: "pointer",
        }}
        onClick={() => updatePageInScreenMode(APP_DESIGN_MODES.PREVIEW)}
        onMouseEnter={() => setShakeABit(true)}
        onMouseLeave={() => setShakeABit(false)}
      >
        <ChevronLeft
          className={shakeABit ? "shake" : ""}
          style={{ position: "absolute", left: 6, fontSize: 26 }}
        />
        <span
          style={{
            maxWidth: 170,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {activeScreen?.name}
        </span>
        <Tooltip title="Screen properties">
          <IconButton
            style={{ position: "absolute", right: 0, fontSize: 16 }}
            onClick={openPageProperties}
          >
            <Settings />
          </IconButton>
        </Tooltip>
      </div>
      <div
        style={{
          padding: "0 5px",
          marginBottom: 10,
        }}
      >
        <UiePanelSearchBar
          setSearch={setElementsSearchText}
          placeholder="Search components"
        />
      </div>
      <div autoHide style={{ height: "100%", margin: "0 5px" }}>
        <ElementTiles
          panelData={props.panelData}
          buttonCallback={buttonCallback}
          searching={isSearchingElements}
        />
      </div>
    </>
  );

  return (
    <div className={classes.root}>
      <div
        style={{
          color: "#000000",
          fontSize: 16,
          textAlign: "center",
          // padding: "10px 0 30px",
          fontWeight: 500,

          height: 60,
          minHeight: 60,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* {props.panelData.panelHeader} */}
        {uieCanvasMode === APP_DESIGN_MODES.PREVIEW && "Screens"}
        {uieCanvasMode === APP_DESIGN_MODES.EDIT && "Components"}
      </div>

      {uieCanvasMode === APP_DESIGN_MODES.PREVIEW && ScreensMode}
      {uieCanvasMode === APP_DESIGN_MODES.EDIT && UieMode}

      {!!showDeleteScreenDialog && (
        <CustomConfirmBox
          closeConfirmBox={() => dialogResponse(false, true)}
          type="warning"
          text={`Are you sure you want to delete this screen (${
            screensList?.find((screen) => screen.id === toDeleteScreenId)?.name
          })?`}
          open={!!showDeleteScreenDialog}
          confirmAction={() => dialogResponse(true, true)}
        />
      )}
    </div>
  );
};

export default UieComponentsPanel;
