import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { v4 } from "uuid";
import { makeStyles } from "@material-ui/core/styles";
import { Collapse, MenuItem, Select, Typography } from "@material-ui/core";
import { updateTaskVariables } from "../../../../utils/workflowHelpers";
import DataActivitiesModule from "./common/DataActivitiesModule";
import { INVALID_FIELD_LABEL_STYLE } from "../../../utils/constants";
import useCustomQuery from "../../../../../../../common/utils/CustomQuery";
import { getAllIntegration } from "../../../../../../../common/components/Query/Integration/integrationQuery";

const initialParamsValues = {
  requestBodyValues: [],
  responseBodyValues: [],
  queryParamsValues: [],
  routeParamsValues: [],
  requestHeaderValues: [],
  responseHeaderValues: [],
};

const CustomDataAction = ({
  setTaskInfo,
  properties,
  variables,
  activeTaskId,
}) => {
  const useStyles = makeStyles((theme) => ({
    sectionTitle: {
      color: "#999",
      fontSize: 12,
      marginBottom: 5,
    },
    select: {
      color: "#091540",
      fontSize: 12,
      padding: 10,
    },
    sectionEntry: {
      marginBottom: 13,
    },
    matchingFields: {
      borderRadius: 5,
      border: "dashed 1.5px #999",
      padding: "10px 5px 10px 10px",
      backgroundColor: "#f8f8f8",
      marginTop: 7,
    },
    mappingTitle: {
      fontSize: 12,
      flex: 1,
      color: "#f7a712",
      display: "flex",
      justifyContent: "space-between",
    },
    addMatch: {
      fontSize: 20,
      boxShadow: "0px 2px 3px #aaa",
      borderRadius: "14%",
      marginTop: 10,
    },
    pair: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
      "& > div": {
        "&:first-child": {
          marginRight: 5,
        },
      },
    },
    menuSubs: {
      fontSize: "0.8em",
      color: "#0c7b93",
      fontWeight: "normal",
      display: "flex",
      alignItems: "center",
      marginTop: 3,
    },
    selected: {
      "& span": {
        display: "none",
      },
    },
  }));
  const classes = useStyles();

  const { integration, endpoint } = properties || {};

  const [customIntegrationsList, setCustomIntegratoinsList] = useState([]);
  const [activeParam, setActiveParam] = useState("routeParams");
  const [selectFormFields, setSelectFormFields] = useState([]);
  const [selectedEndpointResources, setSelectedEndpointResources] = useState(
    []
  );
  const [selectedEndpoint, setSelectedEndpoint] = useState({});

  const dispatch = useDispatch();

  const handleGetCustomAPISuccess = ({ data }) => {
    setCustomIntegratoinsList(() => data?.data || []);
  };

  const { data: allIntegrations } = useCustomQuery({
    apiFunc: getAllIntegration,
    onSuccess: handleGetCustomAPISuccess,
    queryKey: [
      "customAPI",
      { type: "RestApiIntegration", propertyType: "RestApiIntegration" },
    ],
  });

  useEffect(() => {
    populateResources();
  }, [integration, allIntegrations]);

  useEffect(() => {
    const selectedEndpoint_ = selectedEndpointResources.find(
      (eachEndpoint) => eachEndpoint._id === endpoint
    );
    setSelectedEndpoint(selectedEndpoint_);
  }, [endpoint, selectedEndpointResources]);

  const _setTaskInfo = (e, ppty) => {
    let toUpdate = {};
    switch (ppty) {
      case "integration":
        toUpdate = {
          integration: e.target.value,
          endpoint: null,
          ...initialParamsValues,
        };
        break;

      case "endpoint":
        toUpdate = {
          endpoint: e.target.value,
          ...initialParamsValues,
        };
        break;

      default:
        break;
    }

    setTaskInfo(toUpdate, null, true);
  };

  const populateResources = () => {
    const resourcesOfSelectedIntegration =
      allIntegrations?.data.find(({ id }) => id === integration)?.properties
        ?.resources || [];

    setSelectedEndpointResources(resourcesOfSelectedIntegration);
  };

  const displayKeyName = (idx) => {
    const key = selectedEndpoint?.[`${activeParam}Keys`]?.[idx];
    let keyName = key?.name;

    if (key?.dataType === "custom") {
      keyName = keyName?.match(/[^{\}]+(?=})/g)[0];
    }

    return (
      <span
        style={{
          backgroundColor: "#509aaa",
          letterSpacing: "0.06em",
          color: "white",
          fontSize: 10,
          fontWeight: 400,
          padding: "2px 10px",
          marginLeft: 5,
          borderRadius: 15,
        }}
      >
        {keyName}
      </span>
    );
  };

  const updateActiveParamValues = (value, ppty, isGrouped, index) => {
    const currentValues = properties?.[`${activeParam}Values`];
    const currentKeyParams = selectedEndpoint?.[`${activeParam}Keys`]?.[index];

    currentValues[index] = {
      ...currentValues[index],
      key: currentKeyParams.name,
      keyId: currentKeyParams._id,
      nodeId: currentKeyParams.nodeId,
      ...(isGrouped
        ? { ...value }
        : { [value.target.name]: value.target.value }),
    };
    setTaskInfo(currentValues, `${activeParam}Values`);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 10 }}>
        <div
          className={classes.sectionEntry}
          style={{ flex: 1, marginRight: 0 }}
        >
          <Typography
            gutterBottom
            className={classes.sectionTitle}
            style={!properties?.integration ? INVALID_FIELD_LABEL_STYLE : {}}
          >
            Select Custom API
          </Typography>
          <Select
            variant="outlined"
            size="small"
            fullWidth
            classes={{
              root: classes.select,
            }}
            value={properties?.integration || "choose"}
            onChange={(e) => _setTaskInfo(e, "integration")}
          >
            <MenuItem value="choose" selected disabled>
              <em>
                {customIntegrationsList.length > 0
                  ? "Select one"
                  : "No custom API created"}
              </em>
            </MenuItem>
            {customIntegrationsList.length > 0
              ? customIntegrationsList.map((dd, index) => (
                  <MenuItem value={dd.id} key={`${dd.id}-${index}`}>
                    {dd.name}
                  </MenuItem>
                ))
              : null}
          </Select>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <div
          className={classes.sectionEntry}
          style={{ flex: 1, marginRight: 0 }}
        >
          <Typography
            gutterBottom
            className={classes.sectionTitle}
            style={!properties?.endpoint ? INVALID_FIELD_LABEL_STYLE : {}}
          >
            {" "}
            Select endpoint to execute
          </Typography>
          <Select
            variant="outlined"
            size="small"
            fullWidth
            classes={{
              root: classes.select,
            }}
            value={properties?.endpoint || "choose"}
            onChange={(e) => _setTaskInfo(e, "endpoint")}
          >
            <MenuItem value="choose" selected disabled>
              <em>
                {selectedEndpointResources.length
                  ? "Select one"
                  : "No endpoints created"}
              </em>
            </MenuItem>
            {selectedEndpointResources?.map((dd, index) => (
              <MenuItem value={dd._id} key={`${dd._id}-${index}`}>
                {dd.name}
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>

      {endpoint !== "choose" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: 10,
            border: "inset 1px",
            borderRadius: 5,
            backgroundColor: "#fafafa",
          }}
        >
          <Select
            variant="outlined"
            size="small"
            fullWidth
            classes={{
              root: classes.select,
            }}
            defaultValue="routeParams"
            onChange={(e) => {
              setActiveParam(e.target.value);
            }}
          >
            <MenuItem value="choose" selected disabled>
              <em>
                {customIntegrationsList.length > 0
                  ? "Select one"
                  : "No custom API created"}
              </em>
            </MenuItem>
            <MenuItem
              value="routeParams"
              disabled={!selectedEndpoint?.routeParamsKeys?.length}
            >
              Route Params
            </MenuItem>
            <MenuItem
              value="queryParams"
              disabled={!selectedEndpoint?.queryParamsKeys?.length}
            >
              Query Params
            </MenuItem>
            <MenuItem
              value="requestBody"
              disabled={!selectedEndpoint?.requestBodyKeys?.length}
            >
              Request Body
            </MenuItem>
            <MenuItem
              value="requestHeaders"
              disabled={!selectedEndpoint?.requestHeadersKeys?.length}
            >
              Request Headers
            </MenuItem>
            <MenuItem
              value="responseHeaders"
              disabled={!selectedEndpoint?.responseHeadersKeys?.length}
            >
              Response Headers
            </MenuItem>
          </Select>
          <div
            className={classes.sectionEntry}
            style={{
              flex: 1,
              marginRight: 0,
              marginTop: 10,
              paddingTop: 15,
              borderTop: "dashed 1px",
            }}
          >
            <Collapse in={true}>
              <>
                {selectedEndpoint?.[`${activeParam}Keys`]?.map((val, idx) => {
                  return !val.isDerived ? (
                    <>
                      {idx > 0 && <hr />}
                      <DataActivitiesModule
                        moduleSource={"customNode"}
                        data={properties?.[`${activeParam}Values`]?.[idx]}
                        updateData={(e, ppty, isGrouped) =>
                          updateActiveParamValues(e, ppty, isGrouped, idx)
                        }
                        topFieldLabel={
                          <Typography
                            gutterBottom
                            className={classes.sectionTitle}
                          >
                            Data source for key: {displayKeyName(idx)}
                            {/* <b style={{ color: "#0c7b93", letterSpacing: "0.06em" }}> */}
                          </Typography>
                        }
                      />
                    </>
                  ) : null;
                })}
                {!selectedEndpoint?.[`${activeParam}Keys`]?.length && (
                  <em style={{ fontWeight: 300 }}>
                    No {activeParam} added for this endpoint in Integrations
                  </em>
                )}
              </>
            </Collapse>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDataAction;
