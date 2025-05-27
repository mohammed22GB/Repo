import { FormControlLabel, Radio, Typography } from "@material-ui/core";
import { convertCheckboxValues } from "../../../../../../../../common/helpers/helperFunctions";
import { APP_DESIGN_MODES } from "../../../../../../../../common/utils/constants";

const RadioContent = (
  {
    selection,
    values,
    name,
    appDesignMode,
    disabled,
    readOnly,
    reuseValue,
    _onChange,
    props,
  },
  dynamicContentObj,
  trackLookupVal
) => {
  let resolvedValues;

  if (dynamicContentObj?.[name]) {
    resolvedValues = convertCheckboxValues(dynamicContentObj?.[name], "array");
  }

  if (resolvedValues && typeof resolvedValues === "object") {
    return resolvedValues?.map((val, index) => {
      const required = values?.required && !selection;
      return (
        <div
          key={index}
          style={{
            ...(values.optionsArrangement === "horizontal"
              ? { width: `calc(100% / ${values.maxOptionsPerRow || 2})` }
              : {}),
          }}
        >
          <FormControlLabel
            disabled={
              appDesignMode === APP_DESIGN_MODES.EDIT ||
              appDesignMode === APP_DESIGN_MODES.PREVIEW ||
              disabled ||
              readOnly
            }
            className={`${readOnly ? "read-only" : ""}`}
            control={
              <Radio
                value={val}
                onChange={_onChange}
                name={name}
                checked={selection === val}
                required={required ?? false}
              />
            }
            label={
              <Typography className={""} style={{ textAlign: "left" }}>
                {val}
              </Typography>
            }
          />
        </div>
      );
    });
  }

  // Static options
  const duplicateLookup = values?.options?.find((opt) => {
    return opt?.dataText === trackLookupVal?.[trackLookupVal?.length - 1];
  });
  if (!duplicateLookup) {
    values.options = [
      ...(values?.options || []),
      ...trackLookupVal?.map((lookupVal) => {
        return {
          id: lookupVal,
          dataText: lookupVal,
        };
      }),
    ];
  }

  let defaultValue = reuseValue;
  if (trackLookupVal?.length) {
    defaultValue = trackLookupVal[trackLookupVal.length - 1];
  }
  return values?.options?.map(({ dataText, dataValue, id, classes }, index) => {
    const value = values?.useValuesAttribute ? dataValue : dataText;
    const checked = defaultValue === value;
    const required = values?.required && !selection;
    return (
      <div
        key={index}
        style={{
          ...(values.optionsArrangement === "horizontal"
            ? { width: `calc(100% / ${values.maxOptionsPerRow || 2})` }
            : {}),
        }}
      >
        <FormControlLabel
          disabled={
            appDesignMode === APP_DESIGN_MODES.EDIT ||
            appDesignMode === APP_DESIGN_MODES.PREVIEW ||
            disabled ||
            readOnly
          }
          control={
            <Radio
              value={value}
              onChange={_onChange}
              name={name}
              checked={selection === value}
              required={required ?? false}
            />
          }
          label={
            <Typography
              className={`${classes?.radio} ${classes?.text}`}
              style={{ textAlign: "left" }}
            >
              {dataText}
            </Typography>
          }
        />
      </div>
    );
  });
};

export default RadioContent;
