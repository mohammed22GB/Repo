import { useState, useEffect } from "react";
import { FormGroup, makeStyles, Typography } from "@material-ui/core";
import { v4 } from "uuid";
import Required from "../Required";

import { convertCheckboxValues } from "../../../../../../common/helpers/helperFunctions";
import CheckboxContents from "./components/CheckboxContents";

const CheckBox = ({
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
  const [selections, setSelections] = useState(val || []);
  const [renderKey, setRenderKey] = useState(v4());
  const [trackLookupVal, setTrackLookupVal] = useState([]);
  const dynamicContentObj = dynamicData?.[screenId];

  useEffect(() => {
    if (returnedLookupObj?.[props?.id]) {
      setTrackLookupVal([...trackLookupVal, returnedLookupObj?.[props?.id]]);

      const sels_ = returnCheckboxOptions(
        selections,
        returnedLookupObj?.[props?.id]
      );

      setSelections([...sels_]);
      onChange([...sels_], props.id);

      setRenderKey(v4());
    }
  }, [returnedLookupObj, props?.id]);

  useEffect(() => {
    if (val) {
      onChange(convertCheckboxValues(val, "string"), props.id);
    }
  }, [val]);

  const returnCheckboxOptions = (select_, value) => {
    const select = convertCheckboxValues(select_, "array");

    if (select?.includes(value)) {
      select?.splice(select?.indexOf(value), 1);
    } else {
      select?.push(value);
    }
    return select;
  };
  const _onChange = (e) => {
    // THIS APPROACH ASSUMES THAT ALL CHECK OPTIONS HAVE UNIQUE VALUES/TEXTS
    const value = e.target.value;
    const sels_ = returnCheckboxOptions(selections, value);

    setSelections([...sels_]);
    onChange(convertCheckboxValues([...sels_], "string"), props.id);
    // const uniqueID = e.target.value;
    // const val = e.target.checked;
  };

  const checkboxStyle = makeStyles((theme) => style);
  const classes = checkboxStyle();
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
        {CheckboxContents(
          {
            selections,
            values,
            name,
            appDesignMode,
            disabled,
            readOnly,
            renderKey,
            reuseValue: convertCheckboxValues(val, "array"),
            _onChange,
            screenId,
            props,
          },
          dynamicContentObj,
          trackLookupVal
        )}
      </FormGroup>
    </div>
  );
};

export default CheckBox;
