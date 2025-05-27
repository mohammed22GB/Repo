import { CustomAxios } from "../../common/utils/CustomAxios";

//  get list of users
export const getOrganizations = async (data) => {
  const pageNo = data.queryKey[1];
  const sortValue = data.queryKey[2];
  let per_page = 10;
  //console.log(data.queryKey);
  if (
    data["queryKey"][3] &&
    Object.keys(data["queryKey"][3])[0] === "perPage"
  ) {
    per_page = data["queryKey"][3]["perPage"];
  }
  //const queryStr = composeQueryString(options);
  //if (queryStr === false) return { data: [] };

  const result = await CustomAxios().get(
    `${process.env.REACT_APP_ENDPOINT}/accounts/details?page=${pageNo}&sortStr=${sortValue}&per_page=${per_page}` //?sortStr=email
  );

  return result.data;
};

// new AppCategory request
export const newAppCategoryAPI = async ({ data }) => {
  const result = await CustomAxios().post(
    `${process.env.REACT_APP_ENDPOINT}/categories`,
    data
  );
  return result.data;
};

// update a user request
export const updateAppCategoryAPI = async ({ data: { id, ...data } }) => {
  const result = await CustomAxios().put(
    `${process.env.REACT_APP_ENDPOINT}/categories/${id}`,
    data
  );
  return result.data;
};

// delete a user request
export const removeAppCategoryAPI = async ({ id }) => {
  const result = await CustomAxios().delete(
    `${process.env.REACT_APP_ENDPOINT}/categories/${id}`
  );
  return result.data;
};

//  get list of organization details
export const getOrganizationDetails = async (options) => {
  const { queryKey } = options;
  const result = await CustomAxios().get(
    `${process.env.REACT_APP_ENDPOINT}/accounts/${queryKey[2]}/details`
  );

  return result.data;
};

// get Live App Chart API
export const getLiveAppChartAPI = async () => {
  const result = await CustomAxios().get(
    `${process.env.REACT_APP_ENDPOINT}/apps/live-app-graph`
  );
  return result.data;
};

// get Live User Chart API
export const getLiveUserChartAPI = async () => {
  const result = await CustomAxios().get(
    `${process.env.REACT_APP_ENDPOINT}/users/all-users-graph`
  );
  return result.data;
};
