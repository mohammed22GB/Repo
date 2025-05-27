import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Select,
  MenuItem,
  Collapse,
  Grid,
  TextField,
  Tooltip,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { v4 } from "uuid";
import {
  AddCircleOutline,
  CloseOutlined,
  RefreshOutlined,
} from "@material-ui/icons";
import { useQueryClient } from "react-query";
import { getGoogleSheetSheet } from "../../../../../../../../../Integrations/utils/integrationsAPIs";
import { groupIntegrations } from "../../../../../../utils/tasksHelpers";
import {
  ConditionalOperators,
  WORKFLOWS_DATASOURCE_AGGREGATIONS,
  WORKFLOWS_DATASOURCE_TYPES,
  allOperators,
  dataNodeUpdateMethods,
  plugDataSourceTypes,
} from "../../../../../utils/constants";
import SelectOnSteroids from "../SelectOnSteroids";
import VariablesMenuItems from "../../../../../../utils/VariablesMenuItems";
import DataMatchingBox from "../DataMatchingBox";
import DataMappingBox from "../DataMappingBox";
import { useStyles } from "../../../Helpers/rightSidebarStyles";
import DataHasDecision from "../DataHasDecision";
import InputTypesDropDown from "../../../../../../../../../common/components/DropDown/InputTypesDropDown";
import { getTaskVariables } from "../../../../../utils/workflowFuncs";
import {
  getAllWorkflowDatasheets,
  getAllWorkflowIntegrations,
} from "../../../../../../utils/workflowHelpers";

const sectionType = null; //  this variable is redundant. But the feature might be useful...kinda

