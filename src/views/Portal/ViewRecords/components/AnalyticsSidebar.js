import { useState } from "react";
import { connect } from "react-redux";
import { useQueryClient } from "react-query";
import { makeStyles } from "@material-ui/core/styles";
import Slide from "@material-ui/core/Slide";
import CancelIcon from "@material-ui/icons/Cancel";
import {
  Typography,
  Collapse,
  IconButton,
  FormControl,
  Button,
} from "@material-ui/core";
import SelectOnSteroids from "../../../EditorLayout/Pages/Workflow/components/RightSidebar/components/sidebarActions/common/SelectOnSteroids";
import { ressignTask } from "../../../Analytics/AnalyticsApis";
import RichTextEditor from "../../../EditorLayout/Pages/Workflow/components/RightSidebar/components/sidebarActions/common/RichTextEditor";
import { setStateTimeOut } from "../../../common/helpers/helperFunctions";
import { errorToastify, successToastify } from "../../../common/utils/Toastify";
import { getTaskVariables } from "../../../EditorLayout/Pages/Workflow/components/utils/workflowFuncs";

const useStyles = makeStyles((theme) => {
  return {
    sideHeading: {
      color: "#091540",
      // fontWeight: 600,
      fontSize: 11,
      paddingLeft: 10,
      paddingTop: 10,
      textTransform: "capitalize",
      display: "inline-flex",
      alignItems: "center",
    },
    section: {
      padding: 10,
      paddingBottom: 20,
    },
    sectionTitle: {
      color: "#999",
      fontSize: 12,
      marginBottom: 5,
    },
    assigneeName: {
      color: "#999",
      fontSize: 11,
      marginBottom: 5,
    },
    input: {
      color: "#091540",
      fontSize: 12,
      marginBottom: 12,
    },
    customButton: {
      textTransform: "none",
      fontSize: 14,
      marginLeft: 10,
      minWidth: "6rem",
    },
    select: {
      color: "#091540",
      fontSize: 12,
      padding: 10,
    },
    sideDialogContainer: {
      width: "35%",
      minWidth: "300px",
      height: "60vh",
      marginTop: 0,
      backgroundColor: "#fff",
      filter: "drop-shadow(1px 5px 10px #ccc)",
      boxShadow: "-4px 4px 6px #ccc",
      position: "fixed",
      right: 0,
      bottom: 0,
      zIndex: 5,
      overflow: "scroll",
    },
    sideDialogTitleWrapper: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingRight: 10,
    },
    selectedFields: {
      backgroundColor: "#f8f8f8",
      marginRight: 5,
      marginBottom: 5,
      padding: 5,
      border: "dashed 1px #999",
      borderRadius: 8,
      color: "#888",
    },
    sideHeadingBar: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      height: 29,
    },
    sideDialogCloseButton: {
      cursor: "pointer",
      marginLeft: "auto",
      "&:hover": {
        opacity: 0.7,
      },
    },
    sectionEntry: {
      marginBottom: 13,
    },
    selected: {
      "& span": {
        display: "none",
      },
    },
  };
});

