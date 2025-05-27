import React from "react";
import { useQuery } from "react-query";
import { CUSTOM_PORTAL_QUERY_KEY } from "./customizationutils";
import { getAccountInfo } from "../../SsoConfiguration/utils/ssoAccountsAPI";

const useIsCustomisationEnabled = () => {
  const { data, isLoading, isFetching } = useQuery(
    [CUSTOM_PORTAL_QUERY_KEY],
    getAccountInfo,
    {
      cacheTime: 24 * 60 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchInterval: 0,
      refetchOnMount: false,
    }
  );

  const isCustomPortalEnabled = data?.data?.enableCustomPortal;

  return { isCustomPortalEnabled };
};

export default useIsCustomisationEnabled;
