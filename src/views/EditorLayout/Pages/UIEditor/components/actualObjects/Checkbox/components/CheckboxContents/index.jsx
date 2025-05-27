import { Checkbox, FormControlLabel, Typography } from "@material-ui/core";
import {
  convertCheckboxValues,
  filterDuplicateObjects,
  separateNumbersWithComma,
} from "../../../../../../../../common/helpers/helperFunctions";
import { compareByValue } from "../../../../../../../../Datasheets/utils";
import { APP_DESIGN_MODES } from "../../../../../../../../common/utils/constants";

const CheckboxContents = (
  {
    selections,
    values,
    name,
    appDesignMode,
    disabled,
    readOnly,
    reuseValue,
    _onChange,
    screenId,
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
      const required = values?.required && !selections?.length;

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
              <Checkbox
                /* this is commented out in order for list from backend to be clickable */
                /* however, this prevents re-selection of boxes from screen reuse. TBF */
                // checked={typeof dynamicContentObj?.[name] === "string"}
                value={val}
                onChange={_onChange}
                name={val}
                required={required ?? false}
              />
            }
            label={
              <Typography className={""} style={{ textAlign: "left" }}>
                {/* {val} */}
                {separateNumbersWithComma(
                  val,
                  values?.isFormatted,
                  props?.isDocument
                )}
              </Typography>
            }
          />
        </div>
      );
    });
    // }
  } else {
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

    values.options = filterDuplicateObjects(
      values.options,
      compareByValue,
      "dataText"
    );

    let defaultValues = [];
    return values?.options?.map(
      ({ dataText, dataValue, id, classes }, index) => {
        const value = values?.useValuesAttribute ? dataValue : dataText;

        if (reuseValue) {
          defaultValues = Array.isArray(reuseValue) ? reuseValue : [reuseValue];
        }
        if (trackLookupVal?.length) {
          defaultValues = trackLookupVal;
        }
        const checked = defaultValues?.includes(value);
        const required = values?.required && !selections?.length;

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
                !props.isDocument ? (
                  <Checkbox
                    key={`${value}-${props.taskId}`}
                    value={value}
                    onChange={_onChange}
                    name={id}
                    required={required ?? false}
                    defaultChecked={checked}
                  />
                ) : (
                  <span style={{ width: 25, height: 10 }}></span>
                )
              }
              label={
                <Typography
                  className={`${classes?.checkbox} ${classes?.text}`}
                  style={{ textAlign: "left" }}
                >
                  {/* {dataText} */}
                  {separateNumbersWithComma(
                    dataText,
                    values?.isFormatted,
                    props?.isDocument
                  )}
                </Typography>
              }
            />
          </div>
        );
      }
    );
  }
};

export default CheckboxContents;
