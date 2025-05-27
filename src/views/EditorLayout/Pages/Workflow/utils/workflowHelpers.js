import {
  rSelectActiveTask,
  rHideRightSideBar,
  rUpdateWorkflowCanvas,
  rLoadWorkflowTasks,
  rSetWorkflowVariables,
  rToggleWorkflowFullScreen,
  rSetWorkflowsList,
  rSetActiveWorkflow,
  rSetWorkflowIntegrations,
  rSetWorkflowCrashed,
  rSetLoadingRightSideBar,
  rSetErrorLoadingRightSideBar,
  rSetWorkflowDatasheets,
} from "../../../../../store/actions/properties";
import {
  getWorkflowTaskAPI,
  updateWorkflowTaskAPI,
  clearWorkflowTasksAPI,
  updateWorkflowNodesAPI,
  getWorkflowsListAPI,
  createWorkflowNodesAPI,
  deleteWorkflowNodesAPI,
  forceResetWorkflowAPI,
} from "./workflowAPIs";
import { getIntegrationDataAPI } from "../../../../Integrations/utils/integrationsAPIs";
import { groupIntegrations } from "./tasksHelpers";
import {
  logEndpointError,
  SetAppStatus,
  updateEndpointError,
  wrapAPI,
  wrapDebounceAPI,
} from "../../../../common/helpers/helperFunctions";
import { errorToastify } from "../../../../common/utils/Toastify";
import { mainNavigationUrls } from "../../../../common/utils/lists";
import { getDatasheetsAPI } from "../components/utils/temporaryDataSheetAPI";

const preWorkflowAPIs = async (dispatch, func, ...args) => {
  dispatch(SetAppStatus({ type: "info", msg: "..." }));

  const resp = await func(...args);

  // const resp = await func(...args);
  if (resp?.data?._meta?.success || resp?._meta?.success) {
    dispatch(SetAppStatus({ type: "info", msg: "" }));

    //  update endpoint error log
    if (!args?.[0]?.noLogError) {
      dispatch(
        updateEndpointError("Workflow Editor", "update", "workflows", ...args)
      );
    }

    return resp;
  } else {
    dispatch(
      SetAppStatus({ type: "error", msg: "An error occured (Network)" })
    );

    //  add to endpoint error log
    if (!args?.[0]?.noLogError) {
      dispatch(
        logEndpointError(
          "Workflow Editor",
          "update",
          "workflows",
          preWorkflowAPIs,
          func,
          "argument",
          "",
          null,
          ...args
        )
      );
    }

    return "error";
  }
};

export const getAllWorkflows =
  (appId, refresh, history, syncVariables) => async (dispatch, getState) => {
    const { workflowsList, activeWorkflow } = getState().workflows;
    let returnedWorkflowsList = workflowsList;

    if (!workflowsList?.length || refresh) {
      //  get workflows from backend
      try {
        const workflowsData = await dispatch(
          wrapAPI(getWorkflowsListAPI, "Workflows loaded", {
            query: {
              app: appId,
              syncVariables,
              selection: [
                "id",
                "name",
                "app",
                "variables",
                "tasks",
                "createdAt",
              ],
            },
            noLogError: true,
          })
        );
        if (workflowsData?._meta?.success) {
          returnedWorkflowsList = workflowsData?.data?.map((workflow) => {
            const { tasks, variables, ...otherInfo } = workflow;
            return otherInfo;
          });

          //  load data into state for canvas
          dispatch(rSetWorkflowsList(returnedWorkflowsList));
        } else {
          if (workflowsData?.toLowerCase()?.includes("network")) {
            return;
          }
          errorToastify("Invalid URL. Kindly check and try again.");
          !!history && history.push(mainNavigationUrls.APPS);
          return;
        }

        const newActive = returnedWorkflowsList?.[0] || {};
        let activeWF;

        if (refresh) {
          const updatedActive = returnedWorkflowsList.find(
            (screen) => screen.id === activeWorkflow?.id
          );
          activeWF = updatedActive || newActive;
          dispatch(rSetActiveWorkflow(activeWF));
        } else if (
          !activeWorkflow ||
          !returnedWorkflowsList.find(
            (workflow) => workflow.id === activeWorkflow?.id
          )
        ) {
          activeWF = newActive;
          dispatch(rSetActiveWorkflow(activeWF));
        }

        //  load task details from db
        const activeWorkflowFullData = workflowsData?.data?.[0];

        if (activeWorkflowFullData?.tasks?.length >= 2) {
          dispatch(rSetWorkflowCrashed(false));
        } else {
          //  workflow has crashed
          dispatch(rSetWorkflowCrashed(true));
        }

        dispatch(rUpdateWorkflowCanvas(activeWorkflowFullData?.tasks || []));
        dispatch(
          rSetWorkflowVariables(activeWorkflowFullData?.variables || [])
        );
      } catch (err) {
        // console.log(`E R R R O R`);
      }
    }
    return returnedWorkflowsList || [];
  };

