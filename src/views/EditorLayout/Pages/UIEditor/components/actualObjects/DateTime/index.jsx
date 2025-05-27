import React, { useEffect, useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, InputBase } from "@material-ui/core";
import moment from "moment";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import Required from "../Required";
import {
  APP_DESIGN_MODES,
  GENERAL_DEFAULT_DATE_FORMAT,
  GENERAL_DEFAULT_TIME_FORMAT,
} from "../../../../../../common/utils/constants";
import { v4 } from "uuid";

export default function DateTime({
  style,
  values,
  onChange,
  readOnly,
  returnedLookupObj,
  val: reuseValue,
  screenReuseAttributes,
  ...props
}) {
  const valuesSubmitted = useRef(0);
  const [dateTimeValue, setDateTimeValue] = useState(null);
  const [endDateTimeValue, setEndDateTimeValue] = useState(null);
  const [dateTimeDuration, setDateTimeDuration] = useState(null);
  const [isInvalid, setIsInvalid] = useState(false);
  const [lookupKey, setLookupKey] = useState(v4());
  // const isInvalid = useRef(false);

  const useStyles = makeStyles((theme) => ({
    ...style,
    field: {
      ...style?.field,
      width: "100%",
      padding: "0 10px",
      font: "inherit",
      color: "currentColor",
      border: "solid 1px !important",
      boxSizing: "border-box !important",
      display: "flex",
      justifyContent: "center",
      "& .MuiInputAdornment-root": {
        marginLeft: -10,
      },
    },
    dimensions: {
      // ...style?.dimensions,
      [theme?.breakpoints?.down("sm")]: {
        width: "100%",
      },
    },
  }));
  const classes = useStyles();

  const handleLookupValue = () => {
    const lookupValue = returnedLookupObj?.[props?.id];
    const valuesDateFormat = getFormats().dateFormat;
    const valuesTimeFormat = getFormats().timeFormat;
    if (lookupValue) {
      const timeFormats = ["HH:mm", "HH:mm:ss", "hh:mm A", "hh:mm:ss A"];
      const hasTime = /(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?(?:\s?[AP]M)?/g;
      const matchTime = lookupValue?.match(hasTime);
      const timeVal = matchTime ? matchTime?.[0] : null;
      const timeValue = moment(timeVal, timeFormats, true).format(
        valuesTimeFormat
      );
      const dateValue = moment(lookupValue).format(valuesDateFormat);

      return { matchTime, timeValue, dateValue };
    }
    return null;
  };
  useEffect(() => {
    if (returnedLookupObj?.[props?.id]) {
      setLookupKey(v4());
    }

    const lookupVal = handleLookupValue();
    lookupVal?.matchTime === null
      ? setDateTimeValue_(lookupVal?.dateValue, "date")
      : setDateTimeValue_(lookupVal?.timeValue, "time");
  }, [returnedLookupObj, props?.id]);

  useEffect(() => {
    /**
     * when the dateTime doesn't have a setRange (which is start date, end date and duration)
     * when the screenReuseAttributes object contains the dateTime id
     * call the onChange function with the dateTime value to fix issues of users not being able to submit on app run for reusable screens
     */

    const dateTimeReuseValue = screenReuseAttributes?.[props?.id]?.value;
    const dateTimeReuseAttribute =
      screenReuseAttributes?.[props?.id]?.attribute;

    if (
      !!Object.keys(screenReuseAttributes ?? {}).length &&
      dateTimeReuseAttribute &&
      dateTimeReuseValue
    ) {
      onChange && onChange(dateTimeReuseValue, props?.id);
    }
  }, [screenReuseAttributes?.[props?.id]]);

  const trimOutputValues = (value) => {
    const stripValue = (input) => {
      //  the first condition in IF is when {input} is number
      if (!input?.includes || !input?.includes(" | ")) {
        return input;
      }

      const outputParts = [];
      const inputParts = input.split(" | ");

      if (values?.showDate) {
        outputParts.push(inputParts[0]);
      }
      if (values?.showTime) {
        outputParts.push(inputParts[1]);
      }

      const output = outputParts.join(" | ");
      return output;
    };

    if (typeof value === "object") {
      const outputObject = {
        [Object.keys(value)[0]]: stripValue(Object.values(value)[0]),
        [Object.keys(value)[1]]: stripValue(Object.values(value)[1]),
        [Object.keys(value)[2]]: stripValue(Object.values(value)[2]),
      };

      return outputObject;
    }
    const outputString = stripValue(value);
    return outputString;
  };

  const getFormats = () => {
    const dateFormat = values?.dateFormat || GENERAL_DEFAULT_DATE_FORMAT;
    const timeFormat =
      values?.timeFormat == "12"
        ? "hh:mm A"
        : values?.timeFormat == "24"
        ? "HH:mm"
        : "" || GENERAL_DEFAULT_TIME_FORMAT;
    const fullFormat = `${dateFormat} | ${timeFormat}`;

    return {
      dateFormat,
      timeFormat,
      fullFormat,
    };
  };

  const setDateTimeValue_ = (value, part, isEndValue) => {
    if (!value) {
      return;
    }

    const dateFormat = getFormats().dateFormat;
    const timeFormat = getFormats().timeFormat;

    const validateDateTimeAndReturnValues = (updatedValue) => {
      if (!values?.setRange) {
        return { output: updatedValue, valid: true };
      }
      const start = !isEndValue ? updatedValue : dateTimeValue;
      const end = isEndValue ? updatedValue : endDateTimeValue;

      const startMoment = moment(start, `${dateFormat} | ${timeFormat}`);
      const endMoment = moment(end, `${dateFormat} | ${timeFormat}`);

      let duration = values?.hasDuration
        ? endMoment.diff(startMoment, values?.durationMeasure || "hour")
        : "";

      if (
        duration &&
        !isNaN(duration) &&
        ["day", "month", "year"].includes(values?.durationMeasure) &&
        values?.rangeInclusive
      ) {
        duration++;
      }

      const output = {
        [values.rangeStartId]: moment(startMoment).format(
          `${dateFormat} | ${timeFormat}`
        ),
        [values.rangeEndId]: moment(endMoment).format(
          `${dateFormat} | ${timeFormat}`
        ),
        ...(duration ? { [values.rangeDurationId]: duration } : {}),
      };

      const result = endMoment >= startMoment;

      return {
        output,
        duration,
        valid: result,
      };
    };

    const datetime_ = !isEndValue ? dateTimeValue : endDateTimeValue;
    const datetime = datetime_?.split(datetime_?.includes("T") ? "T" : " | ");

    const timeValue = datetime?.[0]?.includes(":")
      ? datetime?.[0]
      : datetime?.[1];
    const dateValue = datetime?.[0]?.includes(":") ? "" : datetime?.[0];

    const newDateTime =
      part === "date"
        ? `${value}${timeValue ? ` | ${timeValue}` : ""}`
        : `${dateValue ? `${dateValue} | ` : ""}${value}`;

    if (!isEndValue) {
      setDateTimeValue(newDateTime);
    }
    if (isEndValue) {
      setEndDateTimeValue(newDateTime);
    }

    const result = validateDateTimeAndReturnValues(newDateTime);
    setDateTimeDuration(result.duration);

    if (result.valid) {
      setIsInvalid(false);
      if (values?.setRange) {
        onChange && onChange(trimOutputValues(result.output), null, true);
      } else {
        onChange && onChange(trimOutputValues(newDateTime), props.id);
      }
    } else {
      setIsInvalid(true);
    }
  };

  const getReuseValue = (isEnd) => {
    let momentValue;

    const fullFormat = getFormats().fullFormat;

    if (!values?.setRange) {
      const lookupVal = handleLookupValue();
      momentValue =
        reuseValue || !lookupVal?.matchTime
          ? moment(reuseValue || lookupVal?.dateValue, fullFormat)
          : lookupVal?.timeValue;
      return { value: momentValue };
    }

    const rangeId = isEnd ? values?.rangeEndId : values?.rangeStartId;
    const { value, attribute } = screenReuseAttributes?.[rangeId] || {};
    const duration = screenReuseAttributes?.[values?.rangeDurationId]?.value;

    //  submit values to RunScreen
    if (valuesSubmitted.current < 2 && onChange) {
      onChange(
        trimOutputValues({
          [rangeId]: value,
          [values?.rangeDurationId]: duration,
        }),
        null,
        true
      );
      valuesSubmitted.current = valuesSubmitted.current + 1;
    }

    momentValue = moment(value, fullFormat);

    return {
      value: momentValue,
      duration,
      readOnly: attribute === "readonly",
      hidden: attribute === "hidden",
    };
  };

  useEffect(() => {
    // this is used to trigger/call getReuseValue function
    const rangeId = values?.rangeStartId;

    const { value } = screenReuseAttributes?.[rangeId] || {};

    if (value) {
      valuesSubmitted.current = 0;
    }
  }, [screenReuseAttributes, values?.rangeStartId]);

  const gotReuseValueStart = getReuseValue();
  const gotReuseValueEnd = getReuseValue(true);

  const CoreDateTimeComponent = ({
    isEnd,
    type = "date",
    value,
    onChangeValue,
  }) => {
    const dateFormat = getFormats().dateFormat;
    const timeFormat = getFormats().timeFormat;

    return (
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <>
          {type === "date" && !value?.hidden && (
            <DatePicker
              key={`${lookupKey}-${moment(value?.value)
                .format(dateFormat)
                .toString()}`}
              variant="outlined"
              size="small"
              id="date"
              type="date"
              className={classes?.field}
              format={dateFormat}
              // showMonthYearPicker
              placeholderText={dateFormat}
              views={[
                ...(dateFormat?.toLowerCase()?.includes("d") ? ["day"] : []),
                ...(dateFormat?.toLowerCase()?.includes("m") ? ["month"] : []),
                ...(dateFormat?.toLowerCase()?.includes("y") ? ["year"] : []),
              ]}
              style={{
                width: "100%",
                padding: "0 10px",
              }}
              placeholder={values?.datePlaceholder}
              inputProps={{
                style: {
                  color: style?.field?.color,
                  textAlign: style?.field?.textAlign,
                  borderStyle: "solid",
                  width: "100%",
                },
              }}
              disabled={
                props.appDesignMode === APP_DESIGN_MODES.EDIT ||
                props.appDesignMode === APP_DESIGN_MODES.PREVIEW ||
                props.disabled
              }
              minDate={
                isEnd ? moment(dateTimeValue, getFormats().fullFormat) : null
              }
              // minDate={moment("2024-05-15")}
              maxDate={
                isEnd ? null : moment(endDateTimeValue, getFormats().fullFormat)
              }
              // maxDate={moment("2024-10-15")}
              // required={values?.required}
              defaultValue={value?.value}
              readOnly={readOnly || value?.readOnly}
              onChange={(val) => onChangeValue(moment(val).format(dateFormat))}
            />
          )}

          {type === "time" && !value?.hidden && (
            <TimePicker
              key={`${lookupKey}-${moment(value?.value)
                .format(dateFormat)
                .toString()}`}
              variant="outlined"
              size="small"
              placeholder={values?.timePlaceholder}
              placeholderText={timeFormat}
              className={classes?.field}
              id="input-with-icon-textfield"
              format={timeFormat}
              // views={["hours", "minutes"]}
              // openTo="hours"
              style={{ width: "100%", padding: "0 10px" }}
              type="time"
              inputProps={{
                style: {
                  color: style?.field?.color,
                  textAlign: style?.field?.textAlign,
                  // height: style?.field?.height,
                  borderStyle: "solid",
                },
              }}
              disabled={props.appDesignMode !== APP_DESIGN_MODES.LIVE}
              defaultValue={value?.value}
              readOnly={readOnly || value?.readOnly}
              onChange={(val) => onChangeValue(moment(val).format(timeFormat))}
            />
          )}
        </>
      </LocalizationProvider>
    );
  };

  return (
    (!gotReuseValueStart?.hidden || !gotReuseValueEnd?.hidden) && (
      <>
        <div
          className={classes?.root}
          style={{
            display: "flex",
            flexWrap: "wrap",
            // flexDirection: values?.stackRange ? "column" : "row",
            gap: 15,
            ...(values?.stackRange
              ? { flexDirection: "column" }
              : {
                  // width: style?.field?.width,
                  flexDirection: "row",
                }),
          }}
        >
          <div
            style={{
              flex: 1,
              ...(values?.stackRange
                ? {
                    width: style?.field?.width,
                  }
                : {}),
            }}
          >
            {!values?.labelHide && (
              <Typography
                data-testid="labelTitle"
                gutterBottom
                className={classes?.label}
              >
                {values?.label}
                <Required required={values?.required} />
              </Typography>
            )}
            <div
              className={`${readOnly ? "read-only" : ""}`}
              style={{
                display: "flex",
                flexDirection: values?.stacked ? "column" : "row",
                gap: 15,
              }}
            >
              {values?.showDate && (
                <div
                  style={{ position: "relative", flex: 1 }}
                  // xs={!!values?.stacked || !values?.showTime ? 12 : 6}
                >
                  {CoreDateTimeComponent({
                    type: "date",
                    value: gotReuseValueStart,
                    format: values.dateFormat,
                    onChangeValue: (val) => setDateTimeValue_(val, "date"),
                  })}
                </div>
              )}
              {values?.showTime && (
                <div
                  style={{ flex: 1 }}
                  // item xs={values?.stacked || !values.showDate ? 12 : 6}
                >
                  {CoreDateTimeComponent({
                    type: "time",
                    value: gotReuseValueStart,
                    format: values.timeFormat,
                    onChangeValue: (val) => setDateTimeValue_(val, "time"),
                  })}
                </div>
              )}
            </div>
          </div>
          {values?.setRange && (
            <>
              <div
                style={{
                  flex: 1,
                  ...(values?.stackRange
                    ? {
                        width: style?.field?.width,
                      }
                    : {}),
                }}
              >
                {!values?.labelHide && (
                  <Typography gutterBottom className={classes?.label}>
                    {values?.labelDateEnd || "End date"}
                  </Typography>
                )}

                <div
                  // container
                  // spacing={1}
                  style={{
                    display: "flex",
                    flexDirection: values?.stacked ? "column" : "row",
                    gap: 15,
                  }}
                  className={`${readOnly ? "read-only" : ""}`}
                >
                  {values?.showDate && (
                    <div
                      style={{ position: "relative", flex: 1 }}
                      // item
                      // xs={!!values?.stacked || !values?.showTime ? 12 : 6}
                    >
                      {CoreDateTimeComponent({
                        isEnd: true,
                        type: "date",
                        value: gotReuseValueEnd,
                        format: values.dateFormat,
                        onChangeValue: (val) =>
                          setDateTimeValue_(val, "date", true),
                      })}
                    </div>
                  )}
                  {values?.showTime && (
                    <div
                      style={{ position: "relative", flex: 1 }}
                      // xs={values?.stacked || !values.showDate ? 12 : 6}
                    >
                      {CoreDateTimeComponent({
                        isEnd: true,
                        type: "time",
                        value: gotReuseValueEnd,
                        format: values.timeFormat,
                        onChangeValue: (val) =>
                          setDateTimeValue_(val, "time", true),
                      })}
                    </div>
                  )}
                </div>
              </div>

              {values?.hasDuration && (
                <div
                  style={{
                    flex: 1,
                    ...(values?.stackRange
                      ? {
                          width: style?.field?.width,
                        }
                      : {}),
                  }}
                >
                  {!values?.labelHide && (
                    <Typography gutterBottom className={classes?.label}>
                      {values?.labelDuration || "Duration"} (
                      {values?.durationMeasure
                        ? `${values?.durationMeasure}s`
                        : "hours"}
                      )
                    </Typography>
                  )}

                  <InputBase
                    name={values?.name}
                    size="small"
                    // inputProps={inputProps}
                    inputProps={{
                      style: {
                        // ...style?.field,
                        color: style?.field?.color,
                        fontSize: style?.field?.fontSize,
                        InputtextAlign: style?.field?.InputtextAlign,
                        fontWeight: style?.field?.fontWeight || 400,
                        // height: style?.field?.height,
                        borderStyle: "solid",
                        borderWidth: 0,
                      },
                    }}
                    className={`${classes?.dimensions_} ${classes?.field} `}
                    placeholder={values?.placeholder}
                    variant="outlined"
                    // defaultValue={finalValue || autoDefault || trackLookupVal}
                    value={
                      dateTimeDuration ||
                      gotReuseValueStart?.duration ||
                      gotReuseValueEnd?.duration
                    }
                    // disabled={props.appDesignMode === APP_DESIGN_MODES.EDIT || props.disabled}
                    readOnly
                  />
                </div>
              )}
            </>
          )}
        </div>
        {isInvalid && (
          <div className={classes?.component}>
            <Typography
              className={classes?.toolTip}
              style={{
                color: "#f50000",
                fontSize: 10,
                paddingTop: 5,
              }}
            >
              * start date/time must be less than end date/time
            </Typography>
          </div>
        )}
        {values?.showTooltip && (
          <div className={classes?.component}>
            <Typography className={classes?.toolTip}>
              {values?.toolTip}
            </Typography>
          </div>
        )}
      </>
    )
  );
}
