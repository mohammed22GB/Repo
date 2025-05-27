export const CDN_URL = "https://storage.googleapis.com/plug_cdn/";

export const LOREM_IPSUM = "Lorem ipsum dolor sit amet...";

export const LAST_MAJOR_APP_BE_VERSION = "1.1.4";
export const AUTO_UPGRADE_APP = true;

export const GENERAL_DEFAULT_DATE_FORMAT = "YYYY-MM-DD";
export const GENERAL_DEFAULT_TIME_FORMAT = "HH:mm";

export const FILE_UPLOAD_LIMIT = Object.freeze({
  maxSize: 3,
  maxSizeUnit: "MB",
  fileTypes: [
    {
      name: "CSV",
      mimeType: "text/csv",
    },
  ],
});

export const COMPONENT_CONTAINER_ADJUSTER = 1.2;

export const TABLE_CELL_MIN_WIDTH = 140;

export const SCREEN_REUSE_ATTRIBUTES = Object.freeze({
  EDITABLE: "editable",
  READONLY: "readonly",
  HIDDEN: "hidden",
});

export const APP_DESIGN_MODES = Object.freeze({
  LIVE: "live",
  PREVIEW: "preview",
  EDIT: "edit",
});

export const PERMS_DETAILS = Object.freeze({
  User: "user",
  UserGroup: "userGroup",
  Role: "role",
});

export const filterBy = [
  ["none", "none"],
  ["SystemNotification", "System Notification"],
  ["ApprovalNotification", "Approval Notification"],
  ["read", "Read"],
  ["unread", "Unread"],
];

export const sortBy = [
  ["none", "none"],
  ["updatedAt", "Last modified"],
];

export const DEBOUNCE_TIME = 500;

export const multiChartNames = [
  "multiplelinegraph",
  "clusteredbarchart",
  "clusteredcolumnchart",
];

export const workflowScreenVariableFieldTypes = [
  "inputText",
  "textArea",
  "field", //  ??
  "phoneNumber",
  "fileUpload",
  "dateTime",
  "signature",
  "dropdown",
  "checkbox",
  "radio",
  "userPicker",
  "inputTable",
];
export const workflowScreenDynamicTypes = [
  "text",
  "heading",
  "inputText",
  "dropdown",
  "checkbox",
  "radio",
  "displayTable",
  "image",
];
export const workflowScreenUnitTextTypes = ["text", "heading"];
export const screenUnitImageType = ["image"];
export const workflowScreenUnitFieldTypes = [
  "inputText",
  "textArea",
  "phoneNumber",
  "fileUpload",
  "dateTime",
  "signature",
];
// export const workflowScreenListTypes = ["dropdown", "userPicker"];
// using below instead for checkbox to also receive list values
export const workflowScreenListTypes = [
  "dropdown",
  "checkbox",
  "userPicker",
  "radio",
];
export const workflowScreenTableTypes = ["displayTable", "inputTable"];

export const appItemOperations = ["create", "duplicate", "update"];
export const appDialogModes = {
  NEW: "New",
  CLONE: "Clone", //  to create app from template
  DUPLICATE: "Duplicate",
  PROPERTIES: "Properties",
};
export const DEFAULT_APP_LAUNCH_BUTTON_TEXT = "Launch";
