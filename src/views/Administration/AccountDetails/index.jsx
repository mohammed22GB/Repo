import React, { useState, useEffect } from "react";
import {
  Typography,
  List,
  ListSubheader,
  ListItemText,
  Grid,
  Button,
} from "@material-ui/core";
import { useLocation } from "react-router-dom";
import ReactSpinnerTimer from "react-spinner-timer";
import moment from "moment";

import useStyles from "../components/style";
import {
  getBillingSubscriptionAPI,
  newBillingSubscriptionAPI,
  updateBillingSubscriptionAPI,
} from "../../SettingsLayout/Pages/BillingSubscription/utils/billingSubscriptionAPIs";
import SingleSubscriptionMetric from "../components/SingleSubscriptionMetric";
import UpdateSubscriptionDialog from "../components/UpdateSubscriptionDialog";
import { successToastify } from "../../common/utils/Toastify";
import MainPageLayout from "../../common/components/AppLayout/MainPageLayout";
import { mainNavigationListNames } from "../../common/utils/lists";
import useCustomQuery from "../../common/utils/CustomQuery";
import { getOrganizationDetails } from "../utils/administrationAPIs";

const AccountDetails = () => {
  const location = useLocation();
  const classes = useStyles();
  const [orgDetails, setOrgDetails] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  const [isLap, setIsLap] = useState(true);
  const [pageNo, setPageNo] = useState(0);
  const [subscriptionData, setSubscriptionData] = useState({});
  const [noSubscription, setNoSubscription] = useState(false);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);

  useEffect(() => {
    document.title = "Account Details";
  }, []);

  useEffect(() => {
    const orgId = location.state?._id;
    if (!orgId) {
      return;
    }

    getBillingSubscriptionAPI(orgId).then((data) => {
      if (!data?._meta?.success) {
        return;
      }

      const subInfo = data?.data?.activeSubscription;
      if (!subInfo?.account) {
        setNoSubscription(true);
        return;
      }
      const converted = convertSubscriptionData(subInfo);
      !!converted && setSubscriptionData(converted);
    });
  }, [location.state?._id]);

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

  const deconvertSubscriptionData = (data) => {
    const metric_ = {};
    data.metrics.forEach((mtc) => {
      const metricName = mtc.metricName;
      // delete mtc.metricName;
      metric_[metricName] = {
        totalUnits: mtc.totalUnits,
      };
    });

    return {
      ...data,
      metrics: metric_,
    };
  };

  const handleChange = (lap) => {
    if (lap.isFinish) {
      setIsLap(false);
    }
  };

  const handlePageChange = (e) => {
    if (e.target.value) {
      setPageNo(e.target.value - 1);
    }
  };

  // fetch Organization detail
  const options = {
    query: {
      // population: ["users"],
      ID: location.state?._id,
      population: [{ path: "categories" }],
    },
  };
  const onGetUsersSuccess = ({ data }) => {
    const loadedData = data.data[0];
    const mappedData = [
      {
        title: "Organisation name",
        value: loadedData.name,
      },
      {
        title: "Date created",
        value: moment(loadedData.createdAt).format("YYYY-MM-DD | HH:mm"),
      },
      {
        title: "Admin name",
        value: loadedData.name,
      },
      {
        title: "Email address",
        value: loadedData.email,
      },
      {
        title: "Phone Number",
        value: loadedData.phone,
      },
      {
        title: "Industry",
        value: loadedData.industry,
      },
      {
        title: "Location",
        value: loadedData.country,
      },
      {
        title: "No. of employees",
        value: loadedData.noOfEmployee,
      },
      {
        title: "No. of sessions",
        value: loadedData.sessions,
      },
      {
        title: "Total users",
        value: loadedData.totalUsers?.[0]?.total,
      },
      {
        title: "Total draft apps",
        value: loadedData.totalApps?.[0]?.total,
      },
      {
        title: "Total live apps",
        value: loadedData.totalApps?.[0]?.total,
      },
      {
        title: "Total integrations",
        value: loadedData.integrations?.length,
      },
      {
        title: "Last user login",
        value: loadedData.login,
      },
    ];
    setOrgDetails(mappedData);
  };

  const { isLoading, isFetching } = useCustomQuery({
    queryKey: ["orgDetails", options, location.state?._id],
    apiFunc: getOrganizationDetails,
    onSuccess: onGetUsersSuccess,
  });

  const saveSubscriptionData = async (data) => {
    let resp;
    if (subscriptionData?.id || subscriptionData?._id) {
      resp = await updateBillingSubscriptionAPI({
        id: subscriptionData.id,
        data: deconvertSubscriptionData(data),
      });
    } else {
      const orgId = location.state?._id;
      if (!orgId) {
        return;
      }
      resp = await newBillingSubscriptionAPI({
        data: {
          ...deconvertSubscriptionData(data),
          orgId,
        },
      });
    }

    if (resp?._meta?.success) {
      successToastify(resp._meta.message);
      setSubscriptionData(data);
      setShowSubscriptionDialog(false);
      setNoSubscription(false);
    }
  };

  return (
    <>
      <MainPageLayout
        headerTitle={mainNavigationListNames.ADMINISTRATION}
        pageTitle="Account details"
        pageSubtitle="Details about organisation"
        appsControlMode={null}
        categories={null}
        isLoading={isLoading}
        topBar={null}
        hideSearbar
        hasGoBack
        handleChange={handleChange}
        // onAddNew={{ fn: () => setStep(1), tooltip: "Add new dashboard" }}
      >
        {/* here for the main area and contents */}
        <div>
          {/* GENERAL INFORMATION SECTION */}
          <div className={classes._sectionBox}>
            <div className={classes._sectionHeading}>General Information</div>
            <div className={classes._sectionSubheading}>
              View general information about the organisation here
            </div>
            <div className={classes._accountDetails}>
              {orgDetails.map((detail, indx) => (
                <div key={indx} className={classes._combo}>
                  <div className={classes._title}>{detail.title}</div>
                  <div className={classes._value}>{detail.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* SUBSCRIPTION SECTION */}
          <div className={classes._sectionBox}>
            <div className={classes._sectionHeading}>Subscription</div>
            <div className={classes._sectionSubheading}>
              View information about organisation's current subscription here
            </div>
            <div className={classes._accountDetails}>
              <div className={classes._combo}>
                <div className={classes._title}>Plan</div>
                <div
                  className={classes._value}
                  style={{
                    textTransform: noSubscription ? "none" : "uppercase",
                  }}
                >
                  {noSubscription ? "(None)" : subscriptionData?.tier}
                </div>
              </div>
              <div className={classes._combo}>
                <div className={classes._title}>Status</div>
                <div
                  className={classes._value}
                  style={{ textTransform: "uppercase" }}
                >
                  {subscriptionData?.status?.toLowerCase()}
                </div>
              </div>
              <div className={classes._combo}>
                <div className={classes._title}>ID</div>
                <div className={classes._value}>
                  {subscriptionData?.invoice}
                </div>
              </div>
              <div className={classes._combo}>
                <div className={classes._title}>Amount</div>
                <div className={classes._value}>{subscriptionData?.amount}</div>
              </div>
              <div className={classes._combo}>
                <div className={classes._title}>Date</div>
                <div className={classes._value}>
                  {moment(subscriptionData.createdAt).format(
                    "YYYY-MM-DD | HH:mm"
                  )}
                </div>
              </div>
              <div className={classes._combo}>
                <div className={classes._title}>Expiry</div>
                <div className={classes._value}>
                  {subscriptionData.expiryDate}
                </div>
              </div>
            </div>
          </div>

          {/* METRICS SECTION */}
          <div
            className="_metricsHeader"
            style={{
              fontSize: 15,
              color: "#091540",
              marginTop: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>Usage Metrics</span>
            <Button
              variant="contained"
              color="secondary"
              className="regular-btn"
              onClick={() => setShowSubscriptionDialog(true)}
            >
              {noSubscription ? "Create" : "Update"}
            </Button>
          </div>
          <div>
            <Grid
              container
              item
              sm={12}
              xs={12}
              spacing={3}
              style={{ margin: 0 }}
            >
              <Grid item sm={12} xs={12} style={{ padding: 0 }}>
                <List className={classes.table}>
                  <li className={classes.listSection}>
                    <ul className={classes.ul}>
                      <ListSubheader
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          backgroundColor: "#F8F8F8",
                          padding: "4px 0",
                          boxShadow: "0px 0px 4px rgba(110, 110, 110, 0.25)",
                          marginBottom: 2,
                        }}
                      >
                        <ListItemText
                          style={{ flex: 0.3 }}
                          primary={
                            <Typography
                              style={{
                                //borderRadius: 40,
                                width: 8,
                                height: 40,
                                background: "#0C7B93",
                              }}
                            ></Typography>
                          }
                        />
                        <ListItemText
                          style={{ flex: 1.5 }}
                          primary={
                            <Typography
                              variant="h6"
                              style={{ fontWeight: 500, fontSize: "0.9em" }}
                            >
                              Service name
                            </Typography>
                          }
                        />
                        <ListItemText
                          style={{ flex: 0.8 }}
                          primary={
                            <Typography
                              variant="h6"
                              style={{
                                fontWeight: 500,
                                textAlign: "center",
                                fontSize: "0.9em",
                              }}
                            >
                              Total units
                            </Typography>
                          }
                        />
                        <ListItemText
                          style={{ flex: 0.8 }}
                          primary={
                            <Typography
                              variant="h6"
                              style={{
                                fontWeight: 500,
                                fontSize: "0.9em",
                                textAlign: "center",
                              }}
                            >
                              Units used
                            </Typography>
                          }
                        />
                        <ListItemText
                          style={{ flex: 2 }}
                          primary={
                            <Typography
                              variant="h6"
                              style={{ fontWeight: 500, fontSize: "0.9em" }}
                            >
                              Usage
                            </Typography>
                          }
                        />
                      </ListSubheader>
                      {!isLoading && !isFetching ? (
                        <>
                          {subscriptionData?.metrics?.map((item, index) => (
                            <SingleSubscriptionMetric
                              key={index}
                              data={item}
                              index={index}
                            />
                          ))}
                        </>
                      ) : (
                        <>
                          {isLap ? (
                            <div className={classes.loadingPage}>
                              <ReactSpinnerTimer
                                timeInSeconds={3}
                                totalLaps={1}
                                isRefresh={false}
                                onLapInteraction={handleChange}
                              />
                            </div>
                          ) : (
                            <div className={classes.noRecord}>
                              <Typography>
                                No organisations available yet.
                              </Typography>
                            </div>
                          )}
                        </>
                      )}
                    </ul>
                  </li>
                </List>
              </Grid>
            </Grid>
          </div>
        </div>
      </MainPageLayout>
      {showSubscriptionDialog && (
        <UpdateSubscriptionDialog
          closeModal={() => setShowSubscriptionDialog()}
          subscriptionData={subscriptionData}
          saveData={saveSubscriptionData}
          holdData={(data) => setSubscriptionData(data)}
        />
      )}
    </>
  );
};

export default AccountDetails;
