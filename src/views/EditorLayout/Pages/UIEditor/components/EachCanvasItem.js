import { ClickAwayListener, Tooltip } from "@material-ui/core";
import { useState } from "react";
import { BiCollapseHorizontal, BiExpandHorizontal } from "react-icons/bi";
import { BsArrowsExpand, BsArrowsExpandVertical, BsCopy } from "react-icons/bs";
import { RiDeleteBinLine, RiMenuFill, RiPaintBrushLine } from "react-icons/ri";
import { SCREEN_REUSE_ATTRIBUTES } from "../../../../common/utils/constants";
import RealComponents from "./RealComponents";

const EachCanvasItem = ({
  itemInfo,
  structChild,
  itemDetails,
  isItemVisible,
  isDocument,
  classes,
  hasMultiple,
  orientation,
  isExpanded,
  doCanvasAction,
  makeActiveItem,
  showProperties,
  ...props
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        ...(isDocument ? { paddingRight: 22 } : {}),
      }}
    >
      <ClickAwayListener onClickAway={() => setShowMenu(false)}>
        <div
          className={classes.cellMenu}
          onClick={() => setShowMenu(!showMenu)}
        >
          <RiMenuFill />
        </div>
      </ClickAwayListener>
      <div
        className={classes.elementsMenuOpened}
        style={{ display: showMenu ? "block" : "none" }}
      >
        <ul>
          {hasMultiple &&
            orientation === "horizontal" &&
            (isExpanded ? (
              <Tooltip title="Collapes width">
                <li
                  data-testid="canvas-item-menu-collapse-width"
                  onClick={() => doCanvasAction("expandWidth")}
                >
                  <BiCollapseHorizontal />
                </li>
              </Tooltip>
            ) : (
              <Tooltip title="Expand width">
                <li
                  data-testid="canvas-item-menu-expand-width"
                  onClick={() => doCanvasAction("expandWidth")}
                >
                  <BiExpandHorizontal />
                </li>
              </Tooltip>
            ))}
          <Tooltip title="Make horizontal group">
            <li
              data-testid="canvas-item-menu-horizontal-group"
              onClick={() => doCanvasAction("makeHorizantalGroup")}
            >
              <BsArrowsExpandVertical />
            </li>
          </Tooltip>
          <Tooltip title="Make vertical group">
            <li
              data-testid="canvas-item-menu-vertical-group"
              onClick={() => doCanvasAction("makeVerticalGroup")}
            >
              <BsArrowsExpand />
            </li>
          </Tooltip>
          <Tooltip title="Duplicate">
            <li
              data-testid="canvas-item-menu-duplicate"
              onClick={() => doCanvasAction("duplicate")}
            >
              <BsCopy />
            </li>
          </Tooltip>
          <Tooltip title="Customize">
            <li
              data-testid="canvas-item-menu-customize"
              onClick={() =>
                showProperties(structChild?.id, structChild?.itemType)
              }
            >
              <RiPaintBrushLine />
            </li>
          </Tooltip>
          <Tooltip title="Remove cell">
            <li
              data-testid="canvas-item-menu-remove"
              onClick={() => doCanvasAction("remove")}
            >
              <RiDeleteBinLine />
            </li>
          </Tooltip>
        </ul>
      </div>
      <div style={itemInfo?.style?.itemSection}>
        <RealComponents
          {...props}
          {...itemInfo}
          id={itemDetails?.id}
          name={itemDetails?.name}
          itemRef={structChild?.id}
          itemDetails={itemDetails}
          // validationFailed={props?.itemsValidationFailed?.[itemDetails?.id]}
          isDocument={isDocument}
          type={structChild?.itemType}
          returnedLookupObjValue={props.returnedLookupObj?.[itemDetails?.id]}
          val={props.screenReuseAttributes?.[itemDetails?.id]?.value}
          {...(props.screenReuseAttributes?.[itemDetails?.id]
            ? {
                readOnly:
                  props.screenReuseAttributes?.[itemDetails?.id]?.attribute ===
                  SCREEN_REUSE_ATTRIBUTES.READONLY,
              }
            : {})}
          appDesignMode={props.uieCanvasMode}

          // name={item?.name}
          // values={item?.values}
          // style={determineStyle(item)}
          // screenStyles={screenStyles}
          // customId={item?.customId || null}
          // customName={item?.customName || null}
        />
      </div>
      {!!props?.itemsValidationFailed?.[itemDetails?.id] && (
        <div
          style={{
            color: "#f50000",
            fontSize: 10,
            paddingTop: 5,
          }}
        >
          * required field
        </div>
      )}
    </div>
  );
};

export default EachCanvasItem;
