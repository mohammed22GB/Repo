import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Select,
  MenuItem,
  Collapse,
  Grid,
  TextField,
  Tooltip,
  Switch,
} from "@material-ui/core";
import {
  AddCircleOutline,
  CloseOutlined,
  RefreshOutlined,
} from "@material-ui/icons";
import { useQueryClient } from "react-query";
import { v4 } from "uuid";

import { getDatasheetsAPI } from "../../../../../EditorLayout/Pages/Workflow/components/utils/temporaryDataSheetAPI";
import {
  getGoogleSheetSheet,
  getIntegrationDataAPI,
} from "../../../../../Integrations/utils/integrationsAPIs";
import { ConditionalOperators } from "../../../../../EditorLayout/Pages/Workflow/components/utils/constants";
import useCustomQuery from "../../../../../common/utils/CustomQuery";
import { multiChartNames } from "../../../../../common/utils/constants";
import { getDatasheetById } from "../../../../../common/components/Query/DataSheets/datasheetQuery";
import { groupIntegrations } from "../../../../../EditorLayout/Pages/Workflow/utils/tasksHelpers";

const useStyles = makeStyles((theme) => ({
  section: {
    padding: 10,
    paddingBottom: 20,
  },
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

const DashboardDataConfiguration = ({
  data,
  updateData,
  resetDataConfig,
  sectionType,
  integrations,
  chartType,
  refreshIntegrations,
}) => {
  const classes = useStyles();
  const queryClient = useQueryClient();

  const {
    googleSheet,
    dataSourceType,
    externalDB,
    dataSheet,
    transposeData,
    excludedFromTranspose,
    integration,
    table,
    worksheetTab,
    valueProperties = [{}],
    referenceColumn,
    valuePrefix,
    valueSuffix,
  } = data || {};

  const [dataSheetData, setDataSheetData] = useState({});
  const [transposedDataHeaders, setTransposedDataHeaders] = useState([]);
  const [columnSelectKey, setColumnSelectKey] = useState("");
  const [subscribedLoadDatasheetData, setSubscribedLoadDatasheetData] =
    useState(false);

  const [dataSheetList, setDataSheetList] = useState([]);
  const [googleSheetSheetTabs, setGoogleSheetSheetTabs] = useState([]);
  const [gSheetColumns, setGSheetColumns] = useState([]);
  const [integrationsList, setIntegrationsList] = useState([]);
  const [externalDBTypesList, setExternalDBTypesList] = useState([]);
  const [resourcesList, setResourcesList] = useState([]);
  const [googleSheetColumns, setGoogleSheetColumns] = useState([]);

  const [showSelectDatasheet, setShowSelectDatasheet] = useState(false);
  const [showSelectExtDB, setShowSelectExtDB] = useState(false);
  const [showSelectIntegration, setShowSelectIntegration] = useState(false);
  const [showSelectTable, setShowSelectTable] = useState(false);
  const [showSelectWorksheetTab, setShowSelectWorksheetTab] = useState(false);
  const [showSelectValCol, setShowSelectValCol] = useState(false);
  const [multipleCharts, setMultipleCharts] = useState(
    multiChartNames?.includes(chartType)
  );

  useEffect(() => {
    setMultipleCharts(multiChartNames?.includes(chartType));
  }, [chartType]);

  useEffect(() => {
    if (!subscribedLoadDatasheetData && transposeData) {
      prepareTranspose({ target: { checked: true } }, true);
      setSubscribedLoadDatasheetData(true);
    }
  }, [transposeData]);

  useEffect(() => {
    const options = {
      query: {
        active: true,
        per_page: 1000,
      },
    };

    const getIntegrations = async () => {
      const integrations_ = await getIntegrationDataAPI(options);
      const grouped_integrations = groupIntegrations(integrations_?.data, true);

      setIntegrationsList(grouped_integrations?.data);
      getExtDBTypes(grouped_integrations?.data);
    };

    getIntegrations();
  }, []);

  //  if dataSourceType changes after integration selection, reset!
  const resetFromChangeSource = (e) => {
    if (!!integration) {
      updateData({
        target: {
          name: "dataConfig",
          value: { [e.target.name]: e.target.value },
        },
      });
    }
  };

  useEffect(() => {
    if (showSelectTable) {
      if (dataSourceType === "googleSheet") {
        const resources =
          integrationsList.find((intg) => intg.id === integration)?.resources ||
          [];
        setResourcesList(resources);
      }
      if (dataSourceType === "externalDatabase") {
        const resources =
          integrationsList.find((intg) => intg.id === integration)?.resources ||
          [];
        setResourcesList(resources);
      }
    }
  }, [integration, integrationsList, showSelectTable]);

  //  googleSheet TABS
  useEffect(() => {
    const getSheetTabs = async () => {
      let data;

      if (dataSourceType === "googleSheet") {
        data = await getGoogleSheetSheet({
          param: {
            id: integration,
            spreadsheetId: table,
          },
        });
      }
      if (data?._meta?.success) {
        const sheetTabs = data?.data?.sheets;
        setGoogleSheetSheetTabs(sheetTabs || []);
      }
    };

    if (showSelectWorksheetTab) getSheetTabs();
  }, [table, showSelectWorksheetTab]);

  //  get googleSheet tab COLUMNS
  useEffect(() => {
    const getSheetColumns = async () => {
      const dataCols = await getGoogleSheetSheet({
        param: {
          id: integration,
          spreadSheetId: table,
          sheetId: worksheetTab,
        },
      });

      if (dataCols._meta.success) {
        setGoogleSheetColumns(dataCols.data);
      }
    };

    if (dataSourceType === "googleSheet" && showSelectValCol) {
      getSheetColumns();
    }
  }, [worksheetTab, showSelectValCol]);

  useEffect(() => {
    setShowSelectDatasheet(dataSourceType === "datasheet");
    setShowSelectExtDB(dataSourceType === "externalDatabase");
    setShowSelectIntegration(
      (dataSourceType === "externalDatabase" && !!externalDB) ||
        dataSourceType === "googleSheet"
    );
    setShowSelectTable(
      showSelectIntegration && !!integration
      // ||
      //   (showSelectDatasheet && !!dataSheet)
    );
    setShowSelectWorksheetTab(
      dataSourceType === "googleSheet" && showSelectTable && !!table
    );
    setShowSelectValCol(
      (dataSourceType === "datasheet" && !!dataSheet) ||
        (showSelectWorksheetTab && !!worksheetTab && !!table) ||
        (dataSourceType === "externalDatabase" && !!integration && !!table)
    );
  }, [data, showSelectIntegration, showSelectTable, showSelectWorksheetTab]);

  const getDataColumns = ({ skipTranspose = false } = {}) => {
    switch (dataSourceType) {
      case "datasheet":
        return transposeData && !skipTranspose
          ? transposedDataHeaders
          : dataSheetList.find((dd) => dd._id === dataSheet)?.columns || [];
      case "googleSheet":
        return googleSheetColumns.map((col) => {
          col.id = col.name;
          return col;
        });

      case "externalDatabase":
        return (
          integrationsList
            ?.find((intg) => intg.id === integration)
            ?.resources.find((resc) => resc._id === table)?.columns || []
        );

      default:
        return dataSheetList.find((dd) => dd.id === dataSheet)?.columns || [];
    }
  };

  const { isLoading, isFetching } = useCustomQuery({
    queryKey: ["datasheetList"],
    apiFunc: getDatasheetsAPI,
    onSuccess: (list) => {
      setDataSheetList(list?.data?.data);
    },
  });

  const filterIntegrations = () => {
    switch (dataSourceType) {
      case "googleSheet":
        return integrationsList?.filter((intg) => intg.type === "Google Sheet");

      default:
        return integrationsList?.filter((intg) => intg.type !== "Google Sheet");
    }
  };

  const getExtDBTypes = (intgList) => {
    const types = intgList
      ?.filter((intg) => intg.type !== "Google Sheet")
      ?.map((intg) => intg.type);
    setExternalDBTypesList(types);
  };

  const _updateCriteria = (e, idx, index) => {
    const selectionCondition_ = [
      ...valueProperties[index]["selectionConditions"],
    ];
    selectionCondition_[idx][e.target.name] = e.target.value;
    updateSubData(
      {
        target: {
          name: "selectionConditions",
          value: selectionCondition_,
        },
      },
      index
    );
  };

  const updateSubData = (e, index) => {
    if (
      e.target.name === "removeValueProps" ||
      e.target.name === "addValueProperty"
    ) {
    } else {
      const valueProperty = valueProperties[index];
      valueProperty[e.target.name] = e.target.value;
      valueProperties[index] = valueProperty;
    }

    const evt = { target: { name: "valueProperties", value: valueProperties } };

    updateData(evt, "dataConfig");
  };

  const extractTransposeDetails = (datasheetDetails) => {
    const firstColumnId = datasheetDetails?.columns?.[0]?.id;
    const firstColumnData = datasheetDetails?.data
      ?.map((row) => ({
        id: row[firstColumnId],
        name: row[firstColumnId],
      }))
      .filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.id === value.id) // Only include the first occurrence of each id
      );
    const transposedDataHeaders_ = [
      { id: firstColumnId, name: "[ Headings]" },
      ...([...new Set(firstColumnData)] || []),
    ];
    setTransposedDataHeaders(transposedDataHeaders_);
  };

  const prepareTranspose = async (evt, isOnLoad) => {
    if (!isOnLoad) {
      const confirmed = window.confirm(
        "This will clear the settings below. Proceed?"
      );

      if (!confirmed) {
        return;
      }

      updateData(evt, "dataConfig");
    }

    const value = evt.target.checked;

    const dataSheetData_ = { ...dataSheetData };

    if (value) {
      if (!dataSheetData_[dataSheet]) {
        //  fetch datasheet data
        const { data: returnedDatasheet } =
          (await getDatasheetById({
            queryKey: [null, { id: dataSheet }],
          })) || {};

        dataSheetData_[dataSheet] = returnedDatasheet?.data;
        setDataSheetData(dataSheetData_);
        extractTransposeDetails(returnedDatasheet);
      }
      setColumnSelectKey(v4());
    }
  };

  return (
    <Collapse in={true}>
      <div className={classes.section}>
        <div className={classes.sectionEntry}>
          <Typography gutterBottom className={classes.sectionTitle}>
            Data source
          </Typography>
          <Select
            name="dataSourceType"
            variant="outlined"
            size="small"
            fullWidth
            placeholder="Select form screen"
            classes={{
              root: classes.select,
            }}
            value={dataSourceType || "choose"}
            onChange={(e) =>
              !!integration
                ? resetDataConfig(e.target.value)
                : updateData(e, "dataConfig")
            }
          >
            <MenuItem value="choose" disabled>
              <em>Select data source type</em>
            </MenuItem>
            <MenuItem value="datasheet" selected>
              Plug DataSheets
            </MenuItem>
            <MenuItem value="googleSheet">Google Sheet</MenuItem>
            <MenuItem value="externalDatabase">External Database</MenuItem>
          </Select>
        </div>

        <Collapse in={showSelectDatasheet}>
          <div
            className={classes.sectionEntry}
            // style={{ flex: 1, marginRight: !!dataSheet ? 10 : 0 }}
            style={{ flex: 1, marginRight: 0 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography gutterBottom className={classes.sectionTitle}>
                Select DataSheet
              </Typography>
              <Tooltip title="Refresh Datasheets">
                <RefreshOutlined
                  style={{ color: "#999999", fontSize: 16, cursor: "pointer" }}
                  onClick={() =>
                    queryClient.invalidateQueries(["datasheetList"])
                  }
                />
              </Tooltip>
            </div>
            <Select
              name="dataSheet"
              variant="outlined"
              size="small"
              fullWidth
              classes={{
                root: classes.select,
              }}
              value={dataSheet || "choose"}
              onChange={(e) => updateData(e, "dataConfig")}
            >
              <MenuItem value="choose" selected disabled>
                <em>
                  {dataSheetList?.length
                    ? "Select one"
                    : "No DataSheet created"}
                </em>
              </MenuItem>
              {(dataSheetList || []).map((dd) => (
                <MenuItem value={dd.id || dd._id} key={dd.id || dd._id}>
                  {dd.name}
                </MenuItem>
              ))}
            </Select>
          </div>

          <div
            className={classes.sectionEntry}
            style={{
              flex: 1,
              marginRight: !!dataSheet ? 0 : 0,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Typography
                gutterBottom
                className={classes.sectionTitle}
                style={{ marginBottom: 0 }}
              >
                Transpose data?
              </Typography>
              <Switch
                name="transposeData"
                checked={transposeData}
                onChange={(e) => prepareTranspose(e)}
                color="primary"
                size="small"
              />
            </div>
          </div>

          <Collapse in={transposeData}>
            <div
              className={classes.sectionEntry}
              style={{
                flex: 1,
                marginRight: !!dataSheet ? 0 : 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Typography gutterBottom className={classes.sectionTitle}>
                  Exclude fields
                  <Tooltip title="Exclude fields that are not numerical">
                    <span className="info-icon-tooltip-1">i</span>
                  </Tooltip>
                </Typography>
              </div>
              <Select
                name="excludedFromTranspose"
                key={`${columnSelectKey}-x`}
                variant="outlined"
                size="small"
                multiple
                fullWidth
                classes={{
                  root: classes.select,
                }}
                value={excludedFromTranspose || []}
                onChange={(e) => {
                  updateData(e, "dataConfig");
                }}
              >
                {getDataColumns({ skipTranspose: true })
                  .filter((col, index) => index > 0)
                  .map((col) => (
                    <MenuItem
                      key={`col-${col.id || col.name}`}
                      value={col.id || col.name}
                    >
                      {col.name}
                    </MenuItem>
                  ))}
              </Select>
            </div>
          </Collapse>
        </Collapse>

        <Collapse in={showSelectExtDB}>
          <Grid
            className={classes.sectionEntry}
            style={{ flex: 1, marginRight: !!dataSheet ? 0 : 0 }}
          >
            <Typography gutterBottom className={classes.sectionTitle}>
              Select from added external databases
            </Typography>

            <Select
              name="externalDB"
              variant="outlined"
              size="small"
              fullWidth
              classes={{
                root: classes.select,
              }}
              value={externalDB || "choose"}
              onChange={(e) => updateData(e, "dataConfig")}
            >
              <MenuItem>
                {externalDBTypesList?.length > 0
                  ? "Select one"
                  : "No externalDB List"}
              </MenuItem>

              {externalDBTypesList?.length > 0
                ? externalDBTypesList.map((typ, idx) => (
                    <MenuItem key={idx} value={typ}>
                      {typ}
                    </MenuItem>
                  ))
                : null}
            </Select>
          </Grid>
        </Collapse>

        <Collapse in={showSelectIntegration}>
          <div
            className={classes.sectionEntry}
            style={{ flex: 1, marginRight: !!dataSheet ? 0 : 0 }}
          >
            <Typography gutterBottom className={classes.sectionTitle}>
              Select Integration
            </Typography>
            <Select
              name="integration"
              variant="outlined"
              size="small"
              fullWidth
              classes={{
                root: classes.select,
              }}
              value={integration || "choose"}
              onChange={(e) => updateData(e, "dataConfig")}
            >
              <MenuItem value="choose" selected disabled>
                <em>
                  {integrationsList?.length
                    ? "Select one"
                    : "No Data integrations available"}
                </em>
              </MenuItem>
              {filterIntegrations()?.map((intg) => (
                <MenuItem value={intg.id} key={intg.id}>
                  <div>{intg.name}</div>
                </MenuItem>
              ))}
            </Select>
          </div>
        </Collapse>

        <Collapse in={showSelectTable}>
          <div
            className={classes.sectionEntry}
            style={{
              flex: 1,
            }}
          >
            <Typography gutterBottom className={classes.sectionTitle}>
              {dataSourceType === "googleSheet"
                ? `Select sheet`
                : "Table/collection"}
            </Typography>
            <Select
              name="table"
              variant="outlined"
              size="small"
              fullWidth
              classes={{
                root: classes.select,
              }}
              value={table || "choose"}
              onChange={(e) => updateData(e, "dataConfig")}
            >
              <MenuItem value="choose" selected disabled>
                <em>Select one</em>
              </MenuItem>
              {resourcesList?.map((res) => (
                <MenuItem value={res.id || res._id} key={res.id || res._id}>
                  {res.name}
                </MenuItem>
              ))}
            </Select>
          </div>
          {/* )} */}
          {/* </div> */}
        </Collapse>

        <Collapse in={showSelectWorksheetTab}>
          <div
            className={classes.sectionEntry}
            style={{ flex: 1, marginRight: !!dataSheet ? 0 : 0 }}
          >
            <Typography gutterBottom className={classes.sectionTitle}>
              Specify tab in workbook
            </Typography>
            <Select
              name="worksheetTab"
              variant="outlined"
              size="small"
              fullWidth
              classes={{
                root: classes.select,
              }}
              value={worksheetTab || "choose"}
              onChange={(e) => updateData(e, "dataConfig")}
            >
              <MenuItem value="choose" selected disabled>
                <em>
                  {!!googleSheetSheetTabs?.length
                    ? "Select one"
                    : "No sheets available"}
                </em>
              </MenuItem>
              {googleSheetSheetTabs.map((sheet) => (
                <MenuItem value={sheet.title} key={sheet.id}>
                  {sheet.title}
                </MenuItem>
              ))}
            </Select>
          </div>
        </Collapse>

        <Collapse in={showSelectValCol}>
          <>
            {valueProperties?.map((vProps, index) => (
              <div
                style={{
                  border: multipleCharts ? "1px solid gray" : "none",
                  padding: multipleCharts ? "3px" : "0px",
                  borderRadius: multipleCharts ? "5px" : "0px",
                  margin: multipleCharts ? "0px 0px 6px" : "0px",
                }}
              >
                <div
                  className={classes.sectionEntry}
                  style={{
                    flex: 1,
                    marginRight: !!dataSheet ? 0 : 0,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Typography gutterBottom className={classes.sectionTitle}>
                      Values (Y) field/column
                    </Typography>
                    {multipleCharts && (
                      <div
                        style={{
                          gap: "8px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Tooltip title="Add line">
                          <AddCircleOutline
                            style={{
                              color: "#999999",
                              fontSize: 16,
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              valueProperties.push({});

                              updateSubData(
                                {
                                  target: {
                                    name: "addValueProperty",
                                    value: {},
                                  },
                                },
                                index
                              );
                            }}
                          />
                        </Tooltip>
                        {valueProperties.length > 1 && (
                          <Tooltip title="Delete line">
                            <div
                              style={{
                                borderRadius: "50%",
                                width: 14,
                                height: 14,
                                backgroundColor: "#dddddd",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                valueProperties.splice(index, 1);
                                updateSubData(
                                  {
                                    target: {
                                      name: "removeValueProps",
                                      value: valueProperties,
                                    },
                                  },
                                  index
                                );
                              }}
                            >
                              <CloseOutlined style={{ fontSize: 10 }} />
                            </div>
                          </Tooltip>
                        )}
                      </div>
                    )}
                  </div>
                  <Select
                    name="valueColumn"
                    key={columnSelectKey}
                    variant="outlined"
                    size="small"
                    fullWidth
                    classes={{
                      root: classes.select,
                    }}
                    value={vProps?.valueColumn || "choose"}
                    onChange={(e) => {
                      updateSubData(e, index);
                    }}
                  >
                    <MenuItem value="choose" selected disabled>
                      <em>
                        {getDataColumns()?.length
                          ? "Select one"
                          : "No columns found"}
                      </em>
                    </MenuItem>
                    {getDataColumns().map((col) => (
                      <MenuItem
                        key={`col-${col.id || col.name}`}
                        value={col.id || col.name}
                        // disabled={ _isAlreadySelected(col.id) }
                      >
                        {col.name}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                <div className={classes.sectionEntry}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Typography gutterBottom className={classes.sectionTitle}>
                      Values selection criteria
                    </Typography>
                    <Tooltip title="Add line">
                      <AddCircleOutline
                        style={{
                          color: "#999999",
                          fontSize: 16,
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          updateSubData(
                            {
                              target: {
                                name: "selectionConditions",
                                value: vProps?.["selectionConditions"]
                                  ? [...vProps?.["selectionConditions"], {}]
                                  : [{}],
                              },
                            },
                            index
                          );
                        }}
                      />
                    </Tooltip>
                  </div>

                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 5 }}
                  >
                    {vProps?.selectionConditions?.map((val, idx) => (
                      <Grid
                        style={{
                          marginBottom: 0,
                          alignItems: "center",
                          gap: 3,
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
                            marginRight: !!dataSheet ? 0 : 0,
                          }}
                        >
                          <Select
                            name="criteriaColumn"
                            variant="outlined"
                            size="small"
                            fullWidth
                            classes={{
                              root: classes.select,
                            }}
                            value={val?.criteriaColumn || "choose"}
                            onChange={(e) => _updateCriteria(e, idx, index)}
                          >
                            <MenuItem value="choose" selected disabled>
                              <em>
                                {dataSheetList?.length
                                  ? "Select one"
                                  : "No value found"}
                              </em>
                            </MenuItem>
                            {getDataColumns().map((col) => (
                              <MenuItem
                                key={`col-${col.id || col.name}`}
                                value={col.id || col.name}
                                // disabled={ _isAlreadySelected(col.id) }
                              >
                                {col.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </Grid>
                        <Grid
                          item
                          style={{
                            minWidth: 52,
                            maxWidth: 52,
                            display: "flex",
                          }}
                        >
                          <Select
                            name="criteriaOperator"
                            variant="outlined"
                            size="small"
                            fullWidth
                            placeholder="Select screen"
                            classes={{
                              root: classes.select,
                              outlined: classes.selected,
                            }}
                            value={val?.criteriaOperator || "choose"}
                            onChange={(e) => _updateCriteria(e, idx, index)}
                          >
                            <MenuItem value="choose" selected disabled>
                              <em>Select one</em>
                            </MenuItem>
                            {ConditionalOperators?.length > 0 &&
                              ConditionalOperators.map(
                                ({ value, symbol, title }, idx) => (
                                  <MenuItem value={value} key={idx}>
                                    {symbol} {title || "[ unnamed ]"}
                                  </MenuItem>
                                )
                              )}
                            <MenuItem value="top">Top ? values</MenuItem>
                            <MenuItem value="btm">Bottom ? values</MenuItem>
                          </Select>
                        </Grid>
                        <Grid
                          item
                          style={{
                            flex: 1,
                          }}
                        >
                          <TextField
                            name="criteriaValue"
                            variant="outlined"
                            size="small"
                            fullWidth
                            placeholder="Enter value"
                            InputProps={{
                              className: classes.input,
                            }}
                            value={val?.criteriaValue || ""}
                            onChange={(e) => _updateCriteria(e, idx, index)}
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
                              vProps?.selectionConditions.splice(idx, 1);
                              updateSubData(
                                {
                                  target: {
                                    name: "selectionConditions",
                                    value: vProps?.selectionConditions,
                                  },
                                },
                                index
                              );
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
                <div
                  className={classes.sectionEntry}
                  style={multipleCharts ? { marginBottom: 0 } : {}}
                >
                  <Typography gutterBottom className={classes.sectionTitle}>
                    Aggregation function
                  </Typography>

                  <Grid
                    style={{ marginBottom: 0, alignItems: "center", gap: 3 }}
                    container
                  >
                    {/* <li className={classes.decisionPrefix}>IF</li> */}
                    <Grid
                      item
                      style={{
                        flex: 1,
                        marginRight: !!dataSheet ? 0 : 0,
                      }}
                    >
                      <Select
                        name="aggregationFunction"
                        variant="outlined"
                        size="small"
                        fullWidth
                        classes={{
                          root: classes.select,
                        }}
                        value={vProps?.aggregationFunction || "none"}
                        onChange={(e) => {
                          updateSubData(e, index);
                        }}
                      >
                        {sectionType === "card" ? (
                          <MenuItem value="choose" selected disabled>
                            <em>
                              {dataSheetList?.length
                                ? "Select one"
                                : "No value found"}
                            </em>
                          </MenuItem>
                        ) : (
                          <MenuItem value="none">None</MenuItem>
                        )}
                        <MenuItem value="SUM">SUM</MenuItem>
                        <MenuItem value="AVERAGE">AVERAGE</MenuItem>
                        <MenuItem value="COUNT">COUNT</MenuItem>
                        <MenuItem value="MIN">MIN</MenuItem>
                        <MenuItem value="MAX">MAX</MenuItem>
                      </Select>
                    </Grid>
                  </Grid>
                </div>
              </div>
            ))}
            {sectionType === "card" && (
              <>
                <div
                  className={classes.sectionEntry}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 14,
                    marginTop: 20,
                  }}
                >
                  <div>
                    <div
                      className="sidebar-section-item"
                      style={{ width: "100%" }}
                    >
                      <Typography
                        gutterBottom
                        className="row-label"
                        style={{ width: "auto", marginBottom: 5 }}
                      >
                        Value prefix
                      </Typography>
                    </div>
                    <TextField
                      name="valuePrefix"
                      variant="outlined"
                      size="small"
                      fullWidth
                      placeholder="e.g. currency"
                      InputProps={{
                        className: classes.input,
                      }}
                      value={valuePrefix || ""}
                      onChange={(e) => updateData(e, "dataConfig")}
                    />
                  </div>
                  <div>
                    <div
                      className="sidebar-section-item"
                      style={{ width: "100%" }}
                    >
                      <Typography
                        gutterBottom
                        className="row-label"
                        style={{ width: "auto", marginBottom: 5 }}
                      >
                        Value suffix/unit
                      </Typography>
                    </div>
                    <TextField
                      name="valueSuffix"
                      variant="outlined"
                      size="small"
                      fullWidth
                      placeholder="e.g. %"
                      InputProps={{
                        className: classes.input,
                      }}
                      value={valueSuffix || ""}
                      onChange={(e) => updateData(e, "dataConfig")}
                    />
                  </div>
                </div>
              </>
            )}
            {sectionType === "chart" && (
              <div className={classes.sectionEntry}>
                <Typography gutterBottom className={classes.sectionTitle}>
                  Reference (X) field/column
                </Typography>

                <Grid
                  style={{ marginBottom: 0, alignItems: "center", gap: 3 }}
                  container
                >
                  {/* <li className={classes.decisionPrefix}>IF</li> */}
                  <Grid
                    item
                    style={{
                      flex: 1,
                      marginRight: !!dataSheet ? 0 : 0,
                    }}
                  >
                    <Select
                      name="referenceColumn"
                      variant="outlined"
                      size="small"
                      fullWidth
                      classes={{
                        root: classes.select,
                      }}
                      value={referenceColumn || "choose"}
                      onChange={(e) => updateData(e, "dataConfig")}
                    >
                      <MenuItem value="choose" selected disabled>
                        <em>
                          {dataSheetList?.length
                            ? "Select one"
                            : "No value found"}
                        </em>
                      </MenuItem>
                      {getDataColumns().map((col) => (
                        <MenuItem
                          key={`col-${col.id || col.name}`}
                          value={col.id || col.name}
                          // disabled={ _isAlreadySelected(col.id) }
                        >
                          {col.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                </Grid>
              </div>
            )}
          </>
        </Collapse>
      </div>{" "}
    </Collapse>
  );
};

export default DashboardDataConfiguration;
