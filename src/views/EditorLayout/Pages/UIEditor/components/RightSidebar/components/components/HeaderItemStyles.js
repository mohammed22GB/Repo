import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Collapse,
  InputAdornment,
  InputBase,
  Typography,
} from "@material-ui/core";
import CornerHint from "../../../../../../../common/components/CornerHint/CornerHint";
import ColorPicker from "../../../../../../../common/components/ColorPicker";
import { v4 } from "uuid";

const HeaderItemStyles = React.memo(
  ({ activeSelection, screenStyles, onStyleChange }) => {
    // const [componentName, setComponentName] = useState(name);
    const [showHeaderAppearance, setShowHeaderAppearance] = useState(false);

    const {
      id,
      type,
      index,

      style: itemStyle,
    } = activeSelection || {};
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

    const formRowSpacing = [
      ["10", "Thin"],
      ["15", "Normal"],
      ["20", "Large"],
      ["30", "Extra Large"],
    ];
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
          onClick={() => setShowHeaderAppearance((prev) => !prev)}
        >
          <Typography>Page Header appearance</Typography>
          <span>{`[${showHeaderAppearance ? "-" : "+"}]`}</span>
        </div>

        <Collapse in={showHeaderAppearance}>
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
                  style?.header?.width === "100%" ? 0 : style?.header?.width
                }
                endAdornment={
                  <InputAdornment position="end">px</InputAdornment>
                }
                onBlur={(e) =>
                  onStyleChange({
                    value: e.target.value == 0 ? "100%" : e.target.value,
                    root: "header",
                    property: "width",
                  })
                }
              />
            </div>

            <div className="sidebar-section-item">
              <Typography gutterBottom className="row-label">
                Height:
              </Typography>
              <InputText
                size="small"
                type="number"
                placeholder="(in px)"
                defaultValue={style?.header?.height}
                endAdornment={
                  <InputAdornment position="end">px</InputAdornment>
                }
                onBlur={(e) =>
                  onStyleChange({
                    value: e.target.value,
                    root: "header",
                    property: "height",
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
                defaultValue={style?.header?.borderWidth}
                endAdornment={
                  <InputAdornment position="end">px</InputAdornment>
                }
                onBlur={(e) =>
                  onStyleChange({
                    value: e.target.value,
                    root: "header",
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
                defaultValue={style?.header?.borderRadius}
                endAdornment={
                  <InputAdornment position="end">px</InputAdornment>
                }
                onBlur={(e) =>
                  onStyleChange({
                    value: e.target.value,
                    root: "header",
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
                color={style?.header?.borderColor}
                identity="borderColor"
                colorCallback={(e) =>
                  onStyleChange({
                    value: e,
                    root: "header",
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
                color={style?.header?.backgroundColor}
                identity="backgroundColor"
                colorCallback={(e) =>
                  onStyleChange({
                    value: e,
                    root: "header",
                    property: "backgroundColor",
                  })
                }
              />
            </div>
          </div>
        </Collapse>
      </div>
    );
  }
);
export default HeaderItemStyles;
