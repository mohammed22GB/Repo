import React, { useEffect, useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import PhoneInput from "react-phone-input-2";
import { startsWith } from "lodash";

import Required from "../Required";
import { APP_DESIGN_MODES } from "../../../../../../common/utils/constants";
import { v4 } from "uuid";

const PhoneNumber = ({
  style,
  onChange,
  values,
  returnedLookupObj,
  readOnly,
  ...props
}) => {
  const useStyles = makeStyles((theme) => ({
    ...style,
    dimensions: {
      ...style?.dimensions,
      [theme?.breakpoints?.down("sm")]: {
        width: "100%",
      },
    },
    selectPadding: {
      padding: "0 24px 0 0",
    },
  }));
  const classes = useStyles();
  const autoSubmitValueRef = useRef(false);

  const [renderKey, setRenderKey] = useState(v4());
  const [trackLookupVal, setTrackLookupVal] = useState(null);

  useEffect(() => {
    if (returnedLookupObj?.[props?.id]) {
      setTrackLookupVal(returnedLookupObj?.[props?.id]);
      preOnChange(returnedLookupObj?.[props?.id], props?.id);
      setRenderKey(v4());
    }
    if (props.val) {
      setTrackLookupVal(props.val);
      preOnChange(props.val, props?.id);
    }
  }, [returnedLookupObj, props?.id]);

  const preOnChange = (val, id) => {
    val = val?.trim();
    if (val) {
      val = val.startsWith("+") ? val : `+${val}`;
    }
    onChange(val, id);
  };

  const displayValue = () => {
    if (props?.appDesignMode === APP_DESIGN_MODES.LIVE) {
      if (!autoSubmitValueRef.current) {
        handleChange(props?.val);
        autoSubmitValueRef.current = true;
      }
      return props?.val;
    }
    if (props?.appDesignMode === APP_DESIGN_MODES.PREVIEW) return values?.value;
  };

  const handleChange = (val) => {
    if (
      props?.uieCanvasMode === APP_DESIGN_MODES.EDIT ||
      props?.uieCanvasMode === APP_DESIGN_MODES.PREVIEW
    ) {
      return;
    } else {
      preOnChange(val, props?.id);
    }
  };

  const nationality = [
    {
      name: "nigeria",
      sign: (
        <Typography style={{ display: "flex", fontSize: 10 }}>
          <img
            src="../../../../images/nigeria.svg"
            alt=""
            style={{ paddingRight: 8 }}
          />
          NGN
        </Typography>
      ),
    },
  ];

  return (
    <div className={classes?.root} style={{ width: style?.field?.width }}>
      {!values?.labelHide && (
        <Typography gutterBottom className={classes?.label}>
          {values?.label}
          <Required required={values?.required} />
        </Typography>
      )}
      <PhoneInput
        key={renderKey}
        country={values?.defaultCountry.toLowerCase()}
        className={values?.hideCountry ? "hide-phone-country" : ""}
        placeholder={values?.placeholder}
        disabled={readOnly}
        name="mobile"
        inputStyle={{
          width: style?.field?.width,
          height: style?.field?.height,
          color: style?.field?.color,
          backgroundColor: style?.field?.backgroundColor,
          fontSize: style?.field?.fontSize,
          textAlign: style?.field?.textAlign,
          // height: style?.field?.height,
          borderRadius: style?.field?.borderRadius,
          borderStyle: style?.field?.borderStyle || "solid",
          borderWidth: style?.field?.borderWidth,
          borderColor: style?.field?.borderColor,
        }}
        buttonStyle={{
          borderRadius: style?.field?.borderRadius,
          borderStyle: style?.field?.borderStyle || "solid",
          borderWidth: style?.field?.borderWidth,
          borderColor: style?.field?.borderColor,
        }}
        dropdownStyle={{
          borderRadius: style?.field?.borderRadius,
          borderStyle: style?.field?.borderStyle || "solid",
          borderWidth: style?.field?.borderWidth,
          borderColor: style?.field?.borderColor,
        }}
        value={displayValue() || trackLookupVal}
        onChange={
          props?.uieCanvasMode === APP_DESIGN_MODES.EDIT ||
          props?.uieCanvasMode === APP_DESIGN_MODES.PREVIEW
            ? ""
            : (val) => {
                preOnChange(val, props?.id);
              }
        }
        fullWidth
        isValid={(inputNumber, country, countries) => {
          return countries.some((country) => {
            return (
              startsWith(inputNumber, country?.dialCode) ||
              startsWith(country?.dialCode, inputNumber)
            );
          });
        }}
      />

      <Typography className={classes?.toolTip}>{values?.toolTip}</Typography>
    </div>
  );
};

export default PhoneNumber;
