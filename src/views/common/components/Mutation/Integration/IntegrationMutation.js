import { CustomAxios } from "../../../utils/CustomAxios";

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
