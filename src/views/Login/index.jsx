import { useState, useEffect } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import validate from "validate.js";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  Paper,
  Grid,
  Button,
  TextField,
  Link,
  Typography,
  FormControlLabel,
} from "@material-ui/core";
import Switch from "@material-ui/core/Switch";
import InputAdornment from "@material-ui/core/InputAdornment";

import { useStyles } from "../common/components/outerPagesStyle";
import hide from "../../assets/images/hide.png";
import show from "../../assets/images/show.png";
import { base64ToJson } from "../common/helpers/helperFunctions";
import { finalizeLogin, loginUser } from "../../store/actions";
import { errorToastify } from "../common/utils/Toastify";
import {
  mainNavigationUrls,
  portalNavigationUrls,
  unprotectedUrls,
} from "../common/utils/lists";
import SignupAlert from "../common/components/Alert/SignupAlert";
import HeroImage from "../common/components/AuthLayout/HeroImage";
import Divider from "../common/components/Divider/Divider";
import CircularIndeterminate from "../common/components/ProgressLoader/ProgressLoader";
import GoogleLogin from "./components/GoogleLogin/GoogleLogin";
import LoginMicrosoft from "./components/MicrosoftLogin/MicrosoftLogin";
import SSOLoginButton from "./components/SSOLogin/SSOLoginButton";

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
  remember: {
    presence: { allowEmpty: true },
    checked: false,
  },
};

