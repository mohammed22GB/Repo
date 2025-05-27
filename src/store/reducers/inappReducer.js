import * as t from "../actions/inappActions";

const appsState = {
  toggleNotification: false,
  notificationMenu: [],
  singleNotificationMenu: null,
  unreadNotificationCount: null,
};

export const inappReducer = (state = appsState, action) => {
  const { type, payload } = action;

  switch (type) {
    case t.TOGGLE_NOTIFICATION:
      return { ...state, toggleNotification: payload };

    case t.NOTIFICATION_MENU:
      return { ...state, notificationMenu: payload };

    case t.SINGLE_NOTIFICATION:
      return { ...state, singleNotificationMenu: payload };

    case t.ADD_NOTIFICATION:
      return {
        ...state,
        notificationMenu: [...state.notificationMenu, payload],
      };
    case t.UNREAD_NOTIFICATION_COUNT:
      return {
        ...state,
        unreadNotificationCount: payload,
      };

    default:
      return state;
  }
};
