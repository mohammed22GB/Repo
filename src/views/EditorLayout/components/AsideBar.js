import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import WorkflowRightSidebar from "../Pages/Workflow/components/RightSidebar";
import UieRightSidebar from "../Pages/UIEditor/components/RightSidebar/RightSidebar";

const AsideBar = ({
  otherParams,
  location,
  hiddenRightSideBar,
  uiEditorFullScreen,
  workflowFullScreen,
}) => {
  const [rightBarId, setRightBarId] = useState("info");
  const [, setColor] = useState("#bbbbbb");
  const [, setTextAlignment] = useState("left");
  const [, setTax] = useState(0);
  const [components, setcomponents] = useState([]);
  const [isUIEditor, setIsUIEdittor] = useState(false);
  const [isWorkflow, setIsWorkflow] = useState(false);

  const [, setObjectName] = useState("");
  const colorCallback = (color, identity) => {
    setColor(color);
    setObjectName(identity);
  };

  // alert(JSON.stringify(otherParams));

  const textAlignmentCallback = (text) => {
    setTextAlignment(text);
  };

  const taxCallback = (tax) => {
    setTax(tax);
  };

  useEffect(() => {
    const displayEditorComponent = () => {
      const editor = location.pathname.split("/")[3];
      if (editor === "uieditor") setIsUIEdittor(true);
      if (editor === "workflows") setIsWorkflow(true);

      //console.log(`editor`, editor);
      switch (editor) {
        case "uieditor":
          setcomponents(
            <UieRightSidebar
              id={rightBarId}
              colorCall={colorCallback}
              textAlignmentCallback={textAlignmentCallback}
              taxCall={taxCallback}
            />
          );
          break;
        case "workflows":
          setcomponents(
            <WorkflowRightSidebar
              id={rightBarId}
              colorCall={colorCallback}
              textAlignmentCallback={textAlignmentCallback}
              taxCall={taxCallback}
              otherParams={{ ...otherParams, iam: "workflows" }}
            />
          );
          break;
        case "mine":
          setcomponents(
            <p
              style={{
                position: "absolute",
                top: "50%",
                backgroundColor: "yellow",
              }}
            >
              hello aside
            </p>
          );
          break;

        default:
          break;
      }
    };
    displayEditorComponent();

    return () => {
      displayEditorComponent();
    };
  }, [location, rightBarId, otherParams, hiddenRightSideBar]);

  return (
    <div
      style={
        hiddenRightSideBar
          ? {
              flexGrow: 0,
              maxWidth: 0,
              flexBasis: 0,
              position: "fixed",
              right: 0,
              width: "19%",
              top:
                isWorkflow && workflowFullScreen
                  ? 0
                  : isUIEditor && uiEditorFullScreen
                  ? 0
                  : 88,
            }
          : isUIEditor
          ? {
              maxWidth: "40%",
              position: "fixed",
              right: 0,
              width: 340,
              // height: workflowFullScreen ? "94%" : "86%",
              height: uiEditorFullScreen ? "100%" : "86%",
              top: uiEditorFullScreen ? 0 : 100,
              zIndex: 5,
            }
          : isWorkflow
          ? {
              maxWidth: "40%",
              position: "fixed",
              right: 0,

              width: 470,
              // height: workflowFullScreen ? "94%" : "86%",
              height: workflowFullScreen ? "100%" : "86%",
              top: workflowFullScreen ? 0 : 100,
              zIndex: 5,
            }
          : { position: "fixed", right: 0, width: 249, height: "100%", top: 88 }
      }
    >
      {components}
    </div>
  );
};

// export default withRouter(AsideBar);
export default connect((state) => {
  return {
    uiEditorFullScreen: state.uieditor.uiEditorFullScreen,
    workflowFullScreen: state.workflows.workflowFullScreen,
    hiddenRightSideBar: state.reducers.hiddenRightSideBar,
  };
})(withRouter(AsideBar));
