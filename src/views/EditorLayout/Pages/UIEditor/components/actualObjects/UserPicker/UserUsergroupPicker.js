import { useEffect, useState } from "react";
import validate from "validate.js";
import PropTypes from "prop-types";
import { People, Person } from "@material-ui/icons";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { InputBase, Typography } from "@material-ui/core";

import Required from "../Required";
import { emptyEmailSchema } from "../../../../../../ForgotPassword/components/InputEmail/emailSchema";
import SelectOnSteroids from "../../../../Workflow/components/RightSidebar/components/sidebarActions/common/SelectOnSteroids";
import { APP_DESIGN_MODES } from "../../../../../../common/utils/constants";

const BootstrapInput = withStyles((theme) => ({}))(InputBase);

const UserPicker = ({
  style,
  onChange,
  appSequence,
  values,
  dataType,
  disabled: isDisabled,
  readOnly,
  ...props
}) => {
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
  const [sosValueState, setSosValueState] = useState([]);
  const [valueSubscribed, setValueSubscribed] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    if (props.val && !valueSubscribed) {
      onChange(props.val, props.id);
      setValueSubscribed(true);
    }
  }, [props.val]);

  const inputProps = {};
  if (values?.limitCharacter) {
    inputProps.minLength = values?.min;
    inputProps.maxLength = values?.max;
  }

  const onChange_ = (value) => {
    setSosValueState(value);
    onChange(value, props.id);
  };

  const displayValue = () => {
    if (props?.appDesignMode === APP_DESIGN_MODES.LIVE) {
      const sosValue = sosValueState.length ? sosValueState : props.val;

      return sosValue; //props?.val;
    }
    if (props?.appDesignMode === APP_DESIGN_MODES.PREVIEW) return values?.value;
  };

  useEffect(() => {
    const errors = validate(formState.values, emptyEmailSchema);

    setFormState((formState) => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {},
    }));
  }, [formState.values]);

  const getPickerContentsArray = (values) => {
    return [
      ...(values?.dataType === "both"
        ? ["users", "userGroups"]
        : values?.dataType === "users"
        ? ["users"]
        : values?.dataType === "userGroups"
        ? ["userGroups"]
        : ["users"]),
    ];
  };
  return (
    <div style={{ width: style?.field?.width }}>
      {!values?.labelHide && (
        <Typography gutterBottom className={classes?.label}>
          {values?.label}
          <Required required={values?.required && !isDisabled} />
        </Typography>
      )}
      {!props?.isDocument ? (
        <SelectOnSteroids
          name={values?.name}
          placeholderText={values?.placeholder}
          source="user"
          anchorIcon={
            getPickerContentsArray(values)?.includes("users") ? (
              <Person style={{ color: "#666" }} />
            ) : (
              <People style={{ color: "#666" }} />
            )
          }
          disabled={
            isDisabled ||
            props.appDesignMode === APP_DESIGN_MODES.EDIT ||
            readOnly
          }
          readOnly={values?.editable || readOnly}
          // required={values?.required && !isDisabled}
          contents={getPickerContentsArray(values)}
          multiple={values?.multiple === "multiple"}
          style={{
            // ...style?.field,
            color: style?.field?.color,
            fontSize: style?.field?.fontSize,
            fontWeight: style?.field?.fontWeight,
            InputtextAlign: style?.field?.InputtextAlign,
            height: "unset", //style?.field?.height,
            borderStyle: "solid",
            borderWidth: style?.field?.borderWidth || 1,
            borderColor: style?.field?.borderColor || "#091540",
            borderRadius: style?.field?.borderRadius || 0,
          }}
          onChange={(e) => onChange_(e, props.id)}
          value={displayValue()}
          type="user"
        />
      ) : (
        <InputBase
          // key={renderKey}
          labelId="demo-customized-select-label"
          placeholder={values?.placeholder}
          value={displayValue()}
          className={`${classes?.field} ${readOnly ? "read-only" : ""}`}
          // required={values?.required}
          classes={{
            select: classes?.select,
          }}
          style={{ paddingLeft: 10, color: style?.field?.color }}
          readOnly={readOnly}
          //disabled={props.appDesignMode === APP_DESIGN_MODES.EDIT}
          input={<BootstrapInput />}
          variant="filled"
        />
      )}
    </div>
  );
};

UserPicker.propTypes = {
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

UserPicker.defaultProps = {
  onChange: () => {},
};
export default UserPicker;
