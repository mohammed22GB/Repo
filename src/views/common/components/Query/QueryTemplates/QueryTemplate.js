import { CustomAxios } from "../../../utils/CustomAxios";

/**
 * It's a function that makes a GET request to an API endpoint with query parameters.
 * @returns The result of the GET request.
 */
export const getTemplates = async ({
  queryKey: [{ appSortParams, selectedCategory, page, perPage }],
}) => {
  // if (!tempPermissions(getUserRole())) return;
  //console.log(`==> selectedCategory >> ${JSON.stringify(selectedCategory)}`);
  let stringifiedSortParams = JSON.stringify(appSortParams);
  let category =
    !selectedCategory || selectedCategory === "All"
      ? ""
      : `&category=${selectedCategory}`;
  const result = await CustomAxios().get(
    `${
      process.env.REACT_APP_ENDPOINT
    }/templates?population=["account","category"]&sort=${stringifiedSortParams}${category}&page=${
      page || 1
    }&per_page=${perPage}`
  );

  return result;
};
