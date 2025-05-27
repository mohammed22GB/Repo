import {
  Checkbox,
  FormControlLabel,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import React, { useState, useEffect, useRef } from "react";
import { AiOutlineCopy } from "react-icons/ai";
import { makeStyles } from "@material-ui/core/styles";
import { v4 } from "uuid";

import { INVALID_FIELD_LABEL_STYLE } from "../../../../utils/constants";
import { useStyles } from "../../Helpers/rightSidebarStyles";
import { infoToastify } from "../../../../../../../../common/utils/Toastify";
import CustomIntegrationFields from "../../../../../../../../common/components/CustomIntegrationFields/CustomIntegrationFields";
import PropertyFieldLabel from "./PropertyFieldLabel";

export const NameDescription = ({
  selectedApp,
  activeTask,
  _setTaskInfo,
  nodeIsConnectedToAny,
  nodeIsConnectedToStart,
  noBottomBorder = false,
}) => {
  const holdCustomNameRef = useRef(null);
  const userInfo = localStorage.getItem("userInfo");
  const classes = useStyles(makeStyles);
  const webhookEnabled_ = JSON.parse(userInfo).account?.webhookEnabled;
  const [webhookEnabled, setWebhookEnabled] = useState(webhookEnabled_);

  const [headerAuthPairs, setHeaderAuthPairs] = useState([{}]);
  const selectedParamType = "requestBodyKeys";
  const [endpointAllParams, setEndpointAllParams] = useState(null);
  const [endpointsData, setEndpointsData] = useState([{}]);
  const [fieldsKey, setFieldsKey] = useState("-");

  const { variables } = activeTask || {};
  const requestBodyParams = variables?.filter(
    (variable) => variable?.info?.parent !== activeTask?.taskId
  );

  useEffect(() => {
    setFieldsKey(v4());
  }, [activeTask?.id]);

  const getWebhookURL = () => {
    const accountSlug = JSON.parse(userInfo).account?.slug;
    const appSlug = selectedApp?.slug;
    const workflowInstanceId = "";
    const taskId = activeTask.id;

    const route = `${process.env.REACT_APP_ENDPOINT}/hooks/run/${taskId}`;
    const route_ = `${process.env.REACT_APP_ENDPOINT}/hooks/run/${accountSlug}/${appSlug}`;
    const query = `workflowInstanceId=${workflowInstanceId}&taskId=${taskId}`;

    // return `${route}?${query}`;
    return route;
  };

  const copyMe = () => {
    navigator.clipboard.writeText(getWebhookURL());
    infoToastify("Webhook URL copied!");
  };

  const handleChangeEndpoint = (
    e,
    endpointIndex,
    clearSelectedParamTypeValue
  ) => {
    const endpointsData_ = [...endpointsData];
    endpointsData_[endpointIndex] = {
      ...endpointsData_[endpointIndex],
      [e.target.name]: e.target.value,
      ...(clearSelectedParamTypeValue ? { [selectedParamType]: [] } : {}),
    };

    setEndpointsData(endpointsData_);
  };

  return (
    <>
      <PropertyFieldLabel
        propertyFieldname={"Name"}
        propertyReference={!activeTask?.name}
        isFieldOptional={false}
      />
      <TextField
        key={`${fieldsKey}-1`}
        variant="outlined"
        size="small"
        fullWidth
        placeholder="Enter title"
        InputProps={{
          className: classes.input,
        }}
        style={!activeTask?.name ? { color: "#e41919" } : {}}
        // value={activeTask?.name || ""}
        defaultValue={activeTask?.name || ""}
        onChange={(e) => _setTaskInfo(e, "name")}
        // onBlur={_setTaskInfo}
      />
      <PropertyFieldLabel propertyFieldname={"Description"} />
      <TextField
        key={`${fieldsKey}-2`}
        variant="outlined"
        size="small"
        fullWidth
        multiline
        minRows={3}
        placeholder="Enter description"
        defaultValue={activeTask?.description || ""}
        InputProps={{
          className: classes.input,
        }}
        onChange={(e) => _setTaskInfo(e, "description")}
        // onBlur={_setTaskInfo}
      />
      {webhookEnabled && (
        <>
          <PropertyFieldLabel
            propertyFieldname={"Trigger"}
            propertyReference={
              !activeTask?.triggeredByWorkflow &&
              !activeTask?.triggeredByWebhook
            }
            isFieldOptional={false}
          />
          <div
            style={{
              borderRadius: 5,
              border: "solid 1px rgba(0, 0, 0, 0.23)",
              padding: "0 10px",
            }}
          >
            <div
              style={{ display: "flex" }}
              className="webhook-sidebar-switch-section"
            >
              <div style={{ flex: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="checkedP"
                      /* defaultChecked={
                    nodeIsConnectedToStart || activeTask?.triggeredByWorkflow
                  } */
                      disabled={nodeIsConnectedToAny && !nodeIsConnectedToStart}
                      key={`${fieldsKey}-3`}
                      defaultChecked={
                        (nodeIsConnectedToAny && !nodeIsConnectedToStart) ||
                        activeTask?.triggeredByWorkflow
                      }
                      onChange={(e) => _setTaskInfo(e, "triggeredByWorkflow")}
                      disableRipple
                      size="small"
                      color="default"
                    />
                  }
                  label="Workflow"
                />
              </div>
              <div style={{ flex: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="checkedW"
                      key={`${fieldsKey}-4`}
                      defaultChecked={activeTask?.triggeredByWebhook}
                      onChange={(e) => _setTaskInfo(e, "triggeredByWebhook")}
                      disableRipple
                      size="small"
                      color="default"
                    />
                  }
                  label="Webhook"
                />
              </div>
            </div>
            {activeTask?.triggeredByWebhook && (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "10px 0",
                  }}
                >
                  <Typography
                    gutterBottom
                    className={classes.sectionTitle}
                    style={{ lineHeight: 1.2, marginBottom: 0 }}
                  >
                    Webhook URL:
                  </Typography>
                  <div
                    style={{
                      border: "inset 1px",
                      borderRadius: 3,
                      padding: "8px 13px",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      backgroundColor: "#fafafa",
                    }}
                  >
                    {getWebhookURL()}
                  </div>
                  <div>
                    <Tooltip title="Copy URL">
                      <div
                        style={{
                          cursor: "pointer",
                          marginLeft: 8,
                        }}
                        onClick={copyMe}
                      >
                        <AiOutlineCopy style={{ fontSize: 18 }} />
                      </div>
                    </Tooltip>
                  </div>
                </div>
                {!!requestBodyParams?.length && (
                  <div style={{ paddingBottom: 10 }}>
                    <hr style={{ opacity: 0.15 }} />
                    <div>
                      <div style={{ fontStyle: "italic", fontWeight: 300 }}>
                        Your webhook request body must provide values for the
                        following fields:
                      </div>
                      <ul style={{ display: "flex", flexWrap: "wrap" }}>
                        {requestBodyParams?.map((param) => (
                          <li style={{ width: "50%" }}>{param.name}</li>
                        ))}
                      </ul>
                    </div>

                    <CustomIntegrationFields
                      classes={{ ...classes, input: classes.input2 }}
                      endpoint={endpointsData[0]}
                      endpointIndex={0}
                      endpointsData={endpointsData}
                      setEndpointsData={setEndpointsData}
                      handleChangeEndpoint={handleChangeEndpoint}
                      selectedParamType={selectedParamType}
                      headerAuthPairs={headerAuthPairs}
                      setHeaderAuthPairs={setHeaderAuthPairs}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};
