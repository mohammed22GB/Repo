import { APPS_CONTROL_MODES } from "../../views/EditorLayout/Pages/Workflow/components/utils/constants";
import { OPEN_APP_DETAILS_DIALOG } from "../actions/actionTypes";
import {
  APPS_SET_APPS_LIST,
  SELECTED_CATEGORY,
  SELECTED_SORT,
  SET_SORTPARAMS,
  APPS_SET_CONTROL_MODE,
  SET_SELECTED_APP,
  VERIFYSSO,
} from "../actions/appsActions";

const appsState = {
  appsAndTemplatesData: [],
  shouldDuplicate: false,
  selectedCategory: "All",
  selectedSort: "Last modified",
  appSortParams: { updatedAt: "desc" },
  appsControlMode: APPS_CONTROL_MODES.APP,
  openAppDetailsDialogToken: null,
  open: false,
  selectedApp: {},
  verifySSO: false,
};

export const appsReducer = (state = appsState, action) => {
  const { type, payload } = action;
  switch (type) {
    case APPS_SET_APPS_LIST:
      return { ...state, appsAndTemplatesData: payload };

    case SELECTED_CATEGORY:
      return { ...state, selectedCategory: payload };

    case SELECTED_SORT:
      return { ...state, selectedSort: payload };

    case SET_SORTPARAMS:
      return { ...state, appSortParams: payload };
    case APPS_SET_CONTROL_MODE:
      return { ...state, appsControlMode: payload };
    case OPEN_APP_DETAILS_DIALOG:
      return { ...state, openAppDetailsDialogToken: payload };
    case SET_SELECTED_APP:
      return { ...state, selectedApp: payload };
    case VERIFYSSO:
      return { ...state, verifySSO: payload };

    default:
      return state;
  }
};
