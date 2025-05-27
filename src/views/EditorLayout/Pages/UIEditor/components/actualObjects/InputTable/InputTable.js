import React, { useEffect, useRef, useState } from "react";
import { IconButton, makeStyles, Tooltip } from "@material-ui/core";
import AddCircle from "@material-ui/icons/AddCircle";
import CancelIcon from "@material-ui/icons/Cancel";

import InputTableCell from "./components/InputTableCell";
import uploadIcon from "../../../../../../../assets/images/uploadIcon.svg";
import { toNumber } from "../../../../../../common/helpers/helperFunctions";
import UploadDragDrop from "../../../../../../common/components/UploadDragDrop";
import {
  allAggregationFunctions,
  allOperators,
} from "../../../../Workflow/components/utils/constants";
import {
  APP_DESIGN_MODES,
  SCREEN_REUSE_ATTRIBUTES,
  TABLE_CELL_MIN_WIDTH,
} from "../../../../../../common/utils/constants";
import Required from "../Required";
import { getComputedValuePassedIntoFormulaBuilder } from "../../../../../../common/utils/dynamicContentReplace";

const InputTable = ({
  id,
  type,
  values,
  style,
  index,
  screenReuseAttributes,
  ...props
}) => {
  const tableStyles = makeStyles((theme) => {
    const styl = { ...style };
    styl["margin"] = {
      margin: 0, //theme.spacing(1),
    };
    styl["iconButton"] = {
      color: "#FFFFFF",
      border: "solid 1px #010A43",
      cursor: "pointer",
      padding: "2px 3px",
      boxSizing: "border-box",
      borderRadius: "4px",
      backgroundColor: "wheat",
      display: "flex",
    };
    return styl;
  });

  const subscribedToOnChange = useRef(false);
  const subscribedToValues = useRef(false);
  const { capturedData, screenItems } = props || {};

  const prepForPost = (data) => {
    let postData = {};
    data.columns.forEach((column) => {
      Object.entries(column).forEach(([columnKey, columnValue]) => {
        if (postData[columnKey]) postData[columnKey].push(columnValue);
        else postData[columnKey] = [columnValue];
      });
    });
    postData = {
      ...postData,
      ...data.aggregateCells,
    };
    return postData;
  };

  const onLiveChange = (data) => {
    if (!Object.keys(data).length || !id) return;

    props.appDesignMode === APP_DESIGN_MODES.LIVE &&
      props.onChange(prepForPost(data), id, true);
  };
  const { dynamicData, screenId } = props;
  const dynamicValue = dynamicData?.[screenId];

  const classes = tableStyles();
  const [valuesData, setValuesData] = useState({
    columns: [{}],
    aggregateCells: {},
  });
  const [colNames, setColNames] = useState([]);
  const [openCsvUploadDialog, setOpenCsvUploadDialog] = useState(false);
  const [showRowButtons, setShowRowButtons] = useState(true);
  const fixed = false;

  useEffect(() => {
    let newValuesData;
    const cols = values?.columns;
    const colCount = cols?.length;
    const valCols = Object.keys(valuesData?.columns?.[0] || {});
    const valColCount = valCols.length;

    if (!valuesData?.columns?.length) return;
    if (colCount > valColCount) {
      //  column added
      cols?.forEach((col, indx) => {
        if (!valCols?.find((old) => old === col.id)) {
          newValuesData = valuesData?.columns?.map((val) => {
            val[col.id] = "";
            return val;
          });
        }
      });

      setValuesData({
        ...valuesData,
        columns: newValuesData,
      });
    } else if (colCount < valColCount) {
      //  column removed
      valCols?.forEach((old, indx) => {
        if (!cols.find((col) => old === col.id)) {
          newValuesData = valuesData?.columns?.map((val) => {
            delete val[old];
            return val;
          });
        }
      });

      setValuesData({
        ...valuesData,
        columns: newValuesData,
      });
    }
  }, [values?.columns]);

  useEffect(() => {
    if (screenReuseAttributes) {
      getReuseValues();
      return;
    }

    const obj = {};
    const names = [];
    values?.columns?.forEach((col) => {
      obj[col.id] = "";
      col.inputType !== "computed" &&
        names.push({ name: col.header, id: col.id });
    });

    setColNames([...names]);
  }, [values, screenReuseAttributes]);

  useEffect(() => {
    if (screenReuseAttributes) {
      getReuseValues();
      return;
    }

    const obj = {};
    const names = [];
    values?.columns?.forEach((col) => {
      obj[col.id] = "";
      col.inputType !== "computed" &&
        names.push({ name: col.header, id: col.id });
    });

    setColNames([...names]);
  }, [values, screenReuseAttributes, dynamicValue]);

  const launchCSVUpload = () => {
    setOpenCsvUploadDialog(true);
  };
  const addColValues = (colValues) => {
    const nameKey = {};
    subscribedToValues.current = true;

    for (const { name, id } of colNames) {
      nameKey[name] = id;
    }

    const resultArray = colValues.map((obj) => {
      const newObj = {};
      for (const key in obj) {
        newObj[nameKey[key]] = obj[key];
      }
      return newObj;
    });

    const currentAggregateCellsValues = { ...valuesData.aggregateCells };
    const filterEmptyCols = valuesData.columns.filter(
      (col) => !Object.values(col).every((val) => val === "")
    );

    const newValColumns = [...filterEmptyCols, ...resultArray];

    const aggregateResult = newValColumns.map((col, rowIndex) => {
      return columnComputation({
        rowIndex,
        val: null,
        col,
        currentCellsValues: newValColumns,
        currentAggregateCellsValues,
      });
    });

    const { currentAggregateCellsValues_ } =
      aggregateResult[aggregateResult.length - 1];
    const valuesData_ = {
      //...valuesData,
      columns: newValColumns,
      aggregateCells: {
        ...valuesData.aggregateCells,
        ...currentAggregateCellsValues_,
      },
    };

    setValuesData(valuesData_);
    onLiveChange(valuesData_);
  };

  const runCalculations = (currentCellsValues, currentAggregateCellsValues) => {
    values?.aggregateCells.forEach((cell) => {
      if (cell.inputType !== "variable") {
        const cellValue = doAggregateCellValue(
          cell,
          currentCellsValues,
          currentAggregateCellsValues
        );
        currentAggregateCellsValues[cell.id] = cellValue;
      }
    });

    return currentAggregateCellsValues;
  };

  const _addRow = (indx) => {
    subscribedToValues.current = true;
    if (props.appDesignMode !== APP_DESIGN_MODES.LIVE) return;

    const obj = {};
    values?.columns.forEach((col) => {
      obj[col.id] = "";
    });
    const colValuesData_ = [...valuesData?.columns];
    colValuesData_.splice(indx + 1, 0, obj);
    const valuesData_ = {
      ...valuesData,
      columns: colValuesData_,
    };

    setValuesData(valuesData_);
    onLiveChange(valuesData_);
  };

  const _removeRow = (indx) => {
    subscribedToValues.current = true;
    const colValuesData = [...valuesData?.columns];
    let aggValuesData = { ...valuesData?.aggregateCells };

    colValuesData.splice(indx, 1);
    aggValuesData = runCalculations(colValuesData, aggValuesData);
    const valuesData_ = {
      columns: colValuesData,
      aggregateCells: aggValuesData,
    };

    setValuesData(valuesData_);
    onLiveChange(valuesData_);
  };

  const columnComputation = (params) => {
    const {
      rowIndex,
      val,
      col,
      currentCellsValues,
      currentAggregateCellsValues,
    } = params;
    const colKeys = Object.keys(col);

    if (col?.id) {
      if (!currentCellsValues?.[rowIndex]?.[col.id]) {
        currentCellsValues[rowIndex] = {
          ...currentCellsValues[rowIndex],
          [col.id]: val,
        };
      } else currentCellsValues[rowIndex][col.id] = val;
    }

    values?.columns?.forEach((column) => {
      if (column.inputType === "computed" && !colKeys.includes(column.id)) {
        if (column?.useFormulaBuilder) {
          const values = { ...column, useFormulaBuilder: null };

          const computedFinalValue = getComputedValuePassedIntoFormulaBuilder(
            values,
            screenItems,
            capturedData
          );

          currentCellsValues[rowIndex] = {
            ...currentCellsValues[rowIndex],
            [column.id]: computedFinalValue,
          };
        } else {
          const {
            inputType,
            computedLeftOperand,
            computedOperator,
            computedRightOperand,
          } = column;
          const computedLeftOperandValue =
            currentCellsValues?.[rowIndex]?.[computedLeftOperand];
          const computedRightOperandValue =
            currentCellsValues?.[rowIndex]?.[computedRightOperand];

          const finalValue = runOperation(
            computedLeftOperandValue,
            computedRightOperandValue,
            computedOperator
          );

          currentCellsValues[rowIndex] = {
            ...currentCellsValues[rowIndex],
            [column.id]: finalValue,
          };
        }
      }
    });
    const currentAggregateCellsValues_ = runCalculations(
      currentCellsValues,
      currentAggregateCellsValues
    );

    return { currentAggregateCellsValues_ };
  };

  const columnAggregation = (params) => {
    const { rowIndex, val, currentCellsValues, currentAggregateCellsValues } =
      params;

    const rowId = values?.aggregateCells?.[rowIndex]?.id;
    currentAggregateCellsValues[rowId] = val;
    const currentAggregateCellsValues_ = runCalculations(
      currentCellsValues,
      currentAggregateCellsValues
    );
    return { currentAggregateCellsValues_ };
  };

  const _setCellValue = (val, rowIndex, col, cellSectionType) => {
    subscribedToValues.current = true;
    let valuesData_ = { ...valuesData };

    const currentCellsValues = valuesData_.columns;
    const currentAggregateCellsValues = { ...valuesData_.aggregateCells };

    if (cellSectionType === "column") {
      const { currentAggregateCellsValues_ } = columnComputation({
        rowIndex,
        val,
        col,
        currentCellsValues,
        currentAggregateCellsValues,
      });

      valuesData_ = {
        ...valuesData_,
        columns: currentCellsValues,
        aggregateCells: {
          ...valuesData_.aggregateCells,
          ...currentAggregateCellsValues_,
        },
      };
    }

    if (cellSectionType === "aggregate") {
      const { currentAggregateCellsValues_ } = columnAggregation({
        rowIndex,
        val,
        currentCellsValues,
        currentAggregateCellsValues,
      });

      valuesData_ = {
        ...valuesData_,
        aggregateCells: {
          ...valuesData_.aggregateCells,
          ...currentAggregateCellsValues_,
        },
      };
    }

    setValuesData(valuesData_);
    onLiveChange(valuesData_);
  };

  const runOperation = (leftOperand, rightOperand, operator) => {
    let finalValue = "-";

    switch (operator) {
      case allOperators.PLUS:
        finalValue = toNumber(leftOperand) + toNumber(rightOperand);
        break;

      case allOperators.MINUS:
        finalValue = toNumber(leftOperand) - toNumber(rightOperand);
        break;

      case allOperators.MULTIPLY:
        finalValue = toNumber(leftOperand) * toNumber(rightOperand);
        break;

      case allOperators.DIVIDE:
        finalValue = toNumber(leftOperand) / toNumber(rightOperand);
        break;

      default:
        return null;
    }

    return isNaN(finalValue) ? "-" : finalValue;
  };

  const doAggregateCellValue = (
    cell,
    currentCellsValues,
    currentAggregateCellsValues
  ) => {
    const {
      id,
      inputType,
      computedLeftOperand,
      computedOperator,
      computedRightOperand,
      source,
      aggregationFunction,
      cellValue,
    } = cell;
    if (inputType === "constant") {
      return cellValue;
    } /* else if (inputType === "variable") {
      return currentAggregateCellsValues?.[rowIndex];
    } */ else if (inputType === "computation") {
      const computedLeftOperandValue =
        currentAggregateCellsValues?.[computedLeftOperand];
      const computedRightOperandValue =
        currentAggregateCellsValues?.[computedRightOperand];

      const finalValue = runOperation(
        computedLeftOperandValue,
        computedRightOperandValue,
        computedOperator
      );

      return finalValue;
    } else if (inputType === "aggregation") {
      switch (aggregationFunction) {
        case allAggregationFunctions.SUM:
          const finalSumValue = currentCellsValues?.reduce(
            (accumulator, currentValue) =>
              accumulator + toNumber(currentValue?.[source]),
            0
          );
          return finalSumValue;

        case allAggregationFunctions.AVERAGE:
          const sumValue = currentCellsValues?.reduce(
            (accumulator, currentValue) =>
              accumulator + toNumber(currentValue?.[source]),
            0
          );
          const columnLength =
            currentCellsValues?.filter((value) => value[source])?.length || 1;

          const result = sumValue / columnLength;
          return result;

        case allAggregationFunctions.COUNT:
          return currentCellsValues?.filter((value) => !!value?.[source])
            ?.length;

        case allAggregationFunctions.MIN:
          return Math.min(
            ...(currentCellsValues?.map((value) => toNumber(value?.[source])) ||
              [])
          );

        case allAggregationFunctions.MAX:
          return Math.max(
            ...(currentCellsValues?.map((value) => toNumber(value?.[source])) ||
              [])
          );

        default:
          return "-";
      }
    }
  };

  const getAggregateCellContent = (
    rowCell,
    rowIndex,
    colIndex,
    reuseAttribute
  ) => {
    const colsCount = values?.columns?.filter(
      (column) =>
        screenReuseAttributes?.[column.id]?.attribute !==
        SCREEN_REUSE_ATTRIBUTES.HIDDEN
    )?.length;

    switch (colIndex) {
      case colsCount - 1:
        return (
          <InputTableCell
            type={"aggregate"}
            row={rowCell}
            col={{}}
            rowIndex={rowIndex}
            valuesData={valuesData}
            setCellValue={_setCellValue}
            readOnly={reuseAttribute === SCREEN_REUSE_ATTRIBUTES.READONLY}
            {...props}
          />
        );

      case colsCount - 2:
        return (
          <span
            style={{
              display: "block",
              fontSize: 14,
              textAlign: "right",
            }}
          >
            {rowCell.label || `Cell-${1}`}
          </span>
        );

      default:
        return <div></div>;
    }
  };

  const checkGeneralColumnsReuse = () => {
    if (!Object.keys(screenReuseAttributes ?? {}).length)
      return { hasEditable: true, isAllHidden: false };

    let hasEditable = false;
    let isAllHidden = true;

    for (let column of values?.columns) {
      if (
        column.inputType !== "computed" &&
        screenReuseAttributes[column.id]?.attribute === "editable"
      ) {
        return { hasEditable: true, isAllHidden: false };
      } else if (
        column.inputType !== "computed" &&
        screenReuseAttributes[column.id]?.attribute !== "hidden"
      ) {
        isAllHidden = false;
      }
    }

    return { hasEditable, isAllHidden };
  };

  const getReuseValues = () => {
    const reuseColumns = values.columns
      .filter((value) => screenReuseAttributes?.[value.id]?.value)
      .map((value) => value.id);
    const reuseAggregates = values.aggregateCells
      .filter((value) => screenReuseAttributes?.[value.id]?.value)
      .map((value) => value.id);

    //  get the one field/column from attributes object and
    const rowsLength = screenReuseAttributes?.[reuseColumns[0]]?.value?.length;
    const reuseColumnValues = [];

    for (let iterRow = 0; iterRow < rowsLength; iterRow++) {
      const eachRow = {};
      for (let iterCol of reuseColumns) {
        eachRow[iterCol] = screenReuseAttributes[iterCol]?.value?.[iterRow];
      }
      reuseColumnValues.push(eachRow);
    }

    const returnedAggregates = {};
    for (let iterAggr of reuseAggregates) {
      returnedAggregates[iterAggr] = screenReuseAttributes[iterAggr]?.value;
    }

    const retunedValues = reuseColumnValues?.length ? reuseColumnValues : [{}];

    const finalValues = {
      columns: retunedValues,
      aggregateCells: returnedAggregates,
    };

    !subscribedToOnChange.current && onLiveChange(finalValues);
    subscribedToOnChange.current = true;

    // return finalValues;
    if (
      !subscribedToValues.current &&
      Object.keys(finalValues?.columns?.[0])?.length
    ) {
      setValuesData(finalValues);
    }
  };

  return (
    <>
      {!checkGeneralColumnsReuse().isAllHidden && (
        <div
          className={`${classes?.container}`}
          style={{ position: "relative", overflowX: "auto", maxHeight: "65vh" }}
        >
          <div>
            {/* HEADER THINGS */}
            {values?.hasTableHeaders && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: fixed ? 0 : 5,
                  borderBottom: fixed ? "solid 1px" : "none",
                }}
              >
                {values?.hasSerialNumbers && (
                  <div style={{ minWidth: 20, textAlign: "left" }}>#</div>
                )}

                {/* DISPLAY HEADER ROW */}
                {(values?.columns || [])
                  ?.filter(
                    (column) =>
                      screenReuseAttributes?.[column.id]?.attribute !==
                      SCREEN_REUSE_ATTRIBUTES.HIDDEN
                  )
                  .map((col, index) => (
                    <div
                      key={col.id}
                      style={{
                        flex: col.relWidth || 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontSize: 12,
                        ...(props.isDocument
                          ? {}
                          : {
                              minWidth:
                                TABLE_CELL_MIN_WIDTH * (col.relWidth || 1),
                            }),
                      }}
                    >
                      {col.header || (
                        <i
                          style={
                            props.appDesignMode !== APP_DESIGN_MODES.EDIT
                              ? { color: "transparent" }
                              : {}
                          }
                        >
                          Column
                        </i>
                      )}
                      {col?.required && <Required required={col?.required} />}
                    </div>
                  ))}

                {/* DISPLAY ELLIPSE/BUTTON */}
                {!fixed &&
                  props.appDesignMode !== APP_DESIGN_MODES.EDIT &&
                  checkGeneralColumnsReuse().hasEditable && (
                    <>
                      {props.appDesignMode !== APP_DESIGN_MODES.LIVE ? (
                        <div
                          style={{
                            minWidth: 25,
                            maxWidth: 25,
                            textAlign: "center",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            // position: "fixed",
                          }}
                          className={`input-table-menu-elipsis ${
                            !["editor", "live"].includes(props.appDesignMode)
                              ? "_preview"
                              : ""
                          }`}
                          onClick={() => setShowRowButtons(!showRowButtons)}
                        >
                          . . .
                        </div>
                      ) : (
                        values.allowUpload &&
                        !props.isDocument && (
                          <Tooltip title="Upload data from CSV">
                            <div
                              className={classes.iconButton}
                              onClick={() => launchCSVUpload()}
                            >
                              <img
                                src={uploadIcon}
                                alt="uploadIcon"
                                className="csvInputTable"
                                style={{ margin: "auto", width: "13px" }}
                              />
                            </div>
                          </Tooltip>
                        )
                      )}
                    </>
                  )}
              </div>
            )}

            {/* DATA ROWS THINGS */}
            {valuesData?.columns?.map((row, rowIndex) => (
              <div
                key={`row-${rowIndex}`}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  marginBottom: fixed ? 0 : 5,
                  borderBottom: fixed ? "solid 1px" : "none",
                }}
              >
                {values?.hasSerialNumbers && (
                  <div
                    style={{
                      minWidth: 20,
                      textAlign: "left",
                      fontSize: 12,
                      lineHeight: "35px",
                    }}
                  >
                    {rowIndex + 1}.
                  </div>
                )}
                {(values?.columns || [])
                  ?.filter(
                    (column) =>
                      screenReuseAttributes?.[column.id]?.attribute !==
                      SCREEN_REUSE_ATTRIBUTES.HIDDEN
                  )
                  .map((col, valueIndex) => (
                    <div
                      key={`${col.id}-${valueIndex}`}
                      style={{
                        flex: col.relWidth || 1,
                        borderRadius: 0,
                        overflow: "hidden",
                        minWidth: TABLE_CELL_MIN_WIDTH,
                      }}
                    >
                      <InputTableCell
                        type={"column"}
                        row={row}
                        col={col}
                        rowIndex={rowIndex}
                        valuesData={valuesData}
                        /* setValuesData={setValuesData}
                        values={values} */
                        isDocument={props?.isDocument}
                        setCellValue={_setCellValue}
                        shouldAutoFocus={rowIndex === 0}
                        readOnly={
                          screenReuseAttributes?.[col.id]?.attribute ===
                          SCREEN_REUSE_ATTRIBUTES.READONLY
                        }
                        appDesignMode={props?.appDesignMode}
                        {...props}
                      />
                    </div>
                  ))}
                {props.appDesignMode !== APP_DESIGN_MODES.EDIT &&
                  showRowButtons &&
                  checkGeneralColumnsReuse().hasEditable && (
                    <div style={{ minWidth: 20, height: 35, display: "flex" }}>
                      <IconButton
                        size="small"
                        aria-label="Add"
                        className={classes?.margin}
                        onClick={() => _addRow(rowIndex)}
                      >
                        <Tooltip title="Add row">
                          <AddCircle style={{ fontSize: 18 }} />
                        </Tooltip>
                      </IconButton>
                      {valuesData?.columns?.length > 1 && (
                        <IconButton
                          size="small"
                          aria-label="Close"
                          className={classes?.margin}
                          onClick={() => _removeRow(rowIndex)}
                        >
                          <CancelIcon style={{ fontSize: 18 }} />
                        </IconButton>
                      )}
                    </div>
                  )}
              </div>
            ))}

            <div style={{ marginTop: 15 }}>
              {values?.aggregateCells
                ?.filter(
                  (column) =>
                    screenReuseAttributes?.[column.id]?.attribute !==
                    SCREEN_REUSE_ATTRIBUTES.HIDDEN
                )
                ?.map((rowCell, rowIndex) => (
                  <div
                    key={`aggregateCells-${rowCell.id}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: fixed ? 0 : 5,
                      borderBottom: fixed ? "solid 1px" : "none",
                    }}
                  >
                    {values?.hasSerialNumbers && (
                      <div style={{ minWidth: 20, textAlign: "left" }}></div>
                    )}
                    {values?.columns?.map((col, colIndex) => (
                      <div
                        key={`values-columns-${col.id}`}
                        style={{
                          flex: col.relWidth || 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          fontSize: 12,
                          ...(props.isDocument
                            ? {}
                            : {
                                minWidth:
                                  TABLE_CELL_MIN_WIDTH * (col.relWidth || 1),
                              }),
                        }}
                      >
                        {getAggregateCellContent(
                          rowCell,
                          rowIndex,
                          colIndex,
                          screenReuseAttributes?.[rowCell.id]?.attribute
                        )}
                      </div>
                    ))}
                    {checkGeneralColumnsReuse().hasEditable && (
                      <div
                        style={{
                          visibility: "hidden",
                          width: valuesData?.columns?.length > 1 ? 48 : 24,
                        }}
                      >
                        ...
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
          {props.appDesignMode !== APP_DESIGN_MODES.EDIT && !!0 && (
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: valuesData?.columns?.length > 1 ? 48 : 25,
                backgroundColor: showRowButtons ? "transparent" : "#eeeeee",
                textAlign: "center",
                borderRadius: 10,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
              onClick={() => setShowRowButtons(!showRowButtons)}
            >
              . . .
            </div>
          )}
        </div>
      )}
      {openCsvUploadDialog && (
        <UploadDragDrop
          setOpenUploadDragDrop={setOpenCsvUploadDialog}
          openUploadDragDrop={openCsvUploadDialog}
          updateKey={""}
          columnHeaders={colNames}
          headerNameObj
          addColValues={addColValues}
        />
      )}
    </>
  );
};

export default InputTable;
