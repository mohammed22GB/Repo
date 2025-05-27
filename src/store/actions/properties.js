import {
  APPLICATION_SET_STATUS,
  APPLICATION_SHOW_DIALOG,
  USERS_SAVE_USERGROUPS,
  ADD_HIDE_INVOICETABLE_LABEL,
  ADD_INVOICETABLE_BACK_COLOR,
  ADD_INVOICETABLE_BORDER_COLOR,
  ADD_INVOICETABLE_TAX,
  ADD_FILE_UPLOAD_LAYOUT,
  ADD_FILE_UPLOAD_COLOR,
  ADD_HIDE_LABEL,
  ADD_LABEL_NAME,
  ADD_LABEL_NAME_TEXT_STYLE,
  ADD_LABEL_NAME_TEXT_NAME,
  ADD_LABEL_NAME_TEXT_COLOR,
  ADD_FILE_PREFERENCE_TEXT,
  ADD_FILE_UPLOAD_FROM,
  ADD_LABEL_NAME_TEXT_SIZE,
  ADD_HIDE_TOOL_TIP,
  ADD_FILE_TOOLTIP_TEXT,
  UPDATE_PROP,
  ACTIVATE_CANVAS,
  SAVE_CANVAS,
  UIEDITOR_LOAD_SCREEN_STYLE,
  UIEDITOR_SET_DROPZONE,
  UIEDITOR_LOAD_CUSTOM_ELEMENTS,
  UIEDITOR_SET_ZOOM_LEVEL,
  UIEDITOR_SET_ACTIVE_COMPONENT,
  UIEDITOR_COMPONENT_STYLE_CHANGE,
  EDITOR_SHOW_RIGHT_SIDEBAR,
  SCREENS_SET_ACTIVE_SCREEN,
  WORKFLOWS_SET_WORKFLOWS_LIST,
  WORKFLOWS_SET_EDIT_WORKFLOW,
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
  UIEDITOR_TOGGLE_FULLSCREEN,
  PLUG_BACKEND_UPDATE_ERROR_BANK,
  SCREENS_SET_SCREENS_LIST,
  DISPLAY_TABLE_COLUMN,
  OPEN_APP_DETAILS_DIALOG,
  SET_PAGE_SEARCH_TEXT,
  SET_TRIGGER_NEW_USER_VALUE,
  SET_TRIGGER_NEW_USERGROUP_VALUE,
  SET_TRIGGER_NEW_CATEGORY_VALUE,
  WORKFLOWS_EXTERNAL_SET_ELEMENTS,
  WORKFLOW_IS_CRASHED,
  EDITOR_SET_LOADING_RIGHT_SIDEBAR,
  EDITOR_SET_ERROR_LOADING_RIGHT_SIDEBAR,
  UIEDITOR_SET_DRAG_START,
  UIEDITOR_SET_CANVAS_STRUCTURE,
  UIEDITOR_SET_SCREENS_ITEMS,
  UIEDITOR_SET_ACTIVE_ITEM,
  UIEDITOR_SET_SEARCHED_ELEMENTS,
  UIEDITOR_SET_CANVAS_MODE,
  WORKFLOWS_SET_HEAVY_TASKS,
  WORKFLOWS_SET_SHOULD_REFETCH_WORKFLOW,
  WORKFLOWS_SET_DATASHEETS,
  WORKFLOWS_TRIGGER_AI_VALUE_ON_CANVAS,
} from "./actionTypes";
import {
  APPS_SET_APPS_LIST,
  APPS_SET_CONTROL_MODE,
  SET_SELECTED_APP,
} from "./appsActions";

export const rSaveUserGroups = (userGroups) => ({
  type: USERS_SAVE_USERGROUPS,
  payload: {
    userGroups,
  },
});

export const addHideInvoiceTableLabelProp = (hide_invoicetable_label) => ({
  type: ADD_HIDE_INVOICETABLE_LABEL,
  payload: {
    hide_invoicetable_label,
  },
});

export const addInvoiceTableBackColorProp = (background_color, identity) => ({
  type: ADD_INVOICETABLE_BACK_COLOR,
  payload: {
    background_color,
    identity,
  },
});

export const addInvoiceTableBorderColorProp = (border_color, identity) => ({
  type: ADD_INVOICETABLE_BORDER_COLOR,
  payload: {
    border_color,
    identity,
  },
});

export const addInvoiceTableTaxProp = (content) => ({
  type: ADD_INVOICETABLE_TAX,
  payload: {
    content,
  },
});

export const addFileUploadLayoutProp = (content) => ({
  type: ADD_FILE_UPLOAD_LAYOUT,
  payload: {
    content,
  },
});

export const addFileUploadColorProp = (color) => ({
  type: ADD_FILE_UPLOAD_COLOR,
  payload: {
    color,
  },
});

