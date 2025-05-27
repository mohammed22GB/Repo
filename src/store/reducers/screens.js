import { manageAppLocalStorage } from "../../views/common/helpers/helperFunctions";
import {
  SCREENS_SET_ACTIVE_SCREEN,
  SCREENS_SET_SCREENS_LIST,
} from "../actions/actionTypes";

const currentActiveScreen = manageAppLocalStorage("get", null, "activeScreen");

export const screens = (
  state = {
    screensList: [],
    activeScreen: currentActiveScreen || {
      id: null,
      name: "",
      type: "",
      slug: "",
    },
  },
  action
) => {
  switch (action.type) {
    case SCREENS_SET_SCREENS_LIST: {
      const screensList = action.payload;
      return {
        ...state,
        screensList,
      };
    }

    case SCREENS_SET_ACTIVE_SCREEN: {
      const activeScreen = action.payload;
      return {
        ...state,
        activeScreen,
      };
    }

    default:
      return state;
  }
};
