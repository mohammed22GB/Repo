import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import {
  FormGroup,
  Grid,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@material-ui/core";
import {
  AddCircleOutline,
  Cached,
  CloseOutlined,
  EditOutlined,
  InfoOutlined,
} from "@material-ui/icons";
import { v4 } from "uuid";
import {
  paramsDataTypes,
  paramTypes,
} from "../../../Integrations/utils/customStructures";

const CustomIntegrationFields = (props) => {
  const {
    classes,
    endpoint,
    endpointIndex,
    endpointsData,
    setEndpointsData,
    handleChangeEndpoint,
    selectedParamType,
    headerAuthPairs,
    setHeaderAuthPairs,
  } = props;

  const [editResponseDataNode, setEditResponseDataNode] = useState(false);

  const objectKeysHolder = [];

  const endpointSampleDatas = (endpoint) => {
    return endpoint?.[`${selectedParamType}SampleData`];
  };

  const getKeys = (obj, oid) => {
    Object.keys(obj).forEach((key) => {
      const nodeId = v4();
      if (typeof obj[key] !== "object" || Array.isArray(obj[key])) {
        objectKeysHolder.push({
          nodeId,
          name: key,
          parent: oid,
          isDerived: false,
          dataType: typeof obj[key],
          required: true,
        });
      } else {
        objectKeysHolder.push({
          nodeId,
          name: key,
          parent: oid,
          isDerived: true,
        });
        getKeys(obj[key], nodeId);
      }
    });
  };

  const addParam = (endpointIndex) => {
    const endpointsData_ = [...endpointsData];
    const paramsData_ = endpointsData_[endpointIndex][selectedParamType];
    paramsData_.push({
      name: "",
      dataType: "string",
      required: true,
      object: "",
    });
    endpointsData_[endpointIndex] = {
      ...endpointsData_[endpointIndex],
      [selectedParamType]: paramsData_,
    };
    setEndpointsData(endpointsData_);
  };

  const handleChangeParam = (e, paramIndex, endpointIndex) => {
    const endpointsData_ = [...endpointsData];
    const paramsData_ = endpointsData_[endpointIndex][selectedParamType];
    paramsData_[paramIndex] = {
      ...paramsData_[paramIndex],
      [e.target.name]: e.target.value,
    };
    endpointsData_[endpointIndex] = {
      ...endpointsData_[endpointIndex],
      [selectedParamType]: paramsData_,
    };
    setEndpointsData(endpointsData_);
  };

  const deleteParam = (paramIndex, endpointIndex) => {
    const endpointsData_ = [...endpointsData];
    const paramsData_ = endpointsData_[endpointIndex][selectedParamType];
    paramsData_.splice(paramIndex, 1);
    endpointsData_[endpointIndex] = {
      ...endpointsData_[endpointIndex],
      [selectedParamType]: paramsData_,
    };
    setEndpointsData(endpointsData_);

    const headerAuthPairs_ = [...headerAuthPairs];
    headerAuthPairs_.splice(paramIndex, 1);
    setHeaderAuthPairs(headerAuthPairs_);
  };

  const handleChangeObjectParam = (objArray, obj, pType, endpointIndex) => {
    const endpointsData_ = [...endpointsData];
    endpointsData_[endpointIndex] = {
      ...endpointsData_[endpointIndex],
      [selectedParamType]: objArray,
      [`${pType}SampleData`]: JSON.stringify(obj, null, 4),
    };
    setEndpointsData(endpointsData_);
  };

  const extractKeys = (objText, endpoint, endpointIndx) => {
    objectKeysHolder.splice(0, objectKeysHolder.length);

    const regexSpace = /(['"])?([a-zA-Z0-9_]+)(['"])?:/g; //  to ???
    const regexComma = /\,(?!\s*?[\{\[\"\'\w])/g; //  to remove trailing comma
    const stripped1 = objText.replace(/\s/g, ""); //  to remove spaces
    const doubleQuote = stripped1.replace(/'/g, '"'); //  replace single quotes with double
    const stripped2 = doubleQuote.replace(regexComma, "");
    const formatted = stripped2.replace(regexSpace, '"$2": ');

    const obj = JSON.parse(formatted);
    if (typeof obj !== "object") return;

    getKeys(obj);
    handleChangeObjectParam(
      objectKeysHolder,
      obj,
      selectedParamType,
      endpointIndx,
    );
  };

  const switchPasteUI = (sw, selectedParamType, endpoint, endpointIndex) => {
    console.log(`1111`);
    if (
      (sw === "sample-data") ===
      !!endpoint?.[`${selectedParamType}SampleData`]
    )
      return;

    // checkFormCompleted(null, endpointsData_);

    //  then toggle value of sampladata field
    handleChangeEndpoint(
      {
        target: {
          name: `${selectedParamType}SampleData`,
          value: !!endpoint?.[`${selectedParamType}SampleData`] ? "" : "{}",
        },
      },
      endpointIndex,
      true,
    );
  };

  const PasteSampleDataSwitch = (endpoint, endpointIndex) => {
    return (
      <div
        style={{
          fontWeight: 500,
          fontSize: 11,
          display: "flex",
          gap: 5,
        }}
      >
        <span
          style={
            !!endpoint?.[`${selectedParamType}SampleData`]
              ? { color: "#999999" }
              : {
                  color: "#0c7b93",
                  textDecoration: "underline",
                  cursor: "pointer",
                }
          }
          onClick={() =>
            switchPasteUI(
              "sample-data",
              selectedParamType,
              endpoint,
              endpointIndex,
            )
          }
        >
          Paste sample data
        </span>
        |
        <span
          style={
            !endpoint?.[`${selectedParamType}SampleData`]
              ? { color: "#999999" }
              : {
                  color: "#0c7b93",
                  textDecoration: "underline",
                  cursor: "pointer",
                }
          }
          onClick={() =>
            switchPasteUI(
              "add-field",
              selectedParamType,
              endpoint,
              endpointIndex,
            )
          }
        >
          Add fields
        </span>
      </div>
    );
  };

  const EachEndpointParam = ({ paramType, paramIndex, endpointIndex }) => (
    <Grid
      style={{
        marginBottom: 0,
        alignItems: "center",
        gap: 5,
        position: "relative",
      }}
      container
      key={`${selectedParamType}-${paramType?.name}-${paramIndex}`}
    >
      <Grid
        item
        style={{
          flex: 2,
        }}
      >
        <TextField
          name="name"
          variant="outlined"
          size="small"
          fullWidth
          placeholder="Key"
          autoFocus={
            !["routeParamsKeys", "queryParamsKeys"].includes(selectedParamType)
          }
          InputProps={{
            className: classes.input,
          }}
          defaultValue={paramType.name || ""}
          onChange={(e) => handleChangeParam(e, paramIndex, endpointIndex)}
          disabled={["routeParamsKeys", "queryParamsKeys"].includes(
            selectedParamType,
          )}
        />
      </Grid>
      <Grid
        item
        style={{
          flex: 1,
        }}
      >
        <FormGroup style={{ flex: 1 }}>
          <Select
            variant="outlined"
            size="small"
            fullWidth
            classes={{
              root: classes.selectPadding,
            }}
            placeholder={"Select from the list"}
            name="dataType"
            value={paramType.dataType || ""}
            onChange={(e) => handleChangeParam(e, paramIndex, endpointIndex)}
            /* readOnly={["routeParamsKeys", "queryParamsKeys"].includes(
              selectedParamType
            )} */
            FormHelperTextProps={{
              className: classes.helperText,
            }}
            // required
          >
            {paramsDataTypes
              /* hide "object" from datatypes, except for request-/response-bodykeys */
              .filter(
                (dtype) =>
                  (["requestBodyKeys", "responseBodyKeys"].includes(
                    selectedParamType,
                  ) ||
                    dtype[0] !== "object") &&
                  (selectedParamType === "requestBodyKeys" ||
                    dtype[0] !== "custom"),
              )
              .map(([v, n], idx) => (
                <MenuItem key={idx} value={v}>
                  {n}
                </MenuItem>
              ))}
          </Select>
        </FormGroup>
      </Grid>
      <Grid
        item
        style={{
          flex: 1,
        }}
      >
        <FormGroup style={{ flex: 1 }} placeholder="Hello">
          <Select
            variant="outlined"
            size="small"
            fullWidth
            classes={{
              root: classes.selectPadding,
            }}
            placeholder="Select from the list"
            name="required"
            value={paramType.required}
            onChange={(e) => handleChangeParam(e, paramIndex, endpointIndex)}
            readOnly={["routeParamsKeys"].includes(selectedParamType)}
            FormHelperTextProps={{
              className: classes.helperText,
            }}
            required
          >
            {[
              [true, "Required"],
              [false, "Optional"],
            ].map(([v, n], idx) => (
              <MenuItem key={idx} value={v}>
                {n}
              </MenuItem>
            ))}
          </Select>
        </FormGroup>
      </Grid>
      {!["routeParamsKeys", "queryParamsKeys"].includes(selectedParamType) && (
        <Tooltip title="Delete line">
          <div
            style={{
              right: -6,
              top: 0,
              borderRadius: "50%",
              width: 14,
              height: 14,
              backgroundColor: "#dddddd",
              position: "absolute",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => deleteParam(paramIndex, endpointIndex)}
          >
            <CloseOutlined style={{ fontSize: 10 }} />
          </div>
        </Tooltip>
      )}
    </Grid>
  );

  return (
    <div
      className={classes.formLabels}
      style={{ display: "block", paddingTop: 10 }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 5,
          marginBottom: 10,
        }}
      >
        <Typography
          gutterBottom
          className={classes.sectionTitle}
          style={{ marginBottom: 0, fontWeight: 300, color: "#666" }}
        >
          {paramTypes.find((pType) => pType[0] === selectedParamType)?.[1]}{" "}
          keys:
        </Typography>
        {["requestBodyKeys", "responseBodyKeys"].includes(selectedParamType)
          ? PasteSampleDataSwitch(endpoint, endpointIndex)
          : !["routeParamsKeys", "queryParamsKeys"].includes(
              selectedParamType,
            ) && (
              <span
                style={{
                  fontWeight: 500,
                  fontSize: 11,
                  color: "#999999",
                }}
              >
                Add fields
              </span>
            )}
        {!["routeParamsKeys", "queryParamsKeys"].includes(selectedParamType) ? (
          !endpointSampleDatas(endpoint) ? (
            <Tooltip title="Add line">
              <AddCircleOutline
                style={{
                  color: "#999999",
                  fontSize: 16,
                  cursor: "pointer",
                  marginLeft: "auto",
                }}
                onClick={() => addParam(endpointIndex)}
              />
            </Tooltip>
          ) : null
        ) : (
          <Tooltip
            title={
              selectedParamType === "routeParamsKeys"
                ? "Add params {in braces} to URL, e.g. ...descasio.io/{my}/{param} "
                : "Add params to URL, e.g. ...descasio.io?my&cool=&param=this"
            }
          >
            <InfoOutlined
              style={{
                color: "#999999",
                fontSize: 16,
                cursor: "pointer",
              }}
            />
          </Tooltip>
        )}
      </div>

      {!!endpointSampleDatas(endpoint) ? (
        <div>
          <TextField
            name="object"
            variant="outlined"
            size="small"
            fullWidth
            // placeholder="Key"
            InputProps={{
              className: classes.input,
            }}
            // onChange={(e) => handleChangeEndpoint(e, endpointIndex)}
            defaultValue={decodeURIComponent(endpointSampleDatas(endpoint))}
            // .replace(/\n/g, "<br />");
            onBlur={(e) => extractKeys(e.target.value, endpoint, endpointIndex)}
            minRows={10}
            multiline
            placeholder="{}"
          />
        </div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
          >
            {endpoint?.[selectedParamType]
              ?.filter((ptype) => typeof ptype.nodeId !== "string")
              .map((paramType, paramIndex) =>
                EachEndpointParam({
                  paramType,
                  paramIndex,
                  endpointIndex,
                }),
              )}
          </div>
        </>
      )}
      {selectedParamType === "responseBodyKeys" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            borderTop: "dashed 1px",
            gap: 10,
            paddingTop: 9,
            marginTop:
              !!endpoint?.[selectedParamType]?.filter(
                (ptype) => typeof ptype.nodeId !== "string",
              ).length || !!endpoint?.[`${selectedParamType}SampleData`]
                ? 9
                : 0,
          }}
        >
          <div style={{ marginRight: "auto" }}>
            <span style={{ fontWeight: 600 }}>Returned data is in:</span>
            <span
              style={{
                display: "block",
                color: "#0c7b93",
                fontSize: 10,
              }}
            >
              (use dotted notation if nested)
            </span>
          </div>
          <span>
            <TextField
              name="responseBodyValuesNode"
              variant="outlined"
              size="small"
              disabled={!editResponseDataNode}
              style={{ width: 100 }}
              // value={fieldValues?.responseBodyValuesNode || "data"}
              /* onChange={(e) =>
                  setFieldValues({
                    ...fieldValues,
                    responseBodyValuesNode: e.target.value,
                  })
                } */
              onChange={(e) => handleChangeEndpoint(e, endpointIndex)}
              defaultValue={endpoint.responseBodyValuesNode || "data"}
            />
          </span>
          {!editResponseDataNode ? (
            <Tooltip title="Edit">
              <EditOutlined
                style={{ fontSize: 16, cursor: "pointer" }}
                onClick={() => setEditResponseDataNode(!editResponseDataNode)}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Reset">
              <Cached
                style={{ fontSize: 16, cursor: "pointer" }}
                onClick={() => setEditResponseDataNode(!editResponseDataNode)}
              />
            </Tooltip>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomIntegrationFields;
