import { CustomAxios } from "../../../utils/CustomAxios";

export const getInAppNotification = async ({
  queryKey: [, { perPage, page, read, sortParams, setIsLoading }],
}) => {
  setIsLoading && setIsLoading(true);
  /* This is a way to conditionally add a query parameter to the URL. */
  let status = read === "read" ? true : read === "unread" ? false : read;

  /* This is a way to add a query parameter to the URL. */
  let searchQuery = `${
    typeof status !== "boolean" || status !== "" || status !== "none"
      ? ""
      : `&type=${status}`
  }`;

  /* check if the object is empty, if yes, return nothing else return the stringify version of the sortParams*/
  let sort = Object.keys(sortParams)?.length
    ? `&sort=${JSON.stringify(sortParams)}`
    : "";

  /* This is a way to conditionally add a query parameter to the URL. */
  const readStatus =
    typeof status !== "boolean"
      ? `?per_page=${perPage}&page=${page}${sort}${searchQuery}`
      : `?per_page=${perPage}&page=${page}&read=${status}${sort}`;

  /* This is a way to make a call to the API. The `CustomAxios()` function is a custom function that I
 created to make a call to the API. The `await` keyword is used to wait for the promise to resolve. */
  const result = await CustomAxios().get(
    `${process.env.REACT_APP_ENDPOINT}/notifications${readStatus}`
  );
  setIsLoading && setIsLoading(false);
  /* This is the return statement of the function. It is returning the result of the
`CustomAxios().get()` function. */
  return result;
};

export const getSpecifiedInAppNotification = async ({
  queryKey: [, { id }],
}) => {
  const result = await CustomAxios().get(
    `${process.env.REACT_APP_ENDPOINT}/notifications/${id}`
  );

  return result;
};

export const updateNotification = async ({ id }) => {
  const result = await CustomAxios().put(
    `${process.env.REACT_APP_ENDPOINT}/notifications/read/${id}`
  );

  return result;
};
