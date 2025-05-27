import { catchErr } from "../../../../common/utils/catchErr";
import { CustomAxios } from "../../../../common/utils/CustomAxios";

export const getDirectorySyncConfiguration = async () => {
  try {
    const result = await CustomAxios().get(
      `${process.env.REACT_APP_ENDPOINT}/directory-sync`
    );
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const getDirectorySyncScimUrl = async () => {
  try {
    const result = await CustomAxios().get(
      `${process.env.REACT_APP_ENDPOINT}/directory-sync/scim/url`
    );
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const createPostRequest = async (data) => {
  try {
    const result = await CustomAxios().post(
      `${process.env.REACT_APP_ENDPOINT}/directory-sync`,
      data
    );
    return { action: "SUBMITTED", data: result.data };
  } catch (error) {
    throw error;
  }
};

export const enableDSyncRequest = async (data) => {
  const { id } = data;
  const result = await CustomAxios().put(
    `${process.env.REACT_APP_ENDPOINT}/directory-sync/${id}/enable`,
    data
  );
  return result.data;
};

export const updateDSyncRequest = async (data) => {
  const { id } = data;
  const result = await CustomAxios().put(
    `${process.env.REACT_APP_ENDPOINT}/directory-sync/${id}`,
    data
  );
  return result.data;
};

//  get list of available identity Providers for Saml auth
export const getIdentityProviderDetails = async () => {
  const result = await CustomAxios().get(
    `${process.env.REACT_APP_ENDPOINT}/identity-providers`
  );
  return result.data;
};
