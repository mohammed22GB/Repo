import { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  List,
  TextField,
  ListSubheader,
  FormControl,
  ListItemText,
} from "@material-ui/core";
import Select from "@material-ui/core/Select";

import useStyles from "./components/style";
import { getOrganizations } from "./utils/administrationAPIs";
import BillingHistory from "./components/BillingHistory";
import SingleAccount from "./components/SingleAccount";
import ViewDetailsModal from "./components/ViewDetailsModal";
import IntegrationsModal from "./components/IntegrationsModal";
import { fakeData } from "./components/FakeData";
import UsersChart from "./components/UsersChart";
import AppsChart from "./components/AppsChart";
import useCustomQuery from "../common/utils/CustomQuery";
import { listNums } from "../common/utils/perPage";
import MainPageLayout from "../common/components/AppLayout/MainPageLayout";
import { mainNavigationListNames } from "../common/utils/lists";
import { ExportDump } from "./components/ExportDump";

const Administration = () => {
  // const [isLoading, setIsLoading] = useState(true);
  const [isLap, setIsLap] = useState(true);
  const [modalMode, setModalMode] = useState("add");
  const [modalData, setModalData] = useState();
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [showIntegrations, setShowIntegrations] = useState(false);
  const [orgID, setOrgID] = useState();
  const [organizations, setOrganizations] = useState([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState([]);
  const [filters, setFilters] = useState({
    status: "All",
    search: "",
    name: "All",
  });
  const [sortValue, setSortValue] = useState("");
  const [entries, setEntries] = useState(0);
  const [userGroups, setUserGroups] = useState([]);
  const [integrationsCount, setIntegrationsCount] = useState();
  const [orgIndex, setOrgIndex] = useState();
  const [pageNo, setPageNo] = useState(0);
  const [perPageArr, setPerPageArr] = useState([]);
  const [perPage, setPerPage] = useState(10);

  const classes = useStyles(); // ok

  useEffect(() => {
    document.title = "Admin Dashboard";
  }, []);

  useEffect(() => {
    const filtr = { ...filters };
    //console.log(`vals = ${JSON.stringify(filtr)}`);
    // let srch = (filtr.search.length > 2) ? new RegExp(filtr.search.replace(/[^\w\s]/gi, ''), "g") : null;
    let srch = new RegExp(filtr.search.replace(/[^\w\s]/gi, ""), "gi");

    const filtered = organizations.filter(
      (f) =>
        (filtr.status === "All" || f.active === (filtr.status === "Active")) &&
        (!srch || (f.name && f.name.search(srch) !== -1)) &&
        (filtr.name === "All" || f.name === filtr.name)
    );

    setFilteredOrganizations(filtered);
  }, [organizations, filters]);

  const onGetAppCategorySuccess = ({ data }) => {
    //console.log(JSON.stringify(data.data));
    //console.log(data.data.length);
    setOrganizations(data.data.response);
    setPerPage(data.data.per_page);
    setEntries(data.data.count);
    //setEntries(data._meta.pagination.total_count);
  };

  // fetch usergroups
  const options = {
    query: {
      // population: ["users"],
      population: [{ path: "categories", select: "id name" }],
    },
  };
  const { isLoading, isFetching, refetch } = useCustomQuery({
    queryKey: ["allOrganizations", pageNo, sortValue, { perPage } /*options*/],
    apiFunc: getOrganizations,
    onSuccess: onGetAppCategorySuccess,
    enabled: !!perPage,
  });

  const _doFilter = (filt) => {
    //console.log(filt);
    let filtr = { ...filters, ...filt };
    //console.log(filtr);
    setFilters(filtr);
  };

  const handleChange = (lap) => {
    if (lap.isFinish) {
      setIsLap(false);
    }
  };

  const handleOpenMoreDetails = (index) => {
    //setOrgIndex(index);
    const ID = organizations[index]._id;
    setOrgID(ID);
    setShowMoreDetails(true);
  };
  const handleOpenIntegrations = (id) => {
    const uniqueObjCount = {};
    const arr = organizations[id].integrations;
    arr.forEach((data, index) => {
      if (uniqueObjCount[data]) {
        uniqueObjCount[data] += 1;
      } else {
        uniqueObjCount[data] = 1;
      }
    });
    //setOrgIndex(id);
    setIntegrationsCount(uniqueObjCount);
    setShowIntegrations(true);
  };

  const handlePageChange = (e) => {
    //console.log(e.target.value);
    if (e.target.value) {
      setPageNo(e.target.value - 1);
    }
  };
  const handleCloseMoreDetails = () => {
    setShowMoreDetails(false);
  };
  const handleCloseIntegrations = () => {
    setShowIntegrations(false);
  };
  useEffect(() => {
    if (entries) setPerPageArr(listNums(entries));
  }, [entries]);

  return (
    <>
      <MainPageLayout
        headerTitle={mainNavigationListNames.ADMINISTRATION}
        pageTitle=""
        pageSubtitle="Perform platform licensing and review usage metrics here"
        appsControlMode={null}
        categories={null}
        isLoading={isLoading || isLap}
        handleChange={handleChange}
        hideSearbar
      >
        <Grid container item>
          {/* here for the main area and contents */}
          <Grid
            container
            item
            sm={12}
            xs={12}
            className={classes.bottomMargin20}
            // spacing={3}
          >
            <Grid
              container
              sm={12}
              xs={12}
              //justifyContent="space-between"
              // style={{
              //   ,
              // }}
              item
            >
              <UsersChart />
              <AppsChart />
              <BillingHistory /*onClick={() => handleOpenMoreDetails("add", "")}*/
              />
            </Grid>
          </Grid>
        </Grid>

        {/* here for the filter bar */}
        {/* <Grid
          container
          item
          sm={12}
          xs={12}
          justifyContent="flex-end"
          // spacing={3}
        >
          <Grid item sm={2} xs={2}>
            <FilterButtons
              filters={filters}
              doFilter={_doFilter}
              setSortValue={setSortValue}
              //appCategories={organizations}
            />
          </Grid>
        </Grid> */}

        <ExportDump />

        {/* here for the main area and contents */}
        <Grid
          container
          item
          sm={12}
          xs={12}
          // spacing={3}
          className={classes.topMargin0}
        >
          <Grid item sm={12} xs={12}>
            <List className={classes.table}>
              <li className={classes.listSection}>
                <ul className={classes.ul}>
                  <ListSubheader
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "#F8F8F8",
                      padding: "12px 0",
                      boxShadow: "0px 0px 4px rgba(110, 110, 110, 0.25)",
                      marginBottom: 2,
                    }}
                  >
                    <ListItemText
                      style={{ flex: 0.3, minWidth: 32 }}
                      primary={
                        <Typography
                          style={{
                            //borderRadius: 40,
                            width: 8,
                            height: 40,
                            background: "#0C7B93",
                          }}
                        />
                      }
                    />
                    <ListItemText
                      style={{ flex: 2 }}
                      primary={
                        <Typography
                          variant="h6"
                          style={{ fontWeight: 500, fontSize: "0.9em" }}
                        >
                          Organization name
                        </Typography>
                      }
                    />
                    <ListItemText
                      style={{ flex: 1 }}
                      primary={
                        <Typography
                          variant="h6"
                          style={{ fontWeight: 500, fontSize: "0.9em" }}
                        >
                          Created
                        </Typography>
                      }
                    />
                    <ListItemText
                      style={{ flex: 2 }}
                      primary={
                        <Typography
                          variant="h6"
                          style={{
                            fontWeight: 500,
                            //texAlign: "center",
                            fontSize: "0.9em",
                          }}
                        >
                          Admin email
                        </Typography>
                      }
                    />
                    <ListItemText
                      style={{ flex: 0.5 }}
                      primary={
                        <Typography
                          variant="h6"
                          style={{
                            fontWeight: 500,
                            fontSize: "0.9em",
                            textAlign: "center",
                          }}
                        >
                          Users
                        </Typography>
                      }
                    />
                    <ListItemText
                      style={{ flex: 0.7 }}
                      primary={
                        <Typography
                          variant="h6"
                          style={{
                            fontWeight: 500,
                            fontSize: "0.9em",
                            textAlign: "center",
                          }}
                        >
                          Live apps
                        </Typography>
                      }
                    />
                    <ListItemText
                      style={{
                        flex: "unset",
                        width: 120,
                        marginRight: 15,
                      }}
                      primary={
                        <Typography
                          variant="h6"
                          style={{
                            fontWeight: 500,
                            fontSize: "0.9em",
                            textAlign: "center",
                          }}
                        >
                          Integrations
                        </Typography>
                      }
                    />
                    <ListItemText
                      style={{ flex: 1.5 }}
                      primary={
                        <Typography
                          variant="h6"
                          style={{ fontWeight: 500, fontSize: "0.9em" }}
                        >
                          Last user login
                        </Typography>
                      }
                    />
                    <ListItemText
                      style={{ flex: 2 }}
                      primary={
                        <Typography
                          variant="h6"
                          style={{
                            fontWeight: 500,
                            fontSize: "0.9em",
                            textAlign: "center",
                          }}
                        >
                          Status
                        </Typography>
                      }
                    />
                    <ListItemText
                      style={{ flex: 0.8 }}
                      primary={
                        <Typography
                          variant="h6"
                          style={{
                            fontWeight: 500,
                            fontSize: "0.9em",
                            textAlign: "center",
                          }}
                        >
                          Actions
                        </Typography>
                      }
                    />
                  </ListSubheader>
                  {!isLoading ? (
                    <>
                      {!!organizations?.length &&
                        organizations.map((item, index) => (
                          <SingleAccount
                            key={index}
                            data={item}
                            index={index}
                            actions={true}
                            handleOpenMoreDetails={handleOpenMoreDetails}
                            handleOpenIntegrations={handleOpenIntegrations}
                            isFetching={isFetching}
                            refetch={refetch}
                          />
                        ))}
                    </>
                  ) : (
                    <>
                      {/* {isLap ? (
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
                          <Typography>
                            No organisations available yet.
                          </Typography>
                        </div>
                      )} */}
                    </>
                  )}
                </ul>
                {organizations.length !== 0 && !isLoading && !isFetching && (
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
                              defaultValue={perPage}
                              style={{
                                marginLeft: "0px",
                                marginRight: "6px",
                              }}
                              onChange={(e) => {
                                //console.log(e.target.value);
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
                        defaultValue={pageNo + 1}
                        onChange={(e) => handlePageChange(e)}
                      />
                    </Grid>
                    <Grid item>
                      <Typography>
                        of {Math.ceil(entries / perPage)}{" "}
                        {entries / 10 > 1 ? "pages" : "page"}
                      </Typography>
                    </Grid>
                  </Grid>
                )}
              </li>
            </List>
          </Grid>
        </Grid>
      </MainPageLayout>

      {showIntegrations && (
        <IntegrationsModal
          closeModal={handleCloseIntegrations}
          integrations={integrationsCount}
        />
      )}
      {showMoreDetails && (
        <ViewDetailsModal
          ID={orgID}
          closeModal={handleCloseMoreDetails}
          roleDetails={fakeData[orgIndex]}
        />
      )}
    </>
  );
};

export default Administration;
