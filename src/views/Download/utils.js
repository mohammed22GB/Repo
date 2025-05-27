import axios from "axios";
import { CustomAxios } from "../common/utils/CustomAxios";

export const getDownloadInfo = async (id) => {
  if (!id) return;
  try {
    // created a custom axios that will used for mostly all request
    const result = await CustomAxios().get(
      `${process.env.REACT_APP_ENDPOINT}/files/predownload/${id}`
    );

    return result.data;
  } catch (err) {
    return {
      status: "error",
      response: err.response || err,
    };
  }
};

export const ddDownload = async (id, isPublic = false) => {
  if (!id) return;
  try {
    //getting the token from the local storage
    const accessToken =
      localStorage.getItem("accessToken") === null
        ? false
        : // : JSON.parse(localStorage.getItem("accessToken"));
          localStorage.getItem("accessToken");

    // created a custom axios that will used for mostly all request
    const result = await axios.get(
      `${process.env.REACT_APP_ENDPOINT}/files${
        isPublic ? "/public" : ""
      }/download/${id}`,
      {
        responseType: "blob",
        timeout: 30000,
        headers: {
          Authorization: `Bearer ${accessToken && accessToken}`,
        },
      }
    );

    return result;
  } catch (err) {
    return {
      status: "error",
      response: err.response || err,
    };
  }
};
