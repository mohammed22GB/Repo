import React from "react";
import { KeyboardArrowRight } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { makeStyles, Tooltip, Typography } from "@material-ui/core";

import ComponentCard from "../ComponentCard";
import { returnLinkUrl } from "../../../../common/helpers/helperFunctions";
import {
  getUserIdFieldBasedOnUserDetail,
  hexToRgba,
} from "../../../../SettingsLayout/Pages/Customizations/utils/customizationutils";
import useGetUserPortalCustomisation from "../../../../SettingsLayout/Pages/Customizations/utils/useGetUserPortalCustomisation";
import NoData from "../../../commonComponents/NoData";

const DashboardContainer = ({
  accountInfo,
  taskData,
  userInfo,
  isTaskLoading,
  isAccountLoading,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <UserDetails
        classes={classes}
        accountInfo={accountInfo}
        isAccountLoading={isAccountLoading}
      />
      <OrgDetails
        classes={classes}
        accountInfo={accountInfo}
        isAccountLoading={isAccountLoading}
      />
      <PendingTasks
        taskData={taskData?.data}
        isTaskLoading={isTaskLoading}
        classes={classes}
        userInfo={userInfo}
      />
    </div>
  );
};
export default DashboardContainer;

const conditions = (details, classes, internalPageTheme) => {
  if (details?.contentType === "Apps") {
    return (
      <Tooltip title={details?.content?.name}>
        <Typography className={`${classes.bottomUsrTxt} ${classes.truncated}`}>
          {details?.content?.name || "--"}
        </Typography>
      </Tooltip>
    );
  } else if (details?.contentType === "External link") {
    return details?.contentType === "External link" ? (
      <a
        href={returnLinkUrl(`${details.linkUrl}`)}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none" }}
      >
        <Typography className={`${classes.linkTxt} ${classes.truncated}`}>
          {details?.linkText}
        </Typography>
      </a>
    ) : (
      <Typography variant="h6" className={classes.bottomUsrTxt}>
        {"--"}
      </Typography>
    );
  } else if (details?.contentType === "Documents") {
    return (
      <a
        href={returnLinkUrl(`${details.file}`)}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none" }}
      >
        <div className={classes.policyCover}>
          <Tooltip title={details?.documentType}>
            <Typography
              variant="h6"
              className={`${classes.bottomUsrTxt} ${classes.truncated}`}
            >
              {details?.documentType || "--"}
            </Typography>
          </Tooltip>
          <Typography
            variant="body2"
            noWrap
            className={classes.eightItems}
            style={{
              backgroundColor: `${hexToRgba(internalPageTheme, 0.12)}`,
              color: internalPageTheme,
            }}
          >
            {" "}
            1 item
          </Typography>

          <KeyboardArrowRight
            style={{
              fontSize: "18px",
              cursor: "pointer",
            }}
          />
        </div>
      </a>
    );
  } else if (details?.contentType === "User details") {
    return (
      <Tooltip
        title={getUserIdFieldBasedOnUserDetail(details?.informationType)}
      >
        <Typography
          variant="h6"
          className={`${classes.bottomUsrTxt} ${classes.truncated}`}
        >
          {getUserIdFieldBasedOnUserDetail(details?.informationType) || "--"}
        </Typography>
      </Tooltip>
    );
  } else if (details?.contentType === "None") {
    return (
      <Tooltip title={details?.title}>
        <Typography
          variant="h6"
          className={`${classes.bottomUsrTxt} ${classes.truncated}`}
        >
          {details?.title || "--"}
        </Typography>
      </Tooltip>
    );
  } else {
    return "--";
  }
};
const UserDetails = ({ classes, accountInfo, isAccountLoading }) => {
  const Body = () => {
    const { internalPage, brandTheme } = useGetUserPortalCustomisation();

    const internalPageTheme = internalPage?.isEnabled
      ? internalPage?.theme?.primaryColor
      : brandTheme ?? "#DE5439";

    return (
      <div
        className={classes.fleexCol}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.7rem",
          justifyContent: "space-between",
          fontFamily: "Avenir-Medium,Inter",
        }}
      >
        {accountInfo?.personalDetails?.map((details, index) => {
          return (
            <div style={{ width: "48%" }} key={index}>
              <Typography className={classes.bottomSpacer}>
                {details?.title}
              </Typography>
              {conditions(details, classes, internalPageTheme)}
            </div>
          );
        })}
        {!accountInfo?.personalDetails?.length && (
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "2rem",
            }}
          >
            <Typography style={{ margin: "auto" }} variant="body3" noWrap>
              No data found
            </Typography>
          </div>
        )}
      </div>
    );
  };

  return (
    <ComponentCard
      isLoading={isAccountLoading}
      classes={classes}
      Body={Body}
      laptopWidthMD={"32%"}
      laptopWidthSM={"48%"}
      title={"Personal Details"}
    />
  );
};

