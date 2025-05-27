import { makeStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
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
import { TbExternalLink } from "react-icons/tb";
import useCustomQuery from "../../../common/utils/CustomQuery";
import { getWorkflowInstances } from "../../../Analytics/AnalyticsApis";
import moment from "moment";
import SingleRecordsModal from "./SingleRecordsModal";
import ReactSpinnerTimer from "react-spinner-timer";
import {
  getProcessTime,
  showTooltip,
} from "../../../common/helpers/helperFunctions";
import { Link } from "react-router-dom";
import { returnRecordLinkUrl } from "../../PortalAppLayout/utils/utils";
import { hexToRgba } from "../../../SettingsLayout/Pages/Customizations/utils/customizationutils";
import useGetUserPortalCustomisation from "../../../SettingsLayout/Pages/Customizations/utils/useGetUserPortalCustomisation";

const useStyles = makeStyles({
  table: {
    minWidth: 500,
    overflow: "auto",
  },
  container: {
    maxHeight: 440,
    overflow: "auto",
    marginTop: "20px",
    "@media (max-width: 1280px)": {
      maxWidth: "900px ",
    },
    "@media (max-width: 1250px)": {
      maxWidth: "850px ",
    },
    "@media (max-width: 800px)": {
      maxWidth: "420px ",
    },
    "@media (max-width: 500px)": {
      maxWidth: "210px ",
    },
  },
  headCell: {
    borderTop: "1px solid lightgray",
    borderBottom: "1px solid lightgray",
    background: "white",
    "&:first-child": {
      borderLeft: "1px solid lightgray",
      borderTopLeftRadius: "5px",
    },
    "&:last-child": {
      borderRight: "1px solid lightgray",
      borderTopRightRadius: "5px",
    },
  },
  statusBadge: {
    display: "flex",
    justifyContent: "center",
    padding: "3px 10px",
    borderRadius: "20px",
    minWidth: "80px",
  },
  truncated: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100px",
    minWidth: "50px",
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

export function RecordsTable({
  statusVal,
  filterLevel,
  category,
  sortLevel,
  locationData,
  setFilterLevel,
}) {
  const classes = useStyles();
  const [perPage, setPerPage] = useState(10);
  const [pageNo, setPageNo] = useState(0);
  const [open, setOpen] = useState(false);
  const [isLap, setIsLap] = useState(true);
  const [taskStatus, setTaskStatus] = useState("");
  const [selectedID, setSelectedID] = useState(false);

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

  const queryObj = {
    page: pageNo,
    perPage,
    filterLevel,
    category,
    sortLevel,
    statusVal,
    taskStatus,
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

  const renderRowContent = (row, index) => {
    const startTime = moment(row?.createdAt);
    const endTime = moment(row?.updatedAt);

    return (
      <TableRow hover key={`${index}${row?._id}`} style={{ cursor: "pointer" }}>
        <TableCell width={180} style={{ display: "flex", gap: "12px" }}>
          <div
            className={classes.iconWrapper}
            style={{ background: colors[index % colors.length].pri }}
          >
            <MdAnalytics
              color={colors[index % colors.length].sec}
              style={{ fontSize: "22px" }}
            />
          </div>
          <div>
            {row?.status !== "pending" ? (
              <Tooltip title={row?.app?.name}>
                <Typography
                  style={{
                    color: "#535353",
                    fontWeight: "500",
                    fontSize: "16px",
                  }}
                  className={classes.truncated}
                >
                  {row?.app?.name || "--"}
                </Typography>
              </Tooltip>
            ) : (
              <Link
                to={returnRecordLinkUrl(row)}
                target="_blank"
                style={{ textDecoration: "none" }}
              >
                <Tooltip title={row?.app?.name}>
                  <Typography
                    style={{
                      color: "#535353",
                      fontWeight: "500",
                      fontSize: "16px",
                    }}
                    className={classes.truncated}
                  >
                    {row?.app?.name || "--"}
                  </Typography>
                </Tooltip>
              </Link>
            )}

            <Typography
              style={{
                color: "#B8B8B8",
                fontWeight: "400",
                fontSize: "12px",
              }}
            >
              Created: {moment(row?.createdAt).format("DD/MM/YY")}
            </Typography>
          </div>
        </TableCell>
        <TableCell align="left">
          <Tooltip
            title={showTooltip(
              `${row?.user?.firstName || ""} ${row?.user?.lastName || ""}`,
              16
            )}
          >
            <Typography
              style={{ color: "#858585", fontWeight: "400", fontSize: "16px" }}
              noWrap
            >{`${row?.user?.firstName || "--"} ${
              row?.user?.lastName || "--"
            }`}</Typography>
          </Tooltip>
        </TableCell>
        <TableCell align="left">
          <Typography
            noWrap
            style={{ color: "#858585", fontWeight: "400", fontSize: "16px" }}
          >
            {getProcessTime(endTime.diff(startTime, "minutes"))}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <Tooltip title={row?.app?.category?.name}>
            <Typography
              style={{
                fontWeight: "500",
                color: internalPageTheme,
                borderRadius: "100px",
                padding: "4px 8px",
                backgroundColor: `${hexToRgba(internalPageTheme, 0.12)}`,
                fontSize: "16px",
                textAlign: "center",
              }}
              className={`${classes.truncated}`}
            >
              {row?.app?.category?.name}
            </Typography>
          </Tooltip>
        </TableCell>
        <TableCell align="left" width={120}>
          <Typography
            style={{ color: "#858585", fontWeight: "400", fontSize: "16px" }}
          >
            {moment(row?.updatedAt).format("DD/MM/YY")}
            <Typography
              noWrap
              style={{ display: "block", color: "grey", fontWeight: 300 }}
            >
              {moment(row?.updatedAt).format("h:mm:ss a")}
            </Typography>
          </Typography>
        </TableCell>
        <TableCell align="center" width={120}>
          <Typography
            noWrap
            className={classes.statusBadge}
            style={{
              fontSize: "16px",
              background: statusColors[row.status]?.bg,
              color: statusColors[row.status]?.color,
            }}
          >
            {row?.status}
          </Typography>
        </TableCell>
        <TableCell width={110} align="left">
          <Typography
            style={{ color: "#858585", fontWeight: "400", fontSize: "16px" }}
          >
            {" "}
            {row?.task?.name}
          </Typography>
        </TableCell>
        <TableCell
          align="left"
          onClick={() => {
            setSelectedID(row?._id);
            handleClickOpen();
          }}
        >
          <TbExternalLink size={20} style={{ cursor: "pointer" }} />
        </TableCell>
      </TableRow>
    );
  };

  const columnHeaders = [
    { label: "Name", align: "left" },
    { label: "Initiator", align: "left" },
    { label: "Process Time", align: "left" },
    { label: "Categories", align: "left" },
    { label: "Last modification", align: "left" },
    { label: "Status", align: "center" },
    { label: "Current task", align: "right" },
    { label: "", align: "right" },
  ];

  return (
    <TableContainer component={Paper} className={classes.container}>
      <Table stickyHeader className={classes.table}>
        <TableHead>
          <TableRow>
            {columnHeaders?.map((header) => {
              return (
                <TableCell
                  key={header.label}
                  align={header.align}
                  className={classes.headCell}
                >
                  {header.label}
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
                <div className={classes.noData}>No data found</div>
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
  );
}
