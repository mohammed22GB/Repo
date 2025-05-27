import React, { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import { useDispatch } from "react-redux";

import "./styles.scss";
import SettingsPageSwitch from "./components/SettingsPageSwitch";
import { v4 } from "uuid";
import {
  rTriggerNewCategoryDialog,
  rTriggerNewUserDialog,
  rTriggerNewUserGroupDialog,
} from "../../store/actions/properties";
import {
  mainNavigationList,
  mainNavigationListNames,
  mainNavigationUrls,
} from "../common/utils/lists";
import MainPageLayout from "../common/components/AppLayout/MainPageLayout";

const SettingsLayout = () => {
  const dispatch = useDispatch();

  const [page, setPage] = useState(null);
  const [pageTitle, setPageTitle] = useState("");
  const [pageSubTitle, setPageSubTitle] = useState("");
  const [isSearchable, setIsSearchable] = useState(false);
  const [filterable, setFilterable] = useState(<></>);
  const [addable, setAddable] = useState(null);
  const [hasGoBack, setHasGoBack] = useState(false);

  const menuList = mainNavigationList;

  useEffect(() => {
    const pageTitle_ = mainNavigationList
      .find((item) => item.url === mainNavigationUrls.SETTINGS)
      ?.subMenu?.find(
        (item) => item.url === `${mainNavigationUrls.SETTINGS}/${page}`
      )?.title;
    setPageTitle(pageTitle_);

    switch (pageTitle_) {
      case mainNavigationListNames.SETTINGS.ACCOUNT_PROFILE:
        setPageSubTitle("View/update user and organisation information");
        setIsSearchable(false);
        setFilterable(<></>);
        setAddable(null);
        break;

      case mainNavigationListNames.SETTINGS.PASSWORD_CHANGE:
        setPageSubTitle(
          "Update password by provide existing password and new password. Re-login required."
        );
        setIsSearchable(false);
        setFilterable(<></>);
        setAddable(null);
        break;

      case mainNavigationListNames.SETTINGS.USER_MANAGEMENT:
        setPageSubTitle("Manage users and user groups");
        setIsSearchable(true);
        setFilterable(null);
        setAddable({
          fn: () => {
            dispatch(rTriggerNewUserDialog(v4()));
          },
          tooltip: "Add new user",
        });
        break;

      case mainNavigationListNames.SETTINGS.SSO_SIGN_IN:
        setPageSubTitle("Manage SSO configuration");
        setIsSearchable(false);
        setFilterable(<></>);
        setAddable(null);
        break;

      case mainNavigationListNames.SETTINGS.DIRECTORY_SYNC:
        setPageSubTitle("Manage Directory Sync configuration");
        setIsSearchable(false);
        setFilterable(<></>);
        setAddable(null);
        break;

      case mainNavigationListNames.SETTINGS.CUSTOMIZATIONS:
        setPageSubTitle("Customize Plug app to suite your organisations look");
        setIsSearchable(false);
        setFilterable(<></>);
        setAddable(null);
        break;

      case mainNavigationListNames.SETTINGS.USER_GROUPS:
        setPageSubTitle(
          "Create, update, delete and assign/unassign members to user groups"
        );
        setIsSearchable(true);
        setFilterable(null);
        setAddable({
          fn: () => {
            dispatch(rTriggerNewUserGroupDialog(v4()));
          },
          tooltip: "Add new user group",
        });
        break;

      case mainNavigationListNames.SETTINGS.ROLES:
        setPageSubTitle("View the roles in the organisation");
        setIsSearchable(true);
        setFilterable(null);
        setAddable({ fn: () => {}, tooltip: "Add new role" });
        break;

      case mainNavigationListNames.SETTINGS.APP_CATEGORIES:
        setPageSubTitle("Manage categories for apps and templates");
        setIsSearchable(true);
        setFilterable(null);
        setAddable({
          fn: () => {
            dispatch(rTriggerNewCategoryDialog(v4()));
          },
          tooltip: "Add new category",
        });
        break;

      case mainNavigationListNames.SETTINGS.WEBHOOKS:
        setPageSubTitle("Activate/deactivate webhook feature for organisation");
        setIsSearchable(false);
        setFilterable(<></>);
        setAddable(null);
        break;

      case mainNavigationListNames.SETTINGS.AUDIT_LOG:
        setPageSubTitle("The logs invovled in an individual app");
        setIsSearchable(true);
        setFilterable(<></>);
        setAddable(null);
        break;

      case mainNavigationListNames.SETTINGS.BILLING_N_SUBSCRIPTIONS:
        setPageSubTitle(
          "Track billing (history) and subscription usage for organisation"
        );
        setIsSearchable(false);
        setFilterable(<></>);
        setAddable(null);
        break;

      default:
    }
  }, [page]);

  const handleChange = (lap) => {
    if (lap.isFinish) {
      // setIsLoading(false);
    }
  };

  return (
    <MainPageLayout
      headerTitle={mainNavigationListNames.SETTINGS.SETTINGS}
      pageTitle={pageTitle}
      pageSubtitle={pageSubTitle}
      appsControlMode={null}
      categories={null}
      isNotMainPages={true}
      // isLoading={isLoading}
      handleChange={handleChange}
      topBar={filterable}
      onAddNew={addable}
      hasGoBack={hasGoBack}
      hideSearbar={!isSearchable}
    >
      <Route
        exact
        path={`${mainNavigationUrls.SETTINGS}/:setting`}
        component={() => (
          <SettingsPageSwitch
            setPage={(pg) => setPage(pg)}
            page={page}
            setHasGoBack={setHasGoBack}
          />
        )}
      />
    </MainPageLayout>
  );
};

export default SettingsLayout;
