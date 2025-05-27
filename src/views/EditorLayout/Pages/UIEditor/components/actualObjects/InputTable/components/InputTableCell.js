import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormControlLabel,
  Input,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from "@material-ui/core";
import FileUpload from "../../FileUpload";
import { useDispatch } from "react-redux";
import { v4 } from "uuid";
import { uploadFile } from "../../../../../../../common/helpers/LiveData";
import { TABLE_CELL_MIN_WIDTH } from "../../../../../../../common/utils/constants";

const InputTableCell = React.memo(
  ({
    type: cellSectionType,
    row,
    col,
    rowIndex,
    valuesData,
    setCellValue,
    shouldAutoFocus,
    readOnly,
    ...props
  }) => {
    const { dynamicData, screenId } = props;
    const { id, header, cellOptions } = col;

    const dynamicValue = col.isDynamic
      ? dynamicData?.[screenId]?.[header]
      : null;

    const dispatch = useDispatch();
    const [reRenderKey, setReRenderKey] = useState(null);
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
      setReRenderKey(v4());
    }, [col.cellOptions]);

    useEffect(() => {
      if (
        !isSubscribed &&
        dynamicValue !== null &&
        dynamicValue !== undefined &&
        col.inputType === "inputText" &&
        cellSectionType === "column" &&
        typeof rowIndex === "number" &&
        !!Object.keys(row).length
      ) {
        if (setCellValue) {
          setCellValue(dynamicValue, rowIndex, col, cellSectionType);
          setIsSubscribed(true);
        }
      }
    }, [dynamicValue, col, rowIndex, cellSectionType, row]);

    const getCellInput = () => {
      const columnCellValue = valuesData?.columns?.[rowIndex]?.[id];
      const aggregateCellValue = valuesData?.aggregateCells?.[row?.id];

      return cellSectionType === "aggregate"
        ? aggregateCellValue
        : columnCellValue || dynamicValue;
    };

    const getCellOptions = () => {
      const options = Array.isArray(dynamicValue) ? dynamicValue : cellOptions;

      return options?.filter((option) => {
        return (
          ["string", "number", "boolean"].includes(typeof option) && !!option
        );
      });
    };

    const CellInputText = (
      <Input
        role="textbox"
        inputProps={{
          style: {
            textAlign: `${col?.inputTextAlign}`,
          },
        }}
        style={{
          color: "#091540",
          borderRadius: 3,
          position: "relative",
          border: "1px solid #091540",
          fontSize: 12,
          padding: "3px 12px",
          width: "100%",
          // minWidth: TABLE_CELL_MIN_WIDTH * (col?.relWidth || 1),
          ...(props?.isDocument
            ? {}
            : { minWidth: TABLE_CELL_MIN_WIDTH * (col.relWidth || 1) }),
        }}
        rows={col.textAreaNumRows || 4}
        multiline={col.inputType === "textArea"}
        className={readOnly ? "read-only" : ""}
        value={getCellInput()}
        /* )}
        onBlur={(e) => {
          formatTableCellFunc();
        }} */
        onChange={(e) => {
          e.persist();
          setCellValue &&
            setCellValue(e.target.value, rowIndex, col, cellSectionType);
        }}
        // style={{ width: "100%" }}
        disabled={
          cellSectionType === "aggregate"
            ? row.inputType !== "variable"
            : col.inputType === "computed" || !!dynamicValue
        }
        readOnly={readOnly}
        //autoFocus={!!shouldAutoFocus}
        //focused={!!shouldAutoFocus}
        // required={col?.required}
        type={col?.inputTextType}
        //col.required
      />
    );

    const CellDateTime = (
      <Input
        style={{
          color: "#091540",
          borderRadius: 3,
          position: "relative",
          border: "1px solid #091540",
          fontSize: 12,
          padding: "3px 12px",
          width: "100%",
          display: "inline-grid",
          // minWidth: TABLE_CELL_MIN_WIDTH * (col?.relWidth || 1),
          ...(props?.isDocument
            ? {}
            : { minWidth: TABLE_CELL_MIN_WIDTH * (col.relWidth || 1) }),
        }}
        type="datetime-local"
        className={readOnly ? "read-only" : ""}
        value={getCellInput()}
        onChange={(e) => {
          e.persist();
          setCellValue &&
            setCellValue(e.target.value, rowIndex, col, cellSectionType);
        }}
        // style={{ width: "100%" }}
        disabled={
          cellSectionType === "aggregate"
            ? row.inputType !== "variable"
            : col.inputType === "computed" || !!dynamicValue
        }
        readOnly={readOnly}
        // required={col?.required}
        // autoFocus={!!shouldAutoFocus}
        // focused={!!shouldAutoFocus}
      />
    );

    const CellDropdownSelect = (
      <>
        <Select
          role="listbox"
          key={reRenderKey}
          style={{
            color: "#091540",
            borderRadius: 3,
            position: "relative",
            border: "1px solid #091540",
            fontSize: 12,
            padding: "3px 12px",
            width: "100%",
            // minWidth: TABLE_CELL_MIN_WIDTH * (col?.relWidth || 1),
            ...(props?.isDocument
              ? {}
              : { minWidth: TABLE_CELL_MIN_WIDTH * (col.relWidth || 1) }),
          }}
          className={readOnly ? "read-only" : ""}
          value={getCellInput()}
          /* )} */
          onChange={(e) => {
            e.persist();
            setCellValue &&
              setCellValue(e.target.value, rowIndex, col, cellSectionType);
          }}
          // style={{ width: "100%" }}
          disabled={
            cellSectionType === "aggregate"
              ? row.inputType !== "variable"
              : col.inputType === "computed"
          }
          readOnly={readOnly}
          // required={col?.required}
          // autoFocus={!!shouldAutoFocus}
          // focused={!!shouldAutoFocus}
        >
          {getCellOptions()?.map((option, index) => {
            return (
              <MenuItem key={index} value={option}>
                {option}
              </MenuItem>
            );
          })}
        </Select>
      </>
    );

    const CellCheckbox = (
      // <FormGroup>
      <FormControl
        style={{
          ...(props?.isDocument ? {} : { minWidth: TABLE_CELL_MIN_WIDTH }),
        }}
        // required={col?.required}
      >
        <RadioGroup
          className={readOnly ? "read-only" : ""}
          aria-labelledby="demo-radio-buttons-group-label"
          name="radio-buttons-group"
        >
          {getCellOptions()?.map((option, index) => {
            return (
              <FormControlLabel
                key={index}
                className={readOnly ? "read-only" : ""}
                control={
                  <Radio
                    name={`${option}-${index}`}
                    value={option}
                    checked={
                      option === valuesData?.columns?.[rowIndex]?.[col.id]
                    }
                    onChange={(e) => {
                      e.persist();
                      setCellValue &&
                        setCellValue(
                          e.target.value,
                          rowIndex,
                          col,
                          cellSectionType
                        );
                    }}
                    // name={option}
                  />
                }
                label={
                  <Typography className={""} style={{ textAlign: "left" }}>
                    {option}
                    {/* {separateNumbersWithComma(option, values?.isFormatted)} */}
                  </Typography>
                }
              />
            );
          })}
        </RadioGroup>
        {/* </FormGroup> */}
      </FormControl>
    );

    const cellFileUpload = (
      <FileUpload
        id={`${col.id}-${rowIndex}`}
        dispatch={dispatch}
        values={{
          // required: `${col?.required}`,
          buttonText: "Click to upload",
          labelHide: true,
          numOfFiles: 1,
          maxFileSize: 2, //(MB)
        }}
        style={{
          button: {
            width: "100%",
            minWidth: TABLE_CELL_MIN_WIDTH,
            height: 35,

            fontSize: 12,
            fontWeight: 300,
            color: "#ffffff",
            textAlign: "center",
            textTransform: "none",

            borderStyle: "solid",
            borderWidth: 1,
            borderRadius: 5,
            borderColor: "#091540",
            backgroundColor: "#091540",
          },
        }}
        onChange={(e) => {
          if (e && setCellValue) {
            setCellValue(e, rowIndex, col, cellSectionType);
          }
        }}
        uploadFile={uploadFile}
        val={valuesData?.columns?.[rowIndex]?.[col.id]}
        fromInputTable
        readOnly={readOnly}
        appDesignMode={props?.appDesignMode}
      />
    );

    switch (col.inputType) {
      case "computed":
        return CellInputText;

      case "inputText":
        return CellInputText;

      case "textArea":
        return CellInputText;

      //  to be deprecated
      case "dropdownSelect":
        return CellDropdownSelect;

      case "dropdown":
        return CellDropdownSelect;

      case "dateTime":
        return CellDateTime;

      case "checkbox":
        return CellCheckbox;

      case "radio":
        return CellCheckbox;

      case "fileUpload":
        return cellFileUpload;

      default:
        if (cellSectionType === "aggregate") {
          return CellInputText;
        }
        break;
    }
  }
);

export default InputTableCell;
