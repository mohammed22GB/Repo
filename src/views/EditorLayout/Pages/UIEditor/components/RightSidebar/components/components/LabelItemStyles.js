import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Collapse,
  InputAdornment,
  InputBase,
  Typography,
} from "@material-ui/core";
import Selector from "../Selector";
import ColorPicker from "../../../../../../../common/components/ColorPicker";
import { v4 } from "uuid";

const LabelItemStyles = React.memo(({ screenStyles, onStyleChange }) => {
  const [showLTextAppearance, setShowLTextAppearance] = useState(false);

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
        onClick={() => setShowLTextAppearance((prev) => !prev)}
      >
        <Typography>Label Text appearance</Typography>
        <span>{`[${showLTextAppearance ? "-" : "+"}]`}</span>
      </div>

      <Collapse in={showLTextAppearance}>
        <div className="section-subsection-cover">
          <span className="section-form-subsection">Text</span>
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
              defaultValue={style?.label?.fontSize}
              endAdornment={<InputAdornment position="end">px</InputAdornment>}
              onBlur={(e) =>
                onStyleChange({
                  value: e.target.value,
                  root: "label",
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
                  root: "label",
                  property: "fontWeight",
                })
              }
              selectedValue={style?.label?.fontWeight}
            />
          </div>

          <div className="sidebar-section-item">
            <Typography gutterBottom className="row-label">
              F.Color:
            </Typography>
            <ColorPicker
              key={v4()}
              color={style?.label?.color}
              identity="labelColor"
              colorCallback={(e) =>
                onStyleChange({
                  value: e,
                  root: "label",
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
                  root: "label",
                  property: "textAlign",
                })
              }
              selectedValue={style?.label?.textAlign}
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
              defaultValue={style?.label?.borderWidth}
              endAdornment={<InputAdornment position="end">px</InputAdornment>}
              onBlur={(e) =>
                onStyleChange({
                  value: e.target.value,
                  root: "label",
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
              defaultValue={style?.label?.borderRadius}
              endAdornment={<InputAdornment position="end">px</InputAdornment>}
              onBlur={(e) =>
                onStyleChange({
                  value: e.target.value,
                  root: "label",
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
              color={style?.label?.borderColor}
              identity="borderColor"
              colorCallback={(e) =>
                onStyleChange({
                  value: e,
                  root: "label",
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
              color={style?.label?.backgroundColor}
              identity="backgroundColor"
              colorCallback={(e) =>
                onStyleChange({
                  value: e,
                  root: "label",
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
});
export default LabelItemStyles;
