import React from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core";
import RealComponents from "../../RealComponents";
import { defaultStyles } from "../../../utils/defaultScreenStyles";
import { APP_DESIGN_MODES } from "../../../../../../common/utils/constants";

const Custom = ({ id, style, contents, customId, ...props }) => {
  const videoStyles = makeStyles((theme) => style);
  const classes = videoStyles();
  const thisCustomElement =
    props.customElements[customId]?.members ||
    props.canvasItems[id]?.customMembers ||
    {};

  const getDimension = () => {
    let top = 0;
    let bottom = 0;
    let left = 0;
    let right = 0;

    Object.keys(thisCustomElement).forEach((item, index) => {
      if (index === 0) {
        top = thisCustomElement[item].pos.y1;
        bottom = thisCustomElement[item].pos.y2;
        left = thisCustomElement[item].pos.x1;
        right = thisCustomElement[item].pos.x2;
      } else {
        top = Math.min(parseInt(thisCustomElement[item].pos.y1), top);
        bottom = Math.max(parseInt(thisCustomElement[item].pos.y2), bottom);
        left = Math.min(parseInt(thisCustomElement[item].pos.x1), left);
        right = Math.max(parseInt(thisCustomElement[item].pos.x2), right);
      }
    });

    const width = right - left;
    const height = bottom - top;

    return { top, bottom, left, right, width, height };
  };

  return (
    <div className={`${classes?.container} ${classes?.dimensions}`}>
      <div
        style={{
          position: "relative",
          width: getDimension().width,
          height: getDimension().height,
        }}
      >
        {Object.keys(thisCustomElement).map((item, index) => (
          <div
            key={index}
            // style={{ transform: `translate3d(${screenPreviewItems[item].counter[dd].pos.x1}px, ${screenPreviewItems[item].counter[dd].pos.y1}px, 0)`, }}
            // style={{ transform: `translate3d(${screenPreviewItems[item].counter[dd].pos.x1}px, ${screenPreviewItems[item].counter[dd].pos.y1}px, 0)`, }}
            style={{
              position: "absolute",
              left: thisCustomElement[item].pos.x1,
              top: thisCustomElement[item].pos.y1,
            }}
          >
            <RealComponents
              id={item}
              type={thisCustomElement[item].type}
              style={
                props.style
                  ? {
                      ...thisCustomElement[item].style,
                      appDesignMode: APP_DESIGN_MODES.EDIT,
                    }
                  : {
                      ...defaultStyles()[thisCustomElement[item].type],
                      appDesignMode: APP_DESIGN_MODES.EDIT,
                    }
              }
              customId={thisCustomElement[item].customId || null}
              customName={thisCustomElement[item].customName || null}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default connect((state) => {
  return {
    customElements: state.uieditor.customElements,
    canvasItems: state.uieditor.canvasItems,
    // customElements_: state.screens.customElements,
  };
})(Custom);
