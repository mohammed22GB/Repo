import React, { useEffect, useState } from "react";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";

import InputBase from "@material-ui/core/InputBase";

const BootstrapInput = withStyles((theme) => ({
  input: {
    color: "#091540",
    borderRadius: 3,
    position: "relative",
    border: "1px solid #ABB3BF",
    fontSize: 8,
    // padding: "5px 12px",
    transition: theme?.transitions.create(["border-color", "box-shadow"]),
  },
}))(InputBase);

const styles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  formControl: {
    // margin: theme?.spacing.unit,
    minWidth: 100,
    // maxWidth: 300
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: theme?.spacing.unit / 4,
  },
  noLabel: {
    marginTop: theme?.spacing.unit * 3,
  },
  chipRoot: {
    fontSize: 9,
    borderRadius: 3,
    margin: theme?.spacing.unit / 4,
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, theme, nameState) {
  if (!Array.isArray(nameState)) return {};
  return {
    fontWeight: !nameState?.indexOf(name)
      ? theme.typography.fontWeightRegular
      : theme?.typography.fontWeightMedium,
  };
}

export default function MultipleSelect(props) {
  const [name, setName] = useState([]);
  const theme = useTheme();

  const classes = styles();

  useEffect(() => {
    //console.log(props.items);
    setName(() => props?.data?.map((value) => value));
  }, []);

  useEffect(() => {
    //console.log(props);
    //console.log(name);
  }, [name]);

  const handleChange = (event) => {
    //console.log(event.target.value);
    //console.log(this.state?.name);
    props.handleChange(event.target.value);
    if (Array.isArray(name)) setName(event?.target?.value);
  };

  const handleDelete = (e) => {
    if (Array.isArray(name))
      setName(() => name?.filter((value) => value !== e));
    props.handleDelete(e);
  };
  const onMouseDown = (e) => {
    e.stopPropagation();
  };

  return (
    <div className={classes.root}>
      <FormControl className={classes.formControl}>
        <Select
          fullWidth
          multiple
          value={Array.isArray(name) ? name : []}
          onChange={handleChange}
          input={<BootstrapInput id="select-multiple-chip" />}
          renderValue={(selected) =>
            selected?.length && (
              <div className={classes.chips}>
                {selected?.length &&
                  selected?.map((value) => (
                    <Chip
                      size="small"
                      key={value}
                      label={value}
                      classes={{ root: classes.chipRoot }}
                      clickable
                      onMouseDown={onMouseDown}
                      onDelete={() => handleDelete(value)}
                    />
                  ))}
              </div>
            )
          }
          MenuProps={MenuProps}
        >
          {props.items.map((nameObj) => (
            <MenuItem
              key={nameObj.name}
              value={nameObj.value}
              style={getStyles(nameObj.name, theme, name)}
            >
              {nameObj.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

//export default withStyles(styles, { withTheme: true })(MultipleSelect);
