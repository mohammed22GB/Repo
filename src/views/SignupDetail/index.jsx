import { useState, useEffect } from "react";
import { withRouter, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import validate from "validate.js";
import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useStep } from "react-hooks-helper";

import { useStyles } from "../common/components/outerPagesStyle";
import { unprotectedUrls } from "../common/utils/lists";
import useCustomMutation from "../common/utils/CustomMutation";
import { verifyEmail } from "../common/components/Mutation/Registration/registrationMutation";
import {
    AboutOrganization,
    AboutYou,
    FinishSetup,
    Subscribe,
} from "./components";
import HeroImage from "../common/components/AuthLayout/HeroImage";

const schema = {
  firstName: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 128,
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
      maximum: 20,
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

/* const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    minHeight: "100%",
  },

  quote: {
    backgroundColor: theme?.palette.neutral,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: "url(/images/auth.jpg)",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
  quoteInner: {
    textAlign: "center",
    flexBasis: "600px",
  },
  quoteText: {
    color: theme?.palette.white,
    fontWeight: 300,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    width: "50%",
    [theme?.breakpoints?.down("sm")]: {
      width: "45%",
      margin: "auto",
      marginTop: "26px",
      marginBottom: "26px",
      boxShadow:
        "0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)",
    },
    [theme?.breakpoints?.down("xs")]: {
      width: "90%",
      position: "relative",
      marginTop: 120,
      marginBottom: "auto",
    },
  },
  innerContent: {
    width: "60%",
    margin: "auto",
    //border: "2px solid red",
    [theme?.breakpoints?.down("sm")]: {
      width: "90%",
    },
  },
})); */

const steps = [
  { id: "you" },
  { id: "organization" },
  { id: "subscribe" },
  { id: "finish" },
];

const SignupDetail = (props) => {
  const classes = useStyles(makeStyles);
  const history = useHistory();
  const [initStep, setInitStep] = useState(0);

  const [formState, setFormState] = useState({
    isValid: false,
    values: {
      businessRole: "Select from the options",
      employees: "Select from the options",
      country: "Select from the options",
      industry: "Select from the options",
    },
    touched: {},
    errors: {},
  });

  const { step, navigation } = useStep({ initialStep: initStep, steps });
  const { id } = step;

  props = { formState, setFormState, navigation };

  useEffect(() => {
    document.title = "Plug | Organisation";

    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    if (!!params?.email && !!params?.code) {
      verifyEmailMutate({
        email: params.email.trim().replace(" ", "+"), //  URLSearchParams replaces '+' with ' '
        emailVerificationCode: params.code,
      });
    } else {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      if (!user?.id) return;
      const values = {
        firstName: user.firstName,
        lastName: user.lastName,
        mobile: user.mobile,
        businessRole: user.businessRole,

        orgName: user.account.name,
        employees: user.account.noOfEmployee,
        country: user.account.country,
        industry: user.account.industry,
      };

      setFormState((formState) => ({
        ...formState,
        values,
      }));
    }
  }, []);

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState((formState) => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {},
    }));
  }, [formState.values]);

  const onVerifyEmailSuccess = ({ data }) => {
    //console.log(`data`, data);
    setFormState({ ...formState });
    navigation.go(3);
  };

  const onVerifyEmailError = () => {
    history.push(unprotectedUrls.LOGIN);
  };

  const { mutate: verifyEmailMutate } = useCustomMutation({
    apiFunc: verifyEmail,
    onSuccess: onVerifyEmailSuccess,
    onError: onVerifyEmailError,
    retries: 0,
  });

  // const renderLeftSwitch = (id) => {
  //   switch (id) {
  //     case "you":
  //       ////console.log(`2uppppppppppppp`);
  //       return <AboutYouLeftPane />;
  //     case "organization":
  //       ////console.log(`3uppppppppppppp`);
  //       return <AboutOrganizationLeftPane />;
  //     case "subscribe":
  //       ////console.log(`4uppppppppppppp`);
  //       return <SubscribeLeftPane />;
  //     case "finish":
  //       ////console.log(`5uppppppppppppp`);
  //       return <FinishSetupLeftPane />;
  //     default:
  //       return null;
  //   }
  // };

  const renderRightSwitch = (id) => {
    switch (id) {
      case "you":
        return <AboutYou classes={classes} {...props} />;
      case "organization":
        return <AboutOrganization classes={classes} {...props} />;
      case "subscribe":
        return <Subscribe classes={classes} {...props} />;
      case "finish":
        return <FinishSetup classes={classes} {...props} />;
      default:
        return null;
    }
  };

  return (
    <div className={classes.root}>
      <HeroImage />
      <div className={classes.pageGrid}>
        <Paper elevation={0} className={classes.pageForm}>
          {renderRightSwitch(id)}
        </Paper>
      </div>
    </div>
  );
};

SignupDetail.propTypes = {
  history: PropTypes.object,
};

export default withRouter(SignupDetail);