const OrgDetails = ({ classes, accountInfo, isAccountLoading }) => {
  const Body = () => {
    const { internalPage, brandTheme } = useGetUserPortalCustomisation();

    const internalPageTheme = internalPage?.isEnabled
      ? internalPage?.theme?.primaryColor
      : brandTheme ?? "#DE5439";

    return (
      <div
        className={classes.fleexCol}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.7rem",
          justifyContent: "space-between",
        }}
      >
        {accountInfo?.organizationDetails?.map((details) => {
          return (
            <div style={{ width: "48%" }}>
              <Typography className={classes.bottomSpacer}>
                {details?.title}
              </Typography>
              {conditions(details, classes, internalPageTheme)}
            </div>
          );
        })}

        {!accountInfo?.personalDetails?.length && (
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "2rem",
            }}
          >
            <Typography style={{ margin: "auto" }} variant="body3" noWrap>
              No data found
            </Typography>
          </div>
        )}
      </div>
    );
  };

  return (
    <ComponentCard
      isLoading={isAccountLoading}
      laptopWidthMD={"35%"}
      laptopWidthSM={"48%"}
      classes={classes}
      Body={Body}
      title={"Organization Details"}
    />
  );
};

const useStyles = makeStyles((theme) => {
  return {
    container: {
      display: "flex",
      gap: "18px",
      width: "100%",
      maxHeight: "208px",
      minHeight: "200px",
      "@media (max-width: 1170px)": {
        flexWrap: "wrap",
        maxHeight: "208px",
      },
      "@media (max-width: 800px)": {
        flexDirection: "column",
        flexWrap: "nowrap",
        maxHeight: "fit-content",
        width: "98%",
      },
      "@media (max-width: 500px)": {
        width: "50%",
      },
    },
    truncated: {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "100%",
      minWidth: "50px",
    },
    userHeadingOne: {
      width: "100%",
      fontWeight: "500",
      fontSize: "22px",
      overflow: "unset",
    },
    deptDivOne: {
      display: "flex",
      width: "100%",
      justifyContent: "space-between",
    },
    flexCol: {
      display: "flex",
      flexDirection: "column",
    },
    bottomUsrTxt: {
      margin: "4px 0px 8px",
      fontSize: "16px",
      fontWeight: 500,
      color: "#535353",
    },
    bottomSpace2: {
      marginTop: "4px",
      fontSize: "1rem",
    },
    bottomSpacer: {
      color: "#ABABAB",
      fontWeight: "400",
      //marginBottom: "10px",
      fontSize: "14px",
    },
    orgHeader: {
      display: "flex",
      flexDirection: "column",
      padding: "24px",
      gap: "3px",
      //width: "35%",
      //width: "375px",
      borderRadius: "10px",
      background: "#FFFFFF",
      minHeight: "100%",
      overflowY: "auto",
      "@media (max-width: 1170px)": {
        width: "46%",
        minHeight: "15rem",
      },
      "@media (max-width: 800px)": {
        width: "98%",
      },
    },
    linkTxt: {
      margin: "4px  0 11px",
      fontSize: "16px",
      fontWeight: "500",
      textDecoration: "underline",
      color: "#535353",
    },
    orgDetails: {
      width: "100%",
      margin: "10px 0 15px",
      fontWeight: "500",
      fontSize: "22px",
      overflow: "unset",
    },
    docWrapper: {
      display: "flex",
      width: "100%",
      justifyContent: "space-between",
    },
    policyCover: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "2px",
    },
    textSize: {
      margin: "0px",
      fontSize: "1rem",
    },
    eightItems: {
      padding: "2px 8px",
      lineHeight: "16px",
      display: "inline-block",
      margin: "0px",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "25px",
      minWidth: "4rem",
      fontSize: "11px",
    },
    pendingTop: {
      display: "flex",
      width: "100%",
      alignItems: "center",
      justifyContent: "space-between",
      fontFamily: "Avenir-Medium,Inter",
    },
    nameTitle: {
      display: "flex",
      width: "100%",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "8px",
    },
    approvalText: {
      fontSize: "16px",
      fontWeight: 500,
      color: "#535353",
      maxWidth: "100px !important",
      minWidth: "100px !important",
      margin: "0px",
    },
    userName: {
      fontSize: "16px",
      fontWeight: 500,
      color: "#535353",
      padding: "2px 12px",
      margin: "0px",
      borderRadius: "25px",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "150px !important",
    },
    userDays: {
      padding: "2px 6px",
      margin: "0px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "25px",
      fontWeight: "500",
      backgroundColor: "#DE543933",
    },
  };
});

