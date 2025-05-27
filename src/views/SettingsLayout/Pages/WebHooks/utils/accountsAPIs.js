import { CustomAxios } from "../../../../common/utils/CustomAxios";

//  get list of users
export const getAccountWebhookInfo = async () => {
  const result = await CustomAxios().get(
    `${process.env.REACT_APP_ENDPOINT}/accounts/webhook/status`
  );
  return result.data;
};

//  get list of users
export const refreshWebhookApiKey = async () => {
  const result = await CustomAxios().put(
    `${process.env.REACT_APP_ENDPOINT}/accounts/webhook/refresh`,
    {}
  );
  return result.data;
};

//  get list of users
export const updateWebhookStatus = async (newStatus) => {
  const userinfo = localStorage.getItem("userInfo");
  const id = JSON.parse(userinfo)?.account?.id;

  const result = await CustomAxios().put(
    `${process.env.REACT_APP_ENDPOINT}/accounts/${id}`,
    { webhookEnabled: newStatus }
  );
  return result.data;
};
