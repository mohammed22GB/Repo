import { composeQueryString } from "../../../../common/utils/composeQueryString";
import { CustomAxios } from "../../../../common/utils/CustomAxios";
import { errorToastify } from "../../../../common/utils/Toastify";

//  get list of workflows
export const getWorkflowsListAPI = async (options) => {
  const queryStr = composeQueryString(options);
  if (queryStr === false) return { data: [] };

  const result = await CustomAxios().get(
    `${process.env.REACT_APP_ENDPOINT}/workflows${queryStr}`
  );
  return result.data;
};

//  create a workflow request
export const createWorkflowAPI = async (data) => {
  try {
    const result = await CustomAxios().post(
      `${process.env.REACT_APP_ENDPOINT}/workflows`,
      data
    );
    return result?.data;
  } catch (e) {
    return e;
  }
};
export const createWorkflowNodesAPI = async ({ id, ...data }) => {
  try {
    const result = await CustomAxios().post(
      `${process.env.REACT_APP_ENDPOINT}/workflows/${id}/nodes`,
      data
    );
    return result?.data;
  } catch (e) {
    return e;
  }
};

// update a workflow request
export const updateWorkflowAPI = async ({ id, ...data }) => {
  if (!id) errorToastify("An error occurred.");

  try {
    const result = await CustomAxios().put(
      `${process.env.REACT_APP_ENDPOINT}/workflows/${id}`,
      data
    );
    return result?.data;
  } catch (e) {
    return e;
  }
};
export const updateWorkflowNodesAPI = async ({ id, ...data }) => {
  if (!id) errorToastify("An error occurred.");

  try {
    const result = await CustomAxios().put(
      `${process.env.REACT_APP_ENDPOINT}/workflows/${id}/nodes`,
      { ...data }
    );
    return result?.data;
  } catch (e) {
    return e;
  }
};

// duplicate a workflow request
export const duplicateWorkflowAPI = async (data) => {
  if (!data) errorToastify("An error occurred.");

  try {
    const result = await CustomAxios().post(
      `${process.env.REACT_APP_ENDPOINT}/workflows/duplicate`,
      data
    );
    return result?.data;
  } catch (e) {
    return e;
  }
};

// delete a workflow request
export const deleteWorkflowAPI = async ({ id, ...data }) => {
  if (!id) errorToastify("An error occurred.");

  try {
    const result = await CustomAxios().delete(
      `${process.env.REACT_APP_ENDPOINT}/workflows/${id}`
    );
    return result?.data;
  } catch (e) {
    return e;
  }
};

// recover crashed workflow
export const recoverWorkflowAPI = async (id) => {
  if (!id) errorToastify("An error occurred.");

  try {
    const result = await CustomAxios().put(
      `${process.env.REACT_APP_ENDPOINT}/workflows/${id}/recover-workflow`,
      {}
    );
    return result?.data;
  } catch (e) {
    return e;
  }
};

export const deleteWorkflowTaskAPI = async ({ id }) => {
  if (!id) errorToastify("An error occurred.");

  try {
    const result = await CustomAxios().delete(
      `${process.env.REACT_APP_ENDPOINT}/tasks/${id}`
    );
    return result?.data;
  } catch (err) {
    return err;
  }
};
export const deleteWorkflowNodesAPI = async ({ id, ...data }) => {
  try {
    const result = await CustomAxios().put(
      `${process.env.REACT_APP_ENDPOINT}/workflows/${id}/nodes`,
      { ...data, action: "remove" }
    );
    return result?.data;
  } catch (err) {
    return err;
  }
};

export const clearWorkflowTasksAPI = async (id) => {
  try {
    const result = await CustomAxios().put(
      `${process.env.REACT_APP_ENDPOINT}/workflows/${id}/clear-tasks`
    );
    return result?.data;
  } catch (err) {
    return err;
  }
};

/** This function is similar to clearWorkflowTasksAPI
 * but forces creation of absent workflow
 * */
export const forceResetWorkflowAPI = async (id) => {
  try {
    const result = await CustomAxios().post(
      `${process.env.REACT_APP_ENDPOINT}/apps/${id}/reset-workflow`
    );
    return result?.data;
  } catch (err) {
    return err;
  }
};

//  create new task
export const createWorkflowTaskAPI = async (data) => {
  try {
    const result = await CustomAxios().post(
      `${process.env.REACT_APP_ENDPOINT}/tasks`,
      data
    );

    return result?.data;
  } catch (e) {
    return { success: false, data: "Error clearing tasks" };
  }
};

//  get details of specific task
export const getWorkflowTaskAPI = async (options) => {
  try {
    const queryStr = composeQueryString(options);
    if (queryStr === false) return { data: [] };

    const result = await CustomAxios().get(
      `${process.env.REACT_APP_ENDPOINT}/tasks${queryStr}`
    );

    return result?.data;
  } catch (e) {
    return e;
  }
};

// update a workflow task request
export const updateWorkflowTaskAPI = async ({ id, ...data }) => {
  if (!id) errorToastify("An error occurred.");

  if (!Object.entries(data).length) return;

  try {
    const result = await CustomAxios().put(
      `${process.env.REACT_APP_ENDPOINT}/tasks/${id}`,
      data
    );
    return result?.data;
  } catch (e) {
    return e;
  }
};

//  get list of workflows
export const getReusedScreenDynamicContents = async (taskId) => {
  // const queryStr = composeQueryString(options);
  const queryStr = `?taskId=${taskId}&selection=properties._dynamicContentsStructure`;
  if (queryStr === false) return { data: [] };

  const result = await CustomAxios().get(
    `${process.env.REACT_APP_ENDPOINT}/tasks${queryStr}`
  );
  return result.data;
};
