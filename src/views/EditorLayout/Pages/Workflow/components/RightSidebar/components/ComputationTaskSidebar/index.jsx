import { useState, useEffect } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import { v4 } from "uuid";
import { makeStyles } from "@material-ui/core/styles";
import {
  Divider,
  Typography,
  Button,
  TextField,
  Select,
  Menu,
  MenuItem,
  Collapse,
  FormControlLabel,
  Switch,
  Tooltip,
} from "@material-ui/core";
import {
  ErrorOutlineOutlined,
  CheckCircleOutlineOutlined,
  ArrowRight,
  ArrowDropDown,
  ArrowUpward,
  ArrowDownward,
  MoreVert,
  Delete,
} from "@material-ui/icons";
import MyWindowsDimensions from "../../../../../../utils/windowsDimension";
import SelectOnSteroids from "../sidebarActions/common/SelectOnSteroids";
import { rRemoteUpdateCanvasElements } from "../../../../../../../../store/actions/properties";
import { NameDescription } from "../sidebarActions/common/NameDescription";
import {
  getTaskVariables,
  globalSetTaskInfo,
  isConnectedTo,
} from "../../../utils/workflowFuncs";
import {
  ArithmeticOperators,
  CONDITION_OPERATORS,
  durationList,
  getOperators,
  INVALID_FIELD_LABEL_STYLE,
  variableGroups,
} from "../../../utils/constants";
import DecisionNodeLabels from "../sidebarActions/common/DecisionNodeLabels";
import InputTypesDropDown from "../../../../../../../common/components/DropDown/InputTypesDropDown";
import ExecutionVariables from "../Helpers/ExecutionVariables";

