import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  Divider,
  Typography,
  Select,
  MenuItem,
  Collapse,
  FormControlLabel,
  Switch,
  IconButton,
  Grid,
  Tooltip,
  TextField,
} from "@material-ui/core";
import {
  ErrorOutlineOutlined,
  CheckCircleOutlineOutlined,
  Add,
  SwapHoriz,
} from "@material-ui/icons";
import { v4 } from "uuid";
import MyWindowsDimensions from "../../../../../utils/windowsDimension";
import RichTextEditor from "./sidebarActions/common/RichTextEditor";
import SelectOnSteroids from "./sidebarActions/common/SelectOnSteroids";
import ScreenTaskActions from "./sidebarActions/ScreenAction";
import ScheduleActivity from "./Helpers/ScheduleActivity";
import Escalation from "./Helpers/Escalation";
import ExecutionVariables from "./Helpers/ExecutionVariables";
import {
  getTaskVariables,
  globalSetTaskInfo,
  isConnectedTo,
  validFormSelfReferenceFields,
} from "../../utils/workflowFuncs";
import { NameDescription } from "./sidebarActions/common/NameDescription";
import InitiatorMatchingPair from "./Helpers/InitiatorMatchingPair";
import { INVALID_FIELD_LABEL_STYLE } from "../../utils/constants";
import { useStyles } from "./Helpers/rightSidebarStyles";
import { WORKFLOWS_TASK_SCREEN } from "../../utils/taskTypes";
import CustomConfirmBox from "../../../../../../common/components/CustomConfirmBox/CustomConfirmBox";
import { setStateTimeOut } from "../../../../../../common/helpers/helperFunctions";
import { getAllScreens } from "../../../../UIEditor/utils/screenUtilities";
import AutoReminder from "./Helpers/AutoReminder";

