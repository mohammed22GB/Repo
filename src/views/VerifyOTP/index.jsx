import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import validate from "validate.js";
import { makeStyles } from "@material-ui/core/styles";
import {
  Paper,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import { connect } from "react-redux";
import { Redirect, useLocation } from "react-router-dom";
import {
  loginOTP,
  sendVerifyEmailOTP,
  sendVerifyPhoneOTP,
  verifyPhoneOTP,
} from "../../store/actions";
import SignupAlert from "../common/components/Alert/SignupAlert";
import { errorToastify, successToastify } from "../common/utils/Toastify";
import { mainNavigationUrls, unprotectedUrls } from "../common/utils/lists";
import HeroImage from "../common/components/AuthLayout/HeroImage";
import { useStyles } from "../common/components/outerPagesStyle";
import { secondsCountdown } from "../common/helpers/helperFunctions";
import CircularIndeterminate from "../common/components/ProgressLoader/ProgressLoader";
import Divider from "../common/components/Divider/Divider";

const schema = {
  otp: {
    presence: { allowEmpty: false, message: "is required" },
    length: { minimum: 6, maximum: 6, message: "must be exactly 6 digits" },
  },
};

const VerifyOTP = (props) => {
  const classes = useStyles(makeStyles);
  const history = props?.history;
  const location = useLocation();
  const queries = location.search;
  const redirect = queries.includes("?redirect=")
    ? queries.replace("?redirect=", "")
    : null;

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
  const [isResending, setIsResending] = useState(false);
  const [lemail, setLemail] = useState(null);
  const [vphone, setVphone] = useState(null);
  const [resendDelayDuration, setResendDelayDuration] = useState(15);
  const [resendDelaySeconds, setResendDelaySeconds] = useState("");
  const [resendCountdown, setResendCountdown] = useState(true);

  // const lphone = localStorage.getItem("login_preotp_phone");
  const lemail_ = localStorage.getItem("login_preotp_email");
  const vphone_ = localStorage.getItem("verify_preotp_phone");

  useEffect(() => {
    startCountdown();

    return () => {
      localStorage.removeItem("verify_preotp_phone");
      localStorage.removeItem("login_preotp_email");
      localStorage.removeItem("preAccessToken");
    };
  }, []);

  const startCountdown = () => {
    const duration = resendDelayDuration;
    setResendCountdown(true);
    secondsCountdown(duration, setResendDelaySeconds, setResendCountdown);

    setResendDelayDuration(duration * 2);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const { isAuthenticated, loginError } = props;
  const signinStatus = localStorage.getItem("status");

  useEffect(() => {
    document.title = "Plug | Verify OTP";

    if (!lemail_ && !vphone_) {
      window.location.href = unprotectedUrls.LOGIN;
    } else {
      !!lemail_ && setLemail(lemail_);
      !!vphone_ && setVphone(vphone_);
    }
  }, []);

  useEffect(() => {
    setLoading(false);
    setMessage(loginError);
    setOpen(true);
  }, [loginError, signinStatus]);

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
  };

  const hasError = (field) =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const { dispatch } = props;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const token = formState.values.otp;
    if (!!lemail) {
      await loginOTP({ email: lemail, token, setLoading }, dispatch);
      /* } else if(!!lphone) {
      await loginOTP({ lphone, token, setLoading }, dispatch);
     */
    } else if (!!vphone) {
      const resp = await verifyPhoneOTP({ token, setLoading });

      if (resp?.data?._meta?.success) {
        localStorage.removeItem("verify_preotp_phone");
        //window.location.href = mainNavigationUrls.ACCOUNT_PROFILE;
        history.goBack();
      }
    } else {
      //window.location.href = unprotectedUrls.LOGIN;
      setLoading(false);
      history.goBack();
    }
  };

  const doResend = async () => {
    let resp;

    setIsResending(true);

    if (!!lemail) {
      resp = await sendVerifyEmailOTP();
      // resp = await loginUser({ email: lemail });
    } else if (!!vphone) {
      resp = await sendVerifyPhoneOTP(vphone);
    } else {
      window.location.href = unprotectedUrls.LOGIN;
      return;
    }

    if (resp?.data?._meta?.success || resp === "OK") {
      successToastify("Code resent");
    } else {
      errorToastify("Error occured");
    }
    setIsResending(false);
    startCountdown();
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
    }
  };

  return isAuthenticated && lemail ? (
    <Redirect to={redirect ? redirect : mainNavigationUrls.APPS} />
  ) : (
    <div className={classes.root}>
      <HeroImage />

      <div className={classes.pageGrid}>
        <Paper elevation={0} className={classes.pageForm}>
          <form>
            <Typography className={classes.title}>Enter OTP</Typography>
            <Typography className={classes.subtitle} gutterBottom>
              A one-time code has been sent to your{" "}
              {(!!lemail && `email (${lemail})`) ||
                (!!vphone && `mobile (${vphone})`)}
              . Enter the code below.
            </Typography>
            {renderError()}

            <Typography className={classes.formLabels} gutterBottom>
              OTP
            </Typography>
            <TextField
              className={classes.formTextField}
              name="otp"
              size="small"
              error={hasError("otp")}
              fullWidth
              FormHelperTextProps={{
                className: classes.helperText,
              }}
              // placeholder="Type in the code you received here..."
              placeholder="Enter code..."
              onChange={handleChange}
              type="text"
              value={formState.values.otp || ""}
              variant="outlined"
              InputProps={{
                className: classes.notched,
              }}
              inputProps={{
                className: classes.inputField,
              }}
              color="secondary"
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
              type="submit"
              variant="contained"
            >
              {!!vphone ? "Verify phone number" : "Login"}
            </Button>

            <div className="verify ddivider" style={{ fontSize: 12 }}>
              <Divider>
                <span style={{ marginRight: 5, color: "#999" }}>
                  Didn't get the code?
                </span>
                {isResending ? (
                  <CircularProgress
                    size={12}
                    style={{ color: "#010A43", margin: "0 10px" }}
                  />
                ) : resendCountdown ? (
                  <div
                    className="countdown-div"
                    style={{ display: "inline-block", lineHeight: "19px" }}
                  >
                    {`Resend in ${resendDelaySeconds}`}
                  </div>
                ) : (
                  <span
                    className={classes.linkText}
                    // component={RouterLink}
                    onClick={doResend}
                  >
                    Resend
                  </span>
                )}
              </Divider>
            </div>
          </form>
        </Paper>
        <Button
          variant="text"
          color="primary"
          style={{
            textTransform: "capitalize",
            marginBottom: 30,
            width: 106,
            fontSize: 12,
            alignSelf: "center",
          }}
          onClick={() => history.goBack()}
        >
          {" < "} Back
        </Button>

        {loading ? <CircularIndeterminate color="#ffffff" /> : null}
      </div>
    </div>
  );
};

VerifyOTP.propTypes = {
  history: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    isLoggingIn: state.auth.isLoggingIn,
    loginError: state.auth.loginError,
    error: state.auth.error,
    isAuthenticated: state.auth.isAuthenticated,
  };
}
export default connect(mapStateToProps)(VerifyOTP);
