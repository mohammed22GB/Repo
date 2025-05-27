import { composeQueryString } from "../../../../common/utils/composeQueryString";
import { CustomAxios } from "../../../../common/utils/CustomAxios";

//  get list of users
export const getUserGroupsAPI = async (options, searchValue = null) => {
  // search for a user if a debounce search value is provided
  if (searchValue) {
    const result = await CustomAxios().get(
      `${process.env.REACT_APP_ENDPOINT}/user-groups?search=${searchValue}&population=[{%22path%22:%22users%22,%22select%22:%22id%20firstName%20lastName%22}]`
    );
    return result?.data;
  }

  const _admins = options?.queryKey?.[4]  ? `&admins=${options?.queryKey?.[4]}` : "";
  const pageNo = options?.queryKey?.[3];
  const perPage = options?.queryKey?.[2];
  const queryStr = composeQueryString(options);
  if (queryStr === false) return { data: [] };
  const result = await CustomAxios().get(
    `${process.env.REACT_APP_ENDPOINT}/user-groups${queryStr}${_admins}&page=${pageNo}&per_page=${perPage}`
  );

  return result.data;
};

// search user request
export const searchUserGroupsAPI = async (value) => {
  //console.log(value);
  const per_page = 20;
  const result = await CustomAxios().get(
    `${process.env.REACT_APP_ENDPOINT}/user-groups?search=${value}&selection=id+name`
  );
  return result.data;
};
// new usergroup request
export const newUserGroupAPI = async ({ data }) => {
  const result = await CustomAxios().post(
    `${process.env.REACT_APP_ENDPOINT}/user-groups`,
    data
  );
  return result.data;
};

// update a user request
export const updateUserGroupAPI = async ({ data: { id, ...data } }) => {
  const result = await CustomAxios().put(
    `${process.env.REACT_APP_ENDPOINT}/user-groups/${id}`,
    data
  );
  return result.data;
};

// delete a user request
export const removeUserGroupAPI = async ({ id }) => {
  const result = await CustomAxios().delete(
    `${process.env.REACT_APP_ENDPOINT}/user-groups/${id}`
  );
  return result.data;
};

export const getDirectorySyncGroups = async (query) => {
  try {
    const result = await CustomAxios().get(
      `${process.env.REACT_APP_ENDPOINT}/directorysync/groups`,
      {
        params: { searchValue: query },
      }
    );
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const addGroupFromDirectorySync = async (groups) => {
  const result = await CustomAxios().post(
    `${process.env.REACT_APP_ENDPOINT}/user-groups/add-from-directory`,
    { groups }
  );
  return result.data;
};
