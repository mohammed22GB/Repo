import {
    Button,
    Checkbox,
    Grid,
    Link,
    Paper,
    TextField,
    Typography,
} from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link as RouterLink, withRouter } from "react-router-dom";
import validate from "validate.js";

import hide from "../../assets/images/hide.png";
import show from "../../assets/images/show.png";
import SignupAlert from "../common/components/Alert/SignupAlert";
import IntroGetHelp from "../common/components/IntroGetHelp/IntroGetHelp";
import CircularIndeterminate from "../common/components/ProgressLoader/ProgressLoader";

import SSOLoginButton from "../Login/components/SSOLogin/SSOLoginButton";
import HeroImage from "../common/components/AuthLayout/HeroImage";
import Divider from "../common/components/Divider/Divider";
import { verifyRecaptcha } from "../common/components/Mutation/Registration/registrationMutation";
import NewPasswordValidator from "../common/components/NewPasswordValidator";
import { useStyles } from "../common/components/outerPagesStyle";
import { logoutClearLocalStorage } from "../common/helpers/helperFunctions";
import useCustomMutation from "../common/utils/CustomMutation";
import { unprotectedUrls } from "../common/utils/lists";
import Recapture from "./Recapture";
import GoogleSignup from "./components/GoogleSignup";
import SignupMicrosoft from "./components/MicrosoftSignup";

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

