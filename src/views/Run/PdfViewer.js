import { connect } from "react-redux";

const PdfViewer = ({ children }) => {
  return <div>{children}</div>;
};

export default connect((state) => {
  return {
    undoMode: state.uieditor.undoMode,
    zoomLevel: state.uieditor.zoomLevel,
    showDialog: state.reducers.showDialog,
    uiEditorFullScreen: state.uieditor.uiEditorFullScreen,
  };
})(PdfViewer);
