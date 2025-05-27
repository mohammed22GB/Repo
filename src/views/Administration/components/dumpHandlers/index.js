import { Checkbox, FormControlLabel, MenuItem } from "@material-ui/core";
import { isArray, isPlainObject, isBoolean, isString, startCase } from "lodash";

import moment from "moment";

/**
 * @type {keyof User[]} userFields
 */
export const userFields = [
  // "id",
  // "userGroups",
  // "__v",
  "_id",
  "lineManager",
  "lastLogin",
  "mobileVerified",
  "emailVerified",
  "roles",
  "passwordReset",
  "twoFactorAuthType",
  "active",
  "userType",
  "firstName",
  "lastName",
  "email",
  "account",
  "createdAt",
  "updatedAt",
  "mobile",
];

/**
 * @type {keyof Account[]} accountFields
 */
export const accountFields = [
  "_id",
  "deleted",
  "active",
  "createdAt",
  "updatedAt",
  "country",
  "email",
  "industry",
  "name",
  "noOfEmployee",
  "slug",
  "twoFactorAuthEnabled",
  "integrations",
  "totalApps",
  "totalUsers",
];

/**
 * @type {keyof Plug.UserGroup[]} userGroupFields
 */
export const userGroupFields = [
  "_id",
  "account",
  "user",
  "name",
  "description",
  "type",
  "admins",
  "active",
  "deleted",
];

/**
 * @type {keyof LastLogin[]} lastLoginFields
 */
export const lastLoginFields = [
  "time",
  "agent",
  "ip",
  "coordinate",
  "city",
  "country",
];

/**
 * @type {{ total: number }[]} totalCount
 */
export const totalFields = ["total"];

export const isDate = (value) => {
  return moment(value, moment.ISO_8601, true).isValid();
};

export const transformData = (data) => {
  if (isDate(data)) {
    return moment(data).format("lll");
  }

  if (isBoolean(data)) {
    return data ? "Yes" : "No";
  }

  if (isString(data)) {
    return data;
  }

  if (!data) {
    return "";
  }

  if (isArray(data)) {
    if (!data.length) {
      return "";
    }

    const transformed = data.map(transformData);
    if (data.every(isString)) {
      return transformed.join(", ");
    }

    return transformed;
  }

  if (isPlainObject(data)) {
    const transformed = {};

    Object.entries(data).forEach(([key, value]) => {
      transformed[key] = transformData(value);
    });

    return transformed;
  }

  return String(data);
};

export const makeHeaders = (config, allowedFields) => {
  const headers = [];

  const processNestedFields = (fieldNames, parentPath) => {
    fieldNames.forEach((fieldName) => {
      if (parentPath.includes(fieldName)) {
        return;
      }

      const currentPath = parentPath.concat(fieldName);
      if (allowedFields.includes(fieldName)) {
        processNestedFields(config[fieldName], currentPath);
      } else {
        headers.push({
          label: startCase(currentPath.join(" - ")),
          key: currentPath.join("."),
        });
      }
    });
  };

  config.selection.forEach((fieldName) => {
    if (allowedFields.includes(fieldName)) {
      processNestedFields(config[fieldName], [fieldName]);
    } else {
      headers.push({
        label: startCase(fieldName),
        key: fieldName,
      });
    }
  });

  return headers.sort((a, b) => {
    return a.label.localeCompare(b.label);
  });
};

export const makeMenuItem = (fields, values) => {
  return fields.map((field) => {
    return (
      <MenuItem key={field} value={field}>
        <FormControlLabel
          control={<Checkbox checked={values.includes(field)} />}
          label={startCase(field)}
        />
      </MenuItem>
    );
  });
};

/**
 * @param {Record<PropertyKey, unknown>} fields
 */
export const populate = (fields) => {
  const population = [];

  Object.entries(fields).forEach(([path, value]) => {
    population.push({ path, select: value.join(" ") });
  });

  return population;
};
