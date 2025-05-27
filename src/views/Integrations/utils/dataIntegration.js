/**
 * It takes in an object with a propertyType, fieldValues, and type, and returns an object with a name,
 * email, type, group, and properties.
 * @returns An object with the following properties:
 * name: fieldValues.name,
 * email: fieldValues?.selectedSheetInt,
 * type: type,
 * group: "data",
 * properties: {
 * connectionCredentials: {
 * serverName: fieldValues.serverName,
 * serverType: fieldValues.serverType,
 * authent
 */

export const handleDBData = ({
  propertyType,
  fieldValues,
  type,
  form2fieldValue,
}) => {
  let data;
  if (propertyType === "AzureDB") {
    data = {
      name: fieldValues.name,
      email: fieldValues?.selectedSheetInt,
      type: type,
      group: "data",
      properties: {
        connectionCredentials: {
          serverName: fieldValues.serverName,
          serverType: fieldValues.serverType,
          authentication: fieldValues.authentication,
          password: fieldValues.password,
          loginUsername: fieldValues.loginUsername,
        },
        type: propertyType,
      },
    };
  } else if (propertyType === "OracleDB") {
    data = {
      name: fieldValues.name,
      email: fieldValues?.selectedSheetInt,
      type: type,
      group: "data",
      properties: {
        connectionCredentials: {
          user: fieldValues.user,
          password: fieldValues.password,
          connectionString: fieldValues.connectionString,
        },
        type: propertyType,
      },
    };
  } else if (propertyType === "UsernamePassword") {
    data = {
      name: fieldValues?.name,
      type: type,
      group: fieldValues?.apiType,
      properties: {
        type: type,
        connectionCredentials: {
          password: fieldValues?.password,
          authType: fieldValues?.authenticationType,
          user: fieldValues?.loginUsername,
          url: fieldValues?.url && fieldValues?.url,
        },
        resource: form2fieldValue || [],
      },
      active: true,
    };
  } else if (propertyType === "HeaderAuth") {
    data = {
      name: fieldValues?.name,
      type: type,
      group: fieldValues?.apiType,
      properties: {
        type: type,
        connectionCredentials: {
          authType: fieldValues?.authenticationType,
          url: fieldValues?.url,
          headerAuth: fieldValues?.headerAuth,
        },
        ...(!!form2fieldValue ? { resources: form2fieldValue } : {}),
      },
      active: true,
    };
  } else if (propertyType === "GoogleAuth") {
    data = {
      name: fieldValues?.name,
      type: type,
      email: fieldValues?.googleAccount,
      group: fieldValues?.apiType,
      properties: {
        type: type,
        connectionCredentials: {
          authType: fieldValues?.authenticationType,
          scopes: [
            ...new Set([
              ...(fieldValues?.googleScopes || []),
              "https://www.googleapis.com/auth/userinfo.profile",
              "https://www.googleapis.com/auth/userinfo.email",
            ]),
          ], //.join(" "),
        },
        ...(!!form2fieldValue ? { resources: form2fieldValue } : {}),
      },
      active: true,
      redirectUrl: `${process.env.REACT_APP_BASE_URL}/integrations`,
    };
  } else if (propertyType === "MicrosoftAuth") {
    data = {
      name: fieldValues?.name,
      type: type,
      group: fieldValues?.apiType,
      properties: {
        type: type,
        connectionCredentials: {
          authType: fieldValues?.authenticationType,
          scopes: (fieldValues?.microsoftScopes || [])?.join(" "),
        },
        ...(!!form2fieldValue ? { resources: form2fieldValue } : {}),
      },
      active: true,
      redirectUrl: `${process.env.REACT_APP_BASE_URL}/integrations`,
    };
  } else if (propertyType === "OAuth2") {
    data = {
      name: fieldValues?.name,
      type: type,
      group: fieldValues?.apiType,
      properties: {
        type: type,
        connectionCredentials: {
          authType: fieldValues?.authenticationType,
          clientID: fieldValues?.clientID,
          clientSecret: fieldValues?.clientSecret,
          authorizationURL: fieldValues?.authorizationURL,
          tokenURL: fieldValues?.tokenURL,
          scopes: fieldValues?.oauth2Scopes?.split(","),
        },
        ...(!!form2fieldValue ? { resources: form2fieldValue } : {}),
      },
      active: true,
      redirectUrl: `${process.env.REACT_APP_BASE_URL}/integrations`,
    };
  } else if (propertyType === "None") {
    data = {
      name: fieldValues?.name,
      type: type,
      group: fieldValues?.apiType,
      properties: {
        type: type,
        connectionCredentials: {
          authType: fieldValues?.authenticationType,
        },
        ...(!!form2fieldValue ? { resources: form2fieldValue } : {}),
      },
      active: true,
    };
  }

  return data;
};
