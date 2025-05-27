import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import { useSelector } from "react-redux";

import RealComponents from "../UIEditor/components/RealComponents";
import { defaultStyles } from "../UIEditor/utils/defaultScreenStyles";
import { APP_DESIGN_MODES } from "../../../common/utils/constants";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    // backgroundColor: "#FF0000",
    // backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='50px' width='120px'><text x='0' y='15' fill='grey' font-size='20'>PREVIEW</text></svg>")`,
  },
  grow: {
    flexGrow: 1,
  },
  content: {
    width: "100%",
    padding: theme?.spacing(3),
    position: "relative",
  },
  submit: {
    fontSize: 12,
    margin: "8px 0 8px 40px",
    backgroundColor: "#010A43",
    color: "#fff",
    textTransform: "none",
    borderRadius: 3,
    padding: "8px 28px 6px",
    letterSpacing: 0.5,
  },
  header: {
    minHeight: 0,
  },
  formTextField: {
    fontStyle: "normal",
    fontWeight: 375,
    fontSize: 12,
    color: "#091540",
    borderColor: "#ABB3BF",
  },

  outer: {
    height: "100vh",
    background: "#ffffff",
    overflow: "auto",
  },
  inner: {
    width: "80%",
    margin: "auto",
    marginTop: "10%",
  },
}));

const Preview = (props) => {
  const classes = useStyles();
  const { workflowCanvas: canvasItems } = useSelector(
    ({ workflows }) => workflows
  );

  return (
    <div className={classes.root}>
      <main className={classes.content}>
        <Grid container style={{ height: "100vh", margin: 0, padding: 5 }}>
          <Grid item xs={12} lg={12} xl={12}>
            <main className="previewArea">
              {/* <div style={{ position: "absolute", top: 2, right: 2 }}><Button>Close Preview</Button></div> */}
              <div
                style={{ position: "relative", zoom: props.zoomLevel / 100 }}
              >
                {Object.keys(canvasItems)?.map((container, index) =>
                  canvasItems?.[container]?.map((item) => (
                    <div key={index} style={{ marginBottom: 10 }}>
                      <RealComponents
                        id={item.id}
                        type={item.type}
                        style={
                          item.style
                            ? {
                                ...item.style,
                                appDesignMode: APP_DESIGN_MODES.PREVIEW,
                              }
                            : {
                                ...defaultStyles()[item.type],
                                appDesignMode: APP_DESIGN_MODES.PREVIEW,
                              }
                        }
                        customId={item.customId || null}
                        customName={item.customName || null}
                      />
                    </div>
                  ))
                )}
              </div>
            </main>
          </Grid>
        </Grid>
      </main>
    </div>
  );
};

export default Preview;
