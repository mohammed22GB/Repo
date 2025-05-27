import { composeQueryString } from "../../../../../common/utils/composeQueryString";
import { CustomAxios } from "../../../../../common/utils/CustomAxios";

//  get list of workflows
export const getDatasheetsAPI = async (options) => {
  const queryStr = composeQueryString(options);
  const perPage = 1000;
  if (queryStr === false) return { data: [] };

  const result = await CustomAxios().get(
    `${process.env.REACT_APP_ENDPOINT}/datasheets${queryStr}?per_page=${perPage}`
  );

  return result.data;
};

export const getCustomAPI = async (options) => {
  const queryStr = composeQueryString(options);
  if (queryStr === false) return { data: [] };

  const result = await CustomAxios().get(
    `${process.env.REACT_APP_ENDPOINT}/customapi${queryStr}`
  );

  return result.data;
};
