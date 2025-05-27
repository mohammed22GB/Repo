import React, { useEffect, useRef, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core";
import { Droppable, Draggable } from "react-beautiful-dnd";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import { Lock } from "@material-ui/icons";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { setActiveItem, updateUieCanvas } from "../../utils/uieditorHelpers";

import { APP_RUN_MAX_WIDTH } from "../../../Workflow/components/utils/constants";
import EachCanvasItem from "../EachCanvasItem";
import EachCanvasBoxHandle from "../EachCanvasBoxHandle";
import ErrorBoundary from "../../../../../common/components/ProtectedRoute/ErrorBoundary";
import GeneralError from "../../../../../common/components/ProtectedRoute/components/GeneralError";
import { rHideRightSideBar } from "../../../../../../store/actions/properties";
import UieCanvasPageHeader from "../UieCanvasPageHeader";
import ScreenButtons from "../actualObjects/ScreenButtons";
import {
  getUieResultantStyles,
  getUieResultantValues,
} from "../../../../../common/helpers/helperFunctions";
import CustomConfirmBox from "../../../../../common/components/CustomConfirmBox/CustomConfirmBox";
import { APP_DESIGN_MODES } from "../../../../../common/utils/constants";
import LoadingScreen2 from "../../../../../Run/LoadingScreen2";

const UIEditorCanvas = (props) => {
  const {
    canvasStructure,
    dragStart,
    screensItems,
    activeItem,
    uieCanvasMode,
  } = useSelector(({ uieditor }) => uieditor);
  const { activeScreen } = useSelector(({ screens }) => screens);
  const screenItems = Object?.values(screensItems?.[activeScreen?.id] || []);

  const dispatch = useDispatch();

  const getScreenItemStylesValues = ({ id: itemRef, itemType }) => {
    const itemProperties = screensItems?.[activeScreen?.id]?.[itemRef];

    const style = {
      ...getUieResultantStyles(itemProperties || {}, activeScreen || {}),
    };
    const values = {
      ...getUieResultantValues(itemProperties || {}, itemType, uieCanvasMode),
    };

    return {
      style,
      values,
    };
  };

  const screenStyles = getScreenItemStylesValues({})?.style;

  const useStyles = makeStyles((theme) => ({
    app: {
      fontFamily: "Inter",
      zoom: props.zoomLevel / 100,
      marginTop:
        props.uiEditorFullScreen || uieCanvasMode === APP_DESIGN_MODES.LIVE
          ? 0
          : 100,
      margin: `auto`,
      backgroundColor: screenStyles?.page?.backgroundColor || "#FCFCFC",

      ...(activeScreen?.type === "document"
        ? {
            width:
              parseFloat(screenStyles?.page?.width) *
              (screenStyles?.page?.dimensionMeasure === "inch" ? 96 : 1),
            height:
              parseFloat(screenStyles?.page?.height) *
              (screenStyles?.page?.dimensionMeasure === "inch" ? 96 : 1),
          }
        : {
            maxWidth:
              uieCanvasMode === APP_DESIGN_MODES.LIVE
                ? "unset"
                : APP_RUN_MAX_WIDTH,
            minWidth:
              uieCanvasMode === APP_DESIGN_MODES.LIVE
                ? "unset"
                : APP_RUN_MAX_WIDTH,
            padding: 10,
            height: "100%",
          }),
    },
    dropZone: {
      // maxWidth: 890,
      width: "100%",
      minHeight: "75vh",
      background: "transparent",
      paddingBottom: 95,
    },
    drop: {
      width: "100%",
      height: "inherit",
      minHeight: "80vh",
      overflow: "hidden",
      position: "relative",
      boxShadow: "0 0 20px #eee",
      ...(activeScreen?.type === "document"
        ? {
            paddingRight:
              parseFloat(screenStyles?.page?.horizontalMargin) *
              (screenStyles?.page?.dimensionMeasure === "inch" ? 96 : 1),
            paddingLeft:
              parseFloat(screenStyles?.page?.horizontalMargin) *
              (screenStyles?.page?.dimensionMeasure === "inch" ? 96 : 1),
            paddingTop:
              parseFloat(screenStyles?.page?.verticalMargin) *
              (screenStyles?.page?.dimensionMeasure === "inch" ? 96 : 1),
            paddingBottom:
              parseFloat(screenStyles?.verticalMargin) *
              (screenStyles?.page?.dimensionMeasure === "inch" ? 96 : 1),
          }
        : {
            padding: "10px 10px 60px 10px",
          }),
    },
    container: {
      position: "relative",
      height: "inherit",
      display: "flex",
      justifyContent: "space-between",
      backgroundColor: "transparent",
    },
    elements_container: {
      width: "30%",
    },
    elements: {
      userSelect: "none",
      width: 100,
      display: "flex",
      flexDirection: "column",
      padding: 5,
    },
    boxHandles: {
      position: "relative",
      // backgroundColor: "rgb(161 173 131)",
      backgroundColor: "rgb(141 154 107)",
      textAlign: "center",
      lineHeight: "11px",
      color: "#ffffff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 5,
      ...(uieCanvasMode !== APP_DESIGN_MODES.EDIT ? { display: "none" } : {}),
      "& $elementsMenuOpened": {
        backgroundColor: "#778357",
        color: "#000000",
        left: "unset",
        top: 0,
        right: 20,
        zIndex: 1,
      },
    },
    cell: {
      position: "relative",
      "&:hover $cellMenu": {
        display: uieCanvasMode !== APP_DESIGN_MODES.EDIT ? "none" : "flex",
      },
    },
    cellMenu: {
      position: "absolute",
      top: -5,
      left: -4,
      backgroundColor: "#2a6fff",
      color: "#ffffff",
      boxShadow: "0 0 3px #aaaaaa",
      cursor: "pointer",
      display: "none",
      justifyContent: "center",
      alignItems: "center",
      padding: 3,
      zIndex: 1,
    },
    elementsMenuOpened: {
      position: "absolute",
      top: -6,
      left: 18,
      zIndex: 1,

      padding: "3px 5px",
      backgroundColor: "#008AFF",
      borderRadius: 4,
      // display: "none",
      "& > ul": {
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "flex",
        gap: 5,
      },
      "& > ul > li": {
        // backgroundColor: "#ffffff",
        // boxShadow: "0 0 3px #000000",
        color: "#ffffff",
        width: 20,
        height: 20,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
      },
    },
    placeholder: {
      height: 40,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontWeight: 600,
      color: "#8d9a6b",
      textShadow: "0 0 3px #fff",
    },
  }));
  const classes = useStyles();

  const [isNotDroppable, setIsNotDroppable] = useState({ master: true });
  const [showDeleteSectionDialog, setShowDeleteSectionDialog] = useState(false);
  const [preDialogData, setPreDialogData] = useState(null);
  const subscribedActiveScreenId = useRef(null);

  useEffect(() => {
    determineDroppables(dragStart || {});
  }, [dragStart]);

  useEffect(() => {
    //when the screenId changes, call the initiateCustomValidationSetup
    const shouldInitiateCustomValidation =
      activeScreen?.id !== subscribedActiveScreenId.current &&
      props?.initiateCustomValidationSetup &&
      !!screenItems?.length;

    if (shouldInitiateCustomValidation) {
      props.initiateCustomValidationSetup(screenItems);
      subscribedActiveScreenId.current = activeScreen?.id;
    }
  }, [screenItems]);

  const getCanvasListStyle = (isDraggingOver) =>
    isDraggingOver
      ? {
          border: "solid 2px #0000e2",
        }
      : {};

  const getCanvasItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    // padding: grid * 2,
    // margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? "rgb(247 250 240)" : "transparent",
    ...(isDragging ? { maxWidth: "fit-content" } : {}),
    border:
      uieCanvasMode !== APP_DESIGN_MODES.EDIT
        ? "none"
        : "2px dashed rgb(223 223 223)",
    flex: 1,
    width: "100%",
    overflowWrap: "break-word",

    // styles we need to apply on draggables
    ...draggableStyle,
  });

  const determineDroppables = ({ source }) => {
    const isDroppablesState = {
      ...isNotDroppable,
      ...(source?.droppableId === "app-container"
        ? { master: false }
        : { master: true }),
    };
    setIsNotDroppable(isDroppablesState);
  };

  const checkDisallowDroppable = (breadcrumb, isGroup) => {
    let denied = false;
    const targetLevel = breadcrumb?.split("-")?.length;

    const sourceCrumb = dragStart?.draggableId?.replace("draggableId-", "");
    const sourceParentCrumb = dragStart?.source?.droppableId?.replace(
      "droppableId-",
      ""
    );

    const isDraggingGroup = () => {
      const sourceCrumbArray = sourceCrumb?.split("-");

      let currentStructure = { ...(canvasStructure || {}) };
      let iter = 0;

      do {
        currentStructure = currentStructure.children[sourceCrumbArray[iter]];
        iter++;
      } while (iter >= sourceCrumbArray.length);

      return !!currentStructure?.children?.length;
    };

    if (breadcrumb === sourceCrumb) return true;
    if (dragStart?.source?.droppableId?.includes("Elements")) return false;
    if (!dragStart?.draggableId?.includes("draggableId-")) return false;
    if (breadcrumb === sourceParentCrumb) return false;
    if (targetLevel > 2 && isDraggingGroup()) denied = true;

    // if (isDraggingGroupIntoGroup()) denied = true;

    return denied;
  };

  const dialogResponse = (resp, clearDialog = true) => {
    if (resp === true) {
      const { breadcrumb, id, type, index, action } = preDialogData;
      doCanvasAction(breadcrumb, id, type, index, action, true);
      setPreDialogData(null);
    }

    if (clearDialog) {
      setShowDeleteSectionDialog(false);
    }
  };

  const doCanvasAction = (breadcrumb, id, type, index, action, confirmed) => {
    if (action === "remove" && type === "section" && !confirmed) {
      setPreDialogData({ breadcrumb, id, type, index, action });
      setShowDeleteSectionDialog(true);
      return;
    }

    dispatch(updateUieCanvas({ action, breadcrumb, index, type }));
  };

  const makeActiveItem = (itemRef, itemType, sectionStyle) => {
    dispatch(setActiveItem({ itemRef, type: itemType, sectionStyle }));
  };

  const showProperties = (itemRef, itemType, sectionStyle) => {
    if (itemType === "section") {
      makeActiveItem(itemRef, itemType, sectionStyle);
    }
    dispatch(rHideRightSideBar(false));
  };

  const constructCanvas = (structure, level, breadcrumb) =>
    !!canvasStructure && !Object.keys(canvasStructure || {}).length ? (
      <LoadingScreen2 />
    ) : !structure?.children?.length && !!canvasStructure ? (
      <Draggable
        key={"placeholder-xx"}
        draggableId={"placeholder-xx"}
        index={1}
        isDragDisabled={uieCanvasMode !== APP_DESIGN_MODES.EDIT}
      >
        {(provided, snapshot) => {
          return (
            <div
              className={classes.cell}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={{
                ...getCanvasItemStyle(
                  snapshot.isDragging,
                  provided.draggableProps.style
                ),
                flex: 1,
              }}
            >
              {uieCanvasMode !== APP_DESIGN_MODES.EDIT ? null : (
                <div
                  className="uieditor-placeholder-cell"
                  data-testid="ui-canvas"
                >
                  Drag item here
                </div>
              )}
            </div>
          );
        }}
      </Draggable>
    ) : (
      structure?.children?.map((structChild, index, thisArray) => {
        const currentCrumb = `${breadcrumb}-${index}`;
        return !!structChild?.children ? (
          <Draggable
            key={currentCrumb}
            draggableId={`draggableId-${currentCrumb}`}
            index={index}
            isDragDisabled={
              uieCanvasMode !== APP_DESIGN_MODES.EDIT ||
              (level === 0 && structure?.children?.length === 1)
            }
          >
            {(providedG, snapshotG) => (
              <div
                ref={providedG.innerRef}
                {...providedG.draggableProps}
                // {...providedG.dragHandleProps}
                style={{
                  ...getCanvasItemStyle(
                    snapshotG.isDragging,
                    providedG.draggableProps.style
                  ),
                }}
              >
                <EachCanvasBoxHandle
                  level={currentCrumb?.split("-")?.length}
                  sectionId={currentCrumb}
                  providedG={providedG}
                  classes={classes}
                  orientation={structChild?.orientation}
                  hasMultiple={structChild?.children?.length > 1}
                  showProperties={() =>
                    showProperties(currentCrumb, "section", structChild?.style)
                  }
                  doCanvasAction={(action) =>
                    doCanvasAction(
                      currentCrumb,
                      structChild?.id,
                      "section",
                      index,
                      action
                    )
                  }
                />

                <div
                  style={
                    structChild?.style?.overrideDefault
                      ? structChild?.style
                      : {}
                  }
                >
                  <Droppable
                    key={currentCrumb}
                    droppableId={`droppableId-${currentCrumb}`}
                    direction={structChild?.orientation || "vertical"}
                    // isDropDisabled={!isNotDroppable.master}
                    isDropDisabled={checkDisallowDroppable(currentCrumb)}
                  >
                    {(providedP, snapshotP) => (
                      <div
                        ref={providedP.innerRef}
                        style={{
                          ...getCanvasListStyle(snapshotP.isDraggingOver),
                          display: "flex",
                          gap:
                            (activeScreen?.style?.page?.overrideDefault &&
                              activeScreen?.style?.page?.gap) ||
                            15,
                          flexDirection:
                            structChild?.orientation === "horizontal"
                              ? "row"
                              : "column",
                        }}
                        {...providedP.droppableProps}
                      >
                        {constructCanvas(structChild, level++, currentCrumb)}
                        {providedP.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            )}
          </Draggable>
        ) : (
          <Draggable
            key={structChild?.id}
            draggableId={structChild?.id}
            index={index}
            isDragDisabled={uieCanvasMode !== APP_DESIGN_MODES.EDIT}
          >
            {(provided, snapshot) => {
              const isExpanded = structure?.expandWidthCellIndex === index;
              const itemDetailsAndVisibility =
                props?.getEachItemDetailsAndVisibility && !!structChild?.id
                  ? props.getEachItemDetailsAndVisibility(structChild?.id)
                  : { itemDetails: {}, isItemVisible: true };

              return (
                <div
                  className={classes.cell}
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={{
                    ...getCanvasItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    ),
                    display: itemDetailsAndVisibility.isItemVisible
                      ? "block"
                      : "none",
                    flex: isExpanded ? 2 : 1,
                    ...(structChild?.id === activeItem.itemRef &&
                    structChild?.cellType !== "placeholder"
                      ? {
                          boxShadow: "rgb(112 122 85 / 29%) 0px 0px 4px",
                          border: "2px dashed rgb(137 160 74)",
                        }
                      : {}),
                  }}
                  onDoubleClick={() =>
                    uieCanvasMode === APP_DESIGN_MODES.EDIT &&
                    structChild?.cellType !== "placeholder" &&
                    showProperties(structChild?.id, structChild?.itemType)
                  }
                  onClick={() =>
                    uieCanvasMode === APP_DESIGN_MODES.EDIT &&
                    structChild?.cellType !== "placeholder" &&
                    makeActiveItem(structChild?.id, structChild?.itemType)
                  }
                >
                  {structChild?.cellType === "placeholder" ? (
                    uieCanvasMode !== APP_DESIGN_MODES.EDIT ? null : (
                      <div
                        className="uieditor-placeholder-cell"
                        data-testid="ui-canvas"
                      >
                        Drag item here
                      </div>
                    )
                  ) : (
                    <EachCanvasItem
                      {...props}
                      itemInfo={getScreenItemStylesValues(structChild || {})}
                      itemDetails={itemDetailsAndVisibility.itemDetails}
                      structChild={structChild}
                      classes={classes}
                      orientation={structure?.orientation}
                      hasMultiple={thisArray.length > 1}
                      isExpanded={isExpanded}
                      isDocument={props.isDocument}
                      uieCanvasMode={props.uieCanvasMode || uieCanvasMode}
                      showProperties={showProperties}
                      screenItems={screenItems}
                      doCanvasAction={(action) =>
                        doCanvasAction(
                          breadcrumb,
                          structChild?.id,
                          "cell",
                          index,
                          action
                        )
                      }
                    />
                  )}
                </div>
              );
            }}
          </Draggable>
        );
      })
    );

  return (
    <ErrorBoundary render={() => <GeneralError section="editors" />}>
      <div
        data-testid="ui-editor-canvas"
        className={classes?.app}
        style={{
          padding:
            (activeScreen?.style?.page?.overrideDefault &&
              activeScreen?.style?.page?.padding) ||
            10,
          background:
            (activeScreen?.style?.page?.overrideDefault &&
              activeScreen?.style?.page?.backgroundColor) ||
            "#fcfcfc",
        }}
      >
        <div className={classes?.container}>
          {uieCanvasMode === APP_DESIGN_MODES.PREVIEW && (
            <div
              style={{
                position: "fixed",
                top: 109,
                left: 300,
                width: 70,
                height: 70,
                zIndex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#00000052",
                color: "#ffffff",
                fontWeight: 700,
                borderRadius: 10,
              }}
            >
              <Lock style={{ fontSize: 30 }} />
            </div>
          )}
          <div className={classes?.dropZone}>
            {!!canvasStructure ? (
              <>
                <UieCanvasPageHeader screen={activeScreen} />

                <Droppable
                  droppableId={"app-container"}
                  direction={canvasStructure?.orientation}
                  isDropDisabled={isNotDroppable.master}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        display: "flex",
                        flexDirection:
                          canvasStructure?.orientation === "horizontal"
                            ? "row"
                            : "column",
                        height: "100%",
                        gap: 20,
                      }}
                    >
                      {constructCanvas(canvasStructure, 1, 0)}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                {uieCanvasMode !== APP_DESIGN_MODES.EDIT && (
                  <ScreenButtons
                    {...props}
                    appDesignMode={uieCanvasMode}
                    values={{
                      button1Type: "back",
                      button1Text: "Back",
                      button2Type: "next",
                      button2Text: "Next",
                      customButton2Name: `${
                        props?.screenButton2Name ?? "Not Specified"
                      }`,
                    }}
                  />
                )}
              </>
            ) : (
              <div
                style={{
                  height: "100%",
                  paddingBottom: 50,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <CloudOffIcon style={{ color: "#aaaaaa", fontSize: 80 }} />
                <div style={{ color: "#666666", marginTop: 20 }}>
                  Check your connection and refresh the page
                </div>
              </div>
            )}
          </div>
        </div>
        {!!showDeleteSectionDialog && (
          <CustomConfirmBox
            closeConfirmBox={() => dialogResponse(false, true)}
            type="warning"
            text={"This will remove all contents of this section. Proceed?"}
            open={!!showDeleteSectionDialog}
            confirmAction={() => dialogResponse(true, true)}
          />
        )}
      </div>
    </ErrorBoundary>
    // </div>
  );
};

export default connect((state) => {
  return {
    undoMode: state.uieditor.undoMode,
    zoomLevel: state.uieditor.zoomLevel,
    showDialog: state.reducers.showDialog,
    uiEditorFullScreen: state.uieditor.uiEditorFullScreen,
  };
})(UIEditorCanvas);
