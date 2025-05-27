import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Canvas from "./components/Canvas";
import AsideBar from "../../components/AsideBar";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: theme?.mixins.toolbar,
  content: {
    flexGrow: 1,
    // paddingTop: theme?.spacing(3),
  },
  workflowPhoneyPanel: {
    position: "absolute",
    zIndex: 100,
    marginLeft: -230,
    backgroundColor: "brown",
    width: 230,
    height: "100%",
  },
}));

const MainView = ({ match, hiddenRightSideBar, dispatch, ...props }) => {
  const location = useLocation();
  const [currentAppId, setCurrentAppId] = useState("");

  useEffect(() => {
    document.title = "Editor | Workflow";
  }, []);

  useEffect(() => {
    const appId = location.pathname.split("/")[2];
    setCurrentAppId(appId);
  }, [location.pathname]);

  const classes = useStyles();
  const [otherParams, setOtherParams] = useState({});

  const passParams = (param) => {
    const opms = { ...otherParams, ...param };
    setOtherParams(opms);
  };

  const otherActions = () => {
    const opms = { ...otherParams };
    setOtherParams(opms);
  };

  const getCanvas = () => <Canvas passParams={passParams} />;

  return (
    <div style={{ width: "100%" }}>
      <main className={classes.content} id="mainPage">
        <div style={{ height: "100vh" }}>
          {/* <Canvas passParams={passParams} /> */}
          {getCanvas()}
        </div>
        <AsideBar
          hiddenRightSideBar={hiddenRightSideBar}
          otherParams={otherParams}
          otherActions={otherActions}
        />
      </main>
    </div>
  );
};

export default connect((state) => {
  return {
    hiddenRightSideBar: state.reducers.hiddenRightSideBar,
  };
})(MainView);
