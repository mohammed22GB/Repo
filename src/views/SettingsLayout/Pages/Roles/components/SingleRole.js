import React, { useState } from "react";
import { Button, Typography, Grid, Box } from "@material-ui/core";
import { Link } from "react-router-dom";
import AccountCircleIconOutlined from "@material-ui/icons/AccountCircleOutlined";
import DeleteOutlined from "@material-ui/icons/DeleteOutlined";
import useStyles from "./style";

const SingleRole = ({ item, handleOpenModal }) => {
  const classes = useStyles();

  return (
    <Grid item xl={4} xs={4} sm={4} style={{ display: "flex" }}>
      <Box className={classes.moredetails} boxShadow={3}>
        <div
          style={{
            display: "flex",
            padding: "5px 20px",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            //  border: "2px solid red",
            borderBottom: "0.5px solid rgba(238, 237, 242, 0.92)",
          }}
        >
          <Typography className={classes.heading5}>{item.name}</Typography>
          <div>
            <AccountCircleIconOutlined className={classes.accounticon} />
            {/* <DeleteOutlined
              className={classes.accounticon}
              style={{ marginLeft: 10 }}
            /> */}
          </div>
        </div>
        <Box
          style={{
            padding: "10px 20px",
            height: 60,
            //overflow: "overlay",
            paddingBottom: 30,
          }}
        >
          <Typography style={{ color: "#999999", fontSize: 12 }}>
            {item.description}
          </Typography>
        </Box>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            borderTop: "solid 0.3px #f8f8f8",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
          onClick={handleOpenModal}
        >
          {/* <Typography style={{color: "#999999", fontSize: 12, textAlign: "center", padding: "10px 0"}}>View Permissions</Typography>  */}
          <Typography className={classes.linkText}>View permissions</Typography>
        </div>
      </Box>
    </Grid>
  );
};

export default SingleRole;
