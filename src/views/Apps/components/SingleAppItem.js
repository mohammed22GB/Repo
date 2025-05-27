import React, { useState } from "react";
import Paper from "@material-ui/core/Paper";
import { IconButton, Button, Tooltip } from "@material-ui/core";
import { Link } from "react-router-dom";
import MenuList from "./MenuList";
import fileCopyIcon from "../../../assets/images/file-copy-icon.svg";
import editIcon from "../../../assets/images/edit-icon.svg";
import appIcon from "../../../assets/images/applist-single-img.svg";
import menuDotsIcon from "../../../assets/images/menu-dots-icon.svg";
import webhook_icon from "../../../assets/images/webhooks.png";
import {
  APPS_CONTROL_MODES,
  DEFAULT_APP_CATEGORY_COLOR,
} from "../../EditorLayout/Pages/Workflow/components/utils/constants";
import {
  errorToastify,
  infoToastify,
  successToastify,
} from "../../common/utils/Toastify";
import {
  appPermissions,
  getUserRole,
  handleRoleActionAccess,
  tempPermissions,
} from "../../common/utils/userRoleEvaluation";
import {
  editorNavigationUrls,
  otherProtectedUrls,
  unprotectedUrls,
} from "../../common/utils/lists";
import { MdDoNotDisturb } from "react-icons/md";
import { compareAppVersions } from "../../common/helpers/helperFunctions";
import {
  DEFAULT_APP_LAUNCH_BUTTON_TEXT,
  LAST_MAJOR_APP_BE_VERSION,
} from "../../common/utils/constants";
import { exportAppToFile } from "../../common/components/Mutation/Apps/AppsMutation";

const SingleAppItem = ({
  classes,
  appDetails,
  appsControlMode,
  color,
  sendMenuAction,
}) => {
  const {
    name,
    description,
    id,
    app,
    category,
    ownerGroup,
    slug: appSlug,
    active,
    hasWebhookTrigger,
    account,
    appLaunchButtonText,
  } = appDetails;

  const appId = app || id;
  const accountSlug = account?.slug;

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const doExportApp = async () => {
    if (!appId) {
      errorToastify("An error occured. App not identifiable.");
      return;
    }

    const response = await exportAppToFile(appId, name);
    infoToastify("App export in progress... Please wait...");

    if (response.success) {
      successToastify("App exported successfully");
    }
  };

  const sendMenuAction_ = (action) => {
    if (action?.toLowerCase() === "copy link") {
      navigator?.clipboard?.writeText(
        `${window.location.origin}/run/${accountSlug}/${appSlug}`
      );
      infoToastify("App link copied to clipboard");
    } else if (action?.toLowerCase() === "export") {
      doExportApp();
    } else {
      sendMenuAction(action, appDetails);
    }
  };

  const appNeedsUpgrade = () =>
    appDetails?.id &&
    (!appDetails?.beVersion ||
      compareAppVersions(appDetails?.beVersion, LAST_MAJOR_APP_BE_VERSION) < 0);

  return (
    <>
      <Paper
        className={classes.card}
        style={{
          border: `solid 0.5px ${
            appsControlMode === APPS_CONTROL_MODES.APP ? "#fff" : ""
          }`,
        }}
        data-testid="appItem"
        // button
      >
        <div className={classes.cardTitle}>
          <div className={classes.cardTitleIcon}>
            <img src={appIcon} alt="app" />
          </div>
          <div className={classes.cardTitleText}>{name && name}</div>
          <div className={classes.cardTitleBtns}>
            {handleRoleActionAccess(
              { pageTitle: appsControlMode },
              "UPDATE",
              ownerGroup
            ) && (
              <Link
                to={`${otherProtectedUrls.EDITOR}/${appId}${editorNavigationUrls.UI_EDITOR}`}
                title="editIcon"
              >
                <Tooltip title="Manage app">
                  <IconButton size="small" aria-controls="screens-menu">
                    <img src={editIcon} alt="edit" />
                  </IconButton>
                </Tooltip>
              </Link>
            )}
            {handleRoleActionAccess(
              { pageTitle: appsControlMode },
              "POST",
              ownerGroup
            ) && (
              <Tooltip title="Duplicate app">
                <IconButton
                  size="small"
                  data-testid="duplicateIcon"
                  aria-controls="screens-menu"
                  onClick={(event) => sendMenuAction("Duplicate", appDetails)}
                >
                  <img src={fileCopyIcon} alt="copy" />
                </IconButton>
              </Tooltip>
            )}
            {(appPermissions(getUserRole()) ||
              tempPermissions(getUserRole())) && (
              <IconButton
                size="small"
                title="menuIcon"
                aria-controls="screens-menu"
                onClick={(event) => handleMenuClick(event)}
              >
                <img src={menuDotsIcon} alt="menu" />
              </IconButton>
            )}
          </div>
        </div>
        <div className={classes.cardDescription}>
          {description ??
            `${description[0].toUpperCase()}${description.slice(1)}`}
        </div>
        <div className={classes.cardBase}>
          <div
            style={{
              fontSize: 10,
              borderRadius: 15,
              padding: "1px 8px",
              display: "inline-block",
              backgroundColor: color || DEFAULT_APP_CATEGORY_COLOR,
              color: "white",
            }}
          >
            {category?.name || "n/a"}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 5,
            }}
          >
            {hasWebhookTrigger && (
              <Tooltip title="Webhook">
                <span style={{ display: "flex" }}>
                  {" "}
                  <img
                    src={webhook_icon}
                    alt="Webhooks"
                    width="16"
                    style={{
                      filter: "invert(1)",
                    }}
                  />
                </span>
              </Tooltip>
            )}
            {appNeedsUpgrade() && (
              <Tooltip title="App requires upgrade">
                <span
                  style={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <MdDoNotDisturb style={{ fontSize: 18 }} />
                </span>
              </Tooltip>
            )}

            <div style={{ marginLeft: "auto" }}>
              {active &&
                !hasWebhookTrigger &&
                (appsControlMode === APPS_CONTROL_MODES.TEMPLATE ? (
                  <Button
                    className={classes.cardBadge2}
                    onClick={(e) => sendMenuAction_("Clone")}
                  >
                    {/* <LaunchIcon style={{ fontSize: 14, marginRight: 4 }} /> */}
                    Create App
                  </Button>
                ) : appNeedsUpgrade() ? (
                  <Button
                    className={classes.cardBadge2}
                    style={{ opacity: 0.6, filter: "saturation(0.7)" }}
                    onClick={() =>
                      errorToastify(
                        "App is outdated. Please contact Administrator to upgrade to current version."
                      )
                    }
                  >
                    Launch
                  </Button>
                ) : (
                  <Link
                    to={`${unprotectedUrls.RUN}/${accountSlug}/${appSlug}`}
                    target="_blank"
                  >
                    <Button className={classes.cardBadge2}>
                      {/* <LaunchIcon style={{ fontSize: 14, marginRight: 4 }} /> */}
                      {appLaunchButtonText || DEFAULT_APP_LAUNCH_BUTTON_TEXT}
                    </Button>{" "}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </Paper>
      <MenuList
        setAnchorEl={setAnchorEl}
        anchorEl={anchorEl}
        active={active}
        sendMenuAction={sendMenuAction_}
        appsControlMode={appsControlMode}
      />
    </>
  );
};

export default SingleAppItem;
