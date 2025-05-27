import { useState, useEffect } from "react";
import { FormGroup, makeStyles, Typography } from "@material-ui/core";
import { v4 } from "uuid";
import Required from "../Required";
import RadioContent from "./components/RadioContents";

const RadioButton = ({
  style,
  values,
  onChange,
  name,
  dynamicData,
  screenId,
  appDesignMode,
  disabled,
  returnedLookupObj,
  readOnly,
  val,
  ...props
}) => {
  const [selection, setSelection] = useState(val || "");
  const [renderKey, setRenderKey] = useState(v4());
  const [trackLookupVal, setTrackLookupVal] = useState([]);
  const dynamicContentObj = dynamicData?.[screenId];

  useEffect(() => {
    if (returnedLookupObj?.[props?.id]) {
      setTrackLookupVal([...trackLookupVal, returnedLookupObj?.[props?.id]]);
      setSelection(returnedLookupObj?.[props?.id]);
      onChange(returnedLookupObj?.[props?.id], props.id);
      setRenderKey(v4());
    }
  }, [returnedLookupObj, props?.id]);

  useEffect(() => {
    if (val) {
      setSelection(val);
      onChange(val, props.id);
    }
  }, [val]);

  const _onChange = (e) => {
    const value = e.target.value;
    setSelection(value);
    onChange(value, props.id);
  };

  const radioStyle = makeStyles((theme) => style);
  const classes = radioStyle();

  return (
    <div
      className={classes?.container}
      style={{
        width:
          values.optionsArrangement === "horizontal"
            ? "unset"
            : style?.field?.width,
      }}
    >
      {!values?.labelHide && (
        <Typography gutterBottom className={classes?.label}>
          {values?.label}
          <Required required={values?.required} />
        </Typography>
      )}
      <FormGroup
        key={renderKey}
        className={`${readOnly ? "read-only" : ""}`}
        style={{
          flexDirection:
            values.optionsArrangement === "horizontal" ? "row" : "column",
        }}
      >
        {RadioContent(
          {
            selection,
            values,
            name,
            appDesignMode,
            disabled,
            readOnly,
            renderKey,
            reuseValue: val,
            _onChange,
            props,
          },
          dynamicContentObj,
          trackLookupVal
        )}
      </FormGroup>
    </div>
  );
};

export default RadioButton;