const Login = (props) => {
  const Remember = withStyles((theme) => ({
    root: {
      width: 32,
      height: 16,
      padding: 0,
      margin: theme?.spacing(1),
    },
    switchBase: {
      padding: 1,
      "&$checked": {
        transform: "translateX(16px)",
        color: theme?.palette.common.white,
        "& + $track": {
          backgroundColor: "#11B8A4",
          opacity: 1,
          border: "none",
        },
      },
      "&$focusVisible $thumb": {
        color: "#52d869",
        border: "6px solid #fff",
      },
    },
    thumb: {
      width: 14,
      height: 14,
    },

    track: {
      borderRadius: 26 / 2,
      border: `1px solid ${theme?.palette?.grey[400]}`,
      backgroundColor: "#CCCCCC",
      opacity: 1,
      transition: theme?.transitions?.create(["background-color", "border"]),
    },
    checked: {},
    focusVisible: {},
  }))(({ classes, ...props }) => {
    return (
      <Switch
        focusVisibleClassName={classes.focusVisible}
        disableRipple
        className={!rememberUser ? "switched-off" : ""}
        classes={{
          root: classes.root,
          switchBase: classes.switchBase,
          thumb: classes.thumb,
          track: classes.track,
          checked: classes.checked,
        }}
        {...props}
      />
    );
  });

  const classes = useStyles(makeStyles);
  const history = props?.history;
  const location = useLocation();
  const queries = location.search;
  // const redirect = new URLSearchParams(queries).get("redirect");
  const redirect = queries.includes("?redirect=")
    ? queries.replace("?redirect=", "")
    : null;
  const sso_response = new URLSearchParams(queries).get("sso_response");

  const [formState, setFormState] = useState({
    isValid: false,
    values: { remember: false },
    touched: {},
    errors: {},
  });
  const [passwordShown, setPasswordShown] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { dispatch } = props;

  const togglePasswordVisibility = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const { isAuthenticated, loginError, isUserPortalEnabled } = props;
  const signinStatus = localStorage.getItem("status");

  // Initialize rememberMe state and set it to follow checkBox state
  const storedRememberMe = localStorage.getItem("rememberMe") === "true";
  const [rememberUser, setRememberUser] = useState(storedRememberMe);

  useEffect(() => {
    document.title = "Plug | Login";
  }, []);

  useEffect(() => {
    setLoading(false);
    setMessage(loginError);
    setOpen(true);
  }, [loginError, signinStatus]);

  useEffect(() => {
    if (!sso_response || isAuthenticated) {
      return;
    }
    const jsonResponse = base64ToJson(sso_response);

    if (jsonResponse?._meta?.success && !!jsonResponse?._meta?.accessToken) {
      dispatch(finalizeLogin({ data: jsonResponse }));
    } else {
      errorToastify(jsonResponse?.error?.message);
    }
  }, [sso_response]);

  const handleChange = (event) => {
    event.persist();
    const { name, value, checked, type } = event.target;

    setFormState((formState) => {
      const values = {
        ...formState.values,
        [name]: type === "checkbox" ? checked : value,
      };

      const errors = validate(values, schema);

      return {
        values,
        errors: errors || {},
        isValid: errors ? false : true,
        touched: {
          ...formState.touched,
          [name]: true,
        },
      };
    });

    if (name === "remember") {
      setRememberUser(checked);
      localStorage.setItem("rememberMe", checked);
    }
  };

  const hasError = (field) =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const email = formState.values.email;
    const password = formState.values.password;

    const resp = await loginUser({ email, password, setLoading }, dispatch);

    if (resp === "OK") {
      history.push(
        `${unprotectedUrls.VERIFY}/${redirect ? "?redirect=" + redirect : ""}`
      );
    }
  };

  const renderError = () => {
    if (loginError !== "") {
      return <SignupAlert close={handleClose} message={message} open={open} />;
    } else if (signinStatus === "new") {
      return (
        <SignupAlert
          close={handleClose}
          message={"You do not have an account. Kindly go to Signup"}
          open={open}
        />
      );
    } else {
      return 1 ? null : (
        <Typography className={classes.subtitle} gutterBottom>
          Fill the form below to login
        </Typography>
      );
    }
  };

  const isUnauthorized = localStorage.unauthorized;

  return isAuthenticated ? (
    <Redirect
      to={
        isUserPortalEnabled
          ? portalNavigationUrls.DASHBOARD
          : redirect
          ? redirect
          : mainNavigationUrls.APPS
      }
    />
  ) : (
    <div className={classes.root}>
      <HeroImage />

      <div className={classes.pageGrid}>
        <Paper elevation={0} className={classes.pageForm}>
          <form>
            <Typography className={classes.title}>
              {isUnauthorized
                ? "Authorized access, login"
                : "Welcome back to Plug"}
              {/* <span role="img" aria-label="smile">
                😀
              </span> */}
            </Typography>
            <Typography className={classes.subtitle} gutterBottom>
              Resume your activities on the platform
            </Typography>

            {renderError()}

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
              FormHelperTextProps={{
                className: classes.helperText,
              }}
              placeholder="Enter your email address"
              onChange={handleChange}
              type="text"
              value={formState.values.email || ""}
              variant="outlined"
              InputProps={{
                className: classes.notched,
              }}
              inputProps={{
                className: classes.inputField,
              }}
              color="secondary"
            />

            <Typography className={classes.formLabels} gutterBottom>
              Password
            </Typography>
            <TextField
              className={classes.formTextField}
              size="small"
              error={hasError("password")}
              color="secondary"
              fullWidth
              helperText={
                hasError("password") ? formState.errors.password[0] : null
              }
              placeholder="Enter password here"
              name="password"
              onChange={handleChange}
              type={passwordShown ? "text" : "password"}
              value={formState.values.password || ""}
              variant="outlined"
              FormHelperTextProps={{
                className: classes.helperText,
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
              inputProps={{
                className: classes.inputField,
              }}
            />

            <Button
              disabled={!formState.isValid}
              classes={{
                root: classes.pageButton,
                disabled: classes.disabled,
              }}
              onClick={handleSubmit}
              fullWidth
              size="large"
              variant="contained"
            >
              Login
            </Button>

            <Grid
              container
              justifyContent="space-between"
              style={{ marginTop: -20, marginBottom: 20 }}
            >
              <FormControlLabel
                control={
                  <Remember
                    checked={rememberUser}
                    onChange={handleChange}
                    name="remember"
                  />
                }
                className={classes.rememberLabel}
                label="Remember me"
              />

              <Link
                style={{
                  textDecoration: "underline",
                  paddingTop: 7,
                  color: "#487EE6",
                  fontWeight: 600,
                  fontSize: "12px",
                }}
                className={classes.subtitle}
                component={RouterLink}
                to="forgot-password"
              >
                {"Forgot password?"}
              </Link>
            </Grid>

            <Divider>
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

            {loading ? <CircularIndeterminate color="#ffffff" /> : null}

            <Grid container className={classes.loginPanel}>
              <GoogleLogin btnMessage="Login with Google" classes={classes} />
              <LoginMicrosoft
                btnMessage="Login with Microsoft"
                classes={classes}
              />
              <SSOLoginButton classes={classes} />
            </Grid>

            {/* DON'T HAVE AN ACCOUNT */}
            <Divider style={{ marginBottom: 20 }}>
              <span className={classes.hac}>
                Don't have an account?{"  "}
                <Link
                  className={classes.linkText}
                  component={RouterLink}
                  to="sign-up"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Sign up
                </Link>
              </span>
            </Divider>
          </form>
        </Paper>
      </div>
    </div>
  );
};

Login.propTypes = {
  history: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    isLoggingIn: state.auth.isLoggingIn,
    loginError: state.auth.loginError,
    error: state.auth.error,
    isAuthenticated: state.auth.isAuthenticated,
    isUserPortalEnabled: state.auth.user?.account?.enableCustomPortal,
  };
}
export default connect(mapStateToProps)(Login);
