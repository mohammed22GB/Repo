import { useState, useEffect, useRef } from "react";
import { Button } from "@material-ui/core";
// import { handleUserGroupActions, handleAssignUserGroup } from "../../../../utils/userServices";
import "./components/style.css";
import { Close, Done, Remove } from "@material-ui/icons";
import moment from "moment";
import { getBillingSubscriptionAPI } from "./utils/billingSubscriptionAPIs";

const BillingSubscription = () => {
  const [subscriptionData, setSubscriptionData] = useState([]);

  useEffect(() => {
    document.title = "Settings | Billing & Subscription";
  }, []);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    const { account } = userInfo && JSON.parse(userInfo);

    const convertSubscriptionData = (data) => {
      return {
        ...data,
        metrics: Object.keys(data?.metrics || {}).map((mtc) => {
          return {
            metricName: mtc,
            ...(data?.metrics?.[mtc] || {}),
          };
        }),
      };
    };

    getBillingSubscriptionAPI(account?.id).then((data) => {
      const converted = convertSubscriptionData(data?.data?.activeSubscription);

      setSubscriptionData(converted);
    });
  }, []);

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
    } else return <>{data.usedUnits?.toLocaleString()}</>;
  };

  const getGuage = (data) => {
    if (data.isBoolean) return null;
    const usage =
      Math.round((100 * data.usedUnits) / data.totalUnits) / 100 || 0;
    const text = `${usage * 100}%`;

    const getGuageColor = () => {
      const lo = [78, 182, 78];
      const hi = [226, 80, 0];

      const col = [
        usage * (hi[0] - lo[0]) + lo[0],
        usage * (hi[1] - lo[1]) + lo[1],
        usage * (hi[2] - lo[2]) + lo[2],
      ];

      return `rgb(${col[0]}, ${col[1]}, ${col[2]})`;
    };

    const guage = (
      <div
        style={{
          width: "100%",
          height: 10,
          border: "solid 1px",
          borderColor: getGuageColor(),
          position: "relative",
          borderRadius: 5,
        }}
      >
        <div
          style={{
            width: text,
            height: 8,
            backgroundColor: getGuageColor(),
            textAlign: "center",
            borderRadius: 4,
          }}
        >
          <div
            className="guage-text"
            style={{ border: "solid 0.5px", borderColor: getGuageColor() }}
          >
            {text}
          </div>
        </div>
      </div>
    );

    return guage;
  };

  return (
    <div style={{ width: "100%", color: "#091540", marginTop: 20 }}>
      <div className="metrics-main">
        <div className="metrics-section">
          <div
            className="metrics-section-header"
            style={{ display: "flex", justifyContent: "flex-end", gap: 35 }}
          >
            <div style={{ marginRight: "auto" }}>Subscription Information</div>
            <div>
              Tier: <span className="tier">{subscriptionData.tier}</span>
            </div>
            <div>
              Status:{" "}
              <span className={`status ${subscriptionData.status}`}>
                {subscriptionData.status}
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 100,
            }}
          >
            <div className="_flexCol">
              <div>
                Sub. ID: <span>{subscriptionData.invoice}</span>
              </div>
              <div>
                Amount: <span>{subscriptionData.amount}</span>
              </div>
            </div>
            <div className="_flexCol">
              <div>
                Sub. Date:{" "}
                <span>
                  {moment(subscriptionData.createdAt).format("MMMM DD, YYYY")}
                </span>
              </div>
              <div>
                Expiry Date:{" "}
                <span>
                  {subscriptionData.expiryDate
                    ? moment(subscriptionData.expiryDate).format(
                        "MMMM DD, YYYY"
                      )
                    : "--"}
                </span>
              </div>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <Button
                variant="outlined"
                style={{ textTransform: "none" }}
                disabled
                // onClick={() => handleModalOpen("add", "")}
              >
                Contact Sales Team
              </Button>
            </div>
          </div>
        </div>

        <div className="metrics-section">
          <div className="metrics-section-header">Usage Metrics</div>
          <div className="metrics-table">
            <ul className="metrics-table-header metrics-table-row">
              <li className="row-col-1">S/N</li>
              <li className="row-col-2">Service Name</li>
              <li className="row-col-3">No. of Units</li>
              <li className="row-col-4">Used Units</li>
              <li className="row-col-5">Percentage Usage</li>
            </ul>
            <ul className="metrics-table-rows">
              {subscriptionData?.metrics?.map((metric, index) => {
                return (
                  <li key={index}>
                    <ul className="metrics-table-row">
                      <li className="row-col-1">{`${index + 1}.`}</li>
                      <li className="row-col-2">{metric.metricName}</li>
                      <li className="row-col-3">{getTotalUnits(metric)}</li>
                      <li className="row-col-4">{getUsedUnits(metric)}</li>
                      <li
                        className="row-col-5"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        {getGuage(metric)}
                      </li>
                    </ul>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingSubscription;
