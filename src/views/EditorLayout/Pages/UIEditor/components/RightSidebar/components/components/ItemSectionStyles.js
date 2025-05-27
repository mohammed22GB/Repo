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

const ItemSectionStyles = React.memo(({ screenStyles, onStyleChange }) => {
  const [showSectionAppearance, setShowSectionAppearance] = useState(false);

  const style = { ...(screenStyles?.itemSection || screenStyles || {}) };

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
  const borderStyleSelection = [
    ["none", "None"],
    ["solid", "Solid"],
    ["dashed", "Dashed"],
    ["dotted", "Dotted"],
  ];

  return (
    <div className="sidebar-section">
      <div
        className="sidebar-section-header"
        onClick={() => setShowSectionAppearance((prev) => !prev)}
      >
        <Typography>Section appearance</Typography>
        <span>{`[${showSectionAppearance ? "-" : "+"}]`}</span>
      </div>

      <Collapse in={showSectionAppearance}>
        <div className="section-subsection-cover">
          <span className="section-form-subsection">Section</span>
        </div>
        <div className="sidebar-section-itemgroup">
          <div className="sidebar-section-item">
            <CornerHint hint="Enter 0 for 100%" />
            <Typography gutterBottom className="row-label">
              Padding:
            </Typography>
            <InputText
              size="small"
              type="number"
              placeholder="(in px)"
              defaultValue={style?.padding}
              endAdornment={<InputAdornment position="end">px</InputAdornment>}
              onBlur={(e) =>
                onStyleChange({
                  value: e.target.value,
                  root: "itemSection",
                  property: "padding",
                })
              }
            />
          </div>
          <div className="sidebar-section-item">
            <Typography gutterBottom className="row-label">
              Shadow:
            </Typography>
            <InputText
              size="small"
              placeholder="0 0 5px #000"
              defaultValue={style?.boxShadow}
              onBlur={(e) =>
                onStyleChange({
                  value: e.target.value,
                  root: "itemSection",
                  property: "boxShadow",
                })
              }
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
              defaultValue={style?.borderWidth}
              endAdornment={<InputAdornment position="end">px</InputAdornment>}
              onBlur={(e) =>
                onStyleChange({
                  value: e.target.value,
                  root: "itemSection",
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
              defaultValue={style?.borderRadius}
              endAdornment={<InputAdornment position="end">px</InputAdornment>}
              onBlur={(e) =>
                onStyleChange({
                  value: e.target.value,
                  root: "itemSection",
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
              color={style?.borderColor}
              identity="borderColor"
              colorCallback={(e) =>
                onStyleChange({
                  value: e,
                  root: "itemSection",
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
              color={style?.backgroundColor}
              identity="backgroundColor"
              colorCallback={(e) =>
                onStyleChange({
                  value: e,
                  root: "itemSection",
                  property: "backgroundColor",
                })
              }
            />
          </div>

          <div className="sidebar-section-item">
            <Typography gutterBottom className="row-label">
              B.Style:
            </Typography>
            <Selector
              items={borderStyleSelection}
              onChange={(v) =>
                onStyleChange({
                  value: v,
                  root: "itemSection",
                  property: "borderStyle",
                })
              }
              selectedValue={style?.borderStyle || "none"}
            />
          </div>
        </div>
      </Collapse>
    </div>
  );
});
export default ItemSectionStyles;