const useStyles = makeStyles((theme) => ({
  sideHeading: {
    color: "#091540",
    // fontWeight: 600,
    fontSize: 11,
    paddingLeft: 10,
    paddingTop: 10,
    textTransform: "capitalize",
    display: "inline-flex",
    alignItems: "center",
  },
  divider: {
    marginTop: 15,
    marginBottom: 15,
  },
  section: {
    padding: 10,
    paddingBottom: 20,
    // marginBottom: 100,
  },
  container: {
    overflow: "hidden",
    height: "100%",
    "&:hover": {
      overflow: "overlay",
    },
  },
  actionsListItem: {
    width: "30%",
    height: 80,
    margin: 5,
    display: "inline-block",
    textAlign: "center",
    backgroundColor: "white",
    border: "solid 1px white",
    boxShadow: "1px 1px 3px #ccc",
    borderRadius: 10,
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "#fafafa",
      border: "solid 1px #eaeaea",
      boxShadow: "none",
      color: "#1846c8",
    },
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
  functionBtn: {
    fontSize: 10,
    minWidth: "auto",
    textTransform: "capitalize",
    backgroundColor: "#d3d4d9",
    color: "#4f5264",
    padding: "3px 4px",
    marginLeft: 3,
    // opacity: 0.7,
    "&:hover": {
      backgroundColor: "#a7aab8",
    },
  },
  miniMenuItem: {
    padding: "3px 10px",
    fontSize: "0.8em !important",
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
  inputLayer: {
    color: "#091540",
    fontSize: 12,
    // marginBottom: 5,
    backgroundColor: "#FFFFFF",
    flex: 1,
  },
  select: {
    color: "#091540",
    fontSize: 12,
    padding: 10,
    // borderRadius: 0,
  },
  inlineSelect1: {
    minHeight: 25,
    position: "absolute",
    right: 6,
    top: 5,
    minWidth: 56,
    color: "#091540",
    padding: "0px !important",
    fontSize: 10,
    textAlign: "center",
    opacity: 0.7,
    "& > fieldset": {
      borderStyle: "dotted",
    },
  },
  inlineSelect2: {
    minHeight: 25,
    position: "absolute",
    right: 34,
    top: 5,
    minWidth: 56,
    color: "#091540",
    padding: "0px !important",
    fontSize: 10,
    textAlign: "center",
    opacity: 0.7,
    "& > fieldset": {
      borderStyle: "dotted",
    },
  },
  inlineSelectInside: {
    color: "#091540",
    padding: "0px !important",
    fontSize: 10,
    // minHeight: 25,
    // position: "absolute",
    // right: 34,
    // top: 5,
    // minWidth: 56,
    // textAlign: "center",
  },
  selectThinOut: {
    marginLeft: 3,
    "& .MuiSelect-icon": {
      display: "none",
    },
  },
  selectThin: {
    color: "#091540",
    fontSize: 10,
    width: 25,
    textAlign: "center",
    padding: "0px !important",
  },
  switchLabel: {
    width: "100%",
    justifyContent: "space-between",
    margin: 0,
  },
  matchingFields: {
    borderRadius: 5,
    border: "dashed 1.5px #999",
    padding: 10,
    backgroundColor: "#f8f8f8",
    marginTop: 7,
  },
  addLayerBtn: {
    background: "#999",
    color: "#fff",
    textAlign: "center",
    height: 30,
    lineHeight: "30px",
    borderRadius: 15,
    // "&:hover": {
    //   background: "#888",
    //   cursor: "pointer",
    // }
  },
  pair: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    "& > div, & > p": {
      flex: 1,
      "&:first-child": {
        marginRight: 5,
      },
    },
  },
  mappingTitle: {
    fontSize: 12,
    flex: 1,
    color: "#f7a712",
    display: "flex",
    justifyContent: "space-between",
  },
  conditionSetup: {
    "& ul": {
      padding: 0,
      // backgroundColor: "#b2b2b2",
    },
    "& div > ul": {
      // padding: 5,
      borderRadius: 5,
      display: "flex",
      flexDirection: "column",
      gap: 2,
    },
    "& div._na": {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    "& div._na > ul": {
      flexDirection: "row",
      alignItems: "center",
      // maxWidth: "95%",
      // overflow: "hidden",
    },
    "& div._na > ul > li": {
      flex: 1,
      width: "30%",
    },
    "& ul > li > div > svg": {
      display: "none",
    },
    "& ul li": {
      listStyle: "none",
    },
    "& > div > ul > li": {
      border: "solid 2px #eaeef2",
      padding: 5,
      marginBottom: 5,
      borderRadius: 5,
    },
    "& div > ul > li:last-of-type": {
      marginBottom: 0,
    },
    "& div > ul > li > ul": {
      display: "flex",
      gap: 3,
    },
    "& div > ul > li > ul > li": {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
      backgroundColor: "#f4f4f4",
    },
    "& input": {
      width: "100%",
    },
    "& .MuiSelect-select": {
      minWidth: 10,
      backgroundColor: "#FFFFFF",
      textAlign: "center",
    },
    "& .select": {
      width: "100%",
    },
    "& .MuiInputBase-root:not(.selectThin) .MuiSelect-root.MuiSelect-select.MuiSelect-selectMenu.MuiSelect-outlined.MuiInputBase-input.MuiOutlinedInput-input":
      {
        padding: "10px 5px",
      },
    "& .MuiSelect-root.MuiSelect-select.MuiSelect-selectMenu.MuiSelect-outlined.MuiInputBase-input.MuiOutlinedInput-input > span:last-of-type":
      {
        display: "none",
      },
    "& .MuiButtonBase-root.MuiListItem-root.MuiMenuItem-root.MuiMenuItem-gutters.MuiListItem-gutters.MuiListItem-button > span":
      {
        marginLeft: 5,
      },
  },
  functionLineMore: {
    width: 25,
    height: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#dedede",
    borderRadius: 3,
    marginLeft: 3,
    cursor: "pointer",
  },
  functionFinalDiv: {
    marginTop: 10,
  },
  functionTrueFalse: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    border: "solid 1px #b2b2b2",
    borderRadius: 5,
  },
  spaceSpanInLI: {
    marginLeft: 5,
  },
  decisionPrefix: {
    minWidth: 30,
    maxWidth: 30,
    backgroundColor: "#b2b2b2",
    color: "#FFFFFF",
    textAlign: "center",
  },
  multiSelect: {
    display: "flex",
    flexWrap: "wrap",
  },
  selectedFields: {
    backgroundColor: "#f8f8f8",
    marginRight: 5,
    marginBottom: 5,
    padding: 5,
    border: "dashed 1px #999",
    borderRadius: 8,
    color: "#888",
  },
  sideHeadingBar: {
    backgroundColor: "#f8f8f8",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    height: 29,
    "&:hover": {
      opacity: 0.7,
    },
  },
  sectionEntry: {
    marginBottom: 13,
  },
  addMatch: {
    fontSize: 20,
    boxShadow: "0px 2px 3px #aaa",
    borderRadius: "14%",
    marginTop: 10,
  },
  selected: {
    "& span:last-of-type": {
      display: "none",
    },
  },

  floatFieldOnSteriod: {
    width: "70px",
    height: "inherit",
    position: "absolute",
    right: "3.7%",
    backgroundColor: "red",
  },
}));

