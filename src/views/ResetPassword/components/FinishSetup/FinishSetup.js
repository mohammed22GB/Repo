import React, { useState, useEffect } from "react";
import { Link as RouterLink, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import validate from "validate.js";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Link, Typography } from "@material-ui/core";
import { useStep } from "react-hooks-helper";

import FinishSetupConfirm from "./components/FinishSetupConfirm";
import FinishSetupHome from "./components/FinishSetupHome";
import { unprotectedUrls } from "../../../common/utils/lists";

const schema = {
  password: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 128,
    },
  },
  confirmpassword: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 128,
    },
  },
};

const useStyles = makeStyles((theme) => {
  return {
    root: {
      backgroundColor: "#F9FAFF",
      height: "100%",
    },
    quote: {
      backgroundColor: theme?.palette.neutral,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundImage: "url(/images/auth.jpg)",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
    },
    quoteInner: {
      textAlign: "center",
      flexBasis: "600px",
    },
    quoteText: {
      color: theme?.palette.white,
      fontWeight: 300,
    },
    name: {
      marginTop: theme?.spacing(3),
      color: theme?.palette.white,
    },
    bio: {
      color: theme?.palette.white,
    },
    content: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
    },
    contentHeader: {
      display: "flex",
      alignItems: "center",
      paddingTop: theme?.spacing(5),
      paddingBototm: theme?.spacing(2),
      paddingLeft: theme?.spacing(2),
      paddingRight: theme?.spacing(2),
    },
    logoImage: {
      marginLeft: theme?.spacing(4),
    },
    contentBody: {
      flexGrow: 1,
      display: "flex",
      alignItems: "center",
      [theme?.breakpoints?.down("md")]: {
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url(/images/auth.jpg)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      },
    },
    trouble: {
      position: "absolute",
      width: 155,
      height: 24,
      left: "88%",
      top: 36,

      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 350,
      fontSize: 14,
      lineHeight: "169.3%",

      display: "flex",
      alignItems: "center",
      color: "#999999",
    },

    form: {
      paddingLeft: 100,
      paddingRight: 100,
      paddingBottom: 125,
      flexBasis: 700,
      [theme?.breakpoints?.down("sm")]: {
        paddingLeft: theme?.spacing(2),
        paddingRight: theme?.spacing(2),
      },
    },
    title: {
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 500,
      fontSize: 24,
      lineHeight: "130%",
      color: "#091540",
      top: 113,
      position: "absolute",
      width: 205,
      height: 32,
    },
    textField: {
      marginTop: theme?.spacing(2),
    },
    signUpButton: {
      margin: theme?.spacing(2, 0),
      position: "absolute",
      width: 410,
      height: 55,
      top: 502,
    },
    logo: {
      position: "absolute",
      width: 137.32,
      height: 33,
      left: 75,
      top: 48,
    },
    mac: {
      position: "absolute",
      width: 321,
      height: 256.11,
      left: 75,
      top: 207,
    },
    innovateone: {
      position: "absolute",
      width: 422,
      height: 74,
      left: 75,
      top: 510,
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 500,
      fontSize: 32,
      display: "flex",
      alignItems: "center",

      color: "#091540",
    },
    innovatetwoone: {
      position: "absolute",
      width: 360,
      height: 74,
      left: 75,
      top: 545,
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 500,
      fontSize: 32,
      display: "flex",
      alignItems: "center",

      color: "#091540",
    },
    innovatetwotwo: {
      position: "absolute",
      width: 360,
      height: 74,
      left: 155,
      top: 545,
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 500,
      fontSize: 32,
      display: "flex",
      alignItems: "center",

      color: "#2F7C94",
    },
  };
});

const steps = [{ id: "home" }, { id: "confirm" }];

const FinishSetup = (props) => {
  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
  });

  const { step, navigation } = useStep({ initialStep: 0, steps });
  const { id } = step;

  props = { formState, setFormState, navigation };

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState((formState) => {
      return {
        ...formState,
        isValid: errors ? false : true,
        errors: errors || {},
      };
    });
  }, [formState.values]);
  const renderSwitch = (id) => {
    switch (id) {
      case "home":
        return <FinishSetupHome {...props} />;
      case "confirm":
        return <FinishSetupConfirm {...props} />;
      default:
        return null;
    }
  };

  return (
    <div className={classes.root}>
      <Grid className={classes.grid} container>
        <img
          alt="Logo"
          // className={classes.logo}
          src="/images/logo.svg"
        />
        <Grid className={classes.content} item lg={7} xs={12}>
          <div className={classes.content}>
            <div className={classes.contentHeader}></div>
            <div className={classes.contentBody}>
              <Typography
                className={classes.trouble}
                color="textSecondary"
                variant="body1"
              >
                <span>Having trouble?</span>{" "}
                <Link
                  component={RouterLink}
                  to={unprotectedUrls.LOGIN}
                  style={{ color: "#091540" }}
                >
                  Get help
                </Link>
              </Typography>
              <div className={classes.switch}>{renderSwitch(id)}</div>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

FinishSetup.propTypes = {
  history: PropTypes.object,
};

export default withRouter(FinishSetup);
