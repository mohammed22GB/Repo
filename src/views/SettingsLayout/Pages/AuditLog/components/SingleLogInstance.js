import moment from "moment";
import useStyles from "./styles";
import { useState } from "react";
import dropdown from "../../../../../assets/images/dropdown-activity-log.svg";
import dropdownup from "../../../../../assets/images/dropdownup-activity-log.svg";
import { ListItemText, ListItem, Tooltip, Typography } from "@material-ui/core";

const SingleLogInstance = ({ item, indexKey }) => {
  const classes = useStyles();
  const [showMoreLogs, setShowMoreLogs] = useState(false);

  return (
    <div key={indexKey} className={classes.auditedDataBackground}>
      <div>
        <Tooltip
          title={showMoreLogs ? "Close log" : "Open log"}
          aria-label="expand"
          placement="left"
        >
          <ListItem
            className={classes.listItem}
            onClick={() => {
              setShowMoreLogs((prevValue) => !prevValue);
            }}
          >
            <ListItemText
              style={{ flex: 3 }}
              primary={
                <Typography variant="body2" className={classes.itemText}>
                  <img
                    src={showMoreLogs ? dropdownup : dropdown}
                    alt="dropdown for activity logs"
                    style={{ paddingRight: 5 }}
                  />
                  {item?.initiatorDetails?.firstName || "--"}{" "}
                  {item?.initiatorDetails?.lastName || "--"}
                </Typography>
              }
            />
            <ListItemText
              style={{ flex: 3 }}
              primary={
                <Typography variant="body2" className={classes.itemText}>
                  {item?.resource || "--"}
                </Typography>
              }
            />
            <ListItemText
              style={{ flex: 3 }}
              primary={
                <Typography variant="body2" className={classes.itemText}>
                  {item?.eventType || "--"}
                </Typography>
              }
            />
            <ListItemText
              style={{ flex: 3 }}
              primary={
                <Typography variant="body2" className={classes.itemText}>
                  {item?.ipAddress || "--"}
                </Typography>
              }
            />
            <ListItemText
              style={{
                flex: 3.5,
              }}
              primary={
                <Tooltip
                  title={
                    item?.initiatorDetails?.deviceType?.summary ||
                    "Device type not specified."
                  }
                  aria-label="expand"
                  placement="top"
                >
                  <Typography
                    variant="body2"
                    className={classes.itemDeviceTypeText}
                  >
                    {item?.initiatorDetails?.deviceType?.summary ||
                      "Device type not specified."}
                  </Typography>
                </Tooltip>
              }
            />
            <ListItemText
              style={{ flex: 3 }}
              primary={
                <Typography variant="body2" className={classes.itemText}>
                  {moment(item?.requestTimeStamp).format(
                    "YYYY/MM/DD hh:mm A"
                  ) || "--"}
                </Typography>
              }
            />
          </ListItem>
        </Tooltip>
      </div>

      {showMoreLogs && (
        <div
          style={{
            paddingLeft: "40px",
            paddingTop: "4px",
          }}
        >
          <div className={classes.itemSubBox}>
            {item?.initiatorDetails?.employeeId && (
              <div className={classes.itemShowMore}>
                <ListItemText
                  style={{ flex: 0.5 }}
                  primary={
                    <Typography variant="body2" className={classes.itemSubText}>
                      Employee ID
                    </Typography>
                  }
                />
                <ListItemText
                  style={{ flex: 4 }}
                  primary={
                    <Typography
                      variant="body2"
                      className={classes.itemContentText}
                    >
                      <span className={classes.itemSpan}></span>
                      {item?.initiatorDetails?.employeeId}
                    </Typography>
                  }
                />
              </div>
            )}

            {item?.initiatorDetails?.userId && (
              <div className={classes.itemShowMore}>
                <ListItemText
                  style={{ flex: 0.5 }}
                  primary={
                    <Typography variant="body2" className={classes.itemSubText}>
                      User ID
                    </Typography>
                  }
                />
                <ListItemText
                  style={{ flex: 4 }}
                  primary={
                    <Typography
                      variant="body2"
                      className={classes.itemContentText}
                    >
                      <span className={classes.itemSpan}></span>
                      {item?.initiatorDetails?.userId}
                    </Typography>
                  }
                />
              </div>
            )}

            {item?.initiatorDetails?.userEmail && (
              <div className={classes.itemShowMore}>
                <ListItemText
                  style={{ flex: 0.5 }}
                  primary={
                    <Typography variant="body2" className={classes.itemSubText}>
                      User email
                    </Typography>
                  }
                />
                <ListItemText
                  style={{ flex: 4 }}
                  primary={
                    <Typography
                      variant="body2"
                      className={classes.itemContentText}
                    >
                      <span className={classes.itemSpan}></span>
                      {item?.initiatorDetails?.userEmail}
                    </Typography>
                  }
                />
              </div>
            )}

            {item?.source && (
              <div className={classes.itemShowMore}>
                <ListItemText
                  style={{ flex: 0.5 }}
                  primary={
                    <Typography variant="body2" className={classes.itemSubText}>
                      User source
                    </Typography>
                  }
                />
                <ListItemText
                  style={{ flex: 4 }}
                  primary={
                    <Typography
                      variant="body2"
                      className={classes.itemContentText}
                    >
                      <span className={classes.itemSpan}></span>
                      {item?.source}
                    </Typography>
                  }
                />
              </div>
            )}

            {item?.initiatorDetails?.userRole && (
              <div className={classes.itemShowMore}>
                <ListItemText
                  style={{ flex: 0.5 }}
                  primary={
                    <Typography variant="body2" className={classes.itemSubText}>
                      User role
                    </Typography>
                  }
                />
                <ListItemText
                  style={{ flex: 4 }}
                  primary={
                    <div className={classes.itemUserRoleSection}>
                      {item?.initiatorDetails?.userRole.map((item, index) => (
                        <Typography
                          variant="body2"
                          key={index}
                          className={classes.itemUserRole}
                        >
                          {item}
                        </Typography>
                      ))}
                    </div>
                  }
                />
              </div>
            )}

            {item?.url && (
              <div className={classes.itemShowMore}>
                <ListItemText
                  style={{ flex: 0.5 }}
                  primary={
                    <Typography variant="body2" className={classes.itemSubText}>
                      URL
                    </Typography>
                  }
                />
                <ListItemText
                  style={{ flex: 4 }}
                  primary={
                    <Typography
                      variant="body2"
                      className={classes.itemContentText}
                    >
                      <span className={classes.itemSpan}></span>
                      {item?.url}
                    </Typography>
                  }
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleLogInstance;
