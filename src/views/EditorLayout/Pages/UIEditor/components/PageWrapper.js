import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import { APP_RUN_MAX_WIDTH } from "../../Workflow/components/utils/constants";

const PageWrapper = ({
  zoomLevel,
  children,
  margin,
  minHeight,
  myStyle,
  screenStyles,
  screenValues,
  screenLoading,
}) => {
  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      backgroundColor: "#F4F6F8",
      minHeight,
    },
    app: {
      margin,
      padding: 15,
      height: "100%",
      backgroundSize: "25px 25px",
      // backgroundColor: "#FCFCFC",
      zoom: zoomLevel / 100,
      boxShadow: "0 5px 10px #e8e8e8",

      width: APP_RUN_MAX_WIDTH,
      maxWidth: APP_RUN_MAX_WIDTH,
      minWidth: APP_RUN_MAX_WIDTH,
    },
    dropZone: {
      // maxWidth: 890,
      width: "100%",
      height: "inherit",
      // background: "#FAFBFC",
      background: "transparent",
    },
    drop: {
      width: "100%",
      height: "inherit",
      position: "relative",
      minHeight: "40vh",
      padding: 10,
      paddingBottom: 100,
    },
    container: {
      height: "inherit",
      display: "flex",
      justifyContent: "space-between",
      background: "transparent",
    },
    ...myStyle,
  }));
  const classes = useStyles();

  return (
    <div id="plug-page" className={classes?.root}>
      <div
        // className={classes?.app}
        className="app-page-wrapper"
        style={{
          margin,
          zoom: zoomLevel / 100,
          height: "unset",
          ...(screenValues?.page?.edgeMode === "shadow"
            ? { border: "none", boxShadow: "0 0 20px #ccc" }
            : {}),
          backgroundColor: screenStyles?.page?.backgroundColor || "#FFFFFF", //"#FCFCFC",
          ...(screenStyles?.page?.width
            ? {
                width:
                  parseFloat(screenStyles?.page?.width) *
                  (screenStyles?.page?.dimensionMeasure === "inch" ? 96 : 1),
                height:
                  parseFloat(screenStyles?.page?.height) *
                  (screenStyles?.page?.dimensionMeasure === "inch" ? 96 : 1),
                paddingRight:
                  parseFloat(screenStyles?.page?.horizontalMargin) *
                  (screenStyles?.page?.dimensionMeasure === "inch" ? 96 : 1),
                paddingLeft:
                  parseFloat(screenStyles?.page?.horizontalMargin) *
                  (screenStyles?.page?.dimensionMeasure === "inch" ? 96 : 1),
                paddingTop:
                  parseFloat(screenStyles?.page?.verticalMargin) *
                  (screenStyles?.page?.dimensionMeasure === "inch" ? 96 : 1),
                paddingBottom:
                  parseFloat(screenStyles?.page?.verticalMargin) *
                  (screenStyles?.page?.dimensionMeasure === "inch" ? 96 : 1),
              }
            : {}),

          ...(screenLoading
            ? {
                minHeight: "50vh",
                backgroundColor: "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                letterSpacing: 9,
              }
            : {}),
        }}
      >
        {screenLoading ? (
          <>LOADING...</>
        ) : (
          <div
            className={classes?.container}
            style={{
              height: "100%",
              paddingBottom: 70,
              ...(screenStyles?.overrideDefault && screenStyles?.page?.padding
                ? { padding: screenStyles?.page?.padding }
                : {}),
            }}
          >
            <div className={classes?.dropZone}>
              <div className={classes?.drop}>{children}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageWrapper;
