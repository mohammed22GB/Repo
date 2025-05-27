import {
  NOTIFICATION_MENU,
  UNREAD_NOTIFICATION_COUNT,
} from "../../../store/actions/inappActions";

export const makeReduxUpdateToNotificationCount =
  (updatedCount) => (dispatch) => {
    dispatch({ type: UNREAD_NOTIFICATION_COUNT, payload: updatedCount });
  };

export const afterApiCallSetNotificationMenu = (count) => (dispatch) => {
  dispatch({ type: NOTIFICATION_MENU, payload: count });
};