const ComputationTaskSidebar = ({
  activeTaskId,
  activeTaskType,
  workflowTasks,
  // allVariables,
  workflowCanvas,
}) => {
  const dispatch = useDispatch();
  const activeTask = workflowTasks[activeTaskId];
  const { variables: allVariables } = useSelector(({ workflows }) => workflows);
  const variables = getTaskVariables(activeTaskId, allVariables);

  const classes = useStyles();
  const [windowDimensions, setWindowDimensions] = useState({});
  const [showSection, setShowSection] = useState({
    settings: true,
    action: false,
  });
  const [taskUpdated, setTaskUpdated] = useState(false);
  const [settingsComplete, setSettingsComplete] = useState(false);
  const [actionComplete, setActionComplete] = useState(false);
  const [layers, setLayers] = useState([]);
  const [beforeOrAfter, setBeforeOrAfter] = useState({
    placement: "after",
    position: 0,
  });

  const [toggleFunction, setToggleFunction] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorMoreEl, setAnchorMoreEl] = useState(null);
  const [canDelete, setCanDelete] = useState(true);
  const [indexes, setIndexes] = useState([]);
  const [nodeIsConnectedToAny, setNodeIsConnectedToAny] = useState(false);
  const [nodeIsConnectedToStart, setNodeIsConnectedToStart] = useState(false);
  const [functionsValidity, setFunctionsValidity] = useState({});
  const [fieldsKey, setFieldsKey] = useState("-");
  const [resetKey, setResetKey] = useState("");

  useEffect(() => {
    setFieldsKey(v4());
  }, [activeTask?.id]);

  useEffect(() => {
    !!activeTask?.properties?.functions &&
      setLayers(activeTask?.properties?.functions);
  }, [activeTask?.properties?.functions]);

  useEffect(() => {
    const isConnectedToAnySource = isConnectedTo(
      activeTaskId,
      workflowCanvas,
      "anyNode"
    );
    const isConnectedToStartNode = isConnectedTo(
      activeTaskId,
      workflowCanvas,
      "startNode"
    );
    setNodeIsConnectedToAny(isConnectedToAnySource);
    setNodeIsConnectedToStart(isConnectedToStartNode);
  }, [workflowCanvas, activeTask]);

  useEffect(() => {
    checkSetupStatus(activeTask);
  }, [activeTask]);

  const open = Boolean(anchorEl);
  const openMore = Boolean(anchorMoreEl);

  const _setTaskInfo = (e, ppty, isGrouped) => {
    !!e.persist && e.persist();

    globalSetTaskInfo(
      dispatch,
      e,
      ppty,
      isGrouped,
      activeTask,
      setTaskUpdated,
      [],
      checkSetupStatus
    );
  };

  const _preSetTaskInfo1 = async (e, ppty, indx, index) => {
    let notAffectVariables = true;
    const layers_ = [...layers];
    const value = e?.target?.value ?? e?.target ?? e;
    if (typeof index === "number") {
      layers_[indx].lines[index][ppty] = value;
    } else {
      layers_[indx][ppty] = value;
      if (["dataType", "name"].includes(ppty)) {
        notAffectVariables = false;
      }
    }
    setLayers(layers_);
    // if (["dataType", "name"].includes(ppty)) {
    //   await debouncedEventHandler(layers_);
    // } else {
    //   _setTaskInfo(layers_, "functions");
    // }
    _setTaskInfo(layers_, "functions");
    _setTaskInfo(
      {
        functions: layers_,
        notAffectVariables,
      },
      null,
      true
    );
  };

  const _preSetTaskInfo2 = async (dataLayers, clearHasDecision) => {
    _setTaskInfo(
      {
        functions: dataLayers,
        notAffectVariables: false,
        ...(clearHasDecision ? { hasDecision: false } : {}),
      },
      null,
      true
    );
  };

  const handleClicks = (event, beforeAfter = "after", index = 0) => {
    if (beforeAfter === "delete") {
      deleteLayer(index);
      return;
    }
    setAnchorEl(event.currentTarget);
    setBeforeOrAfter({ placement: beforeAfter, position: index });
  };

  const handleSelected = async (sel) => {
    const layers_ = [...layers];
    const layerStructure = {
      id: v4(),
      functionType: sel,
      name: `${sel}-function-${Math.ceil(Math.random() * 1000000)}`,
      dataType: "text",
      lines: [
        {
          leftArgument: [],
          rightArgument: [],
          lastArgument: [],
          operator:
            sel === "arithmetic"
              ? ArithmeticOperators.PLUS
              : CONDITION_OPERATORS.EQUALS,
        },
      ],
    };
    if (beforeOrAfter.placement === "before") {
      layers_.splice(beforeOrAfter.position, 0, layerStructure);
    }
    if (beforeOrAfter.placement === "after") {
      if (beforeOrAfter.position === layers.length - 1) {
        layers_.push(layerStructure);
      } else {
        layers_.splice(beforeOrAfter.position + 1, 0, layerStructure);
      }
    }

    setLayers(layers_);
    handleClose();
    _preSetTaskInfo2(layers_);
    // _setTaskInfo(layers_, "functions");
  };
  const deleteLayer = async (index) => {
    let clearHasDecision = false;
    const layers_ = [...layers];
    layers_.splice(index, 1);
    setLayers(layers_);
    if (!layers.filter((f) => f.functionType === "comparison").length) {
      clearHasDecision = true;
    }
    _preSetTaskInfo2(layers_, clearHasDecision);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorMoreEl(null);
  };

  const handleLineAction = (action) => {
    setAnchorMoreEl(null);
    const layers_ = [...activeTask?.properties?.functions];
    const lines = [...layers_?.[indexes[0]]?.lines];

    if (action === "add") {
      lines.splice(indexes[1] + 1, 0, {
        leftArgument: [],
        rightArgument: [],
        lastArgument: [],
        operator: ArithmeticOperators.PLUS,
      });
    } else if (action === "remove") {
      lines.splice(indexes[1], 1);
    }

    layers_[indexes[0]].lines = lines;
    setLayers(layers_);
    _setTaskInfo(layers_, "functions");
  };

  const _toggleSection = (e, sect) => {
    e && e.stopPropagation();

    const makeTrue = !showSection[sect];
    const showSection_ = { ...showSection };
    Object.keys(showSection_).forEach((p) => (showSection_[p] = false));
    if (makeTrue) showSection_[sect] = true;
    setShowSection(showSection_);
  };

  const checkSetupStatus = (info, auto) => {
    let sC, aC;
    let functionsValidity_ = { ...functionsValidity };

    if (!!info?.name) {
      sC = true;
      setSettingsComplete(true);
    } else {
      sC = false;
      setSettingsComplete(false);
    }

    const functions = info?.properties?.functions;
    const hasDecision = info?.properties?.hasDecision;
    const decisionFunction = info?.properties?.decisionFunction;
    const decisionActions = info?.properties?.decisionActions;
    const invalidFunction = !!functions?.find((functn) => {
      const lines = functn.lines;

      const isInvalid =
        !functn.name ||
        !lines?.length ||
        !!lines?.find((line) => {
          return (
            !line.leftArgument?.length ||
            (!line.rightArgument?.length &&
              ![
                CONDITION_OPERATORS.IS_NULL,
                CONDITION_OPERATORS.IS_NOT_NULL,
              ].includes(line?.operator)) ||
            (functn.functionType === "nestedIf") !== !!line.lastArgument?.length
          );
        }) ||
        (functn.functionType === "comparison" ||
          functn.functionType === "nestedIf") !== !!functn.ifFalse?.length ||
        (functn.functionType === "comparison") !== !!functn.ifTrue?.length;

      functionsValidity_ = {
        ...functionsValidity_,
        [functn._id || functn.id]: !isInvalid,
      };
      return isInvalid;
    });

    setFunctionsValidity(functionsValidity_);

    if (
      !!functions?.length &&
      !invalidFunction &&
      (!!hasDecision ===
        (!!decisionFunction &&
          !decisionActions.find((action) => !action.label)) ||
        !hasDecision)
    ) {
      aC = true;
      setActionComplete(true);
    } else {
      aC = false;
      setActionComplete(false);
    }

    return sC && aC;
  };

  const exemptMyVariables = (indx) => {
    const vars = [...variables];
    const myVariables = vars.filter((variable, i) => {
      if (
        //  listed options for old data
        (variable?.info?.group === "Layers" ||
          variable?.info?.group === "function" ||
          variable?.info?.group === "Computation") &&
        variable.info?.parent === activeTaskId
      ) {
        const findx = layers.findIndex(
          (ly) => ly.id === variable?.info?.matching?.valueSourceInput
        );
        if (findx > -1 && findx < indx) return true;
        return false;
      }
      return true;
    });
    return myVariables;
  };

  const makeComputationDecision = (event) => {
    event.preventDefault();

    /* get node output links (if any) */
    const links = workflowCanvas.filter((node) => node.source === activeTaskId);
    if (!!links.length) {
      const conf = window?.confirm(
        "This may disconnect outbound link(s). Proceed?"
      );
      if (!conf) {
        setResetKey(v4());
        return;
      }
      dispatch(rRemoteUpdateCanvasElements(links));
    }

    _setTaskInfo(!!event.target.checked, "hasDecision");
  };

  const arithmeticInterface = (functionType, indx) => {
    const lines = activeTask?.properties?.functions?.[indx]?.lines;
    return lines?.map((line, index) => (
      <div className="_na" key={index}>
        <ul style={{ flex: 1 }}>
          <li>
            <SelectOnSteroids
              source="variable"
              variables={exemptMyVariables(indx)}
              onChange={(e) => _preSetTaskInfo1(e, "leftArgument", indx, index)}
              value={line?.leftArgument}
              type="text"
              placeholderText="Select Variable*"
              variablesOnly
              multiple={false}
            />
          </li>
          <li style={{ minWidth: 34, maxWidth: 34 }}>
            <Select
              key={line?.operator || "none"}
              variant="outlined"
              size="small"
              fullWidth
              placeholder="Select screen"
              classes={{
                root: classes.select,
                outlined: classes.selected,
              }}
              onChange={(e) => _preSetTaskInfo1(e, "operator", indx, index)}
              defaultValue={line?.operator || "none"}
            >
              <MenuItem value="choose" disabled>
                <em>Select operator</em>
              </MenuItem>
              <MenuItem value="none" selected>
                <b style={{ visibility: "hidden" }}>_</b>
              </MenuItem>
              {getOperators("arithmetic", MenuItem, classes)}
            </Select>
          </li>
          <li>
            <SelectOnSteroids
              source="variable"
              variables={exemptMyVariables(indx)}
              onChange={(e) =>
                _preSetTaskInfo1(e, "rightArgument", indx, index)
              }
              value={line?.rightArgument}
              type="text"
              variablesAndCustomOnly
              placeholderText="Select or type value"
              multiple={false}
            />
          </li>
          {line.leftArgument?.[0]?.["dataType"]?.[0] === "datetime" ? (
            <Select
              key={
                line.leftArgument?.[0]?.["dataType"]?.[0] === "datetime"
                  ? line?.dateMeasure
                  : null
              }
              className="floating-field-on-selectonsteroid"
              variant="filled"
              size="small"
              fullWidth
              placeholder="Select screen"
              classes={{
                root: classes.select,
                outlined: classes.selected,
              }}
              onChange={(e) => _preSetTaskInfo1(e, "dateMeasure", indx, index)}
              defaultValue={
                line.leftArgument?.[0]?.["dataType"]?.[0] === "datetime"
                  ? line?.dateMeasure
                  : null
              }
            >
              <MenuItem value="choose" disabled>
                <em>Select duration</em>
              </MenuItem>
              <MenuItem value="none" selected>
                <b style={{ visibility: "hidden" }}>_</b>
              </MenuItem>
              {durationList?.map(([value, displayValue], idx) => {
                return (
                  <MenuItem key={idx} value={value}>
                    {displayValue}
                  </MenuItem>
                );
              })}
            </Select>
          ) : null}
        </ul>
      </div>
    ));
  };
  const nestedIfInterface = (functionType, indx) => {
    const lines = activeTask?.properties?.functions?.[indx]?.lines;

    return (
      <>
        {lines?.map((line, index) => (
          <div className="_na" key={index}>
            <ul style={{ flex: 1 }}>
              <li>
                <SelectOnSteroids
                  source="variable"
                  variables={exemptMyVariables(indx)}
                  onChange={(e) =>
                    _preSetTaskInfo1(e, "leftArgument", indx, index)
                  }
                  value={line?.leftArgument}
                  type="text"
                  placeholderText="Select Variable*"
                  variablesOnly
                  multiple={false}
                />
              </li>
              <li style={{ minWidth: 34, maxWidth: 34, overflow: "hidden" }}>
                <Select
                  key={line?.operator || "none"}
                  variant="outlined"
                  size="small"
                  fullWidth
                  placeholder="Select screen"
                  classes={{
                    root: classes.select,
                    outlined: classes.selected,
                  }}
                  onChange={(e) => _preSetTaskInfo1(e, "operator", indx, index)}
                  defaultValue={line?.operator || "none"}
                >
                  <MenuItem value="choose" disabled>
                    <em>Select operator</em>
                  </MenuItem>
                  <MenuItem value="none" selected>
                    <b style={{ visibility: "hidden" }}>_</b>
                  </MenuItem>
                  {getOperators("comparison", MenuItem, classes)}
                </Select>
              </li>
              {![
                CONDITION_OPERATORS.IS_NULL,
                CONDITION_OPERATORS.IS_NOT_NULL,
              ].includes(line?.operator) && (
                <li>
                  <SelectOnSteroids
                    source="variable"
                    variables={exemptMyVariables(indx)}
                    onChange={(e) =>
                      _preSetTaskInfo1(e, "rightArgument", indx, index)
                    }
                    value={line?.rightArgument}
                    type="text"
                    variablesAndCustomOnly
                    placeholderText="Select or type value"
                    multiple={false}
                  />
                </li>
              )}
              <li>
                <SelectOnSteroids
                  source="variable"
                  variables={exemptMyVariables(indx)}
                  onChange={(e) =>
                    _preSetTaskInfo1(e, "lastArgument", indx, index)
                  }
                  value={line.lastArgument}
                  type="text"
                  variablesAndCustomOnly
                  placeholderText="Select or type value"
                  multiple={false}
                />
              </li>
            </ul>
            <span
              className={classes.functionLineMore}
              onClick={(e) => {
                setCanDelete(
                  activeTask?.properties?.functions?.[indx]?.lines?.length > 1
                );
                setIndexes([indx, index]);
                setAnchorMoreEl(e.currentTarget);
              }}
            >
              <MoreVert style={{ fontSize: 14 }} />
            </span>
          </div>
        ))}
        <div className={classes.functionFinalDiv}>
          <ul style={{ marginBottom: 0 }}>
            <li>
              <ul>
                {/* <li className={classes.decisionPrefix}>IF</li> */}
                <li className={classes.functionTrueFalse}>
                  <span>[ FALSE ]</span>
                </li>
                <li style={{ minWidth: 34, maxWidth: 34 }}>
                  <Select
                    key="equalto"
                    variant="outlined"
                    size="small"
                    fullWidth
                    placeholder="Select screen"
                    classes={{
                      root: classes.select,
                      outlined: classes.selected,
                    }}
                    defaultValue="equalto"
                  >
                    <MenuItem value="equalto" selected>
                      {`=`}
                      <span className={classes.spaceSpanInLI}> (equal to)</span>
                    </MenuItem>
                  </Select>
                </li>
                <li>
                  <SelectOnSteroids
                    source="variable"
                    variables={exemptMyVariables(indx)}
                    onChange={(e) => _preSetTaskInfo1(e, "ifFalse", indx)}
                    value={activeTask?.properties?.functions?.[indx]?.ifFalse}
                    variablesAndCustomOnly
                    placeholderText="Select or type value"
                    multiple={false}
                    type="text"
                  />
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </>
    );
  };
  const comparisonInterface = (functionType, indx) => {
    const lines = activeTask?.properties?.functions?.[indx]?.lines;

    return (
      <>
        {lines?.map((line, index) => (
          <div className="_na" key={index}>
            <ul style={{ flex: 1 }}>
              <li>
                <SelectOnSteroids
                  source="variable"
                  variables={exemptMyVariables(indx)}
                  onChange={(e) =>
                    _preSetTaskInfo1(e, "leftArgument", indx, index)
                  }
                  value={line?.leftArgument}
                  type="text"
                  placeholderText="Select Variable*"
                  variablesOnly
                  multiple={false}
                />
              </li>
              <li
                style={{
                  minWidth: 34,
                  ...(![
                    CONDITION_OPERATORS.IS_NULL,
                    CONDITION_OPERATORS.IS_NOT_NULL,
                  ].includes(line?.operator)
                    ? { maxWidth: 34 }
                    : {}),
                  overflow: "hidden",
                }}
              >
                <Select
                  key={line?.operator || "none"}
                  variant="outlined"
                  size="small"
                  fullWidth
                  placeholder="Select operator"
                  classes={{
                    root: classes.select,
                    outlined: classes.selected,
                  }}
                  onChange={(e) => _preSetTaskInfo1(e, "operator", indx, index)}
                  defaultValue={line?.operator || "none"}
                >
                  <MenuItem value="choose" disabled>
                    <em>Select operator</em>
                  </MenuItem>
                  <MenuItem value="none" selected>
                    <b style={{ visibility: "hidden" }}>_</b>
                  </MenuItem>
                  {getOperators("comparison", MenuItem, classes)}
                </Select>
              </li>
              {![
                CONDITION_OPERATORS.IS_NULL,
                CONDITION_OPERATORS.IS_NOT_NULL,
              ].includes(line?.operator) && (
                <li>
                  <SelectOnSteroids
                    source="variable"
                    variables={exemptMyVariables(indx)}
                    onChange={(e) =>
                      _preSetTaskInfo1(e, "rightArgument", indx, index)
                    }
                    value={line?.rightArgument}
                    type="text"
                    variablesAndCustomOnly
                    placeholderText="Select or type value"
                    multiple={false}
                  />
                </li>
              )}
            </ul>
            <span
              className={classes.functionLineMore}
              onClick={(e) => {
                setCanDelete(
                  activeTask?.properties?.functions?.[indx]?.lines?.length > 1
                );
                setIndexes([indx, index]);
                setAnchorMoreEl(e.currentTarget);
              }}
            >
              <MoreVert style={{ fontSize: 14 }} />
            </span>
          </div>
        ))}
        <div className={classes.functionFinalDiv}>
          <ul style={{ marginBottom: 0 }}>
            <li>
              <ul>
                <li className={classes.functionTrueFalse}>
                  <span>[ TRUE ]</span>
                </li>
                <li style={{ minWidth: 34, maxWidth: 34, overflow: "hidden" }}>
                  <Select
                    key="equalto"
                    variant="outlined"
                    size="small"
                    fullWidth
                    placeholder="Select screen"
                    classes={{
                      root: classes.select,
                      outlined: classes.selected,
                    }}
                    defaultValue="equalto"
                  >
                    <MenuItem value="equalto" selected>
                      {`=`}
                      <span className={classes.spaceSpanInLI}> (equal to)</span>
                    </MenuItem>
                  </Select>
                </li>
                <li>
                  <SelectOnSteroids
                    source="variable"
                    variables={exemptMyVariables(indx)}
                    onChange={(e) => _preSetTaskInfo1(e, "ifTrue", indx)}
                    value={activeTask?.properties?.functions?.[indx]?.ifTrue}
                    type="text"
                    variablesAndCustomOnly
                    placeholderText="Select or type value"
                    multiple={false}
                  />
                </li>
              </ul>
            </li>
            <li>
              <ul>
                <li className={classes.functionTrueFalse}>
                  <span>[ FALSE ]</span>
                </li>
                <li style={{ minWidth: 34, maxWidth: 34, overflow: "hidden" }}>
                  <Select
                    key="equalto"
                    variant="outlined"
                    size="small"
                    fullWidth
                    placeholder="Select screen"
                    classes={{
                      root: classes.select,
                      outlined: classes.selected,
                    }}
                    defaultValue="equalto"
                  >
                    <MenuItem value="equalto" selected>
                      {`=`}
                      <span className={classes.spaceSpanInLI}> (equal to)</span>
                    </MenuItem>
                  </Select>
                </li>
                <li>
                  <SelectOnSteroids
                    source="variable"
                    variables={exemptMyVariables(indx)}
                    onChange={(e) => _preSetTaskInfo1(e, "ifFalse", indx)}
                    value={activeTask?.properties?.functions?.[indx]?.ifFalse}
                    variablesAndCustomOnly
                    placeholderText="Select/type value"
                    multiple={false}
                    type="text"
                  />
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </>
    );
  };

  const getFunctionInterface = (functionType, indx) => {
    switch (functionType) {
      case "arithmetic":
        return arithmeticInterface(functionType, indx);
      case "nestedIf":
        return nestedIfInterface(functionType, indx);
      case "comparison":
        return comparisonInterface(functionType, indx);

      default:
        break;
    }
  };

  return (
    <div className={classes.container}>
      <MyWindowsDimensions setWinDim={setWindowDimensions} />
      <div
        className={classes.sideHeadingBar}
        onClick={(e) => _toggleSection(e, "settings")}
      >
        <Typography gutterBottom className={classes.sideHeading}>
          {activeTask?.type || ""} information {activeTask?.name}
          {settingsComplete && (
            <CheckCircleOutlineOutlined
              style={{ fontSize: 16, marginLeft: 10, color: "green" }}
            />
          )}
          {!settingsComplete && (
            <ErrorOutlineOutlined
              style={{ fontSize: 16, marginLeft: 10, color: "red" }}
            />
          )}
        </Typography>
      </div>
      <Collapse in={!!showSection.settings}>
        <Divider style={{ marginBottom: 10 }} />
        <div className={classes.section}>
          <NameDescription
            activeTask={activeTask}
            _setTaskInfo={_setTaskInfo}
            nodeIsConnectedToAny={nodeIsConnectedToAny}
            nodeIsConnectedToStart={nodeIsConnectedToStart}
          />
        </div>

        <ExecutionVariables
          activeTask={activeTask}
          setTaskInfo={_setTaskInfo}
          activeTaskId={activeTaskId}
          variables={allVariables}
          classes={classes}
        />
      </Collapse>

      <Divider />

      <div
        data-testId="taskbar-action-section"
        className={classes.sideHeadingBar}
        onClick={(e) => _toggleSection(e, "action")}
      >
        <Typography gutterBottom className={classes.sideHeading}>
          Action details
          {actionComplete && (
            <CheckCircleOutlineOutlined
              style={{ fontSize: 16, marginLeft: 10, color: "green" }}
            />
          )}
          {!actionComplete && (
            <ErrorOutlineOutlined
              style={{ fontSize: 16, marginLeft: 10, color: "red" }}
            />
          )}
        </Typography>
      </div>
      <Divider style={{ marginBottom: 10 }} />

      <Collapse in={!!showSection.action}>
        <div className={classes.section}>
          <span style={{ color: "#999999" }}>Computation Functions</span>
          <div>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <MenuItem
                onClick={() => {
                  handleSelected("comparison");
                }}
              >
                Comparison expressions
              </MenuItem>
              <MenuItem onClick={() => handleSelected("nestedIf")}>
                Nested If expressions
              </MenuItem>
              <MenuItem onClick={() => handleSelected("arithmetic")}>
                Arithmetic expression
              </MenuItem>
            </Menu>

            {!layers.length && (
              <Button
                className={classes.addLayerBtn}
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClicks}
                fullWidth
              >
                Add function step
              </Button>
            )}

            {!!layers.length && (
              <div className={classes.conditionSetup} style={{ marginTop: 0 }}>
                <Menu
                  id="line-menu"
                  anchorEl={anchorMoreEl}
                  open={openMore}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                >
                  <MenuItem
                    onClick={() => handleLineAction("add")}
                    className={classes.miniMenuItem}
                  >
                    Add Line
                  </MenuItem>
                  <MenuItem
                    disabled={!canDelete}
                    onClick={() => handleLineAction("remove")}
                    className={classes.miniMenuItem}
                  >
                    Remove Line
                  </MenuItem>
                </Menu>

                <div>
                  <span style={{ display: "inline-block", marginBottom: 8 }}>
                    Add functions in logical order
                  </span>
                  <ul style={{ marginBottom: 0, marginTop: 0 }}>
                    {layers?.map((layr, indx) => (
                      <li key={`${indx}`}>
                        <div
                          style={{
                            position: "relative",
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            gutterBottom
                            className={classes.sectionTitle}
                            onClick={() => {
                              const toggleFunction_ = [...toggleFunction];
                              toggleFunction_[indx] =
                                toggleFunction_[indx] === true ? false : true;
                              setToggleFunction(toggleFunction_);
                            }}
                            style={{
                              // color: "#FFFFFF",
                              // borderTop: "solid 2px",
                              // paddingTop: 8,
                              // marginTop: 12,
                              display: "flex",
                              alignItems: "center",
                              textTransform: "capitalize",
                              marginBottom: 0,
                              cursor: "pointer",
                              ...(!!functionsValidity[layr._id || layr.id]
                                ? {}
                                : INVALID_FIELD_LABEL_STYLE),
                            }}
                          >
                            {!!toggleFunction?.[indx] ? (
                              <ArrowDropDown />
                            ) : (
                              <ArrowRight />
                            )}
                            <b style={{ marginLeft: 4, marginRight: 4 }}>
                              {layr.functionType}
                            </b>{" "}
                            operation*
                          </Typography>
                          <div
                            style={{
                              // position: "absolute",
                              // top: 0,
                              // right: 0,
                              display: "flex",
                            }}
                          >
                            <Tooltip title="Add before">
                              <Button
                                className={classes.functionBtn}
                                onClick={(e) => handleClicks(e, "before", indx)}
                                variant="contained"
                                color="primary"
                              >
                                Add <ArrowUpward style={{ fontSize: 14 }} />
                              </Button>
                            </Tooltip>
                            <Tooltip title="Add after">
                              <Button
                                className={classes.functionBtn}
                                onClick={(e) => handleClicks(e, "after", indx)}
                                variant="contained"
                                color="primary"
                              >
                                Add <ArrowDownward style={{ fontSize: 14 }} />
                              </Button>
                            </Tooltip>
                            <Tooltip title="Remove">
                              <Delete
                                onClick={(e) => handleClicks(e, "delete", indx)}
                                style={{
                                  fontSize: 14,
                                  margin: 5,
                                  cursor: "pointer",
                                  color: "#965e57",
                                }}
                              />
                            </Tooltip>
                          </div>
                        </div>
                        <Collapse in={!!toggleFunction?.[indx]}>
                          <div
                            style={{
                              position: "relative",
                              display: "flex",
                              marginTop: 5,
                              marginBottom: 10,
                            }}
                          >
                            <TextField
                              key={`${fieldsKey}-1`}
                              variant="outlined"
                              size="small"
                              // fullWidth
                              placeholder={`Enter name for step -${JSON.stringify(
                                layr.functionType
                              )}-`}
                              InputProps={{
                                className: classes.inputLayer,
                              }}
                              // type={layr?.dataType}
                              defaultValue={layr?.name || ""}
                              onChange={(e) =>
                                _preSetTaskInfo1(e, "name", indx)
                              }
                              style={{ flex: 1 }}
                            />
                            {layr.functionType === "comparison" && (
                              <Select
                                key={layr?.linesAndOr || "AND"}
                                variant="outlined"
                                size="small"
                                placeholder="Select screen"
                                classes={{
                                  root: classes.selectThin,
                                  outlined: classes.selected,
                                }}
                                className={`${classes.selectThinOut} selectThin`}
                                onChange={(e) =>
                                  _preSetTaskInfo1(e, "linesAndOr", indx)
                                }
                                defaultValue={layr?.linesAndOr || "AND"}
                              >
                                <MenuItem value="AND" selected>
                                  {`&&`}
                                  <span className={classes.spaceSpanInLI}>
                                    (AND)
                                  </span>
                                </MenuItem>
                                <MenuItem value="OR" selected>
                                  {`||`}
                                  <span className={classes.spaceSpanInLI}>
                                    (OR)
                                  </span>
                                </MenuItem>
                              </Select>
                            )}
                            <InputTypesDropDown
                              classes={classes}
                              right={
                                layr.functionType !== "comparison" ? 6 : null
                              }
                              value={layr?.dataType || "text"}
                              submitAction={(e) =>
                                _preSetTaskInfo1(e, "dataType", indx)
                              }
                            />
                          </div>

                          {getFunctionInterface(layr.functionType, indx)}
                        </Collapse>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {!!layers.filter((f) => f.functionType === "comparison").length && (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  margin: "20px 0 10px",
                }}
              >
                <FormControlLabel
                  classes={{
                    root: classes.switchLabel,
                    label: classes.sectionTitle,
                  }}
                  control={
                    <Switch
                      key={`${resetKey}${!!activeTask?.properties
                        ?.hasDecision}`}
                      defaultChecked={!!activeTask?.properties?.hasDecision}
                      onChange={makeComputationDecision}
                      name="checkedC"
                      color="primary"
                      size="small"
                    />
                  }
                  label="Use for decision"
                  labelPlacement="start"
                />
              </div>

              {!!activeTask?.properties?.hasDecision && (
                <div className={classes.matchingFields}>
                  <div className={classes.sectionEntry}>
                    <Typography
                      gutterBottom
                      className={classes.sectionTitle}
                      style={
                        !activeTask?.properties?.decisionFunction
                          ? INVALID_FIELD_LABEL_STYLE
                          : {}
                      }
                    >
                      Select decision step*
                    </Typography>
                    <Select
                      key={activeTask?.properties?.decisionFunction}
                      variant="outlined"
                      size="small"
                      fullWidth
                      placeholder="Select function"
                      classes={{
                        root: classes.select,
                        outlined: classes.selected,
                      }}
                      onChange={(v) => _setTaskInfo(v, "decisionFunction")}
                      defaultValue={activeTask?.properties?.decisionFunction}
                    >
                      {/* id is value and not _id cos the latter is not available upon FE create */}
                      {activeTask?.properties?.functions
                        ?.filter(
                          (functn) => functn.functionType === "comparison"
                        )
                        ?.map((functn, functionIndex) => (
                          <MenuItem value={functn.id} key={functionIndex}>
                            {functn.name || "[ unnamed ]"}
                          </MenuItem>
                        ))}
                    </Select>
                  </div>
                  <DecisionNodeLabels
                    classes={classes}
                    taskDecisionActions={
                      activeTask?.properties?.decisionActions
                    }
                    setTaskInfo={_setTaskInfo}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </Collapse>
      <Divider />
      <Divider style={{ marginBottom: 100 }} />
    </div>
  );
};

export default connect((state) => {
  return {
    activeTaskId: state.workflows.activeTask?.id,
    activeTaskType: state.workflows.activeTask?.type,
    workflowTasks: state.workflows.workflowTasks,
    // allVariables: state.workflows.variables,
    taskPos: state.workflows.pos,
    workflowCanvas: state.workflows.workflowCanvas,
  };
})(ComputationTaskSidebar);
