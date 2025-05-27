import {
  FILE_UPLOAD_START,
  FILE_UPLOAD_SUCCESS,
  GET_LIVE_DATA_ERROR,
  GET_LIVE_DATA_START,
  GET_LIVE_DATA_SUCCESS,
  GET_LIVE_SCREEN_ERROR,
  GET_LIVE_SCREEN_START,
  GET_LIVE_SCREEN_SUCCESS,
  GET_SCREENS_FROM_STORAGE,
  LIVE_RUN_FIRST_SCREEN,
  SET_LOADING_STATE,
  TASK_RUNNING,
} from "../../../../store/actions/actionTypes";
import {
  rSaveActiveScreen,
  rUieSetCanvasStructure,
  rUieSetScreensItems,
  rUpdateScreensList,
} from "../../../../store/actions/properties";
import {
  runLiveDataService,
  getScreenService,
  runCurrentTaskService,
  uploadFileService,
  deleteUploadedFileService,
} from "./service";

export const getLiveData =
  ({ appSlug, accountSlug, queryParam, relaunch }) =>
  async (dispatch, getState) => {
    const { screensItems } = getState().uieditor;
    const { success, data } = await runLiveDataService({
      appSlug,
      accountSlug,
      queryParam,
      relaunch,
    });

    if (!success) {
      return dispatch({
        type: GET_LIVE_DATA_ERROR,
        payload: data?.data?._meta?.error,
      });
    }

    dispatch({
      type: GET_LIVE_DATA_START,
    });

    const payload = {
      screensInfo: data?.screens?.[0],
      task: data.task,
      taskVariables: data.taskVariables,
      workflowInstance: data.workflowInstance,
      app: data.app,
    };

    if (data?.screens?.[0] && !data?.screens?.[0]?.id) {
      data.screens[0].id = data?.screens?.[0]?._id;
    }
    const screenId = data?.screens?.[0]?.id;
    const itemsObjects = {};
    data?.screens?.[0]?.items?.forEach((item) => {
      if (!item.id) {
        item.id = item._id;
      }
      itemsObjects[item.itemRef] = item;
    });

    const newScreensItems = {
      ...screensItems,
      [screenId]: itemsObjects,
    };
    dispatch(rUieSetScreensItems(newScreensItems));

    //  put screen in global state
    dispatch(rUpdateScreensList(data?.screens));
    dispatch(rSaveActiveScreen(data?.screens?.[0]));
    dispatch(rUieSetCanvasStructure(data?.screens?.[0]?.layout));

    localStorage.setItem("liveAppSlug", appSlug);
    localStorage.setItem("liveAccountSlug", accountSlug);
    return dispatch({
      type: GET_LIVE_DATA_SUCCESS,
      payload,
    });
  };

export const getLiveScreen = (slug, app, accountSlug) => async (dispatch) => {
  dispatch({ type: GET_LIVE_SCREEN_START });
  const { data, success } = await getScreenService(slug, app, accountSlug);
  if (!success) return dispatch({ type: GET_LIVE_SCREEN_ERROR, payload: data });
  dispatch({ type: GET_LIVE_SCREEN_SUCCESS, payload: data.data?.[0] || {} });
};