const PendingTasks = ({ classes, taskData, isTaskLoading, userInfo }) => {
  const textColor = ["#52DE3929", "#398EDE29", "#DEB23929"];

  const returnLink = (data) => {
    if (data?.task?.name?.toLowerCase() === "approval") {
      return `/approval/${data?.app?.account?.slug}/${
        data?.app?.slug
      }?workflowInstanceId=${data?.taskStatus?.workflowInstance}&taskId=${
        data?.task?.id || data?.taskStatus?.task
      }&appId=${data?.app?.id}&isApproval=true`;
    } else {
      return `/run/${data?.app?.account?.slug}/${data?.app?.slug}/${
        data?.task?.properties?.screen?.slug
      }?workflowInstanceId=${data?.taskStatus?.workflowInstance}&taskId=${
        data?.task?.id || data?.taskStatus?.task
      }&appId=${data?.app?.id}`;
    }
  };

  const Body = () => {
    return (
      <>
        {taskData?.map((taskDataObj, index) => {
          const isAppDeleted = taskDataObj?.app?.deleted;
          const isAppActive = taskDataObj?.app?.active;
          const canViewApp = !isAppDeleted && isAppActive;
          return (
            <div key={index} className={classes.nameTitle}>
              <Tooltip title={taskDataObj?.app?.name}>
                <Typography
                  className={`${classes.approvalText} ${classes.truncated}`}
                >
                  {taskDataObj?.app?.name}
                </Typography>
              </Tooltip>
              <Tooltip
                title={`${
                  taskDataObj?.taskStatus?.assignedTo?.[0]?.name ?? ""
                } `}
              >
                <Typography
                  className={`${classes.userName} ${classes.truncated}`}
                  style={{
                    backgroundColor: textColor[index % textColor.length],
                  }}
                  noWrap
                >
                  {`${taskDataObj?.taskStatus?.assignedTo?.[0]?.name ?? ""} `}
                </Typography>
              </Tooltip>

              {/*THIS IS A NEEDED CODE BUT FOR THE FUTURE*/}
              {/* <h4 className={classes.userDays}> {taskDataObj.days}</h4> */}

              {canViewApp ? (
                <Link
                  to={returnLink(taskDataObj)}
                  style={{ textDecoration: "none" }}
                >
                  <KeyboardArrowRight
                    style={{
                      fontSize: "18px",
                      cursor: "pointer",
                      marginTop: "4px",
                    }}
                  />
                </Link>
              ) : (
                <Tooltip
                  title={
                    isAppDeleted
                      ? "This app has been deleted"
                      : "This app has been unpublished"
                  }
                >
                  <KeyboardArrowRight
                    style={{
                      color: "gray",
                      fontSize: "18px",
                      cursor: "not-allowed",
                      marginTop: "4px",
                    }}
                  />
                </Tooltip>
              )}
            </div>
          );
        })}
        {!taskData?.length && <NoData />}
      </>
    );
  };

  const SideElement = () => {
    return (
      <Link
        style={{ color: "black" }}
        to={{
          pathname: "./records",
          state: { state: "pendingTasks" },
        }}
      >
        <Typography variant="body3" noWrap>
          See all{" "}
        </Typography>
      </Link>
    );
  };

  return (
    <ComponentCard
      isLoading={isTaskLoading}
      classes={classes}
      Body={Body}
      laptopWidthMD={"33%"}
      laptopWidthSM={"48%"}
      title={"Pending Tasks"}
      SideElement={SideElement}
    />
  );
};
