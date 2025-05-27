import { useQuery } from "react-query";
import { CUSTOM_GET_USER_PORTAL_CUSTOMISATION_QUERY_KEY } from "./customizationutils";
import { getAccountInfo } from "../../SsoConfiguration/utils/ssoAccountsAPI";

const useGetUserPortalCustomisation = () => {
  const { data, isLoading, isFetching } = useQuery(
    [CUSTOM_GET_USER_PORTAL_CUSTOMISATION_QUERY_KEY],
    getAccountInfo,
    {
      cacheTime: 24 * 60 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchInterval: 0,
      refetchOnMount: false,
    }
  );
  const internalPage = data?.data?.customisations?.internalPage;
  const logo = data?.data?.customisations?.logo;
  const brandTheme = data?.data?.customisations?.theme?.primaryColor;

  return { logo, internalPage, isLoading, isFetching, brandTheme };
};

export default useGetUserPortalCustomisation;
