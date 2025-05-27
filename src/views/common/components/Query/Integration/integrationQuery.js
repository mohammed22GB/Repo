import { composeQueryString } from "../../../utils/composeQueryString";
import { CustomAxios } from "../../../utils/CustomAxios";

export const getAllIntegration = async ({
  queryKey: [, { type, propertyType }],
  queryKey,
}) => {
  const result = await CustomAxios().get(
    `${process.env.REACT_APP_ENDPOINT}/integrations?type=${type}&properties.type=${propertyType}&active=true&per_page=100`
  );
  return result.data;
};

export const getIntegrationDataAPI = async (options) => {
  const queryStr = composeQueryString(options);
  if (queryStr === false) return { data: [] };

  const result = await CustomAxios().get(
    `${process.env.REACT_APP_ENDPOINT}/integrations${queryStr}`
  );

  return result.data;
};

export const getDatasheetsAPI = async (options) => {
  const queryStr = composeQueryString(options);
  if (queryStr === false) return { data: [] };

  const result = await CustomAxios().get(
    `${process.env.REACT_APP_ENDPOINT}/datasheets${queryStr}`
  );

  return result.data;
};

export const getGoogleSheetSheet = async (options) => {
  const queryStr = composeQueryString(options);
  if (queryStr === false) return { data: [] };

  const result = await CustomAxios().get(
    `${process.env.REACT_APP_ENDPOINT}/google-apis/sheets${queryStr}`
  );

  return result.data;
};
