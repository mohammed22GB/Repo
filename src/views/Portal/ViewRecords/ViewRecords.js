/* eslint-disable arrow-body-style */
import { makeStyles } from "@material-ui/core/styles";
import { useStyles } from "./appsStyle";
import Typography from "@material-ui/core/Typography";
import PortalLayout from "../PortalAppLayout/PortalLayout"; // Import the missing component

import React, { useEffect, useRef, useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import useCustomQuery from "../../common/utils/CustomQuery";
import { useLocation } from "react-router-dom";
import { getCategories } from "../../common/components/Query/AppsQuery/queryApp";
import { RecordsTable } from "./components/RecordsTable";
import MainPortalLayout from "../MainPortalLayout";
import {
  getUserRole,
  tempPermissions,
} from "../../common/utils/userRoleEvaluation";
import { getUserGroupsAPI } from "../../SettingsLayout/Pages/UserGroups/utils/usergroupsAPIs";

const ViewRecords = () => {
  const classes = useStyles(makeStyles);
  const [categories, setCategories] = useState([]);

  const [categoryVal, setCategoryVal] = useState("All");
  const [sortLevel, setSortLevel] = useState({});
  const [statusVal, setStatusVal] = useState("");
  const [value, setValue] = useState("all");
  const location = useLocation();
  const routerState = location.state;
  const [perPageUG, setPerPageUG] = useState(30);
  const [pageNoUG, setPageNoUG] = useState(1);
  const [adminUG, setAdminUG] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userID = userInfo?.id;

  useEffect(() => {
    document.title = "Records";
  }, []);

  const onGetUserGroupsSuccess = ({ data }) => {
    if (data?.data?.length < 1) {
      setAdminUG(false);
    }
  };

  // fetch usergroups
  const options = {
    query: {
      population: [{ path: "users", select: "id firstName lastName" }],
    },
  };

  const { isLoading: isLoadingUG, isFetching: isFetchingUG } = useCustomQuery({
    queryKey: ["allUserGroups", options, perPageUG, pageNoUG, userID],

    apiFunc: getUserGroupsAPI,
    onSuccess: onGetUserGroupsSuccess,
    enabled: !!perPageUG,
  });

  const handleFilterItemClick = (filterObj) => {
    if (filterObj.filterType === "category") {
      setCategoryVal(filterObj?.id);
    } else if (filterObj.filterType === "all") {
      setCategoryVal("");
      setStatusVal("");
    } else {
      setStatusVal(filterObj.status);
    }
  };

  const handleSortItemClick = (index) => {
    switch (index) {
      case 0:
        setSortLevel(null);
        break;
      case 1:
        setSortLevel({ name: "app", type: "asc" });
        break;
      case 2:
        setSortLevel({ name: "app", type: "desc" });
        break;
      default:
        break;
    }
  };

  const handleCategoriesListSuccess = ({ data }) => {
    const categoriesData = data?.data?.data?.map((category) => {
      return { id: category?.id, name: category?.name };
    });
    return setCategories(categoriesData);
  };

  useCustomQuery({
    apiFunc: getCategories,
    queryKey: ["listCategories"],
    onSuccess: handleCategoriesListSuccess,
  });

  useEffect(() => {
    if (
      !tempPermissions(getUserRole()) &&
      routerState?.state !== "pendingTasks"
    ) {
      setValue("own");
    } else if (
      !tempPermissions(getUserRole()) &&
      routerState?.state === "pendingTasks"
    ) {
      setValue("directreport");

      setStatusVal("pending");
    } else if (
      tempPermissions(getUserRole()) &&
      routerState?.state === "pendingTasks"
    ) {
      setValue("directreport");

      setStatusVal("pending");
    }
  }, [routerState, location]);

  return (
    <div>
      <PortalLayout>
        <MainPortalLayout
          sortItems={["Undo sort", "Date (Oldest)", "Date (Newest)"]}
          sortFunc={handleSortItemClick}
          filterFunc={handleFilterItemClick}
          filterItems={categories}
          pageTitle={"Records"}
          pageSubtitle={
            "Track all initiations performed by you and from your department"
          }
        >
          <div style={{ marginTop: "2rem" }}>
            <FullWidthTabs
              setSortLevel={setSortLevel}
              categoryVal={categoryVal}
              statusVal={statusVal}
              value={value}
              setValue={setValue}
              sortLevel={sortLevel}
              routerState={routerState}
              location={location}
              adminUG={adminUG}
            />
          </div>
        </MainPortalLayout>
      </PortalLayout>
    </div>
  );
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function FullWidthTabs({
  categoryVal,
  routerState,
  statusVal,
  value,
  sortLevel,
  setValue,
  setSortLevel,
  location,
  adminUG,
}) {
  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };

  const tabStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: "none",
      width: "100%",
      "& .MuiTabs-indicator": {
        display: "none !important",
      },
    },
    appBar: {
      width: "fit-content",
      marginRight: "auto",
      backgroundColor: "#F8F8F8",
      boxShadow: "none",
      borderRadius: "8px",
      border: "none",
      padding: " 10px 0px",
      "& .MuiTabs-root": {
        minHeight: "10px",
      },
    },
    tab: {
      textTransform: "none",
      color: "black",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "0px 20px ",
      margin: "0px",
      minHeight: "10px",
      minWidth: "10px",
      "& > :first-child": {
        fontSize: "1rem",
        padding: "1px 20px",
      },
    },
    activeTab: {
      "& > :first-child": {
        backgroundColor: "midnightblue",
        borderRadius: "5px",
        color: "#fff",
        "&:hover": {
          backgroundColor: "darkblue",
        },
      },
    },
    tabPanel: {
      backgroundColor: theme?.palette?.background?.paper,
      "& > :first-child": {
        padding: "0px",
      },
    },
  }));

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const classes = tabStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="inherit"
          //variant="fullWidth"
        >
          {!!tempPermissions(getUserRole()) && (
            <Tab
              className={`${classes.tab} ${
                value === "all" ? classes.activeTab : ""
              }`}
              value="all"
              label="All"
              {...a11yProps("all")}
              style={{ borderRight: "2px solid #858585" }}
            />
          )}
          {!!tempPermissions(getUserRole()) ||
            (!!adminUG && (
              <Tab
                className={`${classes.tab} ${
                  value === "department" ? classes.activeTab : ""
                }`}
                value="department"
                label="Departmental"
                {...a11yProps("department")}
                style={{ borderRight: "2px solid #858585" }}
              />
            ))}
          <Tab
            className={`${classes.tab} ${
              value === "directreport" ? classes.activeTab : ""
            }`}
            value="directreport"
            label="Assigned"
            {...a11yProps("directreport")}
            style={{ borderRight: "2px solid #858585" }}
          />
          <Tab
            className={`${classes.tab} ${
              value === "own" ? classes.activeTab : ""
            }`}
            value="own"
            label="Personal"
            {...a11yProps("own")}
          />
        </Tabs>
      </AppBar>

      <TabPanel className={classes.tabPanel} value={value} index={"all"}>
        <RecordsTable
          category={categoryVal}
          filterLevel={value === "all" ? "" : value}
          sortLevel={sortLevel}
          setFilterLevel={handleChange}
          statusVal={statusVal}
          locationData={location}
        />
      </TabPanel>
      <TabPanel className={classes.tabPanel} value={value} index={"department"}>
        <RecordsTable
          sortLevel={sortLevel}
          statusVal={statusVal}
          setFilterLevel={handleChange}
          filterLevel={value}
          category={categoryVal}
          locationData={location}
        />
      </TabPanel>
      <TabPanel
        className={classes.tabPanel}
        value={value}
        index={"directreport"}
      >
        <RecordsTable
          sortLevel={sortLevel}
          filterLevel={value}
          category={categoryVal}
          setFilterLevel={handleChange}
          statusVal={statusVal}
          locationData={location}
        />
      </TabPanel>
      <TabPanel className={classes.tabPanel} value={value} index={"own"}>
        <RecordsTable
          sortLevel={sortLevel}
          filterLevel={value}
          category={categoryVal}
          setFilterLevel={handleChange}
          statusVal={statusVal}
          locationData={location}
        />
      </TabPanel>
    </div>
  );
}

export default ViewRecords;