export const runCurrentTask =
  ({ payload, isApproval, queryParams, history, accountSlug }) =>
  async (dispatch, getState) => {
    dispatch({
      type: TASK_RUNNING,
      payload: true,
    });
    const { screensItems } = getState().uieditor;

    const { success, data } = await runCurrentTaskService(
      payload,
      isApproval,
      queryParams
    );

    dispatch({
      type: TASK_RUNNING,
      payload: false,
    });

    if (!success) {
      return dispatch({
        type: GET_LIVE_DATA_ERROR,
        payload: data?.data?._meta?.error,
      });
    }

    dispatch({
      type: GET_LIVE_DATA_START,
    });

    const { screens, app, task, workflowInstance, loopingId } = data;

    if (!screens?.length) {
      history.push(`/run/completed`);
      return;
    }

    const receivedData = {
      screensInfo: screens?.[0],
      task,
      workflowInstance,
      app,
    };

    if (screens?.[0] && !screens?.[0]?.id) {
      screens[0].id = screens?.[0]?._id;
    }

    const screenId = screens?.[0]?.id;
    const itemsObjects = {};

    screens?.[0]?.items?.forEach((item) => {
      if (!item.id) {
        item.id = item._id;
      }
      itemsObjects[item.itemRef] = item;
    });

    const newScreensItems = {
      ...screensItems,
      [screenId]: itemsObjects,
    };
    dispatch(rUieSetScreensItems(newScreensItems));

    //  put screen in global state
    dispatch(rUpdateScreensList(screens));
    dispatch(rSaveActiveScreen(screens?.[0]));
    dispatch(rUieSetCanvasStructure(screens?.[0]?.layout));

    localStorage.setItem("liveAppSlug", app?.slug);
    localStorage.setItem("liveAccountSlug", accountSlug);

    dispatch({
      type: GET_LIVE_DATA_SUCCESS,
      payload: receivedData,
    });

    const screen = screens[0];
    const loopingIdString = loopingId ? `&loopingId=${loopingId}` : "";

    history.push(
      `/run/${accountSlug}/${app?.slug}/${screen?.slug}?taskId=${task.id}&workflowInstanceId=${workflowInstance.id}&appId=${app.id}${loopingIdString}`
    );

    return;
  };

export const uploadFile =
  (componentId, file, cb, isAssetRoute) => async (dispatch, getState) => {
    const filesUploaded = { ...getState().liveData.filesUploaded };
    const uploadingFile = { ...getState().liveData.uploadingFile };
    const isPublic = { ...getState().liveData.app.isPublic };

    const payloadStart = { ...uploadingFile, [componentId]: true };

    dispatch({
      type: FILE_UPLOAD_START,
      payload: payloadStart,
    });

    const { success, data } = await dispatch(
      uploadFileService(file, isAssetRoute)
    );
    const payload = { ...uploadingFile, [componentId]: false };

    if (!success) {
      return dispatch({
        type: FILE_UPLOAD_START,
        payload,
      });
    }

    const successPayload = {
      uploadingFile: { ...uploadingFile, [componentId]: false },
      filesUploaded: {
        ...filesUploaded,
        [componentId]: [...(filesUploaded?.[componentId] ?? []), ...data],
      },
    };
    dispatch({
      type: FILE_UPLOAD_SUCCESS,
      payload: successPayload,
    });

    //  formerly extracting 'url' of GCP bucket file, now constructing...
    //  url from id of file and download endpoint

    // cb(data.map((v) => v.url));

    //  first determine whether app is internal or external (add /public/)
    !!cb &&
      cb(
        data.map(
          (v) => v.url
          // `${process.env.REACT_APP_ENDPOINT}/download${
          //   isPublic ? "/public" : ""
          // }/${v.id}`
        )
      );
    if (success) return true;
  };

export const deleteUpdatedFile = (id, cid) => async (dispatch, getState) => {
  const state = { ...getState().liveData.filesUploaded };
  dispatch({
    type: FILE_UPLOAD_START,
    payload: true,
  });
  const { success } = await deleteUploadedFileService(id);
  if (!success)
    return dispatch({
      type: FILE_UPLOAD_START,
      payload: false,
    });
  state[cid] = state[cid].filter((obj) => obj.id !== id);
  dispatch({
    type: FILE_UPLOAD_SUCCESS,
    payload: {
      filesUploaded: state,
    },
  });
};

export const getScreenFromStorage = (screenId) => (dispatch, getState) => {
  const screen = localStorage.getItem(screenId);
  if (!screen) return;
  dispatch({ type: GET_SCREENS_FROM_STORAGE, payload: JSON.parse(screen) });
};

export const setRunFirstScreen = (screenId) => (dispatch) => {
  dispatch({ type: LIVE_RUN_FIRST_SCREEN, payload: screenId });
};
