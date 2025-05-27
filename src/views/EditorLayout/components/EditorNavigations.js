import { Fragment, useEffect, useState } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { List } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import logOutIcon from "../../../assets/images/nav-logout-inactive-icon.svg";
import {
  editorNavigationList,
  otherProtectedUrls,
  supportNavigationList,
} from "../../common/utils/lists";
import TooltipPatch from "../../common/components/TooltipPatch";
import Logout from "../../Login/components/Logout/Logout";
import CustomAlertBox from "../../common/components/CustomAlertBox/CustomAlertBox";

const SideNavigation = ({ open }) => {
  open = false;
  const location = useLocation();
  const history = useHistory();
  const [showSubMenu, setShowSubMenu] = useState({});
  const [currentAppId, setCurrentAppId] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const toOpen = editorNavigationList.find(
      (item) =>
        !!item.subMenu &&
        item.subMenu.find((subItem) => subItem.url === location.pathname)
    )?.title;

    setShowSubMenu_(toOpen, true);

    const appId = location.pathname.split("/")[2];
    setCurrentAppId(appId);
  }, [location.pathname]);

  const isActive = (url) => {
    return location.pathname.includes(url);
  };

  const setShowSubMenu_ = (title, open) => {
    const showStatus = { ...showSubMenu };
    showStatus[title] = open || !showStatus[title];
    setShowSubMenu(showStatus);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        height: "100vh",
        width: 50,
        borderRight: "solid 0.5px #B8B8B8",
      }}
    >
      <List style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        {editorNavigationList
          ?.filter((item) => !item.hidden)
          ?.map((item, index) => (
            <Fragment key={`main-${index}`}>
              <Link
                key={index}
                to={
                  index === 0 || index === 4
                    ? item.url
                    : `${otherProtectedUrls.EDITOR}/${currentAppId}${item.url}`
                }
              >
                <TooltipPatch
                  title={!open && item.title}
                  placement="right"
                  arrow
                >
                  <ListItem
                    disablePadding
                    sx={{
                      display: "block",
                      padding: 0,
                      margin: index === 0 ? "10px 0 50px" : 0,
                    }}
                  >
                    <ListItemButton
                      sx={{
                        minHeight: 36,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                        py: 0,
                      }}
                      className={`nav-page-item ${
                        isActive(item.url) ? "_active" : ""
                      }`}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 2 : "auto",
                          justifyContent: "center",
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.title}
                        sx={{ display: open ? "block" : "none" }}
                        className="side-nav-text"
                      />
                    </ListItemButton>
                  </ListItem>
                </TooltipPatch>
              </Link>
            </Fragment>
          ))}
      </List>
      {/* <Divider /> */}
      <List style={{ marginTop: "auto" }}>
        <span
          style={{
            fontWeight: 200,
            fontSize: 12,
            paddingLeft: 20,
            marginBottom: 10,
            display: "inline-block",
          }}
        >
          {open ? "SUPPORT" : ". . ."}
        </span>
        {supportNavigationList.map((item, index) => (
          <Fragment key={`support-${index}`}>
            <Link
              key={index}
              to={item.url}
              onClick={(e) => {
                e.preventDefault();
                item.subMenu && setShowSubMenu_(e, item.title);
                item.url && item.url !== "#" && history.push(item.url);
                item.prompt && setShowPrompt(true);
              }}
            >
              <TooltipPatch title={!open && item.title} placement="right" arrow>
                <ListItem
                  disablePadding
                  sx={{
                    display: "block",
                    padding: 0,
                  }}
                  onClick={(e) => {
                    item.prompt && setShowPrompt(true);
                  }}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 36,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                    className={`nav-page-item ${
                      isActive(item.url) ? "_active" : ""
                    }`}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 2 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.title}
                      sx={{ opacity: open ? 1 : 0 }}
                      className="side-nav-text"
                    />
                  </ListItemButton>
                </ListItem>
              </TooltipPatch>
            </Link>
          </Fragment>
        ))}
        <TooltipPatch title={!open && "Log out"} placement="right" arrow>
          <Logout>
            <ListItem
              disablePadding
              sx={{
                display: "block",
                padding: 0,
              }}
            >
              <ListItemButton
                sx={{
                  minHeight: 36,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  py: 0,
                }}
                className={`nav-page-item`}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <img src={logOutIcon} alt="Log out" />
                </ListItemIcon>
                <ListItemText
                  primary="Log out"
                  sx={{ opacity: open ? 1 : 0 }}
                  className="side-nav-text"
                />
              </ListItemButton>
            </ListItem>
          </Logout>
        </TooltipPatch>
      </List>
      {showPrompt && (
        <CustomAlertBox
          open={showPrompt}
          closeConfirmBox={() => setShowPrompt(false)}
          text={`The tutorial page is currently under development. Please, check back soon.`}
        />
      )}
    </div>
  );
};

export default SideNavigation;