const ScreenTaskSidebar = ({
  activeTaskId,
  activeTaskType,
  workflowTasks,
  workflowCanvas,
  allVariables,
  screensList,
  selectedApp,
  dispatch,
}) => {
  const activeTask = workflowTasks[activeTaskId];
  const variables = getTaskVariables(activeTaskId, allVariables);

  const classes = useStyles(makeStyles);

  const [properties, setProperties] = useState(activeTask?.properties || {});
  // const [screensList, rUpdateScreensList] = useState([]);
  const [showSection, setShowSection] = useState({
    settings: true,
    action: false,
  });
  const [isInfoConfigured, setIsInfoConfigured] = useState(false);
  const [isActionsConfigured, setIsActionsConfigured] = useState(false);
  const [initiatorPairs, setInitiatorPairs] = useState([]);
  const [canAdd, setCanAdd] = useState(true);
  const [openConfirmBox, setOpenConfirmBox] = useState(false);
  const [hideAssignEmailBody, setHideAssignEmailBody] = useState(true);
  const [hideAutoRemindEmailBody, setHideAutoRemindEmailBody] = useState(true);
  const [hideEscalateEmailBody, setHideEscalateEmailBody] = useState(true);
  const [nodeIsConnectedToAny, setNodeIsConnectedToAny] = useState(false);
  const [nodeIsConnectedToStart, setNodeIsConnectedToStart] = useState(false);

  const [isLoadingScreen, setIsLoadingScreen] = useState(false);
  const [isOriginalScreen, setIsOriginalScreen] = useState(false);
  const [heldAssignBody, setHeldAssignBody] = useState(
    activeTask?.properties?.emailBody || ""
  );
  const [heldAutoRemindBody, setHeldAutoRemindBody] = useState(
    activeTask?.properties?.automaticReminder?.emailBody || ""
  );
  const [heldEscalateBody, setHeldEscalateBody] = useState(
    activeTask?.properties?.escalation?.emailBody || ""
  );
  const [indicator, setIndicator] = useState(false);
  const [selectScreenDropdownKey, setSelectScreenDropdownKey] = useState(v4());

  useEffect(() => {
    checkSetupStatus(activeTask);
  }, []);

  useEffect(() => {
    updateSelectedScreenInfo(properties?.screen);
    setIsOriginalScreen(!properties?.screenReuse?.isReusingScreen);
  }, [screensList, properties?.screen]);

  useEffect(() => {
    if (!!properties?.initiatorProfile?.length) {
      const vl = validFormSelfReferenceFields(allVariables, activeTaskId);
      const pl = properties?.initiatorProfile;
      setCanAdd(vl.length > pl.length);
      setInitiatorPairs(properties?.initiatorProfile);
    }
  }, [properties?.initiatorProfile]);

  useEffect(() => {
    setProperties({ ...activeTask?.properties });
    checkSetupStatus(activeTask);

    setIsOriginalScreen(!activeTask?.properties?.screenReuse?.isReusingScreen);
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
  }, [workflowCanvas, activeTaskId]);

  useEffect(() => {
    setHeldAssignBody(activeTask?.properties?.emailBody || "");
    setHeldAutoRemindBody(
      activeTask?.properties?.automaticReminder?.emailBody || ""
    );
    setHeldEscalateBody(activeTask?.properties?.escalation?.emailBody || "");
  }, [activeTask]);

  useEffect(() => {
    setSelectScreenDropdownKey(v4());
  }, [properties.screen, properties.screenReuse]);

  const reusableScreensFromVariables = () => {
    const resuseableScreens = (variables || []).filter(
      (variable) =>
        variable?.info?.parent !== activeTaskId && //  exclude that of current screen, if any
        variable?.info?.dataType?.includes("screen")
    );

    return resuseableScreens;
  };

  const updateSelectedScreenInfo = (screenId) => {
    const screenInfo = screensList.find((sc) => sc.id === screenId) || {};
    return screenInfo;
  };

  const _toggleSection = (e, sect) => {
    e && e.stopPropagation();
    !!e.persist && e.persist();

    const makeTrue = !showSection[sect];
    const showSection_ = { ...showSection };
    Object.keys(showSection_).forEach((p) => (showSection_[p] = false));
    if (makeTrue) showSection_[sect] = true;
    setShowSection(showSection_);
  };

  const _setTaskInfo = (e, ppty, isGrouped, aux) => {
    !!e?.persist && e.persist();

    if (
      ppty === "useInitiatorProfile" &&
      e?.target?.checked &&
      aux !== "confirmed" &&
      initiatorProfileAlreadyExists()
    ) {
      return setOpenConfirmBox(() => true);
    }

    const additionalOuterProperties = [
      "assignTask",
      "assignedTo",
      "escalateTask",
      "escalateTo",
      "escalateTaskDueDate",
    ];

    globalSetTaskInfo(
      dispatch,
      e,
      ppty,
      isGrouped,
      activeTask,
      () => {},
      additionalOuterProperties,
      checkSetupStatus,
      aux === "refreshTask"
    );
  };

  const checkSetupStatus = (info) => {
    const infoStatus =
      !!info?.name &&
      !!info?.properties?.screen &&
      (!!info?.triggeredByWebhook || !!info?.triggeredByWorkflow) &&
      (!info?.assignTask || !!info?.assignedTo?.length);

    const actionsStatus = true;
    const status = infoStatus && actionsStatus;

    const preStatus = isInfoConfigured && isActionsConfigured;

    setIsInfoConfigured(infoStatus);
    setIsActionsConfigured(actionsStatus);

    if (status === preStatus) return null;
    return status;
  };

  const _setMatchingPairs = (index, obj) => {
    const fromState = [...initiatorPairs];
    fromState[index] = obj;
    // joinInitiatorsToVariables(fromState);
    setInitiatorPairs(fromState);
    _setTaskInfo(fromState, "initiatorProfile");
  };

  const _addPair = () => {
    if (!canAdd) return;
    const fromState = [...initiatorPairs];
    fromState.push({});
    setInitiatorPairs(fromState);
    setCanAdd(false);
  };

  const _removePair = (index) => {
    const fromState = [...initiatorPairs];
    fromState.splice(index, 1);
    setInitiatorPairs(fromState);
    _setTaskInfo(fromState, "initiatorProfile");
  };

  const refetchScreens = async () => {
    setIsLoadingScreen(true);
    await dispatch(getAllScreens(selectedApp?.id || selectedApp?._id, true));
    setIsLoadingScreen(false);
  };

  const _convertBody = (content, wh, taskType) => {
    //if no content passed send emailBody as empty string
    if (!content) content = " ";

    if (wh === "to-id") {
      if (
        !!content &&
        content.slice(0, 3) === "<p>" &&
        content.slice(-4) === "</p>"
      ) {
        content = !!content ? content.slice(3, -4) : "";
        setStateTimeOut(setIndicator, true, false);
      }

      if (!!content && taskType === "assignScreen") {
        _setTaskInfo(content, "emailBody");
      } else if (!!content && taskType === "escalation") {
        _setTaskInfo(
          { ...activeTask?.properties?.escalation, emailBody: content },
          "escalation"
        );
      } else if (!!content && taskType === "automaticReminder") {
        _setTaskInfo(
          { ...activeTask?.properties?.automaticReminder, emailBody: content },
          "automaticReminder"
        );
      }
    } else if (wh === "from-id") {
      //this is the fix for clearing off variable error.
      if (content === " ") {
        return " ";
      }
      const finalValue = !!content ? content + "&nbsp;" : " ";

      return finalValue;
    }
  };

  /**
   * If there are any ScreenTasks in the workflow, and any of them have the property useInitiatorProfile
   * set to true, then return false, otherwise return true.
   * @returns a boolean value.
   */
  const initiatorProfileAlreadyExists = () => {
    for (const _task in workflowTasks) {
      if (
        workflowTasks[_task]?.type === WORKFLOWS_TASK_SCREEN &&
        workflowTasks[_task]?.properties?.useInitiatorProfile &&
        workflowTasks[_task]?.id !== activeTaskId
      ) {
        return true;
      }
    }

    return false;
  };

  /**
   * If the action is true, set the showInitorProfile state to true and set the openConfirmBox state to
   * false.
   * If the action is false, set the openConfirmBox state to false.
   * @param open - boolean
   * @param action - true or false
   */
  const confirmReplaceInitiatorProfile = () => {
    _setTaskInfo(
      { target: { checked: true } },
      "useInitiatorProfile",
      null,
      "confirmed"
    );
    setOpenConfirmBox(() => false);
  };

  const updateFieldsAttributes = (newFieldAttributes) => {
    _setTaskInfo(
      {
        "screenReuse.fieldsAttributes": [newFieldAttributes],
        notAffectVariables: true,
      },
      null,
      true
    );
  };

  return (
    <div className={classes.container}>
      <MyWindowsDimensions setWinDim={() => {}} />
      <div
        className={classes.sideHeadingBar}
        onClick={(e) => _toggleSection(e, "settings")}
      >
        <Typography gutterBottom className={classes.sideHeading}>
          {activeTask?.type || ""} Information
          {isInfoConfigured ? (
            <CheckCircleOutlineOutlined
              style={{ fontSize: 16, marginLeft: 10, color: "green" }}
            />
          ) : (
            <ErrorOutlineOutlined
              style={{ fontSize: 16, marginLeft: 10, color: "red" }}
            />
          )}
        </Typography>
      </div>
      <Collapse in={!!showSection.settings}>
        <Divider style={{ marginBottom: 10 }} />
        <div className={classes.section} style={{ paddingBottom: 0 }}>
          <NameDescription
            selectedApp={selectedApp}
            activeTask={activeTask}
            _setTaskInfo={_setTaskInfo}
            nodeIsConnectedToAny={nodeIsConnectedToAny}
            nodeIsConnectedToStart={nodeIsConnectedToStart}
            classes={classes}
          />

          <hr style={{ margin: "20px 0" }} />
          <div
            className={classes.sectionEntry}
            style={{ borderBottom: "solid 1px #EEE" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                gutterBottom
                className={classes.sectionTitle}
                style={!properties?.screen ? INVALID_FIELD_LABEL_STYLE : {}}
              >
                Select screen*
              </Typography>
              {/* <Tooltip title="Reload screens">
                <Refresh
                  className={isLoadingScreen ? "icon-spin" : ""}
                  style={{
                    fontSize: 16,
                    ...(isLoadingScreen
                      ? { color: "#06188f", cursor: "default" }
                      : { color: "#999", cursor: "pointer" }),
                  }}
                  onClick={isLoadingScreen ? null : () => refetchScreens()}
                />
              </Tooltip> */}
            </div>
            <Select
              key={`${selectScreenDropdownKey}${
                properties?.screenReuse?.isReusingScreen
                  ? `${properties?.screenReuse?.reusableScreenVariableId}|${properties?.screen}`
                  : properties?.screen || "choose"
              }`}
              variant="outlined"
              size="small"
              fullWidth
              placeholder="Select screen"
              classes={{
                root: classes.select,
                outlined: classes.selected,
              }}
              defaultValue={
                properties?.screenReuse?.isReusingScreen
                  ? `re-${properties?.screenReuse?.reusableScreenVariableId}`
                  : properties?.screen || "choose"
              }
              // onChange={(e) => handleScreenSelect(e, "screen")}
              onChange={(e) =>
                _setTaskInfo(
                  {
                    screen: e.target.value,
                    screenType: screensList?.find(
                      (eachScreen) => eachScreen.id === e.target.value
                    )?.type,
                  },
                  "screen",
                  true,
                  "refreshTask"
                )
              }
            >
              <MenuItem value="choose" selected disabled>
                <em>Select screen</em>
              </MenuItem>
              {reusableScreensFromVariables().map((reusableScreen, index) => (
                <MenuItem
                  key={`re-select-screen-${reusableScreen.id}-${index}`}
                  value={`re-${reusableScreen.id}`}
                  style={{ justifyContent: "space-between" }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div className={classes.reuseableScreenBadge}>RE</div>
                    {reusableScreen?.info?.name}
                  </div>
                  <span
                    style={{
                      color: "#0c7b93",
                      fontStyle: "italic",
                      textTransform: "capitalize",
                    }}
                  >
                    [ Reusable ]
                  </span>
                </MenuItem>
              ))}

              {!!reusableScreensFromVariables().length && <hr />}

              {screensList.map((el, i) => (
                <MenuItem
                  key={`select-screen-${el.id}-${i}`}
                  value={el.id}
                  style={{ justifyContent: "space-between" }}
                >
                  <div>{el.name}</div>
                  <span
                    style={{
                      color: "#0c7b93",
                      fontStyle: "italic",
                      textTransform: "capitalize",
                    }}
                  >
                    [ {el.type} ]
                  </span>
                </MenuItem>
              ))}
            </Select>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              gutterBottom
              className={classes.sectionTitle}
              //style={!properties?.screen ? INVALID_FIELD_LABEL_STYLE : {}}
            >
              Next button text
            </Typography>
          </div>
          <TextField
            key={`${activeTask?.id}-customNextButtonLabel`}
            variant="outlined"
            size="small"
            fullWidth
            placeholder="Enter title"
            InputProps={{
              className: classes.input,
            }}
            // value={activeTask?.name || ""}
            defaultValue={activeTask?.properties?.customNextButtonLabel}
            onChange={(e) => _setTaskInfo(e, "customNextButtonLabel")}
            // onBlur={_setTaskInfo}
          />

          {/* 
            - show this section if screen has fields and 
            if selected screen is original screen 
            - once this is activated, an extra variable
            is added to the vairables list for node
          */}

          {!!properties?.screen &&
            properties?.screenType !== "document" &&
            // !!getScreenFieldVariables().length &&
            isOriginalScreen && (
              <Collapse
                in={!!properties?.screen}
                style={{ borderBottom: "solid 1px #EEE" }}
              >
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
                        key={properties?.screenReuse?.isReusableScreen}
                        defaultChecked={
                          properties?.screenReuse?.isReusableScreen
                        }
                        // onChange={makeScreenReusable}
                        onChange={(e) =>
                          _setTaskInfo(
                            e,
                            "screenReuse.isReusableScreen",
                            false,
                            "refreshTask"
                          )
                        }
                        name="checkedC"
                        color="primary"
                        size="small"
                      />
                    }
                    label="Make screen reusable"
                    labelPlacement="start"
                  />
                </div>
              </Collapse>
            )}
          {selectedApp?.isPublic && (
            <Collapse
              in={!!properties?.screen}
              style={{ borderBottom: "solid 1px #EEE" }}
            >
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
                      key={properties?.useInitiatorProfile}
                      defaultChecked={properties?.useInitiatorProfile}
                      onChange={(e) => _setTaskInfo(e, "useInitiatorProfile")}
                      name="checkedC"
                      color="primary"
                      size="small"
                    />
                  }
                  label="Create initiator profile"
                  labelPlacement="start"
                />
              </div>

              <Collapse in={!!properties?.useInitiatorProfile}>
                <div
                  className={classes.matchingFields}
                  style={{ marginTop: 0, marginBottom: 5 }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginTop: 3,
                    }}
                  >
                    <div className={classes.mappingTitle}>
                      <Typography
                        gutterBottom
                        style={{ fontSize: 12, color: "#f7a712" }}
                      >
                        Reference name
                      </Typography>
                      <SwapHoriz />
                    </div>
                    <Typography gutterBottom className={classes.mappingTitle}>
                      Matching form field
                    </Typography>
                  </div>

                  {initiatorPairs.map((value, index) => (
                    <InitiatorMatchingPair
                      key={index}
                      map={{ value, index }}
                      setInitiatorPairs={_setMatchingPairs}
                      initiatorPairs={initiatorPairs}
                      pairsList={properties?.initiatorProfile || [{}]}
                      removePair={_removePair}
                      setCanAdd={setCanAdd}
                      count={initiatorPairs}
                      variables={validFormSelfReferenceFields(
                        allVariables,
                        activeTaskId
                      )}
                    />
                  ))}

                  <IconButton
                    onClick={_addPair}
                    aria-label="Add pair"
                    size="small"
                    className={classes.addMatch}
                    disabled={!canAdd}
                  >
                    <Add style={{ fontSize: 20 }} />
                  </IconButton>
                </div>
              </Collapse>
            </Collapse>
          )}
          <Collapse
            in={properties?.screenType === "document"}
            style={{ borderBottom: "solid 1px #EEE" }}
          >
            <Grid
              container
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
                    key={properties?.previewDownload}
                    defaultChecked={properties?.previewDownload}
                    onChange={(e) => _setTaskInfo(e, "previewDownload")}
                    name="checkDoc"
                    color="primary"
                    size="small"
                  />
                }
                label={
                  <>
                    Show preview button
                    <Tooltip
                      title="This option will automatically open the document preview and the
                user can download thereafter."
                    >
                      <div className="info-icon-tooltip-1">i</div>
                    </Tooltip>
                  </>
                }
                labelPlacement="start"
              />
            </Grid>
            {/* <Grid container>
              <Typography
                variant="p"
                component="p"
                className={classes.sectionTitle}
                style={{ color: "#7c9baf"}}
              >
                This option will automatically open the document preview and the
                user can download thereafter.
              </Typography>
            </Grid> */}
          </Collapse>

          {/* ASSIGN SCREEN SECTION */}
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
                  label:
                    !activeTask?.assignTask || !!activeTask?.assignedTo?.length
                      ? classes.sectionTitle
                      : classes.sectionTitleError,
                }}
                control={
                  <Switch
                    key={!!activeTask?.assignTask}
                    defaultChecked={!!activeTask?.assignTask}
                    onChange={(e) => _setTaskInfo(e, "assignTask")}
                    name="checkedC"
                    color="primary"
                    size="small"
                  />
                }
                label="Assign screen"
                labelPlacement="start"
              />
            </div>
            <Collapse in={!!activeTask?.assignTask}>
              <div style={{ marginBottom: 0 }}>
                <div className={classes.sectionEntry}>
                  <SelectOnSteroids
                    source="email"
                    variables={variables}
                    onChange={(e) => _setTaskInfo(e, "assignedTo")}
                    value={activeTask?.assignedTo || []}
                    type="email"
                    multiple={true}
                  />
                </div>
                <div className={classes.sectionEntry}>
                  <Typography
                    gutterBottom
                    className={classes.sectionTitle}
                    style={{ marginBottom: hideAssignEmailBody ? 0 : 10 }}
                  >
                    Message (optional)
                    <span
                      className="email-collapse-body"
                      onClick={() => {
                        setHideAutoRemindEmailBody(true);
                        setHideEscalateEmailBody(true);
                        setHideAssignEmailBody(!hideAssignEmailBody);
                      }}
                    >
                      {!hideAssignEmailBody ? "Collapse" : "Expand"}
                    </span>
                    {!hideAssignEmailBody ? (
                      <>
                        <span
                          className="email-body-save-btn"
                          onClick={() =>
                            _convertBody(
                              heldAssignBody,
                              "to-id",
                              "assignScreen"
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
              </div>
            </Collapse>
          </div>

          {/* <Collapse in={!!activeTask?.assignTask}> */}
          {/* </Collapse> */}
          <Collapse in={!!activeTask?.assignTask}>
            <div
              style={{ marginBottom: "9px", borderBottom: "solid 1px #EEE" }}
            >
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
                      key={!!activeTask?.useCustomTrigger}
                      defaultChecked={!!activeTask?.useCustomTrigger}
                      onChange={(e) => _setTaskInfo(e, "useCustomTrigger")}
                      name="checkedC"
                      color="primary"
                      size="small"
                    />
                  }
                  label="Schedule screen"
                  labelPlacement="start"
                />
              </div>

              {!!activeTask?.useCustomTrigger ? (
                <ScheduleActivity
                  activeTask={activeTask}
                  classes={classes}
                  saveScheduleInfo={_setTaskInfo}
                  variables={variables}
                  from="screenTask"
                />
              ) : null}
            </div>
            <div
              style={{
                paddingBottom: 0,
                borderBottom: "1px solid #eee",
              }}
            >
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
                      key={!!properties?.automaticReminder?.autoMailTask}
                      defaultChecked={
                        !!properties?.automaticReminder?.autoMailTask
                      }
                      onChange={(e) =>
                        _setTaskInfo(
                          {
                            ...properties.automaticReminder,
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

              <Collapse in={properties?.automaticReminder?.autoMailTask}>
                <AutoReminder
                  activeTask={activeTask}
                  classes={classes}
                  properties={properties}
                  _setTaskInfo={(data) =>
                    _setTaskInfo(data, "automaticReminder")
                  }
                  variables={variables}
                  from="screenTask"
                />

                <div
                  className={classes.sectionEntry}
                  style={{ marginTop: "9px" }}
                >
                  <Typography gutterBottom className={classes.sectionTitle}>
                    Message (optional)
                    <span
                      className="email-collapse-body"
                      onClick={() => {
                        setHideAssignEmailBody(true);
                        setHideEscalateEmailBody(true);
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
                      key={!!properties?.escalation?.escalateTask}
                      defaultChecked={!!properties?.escalation?.escalateTask}
                      onChange={(e) =>
                        _setTaskInfo(
                          {
                            ...properties.escalation,
                            escalateTask: e.target.checked,
                          },
                          "escalation"
                        )
                      }
                      name="checkedC"
                      color="primary"
                      size="small"
                    />
                  }
                  label="Escalation"
                  labelPlacement="start"
                />
              </div>

              <Collapse in={!!properties?.escalation?.escalateTask}>
                <Escalation
                  activeTask={activeTask}
                  properties={properties}
                  classes={classes}
                  _setTaskInfo={(data, type) =>
                    _setTaskInfo(data, "escalation")
                  }
                  variables={variables}
                  from={"screenTask"}
                />
                <div className={classes.sectionEntry}>
                  <Typography gutterBottom className={classes.sectionTitle}>
                    Message (optional)
                    <span
                      className="email-collapse-body"
                      onClick={() => {
                        setHideAssignEmailBody(true);
                        setHideAutoRemindEmailBody(true);
                        setHideEscalateEmailBody(!hideEscalateEmailBody);
                      }}
                    >
                      {!hideEscalateEmailBody ? "Collapse" : "Expand"}
                    </span>
                    {!hideEscalateEmailBody ? (
                      <>
                        <span
                          className="email-body-save-btn"
                          onClick={() =>
                            _convertBody(
                              heldEscalateBody,
                              "to-id",
                              "escalation"
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
                  <Collapse in={!hideEscalateEmailBody}>
                    {" "}
                    {!hideEscalateEmailBody && (
                      <RichTextEditor
                        variables={variables}
                        emailBody={_convertBody(heldEscalateBody, "from-id")}
                        holdBody={(content) => setHeldEscalateBody(content)}
                      />
                    )}
                  </Collapse>
                </div>
              </Collapse>
            </div>
          </Collapse>
        </div>
        <ExecutionVariables
          activeTask={activeTask}
          setTaskInfo={_setTaskInfo}
          activeTaskId={activeTaskId}
          variables={allVariables}
          classes={classes}
        />
      </Collapse>
      <div
        className={classes.sideHeadingBar}
        onClick={(e) => _toggleSection(e, "action")}
      >
        <Typography gutterBottom className={classes.sideHeading}>
          Action details
          {isActionsConfigured && (
            <CheckCircleOutlineOutlined
              style={{ fontSize: 16, marginLeft: 10, color: "green" }}
            />
          )}
          {!isActionsConfigured && (
            <ErrorOutlineOutlined
              style={{ fontSize: 16, marginLeft: 10, color: "red" }}
            />
          )}
        </Typography>
      </div>

      <Collapse in={!!showSection.action}>
        <div className={classes.section}>
          <ScreenTaskActions
            activeTaskId={activeTaskId}
            isReusableScreen={properties?.screenReuse?.isReusableScreen}
            isReusingScreen={properties?.screenReuse?.isReusingScreen}
            fieldsAttributes={
              properties?.screenReuse?.fieldsAttributes?.[0] || {}
            }
            updateFieldsAttributes={updateFieldsAttributes}
            dynamicContents={properties?.dynamicContents}
            lookupContents={properties?.lookupContents}
            dynamicContentsStructure={properties?._dynamicContentsStructure}
            updateDynamicContents={(data) =>
              _setTaskInfo(data, "dynamicContents")
            }
            updateLookupContents={(data) =>
              _setTaskInfo(data, "lookupContents")
            }
          />
        </div>
      </Collapse>

      {openConfirmBox && (
        <CustomConfirmBox
          closeConfirmBox={() => setOpenConfirmBox(false)}
          text={`You have already performed this action. Do you want 
        to replace Initiator Profile on the other screen task?`}
          open={openConfirmBox}
          confirmAction={confirmReplaceInitiatorProfile}
        />
      )}
      <Divider />
    </div>
  );
};

export default connect((state) => {
  return {
    activeTaskId: state.workflows.activeTask?.id,
    activeTaskType: state.workflows.activeTask?.type,
    workflowTasks: state.workflows.workflowTasks,
    workflowCanvas: state.workflows.workflowCanvas,
    allVariables: state.workflows.variables,
    integrations: state.workflows.workflowIntegrations,
    screensList: state.screens.screensList,
    selectedApp: state.appsReducer.selectedApp,
  };
})(ScreenTaskSidebar);
