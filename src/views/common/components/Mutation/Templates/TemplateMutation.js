import { CustomAxios } from "../../../utils/CustomAxios";
import { errorToastify } from "../../../utils/Toastify";

export const createTemplate = async (data) => {
  const templateResult = await CustomAxios().post(
    `${process.env.REACT_APP_ENDPOINT}/templates`,
    data
  );

  return templateResult;
};

export const deleteTemplate = async (id) => {
  const result = await CustomAxios().delete(
    `${process.env.REACT_APP_ENDPOINT}/templates/${id}`
  );
  return result;
};

export const createAppFromTemplate = async (data) => {
  if (!data?.templateId) {
    errorToastify("Sorry, there's an error with this request.");
    return false;
  }
  const result = await CustomAxios().post(
    `${process.env.REACT_APP_ENDPOINT}/apps/from-template`,
    data
  );
  return result;
};

export const duplicateTemplates = async (data) => {
  const { app: template, ...datas } = data;
  const result = await CustomAxios().post(
    `${process.env.REACT_APP_ENDPOINT}/templates/duplicate`,
    { template, ...datas }
  );
  return result;
};

export const updateTemplates = async ({ app, ...data }) => {
  const result = await CustomAxios().put(
    `${process.env.REACT_APP_ENDPOINT}/templates/${app}`,
    data
  );
  return result;
};

export const publishTemplates = async ({ id, active }) => {
  const result = await CustomAxios().put(
    `${process.env.REACT_APP_ENDPOINT}/templates/${id}/active`,
    { active }
  );
  return result;
};
