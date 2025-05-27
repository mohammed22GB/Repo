import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  Divider,
  Typography,
  TextField,
  Collapse,
  FormControlLabel,
  Switch,
  IconButton,
} from "@material-ui/core";
import {
  ErrorOutlineOutlined,
  CheckCircleOutlineOutlined,
  Add,
  CancelRounded,
  ArrowDropDown,
} from "@material-ui/icons";
import { v4 } from "uuid";

import MyWindowsDimensions from "../../../../../utils/windowsDimension";
import RichTextEditor from "./sidebarActions/common/RichTextEditor";
import SelectOnSteroids from "./sidebarActions/common/SelectOnSteroids";
import { NameDescription } from "./sidebarActions/common/NameDescription";
import {
  INVALID_FIELD_LABEL_STYLE,
  decisionNodeOutputHandles,
} from "../../utils/constants";
import {
  getTaskVariables,
  globalSetTaskInfo,
  isConnectedTo,
} from "../../utils/workflowFuncs";
import { setStateTimeOut } from "../../../../../../common/helpers/helperFunctions";
import AutoReminder from "./Helpers/AutoReminder";
import ExecutionVariables from "./Helpers/ExecutionVariables";
import { useStyles } from "./Helpers/rightSidebarStyles";

/* const useStyles = makeStyles((theme) => ({
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
  divider: {
    marginTop: 15,
    marginBottom: 15,
  },
  section: {
    padding: 10,
    paddingBottom: 20,
    // marginBottom: 100,
  },
  container: {
    overflow: "hidden",
    height: "100%",
    "&:hover": {
      overflow: "overlay",
    },
  },
  actionsListItem: {
    width: "30%",
    height: 80,
    margin: 5,
    display: "inline-block",
    textAlign: "center",
    backgroundColor: "white",
    border: "solid 1px white",
    boxShadow: "1px 1px 3px #ccc",
    borderRadius: 10,
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "#fafafa",
      border: "solid 1px #eaeaea",
      boxShadow: "none",
      color: "#1846c8",
    },
  },
  closeIcon: {
    fontSize: 16,
    color: "#AAAAAA",
    marginRight: 10,
    cursor: "pointer",
    "&:hover": {
      color: "#091540",
    },
  },
  sectionTitle: {
    color: "#999",
    fontSize: 12,
    marginBottom: 5,
  },
  input: {
    color: "#091540",
    fontSize: 12,
    // marginBottom: 12,
  },
  select: {
    color: "#091540",
    fontSize: 12,
    padding: 10,
  },
  switchLabel: {
    width: "100%",
    justifyContent: "space-between",
    margin: 0,
  },
  matchingFields: {
    borderRadius: 5,
    border: "dashed 1.5px #999",
    padding: "10px 5px 10px 10px",
    backgroundColor: "#f8f8f8",
    marginTop: 7,
  },
  mappingTitle: {
    fontSize: 12,
    flex: 1,
    color: "#f7a712",
    display: "flex",
    justifyContent: "space-between",
  },
  pair: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    "& > div, & > p": {
      flex: 1,
      "&:first-child": {
        marginRight: 5,
      },
    },
  },
  multiSelect: {
    display: "flex",
    flexWrap: "wrap",
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
    backgroundColor: "#f8f8f8",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    height: 29,
    "&:hover": {
      opacity: 0.7,
    },
  },
  sectionEntry: {
    marginBottom: 13,
  },
  addMatch: {
    fontSize: 20,
    boxShadow: "0px 2px 3px #aaa",
    borderRadius: "14%",
    // marginTop: 10,
  },
})); */

