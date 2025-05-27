import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter, useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";

import UIEditor from "../Pages/UIEditor";
import Workflow from "../Pages/Workflow/";
import Datasheets from "../../Datasheets";
import { getAllWorkflows } from "../Pages/Workflow/utils/workflowHelpers";
import { mainNavigationUrls, unprotectedUrls } from "../../common/utils/lists";
import ErrorBoundary from "../../common/components/ProtectedRoute/ErrorBoundary";
import GeneralError from "../../common/components/ProtectedRoute/components/GeneralError";
import { getAllScreens } from "../Pages/UIEditor/utils/screenUtilities";

const EditorPageSwitch = React.memo(({ match, ...props }) => {
  const [editor, setEditor] = useState(null);
  const location = useLocation();
  const history = useHistory();
  const currentAppId = location.pathname.split("/")[2];
  const [isScreenLoading, setIsScreenLoading] = useState(false);

  const { screensList, activeScreen } = useSelector(({ screens }) => screens);
  const dispatch = useDispatch();

  useEffect(() => {
    const init = async () => {
      if (!props.page) return;
      dispatch(getAllScreens(currentAppId, false, history));
      dispatch(getAllWorkflows(currentAppId, false, history));
    };
    init();
  }, [match?.params?.editor]);

  useEffect(() => {
    const editorLayouts = () => {
      let paramEditorType = match.params.editor;
      props.setPage(paramEditorType);

      switch (paramEditorType) {
        case "dashboard":
          props.history.push(mainNavigationUrls.APPS);
          break;

        case "uieditor":
          setEditor(
            <ErrorBoundary render={() => <GeneralError section="editors" />}>
              <UIEditor />
            </ErrorBoundary>
          );
          break;

        case "datasheets":
          setEditor(
            <ErrorBoundary render={() => <GeneralError section="editors" />}>
              <Datasheets />
            </ErrorBoundary>
          );
          return;

        case "design":
          setEditor(
            <div
              style={{
                // backgroundColor: "red",
                position: "absolute",
                top: "50%",
              }}
            >
              DESIGN PAGE
            </div>
          );
          return;

        case "plugin":
          setEditor(
            <div
              style={{
                // backgroundColor: "red",
                position: "absolute",
                top: "50%",
              }}
            >
              PLUGIN PAGE
            </div>
          );
          return;

        // case "screens":
        //   setEditor(
        //     <ErrorBoundary render={() => <GeneralError section="editors" />}>
        //       <Screens />
        //     </ErrorBoundary>
        //   );
        //   return;

        case "workflows":
          setEditor(
            <ErrorBoundary render={() => <GeneralError section="editors" />}>
              <Workflow />
            </ErrorBoundary>
          );
          return;

        default:
          props.history.push(`${unprotectedUrls.ERROR}/url`);
          return null;
      }
    };
    editorLayouts();
    return () => {
      editorLayouts();
    };
  }, [match]);

  const memoizedCallback = useMemo(() => {
    return editor;
  }, [editor]);

  return (
    <>
      <div
        style={{
          backgroundColor: "#f3f3f3",
          minHeight: "100%",
          display: "flex",
          // flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {memoizedCallback}
      </div>
    </>
  );
});

export default withRouter(EditorPageSwitch);