const DataActivitiesModule = ({
  data,
  updateData,
  moduleSource = "screenDynamicContent",
  dataFlow = "source",
  topFieldLabel = null,
  taskHasDecision = false,
  taskDecisionActions = [],
  dataOperationIds = [],
  lookupContents,
}) => {
  // moduleSource = moduleSource || "screenDynamicContent";
  const classes = useStyles(makeStyles);

  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const {
    variable,
    googleSheet,
    dataSourceType,
    externalDB,
    dataSheet,
    integration,
    table,
    worksheetTab,
    valueColumn,
    condition,
    selectionConditions: selectionConditions_,
    aggregationFunction,
    referenceColumn,
    valuePrefix,
    valueSuffix,
    dataMethod,
    isLookupField = false,
    dataOperationId,
    dataUpdateParams,
    aggregatedField,
    selectedFields,
    retrievedDataVariableName,
    hasDecision,
    decisionCriterion,
    dataMatching,
    dataMapping,
    tableColumns,
  } = data || {};

  const {
    workflowTasks,
    workflowCanvas,
    activeTask,
    variables: allVariables,
  } = useSelector(({ workflows }) => workflows);

  const { id: activeTaskId } = activeTask;
  const variables = getTaskVariables(activeTaskId, allVariables);

  const selectionConditions = selectionConditions_ || condition || [{}];
  const [dataSheetList, setDataSheetList] = useState([]);
  const [googleSheetSheetTabs, setGoogleSheetSheetTabs] = useState([]);
  const [integrationsList, setIntegrationsList] = useState([]);
  const [externalDBTypesList, setExternalDBTypesList] = useState([]);
  const [resourcesList, setResourcesList] = useState([]);
  const [googleSheetColumns, setGoogleSheetColumns] = useState([]);

  const [showSelectVariable, setShowSelectVariable] = useState(false);
  const [showSelectDatasheet, setShowSelectDatasheet] = useState(false);
  const [showSelectExtDB, setShowSelectExtDB] = useState(false);
  const [showSelectIntegration, setShowSelectIntegration] = useState(false);
  const [showSelectTable, setShowSelectTable] = useState(false);
  const [showSelectWorksheetTab, setShowSelectWorksheetTab] = useState(false);
  const [showSelectValCol, setShowSelectValCol] = useState(false);
  const [showSelectValCondition, setShowSelectValCondition] = useState(false);
  const [showDataMatchingBox, setShowDataMatchingBox] = useState(false);
  const [showDataMappingBox, setShowDataMappingBox] = useState(false);
  const [showInputTypeComponent, setShowInputTypeComponent] = useState(true);
  const [fieldsKey, setFieldsKey] = useState("-");
  const [isLoadingIntegrations, setIsLoadingIntegrations] = useState(false);
  const [isLoadingDatasheets, setIsLoadingDatasheets] = useState(false);

  useEffect(() => {
    const options = {
      query: {
        active: true,
        per_page: 1000,
      },
    };

    refreshIntegrations(false);
    refreshDatasheets(false);
  }, []);

  useEffect(() => {
    setFieldsKey(v4());
  }, [activeTaskId]);

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
      if (dataSourceType === plugDataSourceTypes.GOOGLESHEET) {
        const resources =
          integrationsList.find((intg) => intg.id === integration)?.resources ||
          [];
        setResourcesList(resources);
      }
      if (dataSourceType === plugDataSourceTypes.EXTERNALDATABASE) {
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

      try {
        if (dataSourceType === plugDataSourceTypes.GOOGLESHEET) {
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
      } catch (err) {
        console.error(err);
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

    if (
      dataSourceType === plugDataSourceTypes.GOOGLESHEET &&
      (dataFlow === "source") === showSelectValCol &&
      integration &&
      table &&
      worksheetTab
    ) {
      getSheetColumns();
    }
  }, [worksheetTab, showSelectValCol]);

  useEffect(() => {
    setShowSelectVariable(
      dataSourceType === plugDataSourceTypes.VARIABLES &&
        !["screenDynamicContentTable"].includes(moduleSource)
    );
    setShowSelectDatasheet(dataSourceType === plugDataSourceTypes.DATASHEET);
    setShowSelectExtDB(dataSourceType === plugDataSourceTypes.EXTERNALDATABASE);
    setShowSelectIntegration(
      (dataSourceType === plugDataSourceTypes.EXTERNALDATABASE &&
        !!externalDB) ||
        dataSourceType === plugDataSourceTypes.GOOGLESHEET
    );
    setShowSelectTable(showSelectIntegration && !!integration);
    setShowSelectWorksheetTab(
      dataSourceType === plugDataSourceTypes.GOOGLESHEET &&
        showSelectTable &&
        !!table
    );
    const _preset =
      (dataSourceType === plugDataSourceTypes.DATASHEET && !!dataSheet) ||
      (showSelectWorksheetTab && !!worksheetTab && !!table) ||
      (dataSourceType === plugDataSourceTypes.EXTERNALDATABASE &&
        !!integration &&
        !!table);

    setShowSelectValCol(
      _preset &&
        !["screenDynamicContentTable", "screenLookupContent"].includes(
          moduleSource
        ) &&
        dataFlow === "source"
    );
    setShowSelectValCondition(_preset && dataFlow === "source");

    setShowDataMatchingBox(
      ["dataNode", "screenLookupContent"].includes(moduleSource) &&
        (_preset || dataSourceType === plugDataSourceTypes.VARIABLES)
    );

    setShowDataMappingBox(
      ["screenDynamicContentTable"].includes(moduleSource) &&
        (_preset || dataSourceType === plugDataSourceTypes.VARIABLES)
    );
  }, [
    dataSourceType,
    externalDB,
    worksheetTab,
    table,
    dataSheet,
    integration,
    showSelectIntegration,
    showSelectTable,
    showSelectWorksheetTab,
  ]);

  const _updateCriteria = (e, index) => {
    setShowInputTypeComponent(() => false);
    const selectionCondition_ = [...selectionConditions];
    selectionCondition_[index] = {
      ...selectionCondition_[index],
      [e.target.name]: e.target.value,
    };
    updateData({
      target: {
        name: "selectionConditions",
        value: selectionCondition_,
      },
    });
  };

  const getDataColumns = () => {
    switch (dataSourceType) {
      case plugDataSourceTypes.VARIABLES:
        return moduleSource === "screenDynamicContentTable"
          ? tableColumns.map((column) => {
              return {
                name: column.dataText,
                ...column,
              };
            })
          : [];

      case plugDataSourceTypes.DATASHEET:
        return (
          dataSheetList.find((dataSheetItem) => dataSheetItem._id === dataSheet)
            ?.columns || []
        );

      case plugDataSourceTypes.GOOGLESHEET:
        return googleSheetColumns.map((gsColumn) => {
          gsColumn.id = gsColumn.name;
          return gsColumn;
        });

      case plugDataSourceTypes.EXTERNALDATABASE:
        return (
          integrationsList
            ?.find((integration) => integration.id === integration)
            ?.resources.find((resource) => resource._id === table)?.columns ||
          []
        );

      default:
        return (
          dataSheetList.find((dataSheetItem) => dataSheetItem.id === dataSheet)
            ?.columns || []
        );
    }
  };

  const refreshDatasheets = async (refresh) => {
    setIsLoadingDatasheets(true);
    const datasheetsList = await dispatch(getAllWorkflowDatasheets(refresh));
    setDataSheetList(datasheetsList || []);
    setIsLoadingDatasheets(false);
  };

  const refreshIntegrations = async (refresh) => {
    setIsLoadingIntegrations(true);
    const grouped_integrations = await dispatch(
      getAllWorkflowIntegrations(refresh, true)
    );
    setIntegrationsList(grouped_integrations?.data || []);
    getExtDBTypes(grouped_integrations?.data);
    setIsLoadingIntegrations(false);
  };

  const filterIntegrations = () => {
    if (dataSourceType === plugDataSourceTypes.GOOGLESHEET) {
      return integrationsList?.filter(
        (integration) => integration.type === "Google Sheet"
      );
    } else {
      return integrationsList?.filter(
        (integration) => integration.type === externalDB
      );
    }
  };

  const getExtDBTypes = (intgList) => {
    const types_ = intgList
      ?.filter((intg) => intg.type !== "Google Sheet")
      ?.map((intg) => intg.type);
    const types = [...new Set(types_)];
    setExternalDBTypesList(types);
  };

  const dataFieldsLabelAndName = {
    screenLookupContent: {
      column: {
        label: "Value Column",
        name: "column",
      },
      selectionConditions: {
        label: "Condition Column",
        name: "condition",
      },
      conditionColumn: {
        name: "conditionColumn",
      },
      conditionValue: {
        name: "conditionValue",
      },
      conditionOperator: {
        name: "conditionOperator",
      },
      conditionDataType: {
        name: "dataType",
      },
    },
    screenDynamicContent: {
      column: {
        label: "Value Column",
        name: "column",
      },
      selectionConditions: {
        label: "Condition column",
        name: "condition",
      },
      conditionColumn: {
        name: "conditionColumn",
      },
      conditionValue: {
        name: "conditionValue",
      },
      conditionOperator: {
        name: "conditionOperator",
      },
      conditionDataType: {
        name: "dataType",
      },
    },
    screenDynamicContentTable: {
      column: {
        label: "Value Column",
        name: "column",
      },
      selectionConditions: {
        label: "Condition column",
        name: "condition",
      },
      conditionColumn: {
        name: "conditionColumn",
      },
      conditionValue: {
        name: "conditionValue",
      },
      conditionOperator: {
        name: "conditionOperator",
      },
      conditionDataType: {
        name: "dataType",
      },
    },
    dataNode: {
      column: {
        label: "Value Column",
        name: "column",
      },
      selectionConditions: {
        label: "Condition column",
        name: "condition",
      },
      conditionColumn: {
        name: "conditionColumn",
      },
      conditionValue: {
        name: "conditionValue",
      },
      conditionOperator: {
        name: "conditionOperator",
      },
      conditionDataType: {
        name: "dataType",
      },
    },
    customNode: {
      column: {
        label: "Value Column",
        name: "column",
      },
      selectionConditions: {
        label: "Condition column",
        name: "condition",
      },
      conditionColumn: {
        name: "conditionColumn",
      },
      conditionValue: {
        name: "conditionValue",
      },
      conditionOperator: {
        name: "conditionOperator",
      },
      conditionDataType: {
        name: "dataType",
      },
    },
    dashboardDataConfig: {
      column: {
        label: "Values (Y) Field/Column",
        name: "valueColumn",
      },
      selectionConditions: {
        label: "Values Selection Criteria",
        name: "condition",
      },
      conditionColumn: {
        name: "criteriaColumn",
      },
      conditionValue: {
        name: "criteriaValue",
      },
      conditionOperator: {
        name: "criteriaOperator",
      },
      conditionDataType: {
        name: "dataType",
      },
    },
  };

  const _updateData = (e) => {
    const initDataProps = {
      dataMatching: null,
      dataMapping: {},
      dataMethod: "new",
      dataUpdateParams: [],
      aggregationFunction: null,
      aggregatedField: null,
      selectedFields: [],
      hasDecision: false,
      decisionCriterion: {},
      // decisionActions: [],
    };
    switch (e.target.name) {
      case "dataSourceType":
        updateData(
          {
            ...initDataProps,
            dataSourceType: e.target.value,
            externalDB: null,
            worksheetTab: null,
            table: null,
            dataSheet: null,
            integration: null,
            valueColumn: null,
          },
          null,
          true
        );
        break;

      case "externalDB":
        updateData(
          {
            ...initDataProps,
            externalDB: e.target.value,
            worksheetTab: null,
            table: null,
            dataSheet: null,
            integration: null,
            valueColumn: null,
          },
          null,
          true
        );
        break;

      case "integration":
        updateData(
          {
            ...initDataProps,
            integration: e.target.value,
            worksheetTab: null,
            table: null,
            valueColumn: null,
          },
          null,
          true
        );
        break;

      case "table":
        updateData(
          {
            ...initDataProps,
            table: e.target.value,
            worksheetTab: null,
            valueColumn: null,
          },
          null,
          true
        );
        break;
      case "worksheetTab":
        updateData(
          {
            ...initDataProps,
            worksheetTab: e.target.value,
            valueColumn: null,
          },
          null,
          true
        );
        break;

      case "dataSheet":
        updateData(
          {
            ...initDataProps,
            dataSheet: e.target.value,
            valueColumn: null,
          },
          null,
          true
        );
        break;

      case "dataMethod":
        updateData(
          {
            ...initDataProps,
            dataMethod: e.target.value,
          },
          null,
          true
        );
        break;

      default:
        break;
    }
  };

  const MenuItems = (excludeType, exclude) =>
    VariablesMenuItems({
      variables,
      classes,
      workflowCanvas,
      excludeType,
      exclude,
    });

  const dataUpdateMethod = () => (
    <div className={classes.sectionEntry} style={{ flex: 1 }}>
      <Typography gutterBottom className={classes.sectionTitle}>
        Method
      </Typography>
      <Select
        name="dataMethod"
        variant="outlined"
        size="small"
        fullWidth
        classes={{
          root: classes.select,
        }}
        value={dataMethod}
        onChange={_updateData}
      >
        <MenuItem value={dataNodeUpdateMethods.NEW}>Insert new entry</MenuItem>
        <MenuItem value={dataNodeUpdateMethods.UPDATE}>
          Update existing entry
        </MenuItem>
        <MenuItem value={dataNodeUpdateMethods.RETRIEVE}>
          Retrieve data from source
        </MenuItem>
      </Select>
    </div>
  );

  return (
    <Collapse in={true}>
      <div className={classes.section} style={{ padding: 0 }}>
        <div className={classes.sectionEntry}>
          {topFieldLabel || (
            <Typography gutterBottom className={classes.sectionTitle}>
              Data source type
            </Typography>
          )}
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
            onChange={
              _updateData
              // !!integration ? resetDataConfig(e.target.value) : updateData(e)
            }
          >
            <MenuItem value="choose" disabled>
              <em>Select data source type</em>
            </MenuItem>
            {WORKFLOWS_DATASOURCE_TYPES.filter((sourceType) =>
              sourceType[2].includes(dataFlow)
            ).map((sourceType, index) => (
              <MenuItem
                value={sourceType[0]}
                selected
                key={`${sourceType}-${index}`}
              >
                {sourceType[1]}
              </MenuItem>
            ))}
          </Select>
        </div>

        <Collapse in={showSelectVariable}>
          <div className={classes.sectionEntry} style={{ flex: 1 }}>
            <Typography gutterBottom className={classes.sectionTitle}>
              Select variable(s)
            </Typography>
            <SelectOnSteroids
              source="content"
              value={variable}
              variables={variables}
              onChange={(v) =>
                updateData({ target: { name: "variable", value: v } })
              }
              type="text"
              variablesAndCustomOnly
              placeholderText="Select/type value"
              multiple={false}
            />
          </div>
        </Collapse>

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
                Select datasheet
              </Typography>
              <Tooltip title="Refresh datasheets">
                <RefreshOutlined
                  className={isLoadingDatasheets ? "icon-spin" : ""}
                  style={{
                    fontSize: 16,
                    ...(isLoadingDatasheets
                      ? { color: "#06188f", cursor: "default" }
                      : { color: "#999", cursor: "pointer" }),
                  }}
                  onClick={() =>
                    !isLoadingDatasheets && refreshDatasheets(true)
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
              onChange={_updateData}
            >
              <MenuItem value="choose" selected disabled>
                <em>
                  {dataSheetList?.length
                    ? "Select one"
                    : "No DataSheet created"}
                </em>
              </MenuItem>
              {(dataSheetList || []).map((dd, index) => (
                <MenuItem
                  value={dd.id || dd._id}
                  key={`${dd.id || dd._id}-${index}`}
                >
                  {dd.name}
                </MenuItem>
              ))}
            </Select>
          </div>
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
              onChange={_updateData}
            >
              <MenuItem value="choose" selected disabled>
                {externalDBTypesList?.length > 0
                  ? "Select one"
                  : "No externalDB List"}
              </MenuItem>

              {externalDBTypesList?.length > 0
                ? externalDBTypesList.map((typ, idx) => (
                    <MenuItem key={`${typ}-${idx}`} value={typ}>
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography gutterBottom className={classes.sectionTitle}>
                Select integration
              </Typography>
              <Tooltip title="Refresh integrations">
                <RefreshOutlined
                  className={isLoadingIntegrations ? "icon-spin" : ""}
                  style={{
                    fontSize: 16,
                    ...(isLoadingIntegrations
                      ? { color: "#06188f", cursor: "default" }
                      : { color: "#999", cursor: "pointer" }),
                  }}
                  onClick={() =>
                    !isLoadingIntegrations && refreshIntegrations(true)
                  }
                />
              </Tooltip>
            </div>
            <Select
              name="integration"
              variant="outlined"
              size="small"
              fullWidth
              classes={{
                root: classes.select,
              }}
              value={integration || "choose"}
              onChange={_updateData}
            >
              <MenuItem value="choose" selected disabled>
                <em>
                  {integrationsList?.length
                    ? "Select one"
                    : "No data integrations available"}
                </em>
              </MenuItem>
              {filterIntegrations()?.map((intg, index) => (
                <MenuItem value={intg.id} key={`${intg.id}-${index}`}>
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
              {dataSourceType === plugDataSourceTypes.GOOGLESHEET
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
              // value={
              //   (dataSourceType === plugDataSourceTypes.EXTERNALDATABASE
              //     ? dataProps.table
              //     : googleSheet?.spreadSheet) || "choose"
              // }
              value={table || "choose"}
              onChange={_updateData}
            >
              <MenuItem value="choose" selected disabled>
                <em>Select one</em>
              </MenuItem>
              {resourcesList?.map((res, index) => (
                <MenuItem
                  value={res.id || res._id}
                  key={`${res.id || res._id}-${index}`}
                >
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
              onChange={_updateData}
            >
              <MenuItem value="choose" selected disabled>
                <em>
                  {!!googleSheetSheetTabs?.length
                    ? "Select one"
                    : "No sheets available"}
                </em>
              </MenuItem>
              {googleSheetSheetTabs.map((sheet, index) => (
                <MenuItem value={sheet.title} key={`${sheet.id}-${index}`}>
                  {sheet.title}
                </MenuItem>
              ))}
            </Select>
          </div>
        </Collapse>

        <Collapse in={showSelectValCol}>
          <>
            <div
              className={classes.sectionEntry}
              style={{
                flex: 1,
                marginRight: !!dataSheet ? 0 : 0,
              }}
            >
              <Typography gutterBottom className={classes.sectionTitle}>
                {dataFieldsLabelAndName?.[moduleSource].column.label}
              </Typography>
              <Select
                name="valueColumn"
                variant="outlined"
                size="small"
                fullWidth
                classes={{
                  root: classes.select,
                }}
                value={valueColumn || "choose"}
                onChange={updateData}
              >
                <MenuItem value="choose" selected disabled>
                  <em>
                    {getDataColumns()?.length
                      ? "Select one"
                      : "No columns found"}
                  </em>
                </MenuItem>
                {getDataColumns().map((col, index) => (
                  <MenuItem
                    key={`col-${col.id || col.name}-${index}`}
                    value={col.id || col.name}
                    // disabled={ _isAlreadySelected(col.id) }
                  >
                    {col.name}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className={classes.sectionEntry}>
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
                    value={aggregationFunction || "None"}
                    onChange={updateData}
                  >
                    {WORKFLOWS_DATASOURCE_AGGREGATIONS.map(
                      (aggregation, index) => (
                        <MenuItem
                          value={aggregation[0]}
                          key={`${aggregation[0]}-${index}`}
                        >
                          {aggregation[1]}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </Grid>
              </Grid>
            </div>
            {sectionType === "card" && (
              <>
                <div className={classes.sectionEntry}>
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
                        value={aggregationFunction || "choose"}
                        onChange={updateData}
                      >
                        <MenuItem value="choose" selected disabled>
                          <em>
                            {dataSheetList?.length
                              ? "Select one"
                              : "No value found"}
                          </em>
                        </MenuItem>
                        <MenuItem value="SUM">SUM</MenuItem>
                        <MenuItem value="AVERAGE">AVERAGE</MenuItem>
                        <MenuItem value="COUNT">COUNT</MenuItem>
                        <MenuItem value="MIN">MIN</MenuItem>
                        <MenuItem value="MAX">MAX</MenuItem>
                      </Select>
                    </Grid>
                  </Grid>
                </div>
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
                      key={`${fieldsKey}-1`}
                      name="valuePrefix"
                      variant="outlined"
                      size="small"
                      fullWidth
                      placeholder="e.g. currency"
                      InputProps={{
                        className: classes.input,
                      }}
                      defaultValue={valuePrefix || ""}
                      onChange={updateData}
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
                      key={`${fieldsKey}-2`}
                      name="valueSuffix"
                      variant="outlined"
                      size="small"
                      fullWidth
                      placeholder="e.g. %"
                      InputProps={{
                        className: classes.input,
                      }}
                      defaultValue={valueSuffix || ""}
                      onChange={updateData}
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
                      onChange={updateData}
                    >
                      <MenuItem value="choose" selected disabled>
                        <em>
                          {dataSheetList?.length
                            ? "Select one"
                            : "No value found"}
                        </em>
                      </MenuItem>
                      {getDataColumns().map((col, index) => (
                        <MenuItem
                          key={`col-${col.id || col.name}-${index}`}
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

        <Collapse in={showSelectValCondition}>
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
                {
                  dataFieldsLabelAndName?.[moduleSource]?.selectionConditions
                    ?.label
                }
              </Typography>
              {moduleSource !== "screenLookupContent" && (
                <Tooltip title="Add line">
                  <AddCircleOutline
                    style={{
                      color: "#999999",
                      fontSize: 16,
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      selectionConditions.push({});
                      updateData({
                        target: {
                          name: dataFieldsLabelAndName?.[moduleSource]
                            ?.selectionConditions?.name,
                          value: selectionConditions,
                        },
                      });
                    }}
                  />
                </Tooltip>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {selectionConditions.map((val, idx) => (
                <div
                  style={{
                    display: "flex",
                    marginBottom: 0,
                    alignItems: "center",
                    gap: 3,
                    flexDirection:
                      moduleSource === "screenLookupContent"
                        ? "row-reverse"
                        : "row",
                    position: "relative",
                  }}
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
                      name={
                        dataFieldsLabelAndName?.[moduleSource]?.conditionColumn
                          ?.name
                      }
                      variant="outlined"
                      size="small"
                      fullWidth
                      classes={{
                        root: classes.select,
                      }}
                      value={
                        val?.[
                          dataFieldsLabelAndName?.[moduleSource]
                            ?.conditionColumn?.name
                        ] || "choose"
                      }
                      onChange={(e) => _updateCriteria(e, idx)}
                    >
                      <MenuItem value="choose" selected disabled>
                        <em>
                          {dataSheetList?.length
                            ? "Select one"
                            : "No value found"}
                        </em>
                      </MenuItem>
                      {getDataColumns().map((col, index) => (
                        <MenuItem
                          key={`col-${col.id || col.name}-${index}`}
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
                    style={{ minWidth: 52, maxWidth: 52, display: "flex" }}
                  >
                    <Select
                      name={
                        dataFieldsLabelAndName?.[moduleSource]
                          ?.conditionOperator?.name
                      }
                      variant="outlined"
                      size="small"
                      fullWidth
                      placeholder="Operator"
                      className="conditional-operator-select-field"
                      classes={{
                        root: classes.select,
                        outlined: classes.selected,
                      }}
                      value={
                        val?.[
                          dataFieldsLabelAndName?.[moduleSource]
                            ?.conditionOperator?.name
                        ] || "choose"
                      }
                      onChange={(e) => _updateCriteria(e, idx)}
                    >
                      <MenuItem value="choose" selected disabled>
                        ??
                      </MenuItem>
                      {/* filter is temporary until operations implemented for lookup */}
                      {ConditionalOperators?.filter(
                        (operator) =>
                          !isLookupField ||
                          operator.value === allOperators.EQUALS
                      )?.map(({ value, symbol, title }, idx) => (
                        <MenuItem value={value} key={`${value}-${idx}`}>
                          {symbol}{" "}
                          <span style={{ marginLeft: 5 }}>{title}</span>
                        </MenuItem>
                      ))}
                      {/* filter is temporary until operations implemented for lookup */}
                      {!isLookupField && [
                        <MenuItem value="top">Top ? values</MenuItem>,
                        <MenuItem value="btm">Bottom ? values</MenuItem>,
                      ]}
                    </Select>
                  </Grid>
                  <Grid
                    item
                    style={{
                      flex: 1,
                    }}
                  >
                    {moduleSource !== "screenLookupContent" ? (
                      <SelectOnSteroids
                        name={
                          dataFieldsLabelAndName?.[moduleSource]?.conditionValue
                            ?.name || ""
                        }
                        trackChange
                        source="content"
                        variables={variables}
                        onChange={(v) =>
                          _updateCriteria(
                            {
                              target: {
                                name: dataFieldsLabelAndName?.[moduleSource]
                                  ?.conditionValue?.name,
                                value: v,
                              },
                            },
                            idx
                          )
                        }
                        // onChange={(e) => _setTaskInfo(e, "reassign")}
                        value={
                          val?.[
                            dataFieldsLabelAndName?.[moduleSource]
                              ?.conditionValue?.name
                          ] || ""
                        }
                        type="text"
                        placeholderText="Select *"
                        variablesAndCustomOnly
                        multiple={false}
                      />
                    ) : (
                      <Typography style={{ fontWeight: 500, fontSize: 12 }}>
                        Where lookup field:
                      </Typography>
                    )}

                    <InputTypesDropDown
                      classes={classes}
                      showInputTypeComponent={showInputTypeComponent}
                      submitAction={(e) => _updateCriteria(e, idx)}
                      name={
                        dataFieldsLabelAndName?.[moduleSource]
                          ?.conditionDataType?.name || ""
                      }
                      value={
                        val?.[
                          dataFieldsLabelAndName?.[moduleSource]
                            ?.conditionDataType?.name
                        ] || ""
                      }
                    />
                  </Grid>
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
                        selectionConditions.splice(idx, 1);
                        updateData({
                          target: {
                            name: dataFieldsLabelAndName?.[moduleSource]
                              ?.selectionConditions?.name,
                            value: selectionConditions,
                          },
                        });
                      }}
                    >
                      <CloseOutlined style={{ fontSize: 10 }} />
                    </div>
                  </Tooltip>
                  {/* )} */}
                </div>
              ))}
            </div>
          </div>
        </Collapse>

        {showDataMatchingBox && (
          <>
            {!isLookupField ? dataUpdateMethod() : ""}

            <Collapse
              in={dataMethod === dataNodeUpdateMethods.RETRIEVE}
              style={{
                marginTop: 10,
                overflow: "auto",
              }}
            >
              <div className={classes.sectionEntry}>
                <Typography gutterBottom className={classes.sectionTitle}>
                  Variable name
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
                    <TextField
                      key={`${fieldsKey}-3`}
                      name="retrievedDataVariableName"
                      variant="outlined"
                      size="small"
                      fullWidth
                      placeholder="Give variable a name"
                      defaultValue={
                        retrievedDataVariableName ||
                        `variable-${dataOperationId}`
                      }
                      InputProps={{
                        className: classes.input,
                      }}
                      // onChange={updateData}
                      onBlur={updateData}
                    />
                  </Grid>
                </Grid>
              </div>
            </Collapse>

            <Collapse in={showDataMatchingBox}>
              <DataMatchingBox
                variables={allVariables}
                MenuItems={MenuItems}
                isLookupField={isLookupField}
                dataOperationIds={dataOperationIds}
                componentData={{
                  dataOperationId,
                  dataMatching,
                  dataMethod,
                  dataUpdateParams,
                  aggregationFunction,
                  aggregatedField,
                  selectedFields,
                }}
                retrievedDataVariableName={retrievedDataVariableName}
                updateComponentData={updateData}
                getDataColumns={getDataColumns}
                activeTaskId={activeTaskId}
                lookupContents={lookupContents}
                dataObj={data}
              />
            </Collapse>

            <Collapse
              in={dataMethod === dataNodeUpdateMethods.RETRIEVE}
              style={{
                marginTop: 10,
                // overflow: "auto",
              }}
            >
              <DataHasDecision
                classes={classes}
                hasDecision={hasDecision}
                updateData={updateData}
                dataOperationId={dataOperationId}
                aggregationFunction={aggregationFunction}
                decisionCriterion={decisionCriterion}
                variables={allVariables}
                activeTaskId={activeTaskId}
                taskDecisionActions={taskDecisionActions}
                taskHasDecision={taskHasDecision}
                workflowCanvas={workflowCanvas}
              />
            </Collapse>
          </>
        )}

        {showDataMappingBox && (
          <Collapse in={showDataMappingBox}>
            <DataMappingBox
              MenuItems={
                dataSourceType === plugDataSourceTypes.VARIABLES && MenuItems
              }
              componentData={dataMapping}
              updateComponentData={(v) =>
                updateData({ target: { name: "dataMapping", value: v } })
              }
              getDataColumns={getDataColumns}
              tableColumns={tableColumns}
              workflowTasks={workflowTasks}
            />
          </Collapse>
        )}
      </div>
    </Collapse>
  );
};

export default DataActivitiesModule;
