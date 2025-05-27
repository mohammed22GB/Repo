import { useState, useRef, useEffect, useCallback } from "react";
import {
  Grid,
  Typography,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  ListItemIcon,
  Switch,
  IconButton,
  Modal,
  Backdrop,
  Fade,
  FormControl,
  Button,
} from "@material-ui/core";
import { v4 } from "uuid";
import Cancel from "@material-ui/icons/Cancel";
import { useInfiniteQuery, useQueryClient } from "react-query";

import {
  getUsersAPI,
  updateUserAPI,
} from "../../UserManagement/utils/usersAPIs";
import useStyles from "./style";
import ModalSearchBar from "./ModalSearchBar";
import useCustomMutation from "../../../../common/utils/CustomMutation";
import { AddRounded, ArrowBackTwoTone, MoreVert } from "@material-ui/icons";
import MenuList from "./MenuList";
import { updateUserGroupAPI } from "../utils/usergroupsAPIs";
import AlertUserInUserGroupModal from "./AlertUserAlreadyInUserGroupModal";
import {
  errorToastify,
  successToastify,
} from "../../../../common/utils/Toastify";

const AssignUserModal = (props) => {
  const { groupData, setRefetchQuery, usergroupID } = props;
  const [listKey, setListKey] = useState(v4());
  const classes = useStyles();
  const [selectedID, setSelectedID] = useState(null);
  const [currPage, setCurrPage] = useState(1);
  const [showAddedMembers, setShowAddedMembers] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [adminIDs, setAdminIDs] = useState(groupData?.admins);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeUsers, setActiveUsers] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [openAlertUserGroupModal, setOpenAlertUserGroupModal] = useState(false);
  const anchorRef = useRef(null);
  const observerElem = useRef(null);
  const memberIdRef = useRef({});

  const groupId = groupData?.id;

  useEffect(() => {
    const filterWord = searchTerm;
    let srch = new RegExp(filterWord.replace(/[^\w\s]/gi, ""), "gi");

    if (allUsers) {
      if (allUsers.length) {
        const filtered = allUsers?.filter(
          (f) =>
            !srch ||
            (f?.firstName &&
              f?.lastName &&
              `${f?.firstName}${f?.lastName}`.search(srch) !== -1)
        );
        setFilteredUsers(filtered);
      }
    }
  }, [allUsers, searchTerm, activeUsers]);

  const _doFilter = (filt) => {
    setSearchTerm(filt);
  };

  // fetch usergroups
  const { data, isSuccess, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      "allUsers",
      ({ pageParam = currPage }) => getUsersAPI({ pageParam }),
      {
        getNextPageParam: (lastPage, allPages) => {
          //let nextPage = allPages.length + 1;
          const nextPage = lastPage?._meta.pagination?.current + 1;
          return lastPage?.data?.length !== 0 ? nextPage : undefined;
        },
      }
    );

  useEffect(() => {
    let activeUserObj = {};
    const filteredUser = (arrObj) =>
      arrObj?.filter((res) => {
        const findActiveUser = res?.userGroups?.find(
          (group) => group?.id === groupId
        );
        if (findActiveUser) {
          activeUserObj = { ...activeUserObj, [res?.id]: true };
        }
        return res;
      });
    if (data?.pages) {
      const result = data?.pages
        ?.map((page) => page?.data)
        ?.reduce((prev, curr) => prev.concat(curr), []);
      filteredUser(result);
      setActiveUsers({ ...activeUsers, ...activeUserObj });
      setAllUsers(result);
      setListKey(v4());
    } else {
      if (data?.length) {
        filteredUser(data);
        setActiveUsers({ ...activeUsers, ...activeUserObj });
        setAllUsers(data);
        setListKey(v4());
      }
    }
  }, [data]);

  const handleMoreOptionClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleObserver = useCallback(
    (entries) => {
      const [target] = entries;
      if (target?.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage]
  );

  useEffect(() => {
    const element = observerElem.current;
    const option = { threshold: 0 };
    if (!element) return;
    const observer = new IntersectionObserver(handleObserver, option);
    observer?.observe(element);
    if (
      isFetchingNextPage &&
      hasNextPage &&
      element?.getBoundingClientRect()?.bottom <= window?.innerHeight
    ) {
      fetchNextPage();
    }
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [hasNextPage, handleObserver, isFetchingNextPage, fetchNextPage]);

  const onUpdateUserSuccess = ({ data }) => {
    successToastify("User successfully updated.");
  };

  const onErrorhandleIsFunctionalCheck = ({ error }) => {
    errorToastify("Failed to add user to the group. Please try again.");

    if (error) {
      setOpenAlertUserGroupModal(true);
    }
  };

  const { mutate: updateUser } = useCustomMutation({
    apiFunc: updateUserAPI,
    onSuccess: onUpdateUserSuccess,
    retries: 0,
    onError: onErrorhandleIsFunctionalCheck,
  });

  const toggleMember = async (memberId, val) => {
    const join = typeof val === "boolean" ? val : !!val?.target?.checked;
    const allusrs = [...allUsers];
    const usr = allusrs?.find((u) => u.id === memberId);

    const grps = usr?.userGroups || [];
    setActiveUsers({ ...activeUsers, [usr?.id]: join });

    if (!join) {
      grps.splice(grps.indexOf(groupId), 1);
    } else {
      grps.push(groupId);
    }

    const newAll = allusrs.map((u) => {
      if (u.id === memberId) u.userGroups = grps;
      return u;
    });

    setAllUsers(newAll);

    usr.userGroups = grps;

    setRefetchQuery(true);

    memberIdRef.current = usr;

    updateUser({ data: usr });
  };

  const assignAdmin = async (memberId, action) => {
    let admins;
    if (action === "add") {
      admins = adminIDs?.includes(memberId)
        ? adminIDs
        : [...adminIDs, memberId];
    }
    if (action === "remove") {
      admins = [...adminIDs]?.filter((id) => id !== memberId);
    }
    setAdminIDs(admins);
    updateUserGroupAPI({ data: { admins, id: usergroupID } });
    setRefetchQuery(true);
  };

  const _getUserIcon = (usr) => {
    const F = !!usr.firstName && usr.firstName.substr(0, 1);
    const L = !!usr.lastName && usr.lastName.substr(0, 1);
    const bgArr = [
      "#FFCC00",
      "#000000",
      "#00FF00",
      "#0000FF",
      "#FFFF00",
      "#FF00FF",
      "#FF0000",
      "#00FFFF",
      "#FF0088",
      "#8800FF",
      "#88FF00",
      "#0044FF",
      "#004488",
      "#008844",
    ];
    const bg = bgArr[Math.floor(Math.random() * bgArr.length)];
    return (
      <div className={classes.userIcon} style={{ backgroundColor: bg }}>{`${
        F || "?"
      }${L || "?"}`}</div>
    );
  };

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={props?.open}
        onClose={props.closeModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={true}>
          <div className={classes.paper2}>
            <div>
              <div className={classes.modalHead}>
                <Typography
                  variant="h5"
                  title="popupTitle"
                  component="h2"
                  style={{ textTransform: "capitalize" }}
                >
                  {groupData.name}{" "}
                  {`Group: ${!showAddedMembers ? "Assign" : "Add"} members`}
                </Typography>
                <IconButton
                  aria-label="cancel"
                  color="inherit"
                  onClick={props.closeModal}
                >
                  <Cancel fontSize="small" />
                </IconButton>
              </div>
              <div
                className={classes.modalMain}
                style={{ padding: "20px 40px" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <ModalSearchBar
                    doFilter={_doFilter}
                    searchTerm={searchTerm}
                    showBtn={showAddedMembers}
                  />
                  <div>
                    {!showAddedMembers ? (
                      <AddRounded
                        style={{
                          fontSize: 30,
                          cursor: "pointer",
                          color: "white",
                          background: "#2457c1",
                          borderRadius: "50%",
                        }}
                        onClick={() => {
                          setShowAddedMembers(true);
                          setSearchTerm("");
                        }}
                      />
                    ) : (
                      <ArrowBackTwoTone
                        style={{
                          fontSize: 30,
                          cursor: "pointer",
                          color: "white",
                          background: "#2457c1",
                          borderRadius: "50%",
                        }}
                        onClick={() => {
                          setShowAddedMembers(false);
                          setSearchTerm("");
                        }}
                      />
                    )}
                  </div>
                </div>
                <Grid container direction="column" spacing={3} key={listKey}>
                  {!showAddedMembers ? (
                    <List className={classes.root}>
                      {!!filteredUsers?.length &&
                        filteredUsers
                          ?.filter((user) => activeUsers[user?.id])
                          .map((user) => {
                            const isAdmin = adminIDs?.includes(user?.id);
                            return (
                              <ListItem key={user.id} title={"groupMember"}>
                                <ListItemIcon key={user.id}>
                                  {_getUserIcon(user)}
                                </ListItemIcon>
                                <ListItemText
                                  id="switch-list-label-wifi"
                                  primary={`${user.firstName || "--"} ${
                                    user.lastName || "--"
                                  } ${
                                    !user.firstName && !user.lastName
                                      ? "{" + user.email + "}"
                                      : ""
                                  } `}
                                />
                                {isAdmin ? (
                                  <span style={{ fontSize: "10px" }}>
                                    Admin
                                  </span>
                                ) : (
                                  ""
                                )}
                                <ListItemSecondaryAction>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      justifyContent: "space-around",
                                      alignItems: "center",
                                    }}
                                  >
                                    <IconButton
                                      style={{ padding: 7 }}
                                      onClick={(e) => {
                                        handleMoreOptionClick(e);
                                        setSelectedID(user?.id);
                                      }}
                                    >
                                      <MoreVert style={{ fontSize: 18 }} />
                                    </IconButton>{" "}
                                    <MenuList
                                      memberId={selectedID}
                                      toggleMember={toggleMember}
                                      assignAdmin={assignAdmin}
                                      adminIDs={adminIDs}
                                      setAnchorEl={setAnchorEl}
                                      anchorEl={anchorEl}
                                      anchorRef={anchorRef}
                                    />
                                  </div>
                                </ListItemSecondaryAction>
                              </ListItem>
                            );
                          })}
                    </List>
                  ) : (
                    <>
                      <List className={classes.root}>
                        {!!filteredUsers?.length &&
                          filteredUsers
                            ?.filter((user) => !activeUsers[user?.id])
                            ?.map((user) => (
                              <ListItem key={user.id}>
                                <ListItemIcon key={user.id}>
                                  {_getUserIcon(user)}
                                </ListItemIcon>
                                <ListItemText
                                  id="switch-list-label-wifi"
                                  primary={`${user.firstName || "--"} ${
                                    user.lastName || "--"
                                  } ${
                                    !user.firstName && !user.lastName
                                      ? "{" + user.email + "}"
                                      : ""
                                  }`}
                                />
                                <ListItemSecondaryAction>
                                  <Switch
                                    edge="end"
                                    onChange={async (e) =>
                                      await toggleMember(user?.id, e)
                                    }
                                    checked={activeUsers?.[user?.id]}
                                    size="small"
                                  />
                                </ListItemSecondaryAction>
                              </ListItem>
                            ))}
                      </List>
                    </>
                  )}
                </Grid>
                <div className="loader" ref={observerElem}>
                  {isFetchingNextPage && hasNextPage ? "Loading..." : ""}
                </div>
              </div>
              <div className={classes.modalBase}>
                <FormControl>
                  <Button
                    onClick={props.closeModal}
                    variant="contained"
                    color="primary"
                    classes={{
                      root: classes.customButton,
                      label: classes.customButtonLabel,
                    }}
                  >
                    Close
                  </Button>
                </FormControl>
              </div>
            </div>
          </div>
        </Fade>
      </Modal>

      {openAlertUserGroupModal && (
        <AlertUserInUserGroupModal
          open={openAlertUserGroupModal}
          handleClose={setOpenAlertUserGroupModal}
          memberId={memberIdRef}
          updateUser={updateUser}
        />
      )}
    </>
  );
};

export default AssignUserModal;
