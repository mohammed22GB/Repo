import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Grid,
  List,
  ListItemText,
  ListSubheader,
  TextField,
  Typography,
} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import {
  getflowInstanceStatus,
  filterWorkFlowInstance,
  getWorkflowInstances,
} from "./AnalyticsApis";
import { debounce } from "lodash";

import SingleWorkflow from "./component/SingleWorkflow";
import useStyles from "./component/style";
import { getAppCategoryAPI } from "../SettingsLayout/Pages/AppCategory/utils/appCategoryAPIs";
import { APPS_CONTROL_MODES } from "../EditorLayout/Pages/Workflow/components/utils/constants";
import { mainNavigationListNames } from "../common/utils/lists";
import MainPageLayout from "../common/components/AppLayout/MainPageLayout";
import { listNums } from "../common/utils/perPage";
import useCustomQuery from "../common/utils/CustomQuery";
import { PLUG_ROLES } from "../common/utils/userRoleEvaluation";

const Analytics = () => {
  const classes = useStyles();
  const { pageSearchText } = useSelector(({ reducers }) => reducers);

  const [filters, setFilters] = useState({
    status: "All",
    //app: "All",
    category: "All",
    search: "",
    sortBy: "Modified",
  });
  const statuses = [
    ["All", "All Status"],
    ["completed", "Completed"],
    ["in-progress", "In Progress"],
    ["pending", "Pending"],
    ["stopped", "Stopped"],
  ];

  const categories = [["All", "All Categories"]];

  const sortBy = [["Modified", "Last modified"]];

  let filter1 = [
    {
      key: "status",
      status: filters.status,
      options: statuses,
    },
    // {
    //   key: "app",
    //   app: filters.app,
    //   options: apps,
    // },
    {
      key: "category",
      category: filters.category,
      options: categories,
    },
  ];

  const filter2 = [
    {
      key: "sortBy",
      sortBy: filters.sortBy,
      options: sortBy,
    },
  ];
  const [filteredData, setFilteredData] = useState([]);
  const [apps, setApps] = useState([["All", APPS_CONTROL_MODES.APP]]);
  const [unfilteredData, setUnfilteredData] = useState({ meta: {}, data: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [entries, setEntries] = useState(null);
  const [perPageArr, setPerPageArr] = useState([]);
  const [filterSelect, setFilterSelect] = useState(filter1);
  const [perPage, setPerPage] = useState(10);
  const [pageNo, setPageNo] = useState(1);
  const [pageLimit, setPageLimit] = useState(null);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const isAdmin = userInfo?.roles?.includes(PLUG_ROLES.ROLE_ADMIN);
  const isUserGroupAdmin = userInfo?.roles?.includes(
    PLUG_ROLES.ROLE_USERGROUPADMIN
  );

  useEffect(() => {
    handleSearchChange(pageSearchText);
  }, [pageSearchText]);

  const handleSearchChange = (input) => {
    const rows = !!input
      ? unfilteredData?.data?.filter(
          (row) =>
            row?.app?.name.toLowerCase().includes(input.toLowerCase()) ||
            row?.app?.category?.name
              .toLowerCase()
              .includes(input.toLowerCase()) ||
            row?.user?.firstName.toLowerCase().includes(input.toLowerCase()) ||
            row?.user?.lastName.toLowerCase().includes(input.toLowerCase()) ||
            row?.status?.toLowerCase().includes(input.toLowerCase())
        )
      : unfilteredData?.data;
    setFilteredData(rows);
  };

  const fetchFilterData = async ({ dataStatus, category, appName }) => {
    const { data, success } = await filterWorkFlowInstance({
      page: 1,
      status: dataStatus,
      category,
      appName,
      perPage,
    });

    const userData = data?.data;
    setFilteredData(userData);
    // }

    //setPageLimit(Math.round(data.data.length / 10));

    const statusData = await getflowInstanceStatus();
    dataStatus === "All"
      ? setPageLimit(Math.round(statusData?.data?.total / 10))
      : setPageLimit(Math.round(statusData?.data?.[dataStatus] / 10));

    dataStatus === "All"
      ? setEntries(statusData.data?.total)
      : setEntries(statusData.data?.[dataStatus]);
  };

  const _doFilter = (fil) => {
    const key = Object.keys(fil)[0];
    const value = Object.values(fil)[0];
    let filtr = { ...filters, ...fil };

    const newFilterSelect = filterSelect.map((data) => {
      if (data?.key === key) {
        data[key] = value;
      }
      return data;
    });
    setFilterSelect(newFilterSelect);
    setFilters(filtr);
    switch (key) {
      case "status":
        fetchFilterData({ dataStatus: fil[key] });
        if (pageNo !== 1) {
          setPageNo(1);
        }

        break;
      case "category": {
        //const findCategory = appCategory.find((cat) => cat[0] === value);
        fetchFilterData({ category: value });
        break;
      }
      case "search": {
        let search = new RegExp(filtr.search.replace(/[^\w\s]/gi, ""), "gi");
        const searchInstance = debounce((val) => {
          fetchFilterData({ appName: val });
        }, 500);
        searchInstance(value);
        break;
      }
      default:
        break;
    }
  };

  const onGetAppCategorySuccess = ({ data }) => {
    const filterCatArr = data?.data?.map((catArr) => [catArr.id, catArr.name]);

    const addCategories = filter1?.map((data) => {
      if (data.key === "category") {
        data.options = [...data?.options, ...filterCatArr];
      }
      return data;
    });

    setFilterSelect(addCategories);
  };

  const options = {
    query: {
      population: [{ path: "categories", select: "id name" }],
    },
  };
  const userID = userInfo?.account;
  const { isLoadingCat, isFetchingCat } = useCustomQuery({
    queryKey: ["allAppCategories", options, userID?.id, { perPage: 20 }],
    apiFunc: getAppCategoryAPI,
    onSuccess: onGetAppCategorySuccess,
    enabled: !!perPage,
  });
  useEffect(() => {
    if (entries) setPerPageArr(listNums(entries));
  }, [entries]);

  useEffect(() => {
    document.title = "Analytics";
  }, []);

  useEffect(() => {
    onPaginationChange();
  }, [pageNo, perPage]);

  const handleChange = (lap) => {
    if (lap.isFinish) {
      setIsLoading(false);
    }
  };

  const handlePageChange = (e) => {
    if (e.target.value) {
      setPageNo(e.target.value);
    }
  };

  const onPaginationChange = async () => {
    //if (pageNo) {
    setIsLoading(true);
    if (filters.status === "All") {
      const { data, success } = await getWorkflowInstances({
        perPage,
        page: pageNo,
        filterLevel: isAdmin ? null : isUserGroupAdmin ? "directreport" : "own",
      });
      if (success) {
        setUnfilteredData({
          data: data?.data,
          meta: data?._meta,
        });
        const userData = data?.data;
        setFilteredData(userData);

        // setPerPage(data?._meta?.pagination?.per_page);
        setEntries(data?._meta?.pagination?.total_count);
      }
    } else {
      const { data, success } = await filterWorkFlowInstance({
        page: pageNo,
        status: filters.status,
        perPage,
      });
      if (success) {
        setUnfilteredData({
          data: data?.data,
          meta: data?._meta,
        });
        const userData = data?.data;
        setFilteredData(userData);
      }
    }
    // if (success) {
    //   setUnfilteredData({
    //     data: data.data,
    //     meta: data._meta,
    //   });
    //const userData = data.data
    //setFilteredData(userData);
    // }
    setIsLoading(false);
    //}
  };

  return (
    <MainPageLayout
      headerTitle={mainNavigationListNames.ANALYTICS}
      pageTitle=""
      pageSubtitle="Track initiated workflow instances"
      appsControlMode={null}
      categories={categories}
      isLoading={isLoading}
      handleChange={handleChange}
    >
      {/* here for the main area and contents */}
      {!isLoading && (
        <Grid
          container
          item
          sm={12}
          xs={12}
          // spacing={3}
          // className={classes.topMargin0}
        >
          <Grid item sm={12} xs={12} style={{ overflow: "auto" }}>
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
                      padding: 12,
                      marginBottom: 2,
                    }}
                  >
                    <ListItemText
                      style={{ flex: 6 }}
                      primary={
                        <Typography
                          variant="body2"
                          style={{
                            fontWeight: 600,
                          }}
                        >
                          Name
                        </Typography>
                      }
                    />
                    <ListItemText
                      style={{ flex: 3 }}
                      primary={
                        <Typography
                          variant="body2"
                          style={{
                            fontWeight: 600,
                          }}
                        >
                          Initiator
                        </Typography>
                      }
                    />
                    <ListItemText
                      style={{ flex: 3 }}
                      primary={
                        <Typography
                          variant="body2"
                          style={{
                            fontWeight: 600,
                          }}
                        >
                          Categories
                        </Typography>
                      }
                    />
                    <ListItemText
                      style={{ flex: 3 }}
                      primary={
                        <Typography
                          variant="body2"
                          style={{
                            fontWeight: 600,
                          }}
                        >
                          Last modified
                        </Typography>
                      }
                    />
                    <ListItemText
                      style={{ flex: 3 }}
                      primary={
                        <Typography
                          variant="body2"
                          style={{
                            fontWeight: 600,
                          }}
                        >
                          Process time
                        </Typography>
                      }
                    />
                    <ListItemText
                      style={{ flex: 3 }}
                      primary={
                        <Typography
                          variant="body2"
                          style={{
                            fontWeight: 600,
                            textAlign: "left",
                          }}
                        >
                          Status
                        </Typography>
                      }
                    />
                    <ListItemText
                      style={{ flex: 3 }}
                      primary={
                        <Typography
                          variant="body2"
                          style={{
                            fontWeight: 600,
                            textAlign: "left",
                          }}
                        >
                          Current task
                        </Typography>
                      }
                    />
                    <ListItemText
                      style={{ flex: 2 }}
                      primary={
                        <Typography
                          variant="body2"
                          style={{
                            fontWeight: 600,
                            textAlign: "left",
                          }}
                        >
                          Actions
                        </Typography>
                      }
                    />
                  </ListSubheader>
                  {filteredData?.map((item, index) => {
                    return (
                      <SingleWorkflow
                        actions
                        key={index}
                        item={item}
                        swIndex={index}
                      />
                    );
                  })}
                  {!filteredData?.length && (
                    <div className={classes.noRecord}>
                      <Typography>
                        No running instance at the moment.
                      </Typography>
                    </div>
                  )}
                </ul>
                {filteredData?.length !== 0 && entries && (
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
                              //className={classes.null}
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
      )}
    </MainPageLayout>
  );
};

export default Analytics;