const AnalyticsSidebar = ({
  activeTaskId,
  workflowTasks,
  taskId,
  workflowInstanceId,
  allVariables,
  showMe, //= true,
  setShowMe,
  data,
}) => {
  const node = "screen";
  const activeTask = workflowTasks[activeTaskId];
  const properties = activeTask?.properties || {};

  const variables = getTaskVariables(activeTaskId, allVariables, true);
  const classes = useStyles();

  const [finalContent, setFinalContent] = useState("");
  const [heldBody, setHeldBody] = useState("");
  const [hideEmailBody, setHideEmailBody] = useState(true);
  const [indicator, setIndicator] = useState(false);
  const [assignees, setAssignees] = useState([]);
  const [showSection, setShowSection] = useState({
    view: false,
  });

  const handleClose = () => {
    setShowMe(false);
  };

  const _convertBody = (content, wh) => {
    if (wh === "to-id") {
      if (
        !!content &&
        content.slice(0, 3) === "<p>" &&
        content.slice(-4) === "</p>"
      ) {
        content = !!content ? content.slice(3, -4) : "";

        setStateTimeOut(setIndicator, true, false);
      }
      _setTaskInfo(content, "emailBody");
    } else if (wh === "from-id") {
      return !!content ? content + "&nbsp;" : "&nbsp;";
    }
  };

  const _setTaskInfo = async (e, ppty) => {
    if (e?.selection === "added" && ppty === "reassign") {
      const newUser = {
        id: e?.id,
        name: e?.name,
        emailType: e?.emailType,
      };
      setAssignees([...assignees, newUser]);
    }
    if (e?.selection === "removed" && ppty === "reassign") {
      if (assignees.length) {
        const filterUsers = assignees.filter((usr) => {
          return usr.id !== e.id;
        });

        setAssignees(filterUsers);
      }
    }
    if (ppty === "emailBody") {
      setFinalContent(e);
    }
  };
  const handleSubmit = async () => {
    if (!assignees.length) {
      return errorToastify("Please select an assignee to submit");
    } else if (taskId && workflowInstanceId) {
      if (heldBody && !finalContent) {
        return errorToastify("Please save message before reassignment");
      }
      const results = await ressignTask({
        taskId,
        workflowInstanceId,
        newAssignees: assignees,
        taskProperties: {
          emailBody: finalContent,
        },
      });
      handleClose();

      if (results?.data?._meta.success) {
        successToastify("Task was reassigned successfully.");
      }
    }
  };

  const _toggleSection = (e, sect) => {
    e && e.stopPropagation();

    const makeTrue = !showSection[sect];
    const showSection_ = { ...showSection };
    Object.keys(showSection_).forEach((p) => {
      return (showSection_[p] = false);
    });
    if (makeTrue) {
      showSection_[sect] = true;
    }
    setShowSection(showSection_);
  };

  return (
    <Slide direction="left" in={showMe} mountOnEnter unmountOnExit>
      <div className="side-dialog-container">
        <>
          <div className="_heading">
            <div style={{ fontWeight: 300 }}>Current assignee:</div>
            {data?.map((assignee, index) => {
              return (
                <div key={index} style={{ fontWeight: 600 }}>
                  {assignee?.name ?? "(None)"}
                  {data?.length > 1 ? ", " : ""}
                </div>
              );
            })}
            <IconButton
              aria-label="close"
              className="_close-button"
              onClick={handleClose}
              size="small"
            >
              <CancelIcon style={{ fontSize: 18 }} />
            </IconButton>
          </div>
          <Collapse in={!showSection?.view}>
            <div className={classes.section}>
              <Typography
                style={{ fontWeight: 300 }}
                gutterBottom
                className={classes.sectionTitle}
              >
                New assignee
              </Typography>
              <div className={classes.sectionEntry}>
                <SelectOnSteroids
                  trackChange
                  hideVariableSelect
                  source="email"
                  variables={variables}
                  onChange={(e) => {
                    return _setTaskInfo(e, "reassign");
                  }}
                  multiple //={false}
                  type="user"
                />
              </div>
            </div>
          </Collapse>
          <Collapse in={!showSection?.view}>
            <div className={classes.sectionEntry} style={{ margin: 10 }}>
              <Typography gutterBottom className={classes.sectionTitle}>
                New assignment mail (optional)
                {!!hideEmailBody && (
                  <>
                    <span
                      className="email-body-save-btn"
                      onClick={() => {
                        return _convertBody(heldBody, "to-id");
                      }}
                    >
                      Save message
                    </span>

                    {!!indicator && (
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 500,
                          marginRight: 10,
                          float: "right",
                        }}
                        id="analytics-sidebar-message-saved"
                      >
                        Message saved
                      </span>
                    )}
                  </>
                )}
              </Typography>
              <Collapse in={!!hideEmailBody}>
                <RichTextEditor
                  variables={variables}
                  emailBody={_convertBody(properties?.emailBody, "from-id")}
                  holdBody={(content) => {
                    return setHeldBody(content);
                  }}
                />
              </Collapse>
            </div>
            <FormControl>
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                className={classes.customButton}
              >
                Send
              </Button>
            </FormControl>
          </Collapse>
        </>
      </div>
    </Slide>
  );
};

export default connect((state) => {
  return {
    activeTaskId: state.workflows.activeTask?.id,
    workflowTasks: state.workflows.workflowTasks,
    allVariables: state.workflows.variables,
    integrations: state.workflows.workflowIntegrations,
  };
})(AnalyticsSidebar);
