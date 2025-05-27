import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Divider, Typography, Button } from "@material-ui/core";
import MyWindowsDimensions from "../../../../../utils/windowsDimension";

const useStyles = makeStyles((theme) => ({
  container: {
    overflow: "hidden",
    height: "100%",
    "&:hover": {
      overflow: "overlay",
    },
  },
  sideHeading: {
    color: "#091540",
    fontWeight: 600,
    fontSize: 13,
    paddingLeft: 10,
  },
  subTitle: {
    color: "#999999",
    fontWeight: 375,
    fontSize: 12,
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 15,
  },
  subColor: {
    color: "#999999",
    fontWeight: 375,
    fontSize: 10,
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 15,
  },
  subTitle2: {
    color: "#999999",
    fontWeight: 375,
    fontSize: 12,
    paddingLeft: 10,
    paddingRight: 15,
  },
  user: {
    display: "flex",
    alignItems: "center",
    paddingLeft: 10,
  },
  bgcolor: {
    display: "flex",
  },
  userName: {
    color: "#091540",
    fontWeight: 375,
    fontSize: 12,
    paddingLeft: 10,
  },
  divider: {
    marginTop: 15,
    marginBottom: 15,
  },
  status: {
    background: "#808080",
    borderRadius: 4,
    color: "white",
    fontSize: 10,
    padding: "2px 20px",
    marginLeft: 10,
    display: "inline-flex",
    textTransform: "capitalize",
  },
  subHeading: {
    color: "#091540",
    fontWeight: 375,
    fontSize: 12,
    paddingLeft: 10,
  },
  subContent: {
    color: "#091540",
    fontWeight: 375,
    fontSize: 12,
    paddingLeft: 10,
    paddingBottom: 33,
  },
  subInfo: {
    color: "#999999",
    fontWeight: 375,
    fontSize: 12,
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 15,
    paddingTop: "0px !important",
  },
  userChanges: {
    fontStyle: "italic",
    paddingTop: 8,
    paddingLeft: 10,
  },
  section: {
    marginBottom: 100,
  },
}));

export default function InfoSidebar(props) {
  const classes = useStyles();
  const [windowDimensions, setWindowDimensions] = useState({});

  return (
    <div className={classes.container}>
      <MyWindowsDimensions setWinDim={setWindowDimensions} />
      <Typography gutterBottom className={classes.sideHeading}>
        App Information Bar
      </Typography>
      <Divider style={{ marginBottom: 15 }} />
      <Typography gutterBottom className={classes.subTitle}>
        Owner
      </Typography>
      <div className={classes.user}>
        <Avatar alt="Remy Sharp" src="/broken-image.jpg" />
        <Typography className={classes.userName}>{""}</Typography>
      </div>
      <Divider className={classes.divider} />
      <Typography gutterBottom className={classes.subTitle}>
        Status
      </Typography>
      <Button className={classes.status}>Draft</Button>
      <Divider className={classes.divider} />
      <Typography gutterBottom className={classes.subTitle}>
        Status
      </Typography>
      <Typography gutterBottom className={classes.subTitle2}>
        Created on
      </Typography>
      {/* <Typography gutterBottom className={classes.subContent}>
        {""}
      </Typography> */}
      <Typography gutterBottom className={classes.subTitle2}>
        Last Change Made
      </Typography>
      {/* <Typography gutterBottom className={classes.subHeading}>
        {workspace_update_date === "" || workspace_update_date === null
          ? ""
          : workspace_update_date}{" "}
        {" April 5, 2020 | 3:28pm"}
        {workspace_update_time === "" || workspace_update_time === null
          ? ""
          : workspace_update_time}
      </Typography> */}
      <Typography
        gutterBottom
        className={`${classes.subInfo} ${classes.userChanges}`}
      >
        Ayobami
      </Typography>
      <Divider className={classes.divider} />
      <Typography gutterBottom className={classes.subTitle}>
        Header Properties
      </Typography>
      <div className={classes.bgcolor}>
        <Typography gutterBottom className={classes.subColor}>
          Background Color
        </Typography>
      </div>
    </div>
  );
}
