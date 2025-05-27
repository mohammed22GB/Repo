import axios from "axios";
import { composeQueryString } from "../../../../common/utils/composeQueryString";
import { CustomAxios } from "../../../../common/utils/CustomAxios";

//  get list of users
export const getUsersAPI = async (options, searchValue = null) => {
  const populationQuery = [
    {
      path: "userGroups",
      select: "name",
    },
    {
      path: "lineManager",
      select: "firstName lastName",
    },
  ];

  const populationQueryString = JSON.stringify(populationQuery);

  // search for a user if a debounce search value is provided
  if (searchValue) {
    const result = await CustomAxios().get(
      `${process.env.REACT_APP_ENDPOINT}/users?search=${searchValue}&population=${populationQueryString}`
    );
    return result.data;
  }

  const { pageParam } = options || {};
  let pageNo = pageParam ?? 1;
  let per_page = 10;

  if (options?.queryKey) {
    if (
      options["queryKey"][1] &&
      Object.keys(options["queryKey"][1]).includes("perpage")
    ) {
      per_page = options["queryKey"][1]["perpage"];
      pageNo = options["queryKey"][1]["pageParam"];
    }
  }
  const queryStr =
    options?.queryKey || options?.param || options?.query
      ? composeQueryString(options)
      : composeQueryString(null);

  // if (queryStr === false) return { data: [] };

  const result =
    queryStr === false
      ? await CustomAxios().get(
          `${process.env.REACT_APP_ENDPOINT}/users?population=${populationQueryString}&page=${pageNo}&per_page=${per_page}`
        )
      : await CustomAxios().get(
          `${process.env.REACT_APP_ENDPOINT}/users${queryStr}&population=${populationQueryString}&per_page=${per_page}`
        );

  return result.data;
};

// search user request
export const searchUsersAPI = async (value) => {
  const per_page = 20;
  const result = await CustomAxios().get(
    `${process.env.REACT_APP_ENDPOINT}/users?search=${value}&selection=id+firstName+lastName+roles`
  );
  return result.data;
};

// new user request
export const newUserAPI = async ({ data }) => {
  const url = axios.getUri({
    baseURL: process.env.REACT_APP_ENDPOINT,
    url: "/users/invite",
    params: {
      population: [
        {
          path: "userGroups",
          select: "name",
        },
        {
          path: "lineManager",
          select: "firstName lastName",
        },
      ],
    },
  });

  const result = await CustomAxios().post(url, data);
  return result.data;
};

// update a user request
export const updateUserAPI = async ({ data: { id, ...data } }) => {
  const url = axios.getUri({
    baseURL: process.env.REACT_APP_ENDPOINT,
    url: `/users/${id}`,
    params: {
      population: [
        {
          path: "userGroups",
          select: "name",
        },
        {
          path: "lineManager",
          select: "firstName lastName",
        },
      ],
    },
  });

  const result = await CustomAxios().put(url, data);
  return result.data;
};

// delete a user request
export const removeUserAPI = async ({ data: { id, ...data } }) => {
  const url = axios.getUri({
    baseURL: process.env.REACT_APP_ENDPOINT,
    url: `/users/${id}`,
  });

  const result = await CustomAxios().delete(url, data);
  return result.data;
};

// resend mail request
export const resendMailAPI = async (email) => {
  const redirectUrl = `${process.env.REACT_APP_BASE_URL}/create-password`;
  const result = await CustomAxios().post(
    `${process.env.REACT_APP_ENDPOINT}/users/invite/resend`,
    { email, redirectUrl }
  );
  return result.data;
};

export const exportUserAPI = async ({
  page = 1,
  per_page = 10,
  ...options
}) => {
  const population = [
    {
      path: "userGroups",
      select: "name",
    },
    {
      path: "lineManager",
      select: "firstName lastName",
    },
  ];

  const url = axios.getUri({
    baseURL: process.env.REACT_APP_ENDPOINT,
    url: "/users",
    params: {
      ...options,
      population,
      per_page,
      page,
    },
  });

  const result = await CustomAxios().get(url);
  return result.data;
};

export const getDirectorySyncUsers = async (query) => {
  try {
    const result = await CustomAxios().get(
      `${process.env.REACT_APP_ENDPOINT}/directorysync/users`,
      {
        params: { searchValue: query },
      }
    );
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const addUserFromDirectorySync = async (users) => {
  const result = await CustomAxios().post(
    `${process.env.REACT_APP_ENDPOINT}/users/add-from-directory`,
    { users }
  );
  return result.data;
};
