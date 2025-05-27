import { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  InputBase,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import Required from "../Required";
import { APP_DESIGN_MODES } from "../../../../../../common/utils/constants";

export default function Currency({ style, values, ...props }) {
  const [currencies, setCurrencies] = useState([]);
  const SelectInput = withStyles((theme) => style?.selectInput)(InputBase);

  const useStyles = makeStyles((theme) => style);
  const classes = useStyles();

  useEffect(() => {
    const newCurrencies = [];
    props.data.forEach((value, key) =>
      newCurrencies.push({
        name: value.name,
        sign: (
          <Typography style={{ display: "flex", fontSize: 10 }}>
            {value.name}
          </Typography>
        ),
      })
    );
    setCurrencies(newCurrencies);
  }, [props.data]);

  const displayValue = () => {
    if (style?.appDesignMode === APP_DESIGN_MODES.LIVE) return props?.val;
    if (style?.appDesignMode === APP_DESIGN_MODES.PREVIEW) return values?.value;
  };
  return (
    <div
      className={`${classes?.root} ${classes?.dimensions}`}
      style={{ width: style?.field?.width }}
    >
      {!values?.labelHide && (
        <Typography gutterBottom className={classes?.label}>
          {values?.label}
          <Required required={values?.required} />
        </Typography>
      )}
      <div style={{ display: "inline-flex" }}>
        <Select
          value={currencies?.[0]?.name}
          disabled={
            props.appDesignMode === APP_DESIGN_MODES.EDIT || props.disabled
          }
          input={<SelectInput />}
          onChange={(e) => props.onChange(e.target.value, props.id)}
        >
          {currencies.map((currency) => (
            <MenuItem value={currency.name}>{currency.sign}</MenuItem>
          ))}
        </Select>
        <TextField
          name={values?.name}
          value={displayValue()}
          className={classes?.field}
          disabled={
            props.appDesignMode === APP_DESIGN_MODES.EDIT || props.disabled
          }
          placeholder={values?.placeholder}
          inputProps={{
            className: classes?.input,
          }}
          size="small"
          style={{
            borderRadius: 0,
          }}
          variant="outlined"
          inputMode="text"
          onChange={(e) => props.onChange(e.target.value, props.id)}
        />
      </div>
      {values?.showTooltip && (
        <Typography className={classes?.toolTip}>{values?.toolTip}</Typography>
      )}
    </div>
  );
}
