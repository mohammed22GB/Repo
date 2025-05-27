import React, { useState } from "react";
import PropTypes from "prop-types";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  mainNavigationUrls,
  portalNavigationList,
  portalSupportNavigationList,
} from "../../common/utils/lists";
import PlugLogo from "../../../assets/images/plug-logo.svg";
import logoutPortalIcon from "../../../assets/images/portal-logout-icon.svg";
import { Link, useLocation } from "react-router-dom";
import PortalAppToolBar from "./components/PortalAppToolBar";
import Logout from "../../Login/components/Logout/Logout";
import { useNotification } from "./utils/hooks/useNotification";
import { hexToRgba } from "../../SettingsLayout/Pages/Customizations/utils/customizationutils";
import useGetUserPortalCustomisation from "../../SettingsLayout/Pages/Customizations/utils/useGetUserPortalCustomisation";
import { Skeleton } from "@mui/material";
import { ComingSoon } from "./components/icons/ComingSoon";
import { SwitchModeButton } from "./components/SwitchModeButton";
import SetupModeIcon from "./components/icons/SetupModeIcon";

const drawerWidth = 256;

const useStyles = makeStyles((theme) => {
  return {
    root: {
      display: "flex",
      fontFamily: "Avenir !important",
      fontSize: 16,
      height: "100%",
      // backgroundColor: "rgba(171, 171, 171, 1)",
      "& .MuiListItemText-primary": {
        color: "rgba(171, 171, 171, 1)",
        fontFamily: "'Avenir' !important",
      },
      "& .MuiListItemText-secondary": {
        color: "#263238",
        fontFamily: "'Avenir' !important",
        fontSize: "15px",
      },
      "& .MuiListItem-button:hover": {
        backgroundColor: "rgba(0,0,0,0.04)",
        borderRight: "1px solid rgba(41,41,41,1)",
        padding: 8,
        height: 40,
      },
      "& .MuiSvgIcon-colorSecondary ": {
        color: "rgba(41, 45, 50, 1)",
      },
    },
    drawer: {
      fontFamily: "Avenir,Inter",
      [theme?.breakpoints?.up("sm")]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    // necessary for content to be below app bar
    toolbar: theme?.mixins?.toolbar,

    drawerPaper: {
      width: drawerWidth,
      backgroundColor: "#FFFFFF",
      fontFamily: "Avenir,Inter",
      borderRight: "none",
    },
    content: {
      flexGrow: 1,
      overflow: "auto",
      "&::-webkit-scrollbar": {
        display: "none",
      },
      scrollbarWidth: "none",
      msOverflowStyle: "none",
    },
    contentWrapper: {
      display: "flex",
      flexDirection: "column",
      padding: "120px 32px 30px 32px",
      minHeight: 716,
      flexGrow: 1,
      backgroundColor: "#F8F8F8",

      "@media (max-width: 1280px)": {
        //padding: "120px 0px 30px 3px",
        width: "fit-content",
      },
    },
    heightPadding: {
      height: 40,
      paddingLeft: 50,
    },
    iconStyle: {
      minWidth: "35px",
    },
  };
});

const PortalLayout = (props) => {
  const { window, children } = props;
  const { unreadNotificationCount } = useNotification();

  const {
    logo: portalLogo,
    internalPage,
    isLoading,
    brandTheme,
  } = useGetUserPortalCustomisation();

  const internalPageTheme = internalPage?.isEnabled
    ? internalPage?.theme?.primaryColor
    : brandTheme ?? "#DE5439";

  const internalPageLogo = !!portalLogo?.imageUrl
    ? portalLogo?.imageUrl
    : PlugLogo;

  const classes = useStyles();
  const theme = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isNavActive = (url) => {
    if (url === location.pathname) {
      return true;
    }
    return false;
  };

  const drawer = (
    <div
      className="avenir"
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
    >
      {/* Logo Section */}
      <div
        style={{
          height: 87,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "start",
          paddingLeft: 50,
        }}
      >
        {isLoading ? (
          <Skeleton height={20} width={100} />
        ) : (
          <img
            src={internalPageLogo}
            alt="custom-portal-logo"
            style={{
              width: "85px",
              height: "auto",
              objectFit: "cover",
            }}
          />
        )}
      </div>

      <Divider />

      {/* Scrollable Navigation Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          flex: 1,
        }}
      >
        {mobileOpen ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 56,
              paddingTop: 24,
              paddingBottom: 14,
            }}
          >
            <SwitchModeButton
              tooltip={"Switch back to Admin Mode"}
              icon={<SetupModeIcon />}
              switchLink={mainNavigationUrls.APPS}
            />
          </div>
        ) : (
          <div className={classes.toolbar} />
        )}

        <List
          style={{
            fontFamily: "Avenir,Inter",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            paddingBottom: 80,
          }}
        >
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => {
                return (
                  <ListItem button key={index} style={{ paddingLeft: 50 }}>
                    <Skeleton height={20} width={150} />
                  </ListItem>
                );
              })
            : portalNavigationList
                .filter((item) => {
                  return item?.url !== "#";
                })
                .map((text, index) => {
                  return (
                    <Link to={text?.url} key={index}>
                      <ListItem
                        button
                        style={{
                          height: 40,
                          padding: "8px 0px 8px 50px",
                          backgroundColor: isNavActive(text?.url)
                            ? `${hexToRgba(internalPageTheme, 0.12)}`
                            : null,
                          borderRight: isNavActive(text?.url)
                            ? `1px solid ${internalPageTheme}`
                            : null,
                        }}
                      >
                        <ListItemIcon className={classes.iconStyle}>
                          {isNavActive(text?.url)
                            ? text?.activeIcon
                            : text?.icon}
                        </ListItemIcon>
                        <Typography
                          style={{
                            color: `${
                              isNavActive(text?.url) ? "#292929" : "#ABABAB"
                            }`,
                            fontFamily: "Avenir,Inter",
                            fontWeight: 400,
                            fontSize: 16,
                          }}
                        >
                          {text?.title}
                        </Typography>

                        <ListItemIcon
                          className={classes.iconStyle}
                          style={{ padding: "10px 0 10px 15px" }}
                        >
                          {text?.rightIcon}
                        </ListItemIcon>
                      </ListItem>
                    </Link>
                  );
                })}
        </List>

        {/* Portal Support Navigation List with Auto Margin */}
        <List
          style={{
            marginTop: "auto",
            fontFamily: "Avenir,Inter",
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          {portalSupportNavigationList
            ?.filter((support) => {
              return support.url !== "#";
            })
            .map((support, index) => {
              return (
                <Link to={support?.url} key={support?.title}>
                  <ListItem button style={{ height: 32, paddingLeft: 50 }}>
                    <ListItemIcon className={classes.iconStyle}>
                      {support?.icon}
                    </ListItemIcon>
                    <Typography
                      style={{
                        fontFamily: "Avenir,Inter",
                        fontWeight: 400,
                        fontSize: 16,
                      }}
                    >
                      {support?.title}
                    </Typography>
                    <ComingSoon />
                  </ListItem>
                </Link>
              );
            })}

          <Logout marginTop={0}>
            <ListItem button style={{ height: 32, paddingLeft: 50 }}>
              <ListItemIcon className={classes.iconStyle}>
                <img src={logoutPortalIcon} alt="navicon" />
              </ListItemIcon>
              <Typography
                style={{
                  fontFamily: "Avenir,Inter",
                  fontWeight: 400,
                  fontSize: 16,
                }}
              >
                Log Out
              </Typography>
            </ListItem>
          </Logout>
        </List>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: 50,
            paddingLeft: 50,
            gap: "5px",
            height: 24,
          }}
        >
          <Typography
            style={{
              fontSize: 12,
              fontFamily: "Avenir,Inter",
              color: "rgba(171, 171, 171, 1)",
            }}
          >
            Powered by
          </Typography>
          <img src={PlugLogo} width="45px" alt="plug-icon" />
        </div>
      </div>
    </div>
  );

  const container =
    typeof window !== "undefined" ? window.document.body : undefined;

  return (
    <div className={`${classes.root} portal-layout avenir`}>
      <CssBaseline />
      <PortalAppToolBar
        mobileOpen={mobileOpen}
        internalPageLogo={internalPageLogo}
        internalPageTheme={internalPageTheme}
        onHandleDrawerToggle={handleDrawerToggle}
        unreadNotificationCount={unreadNotificationCount}
      />

      <nav className={classes.drawer} aria-label="navigation content">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme?.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        {/* desktop view */}
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <div className={classes.contentWrapper}>
        <main className={classes.content}>{children}</main>
      </div>
    </div>
  );
};

PortalLayout.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default PortalLayout;
