import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import {
  Divider,
  Typography,
  TextField,
  Select,
  MenuItem,
  Collapse,
  FormControlLabel,
  Switch,
} from "@material-ui/core";
import {
  ErrorOutlineOutlined,
  CheckCircleOutlineOutlined,
} from "@material-ui/icons";
import MyWindowsDimensions from "../../../../../utils/windowsDimension";
import VariablesMenuItems from "../../../utils/VariablesMenuItems";
import SelectOnSteroids from "./sidebarActions/common/SelectOnSteroids";
import { NameDescription } from "./sidebarActions/common/NameDescription";
import {
  getTaskVariables,
  globalSetTaskInfo,
  isConnectedTo,
} from "../../utils/workflowFuncs";
import { v4 } from "uuid";
import useCustomMutation from "../../../../../../common/utils/CustomMutation";
import {
  getGoogleUserIntegrationsAPI,
  getUserCalendarAPI,
  requestUrlForGoogleAPI,
} from "../../../../../../common/utils/googleAPIConnect";
import useCustomQuery from "../../../../../../common/utils/CustomQuery";

const useStyles = makeStyles((theme) => ({
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
  sectionTitle1: {
    color: "#263238",
    fontSize: 12,
    // marginBottom: 5,
  },
  input: {
    color: "#091540",
    fontSize: 12,
    marginBottom: 12,
  },
  select: {
    color: "#091540",
    fontSize: 12,
    padding: 10,
  },
  switchLabel: {
    width: "100%",
    // justifyContent: "space-between",
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
    marginTop: 10,
  },
  googleConnect: {
    fontSize: 13,
    margin: "0 8px 16px 0",
    backgroundColor: "#d1241c",
    color: "#ffffff",
    textTransform: "none",
    borderRadius: 3,
  },
  dateTimeFields: {
    display: "flex",
    justifyContent: "space-between",
    "& > div": {
      width: "48%",
    },
  },
}));

