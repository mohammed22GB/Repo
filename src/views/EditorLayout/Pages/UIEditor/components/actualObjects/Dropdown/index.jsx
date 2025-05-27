import { InputBase, MenuItem, Select, Typography } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useState, useEffect } from "react";
import Required from "../Required";
import { dropdownContent } from "../../../../../../common/utils/dynamicContentReplace";
import { v4 } from "uuid";
import { APP_DESIGN_MODES } from "../../../../../../common/utils/constants";
import { separateNumbersWithComma } from "../../../../../../common/helpers/helperFunctions";

const BootstrapInput = withStyles((theme) => ({}))(InputBase);
const Dropdown = ({
  style,
  screenId,
  name,
  values,
  onChange,
  dynamicData,
  readOnly,
  returnedLookupObj,
  appDesignMode,
  val,
  ...props
}) => {
  const dropDownStyles = makeStyles((theme) => {
    return {
      ...style,
      select: {
        fontSize: style?.field?.fontSize,
        lineHeight: 1.5,
        //border: "1.2px solid grey",
        //borderRadius: "4px",
      },
    };
  });
  const classes = dropDownStyles();
  const [value, setValue] = useState("");
  const [renderKey, setRenderKey] = useState(v4());
  const [trackLookupVal, setTrackLookupVal] = useState([]);
  const dynamicContentObj = dynamicData?.[screenId];
  const returnedLookupObjValue = dynamicContentObj?.[props?.id];

  useEffect(() => {
    if (returnedLookupObj?.[props?.id]) {
      setTrackLookupVal([...trackLookupVal, returnedLookupObj?.[props?.id]]);

      onChange(returnedLookupObj?.[props?.id], props?.id);
      setValue(returnedLookupObj?.[props?.id]);
      setRenderKey(v4());
    }
  }, [returnedLookupObj, props?.id]);

  useEffect(() => {
    if (val) {
      setValue(val);
      onChange(val, props?.id);
    }
  }, [val]);

  const _onChange = (e) => {
    const val = e.target.value;
    setValue(val);

    if (
      props?.uieCanvasMode === APP_DESIGN_MODES.EDIT ||
      props?.uieCanvasMode === APP_DESIGN_MODES.PREVIEW
    ) {
      return;
    } else {
      onChange(val, props.id);
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
      {!props?.isDocument ? (
        <Select
          key={renderKey}
          labelId="demo-customized-select-label"
          placeholder={values?.placeholder}
          // value={value || values?.selectedValue || "choose"}
          value={separateNumbersWithComma(
            value || values?.selectedValue || "choose",
            values?.isFormatted,
            props?.isDocument
          )}
          className={`${classes?.field} ${readOnly ? "read-only" : ""}`}
          // required={values?.required}
          classes={{
            select: classes?.select,
          }}
          style={{ paddingLeft: 10, color: style?.field?.color }}
          onChange={(e) => _onChange(e)}
          readOnly={readOnly}
          //disabled={props.appDesignMode === APP_DESIGN_MODES.EDIT}
          input={<BootstrapInput />}
          variant="filled"
          multiple={values?.selectType === "Multiple Select"}
        >
          {/* {!props?.data.length && <MenuItem value="">No Options</MenuItem>}
                {props?.data.map(({ value }) => <MenuItem value={value}>{value}</MenuItem>)} */}
          {!values?.options?.length &&
          !dynamicContentObj?.[name]?.length &&
          !trackLookupVal?.length ? (
            <MenuItem value="" selected role="option">
              No options
            </MenuItem>
          ) : (
            <MenuItem value="choose" selected disabled>
              Select{" "}
              {values?.selectType === "Multiple Select" ? "options" : "one"}
            </MenuItem>
          )}
          {dropdownContent(
            { values, name, appDesignMode, trackLookupVal },
            dynamicContentObj,
            props?.isDocument
          )}
        </Select>
      ) : (
        <InputBase
          key={renderKey}
          labelId="demo-customized-select-label"
          placeholder={values?.placeholder}
          value={value || values?.selectedValue || "choose"}
          className={`${classes?.field} ${readOnly ? "read-only" : ""}`}
          // required={values?.required}
          classes={{
            select: classes?.select,
          }}
          style={{ paddingLeft: 10, color: style?.field?.color }}
          onChange={(e) => _onChange(e)}
          readOnly={readOnly}
          //disabled={props.appDesignMode === APP_DESIGN_MODES.EDIT}
          input={<BootstrapInput />}
          variant="filled"
        />
      )}
    </div>
  );
};

export default Dropdown;
