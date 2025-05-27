import { Collapse, makeStyles, Tooltip, Typography } from "@material-ui/core";

import React, { useEffect, useState } from "react";
import { HiMiniAdjustmentsHorizontal } from "react-icons/hi2";
import { Remove } from "@material-ui/icons";
import { MdAnalytics } from "react-icons/md";
import { Menu, MenuItem } from "@material-ui/core";

import appIcon from "../../../../assets/images/applist-single-img.svg";
import { Skeleton } from "@mui/material";
import { getAccountInfo } from "../../../SettingsLayout/Pages/SsoConfiguration/utils/ssoAccountsAPI";
import useCustomQuery from "../../../common/utils/CustomQuery";
import { useStyles } from "../appsStyle";
import { Link, useHistory } from "react-router-dom";
import { unprotectedUrls } from "../../../common/utils/lists";
import NoData from "../../commonComponents/NoData";

const QuickAccess = (props) => {
  const { accountData, colors, isAccountLoading, useApi = false } = props;
  const [categoryObj, setCategoryObj] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles(makeStyles);
  const history = useHistory();

  const handleMoreOptionClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  return (
    <div className={classes.leftSect}>
      <div
        style={{
          display: "flex",
          marginBottom: "32px",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          style={{
            //margin: "24px 24px 26px",
            fontSize: "22px",
            fontWeight: "500",
            color: "#292929",
          }}
          noWrap
        >
          Quick Access
        </Typography>
        {/* THE CODE BELOW IS STILL NEEDED FOR THE FUTURE*/}
        {/* <HiMiniAdjustmentsHorizontal
          onClick={(e) => handleMoreOptionClick(e)}
          color="#DE5439"
          style={{ fontSize: "20px", cursor: "pointer" }}
        /> */}
      </div>
      <div>
        <div>
          {isAccountLoading ? (
            <div style={{ margin: "auto", width: "100%" }}>
              <Skeleton width="90%" height="50px" />
              <Skeleton width="90%" height="50px" />
              <Skeleton width="90%" height="50px" />
              <Skeleton width="90%" height="50px" />
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {accountData?.customisations?.quickAccessApps?.map(
                (apps, index) => {
                  return (
                    <div key={index}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "10px",
                          height: "32px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <div
                            style={{
                              background: colors[index % colors.length].pri,
                            }}
                            className={classes.appsIcon}
                          >
                            <MdAnalytics
                              color={colors[index % colors.length].sec}
                              style={{ fontSize: "14px" }}
                            />
                          </div>
                          <Tooltip title={apps?.name}>
                            <Link
                              to={`${unprotectedUrls.RUN}/${accountData?.slug}/${apps?.slug}`}
                              target="_blank"
                              style={{ textDecoration: "none" }}
                            >
                              <Typography
                                style={{
                                  fontWeight: "500",
                                  fontSize: "16px",
                                  maxWidth: "150px",
                                }}
                                className={classes.truncated}
                              >
                                {apps?.name}
                              </Typography>
                            </Link>
                          </Tooltip>
                        </div>
                        {/* THIS IS NEEDED FOR FUTURE CASES*/}
                        {/* <Remove
                    style={{
                      fontSize: "2rem",
                      cursor: "pointer",
                    }}
                  /> */}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
        {!accountData?.customisations?.quickAccessApps?.length &&
          !isAccountLoading && <NoData />}
      </div>
      <MenuActions
        setAnchorEl={setAnchorEl}
        classes={classes}
        colors={colors}
        filteredAppsData={accountData?.customisations?.quickAccessApps}
        anchorEl={anchorEl}
      />
    </div>
  );
};

export default QuickAccess;

const MenuActions = ({
  setAnchorEl,
  anchorEl,
  active,
  classes,
  sendMenuAction,
  colors,
  filteredAppsData,
}) => {
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.menuBase}>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        //id={"screens-menu"}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isMenuOpen}
        onClose={handleMenuClose}
        style={{ top: "4rem" }}
        PopoverClasses={classes.menuBase}
        className={classes.menuBase}
      >
        {filteredAppsData?.map((apps, index) => {
          return (
            <div key={index}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px",
                  height: "50px",
                  width: "320px",
                  overflow: "hidden !important",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      background: colors[index % colors.length].pri,
                    }}
                    className={classes.appsIcon}
                  >
                    <MdAnalytics
                      color={colors[index % colors.length].sec}
                      style={{ fontSize: "14px" }}
                    />
                  </div>
                  <Tooltip title={apps?.name}>
                    <Typography
                      style={{
                        fontWeight: "500",
                        fontSize: "16px",
                        maxWidth: "150px",
                      }}
                      className={classes.truncated}
                    >
                      {apps?.name}
                    </Typography>
                  </Tooltip>
                </div>
                <h1
                  style={{
                    fontWeight: "300",
                    fontSize: "2.5rem",
                    cursor: "pointer",
                  }}
                >
                  +
                </h1>
              </div>
            </div>
          );
        })}
      </Menu>
    </div>
  );
};
