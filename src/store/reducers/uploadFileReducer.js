import * as t from "../actions/uploadFileAction";

const initialState = {
  fileData: [],
};

export const upLoadFileReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case t.SET_FILE_DATA:
      return { ...state, fileData: payload };

    default:
      return state;
  }
};
