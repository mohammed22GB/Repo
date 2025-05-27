import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useStyles from "./components/style";
import { getIntegrationDataAPI } from "../../../Integrations/utils/integrationsAPIs";
import { getAccountInfo } from "../SsoConfiguration/utils/ssoAccountsAPI";
import { errorToastify, successToastify } from "../../../common/utils/Toastify";
import useCustomMutation from "../../../common/utils/CustomMutation";
import { updateUserAccount } from "../../../common/components/Mutation/ProfileSetting/userMutations";
import useCustomQuery from "../../../common/utils/CustomQuery";
import CustomAppearance from "./components/CustomAppearance";
import CustomOrganisationEmail from "./components/CustomOrganisationEmail";
import CustomInternalUserPortal from "./components/CustomInternalUserPortal";
import { useQueryClient } from "react-query";
import { CUSTOM_GET_USER_PORTAL_CUSTOMISATION_QUERY_KEY } from "./utils/customizationutils";

const Customizations = () => {
  const classes = useStyles();
  const { user: userInfo } = useSelector(({ auth }) => auth); //to be uncommented

  const [internalUserPortal, setInternalUserPortal] = useState({});
  const [externalUserPortal, setExternalUserPortal] = useState({});

  const [menuItems, setMenuItems] = useState([]);
  const [quickAccessApps, setQuickAccessApps] = useState([]);

  const [logo, setLogo] = useState({});
  const [theme, setTheme] = useState({});
  const [defaultEmailSender, setDefaultEmailSender] = useState({});
  const [organizationEmail, setOrganizationEmail] = useState({});

  const userAccountId = userInfo?.account?.id;

  const [integrationList, setIntegrationList] = useState([]);

  const [loadingIntegration, setLoadingIintegration] = useState(false);

  const queryClient = useQueryClient();

  // after user account has been updated
  const onAccountUpdateSuccess = ({ data }) => {
    queryClient.refetchQueries(CUSTOM_GET_USER_PORTAL_CUSTOMISATION_QUERY_KEY);

    const userCustomisationInfo = data?.data?.customisations;

    setLogo(userCustomisationInfo?.logo);
    setTheme(userCustomisationInfo?.theme);

    setOrganizationEmail(userCustomisationInfo?.organizationEmail);
    setDefaultEmailSender(userCustomisationInfo?.defaultEmailSender);

    setInternalUserPortal(userCustomisationInfo?.internalPage);
    setExternalUserPortal(userCustomisationInfo?.externalPage);

    setMenuItems(userCustomisationInfo?.menuItems);
    setQuickAccessApps(userCustomisationInfo?.quickAccessApps);

    successToastify("Updated successfully");
  };

  // if there's an error
  const onAccountUpdateError = () => {
    errorToastify("Something went wrong, please try again later.");
  };

  const accountInfoSuccess = async ({ data }) => {
    setLoadingIintegration(true);
    const userCustomisationInfo = data?.data?.customisations;

    setLogo(userCustomisationInfo?.logo);
    setTheme(userCustomisationInfo?.theme);

    setOrganizationEmail(userCustomisationInfo?.organizationEmail);
    setDefaultEmailSender(userCustomisationInfo?.defaultEmailSender);

    setInternalUserPortal(userCustomisationInfo?.internalPage);
    setExternalUserPortal(userCustomisationInfo?.externalPage);

    setMenuItems(userCustomisationInfo?.menuItems);
    setQuickAccessApps(userCustomisationInfo?.quickAccessApps);

    const options = {
      query: {
        active: true,
        group: "mail",
        per_page: 1000,
      },
    };
    const integrations = await getIntegrationDataAPI(options);

    if (integrations?._meta?.success) {
      const _list = integrations.data;

      // list of integrations, mapping only the name and id
      const orgEmailList = _list.map((item) => ({
        value: item?.name,
        id: item?._id || item?.id,
      }));
      setIntegrationList(orgEmailList);

      setLoadingIintegration(false);
    } else {
      setLoadingIintegration(false);
      errorToastify("Sorry an error occured while loading your Integrations");
    }
  };

  // update user account
  const { mutate: updateAccount } = useCustomMutation({
    apiFunc: updateUserAccount,
    onSuccess: onAccountUpdateSuccess,
    onError: onAccountUpdateError,
    retries: 0,
  });

  //fetch account info
  const { isLoading, isFetching } = useCustomQuery({
    apiFunc: getAccountInfo,
    queryKey: ["accountInfo"],
    onSuccess: accountInfoSuccess,
    onError: onAccountUpdateError,
  });

  const handleUpdate = (updatedData) => {
    updateAccount({
      id: userAccountId,
      customisations: updatedData,
    });
  };

  useEffect(() => {
    document.title = "Settings | Customizations";
  }, []);

  return isLoading || isFetching || loadingIntegration ? (
    <div className={classes.loading}>
      Loading... please wait...
      <img src="../../../images/loading-anim.svg" alt="Clone" width={20} />
    </div>
  ) : (
    <div className={classes.root}>
      <div className={classes.mainColumnSection}>
        {/* first column secrtion */}
        <div className={classes.firstColumnSection}>
          <CustomAppearance
            logo={logo}
            theme={theme}
            userAccountId={userAccountId}
            handleUpdate={handleUpdate}
          />
          <CustomOrganisationEmail
            defaultEmailSender={defaultEmailSender}
            integrationList={integrationList}
            handleUpdate={handleUpdate}
          />
        </div>
        {/* second column secrtion */}
        <div className={classes.secondColumnSection}>
          <CustomInternalUserPortal
            handleUpdate={handleUpdate}
            theme={theme}
            internalUserPortal={internalUserPortal}
            quickAccessApps={quickAccessApps}
            menuItems={menuItems}
          />
        </div>
      </div>
    </div>
  );
};

export default Customizations;
