import { useState, useEffect } from "react";
import validate from "validate.js";
import { Link } from "react-router-dom";
import { Button, Grid, TextField, Typography } from "@material-ui/core";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import startsWith from "lodash.startswith";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import CustomDropDown from "../../../common/components/DropDown/CustomDropDown";
import { businessRole } from "../../../common/components/DropDown/util/utils";

const schema = {
  firstName: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 64,
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
  country: {
    presence: { allowEmpty: true, message: "is required" },
    length: {
      maximum: 128,
    },
  },
};

const AboutYou = ({ formState, setFormState, navigation, classes }) => {
  // const classes = useStyles();
  const [isInvalid, setIsInvalid] = useState(true);

  const { next } = navigation;
  const theme = useTheme();

  const isSmall = useMediaQuery(theme?.breakpoints?.down("sm"));

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState((formState) => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {},
    }));

    setIsInvalid(
      !formState.values.firstName ||
        !formState.values.lastName ||
        !formState?.values?.mobile ||
        formState?.values?.mobile?.length < 11 ||
        !formState.values.businessRole ||
        formState.values.businessRole === "Select One" ||
        formState.values.businessRole === "Select from the options"
    );
  }, [formState.values, setFormState]);

  useEffect(() => {
    const {
      values: { businessRole },
    } = formState;
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        businessRole:
          businessRole === "Select from the options"
            ? "Select One"
            : businessRole,
      },
    }));
  }, []);

  const handleChange = (event) => {
    event.persist();
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value,
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true,
      },
    }));
  };

  const hasError = (field) =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const handleNext = () => {
    sessionStorage.setItem("about_you", JSON.stringify(formState.values));
    next();
  };

  return (
    <form>
      {/* <img alt="You" className={classes.work} src="/images/you.png" /> */}

      <Typography className={classes.title}>
        Tell us a bit about yourself
      </Typography>
      <Typography className={classes.subtitle} gutterBottom>
        You’re almost there, ready to create an app.
      </Typography>

      <Grid container direction="row" spacing={isSmall ? 0 : 3}>
        <Grid item xs={12} md={6}>
          <Typography className={classes.formLabels} gutterBottom>
            First name
          </Typography>
          <TextField
            className={classes.formTextField}
            name="firstName"
            error={hasError("firstName")}
            size="small"
            fullWidth
            helperText={
              hasError("firstName") ? formState.errors.firstName[0] : null
            }
            placeholder="Enter your first name"
            onChange={handleChange}
            type="text"
            value={formState.values.firstName || ""}
            InputProps={{
              className: classes.notched,
            }}
            inputProps={{
              className: classes.inputField,
            }}
            color="secondary"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography className={classes.formLabels} gutterBottom>
            Last name
          </Typography>
          <TextField
            className={classes.formTextField}
            name="lastName"
            error={hasError("lastName")}
            fullWidth
            size="small"
            helperText={
              hasError("lastName") ? formState.errors.lastName[0] : null
            }
            placeholder="Enter your last name"
            onChange={handleChange}
            type="text"
            value={formState.values.lastName || ""}
            InputProps={{
              className: classes.notched,
            }}
            inputProps={{
              className: classes.inputField,
            }}
            color="secondary"
            variant="outlined"
          />
        </Grid>
      </Grid>

      <Typography className={classes.formLabels} gutterBottom>
        Phone number
      </Typography>
      <div>
        <PhoneInput
          country={"ng"}
          error={hasError("mobile")}
          helperText={hasError("mobile") ? formState.errors.mobile[0] : null}
          name="mobile"
          inputStyle={{
            width: "100%",
            border: "1px solid rgba(0, 0, 0, 0.23)",
            borderRadius: "8px",
            background: "#F9FAFE",
            height: "3.5rem",
          }}
          inputClass={classes.phoneInputClass}
          buttonStyle={{
            width: 40,
            background: "#F9FAFE",
            border: "1px solid rgba(0, 0, 0, 0.23)",
          }}
          buttonClass={classes.phoneButtonClass}
          // containerStyle={{
          //   border: "2px solid #D2DEFF",
          //   borderRadius: "8px",
          //   "&:hover": {
          //     //border: "1px solid #D2DEFF",
          //     borderColor: "#1866DB",
          //   },
          // }}
          value={formState.values.mobile}
          onChange={(mobile) =>
            setFormState({
              ...formState,
              values: {
                ...formState.values,
                mobile: mobile,
              },
            })
          }
          fullWidth
          isValid={(inputNumber, country, countries) => {
            return countries.some((country) => {
              return (
                startsWith(inputNumber, country.dialCode) ||
                startsWith(country.dialCode, inputNumber)
              );
            });
          }}
        />
      </div>
      <Typography className={classes.formLabels} gutterBottom>
        Your role
      </Typography>
      <CustomDropDown
        data={businessRole}
        className={classes.formTextField}
        size="small"
        error={hasError("businessRole")}
        helperText={
          hasError("businessRole") ? formState.errors.businessRole[0] : null
        }
        name="businessRole"
        value={formState.values.businessRole || ""}
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
        alignItems="center"
        justifyContent="space-between"
        direction="row"
      >
        <Link to="sign-up" style={{ color: "white", textDecoration: "none" }}>
          <Button
            classes={{
              root: classes.pageButton,
            }}
            size="large"
            variant="contained"
          >
            Previous
          </Button>
        </Link>

        <Button
          classes={{
            root: classes.pageButton,
            disabled: classes.disabled,
          }}
          onClick={handleNext}
          disabled={isInvalid}
          size="large"
          type="submit"
          variant="contained"
        >
          Next
        </Button>
      </Grid>
    </form>
  );
};

export default AboutYou;

