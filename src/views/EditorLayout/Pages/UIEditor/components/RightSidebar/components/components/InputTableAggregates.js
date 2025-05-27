import React, { useRef, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Collapse,
  Input,
  InputBase,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { useDispatch } from "react-redux";
import Selector from "../Selector";
import {
  AddBoxOutlined,
  ArrowDropDown,
  DeleteOutline,
} from "@material-ui/icons";
import { v4 } from "uuid";
import { updateScreenItemPropertyValues } from "../../../../utils/uieditorHelpers";
import { WORKFLOWS_DATASOURCE_AGGREGATIONS } from "../../../../../Workflow/components/utils/constants";

const inputTableAggregateCellTypes = [
  ["constant", "Constant"],
  ["variable", "Variable"],
  ["aggregation", "Aggregation"],
  ["computation", "Computation"],
];

const computationOperators = [
  ["PLUS", "+"],
  ["MINUS", "-"],
  ["MULTIPLY", "x"],
  ["DIVIDE", "÷"],
];

const MAX_CELLS = 8;

const InputTableAggregate = React.memo(({ values, itemRef }) => {
  const notAffectVariables = useRef(true);

  const [showPreferences, setShowPreferences] = useState(false);
  const [toggleCellSetting, setToggleCellSetting] = useState(
    new Array(values?.aggregateCells?.length || 2).fill(false)
  );
  const dispatch = useDispatch();

  const InputText = withStyles((theme) => ({
    input: {
      color: "#091540",
      borderRadius: 3,
      position: "relative",
      border: "1px solid #ABB3BF",
      fontSize: 12,
      padding: "5px 12px",
      transition: theme?.transitions.create(["border-color", "box-shadow"]),
    },
  }))(InputBase);
  const onValuesChange = ({ value, property }) => {
    const cellNames = value.map((cell) => cell.label?.toLowerCase()?.trim());
    if (cellNames.length !== new Set(cellNames).size) {
      alert("Cell names must be specified and unique");
      return;
    }

    dispatch(
      updateScreenItemPropertyValues({
        value,
        property,
        itemRef,
        notAffectVariables: notAffectVariables.current,
      })
    );
    notAffectVariables.current = true;
  };

  const onPreValuesChange = ({ value, property }, index) => {
    const currentAggregateCells = [...values?.aggregateCells];
    currentAggregateCells[index] = {
      ...currentAggregateCells[index],
      [property]: value,
    };
    if (property === "label") notAffectVariables.current = false;
    onValuesChange({
      value: currentAggregateCells,
      property: "aggregateCells",
    });
  };

  const addCell = (index) => {
    const currentAggregateCells = [...values?.aggregateCells];
    if (currentAggregateCells.length >= MAX_CELLS) return;
    if (index === -1) {
      currentAggregateCells.push({
        id: v4(),
        label: "",
        inputType: "",
        source: "",
        relWidth: 1,
      });
    } else {
      currentAggregateCells.splice(index + 1, 0, {
        id: v4(),
        header: "",
        inputType: "",
        source: "",
        relWidth: 1,
      });
    }
    notAffectVariables.current = false;
    onValuesChange({
      value: currentAggregateCells,
      property: "aggregateCells",
    });
  };

  const deleteCell = (index) => {
    const currentAggregateCells = [...values?.aggregateCells];

    currentAggregateCells.splice(index, 1);
    notAffectVariables.current = false;
    onValuesChange({
      value: currentAggregateCells,
      property: "aggregateCells",
    });
  };

  const getCells = (cellIndex) => {
    const cells = values?.aggregateCells
      ?.filter((cell, index) => index < cellIndex)
      ?.map((cell, index) => [cell.id, cell.label || `Cell-${index + 1}`]);
    return cells;
  };

  const getColumns = () => {
    const cols = values?.columns?.map((column, index) => [
      column.id,
      column.header || `Column-${index + 1}`,
    ]);
    /* const cells = values?.aggregateCells
        ?.filter((cell, index) => index < cellIndex)
        ?.map((cell, index) => [cell.id, cell.label || `Cell-${index + 1}`]);
      const list = [...cols, ...cells]; */
    return cols;
  };

  return (
    <div className="sidebar-section">
      <div
        className="sidebar-section-header"
        onClick={() => setShowPreferences((prev) => !prev)}
      >
        <Typography>Aggregation cells</Typography>
        <span>{`[${showPreferences ? "-" : "+"}]`}</span>
      </div>

      <Collapse in={showPreferences}>
        <div style={{ padding: 8 }}>
          {" "}
          {!values?.aggregateCells?.length && (
            <div
              style={{
                float: "right",
                backgroundColor: "#e7e5e1",
                padding: "2px 5px",
                marginRight: -7,
                borderRadius: 3,
                fontWeight: 300,
                cursor: "pointer",
              }}
              onClick={() => addCell(-1)}
            >
              Add cell
            </div>
          )}
        </div>
        {values?.aggregateCells?.map((cell, index) => (
          <div key={cell?.id}>
            <div
              className="sidebar-section-item _full"
              style={{
                cursor: "pointer",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: 5,
                backgroundColor: "#f8f8f8",
                border: "solid 1px #fff",
              }}
              onClick={() => {
                const toggleState = new Array(toggleCellSetting.length).fill(
                  false
                );
                toggleState[index] = !toggleCellSetting[index];
                setToggleCellSetting(toggleState);
              }}
            >
              <div>
                <ArrowDropDown />
              </div>
              <div style={{ width: 150 }}>
                <Input
                  value={cell?.label}
                  placeholder={`Cell-${index + 1}`}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  onChange={(e) =>
                    onPreValuesChange(
                      { value: e.target.value, property: "label" },
                      index
                    )
                  }
                />
              </div>
              <Tooltip title="Add cell below">
                <AddBoxOutlined
                  style={{
                    fontSize: 18,
                    color:
                      values?.aggregateCells?.length >= MAX_CELLS
                        ? "#AAA"
                        : "#666",

                    marginLeft: "auto",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    addCell(index);
                  }}
                />
              </Tooltip>
              <Tooltip title="Remove cell">
                <DeleteOutline
                  style={{
                    fontSize: 18,
                    color: "#666",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCell(index);
                  }}
                />
              </Tooltip>
            </div>
            <Collapse
              in={toggleCellSetting[index]}
              style={{
                width: "100%",
                paddingBottom: toggleCellSetting[index] ? 10 : 0,
              }}
            >
              <div className="sidebar-section-itemgroup" style={{ rowGap: 5 }}>
                <div className="sidebar-section-item _full">
                  <Typography gutterBottom className="row-label _long">
                    Input type
                  </Typography>
                  <Selector
                    items={inputTableAggregateCellTypes}
                    selectedValue={cell.inputType}
                    onChange={(v) =>
                      onPreValuesChange(
                        { value: v, property: "inputType" },
                        index
                      )
                    }
                  />
                </div>
                {cell.inputType === "constant" && (
                  <div className="sidebar-section-item _full">
                    <Typography gutterBottom className="row-label">
                      Value
                    </Typography>
                    <InputText
                      size="small"
                      placeholder="%"
                      defaultValue={cell.cellValue}
                      onChange={(e) =>
                        onPreValuesChange(
                          {
                            value: e.target.value,
                            property: "cellValue",
                          },
                          index
                        )
                      }
                    />
                  </div>
                )}
                {cell.inputType === "aggregation" && (
                  <>
                    <div className="sidebar-section-item _full">
                      <Typography gutterBottom className="row-label">
                        Source
                      </Typography>
                      <Selector
                        items={getColumns()}
                        selectedValue={cell.source}
                        onChange={(v) =>
                          onPreValuesChange(
                            { value: v, property: "source" },
                            index
                          )
                        }
                      />
                    </div>
                    <div className={`sidebar-section-item _full`}>
                      <Typography gutterBottom className="row-label">
                        Function
                      </Typography>
                      <Selector
                        items={WORKFLOWS_DATASOURCE_AGGREGATIONS}
                        selectedValue={cell.aggregationFunction}
                        onChange={(v) =>
                          onPreValuesChange(
                            { value: v, property: "aggregationFunction" },
                            index
                          )
                        }
                      />
                    </div>
                  </>
                )}
                {cell.inputType === "computation" && (
                  <div
                    className="sidebar-section-item _full"
                    style={{ border: "dashed 1px" }}
                  >
                    <Selector
                      items={getCells(index)}
                      selectedValue={cell.computedLeftOperand}
                      onChange={(v) =>
                        onPreValuesChange(
                          { value: v, property: "computedLeftOperand" },
                          index
                        )
                      }
                    />
                    <Selector
                      items={computationOperators}
                      selectedValue={cell.computedOperator}
                      width={50}
                      onChange={(v) =>
                        onPreValuesChange(
                          { value: v, property: "computedOperator" },
                          index
                        )
                      }
                    />
                    <Selector
                      items={getCells(index)}
                      selectedValue={cell.computedRightOperand}
                      onChange={(v) =>
                        onPreValuesChange(
                          { value: v, property: "computedRightOperand" },
                          index
                        )
                      }
                    />
                  </div>
                )}
              </div>
            </Collapse>
          </div>
        ))}
      </Collapse>
    </div>
  );
});
export default InputTableAggregate;
