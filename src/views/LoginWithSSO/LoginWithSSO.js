import { makeStyles } from "@material-ui/core/styles";
import { Paper, Button, TextField, Link, Typography } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import { useEffect, useState } from "react";
import validate from "validate.js";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import { useStyles } from "../common/components/outerPagesStyle";
import { loginUserUsingSso } from "../../store/actions";
import { errorToastify, infoToastify } from "../common/utils/Toastify";
import { mainNavigationUrls } from "../common/utils/lists";
import HeroImage from "../common/components/AuthLayout/HeroImage";
import CircularIndeterminate from "../common/components/ProgressLoader/ProgressLoader";
import Divider from "../common/components/Divider/Divider";

const schema = {
  email: {
    presence: { allowEmpty: false, message: "is required" },
    email: true,
    length: {
      maximum: 64,
    },
  },
};

const LoginWithSSO = (props) => {
  const classes = useStyles(makeStyles);

  const [formState, setFormState] = useState({
    isValid: false,
    values: { remember: false },
    touched: {},
    errors: {},
  });

  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = props;

  useEffect(() => {
    document.title = "Plug | Login SSO";
  }, []);

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState((formState) => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {},
    }));
  }, [formState.values]);

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

  const hasError = (field) =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const email = { email: formState.values.email };

    const resp = await loginUserUsingSso(email);

    setIsLoading(false);

    if (resp) {
      infoToastify("Redirecting to SSO URL");
      window.location.href = resp;
    } else {
      errorToastify("SSO login URL not found in API response");
    }
  };

  return isAuthenticated ? (
    <Redirect to={mainNavigationUrls.APPS} />
  ) : (
    <div className={classes.root}>
      <HeroImage />

      <div className={classes.pageGrid}>
        <Paper elevation={0} className={classes.pageForm}>
          <form>
            <Typography className={classes.title}>Welcome to Plug</Typography>
            <Typography className={classes.subtitle} gutterBottom>
              Login into Plug with Single Sign-On
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
              helperText={
                hasError("email") && (
                  <span>
                    <span className={classes.errorMsg}>!</span> Invalid email
                    address! Try using an email with a custom domain.
                  </span>
                )
              }
              FormHelperTextProps={{
                className: classes.helperText,
              }}
              placeholder="Enter your email address"
              value={formState.values.email || ""}
              onChange={handleChange}
              type="text"
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
              variant="contained"
              type="submit"
            >
              Login
            </Button>

            {isLoading ? <CircularIndeterminate color="#ffffff" /> : null}

            <Divider style={{ marginBottom: 20 }}>
              <span className={classes.hac}>
                Don't want to use SSO?{" "}
                <Link
                  className={classes.linkText}
                  component={RouterLink}
                  to="login"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Go to Login
                </Link>
              </span>
            </Divider>
          </form>
        </Paper>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
  };
}

export default connect(mapStateToProps)(LoginWithSSO);
