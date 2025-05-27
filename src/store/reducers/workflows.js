import {
  WORKFLOWS_SET_WORKFLOWS_LIST,
  WORKFLOWS_SHOW_TASKS,
  WORKFLOWS_SET_ACTIVE_WORKFLOW,
  WORKFLOWS_ACTIVE_ITEM,
  WORKFLOWS_ADD_ITEM,
  WORKFLOWS_UPDATE_CANVAS,
  WORKFLOWS_SET_TASKS,
  WORKFLOWS_SET_BACKDROP,
  WORKFLOWS_SET_VARIABLES,
  WORKFLOWS_TOGGLE_FULLSCREEN,
  WORKFLOWS_REMOTE_UPDATE_CANVAS_ELEMENTS,
  WORKFLOWS_SET_INTEGRATIONS,
  WORKFLOW_IS_CRASHED,
  WORKFLOWS_EXTERNAL_SET_ELEMENTS,
  WORKFLOWS_SET_HEAVY_TASKS,
  WORKFLOWS_SET_SHOULD_REFETCH_WORKFLOW,
  WORKFLOWS_SET_DATASHEETS,
  WORKFLOWS_TRIGGER_AI_VALUE_ON_CANVAS,
} from "../actions/actionTypes";

export const workflows = (
  state = {
    showTasks: false,
    workflowsList: [],

    workflowFullScreen: false,
    workflowCanvas: [],
    workflowTasks: {},
    activeWorkflow: {},
    activeTask: {},
    shouldRefetchWorkflow: false,
    externalSetElements: {},
    pos: 0,
    subworkflow: null,
    backDrop: {
      show: false,
      clickToHideBackdrop: true,
    },
    variables: [],
    remoteUpdateCanvasElements: [],
    workflowIntegrations: [],
    workflowDatasheets: [],
    isWorkflowCrashed: false,
    thisIsRedundatStateVariable: null,

    workflowHeavyTasks: [],
    triggerAiValueOnCanvas: false,
  },
  action
) => {
  switch (action.type) {
    case WORKFLOWS_SET_WORKFLOWS_LIST: {
      const workflowsList = action.payload;
      return {
        ...state,
        workflowsList,
      };
    }

    case WORKFLOWS_SET_SHOULD_REFETCH_WORKFLOW: {
      const shouldRefetchWorkflow = action.payload;
      return {
        ...state,
        shouldRefetchWorkflow,
      };
    }

    case WORKFLOWS_SHOW_TASKS: {
      const showTasks = action.payload;
      return {
        ...state,
        showTasks,
      };
    }

    case WORKFLOWS_SET_ACTIVE_WORKFLOW: {
      const activeWorkflow = action.payload;
      return {
        ...state,
        activeWorkflow,
      };
    }

    case WORKFLOWS_ACTIVE_ITEM: {
      const activeTask = action.payload;
      return {
        ...state,
        activeTask,
      };
    }

    case WORKFLOWS_ADD_ITEM: {
      const pos = action.payload;
      return {
        ...state,
        pos,
        backDrop: {
          show: true,
          clickToHideBackdrop: true,
        },
      };
    }

    case WORKFLOWS_UPDATE_CANVAS: {
      const workflowCanvas = action.payload;
      return {
        ...state,
        workflowCanvas,
      };
    }

    case WORKFLOWS_SET_TASKS: {
      const workflowTasks = action.payload;
      return {
        ...state,
        workflowTasks,
      };
    }

    case WORKFLOWS_SET_BACKDROP: {
      const backDrop = action.payload;
      return {
        ...state,
        backDrop,
      };
    }

    case WORKFLOWS_SET_VARIABLES: {
      const variables = action.payload;
      return {
        ...state,
        variables,
      };
    }

    case WORKFLOWS_REMOTE_UPDATE_CANVAS_ELEMENTS: {
      const remoteUpdateCanvasElements = action.payload;
      return {
        ...state,
        remoteUpdateCanvasElements,
      };
    }

    case WORKFLOWS_EXTERNAL_SET_ELEMENTS: {
      const externalSetElements = action.payload;
      return {
        ...state,
        externalSetElements,
      };
    }

    case WORKFLOWS_TOGGLE_FULLSCREEN: {
      const workflowFullScreen = action.payload;
      return {
        ...state,
        workflowFullScreen,
      };
    }

    case WORKFLOWS_SET_INTEGRATIONS: {
      const workflowIntegrations = action.payload;
      return {
        ...state,
        workflowIntegrations,
      };
    }

    case WORKFLOWS_SET_DATASHEETS: {
      const workflowDatasheets = action.payload;
      return {
        ...state,
        workflowDatasheets,
      };
    }

    case WORKFLOWS_SET_HEAVY_TASKS: {
      const workflowHeavyTasks = action.payload;
      return {
        ...state,
        workflowHeavyTasks,
      };
    }

    case WORKFLOW_IS_CRASHED: {
      const isWorkflowCrashed = action.payload;
      return {
        ...state,
        isWorkflowCrashed,
      };
    }

    case WORKFLOWS_TRIGGER_AI_VALUE_ON_CANVAS: {
      const triggerAiValueOnCanvas = action.payload;
      return {
        ...state,
        triggerAiValueOnCanvas,
      };
    }

    default:
      return state;
  }
};
