import { useEffect } from "react";
//import { Link as withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import validate from "validate.js";
import { makeStyles } from "@material-ui/core/styles";
import { Link, Typography } from "@material-ui/core";
import { Grid } from "@material-ui/core";

import { successToastify } from "../../../common/utils/Toastify";
import useCustomMutation from "../../../common/utils/CustomMutation";
import { forgotPassword } from "../../../common/components/Mutation/Registration/registrationMutation";
import { unprotectedUrls } from "../../../common/utils/lists";

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
  updateUser: {
    presence: { allowEmpty: true },
  },
};

const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: 24,
    color: "#091540",
    lineHeight: "30px",
    padding: theme?.spacing(2, 0, 3, 0),
    textAlign: "center",
  },

  mail: {
    width: "15%",
  },

  form: {
    textAlign: "center",
  },

  emailbutton: {
    fontFamily: "Inter",
    fontStyle: "normal",
    margin: theme?.spacing(2, 0, 1, 0),
    // backgroundColor: "#010A43",
    // color: "#fff",
    textTransform: "none",
    padding: "10px",
    width: "30vw",
    color: "#010A43",
  },

  actionContainer: {
    padding: theme?.spacing(2),
  },

  anything: {
    padding: theme?.spacing(2, 0),
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: 375,
    fontSize: 12,
    lineHeight: "130%",
    color: "#999999",
    display: "flex",
    justifyContent: "center",
  },

  links: {
    paddingLeft: "3px",
    paddingRight: "3px",
    color: "#091540",
    fontWeight: "bold",
    textDecoration: "underline",
  },

  spam: {
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: 375,
    fontSize: 12,
    lineHeight: "130%",
    color: "#999999",
    display: "flex",
    justifyContent: "center",
  },
}));

const CheckEmail = ({ formState, setFormState, navigation, props }) => {
  const classes = useStyles();

  const onForgotPasswordSuccess = ({ data }) => {
    setFormState({ ...formState });
    successToastify("Email has been resent successfully");
  };

  const { mutate: forgotPasswordMutate } = useCustomMutation({
    apiFunc: forgotPassword,
    onSuccess: onForgotPasswordSuccess,
    retries: 0,
  });

  const handleResendPassword = (e) => {
    const email = localStorage.getItem("resendmail");
    forgotPasswordMutate({
      email: email && email,
      redirectUrl: `${process.env.REACT_APP_BASE_URL}/reset-password`,
    });
    e.preventDefault();
  };

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState((formState) => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {},
    }));
  }, [formState.values, setFormState]);

  return (
    <Grid container justifyContent="center" className={classes.actionContainer}>
      <form className={classes.form}>
        <img alt="mail" className={classes.mail} src="/images/bigmail.png" />
        <Typography className={classes.title}>
          We have sent a reset link to your mail box
        </Typography>

        <Typography className={classes.anything} gutterBottom>
          Didn&apos;t get any email?
          <Link
            className={classes.links}
            href={"#"}
            onClick={(e) => handleResendPassword(e)}
          >
            Resend email
          </Link>{" "}
        </Typography>
        <Link className={classes.links} href={unprotectedUrls.ROOT}>
          Go to login
        </Link>
      </form>
    </Grid>
  );
};

CheckEmail.propTypes = {
  history: PropTypes.object,
};

export default CheckEmail;
