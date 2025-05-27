import { useRef } from "react";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuList from "@material-ui/core/MenuList";
import { makeStyles } from "@material-ui/core/styles";
import NotificationItem from "./NotificationItem";
import { useHistory } from "react-router-dom";
import { Button, Box } from "@material-ui/core";

import { mainNavigationUrls } from "../../common/utils/lists";

const useStyle = makeStyles(() => ({
  popperBox: {
    top: "10px !important",
    zIndex: 10,
  },
}));

const NotificationMenu = ({
  openMenu,
  anchorRef,
  setOpenMenu,
  notificationsData,
}) => {
  const classes = useStyle();
  const arrowRef = useRef(null);
  const history = useHistory();
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpenMenu(false);
  };

  const handleListKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenMenu(false);
    }
  };

  return (
    <Popper
      open={openMenu}
      anchorEl={anchorRef.current}
      role={undefined}
      transition
      disablePortal
      placement="bottom"
      className={classes.popperBox}
      //style={{ top: "50px" }}
    >
      {({ TransitionProps, placement }) =>
        notificationsData?.data?.length ? (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper style={{ padding: 0, width: "420px" }}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={openMenu}
                  id="menu-list-grow"
                  onKeyDown={handleListKeyDown}
                  style={{ padding: 0, width: "100%" }}
                >
                  {notificationsData?.data?.map((data, idx) => (
                    <NotificationItem
                      type={data?.type}
                      read={data?.read}
                      key={data?.idx}
                      id={data?._id}
                      title={data?.title}
                      createdAt={data?.createdAt}
                      history={history}
                      description={data?.description}
                      link={data?.link}
                      onClick={handleClose}
                      menu
                    />
                  ))}
                  <Box
                    style={{
                      width: "100%",
                      height: "3rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      //borderTop: "1px solid #D7E2ED",
                      border: "1px solid #D7E2ED",
                    }}
                  >
                    <Button
                      style={{
                        margin: "auto",
                        color: "#2457C1",
                        textTransform: "none",
                        fontSize: "12px",
                      }}
                      size="medium"
                      onClick={() =>
                        history.push(mainNavigationUrls.NOTIFICATIONS)
                      }
                    >
                      View all
                    </Button>
                  </Box>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        ) : (
          ""
        )
      }
    </Popper>
  );
};

export default NotificationMenu;
