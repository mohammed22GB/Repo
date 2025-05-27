import { useState, useEffect } from "react";
import { withRouter, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import validate from "validate.js";
import { makeStyles } from "@material-ui/core";
import { Grid, Paper } from "@material-ui/core";
import { useStep } from "react-hooks-helper";

import Reset from "./components/FinishSetup/components/FinishSetupHome";
import ResetConfirm from "./components/FinishSetup/components/FinishSetupConfirm";
import HeroImage from "../common/components/AuthLayout/HeroImage";
import IntroGetHelp from "../common/components/IntroGetHelp/IntroGetHelp";

const schema = {
  firstName: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 128,
    },
  },
  lastName: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 128,
    },
  },
  mobile: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 20,
    },
  },
  businessRole: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 128,
    },
  },
  orgName: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 128,
    },
  },
  employees: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 20,
    },
  },
  country: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 128,
    },
  },
  industry: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 128,
    },
  },
  updateUser: {
    presence: { allowEmpty: true },
  },
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    minHeight: "100%",
  },

  hideItemXS: {
    [theme?.breakpoints?.down("xs")]: {
      display: "none",
    },
  },

  hideItemSM: {
    [theme?.breakpoints?.down("sm")]: {
      display: "none",
    },
  },

  hideElement: {
    dislay: "none",
  },

  actionGrid: {
    display: "flex",
    flexDirection: "column",
    width: "50%",
    margin: "auto",
    [theme?.breakpoints?.down("sm")]: {
      position: "relative",
      right: "30px",
      marginTop: "26px",
      marginBottom: "26px",
      boxShadow:
        "0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)",
    },
    [theme?.breakpoints?.down("xs")]: {
      width: "90%",
      position: "relative",
      marginTop: 120,
      marginBottom: "auto",
    },
  },

  actionForm: {
    width: "72%",
    marginLeft: "80px",
    [theme?.breakpoints?.down("sm")]: {
      width: "88%",
      margin: "auto",
      marginTop: "25px",
    },
  },
}));

const steps = [{ id: "reset" }, { id: "finish" }];

const ResetPassword = (props) => {
  // const hash = props?.hash;
  // const email = props?.email;
  const location = useLocation();

  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
  });

  useEffect(() => {
    document.title = "Plug | Reset Password";
  }, []);

  const { step, navigation } = useStep({ initialStep: 0, steps });
  const { id } = step;

  const parsed = location?.search;
  const hash = new URLSearchParams(parsed).get("hash");
  const email = new URLSearchParams(parsed)
    ?.get("email")
    ?.trim()
    ?.replace(" ", "+"); //  URLSearchParams replaces '+' with ' '
  props = { formState, setFormState, navigation, email, hash };

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState((formState) => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {},
    }));
  }, [formState.values]);

  const renderSwitch = (id) => {
    switch (id) {
      case "reset":
        return <Reset {...props} />;
      case "finish":
        return <ResetConfirm {...props} />;
      default:
        return null;
    }
  };

  return (
    <div className={classes.root}>
      <HeroImage />

      <div className={classes.actionGrid}>
        <Grid item container justifyContent="flex-end">
          <IntroGetHelp />
        </Grid>
        <Paper elevation={0} className={classes.actionForm}>
          {renderSwitch(id)}
        </Paper>
      </div>
    </div>
  );
};

ResetPassword.propTypes = {
  history: PropTypes.object,
};

export default withRouter(ResetPassword);
