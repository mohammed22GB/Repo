import { MenuItem, Select, makeStyles } from "@material-ui/core";
import { inputTypesLists } from "./util/utils";

const InputTypesDropDown = ({
  classes,
  showInputTypeComponent,
  top,
  right,
  submitAction,
  name,
  value,
}) => {
  const selfClasses = useStyles();
  return (
    <Select
      variant="outlined"
      size="small"
      // fullWidth
      placeholder="Data Type"
      style={{
        display: showInputTypeComponent
          ? "flex"
          : showInputTypeComponent === undefined
          ? "flex"
          : "none",
        top: top,
        right: right,
      }}
      classes={{
        root: selfClasses.inlineSelectInside,
        outlined: classes.selected,
      }}
      name={name ?? ""}
      defaultValue={value}
      className={`${classes.inlineSelect2} ${selfClasses.selectThinOut}`}
      onChange={submitAction}
    >
      {inputTypesLists.map(([val, name], idx) => (
        <MenuItem value={val} selected key={idx}>
          {name}
        </MenuItem>
      ))}
    </Select>
  );
};

const useStyles = makeStyles((theme) => ({
  selectThinOut: {
    marginLeft: 3,
    "& .MuiSelect-icon": {
      display: "none",
    },
  },
  selectThin: {
    color: "#091540",
    fontSize: 10,
    width: 25,
    textAlign: "center",
    padding: "0px !important",
  },
  inlineSelectInside: {
    color: "#091540",
    padding: "0px !important",
    fontSize: 10,
  },
}));
export default InputTypesDropDown;
