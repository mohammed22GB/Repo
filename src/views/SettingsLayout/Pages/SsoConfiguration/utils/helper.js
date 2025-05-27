import { infoToastify } from "../../../../common/utils/Toastify";

export const renameFormLabel = (key) => {
  let formLabel;
  switch (key) {
    case "tenantId":
      formLabel = "Tenant ID";
      break;
    case "clientId":
      formLabel = "Client ID";
      break;
    case "clientSecret":
      formLabel = "Client secret";
      break;
    case "keyVaultUrl":
      formLabel = "Key vault URL";
      break;
    case "certificateName":
      formLabel = "Certificate name";
      break;
    case "tenantSubdomain":
      formLabel = "Tenant subdomain";
      break;
    case "baseUrl":
      formLabel = "Base URL";
      break;
    case "redirectUrl":
      formLabel = "Single sign-on URL";
      break;
    case "logoutUrl":
      formLabel = "Logout URL";
      break;
    case "ssoUrl":
      formLabel = "SSO URL";
      break;
    case "entityId":
      formLabel = "Entity ID";
      break;
    case "certificate":
      formLabel = "Certificate";
      break;
    case "acsUrl":
      formLabel = "Assertion consumer service URL";
      break;
    case "loginUrl":
      formLabel = "Login URL";
      break;
    case "microsoftEntraIdentifier":
      formLabel = "Microsoft Entra identifier";
      break;
    case "certificateBase64":
      formLabel = "Certificate (Base 64)";
      break;
    case "thumbprint":
      formLabel = "Thumbprint";
      break;
    case "sha256fingerprint":
      formLabel = "SHA-256 fingerprint";
      break;

    default:
      formLabel = "URL name not defined";
      break;
  }
  return formLabel;
};

export const copyURI = (copiedUrl, urlName) => {
  navigator.clipboard.writeText(copiedUrl.value);
  infoToastify(`${urlName} copied!`);
};
