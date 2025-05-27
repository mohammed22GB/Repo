import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  Typography,
  FormControl,
  List,
  TextField,
  ListSubheader,
  ListItemText,
} from "@material-ui/core";
import Select from "@material-ui/core/Select";
import ReactSpinnerTimer from "react-spinner-timer";

import useStyles from "./components/style";
import {
  getAppCategoryAPI,
  newAppCategoryAPI,
  updateAppCategoryAPI,
  removeAppCategoryAPI,
} from "./utils/appCategoryAPIs";
import SingleAppCategory from "./components/SingleAppCategory";
import NewAppCategoryModal from "./components/NewAppCategoryModal";
import { rTriggerNewCategoryDialog } from "../../../../store/actions/properties";
import useCustomQuery from "../../../common/utils/CustomQuery";
import useCustomMutation from "../../../common/utils/CustomMutation";
import { listNums } from "../../../common/utils/perPage";
import {
  getUserRole,
  userManagementPermission,
} from "../../../common/utils/userRoleEvaluation";

const AppCategory = () => {
  const dispatch = useDispatch();
  const { triggerNewCategory } = useSelector(({ users }) => users);

  const [isLap, setIsLap] = useState(true);
  const [modalMode, setModalMode] = useState("add");
  const [modalData, setModalData] = useState();
  const [isNewAppCategoryModalVisible, setIsNewAppCategoryModalVisible] =
    useState(false);
  const [newAdds, setNewAdds] = useState([]);
  const [allAppCategories, setAllAppCategories] = useState([]);
  const [filteredAppCategories, setFilteredAppCategories] = useState([]);
  const [filters, setFilters] = useState({
    status: "All",
    search: "",
    name: "All",
  });
  const [entries, setEntries] = useState(0);
  const [userGroups, setUserGroups] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [perPageArr, setPerPageArr] = useState([]);
  const [perPage, setPerPage] = useState(10);

  const { pageSearchText } = useSelector(({ reducers }) => reducers);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const classes = useStyles(); // ok

  useEffect(() => {
    document.title = "Settings | App Category";
  }, []);

  useEffect(() => {
    return () => {
      dispatch(rTriggerNewCategoryDialog(""));
    };
  }, []);

  useEffect(() => {
    if (!!triggerNewCategory) {
      handleModalOpen("add", "");
    }
  }, [triggerNewCategory]);

  useEffect(() => {
    handleSearchChange(pageSearchText);
  }, [pageSearchText]);

  const handleSearchChange = (input) => {
    setSearchPerformed(!!input);

    const searchedAppCategories = !!input
      ? allAppCategories.filter((data) =>
          data.name?.toLowerCase().includes(input?.toLowerCase())
        )
      : allAppCategories;

    setFilteredAppCategories(searchedAppCategories);
  };

  useEffect(() => {
    const filtr = { ...filters };
    let srch = new RegExp(filtr.search.replace(/[^\w\s]/gi, ""), "gi");

    const filtered = allAppCategories.filter(
      (f) =>
        (filtr.status === "All" || f.active === (filtr.status === "Active")) &&
        (!srch || (f.name && f.name.search(srch) !== -1)) &&
        (filtr.name === "All" || f.name === filtr.name)
    );

    setFilteredAppCategories(filtered);
  }, [allAppCategories, filters]);

  const onGetAppCategorySuccess = ({ data }) => {
    setAllAppCategories(data.data);
    setPerPage(data._meta.pagination.per_page);
    setEntries(data._meta.pagination.total_count);
  };

  // fetch usergroups
  const options = {
    query: {
      // population: ["users"],
      population: [{ path: "categories", select: "id name" }],
    },
  };
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userID = userInfo?.account;
  const { isLoading, isFetching } = useCustomQuery({
    queryKey: ["allAppCategories", options, userID?.id, { perPage }],
    apiFunc: getAppCategoryAPI,
    onSuccess: onGetAppCategorySuccess,
    enabled: !!perPage,
  });

  const onAddAppCategorySuccess = ({ data }) => {
    const newData = {
      ...data.data,
      id: data.data.id,
      status: "Inactive",
    };

    let updatedGroups = [...allAppCategories];

    updatedGroups.unshift(newData);
    setAllAppCategories(updatedGroups);

    setModalMode("add");
    setModalData("");
    setIsNewAppCategoryModalVisible(false);
    setEntries((prev) => prev + 1);
  };

  const onUpdateAppCategorySuccess = ({ data }) => {
    const dat = data?.data;

    const updatedUserGroups = allAppCategories.map((u) => {
      return u.id === dat.id ? data.data : u;
    });

    setAllAppCategories(updatedUserGroups);

    setModalMode("add");
    setModalData("");
    setIsNewAppCategoryModalVisible(false);
  };

  const onDeleteAppCategorySuccess = ({ data }) => {
    const dat = data?.data;

    const updatedUserGroups = allAppCategories.filter((g) => g.id !== dat._id);

    setAllAppCategories(updatedUserGroups);

    setModalMode("add");
    setModalData("");
    setIsNewAppCategoryModalVisible(false);
    setEntries((prev) => prev - 1);
  };
  const onDeleteAppCategoryError = ({ error }) => {
    return error;
  };

  const { mutate: addAppCategory } = useCustomMutation({
    apiFunc: newAppCategoryAPI,
    onSuccess: onAddAppCategorySuccess,
    retries: 0,
  });

  const { mutate: updateAppCategory } = useCustomMutation({
    apiFunc: updateAppCategoryAPI,
    onSuccess: onUpdateAppCategorySuccess,
    retries: 0,
  });

  const { mutate: deleteAppCategory } = useCustomMutation({
    apiFunc: removeAppCategoryAPI,
    onSuccess: onDeleteAppCategorySuccess,
    onError: onDeleteAppCategoryError,
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

  const _handleModalDone = ({ mode, data }) => {
    setModalData(data);

    if (mode === "add") {
      addAppCategory({ data });
    } else if (mode === "update") {
      updateAppCategory({ data });
    } else {
      //  just a normal close modal
      setModalMode("add");
      setModalData("");
      setIsNewAppCategoryModalVisible(false);
    }
  };

  const _deleteMe = (id) => {
    deleteAppCategory({ id });
  };

  const handleModalOpen = (mode, data) => {
    setModalMode(mode);
    setModalData(data);
    setIsNewAppCategoryModalVisible(true);
    return;
  };
  const _doRemove = () => {
    return;
  };

  const handlePageChange = (e) => {
    if (e.target.value) {
      setPageNo(e.target.value);
    }
  };
  useEffect(() => {
    if (entries) setPerPageArr(listNums(entries));
  }, [entries]);
  return (
    <div style={{ width: "100%" }}>
      {/* here for the filter and search bar */}
      {/* <Grid
        container
        item
        sm={12}
        xs={12}
        justifyContent="space-between"
        spacing={3}
      >
        <Grid item sm={7} xs={7}>
          <FilterButtons
            filters={filters}
            doFilter={_doFilter}
            appCategories={allAppCategories}
          />
        </Grid>
        <Grid item sm={5} xs={5}>
          <ActionSearchBar doFilter={_doFilter} />
        </Grid>
      </Grid> */}

      {/* here for the main area and contents */}
      <Grid
        container
        item
        sm={12}
        xs={12}
        spacing={3}
        className={classes.topMargin0}
      >
        <Grid item sm={12} xs={12}>
          <List className={classes.root}>
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
                  <ListItemText
                    style={{ flex: 1.5 }}
                    primary={
                      <Typography
                        variant="h6"
                        style={{ fontWeight: 700, fontSize: "0.9em" }}
                      >
                        Category name
                      </Typography>
                    }
                  />
                  {/* <ListItemText
                    style={{ flex: 1 }}
                    primary={
                      <Typography
                        variant="h6"
                        style={{ fontWeight: 700, fontSize: "0.9em" }}
                      >
                        Created by
                      </Typography>
                    }
                  /> */}
                  <ListItemText
                    style={{ flex: 1.5 }}
                    primary={
                      <Typography
                        variant="h6"
                        style={{ fontWeight: 700, fontSize: "0.9em" }}
                      >
                        Date created
                      </Typography>
                    }
                  />
                  <ListItemText
                    style={{ flex: 1.2 }}
                    primary={
                      <Typography
                        variant="h6"
                        style={{ fontWeight: 700, fontSize: "0.9em" }}
                      >
                        Color
                      </Typography>
                    }
                  />
                  {userManagementPermission(getUserRole()) && (
                    <ListItemText
                      style={{ flex: 0.5 }}
                      primary={
                        <Typography
                          variant="h6"
                          style={{ fontWeight: 700, fontSize: "0.9em" }}
                        >
                          Actions
                        </Typography>
                      }
                    />
                  )}
                </ListSubheader>
                {!isLoading && !isFetching ? (
                  <>
                    {!!filteredAppCategories?.length &&
                      filteredAppCategories.map((item, index) => (
                        <SingleAppCategory
                          key={item.id}
                          data={item}
                          actions={true}
                          handleModalOpen={handleModalOpen}
                          //doRemove={_doRemove}
                          //switchStatus={(v) => _switchStatus(item.id, v)}
                          //userGroups={userGroups}
                          deleteMe={() => _deleteMe(item.id)}
                          deleteErr={onDeleteAppCategoryError}
                        />
                      ))}
                  </>
                ) : (
                  <>
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
                      <div className={classes.noRecord}>
                        <Typography>No categories created yet.</Typography>
                      </div>
                    )}
                  </>
                )}
                {/* {!filteredAppCategories.length && (
                  <div className={classes.noRecord}>
                    <Typography>No users created yet.</Typography>
                  </div>
                )} */}

                {searchPerformed && !filteredAppCategories?.length && (
                  <div className={classes.noRecord}>
                    <Typography>No such App category created yet.</Typography>
                  </div>
                )}
              </ul>
              {filteredAppCategories.length !== 0 && entries >= perPage && (
                <Grid
                  container
                  style={{
                    paddingTop: 36,
                    paddingBottom: 20,
                    visibility: "visible",
                  }}
                  spacing={2}
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  {!!perPageArr.length && (
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
                            defaultValue={10}
                            style={{
                              marginLeft: "0px",
                              marginRight: "6px",
                            }}
                            onChange={(e) => {
                              setPerPage(e.target.value);
                            }}
                            displayEmpty
                            native
                            //className={classes.null}
                            inputProps={{
                              "aria-label": "Without label",
                              disableUnderline: true,
                            }}
                          >
                            {perPageArr.map((num) => (
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
                      of {Math.ceil(entries / perPage)}{" "}
                      {entries / perPage > 1 ? "pages" : "page"}
                    </Typography>
                  </Grid>
                </Grid>
              )}
              {/* <Grid
                  container
                  style={{
                    paddingTop: 20,
                    paddingBottom: 20,
                    //visibility: "hidden",
                  }}
                  spacing={2}
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <Grid item>
                    <Typography>Showing </Typography>
                  </Grid>
                  <Grid item style={{ width: 100 }}>
                    <TextField
                      id="outlined-password-input"
                      type="number"
                      autoComplete="current-password"
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item>
                    <Typography>entries </Typography>
                  </Grid>
                </Grid> */}
            </li>
          </List>
        </Grid>
      </Grid>

      {isNewAppCategoryModalVisible && (
        // <NewAppCategoryModal closeModal={() =>setIsNewAppCategoryModalVisible(false)} saveNewUserGroup={_handleSaveNewUserGroup} />
        <NewAppCategoryModal
          closeModal={_handleModalDone}
          mode={modalMode}
          data={modalData}
        />
      )}

      {/* { isRolePermissionsVisible && rolePermissionsData &&
        <RolePermissions showModal={setIsRolePermissionsVisible} item={ activeRole } data={ rolePermissionsData } /> 
      }
      { isRoleUsersVisible && roleUsersData &&
        <RoleUsers showModal={setIsRoleUsersVisible} item={ activeRole } data={ roleUsersData } /> 
      } */}
      {/* {!isLoading && !isFetching ? (
        <></>
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
      )} */}
    </div>
  );
};

export default AppCategory;
