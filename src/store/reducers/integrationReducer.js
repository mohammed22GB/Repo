import * as t from "../actions/integrationActions";

const initialState = {
  editAccountFlag: false,
};

export const integrationReducer = (state = initialState, action) => {
  const { payload, type } = action;
  //console.log("payload", payload);
  switch (type) {
    case t.SET_EDIT_INTEGRATION_FLAG:
      return { ...state, editAccountFlag: payload };

    default:
      return state;
  }
};
