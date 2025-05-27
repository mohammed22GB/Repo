import { useEffect, useRef, useState } from "react";
import { TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { v4 } from "uuid";

import Required from "../Required";
import { APP_DESIGN_MODES } from "../../../../../../common/utils/constants";
import { getComputedValuePassedIntoFormulaBuilder } from "../../../../../../common/utils/dynamicContentReplace";
import { separateNumbersWithComma } from "../../../../../../common/helpers/helperFunctions";

const TextArea = ({
  style,
  onChange,
  returnedLookupObj,
  values,
  readOnly,
  ...props
}) => {
  const autoSubmitValueRef = useRef(false);
  const [renderKey, setRenderKey] = useState(v4());
  const [trackLookupVal, setTrackLookupVal] = useState(null);
  const { capturedData, screenItems } = props || {};
  const [currentActualValue, setCurrentActualValue] = useState("");
  const [finalValue, setFinalValue] = useState("");
  const useStyles = makeStyles((theme) => ({
    ...style,
    dimensions: {
      ...style?.dimensions,
      [theme?.breakpoints?.down("sm")]: {
        width: "100% !important",
      },
    },
    myStyle: {
      width: style?.field?.width,
    },
  }));
  const classes = useStyles();
  const inputProps = {};
  if (values?.limitCharacter) {
    inputProps.minLength = values?.min;
    inputProps.maxLength = values?.max;
  }

  useEffect(() => {
    if (returnedLookupObj?.[props?.id]) {
      setTrackLookupVal(returnedLookupObj?.[props?.id]);
      onChange(returnedLookupObj?.[props?.id], props?.id);
      setRenderKey(v4());
    }
    if (props.val) {
      setTrackLookupVal(props.val);
      onChange(props.val, props?.id);
    }
  }, [returnedLookupObj, props?.id]);
  useEffect(() => {
    if (onChange) {
      onChange(finalValue, props?.id);
    }
  }, [finalValue]);

  useEffect(() => {
    const actualValue = displayValue();
    setCurrentActualValue(actualValue);
  }, [values]);

  useEffect(() => {
    if (!values?.computed) return;
    if (!returnedLookupObj?.[props?.id]) {
      setTrackLookupVal("");
    }

    const computedValue = displayValue();
    setCurrentActualValue(computedValue);
  }, [values, capturedData]);

  const displayValue = () => {
    if (props?.appDesignMode === APP_DESIGN_MODES.LIVE) {
      if (values?.computed) {
        const computedValue = getComputedValuePassedIntoFormulaBuilder(
          values,
          screenItems,
          capturedData
        );

        setFinalValue(computedValue);
        return computedValue;
      }

      return props?.val;
    }

    if (props?.appDesignMode === APP_DESIGN_MODES.PREVIEW) {
      if (values?.computed) {
        const computedValue = getComputedValuePassedIntoFormulaBuilder(
          values,
          screenItems,
          capturedData
        );

        return computedValue;
      }
      return values?.value;
    }
  };
  return (
    <div style={{ width: style?.field?.width }}>
      {!values?.labelHide && (
        <Typography gutterBottom className={classes?.label}>
          {values?.label}
          <Required required={values?.required} />
        </Typography>
      )}
      <TextField
        key={renderKey}
        inputProps={{
          ...inputProps,
          readOnly: values?.editable || readOnly || values?.computed,
          style: {
            // ...style?.field,
            borderStyle: "solid",
            // height: "unset",
            minHeight: style?.field?.height,
            color: style?.field?.color,
            fontSize: style?.field?.fontSize,
            InputtextAlign: style?.field?.InputtextAlign,
            fontWeight: style?.field?.fontWeight || 400,
            borderRadius: style?.field?.borderRadius,
            // height: style?.field?.height,
            // borderStyle: "solid",
            borderWidth: 0,
          },
        }}
        rows={values?.rows}
        size="small"
        className={`${classes?.dimensions_} ${classes?.field}`}
        classes={{
          root: classes?.myStyle,
        }}
        style={{ height: "unset" }}
        multiline
        // required={values?.required}
        variant="outlined"
        type={"text"}
        inputMode="text"
        //defaultValue={currentActualValue || trackLookupVal}
        onBlur={(e) => {
          if (values?.computed) {
            setCurrentActualValue(
              separateNumbersWithComma(
                e.target.value,
                values?.isFormatted,
                props?.isDocument
              )
            );
            setRenderKey(v4());
          }
        }}
        defaultValue={separateNumbersWithComma(
          currentActualValue || trackLookupVal,
          values?.isFormatted,
          props?.isDocument
        )}
        placeholder={values?.placeholder}
        readOnly={values?.editable || readOnly}
        // disabled={props.appDesignMode === APP_DESIGN_MODES.EDIT || props.disabled}
        onChange={
          props.appDesignMode !== APP_DESIGN_MODES.LIVE
            ? () => {}
            : (e) => onChange(e.target.value, props.id)
        }
      />
    </div>
  );
};

export default TextArea;
