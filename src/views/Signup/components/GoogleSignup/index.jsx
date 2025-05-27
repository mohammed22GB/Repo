import useCustomMutation from "../../../common/utils/CustomMutation";
import PropTypes from "prop-types";

import { Button } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";

import { errorToastify } from "../../../common/utils/Toastify";
import { unprotectedUrls } from "../../../common/utils/lists";
import { socialAuthSignup } from "../../../common/components/Mutation/Registration/registrationMutation";
import { googleLogin } from "../../../../store/actions";

const GoogleSignup = ({ classes, ...props }) => {
  const { history } = props;

  const dispatch = useDispatch();
  const btnMessage = props.btnMessage;

  /**
   * @typedef {{ data: Plug.User, _meta: Plug.Meta }} GoogleAuth
   * @param {import("axios").AxiosResponse<GoogleAuth>} response
   */
  const handleSignupSuccess = (response) => {
    const { data, _meta } = response.data;

    const userId = data?.id;
    const accountId = data?.account;
    const accessToken = _meta?.accessToken;

    if (!userId || !accountId) {
      return errorToastify(
        "Sorry, an error occured with your Inputs. Kindly restart the registration."
      );
    }

    localStorage.setItem("userId", userId);
    localStorage.setItem("accountId", accountId);
    localStorage.setItem("userInfo", JSON.stringify(data));
    localStorage.setItem("onboardingmode", "googlesignup");
    localStorage.setItem("accessToken", accessToken);

    dispatch(googleLogin(response.data));
    history.push(unprotectedUrls.SIGNUP_DETAIL);
  };

  const { mutate: googleSignInMutate } = useCustomMutation({
    apiFunc: socialAuthSignup,
    onSuccess: handleSignupSuccess,
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
      errorToastify(error);
    }
  };

  const googleSignup = useGoogleLogin({
    onSuccess,
    prompt: "consent",
    scope: "profile email",
    onError,
  });

  return (
    <Button
      className={classes.signUpButton}
      style={{ backgroundColor: "#ffffff", color: "#464D72" }}
      size="large"
      type="button"
      variant="outlined"
      onClick={googleSignup}
    >
      <img alt="G" className={classes.googleIcon} src="/images/google.png" />
      {btnMessage}
    </Button>
  );
};

GoogleSignup.propTypes = {
  history: PropTypes.object,
};

export default withRouter(GoogleSignup);