const ApprovalTaskSidebar = ({
  activeTaskId,
  workflowTasks,
  workflowCanvas,
  allVariables,
  dispatch,
}) => {
  const activeTask = workflowTasks[activeTaskId];
  const variables = getTaskVariables(activeTaskId, allVariables);

  const classes = useStyles(makeStyles);
  // const classes = useStyles();
  const [windowDimensions, setWindowDimensions] = useState({});
  const [selectFormFields, setSelectFormFields] = useState([]);
  const [formsList, setFormsList] = useState([]);
  const [showSection, setShowSection] = useState({
    settings: true,
    action: false,
  });
  const [taskUpdated, setTaskUpdated] = useState(false);
  const [settingsComplete, setSettingsComplete] = useState(false);
  const [actionComplete, setActionComplete] = useState(false);
  const [initiatorPairs, setInitiatorPairs] = useState([{}]);
  const [indicator, setIndicator] = useState(false);
  const [hideAssignEmailBody, setHideAssignEmailBody] = useState(true);
  const [hideAutoRemindEmailBody, setHideAutoRemindEmailBody] = useState(true);
  const [heldAssignBody, setHeldAssignBody] = useState(
    activeTask?.properties?.emailBody
  );
  const [heldAutoRemindBody, setHeldAutoRemindBody] = useState(
    activeTask?.properties?.automaticReminder?.emailBody
  );
  const [nodeIsConnectedToAny, setNodeIsConnectedToAny] = useState(false);
  const [nodeIsConnectedToStart, setNodeIsConnectedToStart] = useState(false);
  const [fieldsKey, setFieldsKey] = useState("-");

  useEffect(() => {
    setFieldsKey(v4());
  }, [activeTaskId]);

  useEffect(() => {
    _selectFormFields(activeTask?.properties?.formId);
  }, [activeTask?.properties?.formId, formsList]);

  useEffect(() => {
    !!activeTask?.properties?.initiatorProfile?.length &&
      setInitiatorPairs(activeTask?.properties?.initiatorProfile);
  }, [activeTask?.properties?.initiatorProfile]);

  useEffect(() => {
    checkSetupStatus(activeTask);
  }, [activeTask]);

  useEffect(() => {
    const isConnectedToAnySource = isConnectedTo(
      activeTaskId,
      workflowCanvas,
      "anyNode"
    );
    const isConnectedToStartNode = isConnectedTo(
      activeTaskId,
      workflowCanvas,
      "startNode"
    );
    setNodeIsConnectedToAny(isConnectedToAnySource);
    setNodeIsConnectedToStart(isConnectedToStartNode);
  }, [workflowCanvas, activeTask]);

  const _toggleSection = (e, sect) => {
    e && e.stopPropagation();

    const makeTrue = !showSection[sect];
    const showSection_ = { ...showSection };
    Object.keys(showSection_).forEach((p) => (showSection_[p] = false));
    if (makeTrue) showSection_[sect] = true;
    setShowSection(showSection_);
  };

  const _setTaskInfo = (e, ppty, isGrouped) => {
    !!e.persist && e.persist();

    globalSetTaskInfo(
      dispatch,
      e,
      ppty,
      isGrouped,
      activeTask,
      setTaskUpdated,
      [],
      checkSetupStatus
    );
  };

  const checkSetupStatus = (info, auto) => {
    // auto && _toggleSection(null, 'action');
    let sC, aC;

    const approvalActionsOK = () => {
      const acts = [...(activeTask?.properties?.approvalActions || [])];
      return acts.length > 1 && acts.filter((x) => !!x?.label).length > 1;
    };

    if (!!info?.name && !!info?.assignedTo?.length) {
      sC = true;
      setSettingsComplete(true);
    } else {
      sC = false;
      setSettingsComplete(false);
    }

    if (approvalActionsOK()) {
      aC = true;
      setActionComplete(true);
    } else {
      aC = false;
      setActionComplete(false);
    }

    return sC && aC;
  };

  const _selectFormFields = (val) => {
    // alert(formsList.length);
    const frmLst = [...formsList];
    if (!val || !frmLst.length) {
      setSelectFormFields([]);
      return;
    }

    const items = frmLst?.find((f) => f.id === val)?.style?.values?.children;

    !!items?.length && setSelectFormFields(items);
  };

  const _approvalActioning = (val, index) => {
    const list = [...activeTask?.properties?.approvalActions];

    switch (val) {
      case "add":
        list.push({
          label: "",
          sourceHandle: ["b", "c", "d", "e", "f", "g", "h", "i", "j", "k"][
            index
          ], //  only b - d are active though ;)
        });
        break;

      case "del":
        list.splice(index, 1);
        break;

      default:
        list[index].label = val.target.value;
        break;
    }

    _setTaskInfo(
      { target: { value: list, tagName: "myTag" } },
      "approvalActions"
    );
  };

  const _convertBody = (content, wh, taskType) => {
    if (wh === "to-id") {
      if (
        !!content &&
        content.slice(0, 3) === "<p>" &&
        content.slice(-4) === "</p>"
      ) {
        content = !!content ? content.slice(3, -4) : "";
      }
      setStateTimeOut(setIndicator, true, false);

      if (taskType === "assignScreen") {
        _setTaskInfo(content, "emailBody");
      } else if (taskType === "automaticReminder") {
        _setTaskInfo(
          { ...activeTask?.properties?.automaticReminder, emailBody: content },
          "automaticReminder"
        );
      }
    } else if (wh === "from-id") {
      return !!content ? content + "&nbsp;" : "&nbsp;";
    }
  };

  /* const listOutDecisionActions = (savedDecisions = []) => {
    const decisionsList = decisionNodeOutputHandles.map((decision, index) => {
      return savedDecisions[index] || {};
    });
    return decisionsList;
  }; */

  const DecisionAction = ({ value, index }) => (
    <div className={classes.pair} key={index}>
      <div
        style={{
          width: 7,
          flex: "none",
          backgroundColor: decisionNodeOutputHandles[index]?.color,
          height: "2.88em",
          borderRadius: 5,
        }}
      ></div>
      <TextField
        key={`${fieldsKey}-1`}
        variant="outlined"
        id="outlined-start-adornment"
        size="small"
        // sx={{ m: 1, width: '25ch' }}
        // value={value.label}
        defaultValue={value.label}
        onChange={(e) => _approvalActioning(e, index)}
        // onBlur={_setTaskInfo}
      />

      <div className={classes.addComponent}>
        <IconButton
          size="small"
          onClick={() => _approvalActioning("del", index)}
          // disabled={activeTask?.properties?.approvalActions?.length <= 1}
          disabled={true}
        >
          <CancelRounded style={{ fontSize: 16 }} />
        </IconButton>
      </div>
    </div>
  );

  return (
    <div className={classes.container}>
      <MyWindowsDimensions setWinDim={setWindowDimensions} />
      <div
        className={classes.sideHeadingBar}
        onClick={(e) => _toggleSection(e, "settings")}
      >
        <Typography gutterBottom className={classes.sideHeading}>
          {activeTask?.type || ""} information
          {settingsComplete && (
            <CheckCircleOutlineOutlined
              style={{ fontSize: 16, marginLeft: 10, color: "green" }}
            />
          )}
          {!settingsComplete && (
            <ErrorOutlineOutlined
              style={{ fontSize: 16, marginLeft: 10, color: "red" }}
            />
          )}
        </Typography>
        {/* <Tooltip title="Close"><CancelIcon className={classes.closeIcon} onClick={cancelNewTask} /></Tooltip> */}
      </div>
      <Collapse in={!!showSection.settings}>
        <Divider style={{ marginBottom: 10 }} />
        <div className={classes.section} style={{ paddingBottom: 0 }}>
          <NameDescription
            activeTask={activeTask}
            _setTaskInfo={_setTaskInfo}
            nodeIsConnectedToAny={nodeIsConnectedToAny}
            nodeIsConnectedToStart={nodeIsConnectedToStart}
          />
          <hr style={{ margin: "20px 0" }} />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              margin: "20px 0px 5px",
            }}
          >
            <FormControlLabel
              classes={{
                root: classes.switchLabel,
                label: classes.sectionTitle,
              }}
              control={
                <Switch
                  checked={true}
                  name="checkedC"
                  color="primary"
                  size="small"
                />
              }
              label="Assign approval"
              labelPlacement="start"
            />
          </div>

          <div className={classes.sectionEntry}>
            <Typography
              gutterBottom
              className={classes.sectionTitle}
              style={
                !activeTask?.assignedTo?.length ? INVALID_FIELD_LABEL_STYLE : {}
              }
            >
              Assign to*
            </Typography>
            <SelectOnSteroids
              // disabled={!activeTask?.properties?.calendarId}
              source="email"
              variables={variables}
              onChange={(e) => _setTaskInfo(e, "assignedTo")}
              value={activeTask?.assignedTo}
              type="email"
              multiple
            />
          </div>
          <div
            className={classes.sectionEntry}
            style={{ borderBottom: "1px solid #eee", paddingBottom: 0 }}
          >
            <Typography
              gutterBottom
              className={classes.sectionTitle}
              style={{ display: "flex", alignItems: "center" }}
            >
              Approval mail message (optional)
              <>
                <span
                  style={{
                    marginLeft: "auto",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {indicator ? (
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 500,
                        //marginRight: 10,
                        float: "left",
                      }}
                      id="approval-task-message-saved"
                    >
                      Message saved
                    </span>
                  ) : (
                    ""
                  )}
                  <ArrowDropDown
                    style={{
                      color: "#03bb03",
                      fontSize: 28,
                      marginLeft: "auto",
                      //marginRight: -8,
                    }}
                    onClick={() => {
                      setHideAutoRemindEmailBody(true);
                      setHideAssignEmailBody(!hideAssignEmailBody);
                    }}
                  />
                </span>
                <span
                  className="email-body-save-btn"
                  onClick={() =>
                    _convertBody(heldAssignBody, "to-id", "assignScreen")
                  }
                >
                  Save message
                </span>
              </>
            </Typography>
            <Collapse in={!hideAssignEmailBody}>
              {" "}
              {!hideAssignEmailBody && (
                <RichTextEditor
                  variables={variables}
                  emailBody={_convertBody(heldAssignBody, "from-id")}
                  holdBody={(content) => setHeldAssignBody(content)}
                />
              )}
            </Collapse>
          </div>

          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                margin: "10px 0px",
              }}
            >
              <FormControlLabel
                classes={{
                  root: classes.switchLabel,
                  label: classes.sectionTitle,
                }}
                control={
                  <Switch
                    key={
                      !!activeTask?.properties?.automaticReminder?.autoMailTask
                    }
                    defaultChecked={
                      !!activeTask?.properties?.automaticReminder?.autoMailTask
                    }
                    onChange={(e) =>
                      _setTaskInfo(
                        {
                          ...activeTask?.properties.automaticReminder,
                          autoMailTask: e.target.checked,
                        },
                        "automaticReminder"
                      )
                    }
                    name="checkedC"
                    color="primary"
                    size="small"
                  />
                }
                label="Auto-reminder"
                labelPlacement="start"
              />
            </div>

            <Collapse
              in={!!activeTask?.properties?.automaticReminder?.autoMailTask}
            >
              <AutoReminder
                activeTask={activeTask}
                classes={classes}
                properties={activeTask?.properties}
                _setTaskInfo={(data) => _setTaskInfo(data, "automaticReminder")}
                variables={variables}
                from="screenTask"
              />

              <div className={classes.sectionEntry}>
                <Typography gutterBottom className={classes.sectionTitle}>
                  Message (optional)
                  <span
                    className="email-collapse-body"
                    onClick={() => {
                      setHideAssignEmailBody(true);
                      setHideAutoRemindEmailBody(!hideAutoRemindEmailBody);
                    }}
                  >
                    {!hideAutoRemindEmailBody ? "Collapse" : "Expand"}
                  </span>
                  {!hideAutoRemindEmailBody ? (
                    <>
                      <span
                        className="email-body-save-btn"
                        onClick={() =>
                          _convertBody(
                            heldAutoRemindBody,
                            "to-id",
                            "automaticReminder"
                          )
                        }
                      >
                        Save message
                      </span>
                      {indicator ? (
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 500,
                            marginRight: 10,
                            float: "right",
                          }}
                          id="screen-task-message-saved"
                        >
                          Message saved
                        </span>
                      ) : (
                        ""
                      )}
                    </>
                  ) : (
                    ""
                  )}
                </Typography>
                <Collapse in={!hideAutoRemindEmailBody}>
                  {" "}
                  {!hideAutoRemindEmailBody && (
                    <RichTextEditor
                      variables={variables}
                      emailBody={_convertBody(heldAutoRemindBody, "from-id")}
                      holdBody={(content) => setHeldAutoRemindBody(content)}
                    />
                  )}
                </Collapse>
              </div>
            </Collapse>
          </div>
        </div>
        <ExecutionVariables
          activeTask={activeTask}
          setTaskInfo={_setTaskInfo}
          activeTaskId={activeTaskId}
          variables={allVariables}
          classes={classes}
        />
      </Collapse>
      <Divider />
      <div
        className={classes.sideHeadingBar}
        onClick={(e) => _toggleSection(e, "action")}
      >
        <Typography gutterBottom className={classes.sideHeading}>
          Action details
          {actionComplete && (
            <CheckCircleOutlineOutlined
              style={{ fontSize: 16, marginLeft: 10, color: "green" }}
            />
          )}
          {!actionComplete && (
            <ErrorOutlineOutlined
              style={{ fontSize: 16, marginLeft: 10, color: "red" }}
            />
          )}
        </Typography>
        {/* <Tooltip title="Close"><CancelIcon className={classes.closeIcon} onClick={cancelNewTask} /></Tooltip> */}
      </div>
      <Divider style={{ marginBottom: 10 }} />

      <Collapse in={!!showSection.action}>
        <div className={classes.section}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <FormControlLabel
              classes={{
                root: classes.switchLabel,
                label: classes.sectionTitle,
              }}
              control={
                <Switch
                  // checked ={ !taskPos || activeTask?.useCustomTrigger }
                  checked={true}
                  // onChange={(e) => _setTaskInfo(e, "useCustomTrigger")}
                  name="checkedB"
                  color="primary"
                  size="small"
                />
              }
              label="Add actions*"
              labelPlacement="start"
            />
          </div>

          <Collapse in={true}>
            <div
              className={classes.matchingFields}
              style={{ marginBottom: 15 }}
            >
              {activeTask?.properties?.approvalActions?.map((value, index) =>
                DecisionAction({ value, index })
              )}

              <IconButton
                onClick={() => _approvalActioning("add")}
                aria-label="Add pair"
                size="small"
                className={classes.addMatch}
                /* disabled={
                  activeTask?.properties?.approvalActions?.length >=
                  MAX_APPOVAL_ACTIONS
                } */
                disabled={true}
              >
                <Add style={{ fontSize: 20 }} />
              </IconButton>
            </div>
          </Collapse>
        </div>
      </Collapse>
      <Divider style={{ marginBottom: 100 }} />
    </div>
  );
};

export default connect((state) => {
  return {
    activeTaskId: state.workflows.activeTask?.id,
    workflowTasks: state.workflows.workflowTasks,
    workflowCanvas: state.workflows.workflowCanvas,
    allVariables: state.workflows.variables,
    activeTaskType: state.workflows.activeTask?.type,
    taskPos: state.workflows.pos,
  };
})(ApprovalTaskSidebar);
