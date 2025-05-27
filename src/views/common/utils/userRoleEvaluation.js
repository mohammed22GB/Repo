import { mainNavigationUrls, portalNavigationUrls } from "./lists";

const MULTIPLE_ROLES_PER_USER = false;

export const PLUG_ROLES = {
  ROLE_PLUGADMIN: "PlugAdmin",
  ROLE_ADMIN: "Admin",
  ROLE_USERGROUPADMIN: "UserGroupAdmin",
  // "Customer",
  ROLE_DESIGNER: "Designer",
  ROLE_EMPLOYEE: "Employee",
};

export const PLUG_ROLES_PAGES = {
  [PLUG_ROLES.ROLE_PLUGADMIN]: {
    grant: ["*"],
    deny: [],
  },
  [PLUG_ROLES.ROLE_ADMIN]: {
    grant: ["*"],
    deny: [mainNavigationUrls.ADMINISTRATION],
  },
  [PLUG_ROLES.ROLE_DESIGNER]: {
    grant: ["*"],
    deny: [
      mainNavigationUrls.ADMINISTRATION,
      mainNavigationUrls.APP_CATEGORIES,
      mainNavigationUrls.BILLING_N_SUBSCRIPTIONS,
      mainNavigationUrls.ROLES,
      mainNavigationUrls.USER_MANAGEMENT,
      mainNavigationUrls.WEBHOOKS,
      mainNavigationUrls.SSO_SIGN_IN,
      mainNavigationUrls.CUSTOMIZATIONS,
      mainNavigationUrls.AUDIT_LOG,
    ],
  },
  [PLUG_ROLES.ROLE_EMPLOYEE]: {
    grant: ["*"],
    deny: [
      // mainNavigationUrls.APPS_N_TEMPLATES,
      mainNavigationUrls.ADMINISTRATION,
      mainNavigationUrls.APP_CATEGORIES,
      mainNavigationUrls.BILLING_N_SUBSCRIPTIONS,
      mainNavigationUrls.INTEGRATIONS,
      mainNavigationUrls.ROLES,
      mainNavigationUrls.TEMPLATES,
      mainNavigationUrls.USER_MANAGEMENT,
      mainNavigationUrls.WEBHOOKS,
      mainNavigationUrls.SSO_SIGN_IN,
      mainNavigationUrls.CUSTOMIZATIONS,
      mainNavigationUrls.AUDIT_LOG,
    ],
  },
};

