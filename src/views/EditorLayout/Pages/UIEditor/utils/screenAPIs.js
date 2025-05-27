import { debounce } from "lodash";
import { catchErr } from "../../../../common/utils/catchErr";
import { CustomAxios } from "../../../../common/utils/CustomAxios";
import { SetAppStatus } from "../../../../common/helpers/helperFunctions";
import { errorToastify } from "../../../../common/utils/Toastify";

export const getScreens = async ({ appId, syncItems }) => {
  try {
    const { data } = await CustomAxios().get(
      `${process.env.REACT_APP_ENDPOINT}/screens?per_page=100&app=${appId}${
        syncItems ? "&syncItems=true" : ""
      }`
    );
    return { success: data._meta?.success, data };
  } catch (error) {
    return { success: false, data: "Error getting screens" };
  }
};

export const getLookupItems = async ({
  taskId,
  workflowInstanceId,
  input,
  value,
  lookupType,
}) =>
  await CustomAxios().get(
    `${process.env.REACT_APP_ENDPOINT}/tasks/run/lookup?taskId=${taskId}&workflowInstanceId=${workflowInstanceId}&returnedDataType=${lookupType}&lookupFieldId=${input}&lookupFieldValue=${value}`
  );

export const createScreen = async (screen) => {
  try {
    const { data } = await CustomAxios().post(
      `${process.env.REACT_APP_ENDPOINT}/screens`,
      screen
    );
    return { success: data._meta?.success, data };
  } catch (error) {
    return {
      success: false,
      data: `Error creating screen (${
        error?.response?.data
          ? error?.response?.data?._meta?.error?.message
          : "(Network)"
      })`,
    };
  }
};

export const updateScreen = async ({ id, ...property }) => {
  try {
    const { data } = await CustomAxios().put(
      `${process.env.REACT_APP_ENDPOINT}/screens/${id}`,
      property
    );

    return { success: data._meta?.success, data };
  } catch (error) {
    return { success: false, data: "Error updating screen" };
  }
};

export const updateScreenItem = debounce(
  async ({ itemRef, showNotification, logFunction, ...property }) => {
    try {
      const { data } = await CustomAxios().put(
        `${process.env.REACT_APP_ENDPOINT}/items?itemRef=${itemRef}`,
        property
      );

      showNotification.dispatch(
        SetAppStatus({ type: "info", msg: "Item property updated" })
      );

      return { success: data._meta?.success, data };
    } catch (error) {
      const duplicate1 =
        error?.response?.data?._meta?.developerMessage?.codeName;
      const duplicate2 = error?.response?.statusText;
      const duplicateErrorMsg =
        duplicate1 === "DuplicateKey" || duplicate2 === "Conflict"
          ? "Duplicate entry not allowed"
          : "";

      if (duplicateErrorMsg) {
        errorToastify(duplicateErrorMsg);
      }

      showNotification.dispatch(
        SetAppStatus({
          type: "error",
          msg: duplicateErrorMsg || "Error updating item",
        })
      );

      if (!property.noLogError) {
        logFunction();
      }

      return { success: false, data: "Error updating item" };
    }
  },
  1000
);

export const saveAsset = async (file) => {
  try {
    const {
      data: { data },
    } = await CustomAxios().post(
      `${process.env.REACT_APP_ENDPOINT}/files/asset`,
      file,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return {
      data,
      success: data._meta?.success,
    };
  } catch (error) {
    catchErr({
      err: error,
      alertResMessage: error?.response?.data?._meta?.error?.message,
    });
    return {
      success: false,
      data: error.response,
    };
  }
};

export const deleteScreen = async ({ id }) => {
  try {
    const { data } = await CustomAxios().delete(
      `${process.env.REACT_APP_ENDPOINT}/screens/${id}`
    );
    return { success: data._meta?.success, data };
  } catch (error) {
    return { success: false, data: "Error deleting screen" };
  }
};

export const getSingleScreenItems = async ({ id }) => {
  try {
    const { data } = await CustomAxios().get(
      `${process.env.REACT_APP_ENDPOINT}/items?screen=${id}&per_page=500`
    );
    return { success: data._meta?.success, data: data.data };
  } catch (error) {
    return { success: false, data: "Error getting items" };
  }
};

export const duplicateScreen = async ({ id }) => {
  try {
    const { data } = await CustomAxios().post(
      `${process.env.REACT_APP_ENDPOINT}/screens/${id}/duplicate`
    );
    return { success: data._meta?.success, data };
  } catch (error) {
    return { success: false, data: "Error duplicating screens" };
  }
};

export const getDocumentScreenInfo = async (id) => {
  try {
    const { data } = await CustomAxios().get(
      `${process.env.REACT_APP_ENDPOINT}/screens/${id}`
    );
    return { success: data._meta?.success, data: data.data };
  } catch (error) {
    return { success: false, data: "Error getting items" };
  }
};

export const clearScreenItemsAPI = async ({ id }) => {
  try {
    const { data } = await CustomAxios().put(
      `${process.env.REACT_APP_ENDPOINT}/screens/${id}/clear-items`
    );
    return { success: true, data };
  } catch (error) {
    return { success: false, data: "Error clearing canvas" };
  }
};
