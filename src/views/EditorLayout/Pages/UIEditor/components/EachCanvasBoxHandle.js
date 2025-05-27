import { ClickAwayListener, Tooltip } from "@material-ui/core";
import { useState } from "react";
import {
  RiDeleteBinLine,
  RiRepeat2Fill,
  RiPaintBrushLine,
  RiMoreFill,
  RiLayoutRowLine,
  RiLayoutColumnLine,
} from "react-icons/ri";
import {
  BsArrowsCollapse,
  BsArrowsCollapseVertical,
  BsCopy,
} from "react-icons/bs";

const EachCanvasBoxHandle = ({
  level,
  providedG,
  classes,
  orientation,
  hasMultiple,
  doCanvasAction,
  showProperties,
}) => {
  const [showHandleMenu, setShowHandleMenu] = useState(false);

  return (
    <div {...providedG.dragHandleProps} className={classes.boxHandles}>
      <ClickAwayListener onClickAway={() => setShowHandleMenu(false)}>
        <div
          style={{
            position: "absolute",
            right: 5,
            cursor: "pointer",
          }}
          onClick={() => setShowHandleMenu(true)}
        >
          {level > 2 && <RiMoreFill style={{ fontSize: 20 }} />}
        </div>
      </ClickAwayListener>
      <div
        className={classes.elementsMenuOpened}
        style={{
          display: showHandleMenu ? "block" : "none",
        }}
      >
        <ul>
          <Tooltip
            title={`Switch to ${
              orientation === "horizontal" ? "vertical" : "horizontal"
            }`}
          >
            <li onClick={() => doCanvasAction("switchOrientation")}>
              <RiRepeat2Fill />
            </li>
          </Tooltip>
          {!hasMultiple &&
            (orientation === "horizontal" ? (
              <Tooltip title="Make single cell">
                <li onClick={() => doCanvasAction("makeSingleCell")}>
                  <BsArrowsCollapseVertical />
                </li>
              </Tooltip>
            ) : (
              <Tooltip title="Make single cell">
                <li onClick={() => doCanvasAction("makeSingleCell")}>
                  <BsArrowsCollapse />
                </li>
              </Tooltip>
            ))}
          <Tooltip title="Duplicate section">
            <li onClick={() => doCanvasAction("duplicate")}>
              <BsCopy />
            </li>
          </Tooltip>
          <Tooltip title="Customize">
            <li onClick={showProperties}>
              <RiPaintBrushLine />
            </li>
          </Tooltip>
          <Tooltip title="Remove section">
            <li onClick={() => doCanvasAction("remove")}>
              <RiDeleteBinLine />
            </li>
          </Tooltip>
        </ul>
      </div>
      <span style={{ letterSpacing: "-4px" }}>====</span>
      {orientation === "horizontal" ? (
        <RiLayoutColumnLine style={{ marginRight: -3 }} />
      ) : (
        <RiLayoutRowLine style={{ marginRight: -3 }} />
      )}
      <span style={{ letterSpacing: "-4px" }}>====</span>
    </div>
  );
};

export default EachCanvasBoxHandle;
