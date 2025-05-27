import { useCallback, useEffect } from "react";
import { GoogleReCaptcha, useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useDispatch } from "react-redux";
import { SET_CAPTCHA_TOKEN } from "../../store/actions";
import { errorToastify } from "../common/utils/Toastify";

const Recapture = () => {
  /* A hook that is used to dispatch actions to the Redux store. */
  const dispatch = useDispatch();

  /* A hook that is used to get the executeRecaptcha function from the useGoogleReCaptcha hook. */
  const { executeRecaptcha } = useGoogleReCaptcha();

  /* A function that is used to execute the recaptcha. */
  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha)
      return console.log("Execute recaptcha not yet available");

    /* Executing the recaptcha and returning the token. */
    try {
      const token = await executeRecaptcha("signUp");

      /* Dispatching an action to the Redux store. */
      dispatch({ type: SET_CAPTCHA_TOKEN, payload: token });
    } catch (err) {
      errorToastify("Kindly refresh this page to proceed");
    }
  }, [executeRecaptcha, dispatch]);

  // You can use useEffect to trigger the verification as soon as the component being loaded
  useEffect(() => {
    handleReCaptchaVerify();
  }, [handleReCaptchaVerify]);

  return <GoogleReCaptcha onVerify={handleReCaptchaVerify} />;
};

export default Recapture;
