import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import {
  IconButton,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { CancelRounded } from "@material-ui/icons";
import MenuIcon from "@mui/icons-material/Menu";
import Badge from "@material-ui/core/Badge";
import plugLogoMini from "../../../../../assets/images/plug-logo-icon.svg";
import searchInputIcon from "../../../../../assets/images/search-input-icon.svg";
import notificationsIcon from "../../../../../assets/images/notifications_icon.svg";
import { rSetPageSearchText } from "../../../../../store/actions/properties";
import { mainNavigationUrls, portalNavigationUrls } from "../../../utils/lists";
import NotificationMenu from "../../../../InAppNotification/components/NotificationMenu";
import { ADMIN_PORTAL_ROLES } from "../../../utils/userRoleEvaluation";
import { SwitchModeButton } from "../../../../Portal/PortalAppLayout/components/SwitchModeButton";
import ReturnToPortalIcon from "../../../../Portal/PortalAppLayout/components/icons/ReturnToPortalIcon";

const AppToolBar = (props) => {
  const {
    open,
    handleDrawerOpen,
    headerTitle,
    pageTitle,
    notificationsData,
    hideSearbar,
    isCustomPortalEnabled,
  } = props;

  const [openMenu, setOpenMenu] = useState(false);
  const anchorRef = useRef(null);
  const prevOpen = useRef(openMenu);
  const dispatch = useDispatch();
  const location = useLocation();
  const { pageSearchText } = useSelector(({ reducers }) => reducers);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    dispatch(rSetPageSearchText(""));
  }, [location]);

  const getHighestRole = (userRoles) => {
    const rolesHierarchy = ["PlugAdmin", "Admin", "Designer", "Employee"];
    for (let index = 0; index < rolesHierarchy.length; index++) {
      const role = rolesHierarchy[index];
      if (userRoles?.includes(role)) return role;
    }
    return "";
  };

  const handleToggle = () => {
    setOpenMenu((prevOpen) => !prevOpen);
  };

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <Toolbar className={`adj-toolbar-root ${open ? "_open" : ""}`}>
      <IconButton
        className={`mobile-drawer-btn`}
        // color="primary"
        aria-label="open drawer"
        onClick={handleDrawerOpen}
        edge="start"
        sx={{
          marginRight: 5,
          // ...(open && { display: "none" }),
          filter: "invert(0.8)",
        }}
        style={{
          color: "#535353",
        }}
      >
        <MenuIcon />
      </IconButton>
      <img src={plugLogoMini} alt="logo" className="plug-logo-full" />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Typography
          variant="h6"
          noWrap
          component="div"
          className="adj-toolbar-title"
        >
          {headerTitle}
        </Typography>
        {!hideSearbar && (
          <div className="app-search-bar">
            <img src={searchInputIcon} alt="search" />
            <TextField
              name="app-search-text"
              variant="outlined"
              placeholder={`Search ${(
                pageTitle || headerTitle
              )?.toLowerCase()}...`}
              value={pageSearchText}
              onChange={(e) => dispatch(rSetPageSearchText(e.target.value))}
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
            {!!pageSearchText && (
              <CancelRounded
                onClick={() => dispatch(rSetPageSearchText(""))}
                style={{ color: "#999", cursor: "pointer" }}
              />
            )}
          </div>
        )}

        <div className="toolbar-notification-and-user">
          {ADMIN_PORTAL_ROLES?.includes(getHighestRole(userInfo?.roles)) &&
            !!isCustomPortalEnabled && (
              <SwitchModeButton
                tooltip={"Switch to access the user portal"}
                icon={<ReturnToPortalIcon />}
                switchLink={portalNavigationUrls.DASHBOARD}
              />
            )}
          <Tooltip title="Notifications">
            <div
              className="toolbar-notification"
              ref={anchorRef}
              aria-controls={open ? "menu-list-grow" : undefined}
              aria-haspopup="true"
              onClick={handleToggle}
            >
              <Badge
                badgeContent={
                  notificationsData?._meta?.pagination?.total_unread
                }
                color="error"
              >
                <img src={notificationsIcon} alt="notifications" />
              </Badge>
            </div>
          </Tooltip>
          <Link to={mainNavigationUrls.ACCOUNT_PROFILE}>
            <div className="toolbar-user">
              <div className="toolbar-user-image">
                <FaUserCircle size={50} />
              </div>
              <div className="toolbar-user-details">
                <div className="toolbar-user-details-name">
                  {[userInfo?.firstName, userInfo?.lastName].join(" ")}
                </div>
                <div className="toolbar-user-details-role">
                  {getHighestRole(userInfo?.roles)}
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
      <NotificationMenu
        anchorRef={anchorRef}
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
        notificationsData={notificationsData}
      />
    </Toolbar>
  );
};

export default AppToolBar;