export const PLUG_ROLES_PRIVILEGE_ACTIONS = {
  APPS: {
    GET: [
      PLUG_ROLES.ROLE_PLUGADMIN,
      PLUG_ROLES.ROLE_ADMIN,
      PLUG_ROLES.ROLE_USERGROUPADMIN,
      PLUG_ROLES.ROLE_DESIGNER,
      PLUG_ROLES.ROLE_EMPLOYEE,
    ],
    POST: [
      PLUG_ROLES.ROLE_PLUGADMIN,
      PLUG_ROLES.ROLE_ADMIN,
      PLUG_ROLES.ROLE_USERGROUPADMIN,
      PLUG_ROLES.ROLE_DESIGNER,
    ],
    UPDATE: [
      PLUG_ROLES.ROLE_PLUGADMIN,
      PLUG_ROLES.ROLE_ADMIN,
      PLUG_ROLES.ROLE_USERGROUPADMIN,
      PLUG_ROLES.ROLE_DESIGNER,
    ],
    DELETE: [
      PLUG_ROLES.ROLE_PLUGADMIN,
      PLUG_ROLES.ROLE_ADMIN,
      PLUG_ROLES.ROLE_USERGROUPADMIN,
      PLUG_ROLES.ROLE_DESIGNER,
    ],
  },
  TEMPLATES: {
    GET: [
      PLUG_ROLES.ROLE_PLUGADMIN,
      PLUG_ROLES.ROLE_ADMIN,
      PLUG_ROLES.ROLE_USERGROUPADMIN,
      PLUG_ROLES.ROLE_DESIGNER,
    ],
    POST: [PLUG_ROLES.ROLE_PLUGADMIN],
    UPDATE: [PLUG_ROLES.ROLE_PLUGADMIN, PLUG_ROLES.ROLE_ADMIN],
    DELETE: [PLUG_ROLES.ROLE_PLUGADMIN],
  },
  INTEGRATIONS: {
    GET: [
      PLUG_ROLES.ROLE_PLUGADMIN,
      PLUG_ROLES.ROLE_ADMIN,
      PLUG_ROLES.ROLE_USERGROUPADMIN,
      PLUG_ROLES.ROLE_DESIGNER,
    ],
    POST: [PLUG_ROLES.ROLE_PLUGADMIN, PLUG_ROLES.ROLE_ADMIN],
    UPDATE: [PLUG_ROLES.ROLE_PLUGADMIN, PLUG_ROLES.ROLE_ADMIN],
    DELETE: [PLUG_ROLES.ROLE_PLUGADMIN, PLUG_ROLES.ROLE_ADMIN],
  },
  DATASHEETS: {
    GET: [
      PLUG_ROLES.ROLE_PLUGADMIN,
      PLUG_ROLES.ROLE_ADMIN,
      PLUG_ROLES.ROLE_USERGROUPADMIN,
      PLUG_ROLES.ROLE_DESIGNER,
      PLUG_ROLES.ROLE_EMPLOYEE,
    ],
    POST: [
      PLUG_ROLES.ROLE_PLUGADMIN,
      PLUG_ROLES.ROLE_ADMIN,
      PLUG_ROLES.ROLE_USERGROUPADMIN,
      PLUG_ROLES.ROLE_DESIGNER,
    ],
    UPDATE: [
      PLUG_ROLES.ROLE_PLUGADMIN,
      PLUG_ROLES.ROLE_ADMIN,
      PLUG_ROLES.ROLE_USERGROUPADMIN,
      PLUG_ROLES.ROLE_DESIGNER,
    ],
    DELETE: [PLUG_ROLES.ROLE_PLUGADMIN, PLUG_ROLES.ROLE_ADMIN],
  },
  DATASHEET: {
    GET: [
      PLUG_ROLES.ROLE_PLUGADMIN,
      PLUG_ROLES.ROLE_ADMIN,
      PLUG_ROLES.ROLE_USERGROUPADMIN,
      PLUG_ROLES.ROLE_DESIGNER,
      PLUG_ROLES.ROLE_EMPLOYEE,
    ],
    POST: [
      PLUG_ROLES.ROLE_PLUGADMIN,
      PLUG_ROLES.ROLE_ADMIN,
      PLUG_ROLES.ROLE_USERGROUPADMIN,
      PLUG_ROLES.ROLE_DESIGNER,
    ],
    UPDATE: [
      PLUG_ROLES.ROLE_PLUGADMIN,
      PLUG_ROLES.ROLE_ADMIN,
      PLUG_ROLES.ROLE_USERGROUPADMIN,
      PLUG_ROLES.ROLE_DESIGNER,
    ],
    DELETE: [PLUG_ROLES.ROLE_PLUGADMIN, PLUG_ROLES.ROLE_ADMIN],
  },
  DASHBOARDS: {
    GET: [
      PLUG_ROLES.ROLE_PLUGADMIN,
      PLUG_ROLES.ROLE_ADMIN,
      PLUG_ROLES.ROLE_USERGROUPADMIN,
      PLUG_ROLES.ROLE_DESIGNER,
      PLUG_ROLES.ROLE_EMPLOYEE,
    ],
    POST: [
      PLUG_ROLES.ROLE_PLUGADMIN,
      PLUG_ROLES.ROLE_ADMIN,
      PLUG_ROLES.ROLE_USERGROUPADMIN,
      PLUG_ROLES.ROLE_DESIGNER,
    ],
    UPDATE: [
      PLUG_ROLES.ROLE_PLUGADMIN,
      PLUG_ROLES.ROLE_ADMIN,
      PLUG_ROLES.ROLE_USERGROUPADMIN,
      PLUG_ROLES.ROLE_DESIGNER,
    ],
    DELETE: [PLUG_ROLES.ROLE_PLUGADMIN, PLUG_ROLES.ROLE_ADMIN],
  },
  ADMINISTRATION: {
    GET: [PLUG_ROLES.ROLE_PLUGADMIN],
    POST: [PLUG_ROLES.ROLE_PLUGADMIN],
    UPDATE: [PLUG_ROLES.ROLE_PLUGADMIN],
    DELETE: [PLUG_ROLES.ROLE_PLUGADMIN],
  },
  "USER MANAGEMENT": {
    GET: [PLUG_ROLES.ROLE_PLUGADMIN, PLUG_ROLES.ROLE_ADMIN],
    POST: [PLUG_ROLES.ROLE_PLUGADMIN, PLUG_ROLES.ROLE_ADMIN],
    UPDATE: [PLUG_ROLES.ROLE_PLUGADMIN, PLUG_ROLES.ROLE_ADMIN],
    DELETE: [PLUG_ROLES.ROLE_PLUGADMIN, PLUG_ROLES.ROLE_ADMIN],
  },
  "USER GROUPS": {
    GET: [PLUG_ROLES.ROLE_PLUGADMIN, PLUG_ROLES.ROLE_ADMIN],
    POST: [PLUG_ROLES.ROLE_PLUGADMIN, PLUG_ROLES.ROLE_ADMIN],
    UPDATE: [PLUG_ROLES.ROLE_PLUGADMIN, PLUG_ROLES.ROLE_ADMIN],
    DELETE: [PLUG_ROLES.ROLE_PLUGADMIN, PLUG_ROLES.ROLE_ADMIN],
  },
  ROLES: {
    GET: [PLUG_ROLES.ROLE_PLUGADMIN, PLUG_ROLES.ROLE_ADMIN],
    POST: [PLUG_ROLES.ROLE_PLUGADMIN],
    UPDATE: [PLUG_ROLES.ROLE_PLUGADMIN],
    DELETE: [PLUG_ROLES.ROLE_PLUGADMIN],
  },
  "APP CATEGORIES": {
    GET: [PLUG_ROLES.ROLE_PLUGADMIN, PLUG_ROLES.ROLE_ADMIN],
    POST: [PLUG_ROLES.ROLE_PLUGADMIN, PLUG_ROLES.ROLE_ADMIN],
    UPDATE: [PLUG_ROLES.ROLE_PLUGADMIN, PLUG_ROLES.ROLE_ADMIN],
    DELETE: [PLUG_ROLES.ROLE_PLUGADMIN, PLUG_ROLES.ROLE_ADMIN],
  },
};

