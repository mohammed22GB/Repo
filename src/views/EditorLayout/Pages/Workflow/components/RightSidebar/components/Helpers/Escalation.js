import { Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import SelectOnSteroids from "../sidebarActions/common/SelectOnSteroids";
import ScheduleActivity from "./ScheduleActivity";

const Escalation = ({
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
     * If the properties?.escalation?.triggerType is "time", then set the schedule to "dateEscalation". If the
     * properties?.escalation?.triggerType is "interval", then set the schedule to "durationEscalation". Otherwise, set the
     * schedule to "dateEscalation".
     */
    const setDefaultTriggerType = () => {
      let triggerType =
        properties?.escalation?.triggerType === "time"
          ? "dateEscalation"
          : properties?.escalation?.triggerType === "interval"
          ? "durationEscalation"
          : "dateEscalation";
      setSchedule(() => triggerType);
    };
    //setDefaultTriggerType();

    return () => {
      //setSchedule(() => "");
    };
  }, [properties?.escalation?.triggerType]);

  /**
   * I'm trying to set the state of the triggerDateTime and triggerIntervalCount based on the value of the
   * trigger variable.
   * @param e - [{id: "1", name: "test", variableType: "string"}]
   * @param trigger - string,
   */
  const onSteriodChange = (e, trigger) => {
    if (e?.length) {
      const eventVal = e[0];
      let escalateTaskDueDate = trigger === "escalateTaskDueDate" && {
        timing: eventVal?.name,
      };
      const users = trigger !== "escalateTaskDueDate" && [
        ...escalatedUsers,
        eventVal,
      ];
      if (trigger !== "escalateTaskDueDuration") {
        //setEscalatedUsers([...escalatedUsers, eventVal]);
        _setTaskInfo(
          trigger === "escalateTaskDueDate"
            ? escalateTaskDueDate
            : {
                ...properties?.escalation,
                escalateTo: users,
              },
          trigger
        );
      }
      if (trigger === "escalateTaskDueDuration") {
        const delay = {
          value: !eventVal?.target && eventVal?.id && eventVal?.name,
          unit: eventVal?.target?.value ?? durationType,
        };
        setDurationDetails(eventVal?.name);
        if (eventVal?.target) {
          setDurationType(eventVal?.target?.value);
        }
        const escalateTaskDueDate = { delay };
        if (delay?.value && delay?.unit) {
          _setTaskInfo(escalateTaskDueDate, "escalateTaskDueDate");
        }
      }
    }

    // if (trigger === "dateEscalation") {
    //   _setTaskInfo(triggerDateTime, "triggerDateTime");
    // } else if (trigger === "durationEscalation") {
    //   _setTaskInfo(triggerIntervalCount, "triggerIntervalCount");
    // }
  };

  useEffect(() => {
    if (properties?.escalation?.escalateTaskDueDate?.timing) {
      setDateDetails(properties?.escalation?.escalateTaskDueDate?.timing);
    }
    if (properties?.escalation?.escalateTaskDueDate?.delay) {
      setDurationDetails(
        properties?.escalation?.escalateTaskDueDate?.delay?.value
      );
      setDurationType(properties?.escalation?.escalateTaskDueDate?.delay?.unit);
    }
  }, [properties?.escalation?.escalateTaskDueDate]);

  const handleDuration = (type) => {
    setDurationType(type);
    /*_setTaskInfo(e, "triggerIntervalMeasure")*/
  };

  const _saveScheduleInfo = (inValue, property) => {
    let outValue;

    if (property === "triggerType") {
      outValue = {
        ...properties?.escalation,
        escalateTaskDueDate: {
          ...properties?.escalation?.escalateTaskDueDate,
          type: inValue,
        },
      };
    }
    if (property === "triggerIntervalMeasure") {
      outValue = {
        ...properties?.escalation,
        escalateTaskDueDate: {
          ...properties?.escalation?.escalateTaskDueDate,
          type: "interval",
          delay: {
            ...properties?.escalation?.escalateTaskDueDate.delay,
            unit: inValue.target.value,
          },
        },
      };
    } else if (property === "triggerIntervalCount") {
      outValue = {
        ...properties?.escalation,
        escalateTaskDueDate: {
          ...properties?.escalation?.escalateTaskDueDate,
          type: "interval",
          delay: {
            ...properties?.escalation?.escalateTaskDueDate.delay,
            value: inValue,
          },
        },
      };
    } else if (property === "triggerDateTime") {
      outValue = {
        ...properties?.escalation,
        escalateTaskDueDate: {
          ...properties?.escalation?.escalateTaskDueDate,
          type: "time",
          timing: inValue,
        },
      };
    }
    _setTaskInfo(outValue, "escalateTaskDueDate");
  };

  return (
    <div>
      <ScheduleActivity
        activeTask={{
          ...activeTask,
          triggerType: properties?.escalation?.escalateTaskDueDate?.type,
          properties: {
            ...activeTask?.properties,
            escalation: activeTask?.properties?.escalation,
            triggerIntervalCount:
              properties?.escalation?.escalateTaskDueDate?.delay?.value,
            triggerIntervalMeasure:
              properties?.escalation?.escalateTaskDueDate?.delay?.unit,
            triggerDateTime: {
              value: properties?.escalation?.escalateTaskDueDate?.timing?.value,
            },
          },
        }}
        classes={classes}
        saveScheduleInfo={_saveScheduleInfo}
        variables={variables}
        from="screenTask"
        property="escalation"
        // options={["interval"]}
      />
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            margin: "10px 0px 5px",
          }}
        >
          <Typography
            style={{
              color: "#999",
              fontSize: 12,
              marginBottom: 5,
            }}
          >
            Escalation assignee
          </Typography>
        </div>

        <div className={classes.sectionEntry}>
          <SelectOnSteroids
            // disabled={!properties?.escalation?.calendarId}
            source="email"
            //trackChange
            variables={variables}
            onChange={(e) => onSteriodChange(e, "escalateTo")}
            value={properties?.escalation?.escalateTo || []}
            type="email"
            multiple={true}
          />
        </div>
      </div>
    </div>
  );
};

export default Escalation;
