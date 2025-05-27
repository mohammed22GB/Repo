import { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import validate from "validate.js";
import { makeStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import { useStep } from "react-hooks-helper";
import { useStyles } from "../common/components/outerPagesStyle";
import HeroImage from "../common/components/AuthLayout/HeroImage";
import InputEmail from "./components/InputEmail/InputEmail";
import CheckEmail from "./components/CheckEmail/CheckEmail";

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

const steps = [
  { id: "input" },
  { id: "check" },
  { id: "reset" },
  { id: "finish" },
];

const ForgotPassword = (props) => {
  const classes = useStyles(makeStyles);

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
    document.title = "Plug | Forgot Password";
  }, []);

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
      case "input":
        return <InputEmail {...props} />;
      case "check":
        return <CheckEmail {...props} />;
      default:
        return null;
    }
  };

  return (
    <div className={classes.root}>
      <HeroImage />

      <div className={classes.pageGrid}>
        <form>
          <Paper elevation={0} className={classes.pageForm}>
            {renderSwitch(id)}
          </Paper>
        </form>
      </div>
    </div>
  );
};

ForgotPassword.propTypes = {
  history: PropTypes.object,
};

export default withRouter(ForgotPassword);
