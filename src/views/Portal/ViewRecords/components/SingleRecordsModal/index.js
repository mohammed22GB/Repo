//
import {
  Button,
  Grid,
  ListItem,
  ListItemText,
  ListSubheader,
  Tooltip,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import MoreVert from "@material-ui/icons/MoreVert";
import { AiOutlineFile } from "react-icons/ai";
import moment from "moment";
import SingleWorkflow from "../SingleWorkflow";
import PendingTaskMenuList from "../PendingTaskMenuList";
import AnalyticsSidebar from "../AnalyticsSidebar";
import {
  getSingleWorkflowInstance,
  reminderMail,
} from "../../../../Analytics/AnalyticsApis";
import {
  successToastify,
  errorToastify,
} from "../../../../common/utils/Toastify";
import {
  singleWorkflowInstanceStyle,
  SingleWorkflowStyle,
  taskStatusRowStyles,
} from "../singleRecordStyle";
import { MdAnalytics } from "react-icons/md";
import { BsEye } from "react-icons/bs";
import Dialog from "@material-ui/core/Dialog";
import CloseIcon from "@material-ui/icons/Close";
import ReactSpinnerTimer from "react-spinner-timer";
import {
  filterDuplicateObjects,
  getProcessTimeBySeconds,
} from "../../../../common/helpers/helperFunctions";

const SingleRecordsModal = ({
  open,
  setOpen,
  handleClickOpen,
  selectedID: id,
}) => {
  const classes = singleWorkflowInstanceStyle();
  const tableStyle = SingleWorkflowStyle();
  const [appAnalyticsData, setAppAnalyticsData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLap, setIsLap] = useState(true);
  const [variables, setVariables] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showSideBar, setShowSideBar] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data, success } = await getSingleWorkflowInstance({ id });
      if (success) {
        const localVariable = new Map();
        data?.data?.workflow?.variables?.forEach((variable) => {
          if (variable?.info?.matching?.valueSourceType === "form") {
            localVariable.set(variable.id, {
              id: variable.id,
              name: variable?.info?.name,
            });
          }
        });
        setVariables(Array.from(localVariable.values()));
        setAppAnalyticsData(data?.data);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [id]);

  const handleReminderMail = async () => {
    const taskId = appAnalyticsData?.task?.id;
    const workflowInstanceId = appAnalyticsData?.id;
    const results = await reminderMail({ taskId, workflowInstanceId });

    if (results?.data?._meta?.success) {
      successToastify(results?.data?._meta?.message);
    } else {
      errorToastify(results?.data?._meta?.message);
    }
  };

  const handleCloseSidebar = () => {
    setShowSideBar(false);
  };
  const handleMoreOptionClick = (e, id) => {
    setAnchorEl(e.currentTarget);
  };

  const compareByTaskId = (obj1, obj2) => {
    return (
      (obj1.task?.id || obj1.task?._id) === (obj2.task?.id || obj2.task?._id)
    );
  };

  const removeRepetitionsAndSort = (taskStatuses) => {
    const uniqueTaskStatuses = filterDuplicateObjects(
      taskStatuses,
      compareByTaskId
    );

    const sortedStatuses = uniqueTaskStatuses?.sort(
      (a, b) => new Date(b?.updatedAt) - new Date(a?.updatedAt)
    );

    sortedStatuses.forEach((taskStatus, index) => {
      if (index < sortedStatuses.length - 1) {
        const nextTaskStatus = sortedStatuses[index + 1];
        taskStatus.processTime = getProcessTimeBySeconds(
          new Date(taskStatus.updatedAt) - new Date(nextTaskStatus.updatedAt)
        );
      } else {
        taskStatus.processTime = "0 secs";
      }
    });

    return sortedStatuses;
  };

  const colors = [
    { pri: "#FF4BA61F", sec: "#FF45A3" },
    { pri: "#3374F51F", sec: "#2C6FF4" },
    { pri: "#14E0AE1F", sec: "#0EDEAB" },
  ];
  const randomInd = Math.floor(Math.random() * (colors.length - 1));

  const handleClose = () => {
    setOpen(false);
  };
  const handleLapChange = (lap) => {
    if (lap?.actualLap > 3) {
      setIsLap(false);
    }
  };

  return (
    <Dialog fullScreen open={open} onClose={handleClose}>
      <>
        <div
          style={{
            "@media (max-width: 500px)": {
              border: "2px solid red",
            },
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            style={{ marginLeft: "0.8rem", marginTop: "0.8rem" }}
          >
            <CloseIcon style={{ fontSize: "2rem " }} />
          </IconButton>
        </div>
        {!isLoading && (
          <Grid container className={classes.gridPadding}>
            {" "}
            <div className={classes.headerSec}>
              {" "}
              <div
                style={{
                  background: colors[randomInd % colors.length].pri,
                  width: 56,
                  minWidth: 56,
                  height: 56,
                  borderRadius: 25,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MdAnalytics
                  color={colors[randomInd % colors.length].sec}
                  style={{ fontSize: "32px" }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  marginLeft: "1.4rem",
                }}
              >
                <p role="term" className={classes.heading}>
                  {appAnalyticsData?.app?.name}
                </p>
                <span>
                  <span
                    role="contentinfo"
                    style={{ marginRight: "1rem", color: "gray" }}
                  >
                    Created:{" "}
                    {moment(appAnalyticsData?.createdAt).format("DD/MM/YY")}
                  </span>
                  <span
                    style={{
                      background: colors[randomInd % colors.length].pri,
                      color: colors[randomInd % colors.length].sec,
                      padding: "3px 6px",
                      borderRadius: "10px",
                    }}
                  >
                    {appAnalyticsData?.app?.category?.name}
                  </span>
                </span>
              </div>
              <div>
                {" "}
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.headerBtn}
                  endIcon={<BsEye />}
                >
                  Preview
                </Button>
              </div>
            </div>
            <div
              className={`${classes.summaryWrapper} analytics-summary-outer`}
            >
              <div role="summaryArea" className={`${classes.summary}`}>
                <ul
                  style={{
                    border: "1px solid lightgray",
                    paddingLeft: "1.5rem",
                  }}
                  className={`${classes.ul}`}
                >
                  <ListSubheader className={classes.listSubheader}>
                    {[
                      { text: "Name", flex: 6 },
                      { text: "Initiator", flex: 3 },
                      { text: "Categories", flex: 3 },
                      { text: "Last modified", flex: 3 },
                      { text: "Process time", flex: 3 },
                      { text: "Status", flex: 3, align: "left" },
                      { text: "Current task", flex: 3, align: "left" },
                    ].map(({ text, flex, align }) => (
                      <ListItemText
                        key={text}
                        style={{ flex, textAlign: align || "inherit" }}
                        primary={
                          <Typography style={{ fontSize: 12, fontWeight: 600 }}>
                            {text}
                          </Typography>
                        }
                      />
                    ))}
                  </ListSubheader>
                </ul>
                <SingleWorkflow
                  actions={false}
                  item={appAnalyticsData}
                  mode="single"
                />
              </div>
            </div>
            <Grid
              container
              style={{ gap: 20 }}
              justifyContent="space-between"
              className={`${classes.gridWrapper} analytics-details-histories`}
            >
              <Grid
                className={`${classes.layout} ${classes.taskHistory}`}
                item
                xs={7}
              >
                <p className={classes.heading}>Task History</p>
                <ul className={classes.ul}>
                  <ListSubheader
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "lightgray",
                      padding: "0",
                      paddingLeft: "10px",
                      borderTopLeftRadius: "5px",
                      borderTopRightRadius: "5px",
                      marginBottom: 2,
                    }}
                  >
                    {[
                      { text: "Task", flex: 5 },
                      { text: "Node", flex: 3 },
                      { text: "Process Time", flex: 3 },
                      { text: "Status", flex: 3 },
                      { text: "Timestamp", flex: 3 },
                    ].map(({ text, flex }) => (
                      <ListItemText
                        key={text}
                        style={{ flex }}
                        primary={
                          <Typography style={{ fontSize: 12, fontWeight: 600 }}>
                            {text}
                          </Typography>
                        }
                      />
                    ))}
                  </ListSubheader>
                </ul>

                <div className="scroll">
                  {removeRepetitionsAndSort(appAnalyticsData?.taskStatus)?.map(
                    (singletaskStatus, index) => (
                      <TaskStatusRow
                        key={index}
                        taskStatus={singletaskStatus}
                        handleMoreOptionClick={handleMoreOptionClick}
                        tableStyles={tableStyle}
                      />
                    )
                  )}

                  {!appAnalyticsData?.taskStatus?.length && (
                    <div>No task history found</div>
                  )}
                </div>
                <PendingTaskMenuList
                  setAnchorEl={setAnchorEl}
                  anchorEl={anchorEl}
                  handleReminderMail={handleReminderMail}
                  setShowSideBar={setShowSideBar}
                  id={id}
                />
              </Grid>
              <Grid
                className={`${classes.layout} ${classes.approvalHistory}`}
                item
                xs={5}
              >
                <p className={classes.heading}>Approval History</p>
                <ul className={classes.ul}>
                  <ListSubheader
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "lightgray",
                      padding: "0",
                      marginBottom: 2,
                      paddingLeft: "10px",
                      borderTopLeftRadius: "5px",
                      borderTopRightRadius: "5px",
                    }}
                  >
                    {[
                      { label: "Approver", flex: 5 },
                      { label: "Action", flex: 3 },
                      { label: "Process Time", flex: 3 },
                      { label: "Comment", flex: 3 },
                      { label: "Timestamp", flex: 3 },
                    ].map(({ label, flex }, index) => (
                      <ListItemText
                        key={index}
                        style={{ flex, overflowWrap: "anywhere" }}
                        primary={
                          <Typography style={{ fontSize: 12, fontWeight: 600 }}>
                            {label}
                          </Typography>
                        }
                      />
                    ))}
                  </ListSubheader>
                </ul>
                <div className="scroll">
                  {removeRepetitionsAndSort(
                    appAnalyticsData?.approvalHistory
                  )?.map((approvalHistoryItem, index) => {
                    console.log(approvalHistoryItem, "approvalHistoryItem");
                    return (
                      <ApprovalHistoryItem
                        key={index}
                        approvalHistoryItem={approvalHistoryItem}
                        index={index}
                        tableStyle={tableStyle}
                      />
                    );
                  })}
                  {!appAnalyticsData?.approvalHistory?.length > 0 && (
                    <div>No approval history found</div>
                  )}
                </div>
              </Grid>
            </Grid>
            {!!showSideBar && (
              <AnalyticsSidebar
                handleCloseSidebar={handleCloseSidebar}
                taskId={appAnalyticsData?.task?.id}
                workflowInstanceId={appAnalyticsData?.id}
                showMe={showSideBar}
                setShowMe={setShowSideBar}
                data={appAnalyticsData?.task?.assignedTo}
              />
            )}
          </Grid>
        )}
        <div
          style={{
            width: "100%",
            height: "100vh",
            background: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {!!isLoading && !!isLap && (
            <div className="page-spinner-loader">
              <ReactSpinnerTimer
                timeInSeconds={3}
                totalLaps={100}
                isRefresh={false}
                onLapInteraction={(lap) => {
                  handleLapChange(lap);
                }}
              />
            </div>
          )}
        </div>
      </>
    </Dialog>
  );
};

