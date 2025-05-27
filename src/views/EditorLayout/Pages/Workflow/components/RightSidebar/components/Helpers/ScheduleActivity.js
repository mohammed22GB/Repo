import { Button, Grid, MenuItem, Select } from "@material-ui/core";
import { useEffect, useState } from "react";
import SelectOnSteroids from "../sidebarActions/common/SelectOnSteroids";
import { durationList } from "../../../utils/constants";
import { TextField } from "@mui/material";
import { v4 } from "uuid";

const timezoneOffset = new Date().getTimezoneOffset();

const ScheduleActivity = ({
  activeTask,
  classes,
  saveScheduleInfo,
  variables,
  from,
  property,
  options,
}) => {
  // const [schedule, setSchedule] = useState("time");
  const [timingVars, setTimingVars] = useState({});
  const [timeField, setTimeField] = useState("datepicker");
  const [fieldsKey, setFieldsKey] = useState("-");
  useEffect(() => {
    setFieldsKey(v4());
  }, [activeTask?.id]);

  const handleChange = (value) => {
    // setSchedule(value);
    saveScheduleInfo(value, "triggerType");
  };

  useEffect(() => {
    /* const getDateVariables = () => {
      let dateTimeVariable =
        variables?.length > 0 &&
        variables?.filter(({ dataType }) => dataType[0] === "datetime");

      setDateTimeVars(() => dateTimeVariable);
    };
    getDateVariables(); */

    const filteredDateVariables = variables?.filter(
      (variable) => variable?.info?.dataType?.[0] === "datetime"
    );
    const filteredNumberVariables = variables?.filter(
      (variable) => variable?.info?.dataType?.[0] === "number"
    );
    const filteredVariables = {
      time: filteredDateVariables,
      interval: filteredNumberVariables,
    };
    setTimingVars(filteredVariables);

    return () => {
      setTimingVars(() => ({}));
    };
  }, [variables, activeTask.triggerType]);

  /**
   * I'm trying to set the state of the triggerDateTime and triggerIntervalCount based on the value of the
   * trigger variable.
   * @param e - [{id: "1", name: "test", variableType: "string"}]
   * @param trigger - string,
   */
  const onSteroidChange = (value, trigger, useDatePicker = false) => {
    const passValue = !useDatePicker
      ? {
          ...value[0],
          contentType: value[0]?.variableType,
        }
      : {
          id: value.target.value,
          name: value.target.value,
          contentType: "Custom",
        };

    delete passValue.variableType;

    if (trigger === "time") {
      saveScheduleInfo(
        { timezoneOffset, value: [passValue] },
        "triggerDateTime"
      );
    } else if (trigger === "interval") {
      saveScheduleInfo([passValue], "triggerIntervalCount");
    }
  };

  const EscalationTimingSwitch = ({ title, position }) => (
    <Button
      disabled={
        activeTask.triggerType === title ||
        (!!options?.length && !options.includes(title))
      }
      onClick={(e) => handleChange(title)}
      style={{
        borderRadius: position === 1 ? "4px 0 0 4px" : "0 4px 4px 0",
        backgroundColor: activeTask.triggerType === title ? "#091540" : null,
        color: activeTask.triggerType === title ? "#fff" : null,
        opacity: activeTask.triggerType === title ? 1 : 0.5,
        textTransform: "capitalize",
        width: "50%",
        height: 26,
        fontSize: 10,
      }}
    >
      {title}
    </Button>
  );

  return (
    <div style={{ marginBottom: "1rem" }}>
      <Grid container style={{ marginBottom: 7 }}>
        <Grid
          value={activeTask.triggerType}
          style={{
            border: "1px solid black",
            width: "50%",
            minWidth: "200px",
            borderRadius: 5,
            padding: 1,
          }}
        >
          <EscalationTimingSwitch title="time" position={1} />
          <EscalationTimingSwitch title="interval" position={2} />
        </Grid>
      </Grid>
      <div style={{ position: "relative" }}>
        {activeTask.properties?.escalation?.escalateTaskDueDate?.type ===
          "time" && timeField === "datepicker" ? (
          <TextField
            key={`${fieldsKey}-1`}
            id="datetime-local"
            size="small"
            // label="Next appointment"
            type="datetime-local"
            fullWidth
            defaultValue={
              activeTask?.properties?.triggerDateTime?.value?.[0]?.id
            }
            // sx={{ width: 250 }}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              className: classes.extraRightPaddingInput,
            }}
            onChange={(e) => onSteroidChange(e, "time", true)}
          />
        ) : (
          <SelectOnSteroids
            source="variable"
            variables={
              timingVars[
                activeTask.properties?.escalation?.escalateTaskDueDate?.type
              ]
            }
            onChange={(e) =>
              onSteroidChange(
                e,
                activeTask.properties?.escalation?.escalateTaskDueDate?.type
              )
            }
            value={
              activeTask.properties?.escalation?.escalateTaskDueDate?.type ===
              "time"
                ? activeTask?.properties?.escalation?.triggerDateTime?.value
                : activeTask?.properties?.escalation?.triggerIntervalCount
            }
            type={
              activeTask.properties?.escalation?.escalateTaskDueDate?.type ===
              "time"
                ? "datetime"
                : "number"
            }
            contents={["variables", "custom"]}
            placeholderText="Select or type value"
            multiple={false}
          />
        )}

        {activeTask.properties?.escalation?.escalateTaskDueDate?.type ===
        "time" ? (
          <Select
            className="floating-field-on-selectonsteroid"
            variant="outlined"
            size="small"
            // fullWidth
            placeholder="Select source"
            classes={{
              root: classes.select,
              outlined: classes.selected,
            }}
            onChange={(e) => setTimeField(e.target.value)}
            value={timeField}
          >
            <MenuItem value="choose" disabled>
              <em>Select source</em>
            </MenuItem>
            <MenuItem value="datepicker">Picker</MenuItem>
            <MenuItem value="variable">Variable</MenuItem>
          </Select>
        ) : (
          <Select
            className="floating-field-on-selectonsteroid"
            variant="outlined"
            size="small"
            placeholder="Select measure"
            classes={{
              root: classes.select,
              outlined: classes.selected,
            }}
            onChange={(e) => saveScheduleInfo(e, "triggerIntervalMeasure")}
            value={activeTask?.properties?.escalation?.triggerIntervalMeasure}
          >
            <MenuItem value="choose" disabled>
              <em>Select measure</em>
            </MenuItem>
            {/* <MenuItem value="none" selected>
              <b style={{ visibility: "hidden" }}>_</b>
            </MenuItem> */}
            {durationList?.map(([value, displayValue], idx) => {
              return (
                <MenuItem key={idx} value={value}>
                  {displayValue}
                </MenuItem>
              );
            })}
          </Select>
        )}
      </div>
    </div>
  );
};

export default ScheduleActivity;
