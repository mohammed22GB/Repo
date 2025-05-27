//
import {
  Grid,
  ListItem,
  ListItemText,
  ListSubheader,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import MoreVert from "@material-ui/icons/MoreVert";
import { AiOutlineFile } from "react-icons/ai";

import { getSingleWorkflowInstance, reminderMail } from "./AnalyticsApis";
import {
  singleWorkflowInstanceStyle,
  SingleWorkflowStyle,
} from "./component/style";
import moment from "moment";
import SingleWorkflow from "./component/SingleWorkflow";
import PendingTaskMenuList from "./component/PendingTaskMenuList";
import AnalyticsSidebar from "./component/AnalyticsSidebar";
import { errorToastify, successToastify } from "../common/utils/Toastify";
import MainPageLayout from "../common/components/AppLayout/MainPageLayout";
import { mainNavigationListNames } from "../common/utils/lists";
import { getProcessTimeBySeconds } from "../common/helpers/helperFunctions";

const SingleWorkflowAnalytics = () => {
  const history = useHistory();
  const classes = singleWorkflowInstanceStyle();
  const tableStyle = SingleWorkflowStyle();
  const [appAnalyticsData, setAppAnalyticsData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [variables, setVariables] = useState([]);
  const { id } = useParams();
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

  const handleChange = (lap) => {
    if (lap.isFinish) {
      setIsLoading(false);
    }
  };

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

  // close the dialog
  const handleCloseSidebar = () => {
    // dispatch({ type: SHOW_COLUMNBOX, payload: false });
    setShowSideBar(false);
  };
  const handleMoreOptionClick = (e, id) => {
    setAnchorEl(e.currentTarget);
    //setId(() => id);
  };

  const removeRepetitionsAndSort = (taskStatuses) => {
    /* first, sort the taskStatuses by updatedAt, in descending order */
    const taskStatuses_ = [...taskStatuses];
    const sortedStatuses = taskStatuses_?.sort(
      (a, b) => new Date(b?.updatedAt) - new Date(a?.updatedAt)
    );

    const trimmedStatuses = sortedStatuses?.reduce((acc, current) => {
      // Check if the current type is different from the last one in the accumulator
      if (acc.length === 0 || acc[acc.length - 1].type !== current.type) {
        acc.push(current);
      }
      return acc;
    }, []);

    /* get process time intervals */
    const finalStatuses = trimmedStatuses?.map((taskStatus, index) => {
      /* for the start task, processTime is 0 */
      if (index === trimmedStatuses.length - 1) {
        taskStatus.processTime = "0 secs";
      } else {
        taskStatus.processTime = getProcessTimeBySeconds(
          new Date(taskStatus.updatedAt).getTime() -
            new Date(trimmedStatuses[index + 1].updatedAt).getTime()
        );
      }

      return taskStatus;
    });

    return finalStatuses;
  };

  return (
    <>
      <MainPageLayout
        headerTitle={mainNavigationListNames.ANALYTICS}
        pageTitle={appAnalyticsData?.app?.name}
        pageSubtitle={appAnalyticsData?.app?.description}
        appsControlMode={null}
        categories={null}
        isLoading={isLoading}
        handleChange={handleChange}
        // topBar={topBar}
        hasGoBack={true}
        onAddNew={null}
      >
        {!isLoading && (
          <Grid container style={{ gap: 20 }}>
            <Grid container justifyContent="center">
              <Grid item xs={12} className="analytics-summary-outer">
                <div className={`${classes.layout} ${classes.summary}`}>
                  <p className={classes.heading}>Summary</p>
                  <ul className={classes.ul}>
                    <ListSubheader
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "#FFFFFF",
                        padding: "0",
                      }}
                    >
                      <ListItemText
                        style={{ flex: 6 }}
                        primary={
                          <Typography style={{ fontSize: 12, fontWeight: 600 }}>
                            Name
                          </Typography>
                        }
                      />
                      <ListItemText
                        style={{ flex: 3 }}
                        primary={
                          <Typography style={{ fontSize: 12, fontWeight: 600 }}>
                            Initiator
                          </Typography>
                        }
                      />
                      <ListItemText
                        style={{ flex: 3 }}
                        primary={
                          <Typography style={{ fontSize: 12, fontWeight: 600 }}>
                            Categories
                          </Typography>
                        }
                      />
                      <ListItemText
                        style={{ flex: 3 }}
                        primary={
                          <Typography style={{ fontSize: 12, fontWeight: 600 }}>
                            Last modified
                          </Typography>
                        }
                      />
                      <ListItemText
                        style={{ flex: 3 }}
                        primary={
                          <Typography style={{ fontSize: 12, fontWeight: 600 }}>
                            Process time
                          </Typography>
                        }
                      />
                      <ListItemText
                        style={{ flex: 3 }}
                        primary={
                          <Typography
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              // fontSize: "0.9em",
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
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              // fontSize: "0.9em",
                              textAlign: "left",
                            }}
                          >
                            Current task
                          </Typography>
                        }
                      />
                    </ListSubheader>
                  </ul>
                  <SingleWorkflow
                    actions={false}
                    item={appAnalyticsData}
                    mode="single"
                  />
                </div>
              </Grid>
            </Grid>
            <Grid
              container
              style={{ gap: 20 }}
              justifyContent="space-between"
              className="analytics-details-histories"
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
                      backgroundColor: "#FFFFFF",
                      padding: "0",
                      marginBottom: 2,
                    }}
                  >
                    <ListItemText
                      style={{ flex: 5 }}
                      primary={
                        <Typography style={{ fontSize: 12, fontWeight: 600 }}>
                          Task
                        </Typography>
                      }
                    />
                    <ListItemText
                      style={{ flex: 3 }}
                      primary={
                        <Typography style={{ fontSize: 12, fontWeight: 600 }}>
                          Node
                        </Typography>
                      }
                    />
                    <ListItemText
                      style={{ flex: 3 }}
                      primary={
                        <Typography style={{ fontSize: 12, fontWeight: 600 }}>
                          Process Time
                        </Typography>
                      }
                    />
                    <ListItemText
                      style={{ flex: 3 }}
                      primary={
                        <Typography style={{ fontSize: 12, fontWeight: 600 }}>
                          Status
                        </Typography>
                      }
                    />
                    <ListItemText
                      style={{ flex: 3 }}
                      primary={
                        <Typography style={{ fontSize: 12, fontWeight: 600 }}>
                          Timestamp
                        </Typography>
                      }
                    />
                  </ListSubheader>
                </ul>
                <div className="scroll">
                  {removeRepetitionsAndSort(appAnalyticsData?.taskStatus)?.map(
                    (singletaskStatus, index) => (
                      <ListItem
                        key={`app-analytics-data-task-status-${index}`}
                        id={`app-analytics-data-task-status-${index}`}
                        className={tableStyle.root}
                      >
                        <ListItemText
                          style={{ flex: 5 }}
                          primary={
                            <div className={tableStyle.name}>
                              <div className="file">
                                <AiOutlineFile size={18} />
                              </div>
                              <div className="description">
                                <Typography
                                  variant="body2"
                                  style={{
                                    overflowWrap: "anywhere",
                                    color: "inherit",
                                    fontWeight: 500,
                                  }}
                                >
                                  {singletaskStatus?.task?.name}
                                </Typography>
                              </div>
                            </div>
                          }
                        />
                        <ListItemText
                          style={{ flex: 3 }}
                          primary={
                            <Typography
                              variant="body2"
                              style={{
                                color: "inherit",
                                fontWeight: 500,
                                overflowWrap: "anywhere",
                                textTransform: [
                                  "StartTask",
                                  "EndTask",
                                ].includes(
                                  singletaskStatus?.type ||
                                    singletaskStatus?.task?.type
                                )
                                  ? "uppercase"
                                  : "capitalize",
                              }}
                            >
                              {(
                                singletaskStatus?.type ||
                                singletaskStatus?.task?.type
                              )
                                ?.replace(
                                  /[A-Z]/g,
                                  (v) => ` ${v.toLowerCase()}`
                                )
                                ?.trim() || "--"}
                            </Typography>
                          }
                        />
                        <ListItemText
                          style={{ flex: 3 }}
                          primary={
                            <div className={tableStyle.processTime}>
                              <div className="description">
                                <Typography
                                  variant="body2"
                                  style={{
                                    overflowWrap: "anywhere",
                                    color: "inherit",
                                    fontWeight: 500,
                                  }}
                                >
                                  {singletaskStatus?.processTime}
                                </Typography>
                              </div>
                            </div>
                          }
                        />
                        <ListItemText
                          style={{ flex: 3 }}
                          primary={
                            <div
                              className={`${tableStyle.status} ${
                                singletaskStatus?.status === "successful"
                                  ? "completed"
                                  : singletaskStatus?.status === "in-progress"
                                  ? "in-progress"
                                  : singletaskStatus?.status
                              }`}
                            >
                              {singletaskStatus?.status?.replace(/-+/, " ") ||
                                "--"}
                            </div>
                          }
                        />
                        <ListItemText
                          style={{ flex: 3 }}
                          primary={
                            <Typography
                              variant="body2"
                              style={{
                                overflowWrap: "anywhere",
                                fontWeight: 500,
                                color: "inherit",
                              }}
                            >
                              {moment(singletaskStatus?.updatedAt).format(
                                "DD-MMM"
                              ) || "--"}{" "}
                              {moment(singletaskStatus?.updatedAt).format(
                                "HH:mm"
                              )}
                            </Typography>
                          }
                        />
                        {["pending", "in-progress"].includes(
                          singletaskStatus?.status
                        ) && (
                          <IconButton
                            edge="end"
                            aria-describedby={id}
                            onClick={(e) => handleMoreOptionClick(e)}
                            style={{
                              padding: 7,
                              height: 36,
                              marginLeft: 9,
                              position: "absolute",
                              right: 0,
                              backgroundColor: "#ffffffdd",
                              border: "solid 1px #eee",
                            }}
                          >
                            <MoreVert style={{ fontSize: 21 }} />
                          </IconButton>
                        )}
                      </ListItem>
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
                      backgroundColor: "#FFFFFF",
                      padding: "0",
                      marginBottom: 2,
                    }}
                  >
                    <ListItemText
                      style={{ flex: 5, overflowWrap: "anywhere" }}
                      primary={
                        <Typography style={{ fontSize: 12, fontWeight: 600 }}>
                          Approver
                        </Typography>
                      }
                    />
                    <ListItemText
                      style={{ flex: 3, overflowWrap: "anywhere" }}
                      primary={
                        <Typography style={{ fontSize: 12, fontWeight: 600 }}>
                          Action
                        </Typography>
                      }
                    />
                    <ListItemText
                      style={{ flex: 3, overflowWrap: "anywhere" }}
                      primary={
                        <Typography style={{ fontSize: 12, fontWeight: 600 }}>
                          Process Time
                        </Typography>
                      }
                    />
                    <ListItemText
                      style={{ flex: 3, overflowWrap: "anywhere" }}
                      primary={
                        <Typography style={{ fontSize: 12, fontWeight: 600 }}>
                          Comment
                        </Typography>
                      }
                    />
                    <ListItemText
                      style={{ flex: 3, overflowWrap: "anywhere" }}
                      primary={
                        <Typography style={{ fontSize: 12, fontWeight: 600 }}>
                          Timestamp
                        </Typography>
                      }
                    />
                  </ListSubheader>
                </ul>
                <div className="scroll">
                  {removeRepetitionsAndSort(
                    appAnalyticsData?.approvalHistory
                  )?.map((approvalHistoryItem, index) => (
                    <ListItem
                      key={`app-analytics-data-approval-history-${index}`}
                      id={`app-analytics-data-approval-history-${index}`}
                      className={tableStyle.root}
                    >
                      <ListItemText
                        style={{ flex: 5 }}
                        primary={
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
                              <Typography
                                style={{ fontSize: 12, fontWeight: 600 }}
                              >
                                {approvalHistoryItem?.user?.firstName || ""}{" "}
                                {approvalHistoryItem?.user?.lastName || "--"}
                              </Typography>
                            </div>
                          </div>
                        }
                      />
                      <ListItemText
                        style={{ flex: 3 }}
                        primary={
                          <Typography style={{ fontSize: 12, fontWeight: 600 }}>
                            {approvalHistoryItem.decision || "--"}
                          </Typography>
                        }
                      />
                      <ListItemText
                        style={{ flex: 3 }}
                        primary={
                          <Typography style={{ fontSize: 12, fontWeight: 600 }}>
                            {approvalHistoryItem.processTime || "--"}
                          </Typography>
                        }
                      />
                      <ListItemText
                        style={{ flex: 3 }}
                        primary={
                          <Tooltip
                            title={approvalHistoryItem?.comment}
                            aria-label="workflow instance id"
                          >
                            <Typography style={{ overflowWrap: "anywhere" }}>
                              {`${
                                approvalHistoryItem?.comment?.length > 21
                                  ? approvalHistoryItem?.comment?.substr(
                                      0,
                                      21
                                    ) + "..."
                                  : approvalHistoryItem?.comment?.substr(0, 21)
                              }` || "--"}
                            </Typography>
                          </Tooltip>
                        }
                      />
                      <ListItemText
                        style={{ flex: 3 }}
                        primary={
                          <Typography style={{ fontSize: 12, fontWeight: 600 }}>
                            {moment(approvalHistoryItem?.updatedAt).format(
                              "DD-MMM"
                            ) || "--"}{" "}
                            {moment(approvalHistoryItem?.updatedAt).format(
                              "HH:mm"
                            ) || "--"}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
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
      </MainPageLayout>
    </>
  );
};

export default SingleWorkflowAnalytics;
