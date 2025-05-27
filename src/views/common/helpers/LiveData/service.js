import axios from "axios";
import { CustomAxios } from "../../utils/CustomAxios";
import { catchErr } from "../../utils/catchErr";

export const getScreenService = async (screenId, app) => {
  try {
    const { data } = await CustomAxios().get(
      `${process.env.REACT_APP_ENDPOINT}/screens?population=["items"]&slug=${screenId}&isPublic=true&app=${app}`
    );
    return {
      data,
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      data: error.response,
    };
  }
};

export const runLiveDataService = async ({
  appSlug,
  queryParam,
  relaunch,
  accountSlug,
}) => {
  const url = `${
    process.env.REACT_APP_ENDPOINT
  }/apps/run/${accountSlug}/${appSlug}${relaunch ? `?${queryParam}` : ""}`;

  try {
    const {
      data: { data },
    } = await CustomAxios().post(url, {});

    return {
      data,
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      data: error.response,
    };
  }
};

export const uploadFileService =
  (file, isAssetRoute) => async (dispatch, getState) => {
    const isPublic = { ...getState().liveData.app.isPublic };

    try {
      const {
        data: { data },
      } = await CustomAxios().post(
        isAssetRoute
          ? `${process.env.REACT_APP_ENDPOINT}/files/asset`
          : `${process.env.REACT_APP_ENDPOINT}/files${
              isPublic ? "/public" : ""
            }/upload`,
        file,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return {
        data,
        success: true,
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
export const deleteUploadedFileService = async (id) => {
  try {
    const {
      data: { data },
    } = await CustomAxios().delete(
      `${process.env.REACT_APP_ENDPOINT}/files/${id}`
    );
    return {
      data,
      success: true,
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

export const runCurrentTaskService = async (
  payload,
  isApproval,
  queryParams
) => {
  try {
    let url;

    if (isApproval) {
      url = `${process.env.REACT_APP_ENDPOINT}/tasks/run?${queryParams}`;
    } else {
      url = `${process.env.REACT_APP_ENDPOINT}/tasks/run`;
    }

    const {
      data: { data },
    } = await CustomAxios().post(url, {
      ...payload,
      data: {
        ...payload.data,
        redirectUrl: `${process.env.REACT_APP_BASE_URL}`,
      },
    });

    return {
      data,
      success: true,
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

export const getPDFUrl = async (payload) => {
  let res, data;
  const body = payload
    ? {
        //html: `${JSON.stringify(payload)}`,
        html: `${payload}`,
        name: "result.pdf",
        margins: "5px 5px 5px 5px",
        paperSize: "Letter",
        orientation: "Portrait",
        printBackground: true,
        header: "",
        footer: "",
        mediaType: "print",
        async: false,
        encrypt: false,
      }
    : null;
  try {
    res = await axios.post(
      "https://api.pdf.co/v1/pdf/convert/from/html",
      body,
      {
        headers: {
          "x-api-key":
            "mohammed.gberejaye@descasio.io_a023993e65aa27e11b9171329715fb6f54ab320c464a9e0bd574ee666a7cc232be1547c3",
          "Content-Type": "application/json",
        },
      }
    );
    data = res.data;
    return data;
  } catch (error) {
    catchErr({
      alertResMessage: error?.response?.data?._meta?.error?.message,
    });
    return {
      success: false,
      data: error.response,
    };
  }
};
