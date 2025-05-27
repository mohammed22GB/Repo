import { CustomAxios } from "../../../utils/CustomAxios";

export const getUserById = async ({ queryKey: [, { id, population }] }) => {
  const result = await CustomAxios().get(
    `${process.env.REACT_APP_ENDPOINT}/users/${id}?population=${population}`
  );

  return result;
};
