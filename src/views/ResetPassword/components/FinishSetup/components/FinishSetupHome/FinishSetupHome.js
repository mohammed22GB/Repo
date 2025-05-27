import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import validate from "validate.js";
import { makeStyles } from "@material-ui/core";
import { Button, TextField, Typography } from "@material-ui/core";

import { successToastify } from "../../../../../common/utils/Toastify";
import useCustomMutation from "../../../../../common/utils/CustomMutation";
import { ResetPassword } from "../../../../../common/components/Mutation/Registration/registrationMutation";
import NewPasswordValidator from "../../../../../common/components/NewPasswordValidator";
import MessageSnackbar from "../../../../../common/components/Snackbar/MessageSnackbar";

const schema = {
  password: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 64,
    },
  },
  confirmpassword: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 64,
    },
  },
};

const useStyles = makeStyles((theme) => ({
  form: {},

  title: {
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: 24,
    color: "#091540",
    paddingBottom: "18px",
  },

  formLabels: {
    paddingTop: theme?.spacing(2),
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 12,
    lineHeight: "132.24%",
    display: "flex",
    color: "#091540",
  },

  formTextField: {
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: 12,
    lineHeight: 16,
    display: "flex",
    color: "#091540",
    borderRadius: "8px",
    borderWidth: "1px",
  },

  notched: {
    fontFamily: "Inter",
    borderWidth: "1px",
    borderRadius: "8px",
    background: "#F9FAFE",
    "&:hover": {
      //border: "1px solid #D2DEFF",
      borderColor: "#1866DB",
    },
    "&.Mui-focused": {
      "&.MuiOutlinedInput-notchedOutline": {
        border: "2px solid #1866DB",
      },
    },
  },
  inputField: {
    height: "1.8rem",
  },

  helperText: {
    margin: "5px 0 0 0",
    fontFamily: "GT Eesti Pro Test",
  },

  resetButton: {
    fontFamily: "Inter",
    fontStyle: "normal",
    margin: theme?.spacing(3, 0),
    backgroundColor: "#010A43",
    color: "#fff",
    textTransform: "none",

    "&$disabled": {
      background: "#E7E9EE",
      color: "#fff",
    },
  },
  disabled: {},
}));

const FinishSetupHome = ({ navigation, hash, email }) => {
  const classes = useStyles();
  const [failedPasswordValidate, setFailedPasswordValidate] = useState(false);
  const [notCompleted, setNotCompleted] = useState(true);

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
  });

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    const errors = validate(formState.values, schema);
    setFormState((formState) => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {},
    }));
  }, [formState.values, hash, setFormState]);

  const { next } = navigation;

  const onSuccess = ({ data }) => {
    successToastify(data?._meta?.message);
    next();
  };

  const { mutate: resetPasswordMutate } = useCustomMutation({
    apiFunc: ResetPassword,
    onSuccess,
    retries: 0,
  });

  const handleUpdate = (event) => {
    const newPassword = formState?.values?.password;
    const passwordResetCode = formState?.values?.passwordResetCode;

    event.preventDefault();
    resetPasswordMutate({
      password: newPassword,
      hash,
      email,
      passwordResetCode,
      redirectUrl: `${process.env.REACT_APP_BASE_URL}/change-password`,
    });
  };

  const handleChange = (event) => {
    event.persist();

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

  const isInvalid =
    formState.values.password !== formState.values.confirmpassword ||
    formState.values.password === "" ||
    notCompleted;

  const hasError = (field) =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const checkPassword = () => {
    //console.log("checkpassword");
    setFailedPasswordValidate(notCompleted && formState.touched.password);
  };

  return (
    <form className={classes.form}>
      <Typography className={classes.title}>Reset your password</Typography>

      <Typography className={classes.subtitle} gutterBottom>
        Fill the form below to reset your password
      </Typography>
      <Typography className={classes.formLabels} gutterBottom>
        Enter password
      </Typography>
      <TextField
        className={classes.formTextField}
        name="password"
        size="small"
        fullWidth
        error={hasError("password") || failedPasswordValidate}
        helperText={
          notCompleted && formState.touched.password
            ? "Your password has not met the required criteria"
            : null
        }
        placeholder="Enter Password here"
        onChange={handleChange}
        onBlur={checkPassword}
        type="password"
        value={formState.values.password || ""}
        variant="outlined"
        InputProps={{
          className: classes.notched,
        }}
        inputProps={{
          className: classes.inputField,
        }}
        color="secondary"
        FormHelperTextProps={{
          className: classes.helperText,
        }}
      />
      <NewPasswordValidator
        formState={formState}
        notCompleted={notCompleted}
        setNotCompleted={setNotCompleted}
        setFailedPasswordValidate={setFailedPasswordValidate}
      />
      <Typography className={classes.formLabels} gutterBottom>
        Confirm password
      </Typography>
      <TextField
        className={classes.formTextField}
        name="confirmpassword"
        size="small"
        error={hasError("confirmpassword")}
        fullWidth
        helperText={
          hasError("confirmpassword")
            ? formState.errors.confirmpassword[0]
            : null
        }
        placeholder="Confirm Password here"
        onChange={handleChange}
        type="password"
        value={formState.values.confirmpassword || ""}
        variant="outlined"
        InputProps={{
          className: classes.notched,
        }}
        inputProps={{
          className: classes.inputField,
        }}
        color="secondary"
        FormHelperTextProps={{
          className: classes.helperText,
        }}
      />
      <Typography className={classes.formLabels} gutterBottom>
        Enter reset code
      </Typography>
      <TextField
        className={classes.formTextField}
        name="passwordResetCode"
        size="small"
        error={hasError("resetcode")}
        fullWidth
        helperText={
          hasError("resetcode") ? formState.errors.passwordResetCode[0] : null
        }
        placeholder="Enter Reset Code"
        onChange={handleChange}
        type="number"
        value={formState.values.passwordResetCode || ""}
        variant="outlined"
        InputProps={{
          className: classes.notched,
        }}
        inputProps={{
          className: classes.inputField,
        }}
        color="secondary"
        FormHelperTextProps={{
          className: classes.helperText,
        }}
      />
      <Button
        className={classes.resetButton}
        onClick={handleUpdate}
        disabled={isInvalid}
        classes={{
          root: classes.LoginButton,
          disabled: classes.disabled,
        }}
        fullWidth
        size="large"
        type="submit"
        variant="contained"
      >
        Reset Password
      </Button>
      <div
        style={{
          position: "absolute",
          top: 596,
          width: 410,
        }}
      ></div>
      <div>
        <MessageSnackbar
          close={handleClose}
          message={message}
          open={open}
          severity={severity}
        />
      </div>
    </form>
  );
};

FinishSetupHome.propTypes = {
  history: PropTypes.object,
};

export default FinishSetupHome;
