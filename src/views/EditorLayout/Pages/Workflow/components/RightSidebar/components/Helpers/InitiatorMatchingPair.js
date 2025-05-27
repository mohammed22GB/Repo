import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Select,
  MenuItem,
  Collapse,
  IconButton,
  InputAdornment,
  TextField,
} from "@material-ui/core";
import { CancelRounded } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  sectionTitle: {
    color: "#999",
    fontSize: 12,
    marginBottom: 5,
  },
  select: {
    color: "#091540",
    fontSize: 12,
    padding: 10,
  },
  sectionEntry: {
    marginBottom: 13,
  },
  matchingFields: {
    borderRadius: 5,
    border: "dashed 1.5px #999",
    padding: "10px 5px 10px 10px",
    backgroundColor: "#f8f8f8",
  },
  pair: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    "& > div": {
      flex: 1,
      marginRight: 5,
      "&:last-child": {
        marginRight: 0,
        flex: "none",
      },
    },
  },
  disabled: {
    color: "#999",
  },
}));

const InitiatorMatchingPair = ({
  map,
  setInitiatorPairs,
  pairsList,
  removePair,
  setCanAdd,
  variables,
}) => {
  const classes = useStyles();
  const [input, setInput] = useState("choose");
  const [field, setField] = useState("choose");
  const [subSelectFormFields, setSubSelectFormFields] = useState(variables);

  useEffect(() => {
    const pair = map.value;
    setInput(Object.keys(pair)[0] || "choose");
    setField(pair[Object.keys(pair)[0]] || "choose");
  }, []);

  useEffect(() => {
    const vars = variables.filter(
      (v) => v?.info?.group.toLowerCase() !== "initiator"
    );

    setSubSelectFormFields(vars);
    _setInput(input, vars, "x");
  }, [input, variables]);

  const _setInput = (val, vars, check) => {
    const list = [...vars];
    !check && setField("choose");
    switch (val) {
      case "initiator_name":
        setSubSelectFormFields(
          list.filter(
            (item) =>
              !!item?.info?.dataType &&
              (item?.info?.dataType.includes("name") ||
                item?.info?.dataType.includes("text") ||
                item?.info?.dataType.includes("value"))
          )
        );
        break;

      case "initiator_email":
        // alert('email')
        setSubSelectFormFields(
          list.filter(
            (item) =>
              !!item?.info?.dataType && item?.info?.dataType.includes("email")
          )
        );
        break;

      case "initiator_employeeId":
        setSubSelectFormFields(
          list.filter(
            (item) =>
              !!item?.info?.dataType &&
              (item?.info?.dataType.includes("employeeId") ||
                item?.info?.dataType.includes("text") ||
                item?.info?.dataType.includes("value"))
          )
        );
        break;

      default:
        break;
    }
  };

  const _setMatchingPair = (val) => {
    if (!input) return;

    setField(val);
    setInitiatorPairs(map.index, { [input]: val });
    setCanAdd(true);
  };

  const _isAlreadySelected = (id) => {
    const pL = [...pairsList];
    const found = pL.find((pair) => !!pair[id]);
    return !!found && found[id] !== input;
  };

  return (
    <div className={classes.pair}>
      <Select
        variant="outlined"
        size="small"
        fullWidth
        classes={{
          root: classes.select,
          disabled: classes.disabled,
        }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      >
        <MenuItem value="choose" selected disabled>
          <em>Select detail</em>
        </MenuItem>
        <MenuItem value="initiator_name">Initiator name</MenuItem>
        <MenuItem value="initiator_email">Initiator email</MenuItem>
        <MenuItem value="initiator_employeeId">Initiator employee Id</MenuItem>
        <MenuItem value="initiator_lineManager">
          Initiator line manager
        </MenuItem>
        <MenuItem value="initiator_designation">Initiator designation</MenuItem>
      </Select>

      <Select
        variant="outlined"
        size="small"
        fullWidth
        classes={{ root: classes.select, disabled: classes.disabled }}
        disabled={input === "choose"}
        value={field}
        onChange={(e) => _setMatchingPair(e.target.value)}
      >
        <MenuItem value="choose" key="key-col-0" selected disabled>
          <em>
            {subSelectFormFields.length
              ? "Select form input"
              : "No form fields"}
          </em>
        </MenuItem>
        {subSelectFormFields.map(
          (fld) =>
            !!fld?.info?.name && (
              <MenuItem
                key={`${fld.type}-${fld.id}`}
                value={`${fld.id}`}
                disabled={_isAlreadySelected(fld.id)}
              >
                {fld?.info?.name}
              </MenuItem>
            )
        )}
      </Select>

      <div className={classes.addComponent}>
        <IconButton
          size="small"
          onClick={() =>
            removePair(map.index)
          } /* disabled={ initiatorPairs?.length === 1 } */
        >
          <CancelRounded style={{ fontSize: 16 }} />
        </IconButton>
      </div>
    </div>
  );
};

export default InitiatorMatchingPair;