export const getAllWorkflowIntegrations =
  (refresh, groupArray) => async (dispatch, getState) => {
    const { workflowIntegrations } = getState().workflows;
    let returnWorkflowIntegrations = workflowIntegrations;

    if (!Object.keys(workflowIntegrations)?.length || refresh) {
      //  get integrations from backend
      const data = await dispatch(
        wrapAPI(getIntegrationDataAPI, "Integrations loaded", {
          query: {
            active: true,
            disabled: false,
            per_page: 1000,
          },
          noLogError: true,
        })
      );

      if (data?._meta?.success) {
        returnWorkflowIntegrations = groupIntegrations(data?.data, groupArray);
        //  load data into state
        dispatch(rSetWorkflowIntegrations(returnWorkflowIntegrations));
      }
    }
    return returnWorkflowIntegrations || [];
  };

export const getAllWorkflowDatasheets =
  (refresh) => async (dispatch, getState) => {
    const { workflowDatasheets } = getState().workflows;
    let returnWorkflowDatasheets = workflowDatasheets;

    if (!Object.keys(workflowDatasheets)?.length || refresh) {
      const data = await dispatch(
        wrapAPI(getDatasheetsAPI, "Datasheets loaded", {
          query: {
            per_page: 1000,
          },
          noLogError: true,
        })
      );

      if (data?._meta?.success) {
        returnWorkflowDatasheets = data?.data;
        //  load data into state
        dispatch(rSetWorkflowDatasheets(returnWorkflowDatasheets));
      }
    }
    return returnWorkflowDatasheets || [];
  };

export const loadTask = (taskInfo) => async (dispatch, getState) => {
  let {
    workflowTasks: { ...currentWorkflowTasks },
  } = getState().workflows;
  const selectedApp = getState().appsReducer.selectedApp;
  const appId = selectedApp?.id || selectedApp?._id;
  const { taskId, type } = taskInfo;

  dispatch(rSetErrorLoadingRightSideBar(false));
  dispatch(rSetLoadingRightSideBar(true));

  if (taskInfo.app) {
    currentWorkflowTasks[taskId] = taskInfo;
  }
  //  if task is not already (fully) loaded into global state
  else if (!currentWorkflowTasks?.[taskId]?.app && appId) {
    //  fetch from API
    const task = await preWorkflowAPIs(dispatch, getWorkflowTaskAPI, {
      query: {
        taskId,
        app: appId,
      },
      noLogError: true,
    });

    const state_ = getState().workflows;
    const workflowTasks = state_.workflowTasks;

    const selectedTaskDetails = task?.data?.[0];
    currentWorkflowTasks = { ...workflowTasks };

    if (selectedTaskDetails) {
      currentWorkflowTasks[taskId] = selectedTaskDetails;
    } else {
      dispatch(rSetErrorLoadingRightSideBar(true));
    }
  } else if (!currentWorkflowTasks?.[taskId]?.app && !appId) {
    dispatch(rSetErrorLoadingRightSideBar(true));
    errorToastify("Please reload screen to proceed.");
  }

  dispatch(rLoadWorkflowTasks(currentWorkflowTasks));
  dispatch(rSelectActiveTask({ id: taskId, type }));
  dispatch(rHideRightSideBar(false));
  dispatch(rSetLoadingRightSideBar(false));
};

export const updateWorkflowCanvas =
  (changed, canvasAction) => async (dispatch, getState) => {
    const { id: workflowId } = getState().workflows.activeWorkflow;

    let response;

    switch (canvasAction) {
      case "new":
        response = await preWorkflowAPIs(dispatch, createWorkflowNodesAPI, {
          ...changed,
          id: workflowId,
          nodeId: changed.id,
        });

        break;

      case "connect":
        response = await preWorkflowAPIs(dispatch, createWorkflowNodesAPI, {
          ...changed,
          id: workflowId,
          nodeId: changed.id,
        });

        break;

      case "reconnect":
        response = await preWorkflowAPIs(dispatch, updateWorkflowNodesAPI, {
          nodeId: changed.id,
          ...changed,
          //  this is so we can use workflow id as url param
          id: workflowId,
          action: "reconnect",
        });
        break;

      case "move":
        response = await preWorkflowAPIs(dispatch, updateWorkflowNodesAPI, {
          nodeId: changed.id,
          ...changed,
          //  this is so we can use workflow id as url param
          id: workflowId,
          action: "move",
        });
        break;

      case "del":
        response = await preWorkflowAPIs(dispatch, deleteWorkflowNodesAPI, {
          removed: changed,
          id: workflowId,
        });
        break;

      default:
        break;
    }

    if (response?._meta?.success) {
      const newTask = response?.data?.task;

      if (response?.data?.workflow) {
        const updatedWorkflow = response?.data?.workflow;
        if (updatedWorkflow?.variables) {
          const updatedVariables = updatedWorkflow?.variables;

          if (updatedVariables) {
            dispatch(rSetWorkflowVariables(updatedVariables));
          }
        }
      }

      if (newTask) {
        dispatch(loadTask(newTask));
      }
    }
  };

