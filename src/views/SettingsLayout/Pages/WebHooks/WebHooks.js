import { useEffect, useState } from "react";
import { Grid, FormControlLabel, Tooltip } from "@material-ui/core";
import { FiRefreshCw } from "react-icons/fi";
import moment from "moment";
import { useQueryClient } from "react-query";
import { AiOutlineCopy } from "react-icons/ai";

import useStyles from "./components/style";
import { TwoFactor } from "./components/SwitchStyles";
import {
  getAccountWebhookInfo,
  refreshWebhookApiKey,
  updateWebhookStatus,
} from "./utils/accountsAPIs";
import useCustomQuery from "../../../common/utils/CustomQuery";
import useCustomMutation from "../../../common/utils/CustomMutation";
import {
  errorToastify,
  infoToastify,
  successToastify,
} from "../../../common/utils/Toastify";
import CustomConfirmBox from "../../../common/components/CustomConfirmBox/CustomConfirmBox";

const WebHooks = () => {
  const classes = useStyles();
  const queryClient = useQueryClient();

  const [isWebhookEnabled, setIsWebhookEnabled] = useState(false);
  const [currentAPIKey, setCurrentAPIKey] = useState(null);
  const [currentAPIKeyDate, setCurrentAPIKeyDate] = useState(null);
  const [refreshingKey, setRefreshingKey] = useState(false);
  const [confirmChangeKey, setConfirmChangeKey] = useState(false);

  useEffect(() => {
    document.title = "Settings | Webhooks";
  }, []);

  const onWebhookInfoSuccess = ({ data }) => {
    const { webhookEnabled, apiKey, apiKeyDate } = data.data;
    setIsWebhookEnabled(webhookEnabled);
    setCurrentAPIKey(apiKey);
    setCurrentAPIKeyDate(apiKeyDate);

    //  update localStorage
    const userInfo_ = localStorage.getItem("userInfo");
    const userInfo = JSON.parse(userInfo_);
    userInfo.account.webhookEnabled = webhookEnabled;
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  };

  const onStatusUpdateSuccess = ({ data }) => {
    const { webhookEnabled, apiKey, apiKeyDate } = data.data;
    setIsWebhookEnabled(webhookEnabled);
    if (webhookEnabled) {
      !currentAPIKey && setCurrentAPIKey(apiKey);
      setCurrentAPIKeyDate(apiKeyDate);
    }

    //  update localStorage
    const userInfo_ = localStorage.getItem("userInfo");
    const userInfo = JSON.parse(userInfo_);
    userInfo.account.webhookEnabled = webhookEnabled;
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  };

  //  fetch webhook info for account
  useCustomQuery({
    apiFunc: getAccountWebhookInfo,
    queryKey: ["webhookInfo"],
    onSuccess: onWebhookInfoSuccess,
  });

  const { mutate: updateStatus } = useCustomMutation({
    apiFunc: updateWebhookStatus,
    onSuccess: onStatusUpdateSuccess,
    retries: 0,
  });

  const copyKey = () => {
    navigator.clipboard.writeText(currentAPIKey);
    infoToastify("API Key copied!");
  };

  const createUpdateKey = async () => {
    if (!isWebhookEnabled || refreshingKey) return;
    setRefreshingKey(true);

    const response = await refreshWebhookApiKey();

    if (response?._meta?.success) {
      queryClient.invalidateQueries(["webhookInfo"]);
      successToastify(response._meta.message);
    } else {
      errorToastify(response._meta.message);
    }
    setRefreshingKey(false);
  };

  return (
    <div className={[classes.paddingLeft50]}>
      <Grid container>
        <Grid
          container
          item
          sm={12}
          xs={12}
          className={classes.bottomMargin20}
          spacing={3}
        >
          <Grid
            container
            item
            justifyContent="flex-end"
            spacing={2}
            style={{ marginTop: 10, marginBottom: 10 }}
          >
            <div
              style={{
                marginRight: "auto",
                display: "flex",
                alignItems: "center",
                marginLeft: 9,
                borderRadius: 5,
                border: "inset 1px #eee",
                backgroundColor: "#fbfbfb",
              }}
            >
              <FormControlLabel
                classes={{
                  root: classes.switchLabel,
                  label: classes.sectionTitle,
                }}
                control={
                  <TwoFactor
                    checked={isWebhookEnabled}
                    onChange={() => updateStatus(!isWebhookEnabled)}
                    name="checkedC"
                    color="primary"
                    //size="small"
                  />
                }
                label="Enable Webhooks"
                labelPlacement="end"
              />
            </div>
          </Grid>
        </Grid>
      </Grid>
      <div
        style={{
          fontSize: 14,
          marginBottom: 5,
          display: "flex",
          alignItems: "center",
        }}
      >
        API Key:{" "}
        <span
          style={{
            color: "#999",
            fontSize: 12,
            marginLeft: 10,
          }}
        >
          [ Last modified:{" "}
          {currentAPIKeyDate
            ? moment(currentAPIKeyDate).format("YYYY-MMM-DD HH:mm:s")
            : "-"}{" "}
          ]
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            border: "inset 1px",
            borderRadius: 3,
            padding: "10px 13px",
            fontSize: 14,
            letterSpacing: 1,
            flex: 1,
            opacity: isWebhookEnabled ? 1 : 0.6,
            // userSelect: isWebhookEnabled ? "text" : "none",
          }}
        >
          {currentAPIKey || "-"}
        </div>
        <Tooltip title="Copy key" onClick={currentAPIKey ? copyKey : null}>
          <div
            style={{
              cursor: currentAPIKey && !refreshingKey ? "pointer" : "default",
            }}
          >
            <AiOutlineCopy
              style={{
                fontSize: 18,
                color: currentAPIKey && !refreshingKey ? "inherit" : "#cccccc",
              }}
            />
          </div>
        </Tooltip>
        <Tooltip title={currentAPIKey ? "Change key" : "Create key"}>
          <div
            className={refreshingKey ? "icon-spin" : ""}
            style={{
              display: "flex",
              cursor:
                isWebhookEnabled && !refreshingKey ? "pointer" : "default",
            }}
            onClick={() => setConfirmChangeKey(true)}
          >
            <FiRefreshCw
              style={{
                fontSize: 18,
                color:
                  isWebhookEnabled && !refreshingKey ? "inherit" : "#cccccc",
              }}
            />
          </div>
        </Tooltip>
      </div>
      {confirmChangeKey && (
        <CustomConfirmBox
          closeConfirmBox={() => setConfirmChangeKey(false)}
          text={`Are you sure you want to change the Api Key?`}
          open={confirmChangeKey}
          confirmAction={createUpdateKey}
        />
      )}
    </div>
  );
};

export default WebHooks;
