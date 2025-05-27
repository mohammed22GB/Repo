import axios from "axios";
import { CustomAxios } from "../common/utils/CustomAxios";
import { sanitize } from "../common/utils/sanitize";

export const getWorkflowInstances = async ({
  page = 1,
  perPage = 10,
  filterLevel,
  statusVal,
  category,
  taskStatus,
  sortLevel,
}) => {
  try {
    const population = [
      {
        path: "approvalHistory",
        populate: "task",
      },
      {
        path: "app",
        populate: [
          {
            path: "category",
            select: "name",
          },
          {
            path: "account",
          },
        ],
        select: "name slug active deleted",
      },
      {
        path: "user",
        select: "firstName lastName",
      },
      {
        path: "task",
        select: "name type properties.screen",
        populate: {
          path: "properties.screen",
          select: "name slug type",
          model: "Screen",
        },
      },
    ];

    const sort =
      sortLevel && Object.keys(sortLevel).length
        ? { [sortLevel.name]: sortLevel.type }
        : null;

    const params = {
      page,
      per_page: perPage,
      population,
      filterLevel,
      status: statusVal,
      "app.category": category,
      "taskStatus.status": taskStatus,
      sort,
    };

    const url = axios.getUri({
      baseURL: process.env.REACT_APP_ENDPOINT,
      url: "/workflow-instances",
      params: sanitize(params),
    });

    /**
     * @type {import("axios").AxiosResponse<{ _meta: Plug.Meta, data: Plug.WorkflowInstance[] }>}
     */
    const { data } = await CustomAxios().get(url);
    return { success: true, data };
  } catch (error) {
    return { success: false, data: "Error getting screens" };
  }
};

export const getflowInstanceStatus = async () => {
  try {
    const { data } = await CustomAxios().get(
      `${process.env.REACT_APP_ENDPOINT}/workflow-instances/analytics/status`
    );
    return data;
  } catch (error) {
    return { success: false, data: "Error getting screens" };
  }
};

export const filterWorkFlowInstance = async ({
  page,
  status,
  category,
  appName,
  perPage = 10,
}) => {
  try {
    const population = [
      {
        path: "approvalHistory",
        populate: "task",
      },
      {
        path: "app",
        populate: {
          path: "category",
          select: "name",
        },
        select: "name",
      },
      {
        path: "user",
        select: "firstName lastName",
      },
      {
        path: "task",
        select: "name type",
      },
    ];

    const params = {
      page,
      status,
      "app.category": category,
      "app.name": appName,
      per_page: perPage,
      population,
    };

    const url = axios.getUri({
      baseURL: process.env.REACT_APP_ENDPOINT,
      url: "/workflow-instances",
      params: sanitize(params),
    });

    const { data } = await CustomAxios().get(url);
    return { success: true, data };
  } catch (error) {
    return { success: false, data: "Error getting screens" };
  }
};
export const getSingleWorkflowInstance = async ({ id }) => {
  try {
    const populationQuery = [
      {
        path: "taskStatus",
        populate: {
          path: "task",
          select: "name type",
        },
        select: "type status updatedAt",
      },
      {
        path: "approvalHistory",
        populate: {
          path: "user",
          select: "firstName lastName",
        },
      },
      {
        path: "workflow",
        select: "name tasks",
      },
      {
        path: "user",
        select: "firstName lastName",
      },
      {
        path: "app",
        select: "name description",
        populate: {
          path: "category",
          select: "name",
        },
      },
      {
        path: "task",
        select: "name type assignedTo",
      },
    ];

    const populationQueryString = JSON.stringify(populationQuery);

    const { data } = await CustomAxios().get(
      `${process.env.REACT_APP_ENDPOINT}/workflow-instances/${id}?population=${populationQueryString}`
    );
    return { success: true, data };
  } catch (error) {
    return { success: false, data: "Error getting screens" };
  }
};

export const reminderMail = async (data) => {
  const { taskId, workflowInstanceId } = data;
  try {
    const results = await CustomAxios().post(
      `${process.env.REACT_APP_ENDPOINT}/tasks/send-reminder-mail`,
      { taskId, workflowInstanceId }
    );
    return results;
  } catch (error) {
    return { error, msg: "Error sending mails" };
  }
};

export const ressignTask = async (data) => {
  const { taskId, workflowInstanceId } = data;
  try {
    const results = await CustomAxios().post(
      `${process.env.REACT_APP_ENDPOINT}/tasks/reassign`,
      data
    );
    return results;
  } catch (error) {
    return { error, msg: "Error sending mails" };
  }
};
