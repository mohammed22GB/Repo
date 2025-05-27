import axios from "axios";
import { CustomAxios } from "../../../utils/CustomAxios";

export const updateUserFields = async ({ id, ...data }) => {
  const url = axios.getUri({
    baseURL: process.env.REACT_APP_ENDPOINT,
    url: `/users/${id}`,
  });

  const result = await CustomAxios().put(url, data);
  return result.data;
};

export const updateUserAccount = async ({ id, ...data }) => {
  const url = axios.getUri({
    baseURL: process.env.REACT_APP_ENDPOINT,
    url: `/accounts/${id}`,
  });

  const result = await CustomAxios().put(url, data);
  return result.data;
};

/**
 * Export users API
 *
 * @param {{
 *  page?: number;
 *  population?: { path: string, select: string }[];
 *  page_no?: number;
 *  selection?: string[]
 * }} params
 *
 * @returns {Promise<User[]>}
 */
export const exportUserAPI = async (params) => {
  const url = axios.getUri({
    baseURL: process.env.REACT_APP_ENDPOINT,
    url: "/users",
    params,
  });

  const result = await CustomAxios().get(url);
  return result.data;
};

/**
 * Export accounts API
 *
 * @param {{
 *  page?: number;
 *  population?: { path: string, select: string }[];
 *  page_no?: number;
 *  selection?: string[]
 * }} params
 *
 * @returns {Promise<User[]>}
 */
export const exportAccountsAPI = async (params) => {
  const url = axios.getUri({
    baseURL: process.env.REACT_APP_ENDPOINT,
    url: "/accounts",
    params,
  });

  const result = await CustomAxios().get(url);
  return result.data;
};
