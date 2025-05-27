import { composeQueryString } from "../../common/utils/composeQueryString";
import { CustomAxios } from "../../common/utils/CustomAxios";
import { errorToastify } from "../../common/utils/Toastify";

export const getIntegrationDataAPI = async (options) => {
  const queryStr = composeQueryString(options);

  if (queryStr === false) {
    return { data: [] };
  }

  const result = await CustomAxios().get(
    `${process.env.REACT_APP_ENDPOINT}/integrations${queryStr}`
  );

  return result.data;
};

export const getIntegrationResourcesListAPI = async ({
  queryKey: [, { id }],
}) => {
  if (typeof id !== "string") {
    errorToastify("An error occurred. Please try again later. (Code: E112)");
    return { data: [] };
  }

  const result = await CustomAxios().get(
    `${process.env.REACT_APP_ENDPOINT}/integrations/resources/${id}`
  );

  return result.data;
};

export const newIntegrationAPI = async ({ data }) => {
  const result = await CustomAxios().post(
    `${process.env.REACT_APP_ENDPOINT}/integrations`,
    data
  );
  return result.data;
};

export const updateIntegrationAPI = async ({ id, data }) => {
  const result = await CustomAxios().put(
    `${process.env.REACT_APP_ENDPOINT}/integrations/${id}`,
    data
  );
  return result.data;
};

export const deleteIntegrationAPI = async ({ id }) => {
  const result = await CustomAxios().delete(
    `${process.env.REACT_APP_ENDPOINT}/integrations/${id}`
  );
  return result.data;
};

export const getGoogleSheetSheet = async (options) => {
  const queryStr = composeQueryString(options);
  if (queryStr === false) {
    return { data: [] };
  }

  const result = await CustomAxios().get(
    `${process.env.REACT_APP_ENDPOINT}/google-apis/sheets${queryStr}`
  );

  return result.data;
};
