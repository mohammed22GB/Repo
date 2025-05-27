import { composeQueryString } from "../../common/utils/composeQueryString";
import { CustomAxios } from "../../common/utils/CustomAxios";

//  get list of dashboards
export const getDashboardsAPI = async (options) => {
  try {
    const queryStr = composeQueryString(options);
    if (queryStr === false) return { data: [] };

    const result = await CustomAxios().get(
      `${process.env.REACT_APP_ENDPOINT}/reports${queryStr}`
    );
    return result?.data;
  } catch (e) {
    return e;
  }
};

//  get single reports
export const getDashboardStructureAPI = async ({
  queryKey: [key, { slug }],
}) => {
  try {
    const result = await CustomAxios().get(
      `${process.env.REACT_APP_ENDPOINT}/reports/${slug}/edit`
    );
    return result?.data;
  } catch (e) {
    return e;
  }
};

//  create a report request
export const createDashboardAPI = async (data) => {
  // try {
  const result = await CustomAxios().post(
    `${process.env.REACT_APP_ENDPOINT}/reports`,
    data
  );
  return result?.data;
  // } catch (e) {
  //   return e;
  // }
};

// update a report request
export const updateDashboardAPI = async ({ id, ...data }) => {
  try {
    const result = await CustomAxios().put(
      `${process.env.REACT_APP_ENDPOINT}/reports/${id}`,
      data
    );
    return result?.data;
  } catch (e) {
    return e;
  }
};

export const updateDashboardNodesAPI = async ({ id, ...data }) => {
  try {
    const result = await CustomAxios().put(
      `${process.env.REACT_APP_ENDPOINT}/reports/${id}/nodes`,
      data
    );
    return result?.data;
  } catch (e) {
    return e;
  }
};

export const loadDashboardDataAPI = async ({ id }) => {
  try {
    const result = await CustomAxios().get(
      `${process.env.REACT_APP_ENDPOINT}/reports/${id}/load`
    );
    return result?.data;
  } catch (e) {
    return e;
  }
};

// duplicate a report request
export const duplicateDashboardAPI = async (data) => {
  try {
    const result = await CustomAxios().post(
      `${process.env.REACT_APP_ENDPOINT}/reports/duplicate`,
      data
    );
    return result?.data;
  } catch (e) {
    return e;
  }
};

// delete a report request
export const deleteDashboardAPI = async ({ id, ...data }) => {
  try {
    const result = await CustomAxios().delete(
      `${process.env.REACT_APP_ENDPOINT}/reports/${id}`
    );
    return result?.data;
  } catch (e) {
    return e;
  }
};
export const deleteDashboardNodesAPI = async ({ id, ...data }) => {
  try {
    const result = await CustomAxios().put(
      `${process.env.REACT_APP_ENDPOINT}/reports/${id}/nodes/remove`,
      data
    );
    return result?.data;
  } catch (err) {
    return err;
  }
};

export const clearDashboardTasksAPI = async (id) => {
  try {
    const result = await CustomAxios().put(
      `${process.env.REACT_APP_ENDPOINT}/reports/${id}/clear-tasks`
    );
    return result?.data;
  } catch (err) {
    return err;
  }
};

//  create new task
export const scheduleDashboardTaskAPI = async (data) => {
  //console.log(data);
  const { activate, reportId } = data;
  try {
    const result = await CustomAxios().put(
      `${process.env.REACT_APP_ENDPOINT}/reports/schedule/${reportId}/active`,
      { reportId }
    );

    return result?.data;
  } catch (e) {
    return e;
  }
};
