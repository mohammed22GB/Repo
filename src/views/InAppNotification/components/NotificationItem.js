import { useState } from "react";
import { useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import ListItem from "@material-ui/core/ListItem";
import Parser from "html-react-parser";
import Button from "@material-ui/core/Button";
import moment from "moment";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

import plugLogoMini from "../../../assets/images/plug-logo-icon.svg";
import { makeReduxUpdateToNotificationCount } from "../utils/helpers";
import useCustomMutation from "../../common/utils/CustomMutation";
import { updateNotification } from "../../common/components/Query/InAppNotificaficationQuery/inAppQuery";

const useStyle = makeStyles((theme) => ({
  section: (props) => ({
    minHeight: !props.menu ? "120px" : "70px",
    minWidth: !props.menu ? "300px" : "100%",
    padding: !props.menu ? "0.5rem 2rem" : "5px 1rem 0 0.5rem",
    fontFamily: "GT Eesti Pro Text",
    display: "flex",
    border: "1px solid #D7E2ED",
  }),
  badge: {
    width: "2px",
    minWidth: "0px",
    height: "12px",
    background: "#3465D4",
  },
  checkbox: {
    width: "2.5em !important",
  },
  logoBox: (props) => ({
    width: !props.menu ? "10%" : "12%",
    display: "flex",
    minHeight: "100%",
    justifyContent: "center",
    alignItems: !props.menu ? "center" : "flex-start",
    paddingTop: !props.menu ? "0" : "3px",
    "& img": {
      width: "250%",
    },
  }),
  avatarBox: (props) => ({
    padding: "1rem",
    width: !props.menu ? "4.5rem" : "2.5rem",
    height: !props.menu ? "4.5rem" : "2.5rem",
    borderRadius: "50%",
    background: "whitesmoke",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }),
  listItem: (props) => ({
    width: !props.menu ? "75%" : "88%",
    paddingTop: "0",
    paddingBottom: "0",
  }),
  contentBox: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  taskBtn: (props) => ({
    width: !props.menu ? "92px" : "80px",
    height: !props.menu ? "32px" : "26px",
    fontSize: !props.menu ? "12px" : "10px",
    background: "#2457C1",
  }),
}));

const NotificationItem = (props) => {
  const {
    key,
    history,
    title,
    createdAt,
    link,
    read,
    menu,
    type,
    description,
    id,
  } = props;
  const classes = useStyle((props = { menu }));
  const dateTime = moment(createdAt).format("ddd MMM DD YYYY, h:mm A");
  const [notificationID, setNotificationID] = useState({});
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const {
    inappReducer: { unreadNotificationCount },
  } = useSelector((state) => state);

  const toggleItem = () => {
    setNotificationID((prevState) => ({
      ...prevState,
      [id]: { toggle: !prevState?.[id]?.toggle ? true : false, [id]: true },
    }));
  };

  const readNotificationSuccess = async () => {
    // queryClient.invalidateQueries(["listInApp"]);
    const updatedUnreadNotificationCount = unreadNotificationCount - 1;
    await queryClient.invalidateQueries(["inAppNotificationBadgeCount"]);

    dispatch(
      makeReduxUpdateToNotificationCount(updatedUnreadNotificationCount)
    );
  };

  const { mutate: readNotification } = useCustomMutation({
    apiFunc: updateNotification,
    onSuccess: readNotificationSuccess,
    enabled: !!id,
    retries: 0,
  });

  const handleReadNotification = async () => {
    if (!read && !notificationID?.[id]?.[id]) {
      return await readNotification({ id });
    } else {
      return;
    }
  };

  const parseTitle = () => {
    const content = Parser(title);
    const start = 0;
    const end = menu ? 53 : content.length;
    const extractChild = (
      <>
        {content
          .map((txt) =>
            typeof txt == "string" ? (
              <span>{txt}</span>
            ) : (
              <b>{txt?.props?.children}</b>
            )
          )
          .slice(start, end)}
        {menu ? "..." : ""}
      </>
    );

    return extractChild;
  };

  // useEffect(() => {
  //   // const firstLinkPart = link.indexOf("/") + 2;
  //   // const secondLinkPart = link.substring(firstLinkPart);
  //   // const newLink = process.env.REACT_APP_BASE_URL + secondLinkPart;
  //   // console.log(firstLinkPart);
  //   // console.log(secondLinkPart);
  //   // console.log(newLink);
  //   // console.log(link);
  // }, []);

  return (
    <Box className={classes.section} /*onClick={onClick}*/ key={key}>
      {/* <Box
        style={{
          width: "10%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100%",
        }}
      >
        <Badge
          //color="secondary"
          badgeContent=" "
          variant="standard"
          classes={{ badge: classes.badge }}
        ></Badge>

        <Checkbox
          name="checkedW"
          //defaultChecked={activeTask?.triggeredByWebhook}
          //onChange={(e) => _setTaskInfo(e, "triggeredByWebhook")}
          disableRipple
          size="medium"
          color="default"
          className={classes.chekbox}
          style={{
            marginLeft: "2rem",
            transform: "scale(1.3)",
          }}
        />
      </Box> */}
      <Box className={classes.logoBox}>
        <Box className={classes.avatarBox}>
          <img src={plugLogoMini} alt="logo" />
        </Box>
      </Box>
      <ListItem className={classes.listItem}>
        <Box className={classes.contentBox}>
          <Typography
            style={{
              fontSize: menu ? "11px" : "",
              cursor: menu ? "pointer" : "default",
            }}
            gutterBottom={menu ? false : true}
            variant="body1"
            onClick={() => (menu ? history.push("./notifications") : null)}
          >
            {parseTitle()}
          </Typography>

          <Typography
            style={{
              fontSize: menu ? "9px" : "",
              cursor: menu ? "pointer" : "default",
            }}
            gutterBottom
            variant="body2"
            onClick={() => (menu ? history.push("./notifications") : null)}
          >{`${dateTime}`}</Typography>
          {!!notificationID?.[id]?.toggle && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Typography
                style={{ fontSize: menu ? "11px" : "13px", color: "gray" }}
                gutterBottom
                variant="body1"
              >
                <b>Type: </b> {type}
              </Typography>
              {description && (
                <Typography
                  style={{
                    wordBreak: "break-all",
                    fontSize: menu ? "11px" : "13px",
                    color: "gray",
                  }}
                  gutterBottom
                  variant="body1"
                >
                  {Parser(description)}
                </Typography>
              )}
            </div>
          )}
          {link && (
            <Button
              onClick={() => window.open(link, "_blank")}
              variant="contained"
              color="primary"
              size="small"
              className={classes.taskBtn}
              style={{
                textTransform: "none",
              }}
            >
              Go to Task
            </Button>
          )}
        </Box>
      </ListItem>
      <Box
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          width: "15%",
        }}
      >
        {/* <StarOutlineIcon
          style={{
            marginRight: "1rem",
            color: "darkgray",
            cursor: "pointer",
            fontSize: 21,
          }}
        />
        <DeleteIcon
          style={{ color: "gray", cursor: "pointer", fontSize: 21 }}
          color="action"
        /> */}
        {/* {description ? ( */}
        <>
          {notificationID?.[id]?.toggle ? (
            <ArrowDropUpIcon
              style={{
                cursor: "pointer",
                marginLeft: "auto",
                fontSize: !menu ? 35 : 22,
              }}
              //fontSize="large"
              color="action"
              onClick={() => toggleItem()}
            />
          ) : (
            <ArrowDropDownIcon
              style={{
                cursor: "pointer",
                marginLeft: "auto",
                fontSize: !menu ? 35 : 22,
              }}
              //fontSize="large"
              color="action"
              onClick={() => {
                toggleItem();
                handleReadNotification();
              }}
            />
          )}
        </>
        {/*  ) : (
          ""
       )} */}
      </Box>
    </Box>
  );
};

export default NotificationItem;
