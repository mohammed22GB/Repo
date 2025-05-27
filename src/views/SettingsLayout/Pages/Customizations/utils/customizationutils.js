import { getHighestRole } from "../../../../common/utils/userRoleEvaluation";

export const CUSTOM_PORTAL_QUERY_KEY = "isCustomPortalEnabled";
export const CUSTOM_GET_USER_PORTAL_CUSTOMISATION_QUERY_KEY =
  "getUserPortalCustomisation";

export const hexToRgba = (hex = "#FF5500", opacity = 0.18) => {
  const bigint = parseInt(hex.replace("#", ""), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const DEFAULT = {
  COLOR: "#FF5500",
  UPLOAD: "UPLOAD",
  PLUG: "PLUG",
  NONE: "NONE",
};

export const DEFAULT_COLOR = "#FF5500";

export const defaultBrandColor = [
  {
    color: "#9412F1",
  },
  {
    color: "#2457C1",
  },
  {
    color: "#FF0000",
  },
  {
    color: "#3DDB03",
  },
  {
    color: "#FFD000",
  },
];

export const ContentTypes = {
  APPS: "Apps",
  EXTERNAL_LINK: "External link",
  DOCUMENTS: "Documents",
  USER_DETAILS: "User details",
};

export const ModalContentTypeOptions = [
  {
    title: ContentTypes.APPS,
    value: ContentTypes.APPS,
  },
  {
    title: ContentTypes.EXTERNAL_LINK,
    value: ContentTypes.EXTERNAL_LINK,
  },
  {
    title: ContentTypes.DOCUMENTS,
    value: ContentTypes.DOCUMENTS,
  },
  {
    title: ContentTypes.USER_DETAILS,
    value: ContentTypes.USER_DETAILS,
  },
];

export const DetailsMode = {
  PersonalDetails: "personalDetails",
  OrganizationDetails: "organizationDetails",
  QuickAccessDetails: "quickAccessDetails",
  MenuItemDetails: "menuItemDetails",
};

export const ModalMode = {
  PersonalAndOrganizationDetails: "PersonalAndOrganizationDetails", // change to PersonalAndOrganizationalDetails
  QuickAccess: "QuickAccess", // chnage this to QuickAccess
  MenuSettings: "MenuSettings", // chnage this to MenuSettings
};

export const quickAccessImages = [
  "../../../images/analytics-orange.svg",
  "../../../images/analytics-cash.svg",
  "../../../images/analytics-green.svg",
  "../../../images/analytics-blue.svg",
  "../../../images/analytics-orange.svg",
];

const userDetailField = {
  NAME: "Name",
  EMAIL: "Email",
  EMPLOYEE_ID: "Employee ID",
  ROLE: "Role",
};

export const userDetailsOptions = [
  {
    title: userDetailField.NAME,
    value: userDetailField.NAME,
  },
  {
    title: userDetailField.EMAIL,
    value: userDetailField.EMAIL,
  },
  {
    title: userDetailField.EMPLOYEE_ID,
    value: userDetailField.EMPLOYEE_ID,
  },
  {
    title: userDetailField.ROLE,
    value: userDetailField.ROLE,
  },
];

export const getUserIdFieldBasedOnUserDetail = (userDetail) => {
  const { firstName, lastName, email, employeeId, roles } = JSON.parse(
    localStorage.getItem("userInfo")
  );
  const fullName = (firstName ?? "--")?.concat(" ", lastName ?? "--");

  switch (userDetail) {
    case userDetailField.NAME:
      return fullName;
    case userDetailField.EMAIL:
      return email;
    case userDetailField.EMPLOYEE_ID:
      return employeeId;
    case userDetailField.ROLE:
      return getHighestRole(roles);

    default:
      return "--";
  }
};

export const documentOptions = [
  {
    title: "PDF",
    value: ".pdf",
  },
  {
    title: "Text File",
    value: ".txt",
  },
  {
    title: "Word document",
    value: ".doc,.docx",
  },
  {
    title: "Spreadsheet File",
    value: ".xls,.xlsx",
  },
  {
    title: "Open Document Text",
    value: ".odt",
  },
  {
    title: "Comma-seperated values (CSV)",
    value: ".csv",
  },
];

export const NUMBER_OF_SELECTED_APPS = 5;
