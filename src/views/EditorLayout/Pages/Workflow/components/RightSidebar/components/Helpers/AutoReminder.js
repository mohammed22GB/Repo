import {
  Box,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import ScheduleAutoReminder from "./ScheduleAutoReminder";

const AutoReminder = ({
  activeTask,
  classes,
  _setTaskInfo,
  variables,
  properties,
  from,
}) => {
  const [schedule, setSchedule] = useState("dateEscalation");
  const [durationType, setDurationType] = useState("minutes");
  const [dateDetails, setDateDetails] = useState(null);
  const [durationDetails, setDurationDetails] = useState("");
  const [dateTimeVars, setDateTimeVars] = useState([]);
  const [durationVars, setDurationVars] = useState([]);
  const [escalatedUsers, setEscalatedUsers] = useState([]);

  const handleChange = (value) => {
    setSchedule(value + "Escalation");
    // _setTaskInfo(
    //   value === "dateEscalation"
    //     ? "time"
    //     : value === "durationEscalation" && "interval",
    //   "triggerType"
    // );
  };

  useEffect(() => {
    const getDateVariables = () => {
      /* Filtering the variables array that of datetime and setting the filtered array to the state. */
      let dateTimeVariable = variables?.filter((variable) =>
        variable?.info?.dataType?.includes("datetime")
      );

      setDateTimeVars(() => dateTimeVariable);
    };
    getDateVariables();

    const getNoneDateVars = () => {
      /* Filtering the variables array that is not of datetime and setting the filtered array to the state. */
      let getNoneDateVariable = variables?.filter(
        (variable) => !variable?.info?.dataType?.includes("datetime")
      );

      setDurationVars(() => getNoneDateVariable);
    };

    getNoneDateVars();

    return () => {
      setDateTimeVars(() => []);
      setDurationVars(() => []);
    };
  }, [variables, schedule]);

  useEffect(() => {
    /**
     * If the properties?.automaticReminder?.triggerType is "time", then set the schedule to "dateEscalation". If the
     * properties?.automaticReminder?.triggerType is "interval", then set the schedule to "durationEscalation". Otherwise, set the
     * schedule to "dateEscalation".
     */
    const setDefaultTriggerType = () => {
      let triggerType =
        properties?.automaticReminder?.triggerType === "time"
          ? "dateEscalation"
          : properties?.automaticReminder?.triggerType === "interval"
          ? "durationEscalation"
          : "dateEscalation";
      setSchedule(() => triggerType);
    };
    //setDefaultTriggerType();

    return () => {
      //setSchedule(() => "");
    };
  }, [properties?.automaticReminder?.triggerType]);

  useEffect(() => {
    if (properties?.automaticReminder?.autoReminder?.timing) {
      setDateDetails(properties?.automaticReminder?.autoReminder?.timing);
    }
    if (properties?.automaticReminder?.autoReminder?.delay) {
      setDurationDetails(
        properties?.automaticReminder?.autoReminder?.delay?.value
      );
      setDurationType(properties?.automaticReminder?.autoReminder?.delay?.unit);
    }
  }, [properties?.automaticReminder?.autoReminder]);

  const _saveScheduleInfo = (inValue, property) => {
    let outValue;

    if (property === "triggerType") {
      outValue = {
        ...properties?.automaticReminder,
        autoReminder: {
          ...properties?.automaticReminder?.autoReminder,
          type: inValue,
        },
      };
    }
    if (property === "triggerIntervalMeasure") {
      outValue = {
        ...properties?.automaticReminder,
        autoReminder: {
          ...properties?.automaticReminder?.autoReminder,
          type: "interval",
          delay: {
            ...properties?.automaticReminder?.autoReminder.delay,
            unit: inValue.target.value,
          },
        },
      };
    } else if (property === "triggerIntervalCount") {
      outValue = {
        ...properties?.automaticReminder,
        autoReminder: {
          ...properties?.automaticReminder?.autoReminder,
          type: "interval",
          delay: {
            ...properties?.automaticReminder?.autoReminder.delay,
            value: inValue,
          },
        },
      };
    } else if (property === "triggerDateTime") {
      outValue = {
        ...properties?.automaticReminder,
        autoReminder: {
          ...properties?.automaticReminder?.autoReminder,
          type: "time",
          timing: inValue,
        },
      };
    } else if (property === "frequencyCount") {
      outValue = {
        ...properties?.automaticReminder,
        autoReminder: {
          ...properties?.automaticReminder?.autoReminder,
          recurring: {
            ...properties?.automaticReminder?.autoReminder?.recurring,
            frequencyCount: Number(inValue),
          },
        },
      };
    } else if (property === "frequencyMeasure") {
      outValue = {
        ...properties?.automaticReminder,
        autoReminder: {
          ...properties?.automaticReminder?.autoReminder,
          recurring: {
            ...properties?.automaticReminder?.autoReminder?.recurring,
            frequencyMeasure: inValue,
          },
        },
      };
    }
    _setTaskInfo(outValue, "autoReminder");
  };

  return (
    <div>
      <ScheduleAutoReminder
        activeTask={{
          ...activeTask,
          triggerType: properties?.automaticReminder?.autoReminder?.type,
          properties: {
            ...properties?.automaticReminder,
            triggerIntervalCount:
              properties?.automaticReminder?.autoReminder?.delay?.value,
            triggerIntervalMeasure:
              properties?.automaticReminder?.autoReminder?.delay?.unit,
            triggerDateTime: {
              value: properties?.automaticReminder?.autoReminder?.timing?.value,
            },
          },
        }}
        classes={classes}
        saveScheduleInfo={_saveScheduleInfo}
        variables={variables}
        from="screenTask"
        property="autoReminder"
        // options={["interval"]}
      />

      <div className={classes.frequencyBox}>
        {/* <div
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
                // checked={!!recurring}
                // onChange={handleScheduleDMail}
                name="recurring"
                color="primary"
                size="small"
              />
            }
            label="Recurring mail"
            labelPlacement="start"
          />
        </div> */}
        {!!true && (
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              style={{ fontWeight: "bold", fontSize: "12px", color: "#5b6994" }}

              //className={[classes.dropDownLabel, classes.rightSpacing]}
            >
              Recurring every
            </Typography>
            <div className={classes.dropDownBox}>
              {/* <Select
                name="frequencyCount"
                variant="outlined"
                size="small"
                //fullWidth
                placeholder="Enter email"
                style={{
                  height: "32px",
                  width: "4rem",
                  marginRight: "10px",
                }}
                //className={classes.widthDropDown}
                defaultValue={
                  properties?.automaticReminder?.autoReminder?.recurring
                    ?.frequencyMeasure
                }
                onChange={(e) =>
                  _saveScheduleInfo(e.target.value, "frequencyCount")
                }
              >
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="3">3</MenuItem>
                <MenuItem value="4">4</MenuItem>
              </Select> */}

              <TextField
                //key={`${fieldsKey}-1`}
                variant="outlined"
                size="small"
                type="number"
                //fullWidth
                placeholder=""
                style={{ width: "6rem", marginRight: "5px" }}
                defaultValue={
                  properties?.automaticReminder?.autoReminder?.recurring
                    ?.frequencyCount
                }
                // InputProps={{
                //   className: classes.input,
                // }}
                onChange={(e) =>
                  _saveScheduleInfo(e.target.value, "frequencyCount")
                }
              />
              <Select
                name="frequencyMeasure"
                variant="outlined"
                size="small"
                //fullWidth
                placeholder="Choose frequency"
                style={{
                  height: "32px",
                  width: "8rem",
                }}
                // className={classes.widthDropDown}
                // classes={{
                //   root: classes.select,
                //   outlined: classes.selected,
                // }}
                defaultValue={
                  properties?.automaticReminder?.autoReminder?.recurring
                    ?.frequencyMeasure
                }
                onChange={(e) =>
                  _saveScheduleInfo(e.target.value, "frequencyMeasure")
                }
              >
                <MenuItem value="minutes">Minutes</MenuItem>
                <MenuItem value="hours">Hours</MenuItem>
                <MenuItem value="days">Days</MenuItem>
                <MenuItem value="weeks">Weeks</MenuItem>
                <MenuItem value="months">Months</MenuItem>
                <MenuItem value="years">Years</MenuItem>
              </Select>
            </div>
          </Box>
        )}
      </div>
    </div>
  );
};

export default AutoReminder;
