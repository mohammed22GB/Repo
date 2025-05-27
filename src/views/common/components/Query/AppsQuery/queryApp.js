import { CustomAxios } from "../../../utils/CustomAxios";

export const getAppsList = async (
  { queryKey: [{ appSortParams, selectedCategory, page, perPage }] },
  searchVal
) => {
  const searchStr = !!searchVal ? `search=${searchVal}&` : "";
  let stringifySortParams = appSortParams ? JSON.stringify(appSortParams) : "";
  let category =
    selectedCategory === "All" ? "" : `&category=${selectedCategory}`;
  const result = await CustomAxios().get(
    `${process.env.REACT_APP_ENDPOINT}/apps?${searchStr}population=["account","category","ownerGroup"]&sort=${stringifySortParams}${category}&page=${page}&per_page=${perPage}`
  );

  return result;
};

export const getCategoryAndAppsList = async (
  { queryKey: [{ appSortParams, selectedCategory, page, perPage }] },
  searchVal
) => {
  const searchStr = !!searchVal ? `search=${searchVal}&` : "";
  let stringifySortParams = appSortParams ? JSON.stringify(appSortParams) : "";
  let category =
    selectedCategory === "All" ? "" : `&category=${selectedCategory}`;
  const result = await CustomAxios().get(
    `${
      process.env.REACT_APP_ENDPOINT
    }/categories/apps?${searchStr}population=["account","category","ownerGroup"]&sort=${stringifySortParams}${category}&page=${
      page + 1
    }&per_page=${perPage}`
  );

  return result;
};

export const getCategories = async () => {
  const result = await CustomAxios().get(
    `${process.env.REACT_APP_ENDPOINT}/categories`
  );

  return result;
};

export const ssoRedirects = async () => {
  const result = await CustomAxios().get(
    `${process.env.REACT_APP_ENDPOINT}/auth/sso-authorize`,
    {
      withCredentials: false,
    }
  );

  return result;
};
