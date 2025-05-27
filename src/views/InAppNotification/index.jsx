import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Badge from "@material-ui/core/Badge";
import { withStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";

import NotificationsList from "./components/NotificationsList";
import { ADD_NOTIFICATION } from "../../store/actions/inappActions";
import { socket } from "../../App";
import {
  afterApiCallSetNotificationMenu,
  makeReduxUpdateToNotificationCount,
} from "./utils/helpers";
import useCustomQuery from "../common/utils/CustomQuery";
import { getInAppNotification } from "../common/components/Query/InAppNotificaficationQuery/inAppQuery";
import MainPageLayout from "../common/components/AppLayout/MainPageLayout";
import { mainNavigationListNames } from "../common/utils/lists";

const useStyles = makeStyles({
  tabWrapper: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    "& .Mui-selected": { borderBottom: "2px solid #2457C1" },
  },
  count: {
    marginLeft: "4px",
    padding: "2px 5px",
    borderRadius: "20px",
    background: "#B4CAE0",
    fontSize: "10px",
  },
});

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: "-3%",
    top: "13%",
    border: `2px solid ${theme?.palette.background.paper}`,
    padding: "0 4px",
  },
}))(Badge);

const InAppNotification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState("all");
  const [notificationsData, setNotificationsData] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [sortParams, setSortParams] = useState({});
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    inappReducer: { unreadNotificationCount },
  } = useSelector((state) => state);
  const {
    inappReducer: { notificationMenu },
  } = useSelector((state) => state);

  const handleChange = (event, newValue) => {
    //console.log(newValue);
    setValue(newValue);
  };

  const handleGetInAppList = ({ data }) => {
    /* This is a way to update the state of the notification menu. */
    dispatch(afterApiCallSetNotificationMenu(data?.data?.data));
    setNotificationsData([...data?.data?.data]);

    /* This is a way to update the state of the notification menu. */
    dispatch(
      makeReduxUpdateToNotificationCount(
        data?.data?._meta?.pagination?.total_unread
      )
    );
  };

  useEffect(() => {
    document.title = "Notifications";
  }, []);

  useEffect(() => {
    dispatch(makeReduxUpdateToNotificationCount(null));
  }, []);

  const { isFetching } = useCustomQuery({
    apiFunc: getInAppNotification,
    queryKey: [
      "listInApp",
      {
        perPage: perPage,
        page: page,
        read: value,
        sortParams,
        setIsLoading,
      },
    ],
    onSuccess: handleGetInAppList,
  });

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

  const handleLayoutChange = (lap) => {
    if (lap.isFinish) {
      setIsLoading(false);
    }
  };

  const renderCount =
    unreadNotificationCount > 100
      ? unreadNotificationCount
      : unreadNotificationCount !== 0 && unreadNotificationCount;

  return (
    <MainPageLayout
      headerTitle={mainNavigationListNames.NOTIFICATIONS}
      pageTitle=""
      pageSubtitle=""
      appsControlMode={null}
      categories={null}
      isLoading={isLoading || isFetching}
      isNotMainPages={false}
      hasGoBack
      hideSubtitle
      handleChange={handleLayoutChange}
      onAddNew={null}
      topBar={<></>}
    >
      <div style={{ display: "flex", color: "#2457C1" }}>
        <div className={classes.tabWrapper}>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="inherit"
            textColor="primary"
          >
            {/* <StyledBadge badgeContent={4} color="secondary"> */}
            <Tab
              value={"all"}
              label={
                <span>
                  {"All"}
                  {renderCount && (
                    <span className={classes.count}>{renderCount}</span>
                  )}
                </span>
              }
              style={{ textTransform: "none", marginRight: "1rem" }}
            />
            {/* </StyledBadge> */}
            <Tab
              value={"read"}
              label="Read"
              style={{ textTransform: "none", margin: "0 1rem" }}
            />
            <Tab
              value={"unread"}
              label="Unread"
              style={{ textTransform: "none", margin: "0 1rem" }}
            />
          </Tabs>

          {/* <div value={value} hidden={value !== 0}>
            Item One
          </div>
          <div value={value} hidden={value !== 1}>
            Item Two
          </div>
          <div value={value} hidden={value !== 2}>
            Item Three
          </div> */}
          <NotificationsList
            isLoading={isLoading}
            isFetching={isFetching}
            notificationMenu={notificationMenu}
            notificationsData={notificationsData}
          />
          {/* <DisplayNotification /> */}
        </div>
      </div>
    </MainPageLayout>
  );
};

export default InAppNotification;
