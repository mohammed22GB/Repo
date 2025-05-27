import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Collapse,
  InputAdornment,
  InputBase,
  Typography,
} from "@material-ui/core";
import Selector from "../Selector";
import { useSelector } from "react-redux";
import ColorPicker from "../../../../../../../common/components/ColorPicker";
import { v4 } from "uuid";

const PageItemStyles = React.memo(({ screenStyles, onStyleChange }) => {
  const [showFormAppearance, setShowFormAppearance] = useState(false);

  const {
    activeScreen: { type: screenType },
  } = useSelector(({ screens }) => screens);

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

  return (
    <div className="sidebar-section">
      <div
        className="sidebar-section-header"
        onClick={() => setShowFormAppearance((prev) => !prev)}
      >
        <Typography>Page appearance</Typography>
        <span>{`[${showFormAppearance ? "-" : "+"}]`}</span>
      </div>

      <Collapse in={showFormAppearance}>
        <div className="section-subsection-cover">
          <span className="section-form-subsection">Dimensions</span>
        </div>

        <div className="sidebar-section-itemgroup">
          <div className="sidebar-section-item">
            <Typography gutterBottom className="row-label">
              Width:
            </Typography>
            <InputText
              size="small"
              type="number"
              // disabled={screenType === "app"}
              placeholder={
                style?.page?.dimensionMeasure === "px" ? "(in px)" : "(inches)"
              }
              defaultValue={style?.page?.width}
              endAdornment={
                <InputAdornment position="end">
                  {style?.page?.dimensionMeasure === "px" ? "px" : "in"}
                </InputAdornment>
              }
              onBlur={(e) =>
                onStyleChange({
                  value: e.target.value,
                  property: "width",
                  root: "page",
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
              // disabled={screenType === "app"}
              placeholder={
                style?.page?.dimensionMeasure === "px" ? "(in px)" : "(inches)"
              }
              defaultValue={style?.page?.height}
              endAdornment={
                <InputAdornment position="end">
                  {style?.page?.dimensionMeasure === "px" ? "px" : "in"}
                </InputAdornment>
              }
              onBlur={(e) =>
                onStyleChange({
                  value: e.target.value,
                  property: "height",
                  root: "page",
                })
              }
            />
          </div>

          <div className="sidebar-section-item">
            <Typography gutterBottom className="row-label">
              H.Margin:
            </Typography>
            <InputText
              size="small"
              type="number"
              placeholder={
                style?.page?.dimensionMeasure === "px" ? "(in px)" : "(inches)"
              }
              disabled={screenType === "app"}
              defaultValue={style?.page?.horizontalMargin}
              endAdornment={
                <InputAdornment position="end">
                  {style?.page?.dimensionMeasure === "px" ? "px" : "in"}
                </InputAdornment>
              }
              onBlur={(e) =>
                onStyleChange({
                  value: e.target.value,
                  property: "horizontalMargin",
                  root: "page",
                })
              }
            />
          </div>

          <div className="sidebar-section-item">
            <Typography gutterBottom className="row-label">
              V.Margin:
            </Typography>
            <InputText
              size="small"
              type="number"
              placeholder={
                style?.page?.dimensionMeasure === "px" ? "(in px)" : "(inches)"
              }
              disabled={screenType === "app"}
              defaultValue={style?.page?.verticalMargin}
              endAdornment={
                <InputAdornment position="end">
                  {style?.page?.dimensionMeasure === "px" ? "px" : "in"}
                </InputAdornment>
              }
              onBlur={(e) =>
                onStyleChange({
                  value: e.target.value,
                  property: "verticalMargin",
                  root: "page",
                })
              }
            />
          </div>
        </div>

        <div className="section-subsection-cover">
          <span className="section-form-subsection">Background & Spacing</span>
        </div>

        <div className="sidebar-section-itemgroup">
          <div className="sidebar-section-item">
            <Typography gutterBottom className="row-label">
              Bg.Color:
            </Typography>
            <ColorPicker
              key={v4()}
              color={style?.page?.backgroundColor || "#fcfcfc"}
              identity="backgroundColor"
              colorCallback={(e) =>
                onStyleChange({
                  value: e,
                  property: "backgroundColor",
                  root: "page",
                })
              }
            />
          </div>

          <div className="sidebar-section-item">
            <Typography gutterBottom className="row-label">
              Spacing:
            </Typography>
            <InputText
              size="small"
              type="number"
              placeholder="(in px)"
              defaultValue={style?.page?.gap || 15}
              endAdornment={<InputAdornment position="end">px</InputAdornment>}
              onBlur={(e) =>
                onStyleChange({
                  value: e.target.value,
                  property: "gap",
                  root: "page",
                })
              }
            />
          </div>

          <div className="sidebar-section-item">
            <Typography gutterBottom className="row-label">
              Padding:
            </Typography>
            <InputText
              size="small"
              type="number"
              placeholder="(in px)"
              defaultValue={style?.page?.padding || 5}
              endAdornment={<InputAdornment position="end">px</InputAdornment>}
              onBlur={(e) =>
                onStyleChange({
                  value: e.target.value,
                  property: "padding",
                  root: "page",
                })
              }
            />
          </div>
        </div>
      </Collapse>
    </div>
  );
});
export default PageItemStyles;
