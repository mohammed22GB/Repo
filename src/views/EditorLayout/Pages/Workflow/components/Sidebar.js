import React, { useState, useRef } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import AddCircleOutline from "@material-ui/icons/AddCircleOutline";
import ArrowRight from "@material-ui/icons/ArrowRight";
import ArrowLeft from "@material-ui/icons/ArrowLeft";
import EmailIcon from "@material-ui/icons/MailOutlined";
import CloudDownload from "@material-ui/icons/CloudDownload";
import AspectRatioIcon from "@material-ui/icons/AspectRatio";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedInOutlined";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import StorageIcon from "@material-ui/icons/Storage";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import { WorkflowItem } from "./dragComponents";
import { Collapse } from "@material-ui/core";
import * as taskTypes from "./utils/taskTypes";

const Sidebar = (props) => {
  const [toolbarOpen, setToolbarOpen] = useState(true);
  const containerRef = useRef();

  const useStyles = makeStyles((theme) => ({
    workflowToolbar: {
      position: "fixed",
      display: "flex",
      alignItems: "center",
      // left: 300,
      // backgroundColor: "#fff",
      height: 60,
      // width: toolbarOpen ? "74%" : 60,
      // width: "74%",
      // zIndex: 1,
      // left: 296,
      // border: "solid 1px #e8e8e8",
      margin: "15px 15px 15px 6px",
      padding: 10,
      // borderRadius: 10,
      // boxShadow: "0 0 10px #ddd",
      opacity: 0.85,
      // overflow: "hidden",
      zIndex: 5,
      top: props.workflowFullScreen ? 0 : 100,
    },
    workflowToolbarToggle: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      backgroundColor: "#fff",
      // height: 60,
      // width: toolbarOpen ? "74%" : 60,
      // width: "74%",
      // zIndex: 1,
      // left: 296,
      // border: "solid 1px #e8e8e8",
      // margin: 15,
      padding: 6,
      borderRadius: 6,
      boxShadow: "0 0 10px #ddd",
      opacity: 0.85,
      // overflow: "hidden",
      // zIndex: 5,
    },
    workflowToolbarButton: {
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      padding: 14.5,
      backgroundColor: "#fafafa",
      borderRadius: 10,
      boxShadow: "0 0 10px #ddd",
      zIndex: 100,
    },
    separator: {
      borderLeft: "solid 2px #ccc",
      marginRight: 10,
      color: "transparent",
    },
  }));
  const classes = useStyles();

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className={classes.workflowToolbar} ref={containerRef}>
      <div
        className={classes.workflowToolbarButton}
        onClick={() => setToolbarOpen((prev) => !prev)}
      >
        <AddCircleOutline style={{ fontSize: 33, color: "#bbb" }} />
      </div>
      {!toolbarOpen && <ArrowRight style={{ zIndex: 100 }} />}
      {toolbarOpen && <ArrowLeft style={{ zIndex: 100 }} />}

      <Collapse
        in={toolbarOpen}
        direction="right"
        container={containerRef.current}
        mountOnEnter
      >
        <div className={classes.workflowToolbarToggle}>
          <WorkflowItem
            type="Screen"
            icon={<AspectRatioIcon className={classes.workflowToolbarItem} />}
            orient={taskTypes.WORKFLOWS_TASK_SCREEN}
          />
          <WorkflowItem
            type="Mail"
            icon={<EmailIcon className={classes.workflowToolbarItem} />}
            orient={taskTypes.WORKFLOWS_TASK_MAIL}
          />
          <WorkflowItem
            type="Data"
            icon={<StorageIcon className={classes.workflowToolbarItem} />}
            orient={taskTypes.WORKFLOWS_TASK_DATA}
          />
          <WorkflowItem
            type="Approval"
            icon={
              <AssignmentTurnedInIcon className={classes.workflowToolbarItem} />
            }
            orient={taskTypes.WORKFLOWS_TASK_APPROVAL}
          />
          {
            <WorkflowItem
              type="Computation"
              icon={<AccountTreeIcon className={classes.workflowToolbarItem} />}
              orient={taskTypes.WORKFLOWS_TASK_COMPUTATION}
            />
          }
          {/* <div className={classes.separator}>k</div> */}
          {/* <WorkflowItem
            type="Calendar"
            icon={<CalendarIcon className={classes.workflowToolbarItem} />}
            orient="CalendarTask"
          /> */}
          <WorkflowItem
            type="Document"
            icon={<HistoryEduIcon className={classes.workflowToolbarItem} />}
            orient={taskTypes.WORKFLOWS_TASK_DOCUMENT}
          />
          <WorkflowItem
            type="Custom"
            icon={
              <CloudDownload
                className={classes.workflowToolbarItem}
                size={20}
              />
            }
            orient={taskTypes.WORKFLOWS_TASK_CUSTOM}
          />
          {/* <WorkflowItem
            type="Payment"
            icon={<CreditCardIcon className={classes.workflowToolbarItem} />}
            orient="PaymentTask"
          /> */}
          {/* <WorkflowItem

            type="lots-of-ports"
            orient='default'
          /> */}
        </div>
      </Collapse>
    </div>
  );
};

export default connect((state) => {
  return {
    workflowFullScreen: state.workflows.workflowFullScreen,
  };
})(Sidebar);
