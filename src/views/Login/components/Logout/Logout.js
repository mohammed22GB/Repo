import { useMsal } from "@azure/msal-react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { googleLogout as signOut } from "@react-oauth/google";
import { useQueryClient } from "react-query";

import { logoutClearLocalStorage } from "../../../common/helpers/helperFunctions";
import { logoutUser, receiveLogout } from "../../../../store/actions";

const Logout = (props) => {
  const { instance } = useMsal();

  const dispatch = useDispatch();
  const history = useHistory();
  const queryClient = useQueryClient();

  const handleSignout = (event) => {
    event.preventDefault();

    queryClient.clear();
    dispatch(logoutUser({ signOut, instance }, history));
    logoutClearLocalStorage(history, false);
    dispatch(receiveLogout());
  };

  return (
    <div
      onClick={handleSignout}
      ref={props?.logOutRef}
      style={{ marginTop: props.marginTop ?? 20 }}
    >
      {props.children}
    </div>
  );
};

export default Logout;
