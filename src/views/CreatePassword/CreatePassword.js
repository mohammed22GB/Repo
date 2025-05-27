import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import validate from "validate.js";
import { makeStyles } from "@material-ui/styles";
import { Button, TextField, Typography, Paper } from "@material-ui/core";

import { useStyles } from "../common/components/outerPagesStyle";
import { receiveLogin } from "../../store/actions";
import { successToastify } from "../common/utils/Toastify";
import { mainNavigationUrls } from "../common/utils/lists";
import useCustomMutation from "../common/utils/CustomMutation";
import { createPassword } from "../common/components/Mutation/Registration/registrationMutation";
import HeroImage from "../common/components/AuthLayout/HeroImage";
import NewPasswordValidator from "../common/components/NewPasswordValidator";

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

const CreatePasswordHome = () => {
  const dispatch = useDispatch();
  const classes = useStyles(makeStyles);

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
  });

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [token, setToken] = useState(null);
  const [notCompleted, setNotCompleted] = useState(true);
  const [failedPasswordValidate, setFailedPasswordValidate] = useState(false);
  const [, setEmail] = useState("");
  const [, setValidCode] = useState("");
  const [, setVerifiedCode] = useState("");
  const history = useHistory();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    if (!!params?.email && !!params?.token) {
      // alert(params.token)
      setToken(params.token);
    }
  }, []);

  useEffect(() => {
    const errors = validate(formState.values, schema);
    setFormState((formState) => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {},
    }));
  }, [formState.values, setFormState]);

  const onSuccess = ({ data }) => {
    const uid = data?.data?.id; //console.log(`userrrrr >> ${uid}`);
    const tkn = data?._meta?.accessToken; //console.log(`userrrrr >> ${tkn}`);
    localStorage.setItem("userId", uid);
    localStorage.setItem("accessToken", tkn);
    // dispatch(requestLogin());
    dispatch(receiveLogin(data?.data));
    localStorage.setItem("userInfo", JSON.stringify(data?.data));
    // sessionStorage.setItem("accessToken", tkn);

    successToastify(data?.data?._meta?.message);
    history.push(mainNavigationUrls.APPS);
  };

  const { mutate: createPasswordMutate } = useCustomMutation({
    apiFunc: createPassword,
    onSuccess,
    retries: 0,
  });

  const handleUpdate = (event) => {
    event.preventDefault();
    const password = formState?.values?.password;
    const confirmPassword = formState?.values?.confirmpassword;
    createPasswordMutate({
      password,
      password_confirmation: confirmPassword,
      token,
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
    !formState.values.password ||
    !formState.values.confirmpassword ||
    formState.values.password !== formState.values.confirmpassword;

  const hasError = (field) =>
    formState.touched[field] && formState.errors[field] ? true : false;

  return (
    <div className={classes.root}>
      <HeroImage />

      <div className={classes.pageGrid}>
        <form>
          <Paper elevation={0} className={classes.pageForm}>
            <Typography className={classes.title}>Create Password</Typography>
            <Typography className={classes.subtitle} gutterBottom>
              Fill the form below to create your password
            </Typography>

            <Typography className={classes.formLabels} gutterBottom>
              Enter password
            </Typography>
            <TextField
              className={classes.formTextField}
              name="password"
              size="small"
              error={hasError("password") || failedPasswordValidate}
              fullWidth
              helperText={
                notCompleted && formState.touched.password
                  ? "Your password has not met the required criteria"
                  : null
              }
              placeholder="Enter password here"
              onChange={handleChange}
              type="password"
              value={formState.values.password || ""}
              variant="outlined"
              FormHelperTextProps={{
                className: classes.helperText,
              }}
              InputProps={{
                className: classes.notched,
              }}
              inputProps={{
                className: classes.inputField,
              }}
              color="secondary"
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
              placeholder="Confirm password here"
              onChange={handleChange}
              type="password"
              value={formState.values.confirmpassword || ""}
              variant="outlined"
              FormHelperTextProps={{
                className: classes.helperText,
              }}
              InputProps={{
                className: classes.notched,
              }}
              inputProps={{
                className: classes.inputField,
              }}
              color="secondary"
            />

            <Button
              classes={{
                root: classes.pageButton,
                disabled: classes.disabled,
              }}
              onClick={handleUpdate}
              disabled={isInvalid}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              Create password
            </Button>
          </Paper>
        </form>
      </div>
    </div>
  );
};

CreatePasswordHome.propTypes = {
  history: PropTypes.object,
};

export default CreatePasswordHome;