export const ADMIN_PORTAL_ROLES = [
  PLUG_ROLES.ROLE_PLUGADMIN,
  PLUG_ROLES.ROLE_ADMIN,
];

export const getHighestRole = (userRoles) => {
  const rolesHierarchy = [
    PLUG_ROLES.ROLE_PLUGADMIN,
    PLUG_ROLES.ROLE_ADMIN,
    PLUG_ROLES.ROLE_USERGROUPADMIN,
    PLUG_ROLES.ROLE_DESIGNER,
    PLUG_ROLES.ROLE_EMPLOYEE,
  ];

  for (let index = 0; index < rolesHierarchy.length; index++) {
    const role = rolesHierarchy[index];
    if (userRoles?.includes(role)) return role;
  }
  return "";
};

/**
 * If the userInfo object exists in localStorage, then parse
 * it and return the user's role.
 * @returns The userRole is being returned.
 */
export const getUserRole = (userData) => {
  const user = userData || JSON.parse(localStorage.getItem("userInfo"));
  const userRole = user && user?.roles;
  return userRole;
  // ["Employee", "Designer"];
};

/**
 * The function `userManagementPermission` checks if a user has
 * the "PlugAdmin" or "Admin" role.
 * @param roles - An array of roles that a user has.
 */
export const userManagementPermission = (roles) =>
  roles?.includes("PlugAdmin") || roles?.includes("Admin");

/**
 * If the user has the PlugAdmin role, return true, otherwise,
 * if the user has the Admin role, return true, otherwise, if
 * the user has the Designer role, return true, otherwise,
 * return false.
 * @param roles - ["PlugAdmin", "Admin", "Designer"]
 * @returns A function that takes a parameter called roles.
 */
export const appPermissions = (roles) => {
  return roles?.includes("Admin")
    ? true
    : roles?.includes("Designer")
    ? true
    : false;
};

/**
 * If the user has the role of PlugAdmin, Admin, or Designer,
 * then return true, otherwise return false.
 * @param roles - An array of strings that represent the roles the user has.
 * @returns A function that takes a parameter called roles.
 */
export const AdminPlugAdminPermissions = (roles) => {
  return !roles?.length
    ? false
    : roles?.includes("PlugAdmin")
    ? true
    : roles?.includes("Admin")
    ? true
    : roles?.includes("Designer")
    ? true
    : false;
};

