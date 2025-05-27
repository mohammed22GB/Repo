import { useEffect, useRef, useState } from "react";
import {
  Grid,
  Typography,
  List,
  ListSubheader,
  ListItemText,
  TextField,
  Button,
  FormControl,
  FormControlLabel,
} from "@material-ui/core";
import Select from "@material-ui/core/Select";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ReactSpinnerTimer from "react-spinner-timer";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { debounce } from "lodash";

import useStyles from "./components/style";
import uploadIcon from "../../../../assets/images/uploadIcon.svg";
import {
  exportUserAPI,
  getUsersAPI,
  newUserAPI,
  updateUserAPI,
  removeUserAPI,
} from "./utils/usersAPIs";
import SingleUser from "./components/SingleUser";
import UserDetailsModal from "./components/UserDetailsModal";
import { enable2FA } from "../../../../store/actions";
import { TwoFactor } from "./components/SwitchStyles";
import { rTriggerNewUserDialog } from "../../../../store/actions/properties";
import { errorToastify, successToastify } from "../../../common/utils/Toastify";
import { DEBOUNCE_TIME } from "../../../common/utils/constants";
import useCustomQuery from "../../../common/utils/CustomQuery";
import useCustomMutation from "../../../common/utils/CustomMutation";
import { listNums } from "../../../common/utils/perPage";
import { mainNavigationUrls } from "../../../common/utils/lists";
import UploadDragDrop from "../../../common/components/UploadDragDrop";
import CustomConfirmBox from "../../../common/components/CustomConfirmBox/CustomConfirmBox";
import SkeletonCard from "../../components/SkeletonCard";
import ActivateUserPortalModal from "../../../common/components/ActivateUserPortalModal/ActivateUserPortalModal";
import { updateUserAccount } from "../../../common/components/Mutation/ProfileSetting/userMutations";
import { getAccountInfo } from "../SsoConfiguration/utils/ssoAccountsAPI";
import { PLUG_ROLES } from "../../../common/utils/userRoleEvaluation";
import { CUSTOM_PORTAL_QUERY_KEY } from "../Customizations/utils/customizationutils";
import { useQueryClient } from "react-query";
import ToggleUserPortalActivationButton from "./components/ToggleUserPortalActivationButton";

