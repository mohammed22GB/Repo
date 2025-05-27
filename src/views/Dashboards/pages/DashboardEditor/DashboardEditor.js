import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { IconButton, makeStyles, Tooltip } from "@material-ui/core";
import * as am5 from "@amcharts/amcharts5";
import { debounce } from "lodash";
import { v4 } from "uuid";
import {
  RiSplitCellsHorizontal,
  RiDeleteBinLine,
  RiSplitCellsVertical,
  RiDownloadLine,
} from "react-icons/ri";
import ReactToPdf from "react-to-pdf";
import { CachedOutlined, Settings } from "@material-ui/icons";
import moment from "moment";
import { FormControlLabel, Switch } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";

import {
  getDashboardStructureAPI,
  loadDashboardDataAPI,
  updateDashboardAPI,
} from "../../utils/dashboardsAPIs";
import DashboardEditorSidebar from "./components/DashboardEditorSidebar";
import { generateChart } from "../../utils/chartGenerators";
import {
  filterDuplicateItems,
  groupPermissionsByAccess,
} from "../../../Datasheets/utils";
import useCustomQuery from "../../../common/utils/CustomQuery";
import { getResourcePermissions } from "../../../common/components/Query/DataSheets/datasheetQuery";
import { setDataPermissions } from "../../../common/helpers/Data";
import { errorToastify, successToastify } from "../../../common/utils/Toastify";
import MainPageLayout from "../../../common/components/AppLayout/MainPageLayout";
import { mainNavigationListNames } from "../../../common/utils/lists";
import { multiChartNames } from "../../../common/utils/constants";

const useStyles = makeStyles((theme) => ({
  sideHeading: {
    color: "#091540",
    // fontWeight: 600,
    fontSize: 12,
    paddingLeft: 10,
    paddingTop: 10,
    textTransform: "capitalize",
    display: "inline-flex",
    alignItems: "center",
  },
  section: {
    padding: 10,
    paddingBottom: 20,
  },
  closeIcon: {
    fontSize: 16,
    color: "#AAAAAA",
    marginRight: 10,
    cursor: "pointer",
    "&:hover": {
      color: "#091540",
    },
  },
  sectionTitle: {
    color: "#999",
    fontSize: 12,
    marginBottom: 5,
  },
  input: {
    color: "#091540",
    fontSize: 12,
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 12,
    fontWeight: 600,
  },
  select: {
    color: "#091540",
    fontSize: 12,
    padding: 10,
  },
  sideHeadingBar: {
    backgroundColor: "#f8f8f8",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    height: 32,
    "&:hover": {
      opacity: 0.7,
    },
  },
  sectionEntry: {
    marginBottom: 13,
  },
  selected: {
    "& span": {
      display: "none",
    },
  },
  topView: {
    display: "flex",
    alignItems: "center",
  },
  preparePDFLayer: {
    position: "absolute",
    backgroundColor: " #becbcea3",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: 300,
    color: "black",
    fontSize: 14,
    fontWeight: 700,
  },
}));

