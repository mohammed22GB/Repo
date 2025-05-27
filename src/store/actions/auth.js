import axios from "axios";

import { unprotectedUrls } from "../../views/common/utils/lists";
import { catchErr } from "../../views/common/utils/catchErr";
import { CustomAxios } from "../../views/common/utils/CustomAxios";
import { logoutClearLocalStorage } from "../../views/common/helpers/helperFunctions";

export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const LOGOUT_REQUEST = "LOGOUT_REQUEST";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const LOGOUT_FAILURE = "LOGOUT_FAILURE";
export const SET_CAPTCHA_TOKEN = "SET_CAPTCHA_TOKEN";

export const VERIFY_REQUEST = "VERIFY_REQUEST";
export const VERIFY_SUCCESS = "VERIFY_SUCCESS";

const requestLogin = () => {
  return {
    type: LOGIN_REQUEST,
  };
};

export const receiveLogin = (user) => {
  return {
    type: LOGIN_SUCCESS,
    user,
  };
};

export const loginError = (error) => {
  return {
    type: LOGIN_FAILURE,
    payload: error,
  };
};

const requestLogout = () => {
  return {
    type: LOGOUT_REQUEST,
  };
};

export const receiveLogout = () => {
  return {
    type: LOGOUT_SUCCESS,
  };
};

export const logoutError = () => {
  return {
    type: LOGOUT_FAILURE,
  };
};

const verifyRequest = () => {
  return {
    type: VERIFY_REQUEST,
  };
};

export const verifySuccess = () => {
  return {
    type: VERIFY_SUCCESS,
  };
};

const isOnboardingComplete = (user) => {
  const isOnboardingCompleteChecked =
    !user?.roles?.includes("Admin") ||
    (!!user.firstName &&
      !!user.lastName &&
      !!user?.account &&
      !!user?.account?.name &&
      !!user?.account?.slug &&
      !!user?.account?.country &&
      !!user?.account?.industry &&
      !!user?.account?.noOfEmployee);

  return isOnboardingCompleteChecked;
};

const commenceOnboarding = (accountId, mode = "verify") => {
  if (
    !window.location.href.includes(unprotectedUrls.SIGNUP_DETAIL) &&
    !window.location.href.includes(unprotectedUrls.SIGNUP) &&
    // (!window.location.href.includes("/login") || mode === "googlelogin") &&
    !(
      !!window.location.href.includes(unprotectedUrls.LOGIN) ===
      (mode === "googlelogin")
    ) &&
    !window.location.href.includes(unprotectedUrls.FORGOT_PASSWORD) &&
    !window.location.href.includes(unprotectedUrls.RESET_PASSWORD) &&
    !window.location.href.includes(unprotectedUrls.CREATE_PASSWORD)
  ) {
    localStorage.setItem("accountId", accountId);
    localStorage.setItem("onboardingmode", mode);
    window.location.href = unprotectedUrls.SIGNUP_DETAIL;
  }
};

export const loginUser = async ({ email, password, setLoading }, dispatch) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_ENDPOINT}/auth/login?population=["account"]`,
      { email, password },
      {
        "Content-Type": "application/json",
      }
    );

    if (res?.data?.data?.expectToken) {
      localStorage.setItem("login_preotp_email", res?.data?.data?.email);
      localStorage.setItem("preAccessToken", res?.data?._meta?.accessToken);
      return "OK";
    } else if (!!res?.data?._meta?.accessToken) {
      if (!dispatch || !setLoading) return;
      return dispatch(finalizeLogin(res));
    }
  } catch (err) {
    setLoading(false);
    // err.response &&
    catchErr({
      err,
      alertResMessage:
        err?.response?.data?._meta?.error?.message ||
        "Email or password is invalid",
    });
  }
};

export const finalizeLogin = (res) => (dispatch) => {
  dispatch(requestLogin());

  localStorage.setItem("userId", res?.data?.data?.id);
  localStorage.setItem("userInfo", JSON.stringify(res?.data?.data));
  localStorage.setItem("accessToken", res?.data?._meta?.accessToken);

  if (isOnboardingComplete(res?.data?.data)) {
    dispatch(receiveLogin(res?.data?.data));
  } else {
    return commenceOnboarding(res?.data?.data?.account?.id);
  }
};

export const sendVerifyEmailOTP = async () => {
  // dispatch(requestLogin());

  try {
    const res = await axios.put(
      `${process.env.REACT_APP_ENDPOINT}/users/send-verify-email`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("preAccessToken")}`,
        },
      }
    );

    return res;
  } catch (err) {
    catchErr({
      err,
      alertResMessage: err?.response?.data?._meta?.error?.message,
    });
  }
};