export const addHideLabelProp = (hide_label) => ({
  type: ADD_HIDE_LABEL,
  payload: {
    hide_label,
  },
});

export const addLabelNameProp = (label_name) => ({
  type: ADD_LABEL_NAME,
  payload: {
    label_name,
  },
});

export const addLabelNameTextSizeProp = (label_name_text_size) => ({
  type: ADD_LABEL_NAME_TEXT_SIZE,
  payload: {
    label_name_text_size,
  },
});

export const addLabelNameTextStyleProp = (label_name_text_style) => ({
  type: ADD_LABEL_NAME_TEXT_STYLE,
  payload: {
    label_name_text_style,
  },
});

export const addLabelNameTextAlignProp = (label_name_text_align) => ({
  type: ADD_LABEL_NAME_TEXT_NAME,
  payload: {
    label_name_text_align,
  },
});

export const addLabelNameTextColorProp = (file_label_color) => ({
  type: ADD_LABEL_NAME_TEXT_COLOR,
  payload: {
    file_label_color,
  },
});

export const addFilePreferenceTextProp = (file_preference_text) => ({
  type: ADD_FILE_PREFERENCE_TEXT,
  payload: {
    file_preference_text,
  },
});

export const addFileUploadFromProp = (file_upload_from) => ({
  type: ADD_FILE_UPLOAD_FROM,
  payload: {
    file_upload_from,
  },
});

export const addHideToolTipProp = (hide_tool_tip) => ({
  type: ADD_HIDE_TOOL_TIP,
  payload: {
    hide_tool_tip,
  },
});

export const addFileTooltipTextProp = (file_tooltip_text) => ({
  type: ADD_FILE_TOOLTIP_TEXT,
  payload: {
    file_tooltip_text,
  },
});

export const updateProp = (action, value, componentType) => ({
  type: UPDATE_PROP,
  payload: {
    componentType,
    action,
    value,
  },
});
export const activeCanvas = (componentType, active) => ({
  type: ACTIVATE_CANVAS,
  payload: {
    componentType,
    data: active,
  },
});
export const saveCanvas = (workspaceID, layout) => ({
  type: SAVE_CANVAS,
  payload: {
    workspaceID,
    layout,
  },
});
export const setDropZone = (data) => ({
  type: UIEDITOR_SET_DROPZONE,
  payload: data,
});
export const saveDisplayTableColumn = (data) => ({
  type: DISPLAY_TABLE_COLUMN,
  payload: data,
});
export const loadScreenStyle = (style) => ({
  type: UIEDITOR_LOAD_SCREEN_STYLE,
  payload: style,
});
export const loadCustomElements = (customElements) => ({
  type: UIEDITOR_LOAD_CUSTOM_ELEMENTS,
  payload: customElements,
});
export const setCanvasZoomLevel = (level) => ({
  type: UIEDITOR_SET_ZOOM_LEVEL,
  payload: level,
});
export const activateElement = ({ componentsSelection }) => ({
  type: UIEDITOR_SET_ACTIVE_COMPONENT,
  payload: { componentsSelection },
});

export const rHideRightSideBar = (status) => ({
  type: EDITOR_SHOW_RIGHT_SIDEBAR,
  payload: status,
});
export const rSetErrorLoadingRightSideBar = (status) => ({
  type: EDITOR_SET_ERROR_LOADING_RIGHT_SIDEBAR,
  payload: status,
});
export const rSetLoadingRightSideBar = (status) => ({
  type: EDITOR_SET_LOADING_RIGHT_SIDEBAR,
  payload: status,
});
export const setApplicationStatus = (type, message) => ({
  type: APPLICATION_SET_STATUS,
  payload: { type, message },
});
export const rSetDialog = (data) => ({
  type: APPLICATION_SHOW_DIALOG,
  payload: data,
});

export const onChangeStyles = (payload) => ({
  type: UIEDITOR_COMPONENT_STYLE_CHANGE,
  payload,
});

export const rToggleUIEditorFullScreen = (data) => ({
  type: UIEDITOR_TOGGLE_FULLSCREEN,
  payload: data,
});

export const rUpdateScreensList = (payload) => ({
  type: SCREENS_SET_SCREENS_LIST,
  payload,
});

export const rSaveActiveScreen = (payload) => ({
  type: SCREENS_SET_ACTIVE_SCREEN,
  payload,
});

export const loadEditWorkflow = (id, name) => ({
  type: WORKFLOWS_SET_EDIT_WORKFLOW,
  payload: { id, name },
});

export const toggleWorkflowPanel = (togg) => ({
  type: WORKFLOWS_SHOW_TASKS,
  payload: togg,
});

