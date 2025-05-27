import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import Error from "./Error";
import LoadingScreen from "./LoadingScreen";
import { getLiveData } from "../common/helpers/LiveData";
import { unprotectedUrls } from "../common/utils/lists";

const Run = ({ match, location }) => {
  const appSlug = match.params.appSlug;
  const accountSlug = match.params.accountSlug;
  const history = useHistory();

  const [freshOpen, setfreshOpen] = useState(false);

  const dispatch = useDispatch();
  const { screensInfo, error, loading, task, workflowInstance, app } =
    useSelector(({ liveData }) => liveData);

  useEffect(() => {
    document.title = "Plug | Run App";
  }, []);

  useEffect(() => {
    dispatch(getLiveData({ appSlug, accountSlug, relaunch: false }));
  }, [appSlug, accountSlug]);

  useEffect(() => {
    if (!error && !loading && screensInfo) {
      let url = `${location.pathname}/${screensInfo.slug}?taskId=${
        task.id
      }&workflowInstanceId=${workflowInstance.id}&appId=${
        app.id
      }&new=${!freshOpen}`;

      setfreshOpen(true);

      return history.push(url);
    }
    // This check if there's screen from the backend
    if (!error && !loading && !screensInfo) {
      history.push(unprotectedUrls.RUN_COMPLETED);
    }
  }, [screensInfo, error, loading]);

  return (
    <>
      <LoadingScreen
        loading={loading}
        message={"Initializing your application..."}
      />
      <Error status={error?.code} message={error?.message} />
    </>
  );
};

export default Run;
