import { FormControl, MenuItem, Select, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  disabledInput: {
    "&:disabled": {
      color: "darkgray",
    },
  },
}));
const CustomDropDown = ({
  label,
  data,
  name,
  selectedValue,
  duplicateValue,
  ...others
}) => {
  const classes = useStyles();
  /* Removing duplicate values from the array. */
  let removeDuplicate = [...new Set(selectedValue)] || [];

  // /* Filtering out the duplicate values from the array. */
  let removeSpecifiedValue =
    removeDuplicate.length > 0
      ? removeDuplicate.filter((val) => val !== duplicateValue)
      : [];

  return (
    <FormControl
      className={classes.formControl}
      variant="outlined"
      size="small"
      fullWidth
    >
      <Select
        disabled={others.disabled}
        size="small"
        multiple={others.multiple}
        name={name}
        fullWidth
        placeholder={`Enter name here`}
        variant="outlined"
        classes={{
          root: classes.selectPadding,
        }}
        {...others}
      >
        {data.map(([value, name], i) => (
          <MenuItem value={value}>{name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
export default CustomDropDown;
{
  /* <TextField
      disabled={others.disabled}
      fullWidth
      type="text"
      SelectProps={
        others.multiple
          ? { native: true, multiple: true, value: others.value }
          : { native: true }
      }
      select
      variant="outlined"
      {...others}
    >
      {data.length > 0 &&
        data.map(([value, name], i) => (
          <option
            key={i}
            className={classes.disabledInput}
            value={value}
            disabled={removeSpecifiedValue.includes(value) || !value}
          >
            {name}
          </option>
        ))}
    </TextField> */
}