export const rTriggerAiWorkflowValue = (value) => ({
  type: WORKFLOWS_TRIGGER_AI_VALUE_ON_CANVAS,
  payload: value,
});

export const rSelectApp = (data) => ({
  type: SET_SELECTED_APP,
  payload: data,
});

/* WITH NEW UIE MULTI ==============*/
export const rUieSetCanvasStructure = (data) => ({
  type: UIEDITOR_SET_CANVAS_STRUCTURE,
  payload: data,
});
export const rUieSetScreensItems = (data) => ({
  type: UIEDITOR_SET_SCREENS_ITEMS,
  payload: data,
});
export const rUieSetCanvasMode = (data) => ({
  type: UIEDITOR_SET_CANVAS_MODE,
  payload: data,
});
export const rUieSetSearchedElements = (data) => ({
  type: UIEDITOR_SET_SEARCHED_ELEMENTS,
  payload: data,
});
export const rUieSetDragStart = (data) => ({
  type: UIEDITOR_SET_DRAG_START,
  payload: data,
});
export const rUieActivateItem = (activeItem) => ({
  type: UIEDITOR_SET_ACTIVE_ITEM,
  payload: activeItem,
});
/* ========================== */

export const rSetWorkflowsList = (data) => ({
  type: WORKFLOWS_SET_WORKFLOWS_LIST,
  payload: data,
});

export const rSetWorkflowIntegrations = (data) => ({
  type: WORKFLOWS_SET_INTEGRATIONS,
  payload: data,
});

export const rSetWorkflowDatasheets = (data) => ({
  type: WORKFLOWS_SET_DATASHEETS,
  payload: data,
});

export const rSetWorkflowCrashed = (data) => ({
  type: WORKFLOW_IS_CRASHED,
  payload: data,
});

export const rSetActiveWorkflow = (data) => ({
  type: WORKFLOWS_SET_ACTIVE_WORKFLOW,
  payload: data,
});

export const rSelectActiveTask = (data) => ({
  type: WORKFLOWS_ACTIVE_ITEM,
  payload: data,
});

export const rShouldRefetchWorkflow = (value) => ({
  type: WORKFLOWS_SET_SHOULD_REFETCH_WORKFLOW,
  payload: value,
});

export const rAddToWorkflow = (activeItem) => ({
  type: WORKFLOWS_ADD_ITEM,
  payload: activeItem,
});

export const rUpdateWorkflowCanvas = (workflowCanvas) => {
  return {
    type: WORKFLOWS_UPDATE_CANVAS,
    payload: workflowCanvas,
  };
};

export const rLoadWorkflowTasks = (workflowTasks) => ({
  type: WORKFLOWS_SET_TASKS,
  payload: workflowTasks,
});

export const rWorkflowVariablesWarning = (heavyTasks) => ({
  type: WORKFLOWS_SET_HEAVY_TASKS,
  payload: heavyTasks,
});

export const rSetupBackDrop = (data) => ({
  type: WORKFLOWS_SET_BACKDROP,
  payload: data,
});

export const rSetWorkflowVariables = (data) => ({
  type: WORKFLOWS_SET_VARIABLES,
  payload: data,
});

export const rToggleWorkflowFullScreen = (data) => ({
  type: WORKFLOWS_TOGGLE_FULLSCREEN,
  payload: data,
});

export const rRemoteUpdateCanvasElements = (data) => ({
  type: WORKFLOWS_REMOTE_UPDATE_CANVAS_ELEMENTS,
  payload: data,
});

export const rExternalSetElements = (data) => ({
  type: WORKFLOWS_EXTERNAL_SET_ELEMENTS,
  payload: data,
});

export const updateBackendErrorBank = (data) => ({
  type: PLUG_BACKEND_UPDATE_ERROR_BANK,
  payload: data,
});

export const rSaveAppsList = (data) => ({
  type: APPS_SET_APPS_LIST,
  payload: data,
});

export const rSetAppsControlMode = (data) => ({
  type: APPS_SET_CONTROL_MODE,
  payload: data,
});

export const rOpenAppDetailsDialog = (data) => ({
  type: OPEN_APP_DETAILS_DIALOG,
  payload: data,
});

export const rSetPageSearchText = (input) => ({
  type: SET_PAGE_SEARCH_TEXT,
  payload: input,
});

export const rTriggerNewUserDialog = (randomValue) => ({
  type: SET_TRIGGER_NEW_USER_VALUE,
  payload: randomValue,
});

export const rTriggerNewUserGroupDialog = (randomValue) => ({
  type: SET_TRIGGER_NEW_USERGROUP_VALUE,
  payload: randomValue,
});

export const rTriggerNewCategoryDialog = (randomValue) => ({
  type: SET_TRIGGER_NEW_CATEGORY_VALUE,
  payload: randomValue,
});