const CalendarTaskSidebar = ({
  activeTaskId,
  workflowTasks,
  workflowCanvas,
  allVariables,
  dispatch,
}) => {
  const activeTask = workflowTasks[activeTaskId];
  const variables = getTaskVariables(activeTaskId, allVariables);

  const classes = useStyles();
  const [windowDimensions, setWindowDimensions] = useState({});
  const [showSection, setShowSection] = useState({
    settings: true,
    action: false,
  });
  const [taskUpdated, setTaskUpdated] = useState(false);
  const [settingsComplete, setSettingsComplete] = useState(false);
  const [actionComplete, setActionComplete] = useState(false);
  const [fetchConnectionsLoading, setFetchConnectionsLoading] = useState(false);
  const [fetchCalendarsLoading, setFetchCalendarsLoading] = useState(false);
  const [googleConnections, setGoogleConnections] = useState([]);
  const [calendarList, setCalendarList] = useState([]);
  const [loadUCOptions, setLoadUCOptions] = useState({});
  const [nodeIsConnectedToAny, setNodeIsConnectedToAny] = useState(false);
  const [nodeIsConnectedToStart, setNodeIsConnectedToStart] = useState(false);
  const [fieldsKey, setFieldsKey] = useState("-");

  useEffect(() => {
    setFieldsKey(v4());
  }, [activeTaskId]);

  useEffect(() => {
    setFetchConnectionsLoading(true);
    fetchGoogleConnections();
  }, []);

  useEffect(() => {
    if (!!activeTask?.properties?.googleapi && !!googleConnections.length) {
      setFetchCalendarsLoading(true);
      const email = googleConnections.find(
        (c) => c.apiId === activeTask?.properties?.googleapi
      ).email;

      // _setTaskInfo(id, "googleapi");
      setLoadUCOptions({
        param: {
          email,
        },
      });
    }
  }, [activeTask?.properties?.googleapi, googleConnections]);

  /* useEffect(() => {

    if(!subscribeStartEndTime) {
      const startTime = activeTask?.properties?.startTime;
      const endTime = activeTask?.properties?.endTime;
      const startEndTime = {};

      console.log(`startTime >> ${startTime} >>> endTime >> ${endTime}`);

      if(!!startTime) {
        startEndTime.startDate = startTime.split('T')[0];
        startEndTime.startTime = startTime.split('T')[1].split('+')[0];
      }
      if(!!endTime) {
        startEndTime.endDate = endTime.split('T')[0];
        startEndTime.endTime = endTime.split('T')[1].split('+')[0];
      }

      setStartEndTimeDate(startEndTime);
      setSubscribeStartEndTime(true);
    }

  }, [ activeTask?.properties?.startTime, activeTask?.properties?.endTime ]);

  useEffect(() => {
    let sd = startEndTimeDate?.startDate;
    let st = startEndTimeDate?.startTime;

    console.log(`>> ${sd}`)
    console.log(`>> ${st}`)
    sd = moment(sd).format('YYYY-MM-DD');
    st = moment(st, "HH:mm").format('HH:mm:ss');
    if(sd !== "Invalid date" && st !== "Invalid date") {
      const toSave = `${sd}T${st}+00:00`;
      if(
        !!activeTask?.properties?.endTime && 
        (moment(activeTask?.properties?.endTime) !== "Invalid date") &&
        (moment(toSave) > moment(activeTask?.properties?.endTime))
      ) console.log("Start time must be before end time");
      else _setTaskInfo(toSave, "startTime");
    }
  }, [ startEndTimeDate.startDate, startEndTimeDate.startTime ]);

  useEffect(() => {
    let ed = startEndTimeDate?.endDate;
    let et = startEndTimeDate?.endTime;

    ed = moment(ed).format('YYYY-MM-DD');
    et = moment(et, "HH:mm").format('HH:mm:ss');
    if(ed !== "Invalid date" && et !== "Invalid date") {
      const toSave = `${ed}T${et}+00:00`;
      if(
        !!activeTask?.properties?.startTime && 
        (moment(activeTask?.properties?.startTime) !== "Invalid date") &&
        (moment(toSave) < moment(activeTask?.properties?.startTime))
      ) console.log("End time must be after start time");
      else _setTaskInfo(toSave, "endTime");
    }
  }, [ startEndTimeDate.endDate, startEndTimeDate.endTime ]); */

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
    // dispatch(
    globalSetTaskInfo(dispatch, e, ppty, isGrouped, activeTask, setTaskUpdated);
  };

  const checkSetupStatus = (info, auto) => {
    // auto && _toggleSection(null, 'action');
    let sC, aC;

    const approvalActionsOK = () => {
      const acts = [...(activeTask?.properties?.approvalActions || [])];
      return acts.findIndex((x) => !x?.label) === -1;
    };

    if (!!info?.name && approvalActionsOK()) {
      sC = true;
      setSettingsComplete(true);
    } else {
      sC = false;
      setSettingsComplete(false);
    }

    if (
      !!info?.properties?.googleapi &&
      !!info?.properties?.calendarId &&
      !!info?.properties?.summary &&
      !!info?.properties?.attendees &&
      !!info?.properties?.location &&
      !!info?.properties?.startTime &&
      !!info?.properties?.endTime
    ) {
      aC = true;
      setActionComplete(true);
    } else {
      aC = false;
      setActionComplete(false);
    }

    return sC && aC;
  };

  /* const onGoogleConnetionsSuccess = ({ data }) => {
    console.log('onGoogleConnetionsSuccess >> ', JSON.stringify(data));

    const gcons = data.data.filter(d => d.type === "Calendar").map((d, i) => {
      return {
        id: d.userInfo?.id,
        email: d.userInfo?.email,
        apiId: d._id,
      }
    })

    console.log('gcons >> ', JSON.stringify(gcons));
    setGoogleConnections(gcons);
    setFetchConnectionsLoading(false);
  }; */

  const { mutate: fetchGoogleConnections } = useCustomMutation({
    apiFunc: getGoogleUserIntegrationsAPI,
    onSuccess: ({ data }) => {
      console.log("onGoogleConnetionsSuccess >> ", JSON.stringify(data));

      const gcons = data.data
        .filter((d) => d.type === "Calendar")
        .map((d, i) => {
          return {
            id: d.userInfo?.id,
            email: d.userInfo?.email,
            apiId: d._id,
          };
        });

      console.log("gcons >> ", JSON.stringify(gcons));
      setGoogleConnections(gcons);
      setFetchConnectionsLoading(false);
    },
    retries: 0,
  });

  /* const onGoogleConnectSuccess = ({ data }) => {
    const url = data?.data?.url;

    console.log('onGoogleConnetSuccess >> ', JSON.stringify(url));
    window.location.href = url;
  }; */

  const { mutate: handleGoogleConnect } = useCustomMutation({
    apiFunc: requestUrlForGoogleAPI,
    onSuccess: ({ data }) => {
      const url = data?.data?.url;

      console.log("onGoogleConnetSuccess >> ", JSON.stringify(url));
      window.location.href = url;
    },
    retries: 0,
  });

  /* const onGoogleCalendarsSuccess = ({ data }) => {

    // window.location.href = url;
    const cList = data?.data.map(r => {
      return { id: r.id, summary: r.summary, role: r.accessRole, tz: r.timeZone };
    }) || [];
    setCalendarList(cList);

  }; */

  // const { mutate: fetchGoogleCalendars } = useCustomQuery({
  const { isUCLoading, isUCFetching } = useCustomQuery({
    queryKey: ["userGoogleCalendars", loadUCOptions],
    apiFunc: getUserCalendarAPI,
    onSuccess: ({ data }) => {
      // window.location.href = url;
      const cList =
        data?.data.map((r) => {
          return {
            id: r.id,
            summary: r.summary,
            role: r.accessRole,
            tz: r.timeZone,
          };
        }) || [];
      // alert(JSON.stringify(cList))
      setCalendarList(cList);
      setFetchCalendarsLoading(false);
    },
  });

  const _handleGoogleConnect = () => {
    const redirectUrl = {
      // "redirectUrl": "https://plug-dev.netlify.app/editor/workflow"
      redirectUrl: `${process.env.REACT_APP_BASE_URL}/editor/workflows`,
    };
    handleGoogleConnect(redirectUrl);
  };

  const _preSetTaskInfo = (e, ppty) => {
    switch (ppty) {
      case "googleapi":
        if (e.target.value === "add") {
          _handleGoogleConnect();
        } else {
          // const { id, email } = googleConnections.find(c => c.apiId === e.target.value);

          _setTaskInfo(e.target.value, "googleapi");
          /* setLoadUCOptions({
            param: {
              email,
            },
          }) */
        }
        break;

      case "calendarId":
        // console.log(`+++++++++++ >> ${JSON.stringify(calendarList)} >> ${activeTask?.properties?.calendarId} >> ${e.target.value}`)
        const tz = calendarList.find((c) => c.id === e.target.value).tz;
        // alert(`${activeTask?.properties?.calendarId} >> ${tz}`);
        !!tz && _setTaskInfo(tz, "timeZone");
        _setTaskInfo(e, ppty);
        break;

      default:
        break;
    }
  };

  const _getDateTime = (val, type) => {
    if (!val) return;

    switch (type) {
      case "date":
        const dt = val.split("T")[0];
        return moment(dt, "YYYY-MM-DD").format("dd/mm/YYYY").toString();

      case "time":
        const tm_ = val.split("T")[1];
        const tm = tm_.split("+")[0];
        return moment(tm, "hh:mm:ss").format("hh:mm a").toString();

      default:
        break;
    }
  };

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
        <div className={classes.section}>
          <NameDescription
            activeTask={activeTask}
            _setTaskInfo={_setTaskInfo}
            nodeIsConnectedToAny={nodeIsConnectedToAny}
            nodeIsConnectedToStart={nodeIsConnectedToStart}
          />
        </div>
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
          {/* <Button
            className={classes.googleConnect}
            onClick={_handleGoogleConnect}
            size="small"
            variant="contained"
            fullWidth
          >
            Connect to Google Account*
          </Button> */}
          <div className={classes.sectionEntry}>
            <Typography gutterBottom className={classes.sectionTitle}>
              Select Google account*
            </Typography>
            <Select
              variant="outlined"
              size="small"
              fullWidth
              placeholder="Select form screen"
              classes={{
                root: classes.select,
              }}
              value={
                !!googleConnections.length
                  ? activeTask?.properties?.googleapi || "choose"
                  : "choose"
              }
              onChange={(e) => _preSetTaskInfo(e, "googleapi")}
            >
              <MenuItem value="choose" disabled>
                {fetchConnectionsLoading
                  ? "please wait..."
                  : !!googleConnections.length
                  ? "Select Account"
                  : "No connections added"}
              </MenuItem>
              <MenuItem value="add">Add new Google account</MenuItem>
              {googleConnections.map((cl, indx) => (
                <MenuItem value={cl.apiId} key={indx}>
                  {cl.email}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className={classes.sectionEntry}>
            <Typography gutterBottom className={classes.sectionTitle}>
              Select calendar*
            </Typography>
            <Select
              disabled={!calendarList.length}
              variant="outlined"
              size="small"
              fullWidth
              placeholder="Select form screen"
              classes={{
                root: classes.select,
              }}
              value={
                !!calendarList.length
                  ? activeTask?.properties?.calendarId || "choose"
                  : "choose"
              }
              onChange={(e) => _preSetTaskInfo(e, "calendarId")}
            >
              <MenuItem value="choose" disabled>
                {fetchCalendarsLoading
                  ? "please wait..."
                  : !!calendarList.length
                  ? "Select one"
                  : "[ First select Google account ]"}
              </MenuItem>
              {calendarList.map((cl, indx) => (
                <MenuItem value={cl.id} key={indx}>
                  {cl.summary}
                </MenuItem>
              ))}
            </Select>
          </div>
          <Typography gutterBottom className={classes.sectionTitle}>
            Event summary*
          </Typography>
          <TextField
            key={`${fieldsKey}-1`}
            variant="outlined"
            size="small"
            disabled={!activeTask?.properties?.calendarId}
            fullWidth
            placeholder="Enter summary"
            InputProps={{
              className: classes.input,
            }}
            defaultValue={activeTask?.properties?.summary || ""}
            onChange={(e) => _setTaskInfo(e, "summary")}
            onBlur={_setTaskInfo}
          />
          <div className={classes.sectionEntry}>
            <Typography gutterBottom className={classes.sectionTitle}>
              Attendees*
            </Typography>
            <SelectOnSteroids
              disabled={!activeTask?.properties?.calendarId}
              source="email"
              variables={variables}
              onChange={(v) => _setTaskInfo(v, "attendees")}
              value={activeTask?.properties?.attendees}
              type="email"
            />
          </div>
          <div className={classes.sectionEntry}>
            <Typography gutterBottom className={classes.sectionTitle}>
              Location*
            </Typography>
            <SelectOnSteroids
              disabled={!activeTask?.properties?.calendarId}
              source="variable"
              variables={variables}
              onChange={(v) => _setTaskInfo(v, "location")}
              value={activeTask?.properties?.location}
              variablesAndCustomOnly
              type="text"
              multiple={false}
            />
          </div>
          {/* <TextField
            variant="outlined"
            size="small"
            disabled={!activeTask?.properties?.calendarId}
            fullWidth
            placeholder="Enter Location"
            InputProps={{
              className: classes.input,
            }}
            value={ activeTask?.properties?.location || ''}
            onChange={e => _setTaskInfo(e, "location")}
            onBlur={_setTaskInfo}
          /> */}

          <div className={classes.sectionEntry}>
            <Typography gutterBottom className={classes.sectionTitle}>
              Start date/time*
            </Typography>
            <Select
              disabled={!activeTask?.properties?.calendarId}
              variant="outlined"
              size="small"
              fullWidth
              classes={{
                root: classes.select,
                outlined: classes.selected,
                disabled: classes.disabled,
              }}
              value={activeTask?.properties?.startTime || "choose"}
              onChange={(e) => _setTaskInfo(e, "startTime")}
            >
              <MenuItem value="custom" key="key-col-0" selected disabled>
                <em>Select</em>
              </MenuItem>
              {VariablesMenuItems({
                variables,
                classes,
                workflowTasks,
                type: "datetime",
              })}
            </Select>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            {/* <div className={classes.sectionEntry} style={{ flex: 1 }}>
              <Typography gutterBottom className={classes.sectionTitle}>
                End Date/Time*
              </Typography>

              <Select
                disabled={!activeTask?.properties?.calendarId}
                variant="outlined"
                size="small"
                fullWidth
                classes={{
                  root: classes.select,
                  outlined: classes.selected,
                  disabled: classes.disabled,
                }}
                value={ activeTask?.properties?.endTime || "choose" }
                onChange={(e) => _setTaskInfo(e, "endTime")}
              >
                <MenuItem value="custom" key="key-col-0" selected disabled>
                    End Date/Time*
                </MenuItem>
                <MenuItem value="custom" key="key-col-0" selected disabled>
                    Duration*
                </MenuItem>
               
              </Select>
            </div> */}

            <div className={classes.sectionEntry} style={{ flex: 1 }}>
              <Typography gutterBottom className={classes.sectionTitle}>
                End date/time*
              </Typography>

              <Select
                disabled={!activeTask?.properties?.calendarId}
                variant="outlined"
                size="small"
                fullWidth
                classes={{
                  root: classes.select,
                  outlined: classes.selected,
                  disabled: classes.disabled,
                }}
                value={activeTask?.properties?.endTime || "choose"}
                onChange={(e) => _setTaskInfo(e, "endTime")}
              >
                <MenuItem value="custom" key="key-col-0" selected disabled>
                  <em>Select</em>
                </MenuItem>
                {/* <MenuItem value="choose" key="key-col-0">
                    <em>Enter manual date/time</em>
                </MenuItem> */}
                {VariablesMenuItems({
                  variables,
                  classes,
                  workflowTasks,
                  type: "datetime",
                })}
              </Select>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              margin: "10px 0",
            }}
          >
            <FormControlLabel
              classes={{
                root: classes.switchLabel,
                label: classes.sectionTitle1,
              }}
              control={
                <Switch
                  key={!!activeTask?.properties?.addMeetingLink || false}
                  defaultChecked={
                    !!activeTask?.properties?.addMeetingLink || false
                  }
                  onChange={(e) =>
                    _setTaskInfo(!!e.target.checked, "addMeetingLink")
                  }
                  name="checkedB"
                  color="primary"
                  size="small"
                />
              }
              label="Add Google Meet link"
              labelPlacement="end"
            />
          </div>
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
    taskPos: state.workflows.pos,
  };
})(CalendarTaskSidebar);
