import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import {
  Typography,
  Drawer,
  Collapse,
  Divider,
  Box,
  Switch,
  FormControlLabel,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import moment from "moment";
import DatePicker from "react-datepicker";

import DashboardDataConfiguration from "./DashboardDataConfiguration";
import { scheduleDashboardTaskAPI } from "../../../utils/dashboardsAPIs";
import { errorToastify } from "../../../../common/utils/Toastify";
import ColorPicker from "../../../../common/components/ColorPicker";

const useStyles = makeStyles((theme) => ({
  sideHeading: {
    color: "#091540",
    // fontWeight: 600,
    fontSize: 12,
    paddingLeft: 10,
    paddingTop: 10,
    // textTransform: "capitalize",
    display: "inline-flex",
    alignItems: "center",
  },
  section: {
    padding: 10,
    paddingBottom: 20,
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
    marginBottom: 12,
  },
  select: {
    color: "#091540",
    fontSize: 12,
    padding: 10,
  },
  sideHeadingBar: {
    backgroundColor: "#f8f8f8",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    height: 32,
    "&:hover": {
      opacity: 0.7,
    },
  },
  timeSection: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rightSpacing: {
    marginRight: 10,
  },
  dropDownBox: {
    width: "85%",
    display: "flex",
    justifyContent: "space-between",
  },
  dropDownLabel: {
    color: "#999",
    fontSize: 11,
    marginBottom: 5,
  },
  widthDropDown: {
    width: "48%",
  },
  frequencyBox: {
    marginBottom: 30,
  },
  sectionEntry: {
    marginBottom: 13,
  },
  switchLabel: {
    width: "100%",
    justifyContent: "space-between",
    margin: 0,
  },
  activateSwitch: {
    width: "30%",
    justifyContent: "space-between",
    margin: 0,
  },
  selected: {
    "& span": {
      display: "none",
    },
  },
  topView: {
    display: "flex",
    alignItems: "center",
  },
}));

const timezoneOffset = new Date().getTimezoneOffset();

const DashboardEditorSidebar = ({
  info,
  isInfo,
  setIsInfo,
  data,
  updateData,
  resetDataConfig,
  selectedSectionKey,
  setSelectedSectionKey,
  updateDashboard,
}) => {
  const classes = useStyles(makeStyles);

  const [activeSchedule, setActiveSchedule] = useState(false);
  const [showSection, setShowSection] = useState({
    config: true,
    type: false,
    data: false,
    appearance: false,
  });
  const [scheduleDMail, setScheduleDMail] = useState({
    emailSubject: "",
    emailTarget: "",
    emailCC: [],
    reportId: info?.id,
    emailBody: "",
    oneOffDate: null,
    oneOffTime: null,
    recurring: false,
    frequencyCount: null,
    frequencyMeasure: "",
    timezoneOffset,
  });
  const {
    emailSubject,
    emailTarget,
    emailCC,
    emailBody,
    oneOffDate,
    oneOffTime,
    recurring,
    frequencyCount,
    frequencyMeasure,
    reportId,
  } = scheduleDMail;

  const {
    name: infoName,
    description: infoDescription,
    createdAt: infoCreatedAt,
    updatedAt: infoUpdatedAt,
    includeInfoInPdf: infoIncludeInfoInPdf,
    useTemplate: infoUseTemplate,
    template: infoTemplate,
  } = info || {};

  const _toggleSection = (e, sect) => {
    e && e.stopPropagation();

    const makeTrue = !showSection[sect];
    const showSection_ = { ...showSection };
    Object.keys(showSection_).forEach((p) => (showSection_[p] = false));
    if (makeTrue) showSection_[sect] = true;
    setShowSection(showSection_);
  };
  useEffect(() => {
    if (info) {
      if (Object.keys(info).length) {
        setScheduleDMail({
          ...scheduleDMail,
          reportId: info?.id,
        });
      }
    }
  }, [info]);

  useEffect(() => {
    if (info) {
      if (Object.keys(info).length) {
        if (info?.properties?.schedule) {
          const { schedule } = info?.properties;
          const newDate = moment();
          const oneOffDateVal = moment(schedule?.oneOffDate, "D/M/YYYY").format(
            "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ (z)"
          );
          const oneOffTimeVal = moment(
            newDate.format("YYYY-MM-DD") + " " + schedule?.oneOffTime,
            "YYYY-MM-DD HH:mm:ss"
          );

          const { oneOffDate, ...rest } = schedule;
          const newScheduleProps = { ...rest };
          if (schedule?.oneOffDate)
            newScheduleProps.oneOffDateVal = oneOffDateVal;

          setScheduleDMail((prev) => ({
            ...prev,
            //...newScheduleProps,
            ...schedule,
            emailCC: schedule?.emailCC?.join(", ") || "",
            oneOffDate: schedule?.oneOffDate && new Date(oneOffDateVal),
            oneOffTime: schedule?.oneOffDate && oneOffTimeVal?._d,
          }));
          setActiveSchedule(schedule?.active);
        }
      }
    }
  }, [info]);

  const extractEmails = (inputString) => {
    const emailRegex = /[\w.-]+@[\w-]+\.[\w.-]+/g;
    const emails = inputString?.match(emailRegex);
    return emails || [];
  };

  const filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };
  const handleActiveSchedule = async (event) => {
    const { name, checked } = event?.target;

    if (
      emailSubject &&
      emailTarget &&
      //emailCC?.length &&
      emailBody &&
      oneOffDate &&
      oneOffTime &&
      reportId
    ) {
      const result = await scheduleDashboardTaskAPI({
        [name]: checked,
        reportId,
      });
      updateDashboard(info?.id, {
        [`properties.schedule.active`]: checked,
      });
      setActiveSchedule(!activeSchedule);

      if (result.isAxiosError) {
        errorToastify("An error occured somewhere...");
        setTimeout(() => {
          setActiveSchedule(false);
          updateDashboard(info?.id, {
            [`properties.schedule.active`]: checked,
          });
        }, 1500);
      }
    } else {
      errorToastify(
        "Subject, email, description, and time fields are required."
      );
    }
  };

  const handleDashboardUpdate = (evt) => {
    updateDashboard(info?.id, { [evt.target.name]: evt.target.value });
  };

  const handleScheduleDMail = (event) => {
    if (event?.name === "oneOffDate" || event?.name === "oneOffTime") {
      const { name, date } = event;

      const parseDate = new Date(Date.parse(date));
      const oneOffDate = moment(parseDate).format("DD-MM-YYYY");
      const oneOffTime = moment(parseDate).format("HH:mm:ss [GMT]ZZ");

      setScheduleDMail({
        ...scheduleDMail,
        [name]: new Date(parseDate),
      });
      updateDashboard(info?.id, {
        [`properties.schedule.${name}`]:
          name === "oneOffDate" ? oneOffDate : oneOffTime,
      });
    } else {
      const { name, value, checked } = event?.target;

      if (name !== "emailCC" && name !== "recurring") {
        if (name === "active") {
          setActiveSchedule(!activeSchedule);
        }
        setScheduleDMail({
          ...scheduleDMail,
          [name]: value || checked,
        });
        //scheduleDashboardTaskAPI({ [name]: value, reportId });
        updateDashboard(info?.id, {
          [`properties.schedule.${name}`]: value || checked,
        });
      }
      if (name === "emailCC") {
        const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
        setScheduleDMail({
          ...scheduleDMail,
          [name]: [value],
        });
        if (hasEmail.test(value) || value === "") {
          updateDashboard(info?.id, {
            [`properties.schedule.${name}`]: extractEmails(value),
          });
        }
      }
      if (name === "recurring") {
        setScheduleDMail({
          ...scheduleDMail,
          [name]: checked,
        });
        //scheduleDashboardTaskAPI({ [name]: checked, reportId });
        updateDashboard(info?.id, {
          [`properties.schedule.${name}`]: checked,
        });
      }
    }

    const SCHEDULE_ATTRIBUTE = [
      "recurring",
      "emailTarget",
      "emailCC",
      "emailSubject",
      "emailBody",
      "oneOffDate",
      "oneOffTime",
      "frequencyCount",
      "frequencyMeasure",
    ];

    if (SCHEDULE_ATTRIBUTE.includes(event?.target?.name || event?.name)) {
      setActiveSchedule(false);
    }
  };

  return (
    <React.Fragment key="right">
      {/* <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button> */}
      <Drawer
        anchor={"right"}
        open={!!selectedSectionKey || isInfo}
        onClose={() => {
          setSelectedSectionKey(null);
          setIsInfo(false);
        }}
      >
        <div
          style={{
            width: 350,
            // padding: 20,
            height: "100%",
          }}
        >
          {isInfo ? (
            <form className={classes.form}>
              <div
                className={classes.sideHeadingBar}
                onClick={(e) => _toggleSection(e, "config")}
              >
                <Typography gutterBottom className={classes.sideHeading}>
                  Dashboard information
                </Typography>
              </div>
              <Collapse in={true}>
                <Divider style={{ marginBottom: 10 }} />
                <div className={classes.section}>
                  <Typography gutterBottom className={classes.sectionTitle}>
                    Name*
                  </Typography>
                  <TextField
                    name="name"
                    variant="outlined"
                    size="small"
                    fullWidth
                    placeholder="Enter title"
                    InputProps={{
                      className: classes.input,
                    }}
                    // value={infoName || ""}
                    onChange={handleDashboardUpdate}
                    defaultValue={infoName || ""}
                    // onBlur={_setTaskInfo}
                  />
                  <div>
                    <Typography gutterBottom className={classes.sectionTitle}>
                      Description
                    </Typography>
                    <TextField
                      name="description"
                      variant="outlined"
                      size="small"
                      minRows={4}
                      fullWidth
                      placeholder="Enter description"
                      InputProps={{
                        className: classes.input,
                      }}
                      // value={infoDescription || ""}
                      onChange={handleDashboardUpdate}
                      defaultValue={infoDescription || ""}
                      // onBlur={_setTaskInfo}
                    />
                  </div>
                  <div className={classes.sectionEntry}>
                    <Typography gutterBottom className={classes.sectionTitle}>
                      Display dashboard info for PDF download
                    </Typography>
                    <Select
                      name="timeUnit"
                      variant="outlined"
                      size="small"
                      fullWidth
                      placeholder="Select time unit"
                      classes={{
                        root: classes.select,
                        outlined: classes.selected,
                      }}
                      value={"true" || ""}
                      onChange={updateData}
                    >
                      <MenuItem value="true">True</MenuItem>
                      <MenuItem value="false">False</MenuItem>
                    </Select>
                  </div>
                  <div>
                    <Typography gutterBottom className={classes.sectionTitle}>
                      Last updated
                    </Typography>
                    <TextField
                      name="description"
                      variant="outlined"
                      size="small"
                      minRows={4}
                      fullWidth
                      placeholder="Enter title"
                      InputProps={{
                        className: classes.input,
                      }}
                      value={
                        moment(infoUpdatedAt).format("YYYY-MMM-DD hh:mm A") ||
                        ""
                      }
                      onChange={updateData}
                      disabled
                      // onBlur={_setTaskInfo}
                    />
                  </div>
                  <div>
                    <Typography gutterBottom className={classes.sectionTitle}>
                      Date created
                    </Typography>
                    <TextField
                      name="description"
                      variant="outlined"
                      size="small"
                      minRows={4}
                      fullWidth
                      placeholder="Enter title"
                      InputProps={{
                        className: classes.input,
                      }}
                      value={
                        moment(infoCreatedAt).format("YYYY-MMM-DD hh:mm A") ||
                        ""
                      }
                      onChange={updateData}
                      disabled
                      // onBlur={_setTaskInfo}
                    />
                  </div>
                </div>
              </Collapse>
              <div
                className={classes.sideHeadingBar}
                onClick={(e) => _toggleSection(e, "config")}
              >
                <Typography gutterBottom className={classes.sideHeading}>
                  Send dashboard via e-mail
                </Typography>
              </div>
              <Collapse in={true}>
                <Divider style={{ marginBottom: 10 }} />
                <div className={classes.section}>
                  <Typography gutterBottom className={classes.sectionTitle}>
                    Subject*
                  </Typography>
                  <TextField
                    name="emailSubject"
                    variant="outlined"
                    size="small"
                    fullWidth
                    placeholder="Add subject"
                    InputProps={{
                      className: classes.input,
                    }}
                    onChange={handleScheduleDMail}
                    defaultValue={emailSubject}
                    // onBlur={_setTaskInfo}
                    // value={infoName || ""}
                  />
                  <div>
                    <Typography gutterBottom className={classes.sectionTitle}>
                      Recipient email address
                    </Typography>
                    <TextField
                      name="emailTarget"
                      variant="outlined"
                      size="small"
                      minRows={4}
                      fullWidth
                      placeholder="Enter email"
                      InputProps={{
                        className: classes.input,
                      }}
                      onChange={handleScheduleDMail}
                      defaultValue={emailTarget}
                      // onBlur={_setTaskInfo}
                      // value={infoDescription || ""}
                    />
                  </div>
                  <div>
                    <Typography gutterBottom className={classes.sectionTitle}>
                      Cc
                    </Typography>
                    <TextField
                      name="emailCC"
                      variant="outlined"
                      size="small"
                      minRows={4}
                      fullWidth
                      placeholder="Enter email"
                      InputProps={{
                        className: classes.input,
                      }}
                      onChange={handleScheduleDMail}
                      defaultValue={emailCC}
                      // onBlur={_setTaskInfo}
                      // value={infoDescription || ""}
                    />
                  </div>
                  <div>
                    <Typography gutterBottom className={classes.sectionTitle}>
                      Description
                    </Typography>
                    <TextField
                      name="emailBody"
                      variant="outlined"
                      size="small"
                      //minRows={4}
                      multiline
                      fullWidth
                      placeholder="Enter details..."
                      InputProps={{
                        className: classes.input,
                      }}
                      onChange={handleScheduleDMail}
                      defaultValue={emailBody}
                      // onBlur={_setTaskInfo}
                      // value={infoDescription || ""}
                    />
                  </div>
                  <div className={classes.sectionEntry}>
                    <div>
                      <Typography gutterBottom className={classes.sectionTitle}>
                        Time
                      </Typography>
                    </div>
                    <Box className={classes.timeSection}>
                      <Typography
                        gutterBottom
                        className={[
                          classes.dropDownLabel,
                          classes.rightSpacing,
                        ]}
                      >
                        Choose
                      </Typography>
                      <div className={classes.dropDownBox}>
                        <DatePicker
                          //closeOnScroll={true}
                          className={"dateTimeInput"}
                          wrapperClassName={"date-timePicker2"}
                          selected={oneOffDate}
                          name={"oneOffDate"}
                          onChange={(date) =>
                            handleScheduleDMail({ date, name: "oneOffDate" })
                          }
                          placeholderText="dd/mm/yyyy"
                          showYearDropdown
                          minDate={new Date()}
                          //scrollableYearDropdown
                          showPopperArrow={false}
                          dropdownMode="scroll"
                          popperClassName={"dateTimePopper2"}
                          dateFormat={["d/M/yyyy", "ddMMyyyy", "dd-MM-yyyy"]}
                        />
                        <DatePicker
                          selected={oneOffTime}
                          name={"oneOffTime"}
                          className={"dateTimeInput"}
                          wrapperClassName={"date-timePicker2"}
                          onChange={(date) =>
                            handleScheduleDMail({ date, name: "oneOffTime" })
                          }
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={5}
                          minDate={new Date()}
                          showPopperArrow={false}
                          timeCaption="Time"
                          popperClassName={"dateTimePopper2"}
                          dateFormat="h:mm aa"
                          filterTime={filterPassedTime}
                          placeholderText="--:-- --"
                        />
                      </div>
                    </Box>
                  </div>
                  <div className={classes.frequencyBox}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        margin: "10px 0px 5px",
                      }}
                    >
                      <FormControlLabel
                        classes={{
                          root: classes.switchLabel,
                          label: classes.sectionTitle,
                        }}
                        control={
                          <Switch
                            checked={!!recurring}
                            onChange={handleScheduleDMail}
                            name="recurring"
                            color="primary"
                            size="small"
                          />
                        }
                        label="Recurring mail"
                        labelPlacement="start"
                      />
                    </div>
                    {!!recurring && (
                      <Box className={classes.timeSection}>
                        <Typography
                          gutterBottom
                          className={[
                            classes.dropDownLabel,
                            classes.rightSpacing,
                          ]}
                        >
                          Every
                        </Typography>
                        <div className={classes.dropDownBox}>
                          <Select
                            name="frequencyCount"
                            variant="outlined"
                            size="small"
                            //fullWidth
                            placeholder="Enter email"
                            className={classes.widthDropDown}
                            classes={{
                              root: classes.select,
                              outlined: classes.selected,
                            }}
                            defaultValue={frequencyCount}
                            onChange={handleScheduleDMail}
                          >
                            <MenuItem value="1">1</MenuItem>
                            <MenuItem value="2">2</MenuItem>
                            <MenuItem value="3">3</MenuItem>
                            <MenuItem value="4">4</MenuItem>
                          </Select>
                          <Select
                            name="frequencyMeasure"
                            variant="outlined"
                            size="small"
                            //fullWidth
                            placeholder="Choose frequency"
                            className={classes.widthDropDown}
                            classes={{
                              root: classes.select,
                              outlined: classes.selected,
                            }}
                            defaultValue={frequencyMeasure}
                            onChange={handleScheduleDMail}
                          >
                            <MenuItem value="days">Days</MenuItem>
                            <MenuItem value="weeks">Weeks</MenuItem>
                            <MenuItem value="months">Months</MenuItem>
                            <MenuItem value="years">Years</MenuItem>
                          </Select>
                        </div>
                      </Box>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      margin: "10px 0px 120px 5px",
                    }}
                  >
                    <FormControlLabel
                      classes={{
                        root: classes.activateSwitch,
                        label: classes.sectionTitle,
                      }}
                      control={
                        <Switch
                          checked={!!activeSchedule}
                          // onChange={handleActiveSchedule}
                          onChange={handleScheduleDMail}
                          name="active"
                          color="primary"
                          size="small"
                          disabled={false}
                          // disabled={
                          //   !emailSubject ||
                          //   !emailTarget ||
                          //   //emailCC?.!length ||
                          //   !emailBody ||
                          //   !oneOffDate ||
                          //   !oneOffTime ||
                          //   !reportId
                          // }
                        />
                      }
                      label="Activate"
                      labelPlacement="start"
                    />
                  </div>
                </div>
              </Collapse>
            </form>
          ) : (
            <>
              <div
                className={classes.sideHeadingBar}
                onClick={(e) => _toggleSection(e, "config")}
              >
                <Typography gutterBottom className={classes.sideHeading}>
                  <span
                    style={{
                      textTransform: "capitalize",
                      display: "contents",
                    }}
                  >
                    {`${data?.sectionType} `}
                  </span>
                  properties
                </Typography>
                {/* <Tooltip title="Close"><CancelIcon className={classes.closeIcon} onClick={cancelNewTask} /></Tooltip> */}
              </div>
              <Collapse in={!!showSection.config}>
                <Divider style={{ marginBottom: 10 }} />
                <div className={classes.section}>
                  <Typography gutterBottom className={classes.sectionTitle}>
                    Title*
                  </Typography>
                  <TextField
                    name="title"
                    variant="outlined"
                    size="small"
                    fullWidth
                    placeholder="Enter title"
                    InputProps={{
                      className: classes.input,
                    }}
                    value={data?.title || ""}
                    onChange={updateData}
                    // onBlur={_setTaskInfo}
                  />
                  {["chart"].includes(data?.sectionType) && (
                    <div className={classes.sectionEntry}>
                      <Typography gutterBottom className={classes.sectionTitle}>
                        Chart type*
                      </Typography>
                      <Select
                        name="chartType"
                        variant="outlined"
                        size="small"
                        fullWidth
                        placeholder="Select chart type"
                        classes={{
                          root: classes.select,
                          outlined: classes.selected,
                        }}
                        value={data?.chartType || ""}
                        onChange={updateData}
                      >
                        <MenuItem value="choose" selected disabled>
                          <em>Choose type</em>
                        </MenuItem>
                        <MenuItem value="barchart">Bar Chart</MenuItem>
                        <MenuItem value="piechart">Pie Chart</MenuItem>
                        <MenuItem value="linegraph">Line Graph</MenuItem>
                        <MenuItem value="bandguage">Band Gauge</MenuItem>
                        <MenuItem value="solidguage">Solid Gauge</MenuItem>
                        <MenuItem value="donutchart">Donut Chart</MenuItem>
                        <MenuItem value="multiplelinegraph">
                          Multiple Line
                        </MenuItem>
                        <MenuItem value="clusteredbarchart">
                          Clustered Bar Chart
                        </MenuItem>
                        <MenuItem value="clusteredcolumnchart">
                          Clustered Bar Chart (horizontal)
                        </MenuItem>
                      </Select>
                    </div>
                  )}
                  {["chart"].includes(data?.sectionType) &&
                    ["linegraph", "multiplelinegraph"]?.includes(
                      data?.chartType
                    ) && (
                      <div className={classes.sectionEntry}>
                        <Typography
                          gutterBottom
                          className={classes.sectionTitle}
                        >
                          Time unit*
                        </Typography>
                        <Select
                          name="timeUnit"
                          variant="outlined"
                          size="small"
                          fullWidth
                          placeholder="Select time unit"
                          classes={{
                            root: classes.select,
                            outlined: classes.selected,
                          }}
                          value={data?.timeUnit || ""}
                          onChange={updateData}
                        >
                          <MenuItem value="choose" selected disabled>
                            <em>Choose one</em>
                          </MenuItem>
                          <MenuItem value="hour">Hours</MenuItem>
                          <MenuItem value="day">Days</MenuItem>
                          <MenuItem value="month">Months</MenuItem>
                          <MenuItem value="year">Years</MenuItem>
                        </Select>
                      </div>
                    )}
                </div>
              </Collapse>
              <div
                className={classes.sideHeadingBar}
                onClick={(e) => _toggleSection(e, "data")}
              >
                <Typography gutterBottom className={classes.sideHeading}>
                  Data configuration
                </Typography>
                {/* <Tooltip title="Close"><CancelIcon className={classes.closeIcon} onClick={cancelNewTask} /></Tooltip> */}
              </div>
              <Collapse in={!!showSection.data}>
                <Divider style={{ marginBottom: 10 }} />
                <DashboardDataConfiguration
                  updateData={updateData}
                  data={data?.dataConfig}
                  chartType={data?.chartType}
                  sectionType={data?.sectionType}
                  resetDataConfig={resetDataConfig}
                />
              </Collapse>
              {/* <div
                className={classes.sideHeadingBar}
                onClick={(e) => _toggleSection(e, "appearance")}
              >
                <Typography gutterBottom className={classes.sideHeading}>
                  Appearance
                </Typography>
              </div> */}
              {/* <Collapse in={!!showSection.appearance}>
                <Divider style={{ marginBottom: 10 }} />
                <div className={classes.section}>
                  <div
                    className={classes.sectionEntry}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 14,
                    }}
                  >
                    <div className="sidebar-section-item">
                      <Typography
                        gutterBottom
                        className="row-label"
                        style={{ width: "auto" }}
                      >
                        Title color:
                      </Typography>
                      <ColorPicker
                        color="#999999"
                        identity="backgroundColor"
                        style={{ maxWidth: 70 }}
                      />
                    </div>
                    {["card"].includes(data?.sectionType) && (
                      <div className="sidebar-section-item">
                        <Typography
                          gutterBottom
                          className="row-label"
                          style={{ width: "auto" }}
                        >
                          Data color:
                        </Typography>
                        <ColorPicker
                          color="#999999"
                          identity="backgroundColor"
                          style={{ maxWidth: 70 }}
                        />
                      </div>
                    )}
                    <div className="sidebar-section-item">
                      <Typography
                        gutterBottom
                        className="row-label"
                        style={{ width: "auto" }}
                      >
                        Bg color:
                      </Typography>
                      <ColorPicker
                        color="#999999"
                        identity="backgroundColor"
                        style={{ maxWidth: 70 }}
                      />
                    </div>
                    <div className="sidebar-section-item">
                      <Typography
                        gutterBottom
                        className="row-label"
                        style={{ width: "auto" }}
                      >
                        Border color:
                      </Typography>
                      <ColorPicker
                        color="#999999"
                        identity="backgroundColor"
                        style={{ maxWidth: 70 }}
                      />
                    </div>
                    {["chart"].includes(data?.sectionType) && (
                      <div className="sidebar-section-item">
                        <Typography
                          gutterBottom
                          className="row-label"
                          style={{ width: "auto" }}
                        >
                          Rel. width:
                        </Typography>
                        <Select
                          name="relWidth"
                          variant="outlined"
                          size="small"
                          fullWidth
                          placeholder="Select screen"
                          style={{ maxWidth: 70 }}
                          classes={{
                            root: classes.select,
                            outlined: classes.selected,
                          }}
                          value={data?.style?.relWidth || 1}
                          onChange={(e) => updateData(e, "style")}
                        >
                          <MenuItem value={1}>1</MenuItem>
                          <MenuItem value={2}>2</MenuItem>
                          <MenuItem value={3}>3</MenuItem>
                          <MenuItem value={4}>4</MenuItem>
                          <MenuItem value={5}>5</MenuItem>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>
              </Collapse> */}
            </>
          )}
        </div>
      </Drawer>
    </React.Fragment>
  );
};

export default withRouter(DashboardEditorSidebar);
