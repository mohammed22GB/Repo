import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import plugLogo from "../../../../assets/images/plug-logo.svg";
import SideNavigation from "./components/SideNavigation";
import AppToolBar from "./components/AppToolBar";
import useIsCustomisationEnabled from "../../../SettingsLayout/Pages/Customizations/utils/useIsCustomisationEnabled";

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { useQuery } from "react-query";
import { CloseRounded } from "@material-ui/icons";

import { socket } from "../../../../App";
import { ADD_NOTIFICATION } from "../../../../store/actions/inappActions";
import { getInAppNotification } from "../Query/InAppNotificaficationQuery/inAppQuery";

let sideNavigationWidth;
const MOBILE_WIDTH_THRESHOLD = 768;

const drawerWidth = sideNavigationWidth || 250;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme?.transitions.create("width", {
    easing: theme?.transitions.easing.sharp,
    duration: theme?.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme?.transitions.create("width", {
    easing: theme?.transitions.easing.sharp,
    duration: theme?.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme?.spacing(7)} + 1px)`,
  [theme?.breakpoints?.up("sm")]: {
    width: `calc(${theme?.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme?.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme?.zIndex.drawer + 1,
  transition: theme?.transitions.create(["width", "margin"], {
    easing: theme?.transitions.easing.sharp,
    duration: theme?.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme?.transitions.create(["width", "margin"], {
      easing: theme?.transitions.easing.sharp,
      duration: theme?.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const AppLayout = ({
  children,
  headerTitle,
  pageTitle,
  hideSearbar,
  CustomSideNavigation,
  extraToolBar,
}) => {
  const theme = useTheme();
  const location = useLocation();
  const dispatch = useDispatch();

  const sdca = JSON.parse(localStorage.getItem("plug-page-drawer-open"));
  const isDrawerOpen = sdca !== false;

  const [open, setOpen] = useState(isDrawerOpen);

  useEffect(() => {
    localStorage.setItem("plug-page-drawer-open", open);
  }, [location, open]);

  useEffect(() => {
    if (window.innerWidth < MOBILE_WIDTH_THRESHOLD) {
      setOpen(false);
    }
  }, [location]);

  useEffect(() => {
    socket.on("notification:created", (data) => {
      dispatch({
        type: ADD_NOTIFICATION,
        payload: data,
      });
    });

    return () => {
      socket.off("notification:created");
    };
  }, [dispatch]);

  // const handleGetInAppList = ({ data }) => {
  //   dispatch({
  //     type: UNREAD_NOTIFICATION_COUNT,
  //     payload: data?.data?._meta?.pagination?.total_unread,
  //   });
  //   setNotificationsCount(data?.data?._meta?.pagination?.total_unread);
  // };

  const queryKey = [
    "inAppNotificationBadgeCount",
    {
      perPage: 3,
      page: 1,
      read: "",
      sortParams: {},
    },
  ];

  const { data } = useQuery(queryKey, getInAppNotification, {
    cacheTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchInterval: 3 * 60 * 1000,
    refetchOnMount: false,
  });

  const { isCustomPortalEnabled } = useIsCustomisationEnabled();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box
      style={{
        display: "flex",
        height: "100%",
      }}
    >
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        className={`main-app-bar ${open ? "_open" : ""}`}
      >
        <AppToolBar
          open={open}
          handleDrawerOpen={handleDrawerOpen}
          headerTitle={headerTitle}
          pageTitle={pageTitle}
          hideSearbar={hideSearbar}
          notificationsData={data?.data}
          isCustomPortalEnabled={isCustomPortalEnabled}
        />
        {extraToolBar || null}
      </AppBar>
      {CustomSideNavigation || (
        <Drawer
          variant="permanent"
          open={open}
          className={`main-nav-drawer ${open ? "_open" : ""}`}
        >
          <DrawerHeader
            className="adj-toolbar-root _drawer"
            style={{ width: drawerWidth }}
          >
            <img
              src={plugLogo}
              alt="logo"
              className="plug-logo-full"
              width="70"
            />
            <IconButton
              onClick={handleDrawerClose}
              className="drawer-close-arrow-btn"
            >
              {theme.direction === "rtl" ? <CloseRounded /> : <CloseRounded />}
            </IconButton>
            <div
              className="collapse-drawer-btn"
              onClick={open ? handleDrawerClose : handleDrawerOpen}
            >
              {open ? (
                <ChevronLeftIcon style={{ fontSize: 16 }} />
              ) : (
                <ChevronRightIcon style={{ fontSize: 16 }} />
              )}
            </div>
          </DrawerHeader>
          <SideNavigation open={open} />
        </Drawer>
      )}
      {children}
    </Box>
  );
};

export default AppLayout;
