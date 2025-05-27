import Parser from "html-react-parser";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";

import { Grid, IconButton, makeStyles, Typography } from "@material-ui/core";
import { useQueryClient } from "react-query";
import { v4 } from "uuid";

import { socket } from "../../App.js";

const useStyles = makeStyles(() => ({
  menuItem: {
    width: "100%",
    height: "10vh",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    "&:hover": {
      backgroundColor: "#fff",
      cursor: "pointer",
    },
  },
  icon: {
    width: "37px",
    height: "37px",
  },
  text: {
    fontFamily: "GT Eesti Pro Text",
    width: "80%",
    // width: "316px",
    height: "41px",
    fontWeight: 500,
    fontStyle: "normal",
    fontSize: "16px",
    // backgroundColor: "blue",
  },
}));

const CustomListNotification = ({
  fromDialog,
  type,
  read,
  id,
  history,
  title,
}) => {
  const classes = useStyles();
  const queryClient = useQueryClient();

  const handleItemsClick = () => {
    const payload = {
      id: v4(),
      action: "notification:read",
      data: {
        _id: id,
      },
    };

    /* The user has read the notification, so we need to update the database to reflect that. */
    socket.emit("message", payload, async () => {
      await queryClient.invalidateQueries(["listInapp"]);
    });

    // check if fromDialog exists and route to the appropriate path
    fromDialog
      ? history.push(`/notifications?id=${id}`)
      : history.replace(`/notifications?id=${id}`);
  };

  return (
    <Grid
      container
      item
      className={classes.menuItem}
      style={{
        backgroundColor: !read ? "rgba(228, 235, 253, 0.33)" : "#fff",
      }}
      onClick={(e) => handleItemsClick(e)}
    >
      <IconButton className={classes.icon}>
        {<NotificationsNoneIcon />}
      </IconButton>
      <Typography className={classes.text}>{Parser(title)}</Typography>
    </Grid>
  );
};

export default CustomListNotification;
