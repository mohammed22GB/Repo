import { composeQueryString } from "./composeQueryString";
import { CustomAxios } from "./CustomAxios";

//  create a new connection
export const requestUrlForDocuSignAPI = async (data) => {
  const result = await CustomAxios().post(
    `${process.env.REACT_APP_ENDPOINT}/docusign-apis/auth-url`,
    data
  );
  return result.data;
};

//  get list of users' existing integrations
export const getDocusignUserIntegrationsAPI = async (options) => {
  // const queryStr = composeQueryString(options);
  // if(queryStr === false) return { data: [] };

  const result = await CustomAxios().get(
    `${process.env.REACT_APP_ENDPOINT}/docusign-apis/`
  );

  return result.data;
};

//  get list of user's templates
export const getUserTemplatesAPI = async (options) => {
  const queryStr = composeQueryString(options);
  if (queryStr === false) return { data: [] };

  const result = await CustomAxios().get(
    `${process.env.REACT_APP_ENDPOINT}/docusign-apis/envelope-templates${queryStr}`
  );

  return result.data;
};

//  get list of user's template recipients
export const getUserRecipientsAPI = async (options) => {
  const queryStr = composeQueryString(options);
  if (queryStr === false) return { data: [] };

  const result = await CustomAxios().get(
    `${process.env.REACT_APP_ENDPOINT}/docusign-apis/template-recipients${queryStr}`
  );

  return result.data;
};

//  get list of user's template documents
export const getUserDocumentsAPI = async (options) => {
  const queryStr = composeQueryString(options);
  if (queryStr === false) return { data: [] };

  const result = await CustomAxios().get(
    `${process.env.REACT_APP_ENDPOINT}/docusign-apis/template-documents${queryStr}`
  );

  return result.data;
};

//  get list of user's document tabs
export const getUserTabsAPI = async (options) => {
  const queryStr = composeQueryString(options);
  if (queryStr === false) return { data: [] };

  const result = await CustomAxios().get(
    `${process.env.REACT_APP_ENDPOINT}/docusign-apis/document-tabs${queryStr}`
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
