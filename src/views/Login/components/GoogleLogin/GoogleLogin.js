import PropTypes from "prop-types";

import useCustomMutation from "../../../common/utils/CustomMutation";

import { Button } from "@material-ui/core";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

import { mainNavigationUrls } from "../../../common/utils/lists";
import { socialAuthSignIn } from "../../../common/components/Mutation/Registration/registrationMutation";
import { errorToastify } from "../../../common/utils/Toastify";
import { googleLogin } from "../../../../store/actions";

const GoogleLogin = ({ classes, btnMessage, dispatch }) => {
  const history = useHistory();

  const onLoginSuccess = (response) => {
    const { data, _meta } = response.data;

    const userId = data?.id;
    const accountId = data?.account?.id;
    const accessToken = _meta?.accessToken;

    localStorage.setItem("userId", userId);
    localStorage.setItem("accountId", accountId);
    localStorage.setItem("userInfo", JSON.stringify(data));
    localStorage.setItem("accessToken", accessToken);

    dispatch(googleLogin(response.data));
    history.push(mainNavigationUrls.APPS);
  };

  const { mutate: googleSignInMutate } = useCustomMutation({
    apiFunc: socialAuthSignIn,
    onSuccess: onLoginSuccess,
    retries: 0,
  });

  /**
   * @param {GoogleAuth} res
   */
  const onSuccess = (res) => {
    localStorage.setItem("status", "old");

    googleSignInMutate({
      socialAuthType: "google",
      accessToken: res.access_token,
    });
  };

  const onError = ({ error }) => {
    const expectedErrors = [
      null,
      "popup_closed_by_user",
      "idpiframe_initialization_failed",
    ];

    if (!expectedErrors.includes(error)) {
      errorToastify("An error occurred, kindly try again.");
    }
  };

  const googleAuthLogin = useGoogleLogin({
    onSuccess,
    prompt: "consent",
    scope: "profile email",
    onError,
  });

  return (
    <Button
      className={classes?.signUpButton}
      style={{ backgroundColor: "#ffffff", color: "#464D72" }}
      size="large"
      type="button"
      variant="outlined"
      onClick={googleAuthLogin}
    >
      <img alt="G" className={classes.googleIcon} src="/images/google.png" />
      {btnMessage}
    </Button>
  );
};

GoogleLogin.propTypes = {
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
export default connect(mapStateToProps)(GoogleLogin);
