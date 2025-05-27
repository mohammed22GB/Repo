import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import validate from "validate.js";
import axios from "axios";
import { Button, Grid, TextField, Typography } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import { receiveLogin, verifySuccess } from "../../../../store/actions";
import { errorToastify } from "../../../common/utils/Toastify";
import { CustomAxios } from "../../../common/utils/CustomAxios";
import { catchErr } from "../../../common/utils/catchErr";
import { mainNavigationUrls } from "../../../common/utils/lists";
import {
    countryDropDown,
    employeeDropDown,
    industryDropDown,
} from "../../../common/components/DropDown/util/utils";
import CustomDropDown from "../../../common/components/DropDown/CustomDropDown";
import CircularIndeterminate from "../../../common/components/ProgressLoader/ProgressLoader";

const schema = {
  orgName: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 128,
    },
  },
  employees: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 128,
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
};

const AboutOrganization = ({
  formState,
  setFormState,
  navigation,
  classes,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [, setMessage] = useState("");
  const [isInvalid, setIsInvalid] = useState(true);
  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState((formState) => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {},
    }));

    setIsInvalid(
      !formState.values.orgName ||
        !formState.values.employees ||
        formState.values.employees === "Select from the options" ||
        formState.values.employees === "Select One" ||
        formState.values.employees === "null" ||
        !formState.values.country ||
        formState.values.country === "Select from the options" ||
        formState.values.country === "Select One" ||
        formState.values.country === "S" ||
        !formState.values.industry ||
        formState.values.industry === "Select One" ||
        formState.values.industry === "Select from the options" ||
        formState.values.industry === "null"
    );
  }, [formState.values, setFormState]);

  useEffect(() => {
    const {
      values: { industry, employees },
    } = formState;
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        industry:
          industry === "Select from the options" ? "Select One" : industry,
        employees:
          employees === "Select from the options" ? "Select One" : employees,
        //country: formState.values.country || "Select from the options",
      },
    }));
  }, []);

  const { previous, next } = navigation;

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

  const theme = useTheme();
  const isSmall = useMediaQuery(theme?.breakpoints?.down("sm"));

  const hasError = (field) =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const handleSubmit = async () => {
    const signupDetail = JSON.parse(sessionStorage.getItem("user_user"));
    const aboutYou = JSON.parse(sessionStorage.getItem("about_you"));
    const mode = localStorage.getItem("onboardingmode");

    const userData = {
      email: !!signupDetail ? signupDetail.email : null,
      password: !!signupDetail ? signupDetail.password : null,
      firstName: aboutYou.firstName,
      lastName: aboutYou.lastName,
      mobile: aboutYou.mobile,
      businessRole: aboutYou.businessRole,
    };
    const orgData = {
      name: formState.values.orgName,
      country: formState.values.country,
      industry: formState.values.industry,
      noOfEmployee: formState.values.employees,
    };

    if (
      mode === "googlesignup" ||
      mode === "googlelogin" ||
      mode === "verify" ||
      mode === "microsoftsignup"
    ) {
      //  save user details
      delete userData.email;
      delete userData.password;

      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      const userId = localStorage.getItem("userId");
      const accountId =
        localStorage.getItem("accountId") || userInfo?.account?.id;

      if (!userId || !accountId) {
        errorToastify(
          "Sorry, an error occured. Kindly restart the registration."
        );
        return;
      }

      const userUpdate = await CustomAxios()
        .put(`${process.env.REACT_APP_ENDPOINT}/users/${userId}`, userData)
        .then((res) => res.data)
        .catch((err) => catchErr({ err, alertResErrorFunc: setMessage }));

      const orgUpdate = await CustomAxios()
        .put(`${process.env.REACT_APP_ENDPOINT}/accounts/${accountId}`, orgData)
        .then((res) => res.data)
        .catch((err) => catchErr({ err, alertResErrorFunc: setMessage }));

      if (userUpdate && orgUpdate) {
        const user = JSON.parse(localStorage.getItem("userInfo"));
        const newData = {
          ...user,
          ...userData,
          account: { ...user.account, ...orgData },
        };
        localStorage.setItem("userInfo", JSON.stringify(newData));

        dispatch(receiveLogin(user));
        dispatch(verifySuccess());
        history.push(mainNavigationUrls.APPS);
      }
    } else {
      //  register new user
      setIsLoading(true);

      try {
        const res = await axios.post(
          `${process.env.REACT_APP_ENDPOINT}/auth/register`,
          {
            user: userData,
            account: orgData,
            redirectUrl: `${process.env.REACT_APP_BASE_URL}/welcome`,
          },
          {
            "Content-Type": "application/json",
          }
        );
        // .then(async (res) => {

        setIsLoading(false);

        next();
        // })
      } catch (err) {
        setIsLoading(false);
        catchErr({
          err,
          alertResMessage: err?.response?.data?._meta?.error?.message,
          alertResErrorFunc: setMessage,
        });
      }
    }
  };

  return (
    <form>
      {/* <img alt="Work" className={classes.work} src="/images/work.png" /> */}
      <Typography className={classes.title}>Your organisation</Typography>
      <Typography className={classes.subtitle} gutterBottom>
        Final step in getting started and creating an app.
      </Typography>
      <Typography className={classes.formLabels} gutterBottom>
        Organisation name
      </Typography>
      <TextField
        className={classes.formTextField}
        size="small"
        name="orgName"
        error={hasError("orgName")}
        fullWidth
        helperText={hasError("orgName") ? formState.errors.orgName[0] : null}
        placeholder="Enter Organisation’s name"
        onChange={handleChange}
        type="text"
        value={formState.values.orgName || ""}
        variant="outlined"
        InputProps={{
          className: classes.notched,
        }}
        inputProps={{
          className: classes.inputField,
        }}
        color="secondary"
      />

      <Grid container direction="row" spacing={isSmall ? 0 : 3}>
        <Grid item xs={12} md={6}>
          <Typography className={classes.formLabels} gutterBottom>
            Number of employees
          </Typography>
          <CustomDropDown
            data={employeeDropDown}
            size="small"
            className={classes.formTextField}
            error={hasError("employees")}
            helperText={
              hasError("employees") ? formState.errors.employees[0] : null
            }
            name="employees"
            value={formState.values.employees || ""}
            onChange={handleChange}
            InputProps={{
              className: classes.notched,
            }}
            inputProps={{
              className: classes.inputField,
            }}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography className={classes.formLabels} gutterBottom>
            Country
          </Typography>
          <CustomDropDown
            data={countryDropDown}
            size="small"
            className={classes.formTextField}
            error={hasError("country")}
            helperText={
              hasError("country") ? formState.errors.country[0] : null
            }
            name="country"
            value={formState.values.country || ""}
            onChange={handleChange}
            InputProps={{
              className: classes.notched,
            }}
            inputProps={{
              className: classes.inputField,
            }}
            color="secondary"
          />
        </Grid>
      </Grid>

      <Typography className={classes.formLabels} gutterBottom>
        Industry
      </Typography>
      <CustomDropDown
        data={industryDropDown}
        size="small"
        className={classes.formTextField}
        error={hasError("industry")}
        // helperText={hasError("industry") ? formState.errors.industry[0] : null}
        name="industry"
        value={formState.values.industry || ""}
        onChange={handleChange}
        InputProps={{
          className: classes.notched,
        }}
        inputProps={{
          className: classes.inputField,
        }}
        color="secondary"
      />
      <Grid
        container
        alignItems="flex-start"
        justifyContent="space-between"
        direction="row"
      >
        {isLoading ? <CircularIndeterminate /> : null}
        <Button
          className={classes.pageButton}
          onClick={previous}
          size="large"
          type="submit"
          variant="contained"
        >
          Previous
        </Button>
        <Button
          classes={{
            root: classes.pageButton,
            disabled: classes.disabled,
          }}
          disabled={isInvalid}
          onClick={handleSubmit}
          size="large"
          // type="submit"
          variant="contained"
        >
          Finish
          {isLoading && <div className="activity-loader"></div>}
        </Button>
      </Grid>
    </form>
  );
};

AboutOrganization.propTypes = {
  history: PropTypes.object,
};

export default AboutOrganization;

