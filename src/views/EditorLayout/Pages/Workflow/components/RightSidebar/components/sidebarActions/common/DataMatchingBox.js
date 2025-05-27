import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Collapse,
  IconButton,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { Add, AddCircleRounded, CancelRounded } from "@material-ui/icons";
import DataMatchingPair from "./DataMatchingPair";
import {
  ConditionalOperators,
  allOperators,
  dataNodeUpdateMethods,
} from "../../../../utils/constants";
import LookupMatchingPair from "./LookupMatchingPair";

const DataMatchingBox = ({
  variables,
  dataOperationIds,
  componentData,
  updateComponentData,
  MenuItems,
  isLookupField,
  dataObj,
  getDataColumns,
  activeTaskId,
  lookupContents,
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
      color: "#986a13",
      fontWeight: 500,
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
      gap: 5,
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
    overlapHeader: {
      color: "#8a7d66",
      fontWeight: 500,
      fontSize: "0.85em",
      alignSelf: "center",
    },
  }));

  const classes = useStyles();
  const [canAdd, setCanAdd] = useState(false);
  const [counter, setCounter] = useState(1);
  const [selText1, setSelText1] = useState("Field");
  const [selText2, setSelText2] = useState("form fields");
  const node = "data"; //  seems redundant... consider removing completely

  useEffect(() => {
    const cols = getDataColumns().length;
    setSelText1("Identifier Variable");
    setSelText2("variables");
    setCounter(variables?.length);

    setCanAdd(
      (componentData?.dataMatching || []).length &&
        cols > (componentData?.dataMatching || []).length
    );
  }, [
    componentData?.dataMatching,
    node,
    variables,
    activeTaskId,
    getDataColumns,
  ]);

  const _updateComponentData = (e, name) => {
    updateComponentData({
      target: {
        name,
        value: e,
      },
    });
  };

  const updateMatching = (value, index) => {
    const _dataMatching = [...(componentData?.dataMatching || [])];

    switch (value) {
      case "@add":
        if (index) {
          _dataMatching.splice(index + 1, 0, {});
        } else {
          _dataMatching.push({});
        }
        break;

      case "@remove":
        _dataMatching.splice(index, 1);
        break;

      default:
        _dataMatching[index] = value;
        break;
    }

    _updateComponentData(_dataMatching, "dataMatching");
  };

  const updateUpdateParams = (value, field, index) => {
    const _dataUpdateParams = [...(componentData?.dataUpdateParams || [{}])];

    switch (field) {
      case "@add":
        _dataUpdateParams.splice(index + 1, 0, {});
        break;

      case "@addOverlappingCheck":
        _dataUpdateParams.splice(0, 0, {
          dataUpdateIdentifierOperator: "DATA_OVERLAP",
        });
        break;

      case "@remove":
        _dataUpdateParams.splice(index, 1);
        break;

      default:
        _dataUpdateParams[index] = {
          ..._dataUpdateParams[index],
          [field]: value,
        };
    }
    _updateComponentData(_dataUpdateParams, "dataUpdateParams");
  };

  const getSubsequentIds = () => {
    const allIds = [...dataOperationIds];
    const currentId = componentData.dataOperationId;
    const currentIdIndex = allIds.indexOf(currentId);

    if (currentIdIndex > -1) {
      return allIds.splice(currentIdIndex);
    }
    return [];
  };

  const filterOutAlreadySelectedLookupVariable = (
    allVariables,
    lookupContents
  ) => {
    // Filter out variables where the ID matches a lookup content with `dataMatching` property
    return allVariables.filter((variable) => {
      // Check if there's a match in lookupcontents with the same ID and has `dataMatching`
      const matchedLookup = lookupContents?.find(
        (lookup) => lookup?.id === variable?.id && lookup?.dataMatching
      );

      // Include in result only if no such match exists
      return !matchedLookup;
    });
  };

  return (
    <div className={classes.sectionEntry}>
      <div className={classes.matchingFields}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <div>
            <Typography
              gutterBottom
              className={classes.sectionTitle}
              style={{ color: "#666666", marginBottom: 0, lineHeight: 1 }}
            >
              Match form inputs to data fields:
            </Typography>
            <div
              style={{
                fontSize: "0.9em",
                color: "#aaa",
                fontWeight: "normal",
              }}
            >
              Only form inputs with set 'name' attribute in UI Editor appear
              here
            </div>
          </div>
        </div>

        <Collapse
          in={
            !!node &&
            node === "data" &&
            [
              dataNodeUpdateMethods.UPDATE,
              dataNodeUpdateMethods.RETRIEVE,
            ].includes(componentData?.dataMethod)
          }
          style={{
            borderRadius: 5,
            overflow: "auto",
            backgroundColor: "#faefdf",
            border: "solid 1px #f0e7db",
          }}
        >
          <div
            // className={classes.pair}
            style={{
              padding: 5,
              marginBottom: 0,
              display: "grid",
              // gridTemplateColumns: "repeat(2, 1fr)",
              columnGap: 5,
              rowGap: 5,
            }}
          >
            <div>
              <ul
                style={{
                  paddingLeft: 12,
                  margin: 0,
                }}
              >
                <li>where</li>
              </ul>
            </div>
            <div
              style={{
                display: "inline",
                gridColumnStart: 2,
                gridColumnEnd: 3,
              }}
            >
              {" "}
              <ul
                style={{
                  paddingLeft: 12,
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <li>is</li>
                <span
                  style={{
                    fontSize: "0.8em",
                    cursor: "pointer",
                    visibility: "hidden",
                  }}
                  // onClick={() =>
                  //   updateUpdateParams(null, "@addOverlappingCheck")
                  // }
                >
                  [ + Overlap checker ]
                </span>
              </ul>
            </div>
            {(!!componentData?.dataUpdateParams?.length
              ? componentData?.dataUpdateParams
              : [{}]
            ).map((dataUpdateParam, index) =>
              dataUpdateParam?.dataUpdateIdentifierOperator ===
              "DATA_OVERLAP" ? (
                <div
                  style={{
                    gridColumnStart: 1,
                    gridColumnEnd: 3,
                    display: "flex",
                    gap: 5,
                  }}
                >
                  <div
                    style={{
                      border: "solid 1px rgb(170, 167, 162)",
                      flex: 1,
                      borderRadius: 4,
                    }}
                  >
                    <div
                      style={{
                        padding: "2px 5px",
                        backgroundColor: "rgb(170, 167, 162)",
                        color: "rgb(255, 255, 255)",
                        fontSize: "0.85em",
                        textShadow: "1px 1px 1px #433f39",
                      }}
                    >
                      Overlapping things
                    </div>
                    <div style={{ padding: 5, display: "grid", gap: 2 }}>
                      <div></div>
                      <div className={classes.overlapHeader}>Data field</div>
                      <div
                        className={classes.overlapHeader}
                        style={{ gridColumnStart: 3 }}
                      >
                        Variable
                      </div>
                      <div className={classes.overlapHeader}>Start date</div>
                      <div>
                        <Select
                          key={
                            dataUpdateParam?.dataUpdateOverlapFieldStart ||
                            "choose"
                          }
                          variant="outlined"
                          size="small"
                          fullWidth
                          classes={{
                            root: classes.select,
                            disabled: classes.disabled,
                          }}
                          defaultValue={
                            dataUpdateParam?.dataUpdateOverlapFieldStart ||
                            "choose"
                          }
                          onChange={(e) =>
                            updateUpdateParams(
                              e?.target?.value,
                              "dataUpdateOverlapFieldStart",
                              index
                            )
                          }
                        >
                          <MenuItem
                            value="choose"
                            key="key-col-0"
                            selected
                            disabled
                          >
                            <em>Assign data field</em>
                          </MenuItem>
                          {getDataColumns().map((col) => (
                            <MenuItem key={`col-${col.id}`} value={col.id}>
                              {col.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </div>
                      <div>
                        <Select
                          key={dataUpdateParam?.dataUpdateOverlapColumnStart}
                          variant="outlined"
                          size="small"
                          fullWidth
                          classes={{
                            root: classes.select,
                            outlined: classes.selected,
                            disabled: classes.disabled,
                          }}
                          style={{ flex: 1 }}
                          defaultValue={
                            dataUpdateParam?.dataUpdateOverlapColumnStart ||
                            "choose"
                          }
                          onChange={(e) => {
                            //  pending when we use SelectOnSteroid here with updated interface
                            //  as this Select input
                            updateUpdateParams(
                              e?.target?.value,
                              "dataUpdateOverlapColumnStart",
                              index
                            );
                          }}
                        >
                          <MenuItem
                            value="choose"
                            key="key-col-0"
                            selected
                            disabled
                          >
                            <em>
                              {counter
                                ? `Select ${selText1}*`
                                : `No ${selText2}*`}
                            </em>
                          </MenuItem>

                          {MenuItems("input", getSubsequentIds())}
                        </Select>
                      </div>
                      <div className={classes.overlapHeader}>End date</div>
                      <div>
                        <Select
                          key={
                            dataUpdateParam?.dataUpdateOverlapFieldEnd ||
                            "choose"
                          }
                          variant="outlined"
                          size="small"
                          fullWidth
                          classes={{
                            root: classes.select,
                            disabled: classes.disabled,
                          }}
                          defaultValue={
                            dataUpdateParam?.dataUpdateOverlapFieldEnd ||
                            "choose"
                          }
                          onChange={(e) =>
                            updateUpdateParams(
                              e?.target?.value,
                              "dataUpdateOverlapFieldEnd",
                              index
                            )
                          }
                        >
                          <MenuItem
                            value="choose"
                            key="key-col-0"
                            selected
                            disabled
                          >
                            <em>Assign data field</em>
                          </MenuItem>
                          {getDataColumns().map((col) => (
                            <MenuItem key={`col-${col.id}`} value={col.id}>
                              {col.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </div>
                      <div>
                        <Select
                          key={dataUpdateParam?.dataUpdateOverlapColumnEnd}
                          variant="outlined"
                          size="small"
                          fullWidth
                          classes={{
                            root: classes.select,
                            outlined: classes.selected,
                            disabled: classes.disabled,
                          }}
                          style={{ flex: 1 }}
                          defaultValue={
                            dataUpdateParam?.dataUpdateOverlapColumnEnd ||
                            "choose"
                          }
                          onChange={(e) => {
                            //  pending when we use SelectOnSteroid here with updated interface
                            //  as this Select input
                            updateUpdateParams(
                              e?.target?.value,
                              "dataUpdateOverlapColumnEnd",
                              index
                            );
                          }}
                        >
                          <MenuItem
                            value="choose"
                            key="key-col-0"
                            selected
                            disabled
                          >
                            <em>
                              {counter
                                ? `Select ${selText1}*`
                                : `No ${selText2}*`}
                            </em>
                          </MenuItem>

                          {MenuItems("input", getSubsequentIds())}
                        </Select>
                      </div>
                    </div>
                  </div>{" "}
                  <div
                    className={classes.addComponent}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      gap: 5,
                    }}
                  >
                    <Tooltip title="Add line">
                      <IconButton
                        size="small"
                        style={{ padding: 0 }}
                        onClick={() => updateUpdateParams(null, "@add", index)}
                      >
                        <AddCircleRounded style={{ fontSize: 14 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remove line">
                      <IconButton
                        size="small"
                        style={{ padding: 0 }}
                        disabled={componentData?.dataUpdateParams?.length <= 1}
                        onClick={() =>
                          updateUpdateParams(null, "@remove", index)
                        }
                      >
                        <CancelRounded style={{ fontSize: 14 }} />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              ) : (
                <React.Fragment key={index}>
                  <div>
                    <Select
                      key={
                        dataUpdateParam?.dataUpdateIdentifierColumn || "choose"
                      }
                      variant="outlined"
                      size="small"
                      fullWidth
                      classes={{
                        root: classes.select,
                        disabled: classes.disabled,
                      }}
                      defaultValue={
                        dataUpdateParam?.dataUpdateIdentifierColumn || "choose"
                      }
                      onChange={(e) =>
                        updateUpdateParams(
                          e?.target?.value,
                          "dataUpdateIdentifierColumn",
                          index
                        )
                      }
                    >
                      <MenuItem
                        value="choose"
                        key="key-col-0"
                        selected
                        disabled
                      >
                        <em>Assign data field</em>
                      </MenuItem>
                      {getDataColumns().map((col) => (
                        <MenuItem key={`col-${col.id}`} value={col.id}>
                          {col.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                  <div style={{ display: "flex", gap: 5 }}>
                    <Select
                      key={dataUpdateParam?.dataUpdateIdentifierOperator}
                      variant="outlined"
                      size="small"
                      fullWidth
                      classes={{
                        root: classes.select,
                        outlined: classes.selected,
                        disabled: classes.disabled,
                      }}
                      style={{ width: 50 }}
                      defaultValue={
                        dataUpdateParam?.dataUpdateIdentifierOperator ||
                        allOperators.EQUALS
                      }
                      onChange={(e) => {
                        //  pending when we use SelectOnSteroid here with updated interface
                        //  as this Select input
                        updateUpdateParams(
                          e?.target?.value,
                          "dataUpdateIdentifierOperator",
                          index
                        );
                      }}
                    >
                      {ConditionalOperators?.map(
                        ({ value, symbol, title }, idx) => (
                          <MenuItem value={value} key={`${value}-${idx}`}>
                            {symbol}{" "}
                            <span style={{ marginLeft: 5 }}>{title}</span>
                          </MenuItem>
                        )
                      )}
                    </Select>
                    <Select
                      key={dataUpdateParam?.dataUpdateIdentifierField}
                      variant="outlined"
                      size="small"
                      fullWidth
                      classes={{
                        root: classes.select,
                        outlined: classes.selected,
                        disabled: classes.disabled,
                      }}
                      style={{ flex: 1 }}
                      defaultValue={
                        dataUpdateParam?.dataUpdateIdentifierField || "choose"
                      }
                      onChange={(e) => {
                        //  pending when we use SelectOnSteroid here with updated interface
                        //  as this Select input
                        updateUpdateParams(
                          e?.target?.value,
                          "dataUpdateIdentifierField",
                          index
                        );
                      }}
                    >
                      <MenuItem
                        value="choose"
                        key="key-col-0"
                        selected
                        disabled
                      >
                        <em>
                          {counter ? `Select ${selText1}*` : `No ${selText2}*`}
                        </em>
                      </MenuItem>

                      {MenuItems("input", getSubsequentIds())}
                    </Select>
                    <div
                      className={classes.addComponent}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <Tooltip title="Add line">
                        <IconButton
                          size="small"
                          style={{ padding: 0 }}
                          onClick={() =>
                            updateUpdateParams(null, "@add", index)
                          }
                        >
                          <AddCircleRounded style={{ fontSize: 14 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Remove line">
                        <IconButton
                          size="small"
                          style={{ padding: 0 }}
                          disabled={
                            componentData?.dataUpdateParams?.length <= 1
                          }
                          onClick={() =>
                            updateUpdateParams(null, "@remove", index)
                          }
                        >
                          <CancelRounded style={{ fontSize: 14 }} />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                </React.Fragment>
              )
            )}
          </div>
        </Collapse>

        <Collapse
          in={componentData?.dataMethod !== dataNodeUpdateMethods.RETRIEVE}
        >
          <div
            style={{
              marginTop: 10,
            }}
          >
            <div
              style={{
                display: "grid",
                gap: 5,
              }}
            >
              <div>
                <Typography className={classes.mappingTitle}>
                  Data fields
                </Typography>
              </div>
              <div
                style={{
                  display: "inline",
                  gridColumn: "2 / 3",
                }}
              >
                <Typography
                  className={classes.mappingTitle}
                  style={{ fontSize: 12, color: "#986a13", fontWeight: 500 }}
                >
                  {/* {!!node && node === "data" ? "Variables" : "Form Inputs"} */}
                  Value
                </Typography>
              </div>
              {isLookupField
                ? (!!componentData?.dataMatching?.length
                    ? componentData?.dataMatching
                    : [{}]
                  ).map((value, index) => (
                    <LookupMatchingPair
                      key={index}
                      index={index}
                      mapv={{ value, index }}
                      valuesData={getDataColumns()}
                      updateMatching={updateMatching}
                      isLookupField={isLookupField}
                      lookupContents={lookupContents}
                      matchedLines={componentData?.dataMatching}
                      matchedLine={componentData?.dataMatching?.[index]}
                      variables={filterOutAlreadySelectedLookupVariable(
                        variables,
                        lookupContents
                      )}
                      setCanAdd={setCanAdd}
                      counter={counter}
                      dataObj={dataObj}
                      includeOriginal={componentData?.dataMethod === "update"}
                    />
                  ))
                : (!!componentData?.dataMatching?.length
                    ? componentData?.dataMatching
                    : [{}]
                  ).map((value, index) => (
                    <DataMatchingPair
                      key={index}
                      index={index}
                      mapv={{ value, index }}
                      valuesData={getDataColumns()}
                      updateMatching={updateMatching}
                      matchedLines={componentData?.dataMatching}
                      matchedLine={componentData?.dataMatching?.[index]}
                      variables={filterOutAlreadySelectedLookupVariable(
                        variables,
                        lookupContents
                      )}
                      setCanAdd={setCanAdd}
                      counter={counter}
                      includeOriginal={componentData?.dataMethod === "update"}
                    />
                  ))}
            </div>
            <IconButton
              onClick={() => updateMatching("@add")}
              aria-label="Add pair"
              size="small"
              className={classes.addMatch}
              // disabled={ !canAdd || (counter <= matchingPairs.length) }
              disabled={!canAdd}
            >
              <Add style={{ fontSize: 20 }} />
            </IconButton>
          </div>
        </Collapse>

        <Collapse
          in={componentData?.dataMethod === dataNodeUpdateMethods.RETRIEVE}
          style={{
            marginTop: 10,
            overflow: "auto",
          }}
        >
          <div className={classes.sectionEntry}>
            <Typography gutterBottom className={classes.mappingTitle}>
              Aggregation function
            </Typography>

            <div
              style={{ marginBottom: 0, alignItems: "center", gap: 3 }}
              container
            >
              {/* <li className={classes.decisionPrefix}>IF</li> */}
              <div
                style={{
                  flex: 1,
                  // marginRight: !!dataSheet ? 0 : 0,
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
                  value={componentData?.aggregationFunction || "NONE"}
                  onChange={(e) =>
                    _updateComponentData(
                      e?.target?.value,
                      "aggregationFunction"
                    )
                  }
                >
                  <MenuItem value="NONE">NONE</MenuItem>
                  <MenuItem value="SUM">SUM</MenuItem>
                  <MenuItem value="AVERAGE">AVERAGE</MenuItem>
                  <MenuItem value="COUNT">COUNT</MenuItem>
                  <MenuItem value="MIN">MIN</MenuItem>
                  <MenuItem value="MAX">MAX</MenuItem>
                  <MenuItem value="EXISTS">EXISTS</MenuItem>
                  <MenuItem value="LIST">LIST</MenuItem>
                </Select>
              </div>
            </div>
          </div>

          <Collapse
            in={
              !!componentData?.aggregationFunction &&
              componentData?.aggregationFunction !== "NONE"
            }
          >
            <div className={classes.sectionEntry}>
              <Typography gutterBottom className={classes.mappingTitle}>
                Aggregated field
              </Typography>

              <div
                style={{ marginBottom: 0, alignItems: "center", gap: 3 }}
                container
              >
                {/* <li className={classes.decisionPrefix}>IF</li> */}
                <div
                  style={{
                    flex: 1,
                    // marginRight: !!dataSheet ? 0 : 0,
                  }}
                >
                  <Select
                    key={componentData?.aggregatedField || "choose"}
                    variant="outlined"
                    size="small"
                    fullWidth
                    classes={{
                      root: classes.select,
                      disabled: classes.disabled,
                    }}
                    defaultValue={componentData?.aggregatedField || "choose"}
                    onChange={(e) =>
                      _updateComponentData(e?.target?.value, "aggregatedField")
                    }
                  >
                    {getDataColumns().map((col) => (
                      <MenuItem key={`col-${col.id}`} value={col.id}>
                        {col.name}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
          </Collapse>

          <Collapse
            in={
              !componentData?.aggregationFunction ||
              componentData?.aggregationFunction === "NONE"
            }
          >
            <div className={classes.sectionEntry}>
              <Typography gutterBottom className={classes.mappingTitle}>
                Select field(s)
              </Typography>

              <div
                style={{ marginBottom: 0, alignItems: "center", gap: 3 }}
                container
              >
                {/* <li className={classes.decisionPrefix}>IF</li> */}
                <div
                  style={{
                    flex: 1,
                    // marginRight: !!dataSheet ? 0 : 0,
                  }}
                >
                  <Select
                    key={JSON.stringify(
                      componentData?.selectedFields || "choose"
                    )}
                    variant="outlined"
                    size="small"
                    fullWidth
                    multiple
                    classes={{
                      root: classes.select,
                      disabled: classes.disabled,
                    }}
                    defaultValue={componentData?.selectedFields || []}
                    onChange={(e) =>
                      _updateComponentData(e?.target?.value, "selectedFields")
                    }
                  >
                    {getDataColumns().map((col) => (
                      <MenuItem key={`col-${col.id}`} value={col.id}>
                        {col.name}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
          </Collapse>
        </Collapse>
      </div>
    </div>
  );
};

export default DataMatchingBox;
