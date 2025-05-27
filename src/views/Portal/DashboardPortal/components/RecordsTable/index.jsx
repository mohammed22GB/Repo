import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  TableHead,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { MdAnalytics } from "react-icons/md";
import useCustomQuery from "../../../../common/utils/CustomQuery";
import { getWorkflowInstances } from "../../../../Analytics/AnalyticsApis";
import moment from "moment";
import ReactSpinnerTimer from "react-spinner-timer";
import SingleRecordsModal from "../../../ViewRecords/components/SingleRecordsModal";

import { getProcessTime } from "../../../../common/helpers/helperFunctions";
import FilterElement from "../../../commonComponents/Filter";
import SortElement from "../../../commonComponents/Sort";
import { hexToRgba } from "../../../../SettingsLayout/Pages/Customizations/utils/customizationutils";
import useGetUserPortalCustomisation from "../../../../SettingsLayout/Pages/Customizations/utils/useGetUserPortalCustomisation";
import SplitButton from "../../../ViewRecords/components/SplitButton";
import {
  getUserRole,
  tempPermissions,
} from "../../../../common/utils/userRoleEvaluation";
import NoData from "../../../commonComponents/NoData";

const useStyles = makeStyles((theme) => {
  return {
    pointer: {
      cursor: "pointer",
    },

    item: {
      cursor: "pointer",
      color: "#535353",
      "&:hover": {
        background: "#DE54391F",
      },
    },
    truncated: {
      color: "black",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "100px",
      minWidth: "50px",
    },
    tableInner: {
      minWidth: 500,
      overflow: "auto",
      border: "none !important",
      "@media (max-width: 800px)": {
        maxWidth: "400px !important",
      },
      "@media (max-width: 500px)": {
        minWidth: 100,
        maxWidth: "300px !important",
      },
    },
    tableElement: {
      maxHeight: 440,
      overflow: "auto",
      marginTop: "20px",
      fontFamily: "Avenir,Inter",
      width: "100% !important",
      maxWidth: "100% !important",
    },
    container: {
      width: "100% !important",
    },
    wrapper: {
      display: "flex",
      flexDirection: "column",
      padding: "24px",
      gap: "3px",
      width: "68%",
      borderRadius: "10px",
      background: "#FFFFFF",
      fontFamily: "Avenir,Inter",

      "@media (max-width: 1285px)": {
        width: "67%",
      },
      "@media (max-width: 800px)": {
        width: "98%",
      },
      "@media (max-width: 1170px)": {
        width: "95%",
      },
      "@media (max-width: 500px)": {
        width: "50%",
      },
    },
    headCell: {
      border: "none",
      background: "white",
    },
    statusBadge: {
      display: "flex",
      justifyContent: "center",
      padding: "3px 10px",
      borderRadius: "20px",
      minWidth: "80px",
    },
    iconWrapper: {
      width: 32,
      height: 32,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginTop: "0.5rem",
      minWidth: 32,
      minHeight: 32,
    },
    noData: {
      textAlign: "center",
      fontStyle: "italic",
    },
    categoryItem: {
      cursor: "pointer",
      "&:hover": {
        background: "#DE54391F",
      },
    },
  };
});

const colors = [
  { pri: "#FF4BA61F", sec: "#FF45A3" },
  { pri: "#3374F51F", sec: "#2C6FF4" },
  { pri: "#14E0AE1F", sec: "#0EDEAB" },
];

const statusColors = {
  pending: { bg: "#EEC90540", color: "#D0AF00" },
  "in-progress": { bg: "#2457C140", color: "#2457C1" },
  completed: { bg: "#29CF4440", color: "#21B338" },
};

const splitBtnOptions = [
  { value: "all", title: "All" },
  { value: "own", title: "Personal" },
  { value: "department", title: "Departmental " },
  { value: "directreport", title: "Assigned " },
];