export default SingleRecordsModal;

const TaskStatusRow = ({
  taskStatus,
  handleMoreOptionClick,
  tableStyles = {},
}) => {
  const classes = taskStatusRowStyles();

  const statusClass =
    taskStatus?.status === "successful"
      ? "completed"
      : taskStatus?.status === "in-progress"
      ? "in-progress"
      : "failed";

  const textTransform = ["StartTask", "EndTask"].includes(
    taskStatus?.type || taskStatus?.task?.type
  )
    ? "uppercase"
    : "capitalize";

  const taskType = (taskStatus?.type || taskStatus?.task?.type || "--")
    ?.replace(/[A-Z]/g, (v) => ` ${v.toLowerCase()}`)
    ?.trim();

  const taskProcessTime = taskStatus?.processTime;

  const updatedAt = taskStatus?.updatedAt
    ? `${moment(taskStatus?.updatedAt).format("DD-MMM")} ${moment(
        taskStatus?.updatedAt
      ).format("HH:mm")}`
    : "--";

  const flexConfig = {
    name: 5,
    type: 3,
    processTime: 3,
    status: 3,
    updatedAt: 3,
  };

  const listItemConfig = [
    {
      key: "name",
      content: (
        <div className={`${classes.nameContainer} ${tableStyles.name}`}>
          <AiOutlineFile size={18} className={classes.fileIcon} />
          <Typography variant="body2" className={`${classes.description}`}>
            {taskStatus?.task?.name || "--"}
          </Typography>
        </div>
      ),
    },
    {
      key: "type",
      content: (
        <Typography
          variant="body2"
          style={{
            color: "inherit",
            fontWeight: 500,
            overflowWrap: "anywhere",
            textTransform,
          }}
        >
          {taskType}
        </Typography>
      ),
    },
    {
      key: "processTime",
      content: (
        <Typography
          variant="body2"
          style={{
            color: "inherit",
            fontWeight: 500,
            overflowWrap: "anywhere",
          }}
        >
          {taskProcessTime}
        </Typography>
      ),
    },
    {
      key: "status",
      content: (
        <div className={`${classes.status} ${statusClass}`}>
          <Typography className={classes.typo} variant="body2">
            {taskStatus?.status?.replace(/-+/, " ") || "--"}
          </Typography>
        </div>
      ),
    },
    {
      key: "updatedAt",
      content: (
        <Typography
          variant="body2"
          style={{
            overflowWrap: "anywhere",
            fontWeight: 500,
            color: "inherit",
          }}
        >
          {updatedAt}
        </Typography>
      ),
    },
  ];

  return (
    <ListItem className={`${classes.root} ${tableStyles.root}`}>
      {listItemConfig.map(({ key, content }) => (
        <ListItemText
          key={key}
          style={{ flex: flexConfig[key] }}
          primary={content}
        />
      ))}
      {["pending", "in-progress"].includes(taskStatus?.status) && (
        <IconButton
          edge="end"
          role="moreIcon"
          onClick={handleMoreOptionClick}
          className={classes.iconButton}
        >
          <MoreVert style={{ fontSize: 21 }} />
        </IconButton>
      )}
    </ListItem>
  );
};

