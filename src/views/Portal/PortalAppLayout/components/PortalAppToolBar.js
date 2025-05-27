import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Badge from "@material-ui/core/Badge";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { TextField } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import { withStyles } from "@material-ui/core/styles";
import searchIcon from "../../../../assets/images/search-normal-icon.svg";
import lightModeDarkMode from "../../../../assets/images/light-dark-mode.svg";
import MenuIconBox from "./icons/MenuIcon";
import dropdownSelectorIcon from "../../../../assets/images/dropdown-selector.svg";
import usePortalStyles from "./portalstyles";
import { getHighestRole } from "../../../common/utils/userRoleEvaluation";
import { mainNavigationUrls } from "../../../common/utils/lists";
import { ADMIN_PORTAL_ROLES } from "../../../common/utils/userRoleEvaluation";
import NotificationIcon from "./icons/NotificationIcon";
import { SwitchModeButton } from "./SwitchModeButton";
import SetupModeIcon from "./icons/SetupModeIcon";

const StyledBadge = withStyles((theme) => ({
  badge: (props) => ({
    top: 6,
    fontFamily: "Avenir-Medium,Inter",
    backgroundColor: props?.color ?? "rgba(33, 179, 56, 1)",
    color: "rgba(255, 255, 255, 1)",
    display: "flex",
    alignItems: "center",
    fontSize: 10,
    width: 14,
  }),
}))(Badge);

export default function PortalAppToolBar({
  internalPageTheme,
  mobileOpen,
  internalPageLogo,
  onHandleDrawerToggle,
  unreadNotificationCount,
}) {
  const classes = usePortalStyles();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [hideMenu, setHideMenu] = useState(false);

  return (
    <AppBar position="fixed" color="none" className={classes.appBar}>
      <Toolbar className={classes.customToolBar}>
        <div>
          <img
            src={internalPageLogo}
            alt="custom-mobile-portal-logo"
            className={classes.mobileLogo}
          />
        </div>

        <div className={classes.contentToolBar}>
          {!!hideMenu &&
            ADMIN_PORTAL_ROLES?.includes(getHighestRole(userInfo?.roles)) && (
              <Button
                variant="contained"
                disableElevation
                style={{
                  fontFamily: "'Avenir','Inter'",
                  textTransform: "none",
                  borderRadius: "20px",
                  backgroundColor: "rgba(41, 41, 41, 1)",
                  color: "rgba(255, 255, 255, 1)",
                  padding: "6px 18px 6px 18px",
                }}
              >
                Request Payslip
              </Button>
            )}

          {!!hideMenu && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
              }}
            >
              <MenuIconBox color={internalPageTheme} />
              <Typography variant="h6" noWrap>
                Menu
              </Typography>
              <img src={dropdownSelectorIcon} alt="dropdown menu" />
            </div>
          )}

          {!!hideMenu && (
            <div className="app-search-bar">
              <TextField
                name="app-search-text"
                variant="outlined"
                placeholder="Search"
                // value={pageSearchText}
                // onChange={(e) => dispatch(rSetPageSearchText(e.target.value))}
                style={{ flex: 1 }}
                autoComplete="off"
                autoCorrect="off"
                inputProps={{
                  autoComplete: "new-password",
                  form: {
                    autoComplete: "off",
                  },
                }}
              />
              <img src={searchIcon} alt="search" />
            </div>
          )}

          <StyledBadge badgeContent={unreadNotificationCount}>
            <NotificationIcon />
          </StyledBadge>

          {ADMIN_PORTAL_ROLES?.includes(getHighestRole(userInfo?.roles)) && (
            <SwitchModeButton
              tooltip={"Switch back to Admin Mode"}
              icon={<SetupModeIcon />}
              switchLink={mainNavigationUrls.APPS}
            />
          )}

          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                height: 40,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "end",
                  justifyContent: "space-between",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <Typography
                  noWrap
                  style={{
                    fontFamily: "Avenir-Medium,Inter",
                    fontWeight: 500,
                    fontSize: 16,
                    maxWidth: 128,
                  }}
                >
                  {[userInfo?.firstName, userInfo?.lastName].join(" ")}
                </Typography>
                <Typography
                  noWrap
                  style={{
                    textAlign: "right",
                    color: "rgba(171, 171, 171, 1)",
                    fontFamily: "Avenir-Medium,Inter",
                    fontSize: 12,
                  }}
                >
                  {getHighestRole(userInfo?.roles)}
                </Typography>
              </div>

              <div
                style={{
                  border: "1.25px solid #F0F0F0",
                  padding: 0.5,
                  borderRadius: "100%",
                }}
              >
                <Avatar
                  alt={userInfo?.firstName}
                  style={{ fontFamily: "Avenir,Inter" }}
                >
                  {userInfo?.firstName?.charAt(0) +
                    userInfo?.lastName?.charAt(0)}
                </Avatar>
              </div>
            </div>

            {!!hideMenu && (
              <IconButton>
                <img src={lightModeDarkMode} alt="light mode dark mode" />
              </IconButton>
            )}
          </div>
        </div>

        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onHandleDrawerToggle}
          className={classes.menuButton}
        >
          <MenuIcon color="secondary" />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
