import { logoutClearLocalStorage } from "../helpers/helperFunctions";
import { errorToastify } from "./Toastify";

export const catchErr = ({ err, alertResMessage, statuscode, history }) =>
  err?.toString().toLowerCase().includes("network")
    ? errorToastify("Kindly check your connection and try again")
    : err?.response === undefined
    ? false
    : statuscode && statuscode === 401
    ? history && logoutClearLocalStorage(history)
    : alertResMessage && errorToastify(alertResMessage);
