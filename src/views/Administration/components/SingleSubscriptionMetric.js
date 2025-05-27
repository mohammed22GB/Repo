import React from "react";
import { useHistory } from "react-router";
import { Typography, ListItem, ListItemText } from "@material-ui/core";
import { Close, Done, Remove } from "@material-ui/icons";

import useStyles from "./style";

const SingleSubscriptionMetric = ({ data, index }) => {
  const classes = useStyles();
  const history = useHistory();

  const getTotalUnits = (data) => {
    if (data.isBoolean) {
      return data.totalUnits ? (
        <Done style={{ fontSize: 16 }} />
      ) : (
        <Close style={{ fontSize: 16 }} />
      );
    } else return <>{data.totalUnits?.toLocaleString()}</>;
  };
  const getUsedUnits = (data) => {
    if (data.isBoolean) {
      return <Remove style={{ fontSize: 16 }} />;
    } else return <>{(data.usedUnits || 0)?.toLocaleString()}</>;
  };

  const getGuageColor = (usage) => {
    const lo = [78, 182, 78];
    const hi = [226, 80, 0];

    const col = [
      usage * (hi[0] - lo[0]) + lo[0],
      usage * (hi[1] - lo[1]) + lo[1],
      usage * (hi[2] - lo[2]) + lo[2],
    ];

    return `rgb(${col[0]}, ${col[1]}, ${col[2]})`;
  };

  const getGuage = (data) => {
    if (data.isBoolean) {
      return null;
    }

    const usage = Math.min(
      Math.round((100 * (data.usedUnits || 0)) / (data.totalUnits || 1)) / 100,
      1
    );
    const text = `${Math.round(usage * 100)}%`;

    const guage = (
      <div
        style={{
          boxShadow: `0 0 3px ${getGuageColor(usage)}`,
          borderRadius: 10,
        }}
      >
        <div
          style={{
            width: "100%",
            height: 10,
            // border: "solid 1px",
            // borderColor: getGuageColor(usage),
            position: "relative",
            borderRadius: 5,
          }}
        >
          <div
            style={{
              width: text,
              height: 10,
              backgroundColor: getGuageColor(usage),
              textAlign: "right",
              borderRadius: 4,
            }}
          >
            <div
              className="guage-text"
              style={{
                backgroundColor: "white",
                width: 22,
                height: 16,
                fontSize: 9,
                // boxShadow: "0 0 2px black",
                border: "solid 0.5px",
                borderColor: getGuageColor(usage),
                borderRadius: 5,
                display: "inline-block",
                marginTop: -3,
                position: "absolute",
                marginLeft: -11,
                lineHeight: "16px",
                textAlign: "center",
              }}
            >
              {text}
            </div>
          </div>
        </div>
      </div>
    );

    return guage;
  };

  return (
    <>
      <div
        className="table-row_"
        key={`data-${data._id}`}
        // style={{
        //   display: isDeleted ? "none" : "flex",
        // }}
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
          boxShadow: "0px 0px 4px rgba(110, 110, 110, 0.25)",
          marginTop: 1,
          marginBottom: 1,
        }}
      >
        <ListItem
          className={classes.table}
          style={{ paddingLeft: 0, paddingRight: 0 }}
        >
          <ListItemText
            style={{ flex: 0.3, minWidth: 32 }}
            primary={
              <Typography style={{ paddingRight: 5, textAlign: "right" }}>
                {`${Number(index + 1)}.`}
              </Typography>
            }
          />
          <ListItemText
            style={{ flex: 1.5 }}
            primary={
              <div className={classes.name}>
                <div className="description">
                  <Typography style={{ overflowWrap: "anywhere" }}>
                    {data.metricName}
                  </Typography>
                </div>
              </div>
            }
          />
          <ListItemText
            style={{ flex: 0.8 }}
            primary={
              <Typography
                style={{ overflowWrap: "anywhere", textAlign: "center" }}
              >
                {getTotalUnits(data)}
              </Typography>
            }
          />
          <ListItemText
            style={{ flex: 0.8 }}
            primary={
              <div>
                <Typography
                  style={{ overflowWrap: "anywhere", textAlign: "center" }}
                >
                  {getUsedUnits(data)}
                </Typography>
              </div>
            }
          />
          <ListItemText
            style={{ flex: 2 }}
            primary={<div style={{ marginRight: 30 }}>{getGuage(data)}</div>}
          />
        </ListItem>
      </div>
    </>
  );
};

export default SingleSubscriptionMetric;
