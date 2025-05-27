import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import queryString from "query-string";

import { Button, Typography } from "@material-ui/core";
import axios from "axios";
import { unprotectedUrls } from "../common/utils/lists";
import { CustomAxios } from "../common/utils/CustomAxios";

const schema = {
  email: {
    presence: { allowEmpty: false, message: "is required" },
    email: true,
    length: {
      maximum: 64,
    },
  },
  password: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 128,
    },
  },
  policy: {
    presence: { allowEmpty: false, message: "is required" },
    checked: true,
  },
  subscribe: {
    presence: { allowEmpty: true },
    checked: false,
  },
};

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    backgroundImage: `url(../../../../../../images/welcome_image_up.svg), url(../../../../../../images/welcome_image_down.svg)`,
    backgroundRepeat: "no-repeat, no-repeat",
    backgroundPosition: "right top, left bottom",
    display: "flex",
    flexDirection: "column",
  },
  main_part: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    [theme?.breakpoints?.up("sm")]: {
      display: "flex",
      flexDirection: "row-reverse",
      margin: "auto",
      textAlign: "center",
      width: "100%",
      alignItems: "center",
    },
  },
  info_part: {
    textAlign: "center",
    padding: "5%",
    [theme?.breakpoints?.up("sm")]: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      textAlign: "left",
    },
  },
  side_image: {
    textAlign: "center",
    flex: "unset",
    [theme?.breakpoints?.up("sm")]: {
      flex: 1,
    },
  },
  login_btn: {
    fontSize: 12,
    backgroundColor: "#010A43",
    color: "#fff",
    textTransform: "none",
    borderRadius: 3,
    width: 130,
    height: 40,
  },
}));

const Welcome = (props) => {
  const { history, location } = props;
  const queryParams = queryString.parse(location.search);

  const classes = useStyles();

  useEffect(() => {
    document.title = "Plug | Welcome";
  }, []);

  useEffect(() => {
    const source = axios.CancelToken.source();
    const email = queryParams?.email?.trim().replace(" ", "+"); //  URLSearchParams replaces '+' with ' '

    const verifyUser = async () => {
      await CustomAxios()
        ?.put(
          `${process.env.REACT_APP_ENDPOINT}/auth/verify-email`,
          {
            email,
            emailVerificationCode: queryParams?.code,
          },
          {
            headers: {
              Authorization: `Bearer ${queryParams && queryParams?.token}`,
            },
            cancelToken: source?.token,
          }
        )
        .then((res) => {
          console.log("res :>> ", res);
        });
    };
    verifyUser();

    return () => {
      source?.cancel();
    };
  }, []);

  return (
    <div className={classes.root}>
      <div style={{ position: "absolute", margin: "20px 5%" }}>
        <img
          src="../../../../../images/plug_logo.svg"
          alt="Plug logo"
          width={70}
        />
      </div>
      <div className={classes.main_part}>
        <div className={classes.side_image}>
          <img
            style={{ marginTop: "1rem", width: "50%" }}
            src="../../../../../images/welcome_pg_img.svg"
            alt=""
            // width={300}
          />
        </div>
        <div className={classes.info_part}>
          <div>
            <Typography
              style={{
                fontSize: 26,
                lineHeight: "30.8px",
                marginBottom: 16,
                marginTop: 30,
              }}
            >
              Activation successful!
            </Typography>
          </div>
          <div>
            <Typography
              style={{
                fontSize: 12,
                lineHeight: "21.6px",
                marginBottom: 16,
              }}
            >
              Your email is activated. Click the button below to go to the login
              page.
            </Typography>
          </div>
          <Button
            className={classes.login_btn}
            onClick={() => {
              window.location.href = unprotectedUrls.LOGIN;
            }}
            variant="contained"
          >
            Go to Login
          </Button>
        </div>
      </div>
    </div>
  );
};

Welcome.propTypes = {
  history: PropTypes.object,
};

export default withRouter(Welcome);
