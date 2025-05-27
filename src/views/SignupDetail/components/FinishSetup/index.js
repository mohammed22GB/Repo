import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import validate from "validate.js";
import { makeStyles } from "@material-ui/styles";
import { Button, Grid, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { unprotectedUrls } from "../../../common/utils/lists";

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
    checked: true,
  },
};

const useStyles = makeStyles((theme) => ({
  form: {
    paddingTop: "18%",
    position: "relative",
    left: "10%",
    [theme?.breakpoints?.down("xs")]: {
      left: "0",
    },
  },

  mail: {
    paddingBottom: theme?.spacing(3),
    paddingLeft: theme?.spacing(8),
  },

  finishsetup: {
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    lineHeight: "132.24%",
    color: "#091540",
  },

  title: {
    paddingBottom: theme?.spacing(3),
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: 29,
    color: "#212F77",
    lineHeight: "32px",
    textAlign: "center",
  },

  confirmmail: {
    paddingBottom: theme?.spacing(3),
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: 12,
    lineHeight: "130%",
    color: "#464D72",
    textAlign: "center",
  },

  finish: {
    backgroundColor: "#2457C1",
    color: "#fff",
    borderRadius: "10px",
    padding: theme?.spacing(1, 7),
    textTransform: "none",
  },
}));

const FinishSetup = (props) => {
  const history = useHistory();

  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
  });

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState((formState) => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {},
    }));
  }, [formState.values]);

  const handleSignup = (event) => {
    history.push(unprotectedUrls.LOGIN);

    event.preventDefault();
  };

  return (
    <Grid container justifyContent="center">
      <form className={classes.form}>
        <img
          alt="mail"
          className={classes.mail}
          src="/images/newplug/signed_up.png"
        />
        <Typography className={classes.title}>
          Thank you for signing up
        </Typography>
        <Typography className={classes.confirmmail} gutterBottom>
          Your email has been confirmed and account activated
        </Typography>
        <Button
          className={classes.finish}
          onClick={handleSignup}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
        >
          Complete
        </Button>
        <div
          style={{
            position: "absolute",
            top: 596,
            width: 410,
          }}
        ></div>
      </form>
    </Grid>
  );
};

FinishSetup.propTypes = {
  history: PropTypes.object,
};

export default FinishSetup;