export const loginOTP = async ({ email, token, setLoading }, dispatch) => {
  // dispatch(requestLogin());

  try {
    const res = await axios.post(
      `${process.env.REACT_APP_ENDPOINT}/auth/verify-otp?population=["account"]`,
      { email, otp_code: token },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("preAccessToken")}`,
        },
      }
    );

    if (!!res?.data?._meta?.accessToken) {
      localStorage.removeItem("login_preotp_email");
      localStorage.removeItem("preAccessToken");

      return dispatch(finalizeLogin(res));
    }

    /* localStorage.setItem("userId", res?.data?.data?.id);
    localStorage.setItem("userInfo", JSON.stringify(res?.data?.data));
    localStorage.setItem("accessToken", res?.data?._meta?.accessToken);

    if (isOnboardingComplete(res?.data?.data)) {
      dispatch(receiveLogin(res?.data?.data));
    } else {
      //  go do your onboarding Sir!!!
      return commenceOnboarding(res?.data?.data?.account?.id);
    } */
    // })
  } catch (err) {
    setLoading(false);
    // err.response &&
    catchErr({
      err,
      alertResMessage:
        err?.response?.data?._meta?.error?.message ||
        "Invalid OTP. Click 'Resend' to send a code.",
    });
  }
};

export const enable2FA = async (bool, orgId) => {
  try {
    const res = await CustomAxios().put(
      `${process.env.REACT_APP_ENDPOINT}/accounts/${orgId}`,
      { twoFactorAuthEnabled: bool }
    );

    return res.data;
  } catch (err) {
    // setLoading(false);
    // err.response &&
    catchErr({
      err,
      alertResMessage:
        err?.response?.data?._meta?.error?.message ||
        "Unable to enable Two-factor Authentication. Try again later.",
    });
  }
};

export const googleLogin = (user) => (dispatch) => {
  //GET THE USERS DATA AND PASS IT THE AUTH
  if (isOnboardingComplete(user.data)) {
    dispatch(receiveLogin(user.data));
  } else {
    //  go do your onboarding Sir!!!
    return commenceOnboarding(user?.data?.account?.id, "googlelogin");
  }
};

// const microsoftLogout = (instance) => {
//   instance
//     .logoutPopup()
//     .then((res) => {
//       localStorage.clear();
//       sessionStorage.clear();
//     })
//     .catch((e) => {
//       console.error(e);
//     });

// history.push("/login");
// };
export const logoutUser =
  ({ signOut, instance }, history) =>
  (dispatch) => {
    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!storedUserInfo) {
      if (history) history.push(unprotectedUrls.LOGIN);
      else window.location.href = unprotectedUrls.LOGIN;
      return;
    }
    dispatch(receiveLogout());

    if (storedUserInfo["socialAuthType"]) {
      switch (storedUserInfo["socialAuthType"]) {
        case "microsoft":
          signOut();
          // dispatch(receiveLogout());
          break;
        // microsoftLogout(instance);

        case "google":
          // dispatch(receiveLogout());
          signOut();
          break;

        default:
          return () => {
            // dispatch(receiveLogout());
          };
      }
    } else {
      // dispatch(receiveLogout());
      // return handleEmailLogout(dispatch);
    }
    logoutClearLocalStorage(history);
    // if (history) history.push(unprotectedUrls.LOGIN);
    // else window.location.href = unprotectedUrls.LOGIN;
  };

export const verifyAuth = () => (dispatch) => {
  dispatch(verifyRequest());
  const user = JSON.parse(localStorage.getItem("userInfo"));
  if (user !== null) {
    if (isOnboardingComplete(user)) {
      localStorage.setItem("userId", user.id);
      dispatch(receiveLogin(user));
    } else {
      //  go do your onboarding Sir!!!
      return commenceOnboarding(user?.account?.id);
    }
  }
  dispatch(verifySuccess());
};

export const sendVerifyPhoneOTP = async (mobile) => {
  try {
    const res = await CustomAxios().put(
      `${process.env.REACT_APP_ENDPOINT}/users/send-verify-mobile`,
      { mobile }
    );
    return res;
  } catch (err) {
    catchErr({
      err,
      alertResMessage:
        err?.response?.data?._meta?.error?.message ||
        "Error verifying your phone number",
    });
  }
};

export const verifyPhoneOTP = async ({ token, setLoading }) => {
  try {
    const res = await CustomAxios().put(
      `${process.env.REACT_APP_ENDPOINT}/users/verify-mobile`,
      { mobileVerificationCode: token }
    );

    setLoading(false);
    return res;
  } catch (err) {
    setLoading(false);
    catchErr({
      err,
      alertResMessage:
        err?.response?.data?._meta?.error?.message || "Invalid Code",
    });
  }
};

export const sendVerificationEmail = async (email) => {
  //console.log(email);
  if (!email) return { type: "error", msg: "Invalid email address" };

  return await axios
    .put(
      `${process.env.REACT_APP_ENDPOINT}/auth/send-email-verification`,
      {
        email,
        redirectUrl: `${process.env.REACT_APP_BASE_URL}/welcome`,
      },
      { "Content-Type": "application/json" }
    )
    .then((res) => {
      if (!!res.data._meta.success)
        return { type: "success", msg: "Email sent successfully" };
      else return { type: "error", msg: "Error sending email" };
    })
    .catch((err) => {
      return { type: "error", msg: "Error. Please check your connection" };
    });
};

export const loginUserUsingSso = async (email) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_ENDPOINT}/auth/sso/login`,
      email
    );

    return res?.data?.data?.ssoLoginUrl;
  } catch (err) {
    catchErr({
      err,
      alertResMessage: err?.response?.data?._meta?.error?.message,
    });
  }
};
