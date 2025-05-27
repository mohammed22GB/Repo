import React, { useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  Chip,
  Collapse,
  FormGroup,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import {
  AddBox,
  AddCircleOutline,
  CloseOutlined,
  Delete,
  InfoOutlined,
  Settings,
} from "@material-ui/icons";
import {
  authTypes,
  googleScopesList,
  initEndpoint,
  methodTypes,
  paramTypes,
  serviceTypes,
} from "../../../utils/customStructures";
import _ from "lodash";
import { isStringValidUrl } from "../../../../common/helpers/helperFunctions";
import CustomIntegrationFields from "../../../../common/components/CustomIntegrationFields/CustomIntegrationFields";
import { microsoftScopesList } from "../../../../common/utils/msconfig";

const APIForm = ({
  classes,
  step,
  type,
  integrations,
  availableResourcesList,
  selectedResourcesList,
  updateSelectedList,
  setFormCompleted,
  setLoading,
  updatedData,
  fieldValues,
  setFieldValues,
  form2fieldValue: endpointsData,
  setForm2FieldValue: setEndpointsData,
}) => {
  const [headerAuthPairs, setHeaderAuthPairs] = useState([{}]);
  const [showEndpointDetails, setShowEndpointDetails] = useState(-1);
  const [selectedEndpointData, setSelectedEndpointData] = useState({});
  const [selectedParamType, setSelectedParamType] = useState("routeParamsKeys");
  const [endpointAllParams, setEndpointAllParams] = useState(null);

  const [activeId, setActiveId] = useState(null);
  const [integrationGoogleEmails, setIntegrationGoogleEmails] = useState([]);
  const [integrationMicrosoftEmails, setIntegrationMicrosoftEmails] = useState(
    []
  );
  const [addedRedirectUrl, setAddedRedirectUrl] = useState(false);

  useEffect(() => {
    let subscribe = true;
    const mapValueToState = () => {
      /* Setting the value of the field. */
      const setted = {
        ...fieldValues,
        name: updatedData?.name || "",
        apiType: updatedData?.group || "",
        authenticationType:
          updatedData?.properties?.connectionCredentials?.authType || "",
        serverName: updatedData?.serverName || "",
        headerAuth:
          updatedData?.properties?.connectionCredentials?.headerAuth || [],
        password:
          updatedData?.properties?.connectionCredentials?.password || "",
        loginUsername:
          updatedData?.properties?.connectionCredentials?.username || "",
        googleScopes:
          updatedData?.properties?.connectionCredentials?.scopes || [],

        authorizationURL:
          updatedData?.properties?.connectionCredentials?.authorizationURL ||
          "",
        tokenURL:
          updatedData?.properties?.connectionCredentials?.tokenURL || "",
        clientID:
          updatedData?.properties?.connectionCredentials?.clientID || "",
        clientSecret:
          updatedData?.properties?.connectionCredentials?.clientSecret || "",
        oauth2Scopes:
          updatedData?.properties?.connectionCredentials?.scopes?.join(",") ||
          "",
      };
      subscribe && setFieldValues(setted);
      subscribe && setEndpointsData(() => selectedResourcesList);

      checkFormCompleted(setted);
    };
    mapValueToState();

    return () => {
      subscribe = false;
    };
  }, [updatedData]);

  useEffect(() => {
    checkFormCompleted();
    console.log(`addedRedirectUrl >> ${addedRedirectUrl}`);
  }, [fieldValues, addedRedirectUrl]);

  useEffect(() => {
    checkFormCompleted();
  }, [endpointsData]);

  useEffect(() => {}, [initEndpoint]);

  useEffect(() => {
    if (updatedData) {
      setActiveId(updatedData?.id);
    }

    /* Filtering the integrations array and returning the email addresses of the users. */
    const accountsGEmail = integrations?.length > 0 && [
      ...new Set(
        integrations
          .filter(
            ({ type, properties }) =>
              type === "RestApiIntegration" &&
              properties?.connectionCredentials?.authType === "GoogleAuth"
          )
          .map(
            ({ properties }) =>
              properties?.connectionCredentials?.userInfo?.email
          )
      ),
    ];
    const accountsMEmail = integrations?.length > 0 && [
      ...new Set(
        integrations
          .filter(
            ({ type, properties }) =>
              type === "RestApiIntegration" &&
              properties?.connectionCredentials?.authType === "MicrosoftAuth"
          )
          .map(
            ({ properties }) =>
              properties?.connectionCredentials?.userInfo?.email
          )
      ),
    ];

    /* Setting the state of the component. */
    setIntegrationGoogleEmails(() => accountsGEmail);
    setIntegrationMicrosoftEmails(() => accountsMEmail);
  }, [updatedData, integrations]);

  const checkFormCompleted = (values, passedEndpointsData) => {
    const allValues = values || fieldValues;
    const endpointsData_ = passedEndpointsData || endpointsData;

    const validated_step_1 =
      step === 1 &&
      !!allValues.name &&
      !!allValues.authenticationType &&
      !!allValues.apiType &&
      (allValues.authenticationType === "UsernamePassword"
        ? !!allValues.password && !!allValues.loginUsername
        : allValues.authenticationType === "HeaderAuth"
        ? !!allValues.headerAuth?.length &&
          !allValues.headerAuth.find((pair) => !pair.key || !pair.value)
        : allValues.authenticationType === "MicrosoftAuth"
        ? !!allValues.microsoftScopes?.length
        : allValues.authenticationType === "GoogleAuth"
        ? !!allValues.googleScopes?.length
        : allValues.authenticationType === "OAuth2"
        ? !!allValues.clientID &&
          !!allValues.clientSecret &&
          !!allValues.authorizationURL &&
          isStringValidUrl(allValues.authorizationURL) &&
          !!allValues.tokenURL &&
          isStringValidUrl(allValues.tokenURL) &&
          addedRedirectUrl
        : allValues.authenticationType === "None");

    const validated_step_2 =
      step === 2 &&
      !!endpointsData_?.length &&
      !endpointsData_?.find((endpoint) => {
        return (
          !endpoint.name ||
          !endpoint.method ||
          !endpoint.url ||
          (["GET"].includes(endpoint.method) &&
            (!endpoint.responseBodyKeys.length ||
              endpoint.responseBodyKeys.find((param) => !param.name))) ||
          (["POST", "PUT"].includes(endpoint.method) &&
            (!endpoint.requestBodyKeys.length ||
              endpoint.requestBodyKeys.find((param) => !param.name)))
        );
      });

    
    if(validated_step_1){
      setFormCompleted(validated_step_1)
    }else if(validated_step_2){
      setFormCompleted(validated_step_2)
    }else{
      setFormCompleted(false)
    }
    setLoading(false)
  };

  const selectScopes = (e) => {
    setFieldValues({ ...fieldValues, [e.target.name]: e.target.value });
  };

  const parseEndpointURL = (e, endpointIndex) => {
    const url = e.target.value;
    const routeParams = url?.match(/[^{\}]+(?=})/g);
    const routeKeys = routeParams?.map((param) => {
      return {
        name: param,
        dataType: "string",
        required: true,
      };
    });

    let queryString,
      qErr = false;
    try {
      queryString = new URL(url).search;
    } catch (err) {
      qErr = true;
    }

    const urlParams = new URLSearchParams(queryString);
    const queryKeys = [...urlParams.keys()].map((param) => {
      return {
        name: param,
        dataType: "string",
        required: true,
      };
    });

    const endpointsData_ = [...endpointsData];
    endpointsData_[endpointIndex] = {
      ...endpointsData_[endpointIndex],
      url: qErr ? null : url,
      routeParamsKeys: routeKeys,
      queryParamsKeys: queryKeys,
    };
    setEndpointsData(endpointsData_);
  };

  const addEndpoint = () => {
    const endpointsData_ = [...endpointsData];
    endpointsData_.push(_.cloneDeep(initEndpoint));
    setEndpointsData(endpointsData_);
  };

  const configureEndpoint = (endpoint, endpointIndex) => {
    setSelectedEndpointData(endpoint);
    setShowEndpointDetails(
      showEndpointDetails === endpointIndex ? -1 : endpointIndex
    );
    setEndpointAllParams(endpoint);
  };

  const deleteEndpoint = (endpointIndex) => {
    const endpointsData_ = [...endpointsData];
    endpointsData_.splice(endpointIndex, 1);
    setEndpointsData(endpointsData_);
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

  const EachEndpointBox = ({ endpoint, endpointIndex }) => (
    <div className={classes.apiEndpointBox} key={endpointIndex}>
      <div className={classes.apiEndpointBar}>
        <div
          style={{
            flex: 1,
            color: "#091540",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontWeight: 300,
          }}
        >
          {endpoint.name || <em>{`{ Configure new endpoint }`}</em>}
        </div>
        <div style={{ color: "#a0abb0" }}>{endpoint.method}</div>
        <Tooltip title="Configure">
          <div
            className={classes.apiEndpointBarBtn}
            onClick={() => configureEndpoint(endpoint, endpointIndex)}
          >
            <Settings style={{ fontSize: 16 }} />
          </div>
        </Tooltip>
        <Tooltip title="Delete">
          <div
            className={classes.apiEndpointBarBtn}
            style={{
              borderRadius: "0 4px 4px 0",
            }}
            onClick={() => deleteEndpoint(endpointIndex)}
          >
            <Delete style={{ fontSize: 16 }} />
          </div>
        </Tooltip>
      </div>
      <Collapse in={showEndpointDetails === endpointIndex}>
        <div>
          <div
            style={{
              padding: 10,
              borderTop: "outset 1px",
              borderBottom: "inset 1px",
              // marginBottom: 20,
            }}
          >
            <div style={{ display: "flex", gap: 10 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <Typography
                  className={classes.formLabels}
                  gutterBottom
                  style={{
                    paddingTop: 0,
                    minWidth: 50,
                    marginBottom: 0,
                  }}
                >
                  Name
                </Typography>
                <TextField
                  className={classes.FormTextField}
                  size="small"
                  name="name"
                  onChange={(e) => handleChangeEndpoint(e, endpointIndex)}
                  defaultValue={endpoint.name}
                  fullWidth
                  FormHelperTextProps={{
                    className: classes.helperText,
                  }}
                  required
                  // value={fieldValues.name || ""}
                  placeholder={`Enter here`}
                  type="text"
                  variant="outlined"
                  inputProps={{
                    className: classes.inputColor,
                  }}
                  autoFocus
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  // width: 180,
                }}
              >
                <Typography
                  className={classes.formLabels}
                  gutterBottom
                  style={{
                    paddingTop: 0,
                    minWidth: 50,
                    marginBottom: 0,
                  }}
                >
                  Method
                </Typography>
                <FormGroup style={{ flex: 1 }}>
                  <Select
                    variant="outlined"
                    size="small"
                    fullWidth
                    classes={{
                      root: classes.selectPadding,
                    }}
                    placeholder={"Select from the list"}
                    name="method"
                    // value={fieldValues.apiType || ""}
                    onChange={(e) => handleChangeEndpoint(e, endpointIndex)}
                    /* onChange={(e) => {
                      const endpointsData_ = [...endpointsData];
                      endpointsData_[endpointIndex] = {
                        ...endpointsData_[endpointIndex],
                        method: e.target.value,
                      };
                      setEndpointsData(endpointsData_);
                    }} */
                    // disabled={!!activeId}
                    defaultValue={endpoint.method}
                    FormHelperTextProps={{
                      className: classes.helperText,
                    }}
                    required
                  >
                    {methodTypes.map(([v, n], idx) => (
                      <MenuItem
                        key={idx}
                        value={v}
                        disabled={idx === 0 ? true : false}
                      >
                        {n}
                      </MenuItem>
                    ))}
                  </Select>
                </FormGroup>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                paddingTop: 10,
              }}
            >
              <Typography
                className={classes.formLabels}
                gutterBottom
                style={{ paddingTop: 0, minWidth: 50, marginBottom: 0 }}
              >
                URL
              </Typography>
              <TextField
                className={classes.FormTextField}
                size="small"
                name="url"
                onChange={(e) => parseEndpointURL(e, endpointIndex)}
                defaultValue={endpoint.url}
                fullWidth
                FormHelperTextProps={{
                  className: classes.helperText,
                }}
                required
                // value={fieldValues.name || ""}
                placeholder={`http://`}
                type="text"
                variant="outlined"
                inputProps={{
                  className: classes.inputColor,
                  autoComplete: "new-int",
                  form: {
                    autoComplete: "off",
                  },
                }}
              />
            </div>
          </div>
          <div
            style={{
              padding: 10,
              backgroundColor: "#fbfbfb",
              borderRadius: "0 0 4px 4px",
            }}
          >
            <div
              style={
                {
                  // display: "flex",
                  // alignItems: "center",
                }
              }
            >
              <Typography
                className={classes.formLabels}
                gutterBottom
                style={{
                  paddingTop: 0,
                  minWidth: 50,
                  marginBottom: 4,
                }}
              >
                Configure params for:
              </Typography>
              <FormGroup style={{ flex: 1 }}>
                <Select
                  variant="outlined"
                  size="small"
                  fullWidth
                  classes={{
                    root: classes.selectPadding,
                  }}
                  placeholder={"Select from the list"}
                  name="dataType1"
                  // value={fieldValues.apiType || ""}
                  onChange={(e) => setSelectedParamType(e.target.value)}
                  // disabled={!!activeId}
                  defaultValue={"routeParamsKeys"}
                  FormHelperTextProps={{
                    className: classes.helperText,
                  }}
                  required
                >
                  {paramTypes.map(([v, n], idx) => (
                    <MenuItem
                      key={idx}
                      value={v}
                      disabled={
                        !["POST", "PUT", "PATCH"].includes(endpoint.method) &&
                        v === "Keys"
                      }
                    >
                      {n}
                    </MenuItem>
                  ))}
                </Select>
              </FormGroup>
            </div>

            <CustomIntegrationFields
              classes={classes}
              endpoint={endpoint}
              endpointIndex={endpointIndex}
              endpointsData={endpointsData}
              setEndpointsData={setEndpointsData}
              handleChangeEndpoint={handleChangeEndpoint}
              selectedParamType={selectedParamType}
              headerAuthPairs={headerAuthPairs}
              setHeaderAuthPairs={setHeaderAuthPairs}
            />
          </div>
        </div>
      </Collapse>
    </div>
  );

  return (
    <>
      {step === 1 && type === "RestApiIntegration" ? (
        <div>
          <Typography className={classes.formLabels} gutterBottom>
            Name
          </Typography>
          <TextField
            className={classes.FormTextField}
            size="small"
            name="name"
            onChange={(e) =>
              setFieldValues({ ...fieldValues, name: e.target.value })
            }
            fullWidth
            FormHelperTextProps={{
              className: classes.helperText,
            }}
            required
            value={fieldValues.name || ""}
            placeholder={`Enter here`}
            type="text"
            variant="outlined"
            inputProps={{
              className: classes.inputColor,
              autoComplete: "new-int",
              form: {
                autoComplete: "off",
              },
            }}
          />
          <Typography className={classes.formLabels} gutterBottom>
            API category
          </Typography>
          <FormGroup>
            <Select
              variant="outlined"
              size="small"
              fullWidth
              classes={{
                root: classes.selectPadding,
              }}
              placeholder={"Select from the list"}
              name="apiType"
              value={fieldValues.apiType || ""}
              onChange={(e) =>
                setFieldValues({ ...fieldValues, apiType: e.target.value })
              }
              // disabled={!!activeId}
              FormHelperTextProps={{
                className: classes.helperText,
              }}
              required
            >
              {serviceTypes.map(([v, n], idx) => (
                <MenuItem
                  key={idx}
                  value={v}
                  disabled={idx === 0 ? true : false}
                >
                  {n}
                </MenuItem>
              ))}
            </Select>
          </FormGroup>

          <Typography className={classes.formLabels} gutterBottom>
            Authentication type
          </Typography>
          <FormGroup>
            <Select
              variant="outlined"
              size="small"
              fullWidth
              classes={{
                root: classes.selectPadding,
              }}
              placeholder={"Select from the list"}
              name="authenticationType"
              value={fieldValues.authenticationType || ""}
              onChange={(e) =>
                setFieldValues({
                  ...fieldValues,
                  authenticationType: e.target.value,
                })
              }
              // disabled={!!activeId}
              FormHelperTextProps={{
                className: classes.helperText,
              }}
              required
            >
              {authTypes.map(([v, n], idx) => (
                <MenuItem
                  key={idx}
                  value={v}
                  disabled={idx === 0 ? true : false}
                >
                  {n}
                </MenuItem>
              ))}
            </Select>
          </FormGroup>
          {fieldValues?.authenticationType === "UsernamePassword" ? (
            <div>
              <Typography className={classes.formLabels} gutterBottom>
                Login username
              </Typography>
              <TextField
                className={classes.FormTextField}
                size="small"
                name="loginUserName"
                inputMode="text"
                onChange={(e) =>
                  setFieldValues({
                    ...fieldValues,
                    loginUsername: e.target.value,
                  })
                }
                fullWidth
                FormHelperTextProps={{
                  className: classes.helperText,
                }}
                required
                value={fieldValues.loginUsername || ""}
                placeholder={`Enter here`}
                type="text"
                variant="outlined"
                inputProps={{
                  className: classes.inputColor,
                  autoComplete: "new-int",
                  form: {
                    autoComplete: "off",
                  },
                }}
              />
              <Typography className={classes.formLabels} gutterBottom>
                Password
              </Typography>
              <TextField
                className={classes.FormTextField}
                size="small"
                name="password"
                inputMode="text"
                onChange={(e) =>
                  setFieldValues({ ...fieldValues, password: e.target.value })
                }
                fullWidth
                FormHelperTextProps={{
                  className: classes.helperText,
                }}
                required
                value={fieldValues.password || ""}
                placeholder={`Enter here`}
                type="text"
                variant="outlined"
                inputProps={{
                  className: classes.inputColor,
                  autoComplete: "new-int",
                  form: {
                    autoComplete: "off",
                  },
                }}
              />
            </div>
          ) : null}
          {fieldValues?.authenticationType === "HeaderAuth" ? (
            <>
              <div className={classes.formLabels} style={{ display: "block" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Typography gutterBottom className={classes.sectionTitle}>
                    Header key-value pairs
                  </Typography>
                  <Tooltip title="Add line">
                    <AddCircleOutline
                      style={{
                        color: "#999999",
                        fontSize: 16,
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        const headerAuthPairs_ = [...headerAuthPairs];
                        headerAuthPairs_.push({});
                        setHeaderAuthPairs(headerAuthPairs_);
                      }}
                    />
                  </Tooltip>
                </div>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: 5 }}
                >
                  {headerAuthPairs.map((val, idx) => (
                    <Grid
                      style={{
                        marginBottom: 0,
                        alignItems: "center",
                        gap: 5,
                        position: "relative",
                      }}
                      container
                      key={idx}
                    >
                      {/* <li className={classes.decisionPrefix}>IF</li> */}
                      <Grid
                        item
                        style={{
                          flex: 1,
                        }}
                      >
                        <TextField
                          name="key"
                          variant="outlined"
                          size="small"
                          fullWidth
                          placeholder="Key"
                          InputProps={{
                            className: classes.input,
                          }}
                          value={val?.key || ""}
                          onChange={(e) => {
                            const headerAuthPair_ = [...headerAuthPairs];
                            headerAuthPair_[idx] = {
                              ...headerAuthPair_[idx],
                              key: e.target.value,
                            };
                            setFieldValues({
                              ...fieldValues,
                              headerAuth: headerAuthPair_,
                            });
                            setHeaderAuthPairs(headerAuthPair_);
                          }}
                          autoFocus
                        />
                      </Grid>
                      <Grid
                        item
                        style={{
                          flex: 1,
                        }}
                      >
                        <TextField
                          name="value"
                          variant="outlined"
                          size="small"
                          fullWidth
                          placeholder="Value"
                          InputProps={{
                            className: classes.input,
                          }}
                          value={val?.value || ""}
                          onChange={(e) => {
                            const headerAuthPair_ = [...headerAuthPairs];
                            headerAuthPair_[idx] = {
                              ...headerAuthPair_[idx],
                              value: e.target.value,
                            };
                            setFieldValues({
                              ...fieldValues,
                              headerAuth: headerAuthPair_,
                            });
                            setHeaderAuthPairs(headerAuthPair_);
                          }}
                        />
                      </Grid>
                      {/* {selectionConditions.length > 1 && ( */}
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
                          onClick={() => {
                            const headerAuthPairs_ = [...headerAuthPairs];
                            headerAuthPairs_.splice(idx, 1);
                            setHeaderAuthPairs(headerAuthPairs_);
                          }}
                        >
                          <CloseOutlined style={{ fontSize: 10 }} />
                        </div>
                      </Tooltip>
                      {/* )} */}
                    </Grid>
                  ))}
                </div>
              </div>
            </>
          ) : null}
          {fieldValues?.authenticationType === "GoogleAuth" ? (
            <div className={classes.formLabels} style={{ display: "block" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Typography gutterBottom className={classes.sectionTitle}>
                  Select scope(s)
                </Typography>
                <Tooltip title="Select scopes will be added to any existing ones">
                  <InfoOutlined
                    style={{
                      color: "#999999",
                      fontSize: 16,
                      cursor: "pointer",
                    }}
                  />
                </Tooltip>
              </div>

              <FormGroup>
                <Select
                  variant="outlined"
                  size="small"
                  fullWidth
                  classes={{
                    root: classes.selectPadding,
                  }}
                  placeholder={"Select from the list"}
                  name="googleScopes"
                  value={[
                    ...(Array.isArray(fieldValues?.googleScopes)
                      ? fieldValues?.googleScopes
                      : !!fieldValues?.googleScopes
                      ? [fieldValues?.googleScopes]
                      : []),
                  ]}
                  onChange={selectScopes}
                  disabled={!!activeId}
                  multiple
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                      {selected.map((value, index) => (
                        <Chip
                          key={index}
                          label={value?.replace(
                            "https://www.googleapis.com/auth/",
                            ""
                          )}
                          style={{ height: 30, borderRadius: 5, fontSize: 12 }}
                        />
                      ))}
                    </Box>
                  )}
                  helperText="Some important text"
                  // MenuProps={MenuProps}
                >
                  <MenuItem value="choose" disabled>
                    <em>Select all applicable</em>
                  </MenuItem>
                  {googleScopesList?.map(
                    ({ name, value, consentType }, idx) => {
                      return (
                        <MenuItem value={value} key={idx}>
                          {`${name}${consentType === "ADMIN" ? "*" : ""}`}
                        </MenuItem>
                      );
                    }
                  )}
                </Select>
                <FormHelperText>
                  Scopes with asteriks * require consent from Google Admin
                </FormHelperText>{" "}
              </FormGroup>
            </div>
          ) : null}
          {fieldValues?.authenticationType === "MicrosoftAuth" ? (
            <div className={classes.formLabels} style={{ display: "block" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Typography gutterBottom className={classes.sectionTitle}>
                  Select scope(s)
                </Typography>
                <Tooltip title="Selected scopes will be added to any existing ones">
                  <InfoOutlined
                    style={{
                      color: "#999999",
                      fontSize: 16,
                      cursor: "pointer",
                    }}
                  />
                </Tooltip>
              </div>

              <FormGroup>
                <Select
                  variant="outlined"
                  size="small"
                  fullWidth
                  classes={{
                    root: classes.selectPadding,
                  }}
                  placeholder={"Select from the list"}
                  name="microsoftScopes"
                  value={[
                    ...(Array.isArray(fieldValues?.microsoftScopes)
                      ? fieldValues?.microsoftScopes
                      : !!fieldValues?.microsoftScopes
                      ? [fieldValues?.microsoftScopes]
                      : []),
                  ]}
                  onChange={selectScopes}
                  disabled={!!activeId}
                  multiple
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                      {selected.map((value, index) => (
                        <Chip
                          key={index}
                          label={value}
                          style={{ height: 30, borderRadius: 5, fontSize: 12 }}
                        />
                      ))}
                    </Box>
                  )}
                  helperText="Some important text"
                  // MenuProps={MenuProps}
                >
                  <MenuItem value="choose" disabled>
                    <em>Select all applicable</em>
                  </MenuItem>
                  {microsoftScopesList?.map(({ name, consentType }, idx) => {
                    return (
                      <MenuItem value={name} key={idx}>
                        {`${name}${consentType === "ADMIN" ? "*" : ""}`}
                      </MenuItem>
                    );
                  })}
                </Select>
                <FormHelperText>
                  Scopes with asteriks * require consent from Microsoft Admin
                </FormHelperText>{" "}
              </FormGroup>
            </div>
          ) : null}
          {fieldValues?.authenticationType === "OAuth2" ? (
            <div>
              <Typography className={classes.formLabels} gutterBottom>
                Client ID
              </Typography>
              <TextField
                className={classes.FormTextField}
                size="small"
                name="clientID"
                inputMode="text"
                onChange={(e) =>
                  setFieldValues({
                    ...fieldValues,
                    clientID: e.target.value,
                  })
                }
                fullWidth
                FormHelperTextProps={{
                  className: classes.helperText,
                }}
                required
                value={fieldValues.clientID || ""}
                placeholder={`Enter here`}
                type="text"
                variant="outlined"
                inputProps={{
                  className: classes.inputColor,
                  autoComplete: "new-int",
                  form: {
                    autoComplete: "off",
                  },
                }}
              />
              <Typography className={classes.formLabels} gutterBottom>
                Client secret
              </Typography>
              <TextField
                className={classes.FormTextField}
                size="small"
                name="clientSecret"
                inputMode="text"
                onChange={(e) =>
                  setFieldValues({
                    ...fieldValues,
                    clientSecret: e.target.value,
                  })
                }
                fullWidth
                FormHelperTextProps={{
                  className: classes.helperText,
                }}
                required
                value={fieldValues.clientSecret || ""}
                placeholder={`Enter here`}
                type="text"
                variant="outlined"
                inputProps={{
                  className: classes.inputColor,
                  autoComplete: "new-int",
                  form: {
                    autoComplete: "off",
                  },
                }}
              />
              <Typography className={classes.formLabels} gutterBottom>
                {`Authorization URL`}
                {!!fieldValues.authorizationURL &&
                  !isStringValidUrl(fieldValues.authorizationURL) && (
                    <span className={classes.errorLabelText}>Invalid URL</span>
                  )}
              </Typography>
              <TextField
                className={classes.FormTextField}
                size="small"
                name="authorizationURL"
                inputMode="text"
                onChange={(e) =>
                  setFieldValues({
                    ...fieldValues,
                    authorizationURL: e.target.value,
                  })
                }
                fullWidth
                FormHelperTextProps={{
                  className: classes.helperText,
                }}
                required
                value={fieldValues.authorizationURL || ""}
                placeholder="https://"
                type="text"
                variant="outlined"
                inputProps={{
                  className: classes.inputColor,
                  autoComplete: "new-int",
                  form: {
                    autoComplete: "off",
                  },
                }}
              />
              <Typography className={classes.formLabels} gutterBottom>
                {`Token URL`}
                {!!fieldValues.tokenURL &&
                  !isStringValidUrl(fieldValues.tokenURL) && (
                    <span className={classes.errorLabelText}>Invalid URL</span>
                  )}
              </Typography>
              <TextField
                className={classes.FormTextField}
                size="small"
                name="tokenURL"
                inputMode="text"
                onChange={(e) =>
                  setFieldValues({
                    ...fieldValues,
                    tokenURL: e.target.value,
                  })
                }
                fullWidth
                FormHelperTextProps={{
                  className: classes.helperText,
                }}
                required
                value={fieldValues.tokenURL || ""}
                placeholder="https://"
                type="text"
                variant="outlined"
                inputProps={{
                  className: classes.inputColor,
                  autoComplete: "new-int",
                  form: {
                    autoComplete: "off",
                  },
                }}
              />
              <Typography className={classes.formLabels} gutterBottom>
                Scopes (Optional, separate with commas)
              </Typography>
              <TextField
                className={classes.FormTextField}
                size="small"
                name="oauth2Scopes"
                inputMode="text"
                onChange={(e) =>
                  setFieldValues({
                    ...fieldValues,
                    oauth2Scopes: e.target.value,
                  })
                }
                fullWidth
                FormHelperTextProps={{
                  className: classes.helperText,
                }}
                required
                value={fieldValues.oauth2Scopes || ""}
                placeholder="Separate with commas"
                type="text"
                variant="outlined"
                inputProps={{
                  className: classes.inputColor,
                  autoComplete: "new-int",
                  form: {
                    autoComplete: "off",
                  },
                }}
              />
              <div
                style={{
                  display: "flex",
                  border: "solid 1px #ccc",
                  backgroundColor: "#fcfcfc",
                  lineHeight: 1.7,
                  // padding: 10,
                  borderRadius: 5,
                  marginTop: 20,
                }}
              >
                <div>
                  <Checkbox
                    inputProps={{ "aria-label": "uncontrolled-checkbox" }}
                    classes={{
                      root: classes.checkedBox,
                    }}
                    checked={addedRedirectUrl}
                    onChange={(e) => setAddedRedirectUrl(e.target.checked)}
                  />
                </div>
                <div
                  style={{
                    overflowWrap: "anywhere",
                    // wordBreak: "break-all",
                    padding: "7px 10px 8px 0",
                  }}
                >
                  Yes, I have added{" "}
                  <span
                    style={{
                      textDecoration: "underline",
                      wordBreak: "break-all",
                    }}
                  >
                    {`${process.env.REACT_APP_ENDPOINT}/integrations/generate-tokens`}
                  </span>{" "}
                  to <b>redirect_uri</b> on my OAuth2 provider configuration.
                </div>
              </div>
            </div>
          ) : null}

          {/* {fieldValues?.authenticationType === "None"} */}
        </div>
      ) : step === 2 && type === "RestApiIntegration" ? (
        <Collapse in={true}>
          <div className={classes.apiEndpointHeader}>
            <div className={classes.apiEndpointHeaderText}>Endpoints</div>
            <Tooltip title="Add endpoint">
              <AddBox
                style={{ fontSize: 26, cursor: "pointer", color: "#adaebf" }}
                onClick={addEndpoint}
              />
            </Tooltip>
          </div>

          {endpointsData?.map((endpoint, endpointIndex) =>
            EachEndpointBox({ endpoint, endpointIndex })
          )}
        </Collapse>
      ) : null}
    </>
  );
};

export default APIForm;