export const updateWorkflowTask =
  (update, data, saveToDB, refreshTask) => async (dispatch, getState) => {
    const state = getState().workflows;
    const { workflowTasks, workflowCanvas } = state;

    const currentValue = { ...workflowTasks };

    const oldData = { ...currentValue[data.taskId] };
    currentValue[data.taskId] = {
      ...oldData,
      ...data,
      new: false,
    };

    //  check if updated fields include 'name' or 'configure' or 'properties.screenType'
    //  and then save in canvas for quick access

    let workflowCanvas_,
      toChange = false;
    Object.entries(update).forEach((entry) => {
      if (
        [
          "name",
          "configured",
          "properties.screenType",
          "properties.hasDecision",
        ].includes(entry[0])
      ) {
        workflowCanvas_ = workflowCanvas?.map((element) => {
          if (element?.id === data.taskId) {
            element[entry[0]?.replace("properties.", "")] = entry[1];
            toChange = true;
          }
          return element;
        });
      }
    });

    if (toChange) {
      dispatch(rUpdateWorkflowCanvas(workflowCanvas_));
    }

    dispatch(rLoadWorkflowTasks(currentValue));

    const handleResponse = (response) => {
      if (response?._meta?.success && response.data?.workflwoVariables) {
        const updatedVariables = response.data?.workflwoVariables;
        dispatch(rSetWorkflowVariables(updatedVariables));
      }

      if (response?._meta?.success && response.data?.tasks && refreshTask) {
        const updatedTasks = response.data?.tasks;
        const tasks = {};

        for (let updatedTask of updatedTasks) {
          if (!updatedTask?.id) {
            updatedTask.id = updatedTask._id;
          }
          tasks[updatedTask.taskId] = updatedTask;
        }

        const updatedValue = {
          ...currentValue,
          ...tasks,
        };

        dispatch(rLoadWorkflowTasks(updatedValue));
      }
    };

    //  save to DB
    if (saveToDB) {
      update.id = oldData.id;

      // await preThisAPI(dispatch, updateWorkflowTaskAPI, update);
      const response = await dispatch(
        wrapDebounceAPI(updateWorkflowTaskAPI, "", {
          callback: handleResponse,
          category: "task",
          ...update,
        })
      );
    }
  };

export const clearWorkflowCanvas = () => async (dispatch, getState) => {
  const { id: workflowId } = getState().workflows.activeWorkflow;
  const { id: appId } = getState().appsReducer.selectedApp;

  let workflow;

  if (workflowId) {
    workflow = await preWorkflowAPIs(
      dispatch,
      clearWorkflowTasksAPI,
      workflowId
    );
  } else {
    workflow = await preWorkflowAPIs(dispatch, forceResetWorkflowAPI, appId);

    const { tasks, variables, ...otherInfo } = workflow?.data;

    dispatch(rSetWorkflowCrashed(false));
    dispatch(rSetWorkflowsList([otherInfo]));
    dispatch(rSetActiveWorkflow(workflow?.data));
  }

  dispatch(rLoadWorkflowTasks({}));
  dispatch(clearActiveTask());

  if (!workflow?.data) {
    return;
  }

  dispatch(rUpdateWorkflowCanvas(workflow?.data?.tasks || []));
  dispatch(rSetWorkflowVariables(workflow?.data?.variables || []));
};

export const clearActiveTask = () => (dispatch, getState) => {
  dispatch(rSelectActiveTask({}));
  dispatch(rHideRightSideBar(true)); //  display rightsidebar
};

export const toggleWorkflowFullScreen = () => (dispatch, getState) => {
  const { workflowFullScreen } = getState().workflows;
  dispatch(rToggleWorkflowFullScreen(!workflowFullScreen));
};

export const updateTaskVariables =
  (taskId, newVariables) => async (dispatch, getState) => {
    const { id: workflowId } = getState().workflows.activeWorkflow;

    const payload = {
      id: workflowId,
      taskId,
      action: "updateVariables",
      variablesInfo: newVariables,
    };

    const returnedResponse = await preWorkflowAPIs(
      dispatch,
      updateWorkflowNodesAPI,
      payload
    );

    if (returnedResponse?._meta?.success) {
      const variables = returnedResponse?.data?.workflowVariables;

      dispatch(rSetWorkflowVariables(variables || []));
    }
  };