/**
 * If the roles array includes the string "PlugAdmin", return
 * true, otherwise return false.
 * @param roles - ["PlugAdmin", "PlugUser"]
 */

// PLEASE THIS FUNCTION IS BEING USED IN A LOT OF PLACES
// SO IT IS BETTER IF IT IS RESERVED AS IT IS FOR PLUG ADMIN
// AND ADMIN
export const tempPermissions = (roles) =>
  roles?.includes("PlugAdmin") || roles?.includes("Admin");

// export const appMutationPermissions = (roles) =>
//   roles.includes("PlugAdmin")
//     ? true
//     : roles.includes("Admin")
//     ? true
//     : roles.includes("Designer")
//     ? true
//     : false;

// export const TempMutationPermissions = (roles) =>
//   roles.includes("PlugAdmin")
//     ? true
//     : roles.includes("Admin")
//     ? true
//     : roles.includes("Designer")
//     ? true
//     : false;

/**
 * Evaluate whether user has access to page
 * @param page The path of the page being accessed
 * @param isExact Whether the page url is exact
 * @param role The user's role(s)
 * @return Whether user is granted access based on role(s)
 * */
export const handleRolePageAccess = (page, isExact, role, isPortalEnabled) => {
  let access = false;
  let isRoleValid = false;

  if (!role || !page) return false;

  // if (Object.values(portalNavigationUrls)?.includes(page)) {
  //   return isPortalEnabled;
  // } else if (Object.values(mainNavigationUrls)?.includes(page)) {
  //   if (isPortalEnabled) {
  //     if (!ADMIN_PORTAL_ROLES.includes(getHighestRole(role))) {
  //       return false;
  //     }
  //   }
  // } else {
  //   return false;
  // }

  const userRoles = Array.isArray(role)
    ? MULTIPLE_ROLES_PER_USER
      ? role
      : [getHighestRole(role)]
    : [role];
  access = true;

  /* check if role is valid and have access */
  for (let index = 0; index < userRoles.length; index++) {
    const thisUserRole = userRoles[index];
    /* is role valid? */
    if (Object.values(PLUG_ROLES).includes(thisUserRole)) {
      /* check denied list */
      if (PLUG_ROLES_PAGES[thisUserRole].deny.includes(page)) {
        return false;
      }
      /* check granted list */
      if (
        PLUG_ROLES_PAGES[thisUserRole].grant.includes("*") ||
        PLUG_ROLES_PAGES[thisUserRole].grant.includes(page)
      ) {
      }

      isRoleValid = true;
    }
  }

  if (!isRoleValid) return false;

  return access;
};

export const handleRoleActionAccess = (module, action, ownerGroup) => {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const role = getUserRole(user);

  const headerTitle = module?.headerTitle?.toUpperCase();
  const pageTitle = module?.pageTitle?.toUpperCase();

  module = Object.keys(PLUG_ROLES_PRIVILEGE_ACTIONS).includes(headerTitle)
    ? headerTitle
    : pageTitle;

  const userRoles = Array.isArray(role)
    ? MULTIPLE_ROLES_PER_USER
      ? role
      : [getHighestRole(role)]
    : [role];

  /* first check if is valid userGroupAdmin */
  if (
    PLUG_ROLES_PRIVILEGE_ACTIONS?.[module]?.[action]?.includes(
      PLUG_ROLES.ROLE_USERGROUPADMIN
    )
  ) {
    const isAdminInOwnerGroup = ownerGroup?.admins?.includes(user?.id);

    const isOwner =
      !!user?.userGroups?.length &&
      !!ownerGroup?.id &&
      user?.userGroups?.includes(ownerGroup?.id) &&
      isAdminInOwnerGroup;
    if (isOwner) {
      return true;
    }
  }

  /* check if role is valid and have access */
  for (let index = 0; index < userRoles.length; index++) {
    const thisUserRole = userRoles[index];

    /* is role valid? */
    if (Object.values(PLUG_ROLES).includes(thisUserRole)) {
      /* check access list */
      if (
        PLUG_ROLES_PRIVILEGE_ACTIONS?.[module]?.[action]?.includes(thisUserRole)
      ) {
        return true;
      }
    }
  }

  return false;
};
