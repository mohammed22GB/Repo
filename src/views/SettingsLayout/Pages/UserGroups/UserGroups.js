import { useState, useEffect, useRef } from "react";
import {
  Grid,
  Typography,
  TextField,
  Select,
  FormControl,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import ReactSpinnerTimer from "react-spinner-timer";

import useStyles from "./components/style";
import {
  getUserGroupsAPI,
  newUserGroupAPI,
  updateUserGroupAPI,
  removeUserGroupAPI,
} from "./utils/usergroupsAPIs";
import NewUserGroupModal from "./components/NewUserGroupModal";
import { rTriggerNewUserGroupDialog } from "../../../../store/actions/properties";
import useCustomQuery from "../../../common/utils/CustomQuery";
import useCustomMutation from "../../../common/utils/CustomMutation";
import SkeletonCard from "../../components/SkeletonCard";
import { listNums } from "../../../common/utils/perPage";
import { debounce } from "lodash";
import { DEBOUNCE_TIME } from "../../../common/utils/constants";
import { errorToastify, successToastify } from "../../../common/utils/Toastify";
import UserGroupCardbox from "./components/UserGroupCardbox";
import { userGroupTypes } from "./utils/usergrouputils";

const UserGroups = () => {
  const dispatch = useDispatch();
  const { triggerNewUserGroup } = useSelector(({ users }) => users);
  const { pageSearchText } = useSelector(({ reducers }) => reducers);

  const [isLap, setIsLap] = useState(true);
  const [modalMode, setModalMode] = useState("add");
  const [modalData, setModalData] = useState();
  const [isNewUserGroupModalVisible, setIsNewUserGroupModalVisible] =
    useState(false);
  const [newAdds, setNewAdds] = useState([]);
  const [allUserGroups, setAllUserGroups] = useState([]);
  const [showSelectUserGroupType, setShowSelectUserGroupType] = useState(false);
  const [modalUserGroupType, setModalUserGroupType] = useState("");
  const [filteredUserGroups, setFilteredUserGroups] = useState([]);
  const [filters, setFilters] = useState({ status: "All", search: "" });
  const [perPageArr, setPerPageArr] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [pageNo, setPageNo] = useState(1);
  const [entries, setEntries] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const classes = useStyles(); // ok

  const userGroupDebounceSearch = useRef(
    debounce(async (searchValue) => {
      if (!searchValue) {
        return;
      }

      setIsSearching(true);

      try {
        const valueSearch = await getUserGroupsAPI(null, searchValue);
        const valueSearchData = valueSearch?.data;

        setFilteredUserGroups(valueSearchData);
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

  useEffect(() => {
    handleSearchChange(pageSearchText);
  }, [pageSearchText]);

  useEffect(() => {
    document.title = "Settings | User Groups";

    return () => {
      dispatch(rTriggerNewUserGroupDialog(""));
    };
  }, []);

  useEffect(() => {
    const filtr = { ...filters };
    let srch = new RegExp(filtr.search.replace(/[^\w\s]/gi, ""), "gi");
    const filtered = allUserGroups.filter(
      (f) =>
        (filtr.status === "All" || f.active === (filtr.status === "Active")) &&
        (!srch || (f.name && f.name.search(srch) !== -1))
    );

    setFilteredUserGroups(filtered);
  }, [allUserGroups, filters]);

  useEffect(() => {
    if (!!triggerNewUserGroup) {
      setIsNewUserGroupModalVisible(true);
      setShowSelectUserGroupType(true);

      setModalUserGroupType("");
    }
  }, [triggerNewUserGroup]);

  const onGetUserGroupsSuccess = ({ data }) => {
    setAllUserGroups(data?.data);
    setPerPage(data?._meta?.pagination?.per_page);
    setEntries(data?._meta?.pagination?.total_count);
  };

  // fetch usergroups
  const options = {
    query: {
      // population: ["users"],
      population: [{ path: "users", select: "id firstName lastName" }],
    },
  };
  const { isLoading, isFetching } = useCustomQuery({
    queryKey: ["allUserGroups", options, perPage, pageNo],
    apiFunc: getUserGroupsAPI,
    onSuccess: onGetUserGroupsSuccess,
    enabled: !!perPage,
  });

  const onAddUserGroupSuccess = ({ data }) => {
    const newData = {
      ...data.data,
      id: data.data.id,
      status: "Inactive",
    };

    let updatedGroups = [...allUserGroups];

    updatedGroups.unshift(newData);
    setAllUserGroups(updatedGroups);

    setModalMode("add");
    setModalData("");
    setIsNewUserGroupModalVisible(false);
    successToastify("User group successfully created.");
  };

  const onAddUserGroupError = () => {
    errorToastify("Failed to create user group. Please try again.");
  };

  const onUpdateUserGroupSuccess = ({ data }) => {
    const dat = data?.data;

    const updatedUserGroups = allUserGroups.filter((u) => {
      return u.id === dat.id ? data.data : u;
    });

    setAllUserGroups(updatedUserGroups);

    // setFilteredUsers(data.data);
    // dispatch({ type: FETCH_SPECIFIED_SHEET, payload: data?.data });
    // alert('SUCCESS')

    setModalMode("add");
    setModalData("");
    setIsNewUserGroupModalVisible(false);
  };

  const onDeleteUserGroupSuccess = ({ data }) => {
    const dat = data?.data;

    const updatedUserGroups = allUserGroups.filter((g) => g.id !== dat._id);

    setAllUserGroups(updatedUserGroups);

    // setFilteredUsers(data.data);
    // dispatch({ type: FETCH_SPECIFIED_SHEET, payload: data?.data });
    // alert('SUCCESS')

    setModalMode("add");
    setModalData("");
    setIsNewUserGroupModalVisible(false);
    successToastify("User group successfully deleted.");
  };

  const onDeleteUserFromUserGroupError = () => {
    errorToastify("User successfully removed from the group.");
  };

  const { mutate: addUserGroup } = useCustomMutation({
    apiFunc: newUserGroupAPI,
    onSuccess: onAddUserGroupSuccess,
    retries: 0,
    // error: onAddUserGroupError,
  });

  const { mutate: updateUserGroup } = useCustomMutation({
    apiFunc: updateUserGroupAPI,
    onSuccess: onUpdateUserGroupSuccess,
    retries: 0,
  });

  const { mutate: deleteUserGroup } = useCustomMutation({
    apiFunc: removeUserGroupAPI,
    onSuccess: onDeleteUserGroupSuccess,
    retries: 0,
  });

  const _doFilter = (filt) => {
    let filtr = { ...filters, ...filt };
    setFilters(filtr);
  };

  const handleChange = (lap) => {
    if (lap.isFinish) {
      setIsLap(false);
    }
  };

  const handlePageChange = (e) => {
    if (e.target.value) {
      setPageNo(e.target.value);
    }
  };

  const handleSearchChange = (input) => {
    userGroupDebounceSearch.current(input);

    const filtered = !!input ? filteredUserGroups : allUserGroups;

    setFilteredUserGroups(filtered);
    setPerPage((prevValue) => prevValue);
    setPageNo((prevValue) => prevValue);
  };

  const _handleSaveNewUserGroup = async (info) => {
    const resp = { status: "failed" }; // await handleUserGroupActions(info, 'add');
    if (resp.status === "success") {
      info.id = resp.data.id;
      const upd = newAdds;
      upd.unshift(info);
      setNewAdds(upd);
      setIsNewUserGroupModalVisible(false);
    }
  };

  const _handleModalDone = ({ mode, data }) => {
    if (mode === "add") {
      addUserGroup({ data });
    } else if (mode === "update") {
      updateUserGroup({ data });
    } else {
      //  just a normal close modal
      setModalMode("add");
      setModalData("");
      setModalUserGroupType("");
      setIsNewUserGroupModalVisible(false);
    }
  };

  const _deleteMe = (id) => {
    deleteUserGroup({ id });
  };

  useEffect(() => {
    if (entries) setPerPageArr(listNums(entries));
  }, [entries]);

  const handleUserGroupCardBoxModal = (isFunctional) => {
    setShowSelectUserGroupType(false);
    setIsNewUserGroupModalVisible(true);
    setModalUserGroupType(isFunctional);
  };

  return !isLoading && !isFetching ? (
    <div style={{ width: "100%" }}>
      <Grid container item xs={12} sm={12} direction="row" spacing={3}>
        {isSearching ? (
          <div className={classes.noRecord}>
            <Typography>
              Searching. Please wait...
              <img
                src="../../../images/loading-anim.svg"
                alt="Clone"
                width={20}
              />
            </Typography>
          </div>
        ) : (
          <>
            <div className={classes.gridBox}>
              <UserGroupCardbox
                userGroupCardTitle="Departments/Units"
                userGroupCardDescription="Members can only belong to one department or unit"
                userGroup={filteredUserGroups?.filter(
                  (userGroup) => userGroup?.type === userGroupTypes.functional
                )}
                userGroupType={userGroupTypes.functional}
                deleteUserGroup={_deleteMe}
                functionalStatus={() =>
                  handleUserGroupCardBoxModal(userGroupTypes.functional)
                }
              />

              <UserGroupCardbox
                userGroupCardTitle="User Groups"
                userGroupCardDescription="Ad-hoc or special purpose groups. Members can belong to multiple."
                userGroup={filteredUserGroups?.filter(
                  (userGroup) => userGroup?.type !== userGroupTypes.functional
                )}
                userGroupType={userGroupTypes.generic}
                deleteUserGroup={_deleteMe}
                functionalStatus={() =>
                  handleUserGroupCardBoxModal(userGroupTypes.generic)
                }
              />
            </div>

            {!!filteredUserGroups?.length && (
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
          </>
        )}
      </Grid>

      {isNewUserGroupModalVisible && (
        // <NewUserGroupModal closeModal={() =>setIsNewUserGroupModalVisible(false)} saveNewUserGroup={_handleSaveNewUserGroup} />
        <NewUserGroupModal
          closeModal={_handleModalDone}
          mode={modalMode}
          showSelectUserGroupType={showSelectUserGroupType}
          userGroupType={modalUserGroupType}
        />
      )}

      {/* { isRolePermissionsVisible && rolePermissionsData &&
        <RolePermissions showModal={setIsRolePermissionsVisible} item={ activeRole } data={ rolePermissionsData } /> 
      }
      { isRoleUsersVisible && roleUsersData &&
        <RoleUsers showModal={setIsRoleUsersVisible} item={ activeRole } data={ roleUsersData } /> 
      } */}
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

export default UserGroups;
