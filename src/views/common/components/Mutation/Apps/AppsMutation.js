import { CustomAxios } from "../../../utils/CustomAxios";

// create an app request
export const createApp = async (data) => {
  const appResult = await CustomAxios().post(
    `${process.env.REACT_APP_ENDPOINT}/apps`,
    data
  );

  return appResult;
};

// create an app request
export const retrieveApp = async (data) => {
  try {
    const appResult = await CustomAxios().get(
      `${process.env.REACT_APP_ENDPOINT}/apps/${data.id}`
    );
    return appResult;
  } catch (err) {
    return err;
  }
};

// create an app request
export const upgradeApp = async ({ id, ...data }) => {
  try {
    const appResult = await CustomAxios().post(
      `${process.env.REACT_APP_ENDPOINT}/apps/${id}/upgrade`,
      data
    );
    return appResult;
  } catch (err) {
    return err;
  }
};

// delete an app request
export const deleteApp = async (appId) => {
  const result = await CustomAxios().delete(
    `${process.env.REACT_APP_ENDPOINT}/apps/${appId}`
  );
  return result;
};

// duplicate an app request
export const duplicateApps = async (data) => {
  const result = await CustomAxios().post(
    `${process.env.REACT_APP_ENDPOINT}/apps/duplicate`,
    data
  );
  return result;
};

// duplicate an app request
export const exportAppToFile = async (appId, appName) => {
  const response = await CustomAxios().post(
    `${process.env.REACT_APP_ENDPOINT}/apps/${appId}/export`,
    {},
    {
      responseType: "blob",
    }
  );

  // Create a Blob from the response data
  const pdfBlob = new Blob([response.data], { type: "application/pax" });

  // Create a temporary URL for the Blob
  const fileUrl = window.URL.createObjectURL(pdfBlob);

  // Create a temporary <a> element to trigger the download
  const tempLink = document.createElement("a");
  tempLink.href = fileUrl;
  tempLink.setAttribute(
    "download",
    `${appName}_export_${new Date().getTime()}.pax`
  ); // Set the desired filename for the downloaded file

  // Append the <a> element to the body and click it to trigger the download
  document.body.appendChild(tempLink);
  tempLink.click();

  // Clean up the temporary elements and URL
  document.body.removeChild(tempLink);
  window.URL.revokeObjectURL(fileUrl);

  return { success: true };
};

// duplicate an app request
export const createAppFromFile = async (formData) => {
  const response = await CustomAxios().post(
    `${process.env.REACT_APP_ENDPOINT}/apps/import`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data", // This is important for file uploads
      },
    }
  );

  return response;
};

// update an app request
export const updateApps = async ({ app, ...data }) => {
  const result = await CustomAxios().put(
    `${process.env.REACT_APP_ENDPOINT}/apps/${app}`,
    data
  );
  return result;
};

// publish an app
export const publishApp = async ({ id, active }) => {
  const result = await CustomAxios({ overrideNotification: true }).put(
    `${process.env.REACT_APP_ENDPOINT}/apps/${id}/active`,
    { active }
  );
  return result;
};

// trim app workflow variables
export const trimVariablesAppWorkflowAPI = async ({ id }) => {
  try {
    const result = await CustomAxios().put(
      `${process.env.REACT_APP_ENDPOINT}/apps/${id}/trim-variables`,
      {}
    );
    return result?.data;
  } catch (e) {
    return e;
  }
};

//Generate form fields with  AI text prompt
export const generateFormFieldsWithPrompt = async (data) => {
  try {
    const result = await CustomAxios().post(
      `${process.env.REACT_APP_ENDPOINT}/items/create-form-from-text-input`,
      data
    );
    return result;
  } catch (error) {
    throw error;
  }
};

//Generate form fields with  AI text prompt
export const generateWorkflowWithPrompt = async (data) => {
  try {
    const result = await CustomAxios().post(
      `${process.env.REACT_APP_ENDPOINT}/workflows/create-from-text-input`,
      data
    );
    return result;
  } catch (error) {
    throw error;
  }
};
