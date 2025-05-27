import { CustomAxios } from "../../../../common/utils/CustomAxios";
import { errorToastify } from "../../../../common/utils/Toastify";

const handleErrors = (err) => {
  console.log(`eeeeee>> ${JSON.stringify(err.response)}`);
  const meta_ = err?.response?.data?._meta;
  const errMsg = meta_?.error?.message;
  let dupls;
  if (errMsg.includes("duplicate")) {
    dupls = Object.keys(meta_?.developerMessage?.keyValue);
  }
  errorToastify(dupls ? `Duplicate values: ${dupls.join(", ")}` : errMsg);
};

//  get list of users
export const getBillingSubscriptionAPI = async (orgId) => {
  try {
    const result = await CustomAxios().get(
      `${process.env.REACT_APP_ENDPOINT}/subscriptions${
        !!orgId ? `/account/${orgId}` : `?status=active`
      }`
    );

    return result.data;
  } catch (err) {
    errorToastify(err?.response?.data?._meta?.error?.message);
  }
};

// new BillingSubscription request
export const newBillingSubscriptionAPI = async ({ data }) => {
  try {
    const result = await CustomAxios().post(
      `${process.env.REACT_APP_ENDPOINT}/subscriptions`,
      data
    );
    return result.data;
  } catch (err) {
    handleErrors(err);
  }
};

// update a user request
export const updateBillingSubscriptionAPI = async ({ id, data }) => {
  try {
    const result = await CustomAxios().put(
      `${process.env.REACT_APP_ENDPOINT}/subscriptions/${id}`,
      data
    );
    return result.data;
  } catch (err) {
    handleErrors(err);
  }
};

// delete a user request
export const removeBillingSubscriptionAPI = async ({ id }) => {
  const result = await CustomAxios().delete(
    `${process.env.REACT_APP_ENDPOINT}/subscriptions/${id}`
  );
  return result.data;
};
