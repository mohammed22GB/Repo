import { InputBase, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { NumericFormat } from "react-number-format";
import { v4 } from "uuid";
import validate from "validate.js";
import { emptyEmailSchema } from "../../../../../../ForgotPassword/components/InputEmail/emailSchema";
import { APP_DESIGN_MODES } from "../../../../../../common/utils/constants";
import {
  getComputedValuePassedIntoFormulaBuilder,
  searchAndReplace,
} from "../../../../../../common/utils/dynamicContentReplace";
import Required from "../Required";

const InputText = ({
  style,
  onChange,
  appSequence,
  values,
  dataType,
  disabled: isDisabled,
  readOnly,
  dynamicData,
  screenId,
  taskId,
  itemDetails,
  returnedLookupObj,
  workflowInstanceId,
  ...props
}) => {
  const isAutoNumber = itemDetails?.dataType === "autoNumber";
  const autoSubmitValueRef = useRef(false);
  const { capturedData, screenItems } = props || {};
  const [autoDefault, setAutoDefault] = useState(null);
  const [trackLookupVal, setTrackLookupVal] = useState(null);
  const [finalValue, setFinalValue] = useState(null);
  const [renderKey, setRenderKey] = useState(v4());

  const dynamicContentObj = dynamicData?.[screenId];
  const autoBG =
    isAutoNumber && props?.appDesignMode === APP_DESIGN_MODES.EDIT
      ? "lightgray"
      : "none";

  const useStyles = makeStyles((theme) => ({
    ...style,
    dimensions: {
      ...style?.dimensions,
      [theme?.breakpoints?.down("xs")]: {
        width: "100% !important",
      },
    },
  }));

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
  });
  const classes = useStyles();
  const inputProps = {};
  if (values?.limitCharacter) {
    inputProps.minLength = values?.min;
    inputProps.maxLength = values?.max;
  }

  useEffect(() => {
    const inputTextReturnedLookupObjValue = returnedLookupObj?.[props?.id];

    if (!!inputTextReturnedLookupObjValue) {
      setTrackLookupVal(inputTextReturnedLookupObjValue);
      onChange(inputTextReturnedLookupObjValue, props?.id);
      setRenderKey(v4());
    }
  }, [returnedLookupObj, props?.id]);

  useEffect(() => {
    if (props?.appDesignMode === APP_DESIGN_MODES.EDIT) {
      if (values?.sequencePrefix && values?.sequenceLength) {
        setAutoDefault(
          `${values?.sequencePrefix ?? ""}${values?.sequenceLength ?? ""}`
        );
      }
    }
  }, [values]);

  useEffect(() => {
    const errors = validate(formState.values, emptyEmailSchema);

    setFormState((formState) => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {},
    }));
  }, [formState.values]);

  useEffect(() => {
    if (isAutoNumber) {
      onChange(appSequence?.currentSequence, props.id || props.name);
    }

    const value = displayValue();
    setFinalValue(value);
    setRenderKey(v4());
  }, [
    props.val,
    props.name,
    appSequence,
    itemDetails?.dataType,
    dynamicContentObj,
  ]);

  useEffect(() => {
    if (!values?.computed) {
      return;
    }
    const value = displayValue();
    setFinalValue(value);
    setRenderKey(v4());
  }, [values, capturedData]);

  useEffect(() => {
    const value = displayValue();
    setFinalValue(value);
    setRenderKey(v4());
  }, [dynamicContentObj]);

  const textContent = (elem) => {
    if (!elem) {
      return "";
    }
    if (typeof elem === "string") {
      return elem;
    }

    const children = elem.props && elem.props.children;
    if (children instanceof Array) {
      return children.map(textContent).join("");
    }

    return textContent(children);
  };

  const displayValue = () => {
    const intermediateValues = {};

    if (props?.appDesignMode === APP_DESIGN_MODES.LIVE) {
      if (isAutoNumber) {
        return appSequence?.currentSequence ?? "";
      } else if (itemDetails?.isDynamic || itemDetails?.name?.startsWith("@")) {
        const dynamicContentValue = textContent(
          searchAndReplace(props.name, dynamicContentObj, "field")
        );

        intermediateValues.dynamicContentValue = dynamicContentValue;
      } else if (values?.computed) {
        const computedValue = getComputedValuePassedIntoFormulaBuilder(
          values,
          screenItems,
          capturedData
        );

        intermediateValues.computedValue = computedValue;
      }

      const finalValue =
        intermediateValues.dynamicContentValue ||
        intermediateValues.computedValue ||
        props?.val;

      if ((finalValue || finalValue === false) && !autoSubmitValueRef.current) {
        handleChange(
          { target: { value: finalValue }, persist: () => {} },
          props.id
        );
        autoSubmitValueRef.current = finalValue;
      }

      return finalValue;
    } else if (props?.appDesignMode === APP_DESIGN_MODES.PREVIEW) {
      if (values?.computed) {
        const computedValue = getComputedValuePassedIntoFormulaBuilder(
          values,
          screenItems,
          capturedData
        );

        return computedValue;
      }
      return values?.value ?? "";
    }
  };

  const handleChange = (e) => {
    e?.persist && e?.persist();

    if (itemDetails?.dataType === "email") {
      setFormState((formState) => ({
        ...formState,
        values: {
          ...formState.values,
          email: e.target.value,
        },
        touched: {
          ...formState.touched,
          email: true,
        },
      }));
      !hasError("email") && onChange(e.target.value, props.id);
    } else {
      onChange(e.target.value, props.id);
    }
  };

  const hasError = (field) =>
    formState.touched[field] && formState.errors[field] ? true : false;

  return (
    <div style={{ width: style?.field?.width }}>
      {!values?.labelHide && (
        <Typography gutterBottom className={classes?.label}>
          {values?.label}
          <Required required={values?.required && !isDisabled} />
        </Typography>
      )}
      {itemDetails?.dataType !== "number" ? (
        <InputBase
          key={renderKey}
          name={values?.name}
          size="small"
          inputProps={{
            ...inputProps,
            style: {
              // ...style?.field,
              color: style?.field?.color,
              fontSize: style?.field?.fontSize,
              InputtextAlign: style?.field?.InputtextAlign,
              fontWeight: style?.field?.fontWeight || 400,
              // height: style?.field?.height,
              borderStyle: "solid",
              borderWidth: 0,
              textAlign: style?.field?.textAlign,
            },
          }}
          className={`${classes?.dimensions_} ${classes?.field} `}
          style={{
            padding: "0 10px",
            background: autoBG,
          }}
          placeholder={values?.placeholder}
          type={itemDetails?.dataType}
          variant="outlined"
          defaultValue={finalValue ?? autoDefault ?? trackLookupVal}
          /* leave 'required' attribute commented out as validation is now handled by custom function */
          // required={values?.required && !isDisabled}
          // disabled={props.appDesignMode === APP_DESIGN_MODES.EDIT || props.disabled}
          disabled={isDisabled || props?.name?.startsWith("@")}
          readOnly={
            values?.editable ||
            isAutoNumber ||
            readOnly ||
            values?.computed ||
            itemDetails?.isDynamic
          }
          onBlur={(e) => {
            if (values?.computed) {
              setFinalValue(e?.target?.value);
              setRenderKey(v4());
            }
          }}
          onChange={(e) => handleChange(e)}
        />
      ) : (
        <NumericFormat
          key={renderKey}
          customInput={InputBase}
          defaultValue={finalValue || trackLookupVal}
          onValueChange={(e) => handleChange({ target: { value: e.value } })}
          readOnly={
            values?.editable ||
            isAutoNumber ||
            readOnly ||
            values?.computed ||
            itemDetails?.isDynamic
          }
          placeholder={values?.placeholder}
          thousandSeparator
          inputProps={{
            ...inputProps,
            style: {
              color: style?.field?.color,
              fontSize: style?.field?.fontSize,
              InputtextAlign: style?.field?.InputtextAlign,
              fontWeight: style?.field?.fontWeight || 400,
              borderStyle: "solid",
              borderWidth: 0,
              textAlign: style?.field?.textAlign,
            },
          }}
          className={`${classes?.dimensions_} ${classes?.field} `}
          style={{
            padding: "0 10px",
            background: autoBG,
          }}
        />
      )}
      {hasError("email") && (
        <p style={{ color: "red", marginTop: 5, fontSize: 10 }}>
          {formState.errors.email[0]}
        </p>
      )}
    </div>
  );
};

InputText.propTypes = {
  onChange: PropTypes.func,
  style: PropTypes.shape({
    dimensions: PropTypes.shape({
      height: PropTypes.any,
      width: PropTypes.any,
    }),
    appDesignMode: PropTypes.string,
    values: PropTypes.shape({
      label: PropTypes.any,
      labelHide: PropTypes.any,
      limitCharacter: PropTypes.any,
      max: PropTypes.any,
      min: PropTypes.any,
      name: PropTypes.any,
      placeholder: PropTypes.any,
      required: PropTypes.any,
      type: PropTypes.shape({
        toLowerCase: PropTypes.func,
      }),
    }),
  }),
};

InputText.defaultProps = {
  onChange: () => {},
};
export default InputText;