const DashboardEditor = ({ match }) => {
  const classes = useStyles(makeStyles);
  const history = useHistory();
  const { slug } = useParams();

  const MIN_GRAPH_ROWS = 2;
  const MIN_GRAPH_COLUMNS = 1;
  const MAX_GRAPH_ROWS = 7;
  const MAX_GRAPH_COLUMNS = 4;

  const [template, setTemplate] = useState();
  const [editorMode, setEditorMode] = useState(false);
  const [templateStructure, setTemplateStructure] = useState([]);
  const [dashboardConfiguration, setDashboardConfiguration] = useState({});
  const [dashboardInfo, setDashboardInfo] = useState({});
  const [selectedSectionKey, setSelectedSectionKey] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [preparePDF, setPreparePDF] = useState(false);
  const [rowCounter, setRowCounter] = useState(0);
  const [dashboardId, setDashboardId] = useState("");
  const [showDashboardInfo, setShowDashboardInfo] = useState(false);
  const [fetchedValues, setFetchedValues] = useState({});

  const [permsResource, setPermsResource] = useState({
    modify: [],
    read: [],
    delete: [],
    create: [],
  });
  const [verifiedPerms, setVerifiedPerms] = useState({
    modify: [],
    read: [],
    delete: [],
    create: [],
  });
  const { permissions } = useSelector(({ dataReducer }) => dataReducer);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userRoles = userInfo?.roles;
  const userID = userInfo?.id;
  const dispatch = useDispatch();

  const ref = React.createRef();
  const options = {
    unit: "in",
    // orientation: "landscape",
    // format: [2, 4],
  };

  // data: obj?.data?.map(...
  // data: extractValues(obj).map(...
  const extractValues = (obj) => {
    return Object.values(obj)[0];
  };

  // PERMISSIONS >>>>>
  const onSuccessPerms = ({ data }) => {
    const filterDataPerms = groupPermissionsByAccess([...data?.data]);

    for (let key in permsResource) {
      if (!filterDataPerms[key]) {
        filterDataPerms[key] = [];
      }
      if (filterDataPerms[key]?.length) {
        filterDataPerms[key] = filterDataPerms[key].filter(
          (permsD) => permsD?.identity !== "employees"
        );
      }
    }
    setPermsResource((prev) => ({ ...prev, ...filterDataPerms }));
  };

  // FETCH PERMS REQUEST
  const { refetch } = useCustomQuery({
    queryKey: [
      "getDashboardPerms",
      { resourceId: dashboardId, resourceType: "report" },
    ],
    apiFunc: getResourcePermissions,
    onSuccess: onSuccessPerms,
    enabled: !!dashboardId,
  });

  // FOR ENFORCEMENT OF THE PERMISSIONS
  const VerifyPemissions = (permsType) => {
    const mergedPerms = [
      ...permsResource[permsType]?.map((rsrce) => rsrce?.value),
    ];

    //if (userRoles?.includes("Admin")) mergedPerms.push(userID);
    if (!permsResource?.permsType?.length) mergedPerms.push(userID);

    const results = filterDuplicateItems(mergedPerms);
    return results;
  };

  useEffect(() => {
    if (Object.keys(permsResource)?.length) {
      const readPerms = VerifyPemissions("read");
      const modifyPerms = VerifyPemissions("modify");
      const deletePerms = VerifyPemissions("delete");

      setVerifiedPerms((prev) => ({
        ...prev,
        read: readPerms,
        modify: modifyPerms,
        delete: deletePerms,
      }));
    }
  }, [permsResource]);

  useEffect(() => {
    if (
      verifiedPerms["read"]?.length ||
      verifiedPerms["modify"]?.length ||
      verifiedPerms["delete"]?.length
    )
      dispatch(setDataPermissions({ dashboards: verifiedPerms }));
  }, [verifiedPerms]);

  const getCardTemplate = (data) =>
    data?.filter((arrObj) => arrObj.map(Object.values).flat().includes("card"));

  const getChartTemplate = (data) =>
    data?.filter((arrObj) =>
      arrObj.map(Object.values).flat().includes("chart")
    );

  const onSuccess = async ({ data }) => {
    setLoadingDashboard(false);
    setDashboardInfo(data.data);
    setDashboardId(data?.data?.id);

    setTemplate(data?.data?.properties?.template);
    setTemplateStructure(data?.data?.properties?.templateStructure);

    // const getCardLength = getCardTemplate(
    //   data?.data?.properties?.templateStructure
    // );
    // setRowCounter(getCardLength?.length - 1);

    setDashboardConfiguration(data?.data?.configuration);

    //  fetch live datas
    await reloadDashboardData(data?.data);
  };

  const updateDashboard = React.useRef(
    debounce(async (id, objs) => {
      const result = await updateDashboardAPI({ id, ...objs });
      if (objs?.["properties.schedule.active"] && result) {
        successToastify("Mail scheduler is activated");
      } else if (
        Object.keys(objs).includes("properties.schedule.active") &&
        !result
      ) {
        errorToastify("Error activating mail scheduler");
      }
    }, 800)
  ).current;

  // fetch specified dashboard
  const { isLoading, isFetching } = useCustomQuery({
    queryKey: ["getDashboardStructure", { slug }],
    apiFunc: getDashboardStructureAPI,
    onSuccess,
  });

  const splitSection = (e, index1, index2) => {
    e.stopPropagation();

    const id = v4();
    const currStructure = [...templateStructure];
    const currData = { ...dashboardConfiguration };

    if (typeof index2 === "number") {
      if (currStructure?.[index1].length >= MAX_GRAPH_COLUMNS) return;
      currStructure?.[index1].splice(index2 + 1, 0, { key: id });
    } else {
      if (templateStructure?.length >= MAX_GRAPH_ROWS) return;
      currStructure.splice(index1 + 1, 0, [{ key: id }]);
    }

    setTemplateStructure(currStructure);
    const newConfig = { title: "", sectionType: index1 > 0 ? "chart" : "card" };
    setDashboardConfiguration({
      ...currData,
      [id]: newConfig,
    });
    updateDashboard(dashboardInfo?.id, {
      [`configuration.${id}`]: newConfig,
      "properties.templateStructure": currStructure,
    });

    //  generate chart on new section
    // generateChart(id);
  };

  const canDelete = (currStructure, index1, index2) => {
    if (
      (index1 === 0 && currStructure?.[index1]?.length <= MIN_GRAPH_COLUMNS) ||
      (index1 > 0 &&
        currStructure?.[index1]?.length === 1 &&
        currStructure?.length <= MIN_GRAPH_ROWS)
    ) {
      return false;
    } else {
      return true;
    }
  };

  const deleteSection = (e, index1, index2, key) => {
    e.stopPropagation();

    const currStructure = [...templateStructure];
    const currData = { ...dashboardConfiguration };
    if (typeof index2 === "number") {
      if (!canDelete(currStructure, index1, index2)) return;
      if (currStructure?.[index1]?.length === 1) {
        currStructure?.splice(index1, 1);
      } else {
        currStructure?.[index1]?.splice(index2, 1);
      }
    }

    //  destroy chart
    destroyChart(key);
    //  update structure
    setTemplateStructure(currStructure);
    //  delete section
    delete currData[key];
    //  update config/datasheets
    setDashboardConfiguration(currData);

    //  save structure
    updateDashboard(dashboardInfo?.id, {
      // [`configuration.${key}`]: currData, //
      "properties.templateStructure": currStructure,
    });
  };

  const updateDashboardDetails = (evt, group) => {
    const newVal = {
      ...dashboardConfiguration,
      [selectedSectionKey]: {
        ...dashboardConfiguration[selectedSectionKey],
        ...(typeof group !== "string"
          ? {
              [evt.target.name]: evt.target.hasOwnProperty("checked")
                ? evt.target.checked
                : evt.target.value,
            }
          : {
              [group]: {
                ...(dashboardConfiguration[selectedSectionKey][group] || {}),
                [evt.target.name]: evt.target.hasOwnProperty("checked")
                  ? evt.target.checked
                  : evt.target.value,
              },
            }),
      },
    };

    setDashboardConfiguration(newVal);

    if (
      evt.target.name === "chartType" &&
      dashboardConfiguration[selectedSectionKey].sectionType === "chart" &&
      !fetchedValues[selectedSectionKey]?.error
    ) {
      destroyChart(selectedSectionKey);
      generateChart(
        selectedSectionKey,
        evt.target.value,
        fetchedValues[selectedSectionKey]?.data
      );
    }

    updateDashboard(dashboardInfo?.id, {
      [`configuration.${selectedSectionKey}.${
        typeof group === "string" ? group + "." : ""
      }${evt.target.name}`]: evt.target.hasOwnProperty("checked")
        ? evt.target.checked
        : evt.target.value,
    });
  };

  const resetDataConfig = (dataSourceType) => {
    const newVal = {
      ...dashboardConfiguration,
      [selectedSectionKey]: {
        ...dashboardConfiguration[selectedSectionKey],
        dataConfig: {
          dataSourceType,
        },
      },
    };
    setDashboardConfiguration(newVal);

    const path = `configuration.${selectedSectionKey}.dataConfig`;
    updateDashboard(dashboardInfo?.id, {
      [`${path}.dataSourceType`]: dataSourceType,
      [`${path}.externalDB`]: "",
      [`${path}.dataSheet`]: "",
      [`${path}.integration`]: "",
      [`${path}.table`]: "",
      [`${path}.worksheetTab`]: "",
      [`${path}.valueColumn`]: "",
      [`${path}.selectionConditions`]: [{}],
      [`${path}.aggregationFunction`]: "",
      [`${path}.referenceColumn`]: "",
    });
  };

  const mergeDuplicateEntries = (data) => {
    const mergedArray = [];

    data.forEach((dt) => {
      const found = mergedArray.findIndex(
        (ma) => ma.reference === dt.reference
      );
      if (found === -1) {
        mergedArray.push(dt);
      } else {
        mergedArray[found] = {
          ...mergedArray[found],
          value: Number(mergedArray[found].value) + Number(dt.value),
        };
      }
    });

    return mergedArray;
  };

  const reloadDashboardData = async (fetchedData) => {
    const id = dashboardInfo?.id || fetchedData?.id;
    if (!id) return;

    setLoadingData(true);
    const dashboardData = await loadDashboardDataAPI({ id });

    setLoadingData(false);
    if (dashboardData?._meta?.success) {
      setFetchedValues(dashboardData.data);

      const config = {
        ...(Object.keys(dashboardConfiguration).length
          ? dashboardConfiguration
          : fetchedData.configuration),
      };

      //  (re)generate charts
      destroyChart("all");
      Object.keys(config || {}).forEach((sectionKey) => {
        const multipleCharts = multiChartNames?.includes(
          config?.[sectionKey]?.chartType
        );
        if (
          config?.[sectionKey].sectionType === "chart" &&
          !!dashboardData?.data[sectionKey]?.length
        ) {
          generateChart(
            sectionKey,
            config?.[sectionKey]?.chartType,
            !multipleCharts
              ? mergeDuplicateEntries(
                  Object.values(dashboardData?.data[sectionKey]?.[0])?.[0]
                )
              : dashboardData?.data[sectionKey],
            config?.[sectionKey].timeUnit
          );
        }
      });
    }

    return dashboardData?.data || {};
  };

  const destroyChart = (key) => {
    am5.array.each(am5.registry.rootElements, function (root) {
      setTimeout(() => {
        if (key === "all") {
          !!root && root.container.children.clear();
          !!root && root.dispose();
        } else if (root?.dom?.id === key) {
          !!root && root.dispose();
        }
      }, 0);
    });
  };

  const displayValue = (val, prefix, suffix) => {
    if (!val || !val.length || val.error) return "??";
    return !!Number(val || val?.[0] || val?.[0]?.data).toLocaleString()
      ? `${prefix || ""}${Number(val?.[0]?.data || "").toLocaleString()}${
          suffix || ""
        }`
      : "??";
  };

  const doPDF = (fn) => {
    setPreparePDF(true);
    setTimeout(() => {
      fn();
    }, 1000);
    setTimeout(() => {
      setPreparePDF(false);
    }, 1000);
  };

  const handleEditModeChange = (e) => {
    if (verifiedPerms["modify"].includes(userID)) {
      setEditorMode(e.target.checked);
    } else {
      return errorToastify("You need extra permissions for this");
    }
  };

  const topBar = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        justifyContent: "space-between",
      }}
    >
      {verifiedPerms["modify"].includes(userID) && (
        <Tooltip title="Edit mode">
          <div style={{ display: "flex", alignItems: "center" }}>
            <p className={classes.switchLabel}>Editor mode</p>
            <FormControlLabel
              style={{ marginRight: "0.4rem", marginLeft: "auto " }}
              classes={
                {
                  //root: classes.switchLabel,
                  // label: classes.sectionTitle,
                }
              }
              control={
                <Switch
                  name="checkedC"
                  color="primary"
                  size="small"
                  data-testid=""
                  checked={editorMode}
                  onChange={(e) => {
                    handleEditModeChange(e);
                  }}
                />
              }
              label=""
              labelPlacement="start"
            />
          </div>
        </Tooltip>
      )}
      <Tooltip title="Reload data">
        <IconButton
          className={classes.dataIcon}
          onClick={() => reloadDashboardData(dashboardInfo)}
          disabled={loadingData || loadingDashboard}
          style={{ marginLeft: "auto" }}
        >
          <CachedOutlined
            fontSize="small"
            className={loadingData ? "icon-spin" : ""}
          />
        </IconButton>
      </Tooltip>
      <ReactToPdf
        targetRef={ref}
        filename={`${dashboardInfo?.name}_${moment().format(
          "YYYYMMDDHHmmss"
        )}.pdf`}
        options={options}
        x={0.5}
        y={0.5}
        scale={0.8}
      >
        {
          ({ toPdf }) => (
            <Tooltip title="Download PDF">
              <IconButton
                className={classes.dataIcon}
                disabled={loadingData || loadingDashboard}
                onClick={() => doPDF(toPdf)}
              >
                {/* <RiFileDownloadLine style={{ fontSize: 20 }} /> */}
                {/* <RiDownloadFill style={{ fontSize: 20 }} /> */}
                <RiDownloadLine style={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          )
          // <button>Generate pdf</button>
        }
      </ReactToPdf>

      {/* <Tooltip title="Take Dashboard Snapshot">
        <IconButton
          className={classes.dataIcon}
          disabled={loadingData || loadingDashboard}
        >
          <Camera fontSize="small" />
        </IconButton>
      </Tooltip> */}

      {editorMode && (
        <Tooltip title="Dashboard settings">
          <IconButton
            className={classes.dataIcon}
            disabled={loadingDashboard}
            onClick={() => setShowDashboardInfo(true)}
          >
            <Settings fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );

  const handleChange = (lap) => {
    if (lap.isFinish) {
      // setIsLoading(false);
    }
  };

  return (
    <>
      <MainPageLayout
        headerTitle={mainNavigationListNames.DASHBOARDS}
        pageTitle={
          slug !== "min-of-finance-dashboard"
            ? dashboardInfo?.name
            : "Min. of Finance Dashboard"
        }
        pageSubtitle={dashboardInfo?.description}
        appsControlMode={null}
        categories={null}
        isLoading={isLoading}
        topBar={topBar}
        hideSearbar
        hasGoBack
        handleChange={handleChange}
        // onAddNew={{ fn: () => setStep(1), tooltip: "Add new dashboard" }}
      >
        {slug !== "min-of-finance-dashboard" ? (
          <div ref={ref}>
            <div>
              {preparePDF && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    lineHeight: 3,
                  }}
                >
                  <div style={{ color: "black", fontSize: 14 }}>
                    {dashboardInfo?.name}
                  </div>
                  <div>{moment().format("YYYY-MMM-DD hh:mm A")}</div>
                </div>
              )}
            </div>
            <div>
              <div
                style={{
                  // backgroundColor: "#f8f8f8",
                  // padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                }}
              >
                {templateStructure?.map((level1, indx1) => {
                  return (
                    <div
                      key={`level1-${indx1}`}
                      // onClick={() => openSection("C")}
                      style={{
                        display: "flex",
                        flex: 1,
                        gap: 5,
                        flexWrap: "wrap",
                      }}
                    >
                      {level1.map((level2, indx2) => (
                        <div
                          key={level2.key}
                          className={`template-section ${
                            selectedSectionKey === level2.key ? "_active" : ""
                          } ${indx1 === 0 ? "_card" : "_chart"} ${
                            !!dashboardConfiguration?.[level2.key]?.title
                              ? "_filled"
                              : "_empty"
                          }`}
                          style={{
                            flex:
                              dashboardConfiguration?.[level2.key]?.style
                                ?.relWidth || 1,
                          }}
                          onClick={() =>
                            editorMode && setSelectedSectionKey(level2.key)
                          }
                        >
                          {indx1 === 0 && (
                            <div className="section-data">
                              {!!dashboardConfiguration?.[level2.key]?.title
                                ? // && !dashboardConfiguration[level2.key].data
                                  displayValue(
                                    fetchedValues?.[level2.key],
                                    dashboardConfiguration?.[level2.key]
                                      ?.dataConfig?.valuePrefix,
                                    dashboardConfiguration?.[level2.key]
                                      ?.dataConfig?.valueSuffix
                                  )
                                : ""}
                            </div>
                          )}
                          <div className="section-title">
                            {dashboardConfiguration?.[level2.key]?.title}
                          </div>
                          {indx1 > 0 && (
                            <div
                              id={level2.key}
                              style={{ width: "100%", minHeight: 250 }}
                            ></div>
                          )}

                          {editorMode && (
                            <div className="section-corner-btns">
                              <Tooltip title="Split section">
                                <div
                                  style={{
                                    height: 18,
                                    cursor:
                                      level1.length >= MAX_GRAPH_COLUMNS
                                        ? "default"
                                        : "pointer",
                                  }}
                                  onClick={(e) => splitSection(e, indx1, indx2)}
                                >
                                  <RiSplitCellsHorizontal
                                    size={18}
                                    color={
                                      level1.length >= MAX_GRAPH_COLUMNS
                                        ? "#CCCCCC"
                                        : "#0C7B93"
                                    }
                                  />
                                </div>
                              </Tooltip>
                              {indx1 > 0 && (
                                <Tooltip title="Split row">
                                  <div
                                    style={{
                                      height: 18,
                                      cursor:
                                        templateStructure?.length >=
                                        MAX_GRAPH_ROWS
                                          ? "default"
                                          : "pointer",
                                    }}
                                    onClick={(e) => splitSection(e, indx1)}
                                  >
                                    <RiSplitCellsVertical
                                      size={18}
                                      color={
                                        templateStructure?.length >=
                                        MAX_GRAPH_ROWS
                                          ? "#CCCCCC"
                                          : "#0C7B93"
                                      }
                                    />
                                  </div>
                                </Tooltip>
                              )}
                              <Tooltip title="Remove section">
                                <div
                                  style={{
                                    height: 16,
                                    cursor: !canDelete(
                                      templateStructure,
                                      indx1,
                                      indx2
                                    )
                                      ? "default"
                                      : "pointer",
                                  }}
                                  onClick={(e) =>
                                    deleteSection(e, indx1, indx2, level2.key)
                                  }
                                >
                                  <RiDeleteBinLine
                                    size={16}
                                    color={
                                      !canDelete(
                                        templateStructure,
                                        indx1,
                                        indx2
                                      )
                                        ? "#CCCCCC"
                                        : "#0C7B93"
                                    }
                                  />
                                </div>
                              </Tooltip>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <>
            <iframe
              title="pro"
              // width="1203"
              // height="749"
              src="https://app.powerbi.com/view?r=eyJrIjoiYjcwMTc3MWYtMDc0Yi00NTcwLTgyZjgtOGJhZDNlM2FlNjM4IiwidCI6ImQ5MzgwNWY1LTdlYmEtNDk4Zi05ODliLTExMTU2ZGIxNjBlYiJ9"
              frameborder="0"
              allowfullscreen="true"
              style={{ height: "100%" }}
            ></iframe>
            <div
              style={{
                position: "absolute",
                bottom: 62,
                left: 32,
                backgroundColor: "#eaeaea",
                height: 33,
                width: 160,
              }}
            ></div>
          </>
        )}
        {preparePDF && (
          <div className={classes.preparePDFLayer}>
            Generating PDF... please wait...
          </div>
        )}
      </MainPageLayout>
      <DashboardEditorSidebar
        info={dashboardInfo}
        isInfo={showDashboardInfo}
        setIsInfo={setShowDashboardInfo}
        data={dashboardConfiguration?.[selectedSectionKey]}
        updateData={updateDashboardDetails}
        resetDataConfig={resetDataConfig}
        selectedSectionKey={selectedSectionKey}
        setSelectedSectionKey={setSelectedSectionKey}
        updateDashboard={updateDashboard}
      />
    </>
  );
};

export default DashboardEditor;
