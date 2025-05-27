export const serviceTypes = [
  ["", "Select Category"],
  ["data", "Database"],
  ["payment", "Payment"],
  ["calender", "Calender"],
  ["mail", "Mail Service"],
  ["message", "Messenger"],
  ["screen", "Screen"],
  ["data", "Data"],
  ["custom", "Custom"],
];

export const authTypes = [
  ["", "Select type"],
  ["None", "None"],
  ["HeaderAuth", "Header Auth"],
  ["UsernamePassword", "Username | Password"],
  ["GoogleAuth", "Google Auth"],
  ["MicrosoftAuth", "Microsoft Auth"],
  ["OAuth2", "OAuth2"],
];

export const methodTypes = [
  ["", "Select Method"],
  ["POST", "POST"],
  ["GET", "GET"],
  ["DELETE", "DELETE"],
  ["PUT", "PUT"],
  ["PATCH", "PATCH"],
];

export const paramTypes = [
  ["routeParamsKeys", "Route Params"],
  ["queryParamsKeys", "Query Params"],
  ["requestBodyKeys", "Request Body"],
  ["responseBodyKeys", "Response Body"],
  ["requestHeaderKeys", "Request Header"],
  ["responseHeaderKeys", "Response Header"],
];

export const paramsDataTypes = [
  ["string", "String"],
  ["number", "Number"],
  ["boolean", "Boolean"],
  ["object", "Object"],
  ["email", "Email"],
  ["date", "Date"],
  ["custom", "Custom"],
];

export const initEndpoint = {
  name: "",
  method: "",
  url: "",
  requestBodyKeys: [], //[{ name: "", dataType: "string", required: true }],
  responseBodyKeys: [], //[{ name: "", dataType: "string", required: true }],
  requestHeaderKeys: [], //[{ name: "", dataType: "string", required: true }],
  responseHeaderKeys: [], //[{ name: "", dataType: "string", required: true }],
  routeParamsKeys: [], //[{ name: "", dataType: "string", required: true }],
  queryParamsKeys: [], //[{ name: "", dataType: "string", required: true }],
};

export const googleScopesList = [
  /* {
    name: "drive",
    value: "https://www.googleapis.com/auth/drive",
    consentType: "NON-ADMIN",
  },
  {
    name: "mail",
    value: "https://mail.google.com/",
    consentType: "NON-ADMIN",
  },
  {
    name: "admin.chrome.printers",
    value: "https://www.googleapis.com/auth/admin.chrome.printers",
    consentType: "ADMIN",
  },
  {
    name: "admin.chrome.printers.readonly",
    value: "https://www.googleapis.com/auth/admin.chrome.printers.readonly",
    consentType: "ADMIN",
  },
  {
    name: "admin.directory.customer",
    value: "https://www.googleapis.com/auth/admin.directory.customer",
    consentType: "ADMIN",
  },
  {
    name: "admin.directory.customer.readonly",
    value: "https://www.googleapis.com/auth/admin.directory.customer.readonly",
    consentType: "ADMIN",
  },
  {
    name: "admin.directory.device.chromeos",
    value: "https://www.googleapis.com/auth/admin.directory.device.chromeos",
    consentType: "ADMIN",
  },
  {
    name: "admin.directory.device.chromeos.readonly",
    value:
      "https://www.googleapis.com/auth/admin.directory.device.chromeos.readonly",
    consentType: "ADMIN",
  },
  {
    name: "admin.directory.device.mobile",
    value: "https://www.googleapis.com/auth/admin.directory.device.mobile",
    consentType: "ADMIN",
  },
  {
    name: "admin.directory.device.mobile.action",
    value:
      "https://www.googleapis.com/auth/admin.directory.device.mobile.action",
    consentType: "ADMIN",
  },
  {
    name: "admin.directory.device.mobile.readonly",
    value:
      "https://www.googleapis.com/auth/admin.directory.device.mobile.readonly",
    consentType: "ADMIN",
  },
  {
    name: "admin.directory.domain",
    value: "https://www.googleapis.com/auth/admin.directory.domain",
    consentType: "ADMIN",
  },
  {
    name: "admin.directory.domain.readonly",
    value: "https://www.googleapis.com/auth/admin.directory.domain.readonly",
    consentType: "ADMIN",
  },
  {
    name: "admin.directory.group",
    value: "https://www.googleapis.com/auth/admin.directory.group",
    consentType: "ADMIN",
  },
  {
    name: "admin.directory.group.member",
    value: "https://www.googleapis.com/auth/admin.directory.group.member",
    consentType: "ADMIN",
  },
  {
    name: "admin.directory.group.member.readonly",
    value:
      "https://www.googleapis.com/auth/admin.directory.group.member.readonly",
    consentType: "ADMIN",
  },
  {
    name: "admin.directory.group.readonly",
    value: "https://www.googleapis.com/auth/admin.directory.group.readonly",
    consentType: "ADMIN",
  },
  {
    name: "admin.directory.orgunit",
    value: "https://www.googleapis.com/auth/admin.directory.orgunit",
    consentType: "ADMIN",
  },
  {
    name: "admin.directory.orgunit.readonly",
    value: "https://www.googleapis.com/auth/admin.directory.orgunit.readonly",
    consentType: "ADMIN",
  },
  {
    name: "admin.directory.resource.calendar",
    value: "https://www.googleapis.com/auth/admin.directory.resource.calendar",
    consentType: "ADMIN",
  },
  {
    name: "admin.directory.resource.calendar.readonly",
    value:
      "https://www.googleapis.com/auth/admin.directory.resource.calendar.readonly",
    consentType: "ADMIN",
  },
  {
    name: "admin.directory.rolemanagement",
    value: "https://www.googleapis.com/auth/admin.directory.rolemanagement",
    consentType: "ADMIN",
  },
  {
    name: "admin.directory.rolemanagement.readonly",
    value:
      "https://www.googleapis.com/auth/admin.directory.rolemanagement.readonly",
    consentType: "ADMIN",
  },
  {
    name: "admin.directory.user",
    value: "https://www.googleapis.com/auth/admin.directory.user",
    consentType: "ADMIN",
  },
  {
    name: "admin.directory.user.alias",
    value: "https://www.googleapis.com/auth/admin.directory.user.alias",
    consentType: "ADMIN",
  },
  {
    name: "admin.directory.user.alias.readonly",
    value:
      "https://www.googleapis.com/auth/admin.directory.user.alias.readonly",
    consentType: "ADMIN",
  },
  {
    name: "admin.directory.user.readonly",
    value: "https://www.googleapis.com/auth/admin.directory.user.readonly",
    consentType: "ADMIN",
  },
  {
    name: "admin.directory.user.security",
    value: "https://www.googleapis.com/auth/admin.directory.user.security",
    consentType: "ADMIN",
  },
  {
    name: "admin.directory.userschema",
    value: "https://www.googleapis.com/auth/admin.directory.userschema",
    consentType: "ADMIN",
  },
  {
    name: "admin.directory.userschema.readonly",
    value:
      "https://www.googleapis.com/auth/admin.directory.userschema.readonly",
    consentType: "ADMIN",
  },
  {
    name: "cloud-platform",
    value: "https://www.googleapis.com/auth/cloud-platform",
    consentType: "ADMIN",
  }, */
];
