import EmailIcon from "@material-ui/icons/MailOutlined";
import AspectRatioIcon from "@material-ui/icons/AspectRatio";
import CloudDownload from "@material-ui/icons/CloudDownload";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedInOutlined";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import StorageIcon from "@material-ui/icons/Storage";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import CalendarIcon from "@mui/icons-material/CalendarMonth";
import CreditCardIcon from "@mui/icons-material/CreditCard";

import * as taskTypes from "./utils/taskTypes";

const NodeIcons = ({ nodeType, style }) => {
  const getNodeIcon = (type) => {
    switch (type) {
      case taskTypes.WORKFLOWS_TASK_SCREEN:
        return (
          <AspectRatioIcon style={{ fontSize: 41, color: "#999", ...style }} />
        );

      case taskTypes.WORKFLOWS_TASK_MAIL:
        return <EmailIcon style={{ fontSize: 43, color: "#999", ...style }} />;

      case taskTypes.WORKFLOWS_TASK_DATA:
        return (
          <StorageIcon style={{ fontSize: 43, color: "#999", ...style }} />
        );

      case taskTypes.WORKFLOWS_TASK_CALENDAR:
        return (
          <CalendarIcon style={{ fontSize: 43, color: "#999", ...style }} />
        );

      case taskTypes.WORKFLOWS_TASK_DOCUMENT:
        return (
          <HistoryEduIcon style={{ fontSize: 41, color: "#999", ...style }} />
        );

      case taskTypes.WORKFLOWS_TASK_PAYMENT:
        return (
          <CreditCardIcon style={{ fontSize: 43, color: "#999", ...style }} />
        );

      case taskTypes.WORKFLOWS_TASK_CUSTOM:
        return (
          <CloudDownload style={{ fontSize: 43, color: "#999", ...style }} />
        );

      case taskTypes.WORKFLOWS_TASK_APPROVAL:
        return (
          <AssignmentTurnedInIcon
            style={{ fontSize: 43, color: "#999", ...style }}
          />
        );

      case taskTypes.WORKFLOWS_TASK_COMPUTATION:
        return (
          <AccountTreeIcon style={{ fontSize: 43, color: "#999", ...style }} />
        );

      default:
        return "";
    }
  };

  return getNodeIcon(nodeType);
};

export default NodeIcons;
