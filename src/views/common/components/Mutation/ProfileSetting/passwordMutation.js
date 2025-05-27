import { CustomAxios } from "../../../utils/CustomAxios";

export const changePassword = async (data) =>
  await CustomAxios()
    .post(`${process.env.REACT_APP_ENDPOINT}/auth/change-password/`, data)
    .then((res) => res.data);
