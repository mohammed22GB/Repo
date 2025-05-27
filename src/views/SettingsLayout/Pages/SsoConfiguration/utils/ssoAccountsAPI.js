import { catchErr } from "../../../../common/utils/catchErr";
import { CustomAxios } from "../../../../common/utils/CustomAxios";

//  get Sso configuration details
export const getSsoConfigurationDetails = async () => {
  try {
    const result = await CustomAxios().get(
      `${process.env.REACT_APP_ENDPOINT}/sso-configurations`
    );
    return result.data;
  } catch (error) {
    throw error;
  }
};

//  get list of available identity Providers for Saml auth
export const getIdentityProviderDetails = async () => {
  const result = await CustomAxios().get(
    `${process.env.REACT_APP_ENDPOINT}/identity-providers`
  );
  return result.data;
};

//  posting the selected user sso configuraton after selecting identityProvider and auth type
export const configurationPostRequest = async (data) => {
  try {
    const result = await CustomAxios().post(
      `${process.env.REACT_APP_ENDPOINT}/sso-configurations`,
      data
    );
    return "SUBMITTED";
  } catch (error) {
    throw error;
  }
};

//  update the sso configuraton after selecting identityProvider and auth type
export const configurationPutRequest = async (id, data) => {
  const result = await CustomAxios().put(
    `${process.env.REACT_APP_ENDPOINT}/sso-configurations/${id}`,
    data
  );
  return "UPDATED";
};

//  get account status for sso
export const getAccountInfo = async () => {
  const userinfo = localStorage.getItem("userInfo");
  const id = JSON.parse(userinfo)?.account?.id;

  const result = await CustomAxios().get(
    `${process.env.REACT_APP_ENDPOINT}/accounts/${id}`
  );
  return result.data;
};

//  updating the account status for sso
export const updateSSOStatus = async (newStatus) => {
  const userinfo = localStorage.getItem("userInfo");
  const id = JSON.parse(userinfo)?.account?.id;

  try {
    const result = await CustomAxios().put(
      `${process.env.REACT_APP_ENDPOINT}/accounts/${id}`,
      { ssoEnabled: newStatus }
    );
    return result.data;
  } catch (error) {
    catchErr({
      error,
      alertResMessage: error?.response?.data?._meta?.error?.message,
    });
  }
};

//  Put request for SAML Auth
export const updateSamlAuthInfo = async (id, data) => {
  try {
    const result = await CustomAxios().put(
      `${process.env.REACT_APP_ENDPOINT}/sso-configurations/${id}`,
      {
        metadata: data,
      }
    );
    return "UPDATED";
  } catch (error) {
    catchErr({
      error,
      alertResMessage: error?.response?.data?._meta?.error?.message,
    });
    throw error;
  }
};
