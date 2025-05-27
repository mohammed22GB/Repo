import { useEffect, useState } from "react";
import validate from "validate.js";
import { makeStyles } from "@material-ui/styles";
import { Link, Typography } from "@material-ui/core";
import { sendVerificationEmail } from "../../../../store/actions";
import { useStyles } from "../../../common/components/outerPagesStyle";
import { errorToastify, successToastify } from "../../../common/utils/Toastify";

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

const Subscribe = ({ formState, setFormState, navigation }) => {
  const classes = useStyles(makeStyles);

  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState((formState) => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {},
    }));
  }, [formState.values, setFormState]);

  const { next } = navigation;
  let userId = localStorage.getItem("userId");

  /* const handleUpdate = (event) => {
    //console.log(`6uppppppppppppp >> ${userId}`);
    event.preventDefault();

    db.collection("users")
      .doc(userId)
      .update({
        firstName: formState.values.firstName,
        lastName: formState.values.lastName,
        mobile: formState.values.phone,
        businessRole: formState.values.businessRole,
        name: formState.values.orgName,
        employees: formState.values.employees,
        country: formState.values.country,
        industry: formState.values.industry,
      })
      .then(() => {
        setFormState({ ...formState });
        //console.log("update-success");
        next();
      })
      .catch((error) => {
        //console.log("error: " + error);
      });
  }; */

  const resendMail = async () => {
    setIsLoading(true);
    const userMail = JSON.parse(sessionStorage.getItem("user_user"));
    //console.log(userMail.email);
    //console.log(`formState >>> ${JSON.stringify(formState)}`);
    const res = await sendVerificationEmail(userMail?.email);
    setIsLoading(false);
    if (res.type === "success") successToastify(res.msg);
    else errorToastify(res.msg);
  };

  return (
    <form className={classes.SubscribeForm}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          alt="mail"
          className={classes.SubscribeMail}
          src="/images/newplug/signed_up.png"
        />
        <Typography className={classes.SubscribeTitle}>
          Thank you for signing up.
        </Typography>
        <Typography className={classes.SubscribeConfirmMail} gutterBottom>
          We will send you a confirmation email shortly with an activation link
          to get you started with your account.
        </Typography>
      </div>
      {/* <div
        className={classes.emailbutton}
        style={{ lineHeight: 3, textAlign: "center" }}
        // onClick={handleUpdate}
        fullWidth
        size="large"
        // type="submit"
        // variant="contained"
      >
        Go to Email
      </div> */}
      <Typography className={classes.SubscribeSpam} gutterBottom>
        Didn’t see it? Check your Spam for an email from
        <Link
          className={classes.SubscribeLinks}
          href={"mailto:plug_admin@plugonline.io"}
        >
          plug_admin@plugonline.io
        </Link>
        or{" "}
        <Link
          className={classes.SubscribeLinks}
          style={{ textDecoration: "underline", cursor: "pointer" }}
          onClick={() => resendMail()}
        >
          Send again
          {isLoading && (
            <div
              style={{ display: "inline-block" }}
              className="activity-loader"
            ></div>
          )}
        </Link>
      </Typography>
    </form>
  );
};

export default Subscribe;
