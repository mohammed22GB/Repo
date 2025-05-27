import { ListItem, ListItemText, Tooltip, Typography } from "@material-ui/core";
import moment from "moment";
import { AiOutlineFile } from "react-icons/ai";
import { Link } from "react-router-dom";
import { SingleWorkflowStyle } from "./style";
import { mainNavigationUrls } from "../../common/utils/lists";
import { getProcessTime } from "../../common/helpers/helperFunctions";

const SingleWorkflow = ({ item, handleModalOpen, actions, mode, swIndex }) => {
  let startTime = moment(item?.createdAt);
  let endTime = moment(item?.updatedAt);

  const classes = SingleWorkflowStyle();

  return (
    <div id={`analytics-single-workflow-${swIndex}`}>
      <ListItem
        className={classes.root}
        style={mode === "single" ? {} : { padding: 12 }}
      >
        <ListItemText
          style={{ flex: 6 }}
          primary={
            <div className={classes.name}>
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
                  {item?.app?.name}
                </Typography>
                <Typography
                  variant="body2"
                  style={{ overflowWrap: "anywhere", color: "grey" }}
                >
                  {moment(item?.createdAt).format("DD-MMM-YYYY")}
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
                overflowWrap: "anywhere",
                color: "inherit",
                fontWeight: 500,
              }}
            >
              {item?.user?.firstName || ""} {item?.user?.lastName || "--"}
            </Typography>
          }
        />
        <ListItemText
          style={{ flex: 3 }}
          primary={
            <Typography
              variant="body2"
              style={{
                overflowWrap: "anywhere",
                color: "inherit",
                fontWeight: 500,
              }}
            >
              {item?.app?.category?.name || "--"}
            </Typography>
          }
        />
        <ListItemText
          style={{ flex: 3 }}
          primary={
            <Typography
              variant="body2"
              style={{
                overflowWrap: "anywhere",
                color: "inherit",
                fontWeight: 500,
              }}
            >
              {moment(item?.updatedAt).format("DD-MMM-YYYY") || "--"}
              <span
                style={{ display: "block", color: "grey", fontWeight: 300 }}
              >
                {moment(item?.updatedAt).format("h:mm:ss a") || "--"}
              </span>
            </Typography>
          }
        />
        <ListItemText
          style={{ flex: 3 }}
          primary={
            <Typography
              variant="body2"
              style={{
                overflowWrap: "anywhere",
                color: "inherit",
                fontWeight: 500,
              }}
            >
              {`${getProcessTime(endTime.diff(startTime, "minutes"))}`}
            </Typography>
          }
        />
        <ListItemText
          style={{ flex: 3 }}
          primary={
            <div className={`${classes.status} ${item?.status}`}>
              {item?.status?.replace(/-+/, " ") || "--"}
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
                color: "inherit",
                fontWeight: 500,
              }}
            >
              {item?.task?.name || "--"}
            </Typography>
          }
        />
        {!!actions && (
          <ListItemText
            style={{ flex: 2 }}
            primary={
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  {/* <Tooltip title="Pause" aria-label="pause"><BsPauseFill style={{ fontSize: 18, cursor: "pointer", color: "#3D98EB" }} onClick={() => handleModalOpen('view', item)} /></Tooltip>
                            <Tooltip title="Stop" aria-label="stop"><BsStopFill style={{ fontSize: 18, cursor: "pointer", color: "#D00026" }} onClick={() => handleModalOpen('update', item)} /></Tooltip> */}
                  <Tooltip title="Open details" aria-label="expand">
                    <Typography
                      variant="body2"
                      style={{
                        cursor: "pointer",
                        textDecoration: "underline",
                        paddingLeft: 5,
                      }}
                    >
                      <Link
                        style={{ color: "black" }}
                        to={`${mainNavigationUrls.ANALYTICS}/${item?.id}`}
                      >
                        Details
                      </Link>
                    </Typography>
                  </Tooltip>
                </div>
              </div>
            }
          />
        )}
      </ListItem>
    </div>
  );
};

export default SingleWorkflow;
