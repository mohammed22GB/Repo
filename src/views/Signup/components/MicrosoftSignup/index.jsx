import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useMsal } from "@azure/msal-react";

import microsoftLogo from "../../../../assets/images/microsoft_logo.png";
import { errorToastify } from "../../../common/utils/Toastify";
import { unprotectedUrls } from "../../../common/utils/lists";
import useCustomMutation from "../../../common/utils/CustomMutation";
import { socialAuthMicrosoftSignup } from "../../../common/components/Mutation/Registration/registrationMutation";
import { loginRequest } from "../../../common/utils/msconfig";

const SignupMicrosoft = ({ btnMessage, classes }) => {
  const { instance } = useMsal();
  const history = useHistory();

  const handleSignupSuccess = ({ data }) => {
    const userId = data?.data?.id;
    const accountId = data?.data?.account;
    const accessToken = data?._meta?.accessToken;
    const userInfo = data?.data;

    if (!userId || !accountId)
      return errorToastify(
        "Sorry, an error occured with your Inputs. Kindly restart the registration."
      );

    localStorage.setItem("userId", userId);
    localStorage.setItem("accountId", accountId);
    localStorage.setItem("accessToken", accessToken);
    sessionStorage.setItem("accessToken", accessToken);
    localStorage.setItem("onboardingmode", "microsoftsignup");
    localStorage.setItem("userInfo", JSON.stringify(userInfo));

    history.push(unprotectedUrls.SIGNUP_DETAIL);
  };

  const { mutate: microsoftSignupMutate } = useCustomMutation({
    apiFunc: socialAuthMicrosoftSignup,
    onSuccess: handleSignupSuccess,
    retries: 0,
  });

  const signUpHandler = ({ instance, e }) => {
    e.preventDefault();
    instance
      .loginPopup(loginRequest)
      .then((res) => {
        const data = {
          accessToken: res?.accessToken,
          socialAuthId: res?.uniqueId,
          socialAuthType: "microsoft",
          email: res?.account?.username,
        };
        microsoftSignupMutate(data);
      })
      .catch((e) => {
        console.error(e);
      });
  };
  return (
    <>
      <Button
        className={classes.signUpButton}
        style={{ backgroundColor: "#ffffff", color: "#464D72" }}
        size="large"
        type="submit"
        variant="outlined"
        onClick={(e) => signUpHandler({ instance, e })}
      >
        <img alt="G" className={classes.microsoftIcon} src={microsoftLogo} />
        {btnMessage}
      </Button>
    </>
  );
};

export default SignupMicrosoft;
