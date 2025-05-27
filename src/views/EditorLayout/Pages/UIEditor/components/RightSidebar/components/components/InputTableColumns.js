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
import { errorToastify } from "../../../../../../../common/utils/Toastify";
import Switch from "../PlainToggleSwitch/PlainToggleSwitch";
import FormulaBuilderInputTextBox from "./FormulaBuilderInputTextBox";

export const inputTableColumnTypes = [
  ["text", "Text"],
  ["inputText", "Input text"],
  ["textArea", "Textarea"],
  ["dropdown", "Dropdown"],
  ["dateTime", "Date and time"],
  ["checkbox", "Checkbox"],
  ["radio", "Radio"],
  ["fileUpload", "File upload"],
  ["computed", "Computed"],
];

const inputTableColumnTextTypes = [
  ["text", "Text"],
  ["email", "Email"],
  ["url", "URL"],
  ["password", "Password"],
  ["number", "Number"],
  ["autoNumber", "AutoNumber"],
];

const inputTableColumnTextAlign = [
  ["left", "Left"],
  ["right", "Right"],
  ["center", "Center"],
];

const computationOperators = [
  ["PLUS", "+"],
  ["MINUS", "-"],
  ["MULTIPLY", "x"],
  ["DIVIDE", "÷"],
];

const MIN_COLUMNS = 2;

