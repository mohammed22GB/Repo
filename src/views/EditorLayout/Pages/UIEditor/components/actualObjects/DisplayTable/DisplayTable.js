import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { IconButton, makeStyles } from "@material-ui/core";
import AddCircle from "@material-ui/icons/AddCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import { isEqual } from "lodash";
import { updateScreenItemPropertyValues } from "../../../utils/uieditorHelpers";
import DisplayTableCell from "./Helpers/DisplayTableCell";
import { APP_DESIGN_MODES } from "../../../../../../common/utils/constants";
import { separateNumbersWithComma } from "../../../../../../common/helpers/helperFunctions";

const DisplayTable = (propsy) => {
  const { id, type, values, style, itemRef, ...props } = propsy;
  const { dynamicData } = props;
  const dispatch = useDispatch();
  const tableStyles = makeStyles((theme) => {
    const styl = { ...style };
    styl["margin"] = {
      margin: 0, //theme?.spacing(1),
    };
    return styl;
  });

  const classes = tableStyles();
  const allValues = useRef();
  const [columns, setColumns] = useState([]);
  const [valuesData, setValuesData] = useState([]);
  const [isDynamic, setIsDynmaic] = useState(false);
  const fixed = true;
  const dynamicData_ =
    props?.appDesignMode === APP_DESIGN_MODES.LIVE
      ? dynamicData?.[props?.screenId]?.[props?.name]
      : [];

  useEffect(() => {
    setIsDynmaic(props?.name?.startsWith("@"));
    if (isEqual(values, allValues.current)) return;
    allValues.current = { ...values };

    const tableColumnIds = {};
    values?.columns?.forEach((col) => {
      tableColumnIds[col?.id] = "";
    });

    const values_ =
      dynamicData_?.length > 0
        ? dynamicData_
        : !!values?.values?.length
        ? values?.values
        : [tableColumnIds];

    //THIS DOES NOT WORK FOR WORKFLOW VARIABLES ONLY DYNAMIC
    //console.log(props.metadata);//THIS DOES NOT WORK FOR WORKFLOW VARIABLES

    setValuesData(() => values_);
    setColumns(() => values?.columns);
  }, [propsy]);

  useEffect(() => {}, [isDynamic]);
  const _addRow = (indx) => {
    const obj = {};
    columns?.forEach((col) => {
      obj[col.id] = "";
    });
    const valuesData_ = [...(valuesData || [])];
    valuesData_.splice(indx + 1, 0, obj);
    updateTableValues(valuesData_, "values");
  };

  const _removeRow = (indx) => {
    const valuesData_ = [...(valuesData || [])];
    valuesData_.splice(indx, 1);
    updateTableValues(valuesData_, "values");
  };

  const handleDataUpdate = (e, row, col) => {
    const valuesData_ = [...(valuesData || [])];
    if (typeof valuesData_[row] === "undefined") valuesData_[row] = {};
    valuesData_[row][col] = e.target.value;

    updateTableValues(valuesData_, "values");
  };

  const commaSeparatorObj = (obj) => {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        value = separateNumbersWithComma(
          value,
          values?.isFormatted,
          props?.isDocument
        );
        return [key, value];
      })
    );
  };

  const updateTableValues = (value, property) => {
    dispatch(
      updateScreenItemPropertyValues({
        value,
        property,
        itemRef,
      })
    );
  };

  return (
    <div
      className={`${classes?.container}`}
      style={{ overflowX: "auto", maxHeight: "70vh" }}
    >
      <div style={{ borderBottom: "solid 2px" }}>
        <div
          style={{
            display: "flex",
            marginBottom: fixed ? 0 : 5,
            borderBottom: fixed ? "solid 1px" : "none",
          }}
        >
          {props?.appDesignMode !== APP_DESIGN_MODES.LIVE &&
          (columns || [])?.length > 0
            ? columns.map((col, index) => (
                <div
                  key={col.id}
                  style={{
                    flex: col.relWidth || 1,
                    // marginLeft: 5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontWeight: "bold",
                    minWidth: 180,
                  }}
                >
                  {col.dataText || `Title-${index + 1}`}
                </div>
              ))
            : null}
          {props?.appDesignMode === APP_DESIGN_MODES.LIVE &&
          (columns || [])?.length > 0
            ? columns.map((col, index) => (
                <div
                  key={col.id}
                  style={{
                    flex: col.relWidth || 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontWeight: "bold",
                    minWidth: 180,
                  }}
                >
                  {col.dataText || `Title-${index + 1}`}
                </div>
              ))
            : null}
          {(!fixed || props.appDesignMode === APP_DESIGN_MODES.EDIT) && (
            <div
              style={{
                width: valuesData.length > 1 ? 60 : 24,
                textAlign: "center",
              }}
            >
              ...
            </div>
          )}
        </div>
        {(valuesData || [])?.length > 0
          ? valuesData.map((row, rowIndex) => {
              return (
                <div
                  key={`row-${rowIndex}`}
                  style={{
                    display: "flex",
                    marginBottom: fixed ? 0 : 5,
                    // borderBottom: fixed ? "solid 1px" : "none",
                  }}
                >
                  {(columns || [])?.length > 0
                    ? columns.map((col, valueIndex) => {
                        return (
                          <div
                            key={`value-${valueIndex}-${col.id}`}
                            style={{
                              flex: col.relWidth || 1,
                              border: "1px solid",
                              borderBottom: "none",
                              borderRadius: 0,
                              padding: "5px 10px",
                              minWidth: 150,
                            }}
                          >
                            <DisplayTableCell
                              // row={row}
                              row={commaSeparatorObj(row)}
                              col={col}
                              appDesignMode={props?.appDesignMode}
                              rowIndex={rowIndex}
                              handleDataUpdate={handleDataUpdate}
                              isDynamic={isDynamic}
                            />
                          </div>
                        );
                      })
                    : null}
                  {props.appDesignMode === APP_DESIGN_MODES.EDIT && (
                    <IconButton
                      size="small"
                      aria-label="Add"
                      className={classes?.margin}
                      onClick={() => _addRow(rowIndex)}
                    >
                      <AddCircle />
                    </IconButton>
                  )}

                  {props.appDesignMode === APP_DESIGN_MODES.EDIT &&
                    valuesData.length > 1 && (
                      <IconButton
                        size="small"
                        aria-label="Close"
                        className={classes?.margin}
                        onClick={() => _removeRow(rowIndex)}
                      >
                        <CancelIcon />
                      </IconButton>
                    )}
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
};

export default DisplayTable;
