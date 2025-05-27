import {
  getApps,
  getMoreApps,
  getCategories,
  editAppProperties,
  duplicateApp,
  deleteApp,
  createNewApp,
} from "./apps";
import { getIntegrations, editIntegrations } from "./integrations";
import {
  getTemplates,
  duplicateTemplates,
  editTemplateProperties,
  deleteTemplate,
  appFromTemplate,
  createNewTemplate,
} from "./appTemplates";
import { login } from "./login";
import { getNotificationSockets } from "./socket";
import {
  getAccountById,
  editAccount,
  editUser,
  editMobileNum,
} from "./account";
import { signUp, emailExist } from "./signup";
import {
  fetchDatasheets,
  createDatasheet,
  deleteDatasheet,
  duplicateDatasheet,
} from "./datasheet/allDatasheets";
import {
  getDatasheet,
  editDatasheetColumn,
  deleteDatasheetColumn,
  createDatasheetColumnOrRow,
} from "./datasheet/datasheet";
import {
  updateDatasheetPermissions,
  groupUpdateDatasheetPermissions,
  removeDatasheetPermissions,
} from "./datasheet/permissions";
import { getUsers } from "./userManagement";
import { getRecords, getSingleRecords } from "./records";
import { getNotifications } from "./notifications";
import { getUserGroupsApps, getUserGroupsList } from "./userGroups";

export const handlers = [
  login,
  signUp,
  emailExist,
  getTemplates,
  duplicateTemplates,
  deleteTemplate,
  appFromTemplate,
  editTemplateProperties,
  createNewTemplate,
  getCategories,
  getApps,
  getMoreApps,
  deleteApp,
  createNewApp,
  duplicateApp,
  editAppProperties,
  getIntegrations,
  editIntegrations,
  getDatasheet,
  editDatasheetColumn,
  deleteDatasheetColumn,
  createDatasheetColumnOrRow,
  fetchDatasheets,
  deleteDatasheet,
  createDatasheet,
  duplicateDatasheet,
  updateDatasheetPermissions,
  groupUpdateDatasheetPermissions,
  removeDatasheetPermissions,
  getUsers,
  getUserGroupsApps,
  getUserGroupsList,
  getNotifications,
  getNotificationSockets,
  getAccountById,
  editAccount,
  editUser,
  editMobileNum,
  getRecords,
  getSingleRecords,
];
