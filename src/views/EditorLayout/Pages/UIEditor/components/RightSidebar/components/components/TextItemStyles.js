import React, { useEffect, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Collapse,
  InputAdornment,
  InputBase,
  Typography,
} from "@material-ui/core";
import Selector from "../Selector";
import ColorPicker from "../../../../../../../common/components/ColorPicker";
import CornerHint from "../../../../../../../common/components/CornerHint/CornerHint";
import { v4 } from "uuid";

const TextItemStyles = React.memo((props) => {
  const { activeSelection, screenStyles, onStyleChange } = props;
  const [showTextAppearance, setShowTextAppearance] = useState(false);

  const { type, style: itemStyle } = activeSelection || {};
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
  const lineHeightSelection = [
    [1, "Small"],
    [1.5, "Normal"],
    [2, "More"],
  ];

  return (
    <div className="sidebar-section">
      <div
        className="sidebar-section-header"
        onClick={() => setShowTextAppearance((prev) => !prev)}
      >
        <Typography>Paragraph Text appearance</Typography>
        <span>{`[${showTextAppearance ? "-" : "+"}]`}</span>
      </div>

      <Collapse in={showTextAppearance}>
        <div className="section-subsection-cover">
          <span className="section-form-subsection">Text Font</span>
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
                style?.text?.width === "100%" ? 0 : style?.text?.width
              }
              endAdornment={<InputAdornment position="end">px</InputAdornment>}
              onBlur={(e) =>
                onStyleChange({
                  value: e.target.value == 0 ? "100%" : e.target.value,
                  root: "text",
                  property: "width",
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
                  root: "text",
                  property: "textAlign",
                })
              }
              selectedValue={style?.text?.textAlign}
            />
          </div>

          <div className="sidebar-section-item">
            <Typography gutterBottom className="row-label">
              F.Size:
            </Typography>
            <InputText
              size="small"
              type="number"
              placeholder="(in px)"
              defaultValue={style?.text?.fontSize}
              endAdornment={<InputAdornment position="end">px</InputAdornment>}
              onBlur={(e) =>
                onStyleChange({
                  value: e.target.value,
                  root: "text",
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
                  root: "text",
                  property: "fontWeight",
                })
              }
              selectedValue={style?.text?.fontWeight}
            />
          </div>

          <div className="sidebar-section-item">
            <Typography gutterBottom className="row-label">
              F.Color:
            </Typography>
            <ColorPicker
              key={v4()}
              color={style?.text?.color}
              identity="labelColor"
              colorCallback={(e) =>
                onStyleChange({
                  value: e,
                  root: "text",
                  property: "color",
                })
              }
            />
          </div>

          <div className="sidebar-section-item">
            <Typography gutterBottom className="row-label">
              L.Height
            </Typography>
            <Selector
              items={lineHeightSelection}
              onChange={(v) =>
                onStyleChange({
                  value: v,
                  root: "text",
                  property: "lineHeight",
                })
              }
              selectedValue={style?.text?.lineHeight}
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
              defaultValue={style?.text?.borderWidth}
              endAdornment={<InputAdornment position="end">px</InputAdornment>}
              onBlur={(e) =>
                onStyleChange({
                  value: e.target.value,
                  root: "text",
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
              defaultValue={style?.text?.borderRadius}
              endAdornment={<InputAdornment position="end">px</InputAdornment>}
              onBlur={(e) =>
                onStyleChange({
                  value: e.target.value,
                  root: "text",
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
              color={style?.text?.borderColor}
              identity="borderColor"
              colorCallback={(e) =>
                onStyleChange({
                  value: e,
                  root: "text",
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
              color={style?.text?.backgroundColor}
              identity="backgroundColor"
              colorCallback={(e) =>
                onStyleChange({
                  value: e,
                  root: "text",
                  property: "backgroundColor",
                })
              }
            />
          </div>
        </div>
      </Collapse>
    </div>
  );
});
export default TextItemStyles;
