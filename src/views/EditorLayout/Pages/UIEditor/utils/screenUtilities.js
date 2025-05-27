import {
  rUieSetScreensItems,
  rUieSetCanvasStructure,
  rSaveActiveScreen,
  rUpdateScreensList,
} from "../../../../../store/actions/properties";
import {
  manageAppLocalStorage,
  wrapAPI,
} from "../../../../common/helpers/helperFunctions";
import {
  getScreens,
  getSingleScreenItems,
} from "../../UIEditor/utils/screenAPIs";

export const getAllScreens =
  (appId, refresh, history, screenSlug, syncItems) =>
  async (dispatch, getState) => {
    const { screensList, activeScreen } = getState().screens;
    let returnScreensList = screensList;
    let freshScreenId;

    if (!screensList?.length || refresh) {
      //  get screens from backend
      const { success, data } = await dispatch(
        wrapAPI(getScreens, "Screens loaded", {
          appId,
          noLogError: true,
          syncItems,
        })
      );

      if (success) {
        returnScreensList = data?.data;
        //  load data into state
        dispatch(rUpdateScreensList(returnScreensList));
      }

      const existingActiveScreen =
        returnScreensList.find((screen) => screen.slug === screenSlug) ||
        returnScreensList.find((screen) => screen.id === activeScreen?.id) ||
        returnScreensList?.[0] ||
        {};

      const { id, name, slug, type, layout } = existingActiveScreen;

      if (!activeScreen?.id || screenSlug) {
        manageAppLocalStorage("set", appId, "activeScreen", {
          id,
          name,
          slug,
          type,
        });
        freshScreenId = id;
      }

      dispatch(rSaveActiveScreen(existingActiveScreen));
      dispatch(rUieSetCanvasStructure(layout));

      const screenId = freshScreenId || activeScreen?.id;
      !!screenId && dispatch(getAllActiveScreenItems(screenId, refresh));
    }
    return returnScreensList || [];
  };

export const getAllActiveScreenItems =
  (screenId, refresh) => async (dispatch, getState) => {
    const { screensItems } = getState().uieditor;

    if (!Object.keys(screensItems?.[screenId] || {})?.length || refresh) {
      const { success, data } = await dispatch(
        wrapAPI(getSingleScreenItems, "Screens items loaded", {
          id: screenId,
          noLogError: true,
        })
      );

      if (success) {
        const returnedScreenItems = data;

        //  first convert array to objects for easy accessibility
        const itemsObjects = {};
        returnedScreenItems.forEach((item) => {
          itemsObjects[item.itemRef] = item;
        });
        //  load data into state
        const newScreensItems = {
          ...screensItems,
          [screenId]: itemsObjects,
        };
        dispatch(rUieSetScreensItems(newScreensItems));
      } else {
        // errorToastify("Invalid URL. Kindly check and try again.");
        // history && history.push("/apps");
      }
    }
  };
