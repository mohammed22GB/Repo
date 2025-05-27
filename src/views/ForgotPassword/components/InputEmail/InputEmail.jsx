import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import validate from "validate.js";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import { Button, TextField, Typography } from "@material-ui/core";
import { emailSchema } from "./emailSchema";
import { useStyles } from "../../../common/components/outerPagesStyle";
import useCustomMutation from "../../../common/utils/CustomMutation";
import { forgotPassword } from "../../../common/components/Mutation/Registration/registrationMutation";
import { unprotectedUrls } from "../../../common/utils/lists";

const InputEmail = ({ navigation }) => {
  const classes = useStyles(makeStyles);
  const history = useHistory();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
  });

  useEffect(() => {
    const errors = validate(formState.values, emailSchema);

    setFormState((formState) => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {},
    }));
  }, [formState.values, setFormState]);

  const next = navigation?.next;

  const handleChange = (event) => {
    event?.persist();

    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === "checkbox"
            ? event.target.checked
            : event.target.value,
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true,
      },
    }));
  };

  const onForgotPasswordSuccess = ({ data }) => {
    localStorage.setItem("resendmail", data?.data?.email);
    setFormState({ ...formState });
    next();
  };

  const { mutate: forgotPasswordMutate } = useCustomMutation({
    apiFunc: forgotPassword,
    onSuccess: onForgotPasswordSuccess,
    retries: 0,
  });

  const handleSendPasswordReset = (event) => {
    event.preventDefault();
    forgotPasswordMutate({
      email: formState?.values?.email,
      redirectUrl: `${process.env.REACT_APP_BASE_URL}/reset-password`,
    });
  };

  const hasError = (field) =>
    formState.touched[field] && formState.errors[field] ? true : false;

  return (
    <>
      <Typography className={classes.title}>
        Forgot Password
        {/* <span role="img" aria-label="sad">
          😥
        </span> */}
      </Typography>

      <Typography className={classes.subtitle} gutterBottom>
        Enter the email address associated with your account
      </Typography>
      <Typography className={classes.formLabels} gutterBottom>
        Email address
      </Typography>
      <TextField
        className={classes.formTextField}
        name="email"
        size="small"
        error={hasError("email")}
        fullWidth
        helperText={hasError("email") ? formState.errors.email[0] : null}
        placeholder="Enter your email address"
        onChange={handleChange}
        type="text"
        value={formState.values.email || ""}
        variant="outlined"
        FormHelperTextProps={{
          className: classes.helperText,
        }}
        InputProps={{
          className: classes.notched,
        }}
        inputProps={{
          className: classes.inputField,
          "data-testid": "email-input",
        }}
        color="secondary"
      />
      <Button
        classes={{
          root: classes.pageButton,
          disabled: classes.disabled,
        }}
        onClick={handleSendPasswordReset}
        disabled={!formState.isValid}
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        data-testid="reset-password-button"
      >
        Reset Password
      </Button>

      <div style={{ textAlign: "center" }}>
        <Button
          variant="text"
          color="primary"
          style={{
            textTransform: "none",
            marginBottom: 30,
            width: 106,
            fontSize: 12,
          }}
          onClick={() => history.push(unprotectedUrls.LOGIN)}
          data-testid="go-to-login"
        >
          Go to Login
        </Button>
      </div>
    </>
  );
};

InputEmail.propTypes = {
  history: PropTypes.object,
};

export default InputEmail;
