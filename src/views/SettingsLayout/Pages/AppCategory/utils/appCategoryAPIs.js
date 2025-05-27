import { composeQueryString } from "../../../../common/utils/composeQueryString";
import { CustomAxios } from "../../../../common/utils/CustomAxios";

//  get list of users
export const getAppCategoryAPI = async (options) => {
  //console.log(options["queryKey"]);
  const userID = options["queryKey"][2];
  let per_page = 10;
  if (
    options["queryKey"][3] &&
    Object.keys(options["queryKey"][3])[0] === "perPage"
  ) {
    per_page = options["queryKey"][3]["perPage"];
  }
  const queryStr = composeQueryString(options);
  if (queryStr === false) return { data: [] };

  const result = await CustomAxios().get(
    `${process.env.REACT_APP_ENDPOINT}/categories${queryStr}&account=${userID}&per_page=${per_page}`
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
