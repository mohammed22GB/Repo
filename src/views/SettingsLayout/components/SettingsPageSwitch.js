import { useState, useEffect } from "react";
import { withRouter, useHistory } from "react-router-dom";

import UserManagement from "../Pages/UserManagement";
import UserGroups from "../Pages/UserGroups";
import Roles from "../Pages/Roles";
import AppCategory from "../Pages/AppCategory";
import BillingSubscription from "../Pages/BillingSubscription";
import WebHooks from "../Pages/WebHooks/WebHooks";
import SSO from "../Pages/SsoConfiguration/SSO";
import DirectorySync from "../Pages/DirectorySyncConfiguration/DirectorySync";
import Customizations from "../Pages/Customizations/Customizations";
import ProfileSetting from "../Pages/ProfileSetting/ProfileSetting";
import SettingsPassword from "../Pages/SettingsPassword";
import {
  getUserRole,
  userManagementPermission,
} from "../../common/utils/userRoleEvaluation";
import { unprotectedUrls } from "../../common/utils/lists";
import AuditLog from "../Pages/AuditLog";
import queryString from "query-string";

const SettingsPageSwitch = ({ match, location, ...props }) => {
  const { account } = queryString.parse(location.search);

  const [setting, setSetting] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const settingsLayouts = () => {
      let sideBarparams = match.params.setting;
      props.setPage(sideBarparams);

      switch (sideBarparams) {
        case "profile":
          props.setHasGoBack(false);
          setSetting(<ProfileSetting />);
          break;
        case "change-password":
          props.setHasGoBack(false);
          setSetting(<SettingsPassword />);
          break;

        case "user-management":
          props.setHasGoBack(false);
          userManagementPermission(getUserRole())
            ? setSetting(<UserManagement account={account} />)
            : // : history.push(unprotectedUrls.ERROR);
              history.push(unprotectedUrls.LOGIN);
          break;

        case "user-groups":
          props.setHasGoBack(true);
          userManagementPermission(getUserRole())
            ? setSetting(<UserGroups />)
            : // : history.push(unprotectedUrls.ERROR);
              history.push(unprotectedUrls.LOGIN);
          break;

        case "roles":
          props.setHasGoBack(false);
          setSetting(<Roles />);
          break;

        case "app-categories":
          props.setHasGoBack(false);
          setSetting(<AppCategory />);
          break;

        case "webhooks":
          props.setHasGoBack(false);
          setSetting(<WebHooks />);
          break;

        case "audit-log":
          props.setHasGoBack(false);
          userManagementPermission(getUserRole())
            ? setSetting(<AuditLog />)
            : // : history.push(unprotectedUrls.ERROR);
              history.push(unprotectedUrls.LOGIN);
          break;

        case "billing-subscription":
          props.setHasGoBack(false);
          setSetting(<BillingSubscription />);
          break;

        case "sso-configuration":
          props.setHasGoBack(false);
          setSetting(<SSO />);
          break;

        case "directory-sync-configuration":
          props.setHasGoBack(false);
          setSetting(<DirectorySync />);
          break;

        case "customizations":
          props.setHasGoBack(false);
          setSetting(<Customizations />);
          break;

        default:
          props.history.push(unprotectedUrls.ERROR);
          return null;
      }
    };
    settingsLayouts();

    return () => {
      settingsLayouts();
    };
  }, [match]);

  const gotoPreSettings = () => {
    const url = localStorage.getItem("pre_settings_url");
    history.push(url);
  };

  return (
    // <div style={{ padding: "20px" }}>
    <div>{setting}</div>
  );
};

export default withRouter(SettingsPageSwitch);
