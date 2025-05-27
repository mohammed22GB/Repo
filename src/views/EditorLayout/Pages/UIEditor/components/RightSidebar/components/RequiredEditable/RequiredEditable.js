import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import Switch from "../PlainToggleSwitch";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "inline-flex",
  },
  sectionLabel: {
    color: "#999",
    fontSize: 10,
    marginRight: 5,
    marginTop: 5,
  },
}));

export default function RequiredEditable(props) {
  const classes = useStyles();
  const { required, setRequired, editable, setEditable } = props

  return (
    <div>
      <div>
        <div className={classes.root}>
          <Typography gutterBottom className={classes.sectionLabel}>
            Required
          </Typography>
          <Switch
            itemType="togglehide"
            toggleHide={setRequired}
            value={required}
            checked={required} />
        </div>
      </div>

      <div>
        <div className={classes.root}>
          <Typography gutterBottom className={classes.sectionLabel}>
            Not Editable
          </Typography>
          <Switch
            itemType="togglehide"
            value={editable}
            toggleHide={setEditable}
          />
        </div>
      </div>
    </div>
  );
}
