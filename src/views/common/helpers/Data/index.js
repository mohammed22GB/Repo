import { SET_DATA_PERMS } from "../../../../store/actions/dataAction";

export const setDataPermissions = (data) => async (dispatch) => {
  //console.log(`SET_DATA_PERMS > ${JSON.stringify(data)}`);
  dispatch({ type: SET_DATA_PERMS, payload: data });
};
