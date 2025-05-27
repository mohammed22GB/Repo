import React, { useRef } from "react";
import {
  Button,
  ListItem,
  ListItemText,
  Checkbox,
  Typography,
  OutlinedInput,
  Input,
  IconButton,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import MoreVert from "@material-ui/icons/MoreVert";
import useStyles from "./style";
import { StatusBgColor } from "../../../utils/getStatusBackgroundColor";

export default function Tiler({ items }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const _loop = () => {
    return items.map((item, index) => {
      if (index < 3) {
        return (
          <div key={index} className={classes.inner}>
            {item?.name || item}
          </div>
        );
      } else if (index === 3) {
        if (items.length > 4) {
          return (
            <div key={index} className={classes.innerLast}>
              +{items.length - 3} more
            </div>
          );
        } else {
          return (
            <div key={index} className={classes.inner}>
              {item?.name}
            </div>
          );
        }
      } else {
        return null;
      }
    });
  };

  return (
    <div className={classes.outer}>
      {_loop()}
      {!items?.length ? "--" : ""}
    </div>
  );
}
