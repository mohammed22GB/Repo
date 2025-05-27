import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import useCustomQuery from "../../../common/utils/CustomQuery";
import { ssoRedirects } from "../../../common/components/Query/AppsQuery/queryApp";
import {
  mainNavigationUrls,
  unprotectedUrls,
} from "../../../common/utils/lists";
import { receiveLogin } from "../../../../store/actions";

const VerifySSO = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  useCustomQuery({
    apiFunc: ssoRedirects,
    queryKey: "redirectSSO",
    onError: () => {
      history.push(unprotectedUrls.LOGIN);
    },
    onSuccess: ({ data }) => {
      console.log("got  inside success");
      // console.log("data", data);
      // console.log("data?.data :>> ", data?.data);
      // console.log("data?.data :>> ", data?.data?.data);
      localStorage.setItem("userId", data?.data?.data?.id);
      localStorage.setItem("accountId", data?.data?.data?.account?.id);
      localStorage.setItem("userInfo", JSON.stringify(data?.data?.data));
      localStorage.setItem("accessToken", data?.data?._meta?.accessToken);
      dispatch(receiveLogin(data?.data?.data));
      history.push(mainNavigationUrls.APPS);
    },
  });
  console.log("got into sso verify");

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      Loading... please wait...
      <img src="../../../images/loading-anim.svg" alt="Clone" width={20} />
    </div>
  );
};

export default VerifySSO;
