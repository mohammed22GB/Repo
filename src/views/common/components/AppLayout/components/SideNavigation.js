import { Fragment, useEffect, useState } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { Collapse, List } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import dropDownArrow from "../../../../../assets/images/dropdown-arrow-down-inactive.svg";
import logOutIcon from "../../../../../assets/images/nav-logout-inactive-icon.svg";
import TooltipPatch from "../../TooltipPatch";
import {
  mainNavigationList,
  supportNavigationList,
} from "../../../utils/lists";
import { handleRolePageAccess } from "../../../utils/userRoleEvaluation";
import Logout from "../../../../Login/components/Logout/Logout";
import CustomAlertBox from "../../CustomAlertBox/CustomAlertBox";

const SideNavigation = ({ open }) => {
  const { user } = useSelector(({ auth }) => auth);

  const location = useLocation();
  const [showSubMenu, setShowSubMenu] = useState({});
  const [showPrompt, setShowPrompt] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const toOpen = mainNavigationList.find(
      (item) =>
        !!item.subMenu &&
        item.subMenu.find((subItem) => subItem.url === location.pathname)
    )?.title;

    setShowSubMenu_(null, toOpen, true);
  }, [location]);

  const isActive = (url) => {
    return location.pathname.includes(url);
  };

  const setShowSubMenu_ = (e, title, open) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

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
      }}
    >
      <List style={{ marginTop: 80 }}>
        <span
          style={{
            fontWeight: 200,
            fontSize: 12,
            paddingLeft: 20,
            marginBottom: 10,
            display: "inline-block",
          }}
        >
          {open ? "GENERAL" : ". . ."}
        </span>
        {mainNavigationList
          ?.filter(
            (item) =>
              handleRolePageAccess(item.url, true, user.roles) &&
              !!item.additionalPermissionUrl ===
                handleRolePageAccess(
                  item.additionalPermissionUrl,
                  true,
                  user.roles
                ) &&
              (!item.exclusionPermissionUrl ||
                !handleRolePageAccess(
                  item.exclusionPermissionUrl,
                  true,
                  user.roles
                ))
          )
          /* ?.filter(
            (item) =>
              !item.hidden &&
              !!item.justEmployees === (item.justEmployees === "yes")
          ) */
          ?.map((item, index) => (
            <Fragment key={`main-${index}`}>
              <Link
                key={index}
                to={item.subMenu ? "#" : item.url}
                onClick={
                  item.subMenu ? (e) => setShowSubMenu_(e, item.title) : null
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
                      paddingTop: "1px",
                      paddingBottom: "1px",
                      paddingRight: 2.5,
                      paddingLeft: "10px",
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
                      } ${item.subMenu ? "_hasSubMenu" : ""}`}
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
                      {item.subMenu && (
                        <img
                          src={dropDownArrow}
                          alt="arrow"
                          style={{
                            transform: `rotate(${
                              !!showSubMenu[item.title] ? 180 : 0
                            }deg)`,
                            ...(open
                              ? {}
                              : {
                                  position: "absolute",
                                  bottom: -5,
                                }),
                          }}
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                </TooltipPatch>
              </Link>
              <div className="nav-sub-menu">
                <Collapse in={!!showSubMenu[item.title]}>
                  {item.subMenu
                    ?.filter((item) =>
                      handleRolePageAccess(item.url, true, user.roles)
                    )
                    ?.filter((item) => !item.hidden)
                    ?.map((item, index) => (
                      <Link key={`subsub-${index}`} to={item.url}>
                        <TooltipPatch
                          title={!open && item.title}
                          placement="right"
                          arrow
                        >
                          <ListItem
                            disablePadding
                            sx={{
                              display: "block",
                              paddingTop: 0.5,
                              paddingBottom: 0.5,
                              paddingRight: 2.5,
                              paddingLeft: "10px",
                            }}
                          >
                            <ListItemButton
                              sx={{
                                minHeight: 48,
                                justifyContent: open ? "initial" : "center",
                                px: 2.5,
                              }}
                              className={`nav-page-item _sub ${
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
                              />
                            </ListItemButton>
                          </ListItem>
                        </TooltipPatch>
                      </Link>
                    ))}
                </Collapse>
              </div>
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
              to={item.subMenu ? "#" : item.url}
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
                    paddingTop: 0.5,
                    paddingBottom: 0.5,
                    paddingRight: 2.5,
                    paddingLeft: "10px",
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
                    } ${item.subMenu ? "_hasSubMenu" : ""}`}
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
                    {item.subMenu && (
                      <img
                        src={dropDownArrow}
                        alt="arrow"
                        style={{
                          transform: `rotate(${
                            !!showSubMenu[item.title] ? 180 : 0
                          }deg)`,
                          ...(open
                            ? {}
                            : {
                                position: "absolute",
                                bottom: -5,
                              }),
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              </TooltipPatch>
            </Link>
            <div className="nav-sub-menu" key={`div-${index}`}>
              <Collapse in={!!showSubMenu[item.title]}>
                {item.subMenu?.map((item, index) => (
                  <Link key={`subMenu-${index}`} to={item.url}>
                    <TooltipPatch
                      title={!open && item.title}
                      placement="right"
                      arrow
                    >
                      <ListItem
                        disablePadding
                        sx={{
                          display: "block",
                          paddingTop: 0.5,
                          paddingBottom: 0.5,
                          paddingRight: 2.5,
                          paddingLeft: "10px",
                        }}
                      >
                        <ListItemButton
                          sx={{
                            minHeight: 48,
                            justifyContent: open ? "initial" : "center",
                            px: 2.5,
                          }}
                          className={`nav-page-item _sub ${
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
                          />
                        </ListItemButton>
                      </ListItem>
                    </TooltipPatch>
                  </Link>
                ))}
              </Collapse>
            </div>
          </Fragment>
        ))}
        <TooltipPatch title={!open && "Log out"} placement="right" arrow>
          <Logout>
            <ListItem
              disablePadding
              sx={{
                display: "block",
                paddingTop: "1px",
                paddingBottom: "1px",
                paddingRight: 2.5,
                paddingLeft: "10px",
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
