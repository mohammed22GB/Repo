import {
  GET_LIVE_DATA_START,
  GET_LIVE_DATA_SUCCESS,
  GET_LIVE_DATA_ERROR,
  GET_SCREENS_FROM_STORAGE,
  SET_LOADING_STATE,
  GET_SINGLE_SCREEN,
  UPDATE_WORKFLOW_INSTANCE,
  LIVE_RUN_FIRST_SCREEN,
  GET_LIVE_SCREEN_START,
  GET_LIVE_SCREEN_SUCCESS,
  GET_LIVE_SCREEN_ERROR,
  TASK_RUNNING,
  FILE_UPLOAD_START,
  FILE_UPLOAD_SUCCESS,
} from "../actions/actionTypes";

const initialState = {
  screensInfo: null,
  task: {},
  taskVariables: [],
  workflowInstance: {},
  app: {},
  loading: true,
  error: "",
  screen: { items: [] },
  runFirstScreen: null,
  screenLoading: false,
  screenError: "",
  taskRunning: false,

  // File Upload live data
  uploadingFile: {},
  filesUploaded: {},
};

export const liveData = (state = initialState, action) => {
  switch (action.type) {
    case LIVE_RUN_FIRST_SCREEN: {
      return {
        ...state,
        runFirstScreen: action.payload,
      };
    }
    case GET_LIVE_DATA_START: {
      return {
        ...state,
        ...initialState,
        loading: true,
      };
    }
    case GET_LIVE_DATA_SUCCESS: {
      return {
        ...state,
        ...initialState,
        ...action.payload,
        loading: false,
      };
    }
    case GET_LIVE_DATA_ERROR: {
      return {
        ...state,
        ...initialState,
        error: action.payload,
        loading: false,
      };
    }
    case GET_SINGLE_SCREEN: {
      return {
        ...state,
        screensInfo: action.payload,
        loading: false,
      };
    }
    case UPDATE_WORKFLOW_INSTANCE: {
      return {
        ...state,
        workflowInstance: action.payload,
        loading: false,
      };
    }
    case SET_LOADING_STATE: {
      return {
        ...state,
        loading: action.payload || false,
      };
    }
    case GET_SCREENS_FROM_STORAGE: {
      return {
        ...state,
        screensInfo: action.payload,
      };
    }
    case GET_LIVE_SCREEN_START: {
      return {
        ...state,
        screenLoading: true,
        screen: { items: [] },
        screenError: "",
      };
    }
    case GET_LIVE_SCREEN_SUCCESS: {
      return {
        ...state,
        screen: action.payload,
        screenLoading: false,
        screenError: "",
      };
    }
    case GET_LIVE_SCREEN_ERROR: {
      return {
        ...state,
        screen: { items: [] },
        screenLoading: false,
        screenError: action.payload,
      };
    }
    case TASK_RUNNING: {
      return {
        ...state,
        taskRunning: action.payload || false,
      };
    }
    case FILE_UPLOAD_START: {
      return {
        ...state,
        uploadingFile: action.payload,
      };
    }
    case FILE_UPLOAD_SUCCESS: {
      return {
        ...state,
        uploadingFile: action.payload.uploadingFile,
        filesUploaded: action.payload.filesUploaded,
      };
    }

    default:
      return state;
  }
};