const UserManagement = ({ account }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { triggerNewUser } = useSelector(({ users }) => users);
  const { pageSearchText } = useSelector(({ reducers }) => reducers);
  const { user: userAccount } = useSelector(({ auth }) => auth);
  const userAccountId = userAccount?.account?.id;
  const [isLap, setIsLap] = useState(true);
  const [openBulkUserUploadDialog, setOpenBulkUserUploadDialog] =
    useState(false);
  const [isNewUserModalVisible, setIsNewUserModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [modalData, setModalData] = useState();
  const [allUsers, setAllUsers] = useState([]);
  const [perPageArr, setPerPageArr] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filters, setFilters] = useState({
    status: "All",
    role: "All",
    group: "All",
    search: "",
  });
  const [userGroups, setUserGroups] = useState([]);
  const [is2FAenabled, setIs2FAenabled] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [entries, setEntries] = useState(null);
  const [pageNo, setPageNo] = useState(1);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [unfilteredData, setUnfilteredData] = useState({ meta: {}, data: [] });
  const [filteredData, setFilteredData] = useState([]);
  const [show2faSwitchConfirmDialog, setShow2faSwitchConfirmDialog] =
    useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [userPortalLoading, setUserPortalLoading] = useState(false);
  const [activatePortalLookSuccess, setActivatePortalLookSuccess] =
    useState(false);
  const [activateUserPortalModal, setActivateUserPortalModal] = useState(false);
  const [userPortalEnabled, setUserPortalEnabled] = useState(false);
  const isPlugAdmin = userInfo?.roles?.includes(PLUG_ROLES.ROLE_PLUGADMIN);
  const queryClient = useQueryClient();

  useEffect(() => {
    handleSearchChange(pageSearchText);
  }, [pageSearchText]);

  useEffect(() => {
    document.title = "Settings | User Management";

    const uInfo = JSON.parse(localStorage.getItem("userInfo"));
    const {
      account: { twoFactorAuthEnabled },
    } = uInfo;

    setUserInfo(uInfo);
    setIs2FAenabled(!!twoFactorAuthEnabled);

    return () => {
      dispatch(rTriggerNewUserDialog(""));
    };
  }, []);

  useEffect(() => {
    const filtr = { ...filters };
    let srch = new RegExp(filtr.search.replace(/[^\w\s]/gi, ""), "gi");

    const filtered = allUsers.filter(
      (f) =>
        (filtr.status === "All" || f.active === (filtr.status === "Active")) &&
        (filtr.role === "All" || f.roles.indexOf(filtr.role) !== -1) &&
        (filtr.group === "All" || f.userGroups.indexOf(filtr.group) !== -1) &&
        (!srch ||
          (f.firstName && f.firstName.search(srch) !== -1) ||
          (f.lastName && f.lastName.search(srch) !== -1) ||
          (f.email && f.email.search(srch) !== -1))
    );

    setFilteredUsers(filtered);
  }, [allUsers, filters]);

  useEffect(() => {
    if (!!triggerNewUser) {
      handleModalOpen("add", "");
    }
  }, [triggerNewUser]);

  const userDebounceSearch = useRef(
    debounce(async (searchValue) => {
      if (!searchValue) {
        return;
      }

      setIsSearching(true);

      try {
        const valueSearch = await getUsersAPI({}, searchValue);
        const valueSearchData = valueSearch?.data;

        setFilteredUsers(valueSearchData);
      } catch (error) {
        setIsSearching(false);
        errorToastify(
          "An error occured. Please try searching again after a while."
        );
      } finally {
        setIsSearching(false);
      }
    }, DEBOUNCE_TIME)
  );

  const handleSearchChange = (input) => {
    userDebounceSearch.current(input);

    const filtered = !!input ? filteredUsers : allUsers;

    setFilteredUsers(filtered);
    setPerPage((prevValue) => prevValue);
    setPageNo((prevValue) => prevValue);
  };

  const _doFilter = (filt) => {
    let filtr = { ...filters, ...filt };
    setFilters(filtr);
  };

  const onGetUserSuccess = ({ data }) => {
    setAllUsers(data.data);
    setPerPage(data._meta.pagination.per_page);
    setEntries(data._meta.pagination.total_count);
  };

  const handleUserPortalActivationAndDeactivation = () => {
    setUserPortalLoading(true);
    userPortalTrigger({
      id: userAccountId,
      enableCustomPortal: !userPortalEnabled,
    });
  };

  const onGetAccountInfo = ({ data }) => {
    const isUserPortalEnabled = data?.data?.enableCustomPortal;
    setUserPortalEnabled(isUserPortalEnabled);
  };

  const onUserPortalAccountUpdateSuccess = ({ data }) => {
    queryClient.invalidateQueries(CUSTOM_PORTAL_QUERY_KEY);

    const isUserPortalEnabled = data?.data?.enableCustomPortal;
    setUserPortalEnabled(isUserPortalEnabled);

    setUserPortalLoading(false);

    if (isUserPortalEnabled) {
      setActivatePortalLookSuccess(true);
    } else {
      setActivatePortalLookSuccess(false);
    }

    successToastify(
      `User portal ${
        isUserPortalEnabled ? "Activated" : "Deactivated"
      } sucessfully`
    );
  };

  //fetch account info
  useCustomQuery({
    apiFunc: getAccountInfo,
    queryKey: ["userGroupAccountInfo"],
    onSuccess: onGetAccountInfo,
  });

  const options = {
    per_page: perPage,
    page: pageNo,
    query: {
      account,
    },
  };

  // fetch users
  const { isLoading } = useCustomQuery({
    queryKey: ["allUsers", options],
    apiFunc: () => exportUserAPI(options),
    onSuccess: onGetUserSuccess,
    enabled: !!perPage,
  });

  // update user account
  const { mutate: userPortalTrigger } = useCustomMutation({
    apiFunc: updateUserAccount,
    onSuccess: onUserPortalAccountUpdateSuccess,
    retries: 0,
  });

  const onGetUserGroupsSuccess = ({ data }) => {
    setUserGroups(data.data);
    // dispatch(rSaveUserGroups(data.data));
  };

  // fetch usergroups
  /* useCustomQuery({
    queryKey: "allUserGroups",
    apiFunc: getUserGroupsAPI,
    onSuccess: onGetUserGroupsSuccess,
  }); */

  // setUsersDetails(res.data.data)
  // setFilteredUsers(res.data.data)
  // setIsLoading(false)

  const onAddUserSuccess = ({ data }) => {
    setDialogLoading(true);
    successToastify(data?._meta?.message);

    const newData = {
      ...data?.data,
      id: data?.data?.id,
      status: "Inactive",
      addUser: true,
    };

    let updatedUsers = [...allUsers];

    updatedUsers.unshift(newData);
    setAllUsers(updatedUsers);

    setModalMode("add");
    setModalData("");
    setIsNewUserModalVisible(false);
  };

  const onUpdateUserSuccess = ({ data }) => {
    setDialogLoading(true);
    const dat = data?.data;

    const updatedUsers = allUsers.map((u) => {
      return u.id === dat.id ? data?.data : u;
    });

    setAllUsers(updatedUsers);

    setModalMode("add");
    setModalData("");
    setIsNewUserModalVisible(false);
  };

  const onDeleteUserSuccess = ({ data }) => {
    setDialogLoading(true);
    const dat = data?.data;

    const updatedUsers = allUsers.map((u) => {
      return u.id === dat.id ? data?.data : u;
    });

    setAllUsers(updatedUsers);

    // setFilteredUsers(data.data);
    // dispatch({ type: FETCH_SPECIFIED_SHEET, payload: data?.data });
    // alert('SUCCESS')

    setModalMode("add");
    setModalData("");
    setIsNewUserModalVisible(false);
  };

  const { mutate: addUser } = useCustomMutation({
    apiFunc: newUserAPI,
    onSuccess: onAddUserSuccess,
    onError: () => setDialogLoading(false),
    retries: 0,
  });

  const { mutate: updateUser } = useCustomMutation({
    apiFunc: updateUserAPI,
    onSuccess: onUpdateUserSuccess,
    onError: () => setDialogLoading(false),
    retries: 0,
  });

  const { mutate: deleteUser } = useCustomMutation({
    apiFunc: removeUserAPI,
    onSuccess: onDeleteUserSuccess,
    onError: () => setDialogLoading(false),
    retries: 0,
  });

  const handleChange = (lap) => {
    if (lap.isFinish) {
      setIsLap(false);
    }
  };

  const launchBulkUserUpload = () => {
    setOpenBulkUserUploadDialog(true);
  };
  const handleModalOpen = (mode, data) => {
    setModalMode(mode);
    setModalData(data);
    setDialogLoading(false);
    setIsNewUserModalVisible(true);
  };

  const _handleModalDone = ({ mode, data }) => {
    if (mode === "add") {
      data.redirectUrl = `${process.env.REACT_APP_BASE_URL}/create-password`;
      addUser({ data });
      setDialogLoading(true);
    } else if (mode === "update") {
      updateUser({ data });
      setDialogLoading(true);
    } else {
      //  just a normal close modal
      setModalMode("add");
      setModalData("");
      setIsNewUserModalVisible(false);
      setDialogLoading(false);
    }
  };

  const _switchStatus = (id, val) => {
    const data = { id, active: val };
    updateUser({ data });
  };

  const _doRemove = (itemId) => {};

  const _doNewUser = ({ info }) => {
    updateUser(info);
  };

  const _doUpdateUser = ({ info }) => {
    updateUser(info);
  };

  const switch2FA = async () => {
    const bool = !show2faSwitchConfirmDialog?.target?.checked;
    /* const conf = window?.confirm(
      `Turn ${bool ? "ON" : "OFF"} Two-Factor Authentication for all users?`
    );
    if (!conf) return; */
    const resp = await enable2FA(bool, userInfo?.account?.id);
    if (resp?._meta.success) {
      setIs2FAenabled(bool);
      const updatedUserInfo = {
        ...userInfo,
        account: { ...userInfo.account, twoFactorAuthEnabled: bool },
      };
      setUserInfo(updatedUserInfo);
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
      successToastify(`2FA successfully turned ${bool ? "ON" : "OFF"}`);
    } else {
      errorToastify("Unable to switch 2FA status, please try again later.");
    }
  };

  const handlePageChange = (e) => {
    if (e.target.value) {
      setPageNo(e.target.value);
    }
  };
  useEffect(() => {
    if (entries) setPerPageArr(listNums(entries));
  }, [entries]);

  return !isLoading ? (
    <div className={[classes.paddingLeft50]}>
      <Grid container>
        <Grid
          container
          item
          sm={12}
          xs={12}
          className={classes.bottomMargin20}
          spacing={3}
        >
          <Grid
            container
            item
            justifyContent="flex-end"
            spacing={2}
            style={{ marginTop: 10, marginBottom: 10, alignItems: "center" }}
          >
            <div
              style={{
                // marginRight: "auto",
                display: "flex",
                alignItems: "center",
                marginLeft: 9,
                marginRight: 9,
                borderRadius: 5,
                border: "inset 1px #eee",
                backgroundColor: "#fbfbfb",
                height: 40,
                flex: 1,
              }}
            >
              <FormControlLabel
                classes={{
                  root: classes.switchLabel,
                  label: classes.sectionTitle,
                }}
                control={
                  <TwoFactor
                    checked={is2FAenabled}
                    onChange={(e) => {
                      e.persist();
                      // e.preventDefault();
                      setShow2faSwitchConfirmDialog(e);
                    }}
                    name="checkedC"
                    color="primary"
                    //size="small"
                  />
                }
                label="Two-factor authentication for organization"
                labelPlacement="end"
              />
            </div>
            {/* <Grid item>
              <FormControl>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleModalOpen("add", "")}
                  classes={{
                    root: classes.customButton,
                    label: classes.customButtonLabel,
                  }}
                >
                  + New User
                </Button>
              </FormControl>
            </Grid> */}

            <Grid item data-testid="toggle-user-portal">
              <ToggleUserPortalActivationButton
                isUserPortalEnabled={userPortalEnabled}
                buttonClassName={classes.userPortalButton}
                userPortalLoading={userPortalLoading}
                showActivateUserPortalModal={setActivateUserPortalModal}
                toggleUserPortalActivationAndDeactivation={
                  handleUserPortalActivationAndDeactivation
                }
              />
            </Grid>

            <Grid item className={classes.bottomMargin20}>
              <FormControl>
                <Link
                  to={mainNavigationUrls.USER_GROUPS}
                  style={{ textDecoration: "none" }}
                >
                  {/* <Button classes={{ root: classes.customInvertedButton, label: classes.customInvertedButtonLabel }}> */}
                  <Button
                    classes={{
                      root: classes.customButton,
                      label: classes.customButtonLabel,
                    }}
                  >
                    User Groups
                  </Button>
                </Link>
              </FormControl>
            </Grid>
            <Grid item>
              <ListItemIcon
                className={classes.iconButton}
                onClick={() => launchBulkUserUpload()}
              >
                <img src={uploadIcon} alt="uploadIcon" />
              </ListItemIcon>
            </Grid>
          </Grid>
        </Grid>

        {/* here for the main area and contents */}
        <Grid
          container
          item
          sm={12}
          xs={12}
          spacing={3}
          className={classes.topMargin0}
        >
          <Grid item sm={12} xs={12} style={{ overflowX: "auto" }}>
            <List className={classes.root} style={{ minWidth: 700 }}>
              <li className={classes.listSection}>
                <ul className={classes.ul}>
                  <ListSubheader
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "#FFFFFF",
                      padding: "10px 0",
                      marginBottom: 2,
                    }}
                  >
                    {/* <ListItemText
                      style={{ flex: 1 }}
                      primary={
                        <Checkbox
                          color="primary"
                          size="small"
                          inputProps={{ "aria-label": "secondary checkbox" }}
                        />
                      }
                    /> */}
                    <ListItemText
                      style={{ flex: 2.5 }}
                      primary={
                        <Typography
                          variant="h6"
                          style={{ fontWeight: 400, fontSize: 12 }}
                        >
                          First name
                        </Typography>
                      }
                    />
                    <ListItemText
                      style={{ flex: 2.5 }}
                      primary={
                        <Typography
                          variant="h6"
                          style={{ fontWeight: 400, fontSize: 12 }}
                        >
                          Last name
                        </Typography>
                      }
                    />
                    <ListItemText
                      style={{ flex: 4.5 }}
                      primary={
                        <Typography
                          variant="h6"
                          style={{ fontWeight: 400, fontSize: 12 }}
                        >
                          Email
                        </Typography>
                      }
                    />
                    <ListItemText
                      style={{ flex: 3 }}
                      primary={
                        <Typography
                          variant="h6"
                          style={{ fontWeight: 400, fontSize: 12 }}
                        >
                          Roles
                        </Typography>
                      }
                    />
                    <ListItemText
                      style={{ flex: 3 }}
                      primary={
                        <Typography
                          variant="h6"
                          style={{ fontWeight: 400, fontSize: 12 }}
                        >
                          User groups
                        </Typography>
                      }
                    />
                    <ListItemText
                      style={{ flex: 2 }}
                      primary={
                        <Typography
                          variant="h6"
                          style={{
                            fontWeight: 400,
                            fontSize: 12,
                            textAlign: "center",
                          }}
                        >
                          Status
                        </Typography>
                      }
                    />
                    <ListItemText
                      style={{ flex: 2 }}
                      primary={
                        <Typography
                          variant="h6"
                          style={{
                            fontWeight: 400,
                            fontSize: 12,
                            textAlign: "center",
                          }}
                        >
                          Actions
                        </Typography>
                      }
                    />
                  </ListSubheader>
                  {isSearching ? (
                    <div className={classes.noRecord}>
                      <Typography>
                        Searching. Please Wait...
                        <img
                          src="../../../images/loading-anim.svg"
                          alt="Clone"
                          width={20}
                        />
                      </Typography>
                    </div>
                  ) : (
                    <>
                      {filteredUsers?.map((item, index) => (
                        <SingleUser
                          key={index}
                          item={item}
                          handleModalOpen={handleModalOpen}
                          doRemove={_doRemove}
                          switchStatus={(v) => _switchStatus(item.id, v)}
                          userGroups={userGroups}
                        />
                      ))}
                      {!filteredUsers?.length && (
                        <div className={classes.noRecord}>
                          <Typography>No users created yet.</Typography>
                        </div>
                      )}
                    </>
                  )}
                </ul>
                {!!filteredUsers?.length && (
                  <Grid
                    container
                    style={{
                      paddingTop: 20,
                      paddingBottom: 20,
                      visibility: "visible",
                    }}
                    spacing={2}
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                  >
                    {!!perPageArr?.length && (
                      <Grid item>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography>Rows per page:</Typography>
                          <FormControl className="perpage-dropdown">
                            <Select
                              className={classes.perPageInput}
                              defaultValue={perPage}
                              style={{
                                marginLeft: "0px",
                                marginRight: "6px",
                              }}
                              onChange={(e) => {
                                setPerPage(e.target.value);
                              }}
                              displayEmpty
                              native
                              inputProps={{
                                "aria-label": "Without label",
                                disableUnderline: true,
                              }}
                            >
                              {perPageArr?.map((num) => (
                                <option
                                  style={{
                                    borderBottom: "0 !important",
                                    marginLeft: "6px",
                                  }}
                                  key={num}
                                  value={num}
                                >
                                  {num}
                                </option>
                              ))}
                            </Select>
                          </FormControl>
                        </div>
                      </Grid>
                    )}
                    <Grid item>
                      <Typography>{entries} entries. </Typography>
                    </Grid>
                    <Grid item>
                      <Typography>Showing</Typography>
                    </Grid>
                    <Grid item style={{ width: 80 }}>
                      <TextField
                        id="outlined-password-input"
                        type="number"
                        autoComplete="current-password"
                        variant="outlined"
                        size="small"
                        InputProps={{
                          inputProps: {
                            min: 1,
                            max: Math.ceil(entries / perPage),
                          },
                        }}
                        defaultValue={pageNo}
                        onChange={(e) => handlePageChange(e)}
                      />
                    </Grid>
                    <Grid item>
                      <Typography>
                        of {Math.ceil(entries / perPage)} pages
                      </Typography>
                    </Grid>
                  </Grid>
                )}
              </li>
            </List>
          </Grid>
        </Grid>
      </Grid>
      {/* <UserDetailsModal show={isNewUserModalVisible} /> */}
      <div>
        {isNewUserModalVisible && (
          <UserDetailsModal
            closeModal={_handleModalDone}
            mode={modalMode}
            data={modalData}
            // userGroups={userGroups}
            dialogLoading={dialogLoading}
          />
        )}
      </div>
      <div>
        {!!activateUserPortalModal && (
          <ActivateUserPortalModal
            openModal={activateUserPortalModal}
            setOpenModal={setActivateUserPortalModal}
            onHandleActivateUserPortal={
              handleUserPortalActivationAndDeactivation
            }
            userPortalLoading={userPortalLoading}
            activatePortalLookSuccess={activatePortalLookSuccess}
          />
        )}
      </div>
      <div>
        {openBulkUserUploadDialog && (
          <UploadDragDrop
            setOpenUploadDragDrop={setOpenBulkUserUploadDialog}
            openUploadDragDrop={openBulkUserUploadDialog}
            updateKey={"allUsers"}
          />
        )}
      </div>
      {show2faSwitchConfirmDialog && (
        <CustomConfirmBox
          closeConfirmBox={() => setShow2faSwitchConfirmDialog("")}
          text={`Turn ${
            show2faSwitchConfirmDialog?.target?.checked ? "ON" : "OFF"
          } two-factor authentication for all users?`}
          open={!!show2faSwitchConfirmDialog}
          confirmAction={() => switch2FA()}
        />
      )}
    </div>
  ) : (
    <div>
      {isLap ? (
        <div className={classes.loadingPage}>
          <ReactSpinnerTimer
            timeInSeconds={3}
            totalLaps={1}
            isRefresh={false}
            onLapInteraction={handleChange}
          />
        </div>
      ) : (
        <SkeletonCard />
      )}
    </div>
  );
};

export default UserManagement;
