import { CustomAxios } from "../../../utils/CustomAxios";

export const uploadUserCsvFile = async ({ users, redirectUrl }) =>
  await CustomAxios()
    .post(`${process.env.REACT_APP_ENDPOINT}/users/upload`, {
      users,
      redirectUrl,
    })
    .then((res) => res.data);
