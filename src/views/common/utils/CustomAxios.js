import axios from "axios";
import { errorToastify } from "./Toastify";
import { unprotectedUrls } from "../utils/lists";
import { logoutClearLocalStorage } from "../helpers/helperFunctions";

//getting the token from the local storage
export const CustomAxios = (args) => {
  const overrideNotification = args?.overrideNotification || false;

  const accessToken =
    localStorage.getItem("accessToken") === null
      ? false
      : localStorage.getItem("accessToken");
  // created a custom axios that will used for mostly all request
  try {
    const axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_ENDPOINT,
      headers: {
        Authorization: `Bearer ${accessToken && accessToken}`,
        "Content-Type": "application/json",
      },
    });

    axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error?.response?.status === 401) {
          let redirect;
          const wasUnauthorized = localStorage.unauthorized;

          logoutClearLocalStorage(null, false);

          if (wasUnauthorized) {
            redirect = "";
          } else {
            localStorage.setItem("unauthorized", new Date().getTime());
            redirect = `?redirect=${window.location.pathname}${
              window.location.search || ""
            }`;
          }
          return (window.location.href = `${unprotectedUrls.LOGIN}${redirect}`);
        } else if (error?.response?.status === 403) {
          !overrideNotification &&
            errorToastify(
              error?.response?.data?._meta?.error?.message || "NOT AUTHOURIZED"
            );
        } else if (error?.response?.status === 500) {
          !overrideNotification &&
            errorToastify("Error occured. Kindly notify support.");
          // error.message = "Error occured. Kindly notify support.";
          error.response.data._meta.error.message =
            "Error occured. Kindly notify support.";
        } else if (error?.toString()?.toLowerCase()?.includes("network")) {
          errorToastify("Kindly check your connection and try again");
        }

        //  TODO: Tech-debt - throw error to calling function (could be conditional)
        /* if (error?.response) {
          return Promise.reject(error);
        } else {
          throw error;
        } */
        return error?.response ? Promise.reject(error) : error;
        // return Promise.reject(error);
      }
    );
    return axiosInstance;
  } catch (err) {
    console.log("error");
  }
};