const InputTableColumns = React.memo(({ values, itemRef, title }) => {
  const notAffectVariables = useRef(true);

  const [showPreferences, setShowPreferences] = useState(false);
  const [newOptionValue, setNewOptionValue] = useState("");
  const [reRenderKey, setReRenderKey] = useState(null);
  const [toggleColumnSetting, setToggleColumnSetting] = useState(
    new Array(values?.columns?.length || 2).fill(false)
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
    const columnNames = value.map((col) => col?.header?.toLowerCase()?.trim());
    if (columnNames.length !== new Set(columnNames).size) {
      errorToastify("Column names must be specified and unique");
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
    const currentColumnsValues = [...(values?.columns || [])];
    currentColumnsValues[index] = {
      ...currentColumnsValues[index],
      [property]: value,
    };

    if (["header", "inputType", "isDynamic"].includes(property)) {
      notAffectVariables.current = false;
    }

    onValuesChange({
      value: currentColumnsValues,
      property: "columns",
    });
  };

  const addColumn = (index) => {
    const currentColumnsValues = [...(values?.columns || [])];
    currentColumnsValues.splice(index + 1, 0, {
      id: v4(),
      header: "",
      inputType: "inputText",
      relWidth: 1,
    });
    notAffectVariables.current = false;
    onValuesChange({
      value: currentColumnsValues,
      property: "columns",
    });
  };

  const deleteColumn = (index) => {
    const currentColumnsValues = [...(values?.columns || [])];
    if (currentColumnsValues.length <= MIN_COLUMNS) {
      return;
    }

    currentColumnsValues.splice(index, 1);
    notAffectVariables.current = false;
    onValuesChange({
      value: currentColumnsValues,
      property: "columns",
    });
  };

  const getColumns = (exemptionIndex) =>
    values?.columns
      ?.map((column, index) => [
        column?.id,
        column?.header || `Column-${index + 1}`,
      ])
      .filter((column, index) => index !== exemptionIndex);

  const updateCellOptions = (
    options = [],
    colIndex,
    actionType,
    optionIndex,
    e
  ) => {
    const { value } = e?.target || {};

    switch (actionType) {
      case "add":
        options.push(newOptionValue);
        setNewOptionValue("");
        setReRenderKey(v4());
        break;

      case "delete":
        options.splice(optionIndex, 1);
        break;

      case "edit":
        options[optionIndex] = value;
        break;

      default:
        break;
    }

    onPreValuesChange({ value: options, property: "cellOptions" }, colIndex);
  };

  return (
    <div className="sidebar-section">
      <div
        className="sidebar-section-header"
        onClick={() => setShowPreferences((prev) => !prev)}
      >
        <Typography>{title} columns</Typography>
        <span>{`[${showPreferences ? "-" : "+"}]`}</span>
      </div>

      <Collapse in={showPreferences}>
        <div style={{ padding: 8 }}></div>
        {(values?.columns || new Array(2).fill("")).map((column, index) => (
          <>
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
                const toggleState = new Array(toggleColumnSetting.length).fill(
                  false
                );
                toggleState[index] = !toggleColumnSetting[index];
                setToggleColumnSetting(toggleState);
              }}
            >
              <div>
                <ArrowDropDown />
              </div>
              <div style={{ width: 150 }}>
                <Input
                  value={column?.header}
                  placeholder={`Column-${index + 1}`}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  onChange={(e) =>
                    onPreValuesChange(
                      { value: e.target.value, property: "header" },
                      index
                    )
                  }
                />
              </div>
              <Tooltip title="Add column below">
                <AddBoxOutlined
                  style={{
                    fontSize: 18,
                    color: "#666",
                    marginLeft: "auto",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    addColumn(index);
                  }}
                />
              </Tooltip>
              <Tooltip title="Remove column">
                <DeleteOutline
                  style={{
                    fontSize: 18,
                    color:
                      values?.columns?.length > MIN_COLUMNS ? "#666" : "#AAA",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteColumn(index);
                  }}
                />
              </Tooltip>
            </div>
            <Collapse
              in={toggleColumnSetting[index]}
              style={{
                width: "100%",
                paddingBottom: toggleColumnSetting[index] ? 10 : 0,
              }}
            >
              <div className="sidebar-section-itemgroup" style={{ rowGap: 5 }}>
                <div className="sidebar-section-item _full">
                  <Typography gutterBottom className="row-label _long">
                    Input type
                  </Typography>
                  <Selector
                    items={inputTableColumnTypes}
                    selectedValue={column?.inputType}
                    onChange={(v) =>
                      onPreValuesChange(
                        { value: v, property: "inputType" },
                        index
                      )
                    }
                  />
                </div>
                {!["fileUpload", "computed"].includes(column?.inputType) && (
                  <div className="sidebar-section-item _full">
                    <Typography
                      gutterBottom
                      className="row-label"
                      style={{ width: "unset" }}
                    >
                      Make column dynamic?
                    </Typography>
                    <Switch
                      value={column?.isDynamic}
                      checked={column?.isDynamic}
                      onChange={(e) => {
                        onPreValuesChange(
                          {
                            value: e?.target?.checked,
                            property: "isDynamic",
                          },
                          index
                        );
                      }}
                    />
                  </div>
                )}
                {column?.inputType === "textArea" && (
                  <div
                    className="sidebar-section-item _full"
                    style={{ border: "dashed 1px" }}
                  >
                    <Typography gutterBottom className="row-label">
                      Rows:
                    </Typography>

                    <InputText
                      type="number"
                      size="small"
                      placeholder="Number of rows"
                      defaultValue={column.textAreaNumRows || 4}
                      onBlur={(e) =>
                        onPreValuesChange(
                          {
                            value: e?.target?.value,
                            property: "textAreaNumRows",
                          },
                          index
                        )
                      }
                    />
                  </div>
                )}

                {/* dropdownSelect to be deprecated */}
                {["dropdown", "dropdownSelect", "checkbox", "radio"].includes(
                  column?.inputType
                ) && (
                  <div
                    className="sidebar-section-item _full"
                    style={{
                      border: "dashed 1px",
                      backgroundColor: column.isDynamic
                        ? "#eeeeee"
                        : "transparent",
                    }}
                  >
                    <div>
                      <Typography
                        gutterBottom
                        className="row-label"
                        style={{ width: "unset" }}
                      >
                        Select options:
                      </Typography>

                      <div
                        style={{
                          display: "flex",
                          gap: 10,
                          alignItems: "center",
                          borderBottom: "dashed 1px #ccc",
                          paddingBottom: 5,
                          marginBottom: 5,
                          marginTop: 5,
                        }}
                      >
                        <div>
                          <Input
                            key={reRenderKey}
                            defaultValue={newOptionValue}
                            onChange={(e) => setNewOptionValue(e.target.value)}
                            disabled={column.isDynamic}
                          />
                        </div>
                        <div
                          onClick={() =>
                            column?.isDynamic
                              ? {}
                              : updateCellOptions(
                                  column.cellOptions,
                                  index,
                                  "add"
                                )
                          }
                          style={{ cursor: "pointer" }}
                        >
                          [ + ]
                        </div>
                      </div>
                      <div>
                        {column.cellOptions?.map((option, index) => (
                          <div key={index}>
                            <span>
                              <Input
                                key={index}
                                value={option}
                                disabled={column.isDynamic}
                                onChange={(e) =>
                                  updateCellOptions(
                                    column.cellOptions,
                                    index,
                                    "edit",
                                    index,
                                    e
                                  )
                                }
                              />
                            </span>
                            <span
                              onClick={() =>
                                column?.isDynamic
                                  ? {}
                                  : updateCellOptions(
                                      column.cellOptions,
                                      index,
                                      "delete",
                                      index
                                    )
                              }
                              style={{ marginLeft: 10, cursor: "pointer" }}
                            >
                              [ x ]
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {column?.inputType === "computed" && (
                  <>
                    <div className="sidebar-section-item _full">
                      <Typography
                        gutterBottom
                        className="row-label"
                        style={{ width: "unset" }}
                      >
                        Use formula builder?
                      </Typography>
                      <Switch
                        value={column?.useFormulaBuilder}
                        checked={column?.useFormulaBuilder}
                        onChange={(e) => {
                          onPreValuesChange(
                            {
                              value: e?.target?.checked,
                              property: "useFormulaBuilder",
                            },
                            index
                          );
                        }}
                      />
                    </div>
                    {column?.useFormulaBuilder ? (
                      <FormulaBuilderInputTextBox
                        itemRef={itemRef}
                        index={index}
                        itemType={"inputTable"}
                        value={column}
                        handleOnBlur={onPreValuesChange}
                      />
                    ) : (
                      <div
                        className="sidebar-section-item _full"
                        style={{ border: "dashed 1px" }}
                      >
                        <Selector
                          items={getColumns(index)}
                          selectedValue={column?.computedLeftOperand}
                          onChange={(v) =>
                            onPreValuesChange(
                              { value: v, property: "computedLeftOperand" },
                              index
                            )
                          }
                        />
                        <Selector
                          items={computationOperators}
                          selectedValue={column?.computedOperator}
                          width={50}
                          onChange={(v) =>
                            onPreValuesChange(
                              { value: v, property: "computedOperator" },
                              index
                            )
                          }
                        />
                        <Selector
                          items={getColumns(index)}
                          selectedValue={column?.computedRightOperand}
                          onChange={(v) =>
                            onPreValuesChange(
                              { value: v, property: "computedRightOperand" },
                              index
                            )
                          }
                        />
                      </div>
                    )}
                  </>
                )}
                <div className="sidebar-section-item">
                  <Typography gutterBottom className="row-label _long">
                    Rel. width
                  </Typography>
                  <InputText
                    size="small"
                    placeholder="1"
                    defaultValue={column?.relWidth}
                    onChange={(e) =>
                      onPreValuesChange(
                        {
                          value: e.target.value,
                          property: "relWidth",
                        },
                        index
                      )
                    }
                  />
                </div>
                <div className="sidebar-section-item">
                  <Typography gutterBottom className="row-label _long">
                    Required?
                  </Typography>

                  <Switch
                    checked={column?.required}
                    value={column?.required}
                    onChange={(e) =>
                      onPreValuesChange(
                        {
                          value: e.target.checked,
                          property: "required",
                        },
                        index
                      )
                    }
                  />
                </div>
                {["inputText"].includes(column?.inputType) && (
                  <div className="sidebar-section-item">
                    <Typography gutterBottom className="row-label _long">
                      Text type?
                    </Typography>

                    <Selector
                      items={inputTableColumnTextTypes}
                      selectedValue={column?.inputTextType ?? "text"}
                      onChange={(v) =>
                        onPreValuesChange(
                          { value: v, property: "inputTextType" },
                          index
                        )
                      }
                    />
                  </div>
                )}
                {["inputText"].includes(column?.inputType) && (
                  <div className="sidebar-section-item">
                    <Typography gutterBottom className="row-label _long">
                      Text Alignment
                    </Typography>

                    <Selector
                      items={inputTableColumnTextAlign}
                      selectedValue={column?.inputTextAlign ?? "left"}
                      onChange={(v) =>
                        onPreValuesChange(
                          { value: v, property: "inputTextAlign" },
                          index
                        )
                      }
                    />
                  </div>
                )}
              </div>
            </Collapse>
          </>
        ))}
      </Collapse>
    </div>
  );
});
export default InputTableColumns;
