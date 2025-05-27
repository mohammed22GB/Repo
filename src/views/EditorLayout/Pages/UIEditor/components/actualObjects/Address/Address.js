import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  FormControl,
  InputBase,
  Select,
  Typography,
  TextField,
} from "@material-ui/core";
import { APP_DESIGN_MODES } from "../../../../../../common/utils/constants";

const Address = ({ style, values, ...props }) => {
  const useStyles = makeStyles((theme) => style?.main);

  const SelectInput = withStyles((theme) => style?.selectInput)(InputBase);

  const usePlaceholderStyles = makeStyles((theme) => style?.placeholder);

  const Placeholder = ({ children }) => {
    const classes = usePlaceholderStyles();
    return <div className={classes?.placeholder}>{children}</div>;
  };
  const classes = useStyles();
  const [stateSelect, setStateSelect] = React.useState("");

  const handleStateSelect = (event) => {
    setStateSelect(event.target.value);
  };

  return (
    <div style={{ ...style?.dimensions, width: style?.field?.width }}>
      {!values?.labelHide && (
        <Typography gutterBottom className={classes?.label}>
          {values?.label}
        </Typography>
      )}
      {props?.data?.map((value) => (
        <>
          {value.name === "street" && (
            <TextField
              disabled={props.appDesignMode === APP_DESIGN_MODES.EDIT}
              className={classes?.formTextField}
              name="street"
              size="small"
              fullWidth
              placeholder={value?.placeholder}
              type="text"
              variant="outlined"
              inputMode="text"
              multiline
              rows={4}
            />
          )}
          {value.name === "country" && (
            <FormControl className={classes?.margin} fullWidth>
              <Select
                labelId="demo-customized-select-label"
                id="demo-customized-select"
                // value={stateSelect}
                // onChange={handleChange}
                input={<SelectInput />}
                disabled={props.appDesignMode === APP_DESIGN_MODES.EDIT}
                className={classes?.formTextField}
                displayEmpty
                renderValue={
                  stateSelect !== ""
                    ? undefined
                    : () => <Placeholder>{value?.placeholder}</Placeholder>
                }
              ></Select>
            </FormControl>
          )}
          {value.name === "state" && (
            <FormControl className={classes?.margin} fullWidth>
              <Select
                labelId="demo-customized-select-label"
                id="demo-customized-select"
                // value={stateSelect}
                onChange={handleStateSelect}
                input={<SelectInput />}
                disabled={props.appDesignMode === APP_DESIGN_MODES.EDIT}
                className={classes?.formTextField}
                displayEmpty
                renderValue={
                  stateSelect !== ""
                    ? undefined
                    : () => <Placeholder>{value?.placeholder}</Placeholder>
                }
              ></Select>
            </FormControl>
          )}
          {value.name === "region" && (
            <TextField
              disabled={props.appDesignMode === APP_DESIGN_MODES.EDIT}
              className={classes?.formTextField}
              name="region"
              size="small"
              fullWidth
              placeholder={value?.placeholder}
              type="text"
              inputMode="text"
              variant="outlined"
            />
          )}

          {value.name === "area" && (
            <TextField
              disabled={props.appDesignMode === APP_DESIGN_MODES.EDIT}
              className={classes?.formTextField}
              name="area"
              size="small"
              fullWidth
              placeholder={value?.placeholder}
              type="text"
              inputMode="text"
              variant="outlined"
            />
          )}

          {value.name === "zip_code" && (
            <TextField
              disabled={props.appDesignMode === APP_DESIGN_MODES.EDIT}
              className={classes?.formTextField}
              name="zip_code"
              size="small"
              fullWidth
              placeholder={value?.placeholder}
              type="text"
              inputMode="text"
              variant="outlined"
            />
          )}

          {value.name === "poBox" && (
            <TextField
              disabled={props.appDesignMode === APP_DESIGN_MODES.EDIT}
              className={classes?.formTextField}
              name="poBox"
              size="small"
              fullWidth
              placeholder={value?.placeholder}
              type="text"
              inputMode="text"
              variant="outlined"
            />
          )}
        </>
      ))}
    </div>
  );
};

export default Address;