export function RecordsTable({ category, categories, adminUG, isLoadingUG }) {
  const classes = useStyles();
  const [perPage, setPerPage] = useState(10);
  const [pageNo, setPageNo] = useState(0);
  const [open, setOpen] = useState(false);
  const [isLap, setIsLap] = useState(true);
  const [selectedID, setSelectedID] = useState(false);
  const [categoryVal, setCategoryVal] = useState("All");
  const [statusVal, setStatusVal] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [sortLevel, setSortLevel] = useState({});
  const [filterOptions, setFilterOptions] = useState(splitBtnOptions);

  const { internalPage, brandTheme } = useGetUserPortalCustomisation();

  const internalPageTheme = internalPage?.isEnabled
    ? internalPage?.theme?.primaryColor
    : brandTheme ?? "#DE5439";

  const handleChangePage = (event, newPage) => {
    setPageNo(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPerPage(parseInt(event.target.value, 10));
    setPageNo(0);
  };
  const onGetRecordsSuccess = (result) => {
    return result;
  };

  useEffect(() => {
    !tempPermissions(getUserRole()) && setFilterLevel("own");
  }, []);

  useEffect(() => {
    if (!tempPermissions(getUserRole()) && adminUG) {
      setFilterOptions((prev) => {
        return prev.filter((opt) => {
          return opt?.value !== "all";
        });
      });
    } else if (!tempPermissions(getUserRole()) && !adminUG) {
      setFilterOptions((prev) => {
        return prev.filter((opt) => {
          return opt?.value !== "all" && opt?.value !== "department";
        });
      });
    }
  }, [adminUG]);

  const queryObj = {
    page: pageNo,
    perPage,
    filterLevel,
    category: categoryVal,
    sortLevel,
    statusVal,
  };

  const { data, isLoading } = useCustomQuery({
    queryKey: ["getRecords", queryObj],
    apiFunc: () => {
      return getWorkflowInstances(queryObj);
    },
    onSuccess: onGetRecordsSuccess,
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleLapChange = (lap) => {
    if (lap?.actualLap > 4) {
      setIsLap(false);
    }
  };

  const columnHeaders = [
    { label: "Name", align: "left", width: "" },
    { label: "Initiator", align: "left", width: "" },
    { label: "Process Time", align: "left", width: "" },
    { label: "Categories", align: "left", width: "" },
    { label: "Status", align: "center", width: "" },
  ];

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

  const renderRowContent = (row, index) => {
    const startTime = moment(row?.createdAt);
    const endTime = moment(row?.updatedAt);

    return (
      <TableRow
        hover
        key={index}
        onClick={() => {
          setSelectedID(row?.id);
          handleClickOpen();
        }}
        className={classes.pointer}
        data-testid="tableRow"
      >
        <TableCell
          style={{
            display: "flex",
            gap: "12px",
          }}
          className={classes.pointer}
        >
          <div
            className={classes.iconWrapper}
            style={{ background: colors[index % colors.length]?.pri }}
          >
            <MdAnalytics
              color={colors[index % colors.length].sec}
              style={{ fontSize: "22px" }}
            />
          </div>
          <div>
            <Tooltip title={row?.app?.name}>
              <Typography
                style={{
                  fontWeight: "500",
                  fontSize: "16px",
                  color: "#535353",
                }}
                noWrap
                className={classes.truncated}
              >
                {row?.app?.name}
              </Typography>
            </Tooltip>
            <Typography
              noWrap
              style={{ color: "#B8B8B8", fontWeight: "400", fontSize: "12px" }}
            >
              Created: {moment(row?.createdAt).format("DD/MM/YY")}
            </Typography>
          </div>
        </TableCell>
        <TableCell align="left" className={classes.pointer}>
          <Tooltip
            title={`${row?.user?.firstName || ""} ${row?.user?.lastName || ""}`}
          >
            <Typography
              noWrap
              style={{ color: "#858585", fontWeight: "400", fontSize: "16px" }}
              className={classes.truncated}
            >{`${row?.user?.firstName || "--"} ${
              row?.user?.lastName || "--"
            }`}</Typography>
          </Tooltip>
        </TableCell>
        <TableCell
          style={{ color: "#858585", fontWeight: "400", fontSize: "16px" }}
          align="left"
          className={classes.pointer}
        >
          <Typography
            style={{ color: "#858585", fontWeight: "400", fontSize: "16px" }}
            className={classes.truncated}
          >
            {" "}
            {getProcessTime(endTime.diff(startTime, "minutes"))}
          </Typography>
        </TableCell>
        <TableCell align="right" className={classes.pointer}>
          <Tooltip title={row?.app?.category?.name}>
            <Typography
              noWrap
              style={{
                fontWeight: "400",
                fontSize: "16px",
                color: internalPageTheme,
                borderRadius: "100px",
                padding: "4px 8px",
                backgroundColor: `${hexToRgba(internalPageTheme, 0.12)}`,
                textAlign: "center",
              }}
              className={classes.truncated}
            >
              {" "}
              {row?.app?.category?.name || "--"}
            </Typography>
          </Tooltip>
        </TableCell>
        <TableCell align="center" width={120} className={classes.pointer}>
          <Typography
            noWrap
            className={classes.statusBadge}
            style={{
              fontWeight: "400",
              fontSize: "16px",
              background: statusColors[row?.status]?.bg,
              color: statusColors[row?.status]?.color,
            }}
          >
            {row?.status}
          </Typography>
        </TableCell>
      </TableRow>
    );
  };
  return (
    <div className={classes.wrapper}>
      <div
        style={{
          display: "flex",
          gap: "3px",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "0px 8px",
        }}
      >
        <Typography
          variant="h4"
          style={{ fontSize: "22px", fontWeight: 500, color: "#535353" }}
          noWrap
          className={classes.userHeadingOne}
        >
          Records
        </Typography>
        <div
          style={{
            display: "flex",
            gap: "25px",
            alignItems: "center",
          }}
        >
          <FilterElement
            filterFunc={handleFilterItemClick}
            classes={classes}
            itemArr={categories}
          />

          <SortElement
            sortFunc={handleSortItemClick}
            classes={classes}
            itemArr={["Undo sort", "Date (Oldest)", "Date (Newest)"]}
          />
          <SplitButton
            setFilterLevel={setFilterLevel}
            filterLevel={filterLevel}
            adminUG={adminUG}
            splitBtnOptions={filterOptions}
          />
        </div>
      </div>
      <div className={classes.container}>
        <TableContainer component={Paper} className={classes.tableElement}>
          <Table stickyHeader className={classes.tableInner}>
            <TableHead>
              <TableRow className={classes.header}>
                {columnHeaders?.map((header) => {
                  return (
                    <TableCell
                      key={header?.label}
                      align={header?.align}
                      className={classes.headCell}
                      width={header?.width}
                      data-testid="tableColumn"
                    >
                      <Typography
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#535353",
                        }}
                        noWrap
                        className={classes.an}
                      >
                        {header?.label}
                      </Typography>
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.data?.data?.map(renderRowContent)}
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={8}>
                    <div className={classes.noData}>
                      <ReactSpinnerTimer
                        timeInSeconds={3}
                        totalLaps={100}
                        isRefresh={false}
                        onLapInteraction={handleLapChange}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {!data?.data?.data?.length && !isLoading && (
                <TableRow>
                  <TableCell colSpan={8}>
                    <NoData />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              {!isLoading && !!data?.data?._meta?.pagination?.total_count && (
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    count={data?.data?._meta?.pagination?.total_count}
                    rowsPerPage={perPage}
                    page={pageNo}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </TableRow>
              )}
            </TableFooter>
          </Table>
          {!!open && !!selectedID && (
            <SingleRecordsModal
              open={open}
              setOpen={setOpen}
              selectedID={selectedID}
              handleClickOpen={handleClickOpen}
            />
          )}
        </TableContainer>
      </div>
    </div>
  );
}
