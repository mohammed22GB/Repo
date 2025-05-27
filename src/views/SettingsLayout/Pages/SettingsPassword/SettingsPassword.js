import React, { useEffect, useState, useRef } from "react";
import {
  Grid,
  Typography,
  TextField,
  Button,
  FormControl,
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
import useStyles from "./components/style";
import { useDispatch } from "react-redux";
import validate from "validate.js";

import InputAdornment from "@material-ui/core/InputAdornment";
import hide from "../../../../assets/images/hide.png";
import show from "../../../../assets/images/show.png";
import useCustomMutation from "../../../common/utils/CustomMutation";
import { changePassword } from "../../../common/components/Mutation/ProfileSetting/passwordMutation";
import { SetAppStatus } from "../../../common/helpers/helperFunctions";
import NewPasswordValidator from "../../../common/components/NewPasswordValidator";
import Logout from "../../../Login/components/Logout/Logout";

const SettingsPassword = ({ history }) => {
  const classes = useStyles();
  const logOutRef = useRef(null);
  const [formData, setFormData] = useState({
    values: {},
    touched: {},
    errors: {},
  });
  const [notCompleted, setNotCompleted] = useState(true);
  const [passwordShown, setPasswordShown] = useState({
    oldPassword: false,
    password: false,
  });
  const [failedPasswordValidate, setFailedPasswordValidate] = useState(false);

  const schema = {
    password: {
      presence: { allowEmpty: false, message: "is required" },
      length: {
        maximum: 128,
      },
    },
  };

  useEffect(() => {
    document.title = "Settings | Password";
  }, []);

  const _setFormData = (field, value) => {
    setFormData((prev) => {
      const updatedState = {};
      for (const key in prev) {
        updatedState[key] = {
          ...prev[key],
          [field]: key === "errors" ? validate(formData.values, schema) : value,
        };
      }
      return updatedState;
    });
  };

  const toggleVisibility = (name) => {
    setPasswordShown({ ...passwordShown, [name]: !passwordShown[name] });
  };

  const dispatch = useDispatch();

  const checkPassword = () => {
    setFailedPasswordValidate(notCompleted && formData.touched.password);
  };

  const hasError = (field) => {
    return formData.touched[field] && formData.errors[field] ? true : false;
  };

  const isInvalid =
    !formData?.values?.password ||
    !formData?.values?.oldPassword ||
    failedPasswordValidate;

  const onSuccess = ({ data }) => {
    logOutRef.current.click();
    if (localStorage.getItem("userInfo") || localStorage.getItem("userId")) {
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userId");
    }
    setTimeout(() => {
      window.location.reload();
    }, 1000);

    // history.push({
    //   pathname: unprotectedUrls.LOGIN,
    // });
  };
  const { mutate: postChangePassword } = useCustomMutation({
    apiFunc: changePassword,
    onSuccess,
    retries: 0,
  });

  const _handleForm = async () => {
    if (!formData?.values?.oldPassword || !formData?.values?.password) {
      return dispatch(SetAppStatus({ type: "info", msg: "Fill all fields" }));
    }
    //if (formData?.password !== formData?.currentPassword)
    //dispatch(SetAppStatus({ type: "info", msg: "Password mismatch" }));
    return postChangePassword({
      currentPassword: formData?.values?.oldPassword,
      password: formData?.values?.password,
    });
  };

  return (
    <div className={classes.root}>
      <Grid container direction="column" spacing={3}>
        <Grid item>
          <Typography className={classes.formLabels} gutterBottom>
            Enter current password
          </Typography>
          <TextField
            className={classes.formTextField}
            size="small"
            fullWidth
            //error={hasError("password") || failedPasswordValidate}
            placeholder="Enter password here"
            name="oldPassword"
            onChange={(e) => _setFormData("oldPassword", e.target.value)}
            onBlur={checkPassword}
            type={passwordShown.oldPassword ? "text" : "password"}
            //value={formData.values.password || ""}
            variant="outlined"
            autoComplete="off"
            FormHelperTextProps={{
              className: classes.helperText,
            }}
            inputProps={{
              className: classes.inputField,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <i
                    onClick={() => toggleVisibility("oldPassword")}
                    className={classes.eye}
                  >
                    <img
                      src={passwordShown.oldPassword ? show : hide}
                      alt="Visibility"
                    />
                  </i>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item>
          <Typography className={classes.formLabels} gutterBottom>
            Enter new password
          </Typography>
          <TextField
            className={classes.formTextField}
            size="small"
            fullWidth
            error={hasError("password") || failedPasswordValidate}
            helperText={
              notCompleted && formData.touched.password ? (
                <span>
                  <span
                    style={{
                      backgroundColor: "#e53935",
                      color: "#fff",
                      padding: "0.5px 6px",
                      borderRadius: "300px",
                    }}
                  >
                    !
                  </span>{" "}
                  Your password has not met the required criteria
                </span>
              ) : null
            }
            placeholder="Enter new password here"
            name="password"
            onChange={(e) => _setFormData("password", e.target.value)}
            onBlur={checkPassword}
            type={passwordShown.password ? "text" : "password"}
            //value={formData.values.password || ""}
            variant="outlined"
            autoComplete="off"
            FormHelperTextProps={{
              className: classes.helperText,
            }}
            inputProps={{
              className: classes.inputField,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <i
                    onClick={() => toggleVisibility("password")}
                    className={classes.eye}
                  >
                    <img
                      src={passwordShown.password ? show : hide}
                      alt="Visibility"
                    />
                  </i>
                </InputAdornment>
              ),
            }}
          />
          <NewPasswordValidator
            formState={formData}
            notCompleted={notCompleted}
            setNotCompleted={setNotCompleted}
            setFailedPasswordValidate={setFailedPasswordValidate}
          />
        </Grid>
        {/* <Grid item>
          <Typography className={classes.formLabels} gutterBottom>
            Confirm New Password
          </Typography>
          <TextField
            className={classes.formTextField}
            onChange={(e) => _setFormdata("confirmPassword", e.target.value)}
            type="password"
            fullWidth
            id="outlined-basic"
            variant="outlined"
            placeholder="Confirm password here"
            size="small"
          />
        </Grid> */}

        <Grid
          item
          style={{
            backgroundColor: "#fcf1e4",
            border: "solid 1px #efd2b0",
            margin: 12,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" style={{ textTransform: "uppercase" }}>
            You'll need to re-login after clicking 'Change'
          </Typography>
          <Logout logOutRef={logOutRef}></Logout>
        </Grid>
        <Grid item>
          <FormControl>
            <Button
              onClick={_handleForm}
              variant="contained"
              color="primary"
              classes={{
                root: classes.customButton,
                label: classes.customButtonLabel,
              }}
              disabled={isInvalid}
            >
              Change
            </Button>
          </FormControl>
        </Grid>
        {/* <Grid item style={{ marginTop: 20 }}><Link to="/emailnotifications"><Button variant="contained" color="primary" className={classes.customButtonLabel}>Change</Button></Link></Grid> */}
      </Grid>
    </div>
  );
};

export default withRouter(SettingsPassword);
