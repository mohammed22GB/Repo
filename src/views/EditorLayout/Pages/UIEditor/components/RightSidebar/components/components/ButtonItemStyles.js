import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Collapse,
  Divider,
  InputAdornment,
  InputBase,
  Tooltip,
  Typography,
} from "@material-ui/core";

import Selector from "../Selector";
import CornerHint from "../../../../../../../common/components/CornerHint/CornerHint";
import ColorPicker from "../../../../../../../common/components/ColorPicker";
import { v4 } from "uuid";

const ButtonItemStyles = React.memo(
  ({ activeSelection, screenStyles, onStyleChange }) => {
    const [showButtonAppearance, setShowButtonAppearance] = useState(false);

    const style = { ...screenStyles };

    const InputText = withStyles((theme) => ({
      input: {
        color: "#091540",
        borderRadius: 3,
        position: "relative",
        border: "1px solid #ABB3BF",
        fontSize: 11,
        padding: "5px 12px",
        transition: theme?.transitions.create(["border-color", "box-shadow"]),
      },
    }))(InputBase);

    const fontWeightSelection = [
      ["100", "Thin"],
      ["200", "Medium"],
      ["300", "Normal"],
      ["500", "Bold"],
      ["700", "Bolder"],
    ];
    const textAlignSelection = [
      ["left", "Left"],
      ["center", "Center"],
      ["right", "Right"],
    ];

    return (
      <div className="sidebar-section">
        <div
          className="sidebar-section-header"
          onClick={() => setShowButtonAppearance((prev) => !prev)}
        >
          <Typography>Button appearance</Typography>
          <span>{`[${showButtonAppearance ? "-" : "+"}]`}</span>
        </div>

        <Collapse in={showButtonAppearance}>
          <div className="section-subsection-cover">
            <span className="section-form-subsection">Dimensions</span>
          </div>

          <div className="sidebar-section-itemgroup">
            <div className="sidebar-section-item">
              <CornerHint hint="Enter 0 for 100%" />
              <Typography gutterBottom className="row-label">
                Width:
              </Typography>
              <InputText
                size="small"
                type="number"
                placeholder="(in px)"
                defaultValue={
                  style?.button?.width === "100%" ? 0 : style?.button?.width
                }
                endAdornment={
                  <InputAdornment position="end">px</InputAdornment>
                }
                onBlur={(e) =>
                  onStyleChange({
                    value: e.target.value == 0 ? "100%" : e.target.value,
                    root: "button",
                    property: "width",
                  })
                }
              />
            </div>
            <div className="sidebar-section-item">
              <Typography gutterBottom className="row-label">
                Height.:
              </Typography>
              <InputText
                size="small"
                type="number"
                placeholder="(in px)"
                defaultValue={style?.button?.height}
                endAdornment={
                  <InputAdornment position="end">px</InputAdornment>
                }
                onBlur={(e) =>
                  onStyleChange({
                    value: e.target.value,
                    root: "button",
                    property: "height",
                  })
                }
              />
            </div>
          </div>

          <div className="section-subsection-cover">
            <span className="section-form-subsection">Button Text</span>
          </div>

          <div className="sidebar-section-itemgroup">
            <div className="sidebar-section-item">
              <Typography gutterBottom className="row-label">
                F.Size:
              </Typography>
              <InputText
                size="small"
                type="number"
                placeholder="(in px)"
                // defaultValue={parseFloat(style?.button?.fontSize)}
                defaultValue={style?.button?.fontSize}
                endAdornment={
                  <InputAdornment position="end">px</InputAdornment>
                }
                onBlur={(e) =>
                  onStyleChange({
                    value: e.target.value,
                    root: "button",
                    property: "fontSize",
                  })
                }
              />
            </div>
            <div className="sidebar-section-item">
              <Typography gutterBottom className="row-label">
                F.Weight:
              </Typography>
              <Selector
                items={fontWeightSelection}
                onChange={(v) =>
                  onStyleChange({
                    value: v,
                    root: "button",
                    property: "fontWeight",
                  })
                }
                selectedValue={style?.button?.fontWeight}
              />
            </div>
            <div className="sidebar-section-item">
              <Typography gutterBottom className="row-label">
                F.Color:
              </Typography>
              <ColorPicker
                key={v4()}
                color={style?.button?.color}
                identity="fieldColor"
                colorCallback={(e) =>
                  onStyleChange({
                    value: e,
                    root: "button",
                    property: "color",
                  })
                }
              />
            </div>
            <div className="sidebar-section-item">
              <Typography gutterBottom className="row-label">
                T.Align:
              </Typography>
              <Selector
                items={textAlignSelection}
                onChange={(v) =>
                  onStyleChange({
                    value: v,
                    root: "button",
                    property: "textAlign",
                  })
                }
                selectedValue={style?.button?.textAlign}
              />
            </div>
          </div>

          <div className="section-subsection-cover">
            <span className="section-form-subsection">Border & Background</span>
          </div>

          <div className="sidebar-section-itemgroup">
            <div className="sidebar-section-item">
              <Typography gutterBottom className="row-label">
                B.Width:
              </Typography>
              <InputText
                size="small"
                type="number"
                placeholder="(in px)"
                defaultValue={style?.button?.borderWidth}
                endAdornment={
                  <InputAdornment position="end">px</InputAdornment>
                }
                onBlur={(e) =>
                  onStyleChange({
                    value: e.target.value,
                    root: "button",
                    property: "borderWidth",
                  })
                }
              />
            </div>
            <div className="sidebar-section-item">
              <Typography gutterBottom className="row-label">
                B.Radius:
              </Typography>
              <InputText
                size="small"
                type="number"
                placeholder="(in px)"
                defaultValue={style?.button?.borderRadius}
                endAdornment={
                  <InputAdornment position="end">px</InputAdornment>
                }
                onBlur={(e) =>
                  onStyleChange({
                    value: e.target.value,
                    root: "button",
                    property: "borderRadius",
                  })
                }
              />
            </div>

            <div className="sidebar-section-item">
              <Typography gutterBottom className="row-label">
                B.Color:
              </Typography>
              <ColorPicker
                key={v4()}
                color={style?.button?.borderColor}
                identity="borderColor"
                colorCallback={(e) =>
                  onStyleChange({
                    value: e,
                    root: "button",
                    property: "borderColor",
                  })
                }
              />
            </div>
            <div className="sidebar-section-item">
              <Typography gutterBottom className="row-label">
                Bg.Color:
              </Typography>
              <ColorPicker
                key={v4()}
                color={style?.button?.backgroundColor}
                identity="backgroundColor"
                colorCallback={(e) =>
                  onStyleChange({
                    value: e,
                    root: "button",
                    property: "backgroundColor",
                  })
                }
              />
            </div>
          </div>
        </Collapse>

        {/* <StyleOption
    fontSize={style?.label?.fontSize}
    fontWeight={titleCase(style?.label?.fontWeight)}
    textAlign={titleCase(style?.label?.textAlign)}
    color={style?.label?.color}
    selectedSize={(e) =>
      onStyleChange({ value: e, root: "label", property: "fontSize" })
    }
    selectedWeight={(e) =>
      onStyleChange({ value: e, root: "label", property: "fontWeight" })
    }
    selectedAlign={(e) =>
      onStyleChange({ value: e, root: "label", property: "textAlign" })
    }
    textColorCallback={(e) =>
      onStyleChange({ value: e, root: "label", property: "color" })
    }
  /> */}
      </div>
    );
  }
);
export default ButtonItemStyles;