const ApprovalHistoryItem = ({ approvalHistoryItem, index, tableStyle }) => {
  //

  const renderText = (text, style = {}, truncate = false, length = 21) => {
    //
    style = {
      ...style,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    };

    return <Typography style={style}>{text ?? "--"}</Typography>;
  };

  const itemData = [
    {
      flex: 5,
      content: (
        <div className={tableStyle.name}>
          <div className="file">
            <AiOutlineFile size={18} />
          </div>
          <div
            variant="body2"
            style={{
              overflowWrap: "anywhere",
              color: "inherit",
              fontWeight: 500,
            }}
          >
            {renderText(
              `${approvalHistoryItem?.user?.firstName || ""} ${
                approvalHistoryItem?.user?.lastName || "--"
              }`,
              { fontSize: 12, fontWeight: 600 }
            )}
          </div>
        </div>
      ),
    },
    {
      flex: 3,
      content: renderText(approvalHistoryItem.decision, {
        fontSize: 12,
        fontWeight: 600,
      }),
    },
    {
      flex: 3,
      content: renderText(approvalHistoryItem.processTime, {
        fontSize: 12,
        fontWeight: 600,
      }),
    },
    {
      flex: 3,
      content: (
        <Tooltip
          title={approvalHistoryItem?.comment}
          aria-label="workflow instance id"
        >
          {renderText(
            approvalHistoryItem?.comment,
            { overflowWrap: "anywhere" },
            true
          )}
        </Tooltip>
      ),
    },
    {
      flex: 3,
      content: renderText(
        `${moment(approvalHistoryItem?.updatedAt).format("DD-MMM")} ${moment(
          approvalHistoryItem?.updatedAt
        ).format("HH:mm")}`,
        { fontSize: 12, fontWeight: 600 }
      ),
    },
  ];

  return (
    <ListItem
      key={`app-analytics-data-approval-history-${index}`}
      id={`app-analytics-data-approval-history-${index}`}
      className={tableStyle.root}
    >
      {itemData?.map((item, idx) => (
        <ListItemText
          key={idx}
          style={{ flex: item.flex }}
          primary={item?.content}
        />
      ))}
    </ListItem>
  );
};
