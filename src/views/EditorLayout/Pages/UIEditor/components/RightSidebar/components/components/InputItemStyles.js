import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Collapse,
  InputAdornment,
  InputBase,
  Typography,
} from "@material-ui/core";

import Selector from "../Selector";
import CornerHint from "../../../../../../../common/components/CornerHint/CornerHint";
import ColorPicker from "../../../../../../../common/components/ColorPicker";
import { v4 } from "uuid";

const InputItemStyles = React.memo(({ screenStyles, onStyleChange }) => {
  const [showInputAppearance, setShowInputAppearance] = useState(false);

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
        onClick={() => setShowInputAppearance((prev) => !prev)}
      >
        <Typography>Input appearance</Typography>
        <span>{`[${showInputAppearance ? "-" : "+"}]`}</span>
      </div>

      <Collapse in={showInputAppearance}>
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
                style?.field?.width === "100%" ? 0 : style?.field?.width
              }
              endAdornment={<InputAdornment position="end">px</InputAdornment>}
              onBlur={(e) =>
                onStyleChange({
                  value: e.target.value == 0 ? "100%" : e.target.value,
                  root: "field",
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
              defaultValue={style?.field?.height}
              endAdornment={<InputAdornment position="end">px</InputAdornment>}
              onBlur={(e) =>
                onStyleChange({
                  value: e.target.value,
                  root: "field",
                  property: "height",
                })
              }
            />
          </div>
        </div>

        <div className="section-subsection-cover">
          <span className="section-form-subsection">Field Text</span>
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
              defaultValue={style?.field?.fontSize}
              endAdornment={<InputAdornment position="end">px</InputAdornment>}
              onBlur={(e) =>
                onStyleChange({
                  value: e.target.value,
                  root: "field",
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
                  root: "field",
                  property: "fontWeight",
                })
              }
              selectedValue={style?.field?.fontWeight}
            />
          </div>
          <div className="sidebar-section-item">
            <Typography gutterBottom className="row-label">
              F.Color:
            </Typography>
            <ColorPicker
              key={v4()}
              color={style?.field?.color}
              identity="fieldColor"
              colorCallback={(e) =>
                onStyleChange({
                  value: e,
                  root: "field",
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
                  root: "field",
                  property: "textAlign",
                })
              }
              selectedValue={style?.field?.textAlign}
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
              defaultValue={style?.field?.borderWidth}
              endAdornment={<InputAdornment position="end">px</InputAdornment>}
              onBlur={(e) =>
                onStyleChange({
                  value: e.target.value,
                  root: "field",
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
              defaultValue={style?.field?.borderRadius}
              endAdornment={<InputAdornment position="end">px</InputAdornment>}
              onBlur={(e) =>
                onStyleChange({
                  value: e.target.value,
                  root: "field",
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
              color={style?.field?.borderColor}
              identity="borderColor"
              colorCallback={(e) =>
                onStyleChange({
                  value: e,
                  root: "field",
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
              color={style?.field?.backgroundColor}
              identity="backgroundColor"
              colorCallback={(e) =>
                onStyleChange({
                  value: e,
                  root: "field",
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
export default InputItemStyles;
