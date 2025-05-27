import { composeQueryString } from "./composeQueryString";
import { CustomAxios } from "./CustomAxios";

//  create a new event in user's calendar
export const requestUrlForGoogleAPI = async (data) => {
  const result = await CustomAxios().post(
    `${process.env.REACT_APP_ENDPOINT}/google-apis/auth-url`,
    data
  );
  return result.data;
};

//  get list of users' existing integrations
export const getGoogleUserIntegrationsAPI = async (options) => {
  // const queryStr = composeQueryString(options);
  // if(queryStr === false) return { data: [] };

  const result = await CustomAxios().get(
    `${process.env.REACT_APP_ENDPOINT}/google-apis/`
  );

  return result.data;
};

//  get list of user's calendars
export const getUserCalendarAPI = async (options) => {
  const queryStr = composeQueryString(options);
  if (queryStr === false) return { data: [] };

  const result = await CustomAxios().get(
    `${process.env.REACT_APP_ENDPOINT}/google-apis/calendars${queryStr}`
  );

  return result.data;
};

//  create a new event in user's calendar
export const createCalendarEventAPI = async (data) => {
  const result = await CustomAxios().post(
    `${process.env.REACT_APP_ENDPOINT}/workflows`,
    data
  );
  return result.data;
};

//  create a new event in user's calendar
export const fetchGoogleDriveFolderContents = async (
  integradtionId,
  folderId,
  contentType = "folders"
) => {
  const result = await CustomAxios().get(
    `${process.env.REACT_APP_ENDPOINT}/google-apis/drive/${integradtionId}/${folderId}/contents?contentType=${contentType}`
  );
  return result.data;
};
