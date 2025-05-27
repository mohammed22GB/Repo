import {
  USERS_LOAD_USERS,
  USERS_SAVE_USERGROUPS,
  SET_TRIGGER_NEW_USER_VALUE,
  SET_TRIGGER_NEW_USERGROUP_VALUE,
  SET_TRIGGER_NEW_CATEGORY_VALUE,
} from "../actions/actionTypes";

export const users = (
  state = {
    users: [],
    userGroups: [],
    triggerNewUser: "",
    triggerNewUserGroup: "",
  },
  action
) => {
  switch (action.type) {
    case USERS_LOAD_USERS: {
      const users = action.payload;
      return {
        ...state,
        users,
      };
    }

    case USERS_SAVE_USERGROUPS: {
      const userGroups = action.payload;
      return {
        ...state,
        userGroups,
      };
    }

    case SET_TRIGGER_NEW_USER_VALUE: {
      const triggerNewUser = action.payload;
      return {
        ...state,
        triggerNewUser,
      };
    }

    case SET_TRIGGER_NEW_USERGROUP_VALUE: {
      const triggerNewUserGroup = action.payload;
      return {
        ...state,
        triggerNewUserGroup,
      };
    }

    case SET_TRIGGER_NEW_CATEGORY_VALUE: {
      const triggerNewCategory = action.payload;
      return {
        ...state,
        triggerNewCategory,
      };
    }

    default:
      return state;
  }
};
