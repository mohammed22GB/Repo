import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { useDispatch } from "react-redux";

import microsoftLogo from "../../../../assets/images/microsoft_logo.png";
import { loginRequest } from "../../../common/utils/msconfig";
import { googleLogin } from "../../../../store/actions";
import { mainNavigationUrls } from "../../../common/utils/lists";
import useCustomMutation from "../../../common/utils/CustomMutation";
import { socialAuthMicrosoftSignIn } from "../../../common/components/Mutation/Registration/registrationMutation";

const LoginMicrosoft = ({ btnMessage, classes }) => {
  const { instance } = useMsal();
  const dispatch = useDispatch();
  const history = useHistory();

  const handleSignInSuccess = ({ data }) => {
    localStorage.setItem("userId", data?.data?.id);
    localStorage.setItem("accountId", data?.data?.account?.id);
    localStorage.setItem("userInfo", JSON.stringify(data?.data));
    localStorage.setItem("accessToken", data?._meta?.accessToken);

    dispatch(googleLogin(data));
    history.push(mainNavigationUrls.APPS);
  };

  const { mutate: microsoftLoginMutate } = useCustomMutation({
    apiFunc: socialAuthMicrosoftSignIn,
    onSuccess: handleSignInSuccess,
    retries: 0,
  });

  const loginHandler = ({ instance, e }) => {
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
        microsoftLoginMutate(data);
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
        onClick={(e) => loginHandler({ instance, e })}
      >
        <img alt="G" className={classes.microsoftIcon} src={microsoftLogo} />
        {btnMessage}
      </Button>
    </>
  );
};

export default LoginMicrosoft;
