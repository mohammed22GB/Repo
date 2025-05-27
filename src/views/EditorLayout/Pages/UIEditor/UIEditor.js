import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";

import AsideBar from "../../components/AsideBar";
import UIEditorCanvas from "./components/UIEditorCanvas";
import ErrorBoundary from "../../../common/components/ProtectedRoute/ErrorBoundary";
import UieComponentsPanel from "./components/UieComponentsPanel";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: theme?.mixins.toolbar,
  content: {
    flexGrow: 1,
    width: "100%",
    height: "100%",
    position: "relative",
    marginLeft: 240,
    // paddingTop: theme?.spacing(3),
    // height: "100%",
  },
}));

const MainView = ({
  match,
  hiddenRightSideBar,
  dispatch,
  canvasItems,
  ...props
}) => {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const [isScreenLoading, setIsScreenLoading] = useState(false);

  const appId = location.pathname.split("/")[2];

  useEffect(() => {
    document.title = "Editor | Interface Designer";
  }, []);

  return (
    <div
      style={{
        display: "flex",
        // marginLeft: 50,
      }}
    >
      <UieComponentsPanel
        drawerOpen={true}
        drawerWidth={290}
        page={"uieditor"}
      />
      <main className={classes.content} id="mainPage">
        {/* <div className={classes.toolbar} style={{ minHeight: 55 }} /> */}
        <div
          className="_editor"
          id="plug-page"
          style={{
            height: "100%",
            // boxShadow: "0 0 20px #ccc",
            border: "solid 1px #ddd",
            ...(props?.activeScreen?.values?.page?.edgeMode === "shadow"
              ? { border: "none", boxShadow: "0 0 20px #ccc" }
              : { border: "solid 1px #ddd" }),
          }}
        >
          <ErrorBoundary render={(error, info) => <div>Hello</div>}>
            <UIEditorCanvas />
          </ErrorBoundary>
        </div>
        <AsideBar hiddenRightSideBar={hiddenRightSideBar} />
      </main>
    </div>
  );
};

export default connect((state) => {
  return {
    hiddenRightSideBar: state.reducers.hiddenRightSideBar,
    canvasItems: state.uieditor.canvasItems,
    activeScreen: state.screens.activeScreen,
  };
})(MainView);