const Signup = (props) => {
  const { history } = props;
  const classes = useStyles(makeStyles);

  const [formState, setFormState] = useState({
    isValid: true,
    values: { subscribe: false },
    touched: {},
    errors: {},
  });
  const [passwordShown, setPasswordShown] = useState(false);
  const [checkBoxClick, setCheckBoxClick] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailExist, setEmailExist] = useState(false);
  const [notCompleted, setNotCompleted] = useState(true);
  const [failedPasswordValidate, setFailedPasswordValidate] = useState(false);

  useEffect(() => {
    document.title = "Plug | Signup";
  }, []);

  const {
    auth: { captchaToken },
  } = useSelector((state) => state);
  const togglePasswordVisibility = () => {
    setPasswordShown(passwordShown ? false : true);
  };
  const handleCheckboxChange = (event) => {
    setCheckBoxClick(event.target.checked);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  /**
   * If the captcha is verified, save the user's email and password to session storage and redirect to
   * the next page.
   * @param data - {
   * @returns The data object is being returned.
   */
  const onVerifyCaptcha = (data) => {
    if (!data?.data?.data?.success) return;

    const signupDetail = {
      email: formState?.values?.email,
      password: formState?.values?.password,
    };

    //  hang onto user details and proceed to signup-details
    sessionStorage.setItem("user_user", JSON.stringify(signupDetail));
    history.push(unprotectedUrls.SIGNUP_DETAIL);
  };

  /* Using the useCustomMutation hook to call the verifyRecaptcha function. */
  const { mutate: verifyCaptchaMutate } = useCustomMutation({
    apiFunc: verifyRecaptcha,
    onSuccess: onVerifyCaptcha,
    retries: 0,
  });

  useEffect(() => {
    logoutClearLocalStorage(history, false);
  }, []);

  useEffect(() => {
    const errors = validate(formState?.values, schema);

    /* Setting the formState to the errors object. */
    setFormState((formState) => ({
      ...formState,
      // isValid: errors ? false : true,
      errors: errors || {},
    }));
  }, [formState.values]);

  /**
   * It takes an event and a boolean as parameters, persists the event, sets the form state, and if the
   * boolean is true, it calls the onPasswordValueChange function.
   * @param event - the event object
   * @param p - is a boolean value that is passed to the function to determine if the input is a
   * password input.
   */
  const handleChange = (event, p) => {
    event.persist();

    /* Updating the formState.values and formState.touched. */
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
    // clear the "email does not exist" error when when inputing new email address
    setEmailExist(false);

    /* Checking if it's password change. If it isn't, it will not run the function. */
    // if (!!p) onPasswordValueChange(event.target.value);
  };

  /**
   * When the user clicks the button, redirect them to the SSO login page.
   * @param e - the event object
   */
  const handleSSOSignIn = (e) => {
    e.preventDefault();
    window.location.replace(`${process.env.REACT_APP_ENDPOINT}/auth/sso_login`);
  };

  /**
   * The function is called when the user clicks the submit button. It prevents the default action of
   * the submit button, and then calls the verifyCaptchaMutate function.
   * @param event - The event object that is passed to the function.
   */
  const handleSignup = async (event) => {
    event.preventDefault();
    try {
      // onClick of Get started, check if the user-email has already been registered
      const resp = await axios.get(
        `${
          process.env.REACT_APP_ENDPOINT
        }/users/exists?email=${encodeURIComponent(formState.values.email)}`
      );
      const data = resp.data;
      const isValid = data.data?.isValid;
      setEmailExist(!isValid);
      // if user has not been registered push to signup Detail
      if (isValid === true) {
        verifyCaptchaMutate({ response: captchaToken });
      }
    } catch (err) {
      // Handle Error Here
    }
  };

  /**
   * This function is called when the user leaves the password field and checks notCompleted
   */
  const checkPassword = () => {
    setFailedPasswordValidate(notCompleted && formState.touched.password);
  };

  /**
   * If the field has been touched and there is an error, return true, otherwise return false.
   * @param field - The name of the field that you want to check for errors.
   */
  const hasError = (field) =>
    formState.touched[field] && formState.errors[field] ? true : false;

  /* const hasError = (field) =>
    formState.touched[field] &&
    (formState.errors[field] || (field === "password" && notCompleted))
      ? true
      : false; */

  return (
    <div className={classes.root}>
      <HeroImage />
      <div className={classes.pageGrid}>
        <Paper elevation={0} className={classes.pageForm}>
          <Grid item container justifyContent="flex-end">
            <IntroGetHelp />
          </Grid>

          <form
            // className={classes.form}
            title="formBox"
            onSubmit={handleSignup}
          >
            <Typography className={classes.title}>Welcome to Plug</Typography>
            {open ? (
              <SignupAlert
                close={handleClose}
                message={message}
                open={open}
                // severity={severity}
              />
            ) : (
              <Typography className={classes.subtitle} gutterBottom>
                Just a few clicks to creating your first app.
              </Typography>
            )}
            <Typography className={classes.formLabels} gutterBottom>
              Email address
            </Typography>
            <TextField
              className={classes.formTextField}
              name="email"
              size="small"
              error={hasError("email") || emailExist === true}
              fullWidth
              color="secondary"
              helperText={
                hasError("email") ? (
                  <span>
                    <span className={classes.caution}>!</span> Invalid email
                    address! Try using your work email
                  </span>
                ) : emailExist === true ? (
                  <span
                    style={{
                      color: "#464D72",
                      fontWeight: 500,
                    }}
                  >
                    Email address already exists! Proceed to{" "}
                    <Link
                      className={classes.linkText}
                      component={RouterLink}
                      to="login"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Login
                    </Link>
                  </span>
                ) : null
              }
              FormHelperTextProps={{
                className: classes.helperText,
              }}
              placeholder="Enter your email address"
              onChange={handleChange}
              type="email"
              inputMode="email"
              value={formState.values.email || ""}
              variant="outlined"
              autoComplete="off"
              inputProps={{
                className: classes.inputField,
                autoComplete: "new-password",
                form: {
                  autoComplete: "off",
                },
              }}
              InputProps={{
                className: classes.notched,
              }}
            />

            <Typography className={classes.formLabels} gutterBottom>
              Password
            </Typography>
            <TextField
              className={classes.formTextField}
              size="small"
              color="secondary"
              // error={hasError("password") || notCompleted}
              fullWidth
              error={hasError("password") || failedPasswordValidate}
              helperText={
                notCompleted && formState.touched.password ? (
                  <span>
                    <span className={classes.caution}>!</span> Your password has
                    not met the required criteria
                  </span>
                ) : null
              }
              placeholder="Enter password here"
              name="password"
              onChange={(e) => handleChange(e, "pwrd")}
              onBlur={checkPassword}
              type={passwordShown ? "text" : "password"}
              value={formState.values.password || ""}
              variant="outlined"
              autoComplete="off"
              FormHelperTextProps={{
                className: classes.helperText,
              }}
              inputProps={{
                className: classes.inputField,
              }}
              InputProps={{
                className: classes.notched,
                endAdornment: (
                  <InputAdornment position="end">
                    <i
                      onClick={togglePasswordVisibility}
                      className={classes.eye}
                    >
                      <img src={passwordShown ? show : hide} alt="Visibility" />
                    </i>
                  </InputAdornment>
                ),
              }}
            />
            {/* {formState.touched.password && notCompleted && ( */}
            <NewPasswordValidator
              formState={formState}
              notCompleted={notCompleted}
              setNotCompleted={setNotCompleted}
              setFailedPasswordValidate={setFailedPasswordValidate}
            />
            {/* )} */}

            <Divider style={{ marginTop: 20 }}>
              <span
                style={{
                  background: "#fff",
                  padding: "0 10px",
                  color: "#464D72",
                }}
              >
                OR
              </span>
            </Divider>
            {loading ? <CircularIndeterminate /> : null}

            <Grid container className={classes.loginPanel}>
              <GoogleSignup
                btnMessage={"Sign up with Google"}
                classes={classes}
              />
              <SignupMicrosoft
                btnMessage={"Sign up with Microsoft"}
                classes={classes}
              />
              <SSOLoginButton classes={classes} />
            </Grid>

            {/* <Grid container className={classes.loginPanelNew}>
              <Grid item className={classes.loginPanelTop}>
                <GoogleSignup btnMessage={"Sign up with Google"} />
                <SSOLoginButton />
              </Grid>

              <SignupMicrosoft btnMessage={"Sign up with Microsoft"} />
            </Grid> */}

            <div></div>

            <Grid
              item
              className={classes.checkMain}
              style={{
                marginTop: "10px",
              }}
            >
              <Checkbox
                inputProps={{
                  "aria-label": "uncontrolled-checkbox",
                  "data-testid": "terms-checkbox",
                }}
                classes={{
                  root: classes.checkedBox,
                }}
                checked={checkBoxClick}
                onChange={handleCheckboxChange}
              />
              <Typography className={classes.checkText}>
                Accept{" "}
                <span className={classes.Terms}>
                  <a
                    href="https://www.plugonline.io/terms-of-use"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: "inherit",
                    }}
                  >
                    Terms and Conditions
                  </a>
                </span>
              </Typography>
            </Grid>
            <Grid
              item
              className={classes.checkMain}
              style={{
                marginTop: "-10px",
              }}
            >
              <Checkbox
                inputProps={{ "aria-label": "uncontrolled-checkbox" }}
                classes={{
                  root: classes.checkedBox,
                }}
              />
              <Typography className={classes.checkText}>
                Yes, I would love to receive emails with great content and
                updates. <br className={classes.breakText} />
                <a
                  href="https://www.plugonline.io/privacy-policy"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "inherit",
                  }}
                >
                  Your privacy
                </a>{" "}
                (optional).
              </Typography>
            </Grid>

            {/* Re-writingb the accept terms and conditions */}

            <Recapture />
            <Button
              disabled={hasError("email") || notCompleted || !checkBoxClick}
              classes={{
                root: classes.pageButton,
                disabled: classes.disabled,
              }}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              Get started!
            </Button>

            <Divider style={{ marginTop: -20, marginBottom: 20 }}>
              <span className={classes.hac}>
                Have an account?{" "}
                <Link
                  className={classes.linkText}
                  component={RouterLink}
                  to="login"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Login
                </Link>
              </span>
            </Divider>
          </form>
        </Paper>
      </div>
    </div>
  );
};

Signup.propTypes = {
  history: PropTypes.object,
};

export default withRouter(Signup);

