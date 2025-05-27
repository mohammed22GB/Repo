import { ListItem, ListItemText, Tooltip, Typography } from "@material-ui/core";
import moment from "moment";
import { AiOutlineFile } from "react-icons/ai";
import { Link } from "react-router-dom";
import { SingleWorkflowStyle } from "./singleRecordStyle";
import { mainNavigationUrls } from "../../../common/utils/lists";
import { getProcessTime } from "../../../common/helpers/helperFunctions";

const SingleWorkflow = ({ item, handleModalOpen, actions, mode, swIndex }) => {
  const classes = SingleWorkflowStyle();

  const renderText = (content, style = {}, extraContent = null) => {
    return (
      <Typography variant="body2" style={{ ...style }}>
        {content || "--"}
        {extraContent}
      </Typography>
    );
  };

  const listItemData = [
    {
      flex: 6,
      content: (
        <div className={classes.name}>
          <div className="file">
            <AiOutlineFile size={18} />
          </div>
          <div className="description">
            {renderText(item?.app?.name, {
              color: "inherit",
              fontWeight: 500,
            })}
            {renderText(moment(item?.createdAt).format("DD-MMM-YYYY"), {
              color: "grey",
            })}
          </div>
        </div>
      ),
    },
    {
      flex: 3,
      content: renderText(
        `${item?.user?.firstName || ""} ${item?.user?.lastName || "--"}`,
        { color: "inherit", fontWeight: 500 }
      ),
    },
    {
      flex: 3,
      content: renderText(item?.app?.category?.name, {
        color: "inherit",
        fontWeight: 500,
      }),
    },
    {
      flex: 3,
      content: renderText(
        moment(item?.updatedAt).format("DD-MMM-YYYY"),
        { color: "inherit", fontWeight: 500 },
        <span style={{ display: "block", color: "grey", fontWeight: 300 }}>
          {moment(item?.updatedAt).format("h:mm:ss a")}
        </span>
      ),
    },
    {
      flex: 3,
      content: renderText(
        `${getProcessTime(
          moment(item?.updatedAt).diff(moment(item?.createdAt), "minutes")
        )}`,
        { color: "inherit", fontWeight: 500 }
      ),
    },
    {
      flex: 3,
      content: (
        <div className={`${classes.status} ${item?.status}`}>
          {renderText(item?.status?.replace(/-+/, " "), {
            color: "#FFFFFF",
            fontWeight: 500,
          })}
        </div>
      ),
    },
    {
      flex: 3,
      content: renderText(item?.task?.name, {
        color: "inherit",
        overflowWrap: "anywhere",
        fontWeight: 500,
      }),
    },
  ];

  return (
    <div
      id={`analytics-single-workflow-${swIndex}`}
      className={classes.maxContent}
    >
      <ListItem
        className={`${classes.root} ${classes.maxContent}`}
        style={mode === "single" ? {} : { padding: 12 }}
      >
        {listItemData?.map((data, index) => {
          return (
            <ListItemText
              key={index}
              style={{
                flex: data?.flex,
                paddingLeft: index === 0 ? "1rem" : 0,
              }}
              primary={data?.content}
            />
          );
        })}

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
                <Tooltip title="Open details" aria-label="expand">
                  {renderText(
                    <Link
                      to={`${mainNavigationUrls.ANALYTICS}/${item?.id}`}
                      style={{ color: "black", textDecoration: "underline" }}
                    >
                      Details
                    </Link>,
                    { cursor: "pointer", paddingLeft: 5 }
                  )}
                </Tooltip>
              </div>
            }
          />
        )}
      </ListItem>
    </div>
  );
};

export default SingleWorkflow;
