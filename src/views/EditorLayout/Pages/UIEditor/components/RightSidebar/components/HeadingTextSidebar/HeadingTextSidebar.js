import React from "react";
import { Typography, Select, MenuItem, Tooltip } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { useDispatch } from "react-redux";
import Switch from "../PlainToggleSwitch";
import SidebarNameSection from "../components/SidebarNameSection";
import CustomStyleSection from "../components/CustomStyleSection";
import { AddBoxOutlined, DeleteOutline } from "@material-ui/icons";
import { updateScreenItemPropertyValues } from "../../../../utils/uieditorHelpers";
import FormulaBuilderInputTextBox from "../components/FormulaBuilderInputTextBox";
import { useEffect, useState } from "react";

export default function HeadingTextSidebar(props) {
  const {
    values,
    name,
    id,
    itemRef,

    title,
    style,
    type: itemType,
    showStyling,
  } = props;
  const dispatch = useDispatch();
  const regexToMatch = /{{[^{}]+}}/g;
  const [computeConfigurationReference, setComputeConfigurationReference] =
    useState(values?.computeConfigurations);

  const onValuesChange = ({ value, property }) =>
    dispatch(
      updateScreenItemPropertyValues({
        value,
        property,
        type: itemType,
        itemRef,
      })
    );

  const onTextChange = (e) => {
    // if (e.target.value.includes(/,./)) return;
    onValuesChange({ value: e.target.value, property: "value" });
  };

  const onPreValuesChange = ({ value, property }, index) => {
    const computeConfigurationValue = [
      ...(values?.computeConfigurations || []),
    ];
    computeConfigurationValue[index] = {
      ...computeConfigurationValue[index],
      [property]: value,
    };

    setComputeConfigurationReference(computeConfigurationValue);

    //final call
    onValuesChange({
      value: computeConfigurationValue,
      property: "computeConfigurations",
    });
  };

  const onDropdownChange = (value, index) => {
    onPreValuesChange({ value: value, property: "key" }, index);
  };

  const addDropdown = (index) => {
    const computeConfigurationValue = [
      ...(values?.computeConfigurations || []),
    ];

    if (
      computeConfigurationValue?.length >=
      values?.value?.match(regexToMatch)?.length
    )
      return;

    computeConfigurationValue.splice(index + 1, 0, {
      key: "",
      formula: "",
    });

    setComputeConfigurationReference(computeConfigurationValue);

    onValuesChange({
      value: computeConfigurationValue,
      property: "computeConfigurations",
    });
  };

  const deleteDropdown = (index) => {
    if (values?.value?.match(regexToMatch)?.length === 1) return;

    const computeConfigurationValue = [
      ...(values?.computeConfigurations || []),
    ];

    computeConfigurationValue.splice(index, 1);

    setComputeConfigurationReference(computeConfigurationValue);

    onValuesChange({
      value: computeConfigurationValue,
      property: "computeConfigurations",
    });
  };

  const getSelectedValues = () => {
    return (
      values?.computeConfigurations?.map(
        (alreadySelectedvalues) => alreadySelectedvalues?.key
      ) || []
    );
  };

  useEffect(() => {
    if (
      !values?.useFormulaBuilder ||
      values?.computeConfigurations?.length === 0
    ) {
      return;
    }

    let timeoutId;

    // Remove select row and FormulaBuilder if values.key no longer exists
    const computeConfigurationValue = [
      ...(values?.computeConfigurations || []),
    ].filter((config) =>
      values?.value?.match(regexToMatch)?.includes(config.key)
    );

    setComputeConfigurationReference(computeConfigurationValue);

    timeoutId = setTimeout(() => {
      onValuesChange({
        value: computeConfigurationValue,
        property: "computeConfigurations",
      });
    }, 1000); // call this after 1 second

    return () => {
      clearTimeout(timeoutId);
    };
  }, [values?.value]);

  const MyTextInput = () => (
    <TextField
      key={itemRef}
      variant="outlined"
      size="medium"
      fullWidth
      multiline
      rows={9}
      defaultValue={values?.value}
      onBlur={onTextChange}
      InputProps={{
        style: {
          fontFamily: "Inter",
          fontStyle: "normal",
          fontWeight: 400,
          fontSize: 12,
          color: "#091540!important",
          LineHeight: 15.6,
        },
      }}
    />
  );

  return (
    <div className="sidebar-container">
      <SidebarNameSection
        itemRef={itemRef}
        itemId={id}
        itemType={itemType}
        name={name}
        title={title}
      />
      <div className="sidebar-container-scroll">
        {!showStyling ? (
          <>
            <div className="sidebar-section">
              {/* <div className="sidebar-section-item">
                <Typography gutterBottom className="row-label">
                  Formatted?
                </Typography>
                <Switch
                  // itemType="togglehide"
                  value={values?.isFormatted ?? true}
                  checked={values?.isFormatted ?? true}
                  onChange={(v) =>
                    onValuesChange({
                      value: v?.target?.checked,
                      property: "isFormatted",
                    })
                  }
                />
              </div> */}
              <div
                className="sidebar-section-item _full"
                style={{ display: "block" }}
              >
                <Typography
                  gutterBottom
                  className="row-label _long"
                  style={{ margin: "10px 0" }}
                >
                  Text content{" "}
                  <span>
                    (use @ to bind variables and &#123;&#123; &#125;&#125; to
                    compute variables)
                  </span>
                </Typography>
                {MyTextInput()}
              </div>
            </div>

            {values?.value?.match(regexToMatch) && (
              <>
                <div className="sidebar-section _header">
                  Use formula Builder:
                  <Switch
                    value={
                      values?.useFormulaBuilder
                        ? values?.useFormulaBuilder
                        : false
                    }
                    checked={
                      values?.useFormulaBuilder
                        ? values?.useFormulaBuilder
                        : false
                    }
                    onChange={(e) => {
                      onValuesChange({
                        value: e.target.checked,
                        property: "useFormulaBuilder",
                      });
                    }}
                  />
                </div>
              </>
            )}

            {values?.useFormulaBuilder &&
              values?.value?.match(regexToMatch) && (
                <div>
                  <div className="sidebar-section">
                    <Typography
                      className="row-label _long"
                      gutterBottom
                      style={{ fontWeight: 300, fontSize: "12px" }}
                    >
                      Compute values?
                    </Typography>

                    {(!computeConfigurationReference?.length
                      ? new Array(1).fill("")
                      : computeConfigurationReference
                    )?.map((value, index) => (
                      <div>
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: "10px",
                          }}
                          key={index}
                        >
                          <Select
                            size="small"
                            name="hashedValue"
                            required
                            fullWidth
                            value={value?.key || "Default"}
                            onChange={(e) =>
                              onDropdownChange(e.target.value, index)
                            }
                            placeholder={`Enter email sender here`}
                            type="text"
                            variant="outlined"
                            style={{
                              height: "30px",
                            }}
                          >
                            <MenuItem value="Default" disabled>
                              Select computed content
                            </MenuItem>

                            {values?.value
                              ?.match(regexToMatch)
                              ?.map((text, valueIndex, arr) => (
                                <MenuItem
                                  key={valueIndex}
                                  value={text}
                                  disabled={getSelectedValues()?.includes(text)}
                                >
                                  {text}
                                </MenuItem>
                              ))}
                          </Select>

                          {values?.value?.match(regexToMatch)?.length > 1 && (
                            <>
                              <Tooltip title="Add dropdown">
                                <AddBoxOutlined
                                  style={{
                                    fontSize: 18,
                                    color:
                                      values?.computeConfigurations?.length ===
                                      values?.value?.match(regexToMatch)?.length
                                        ? "#AAA"
                                        : "#666",
                                    marginLeft: "auto",
                                    cursor: "pointer",
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addDropdown(index);
                                  }}
                                />
                              </Tooltip>

                              <Tooltip title="Remove dropdown">
                                <DeleteOutline
                                  style={{
                                    fontSize: 18,
                                    color: "#666",
                                    cursor: "pointer",
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteDropdown(index);
                                  }}
                                />
                              </Tooltip>
                            </>
                          )}
                        </div>
                        {value?.key && (
                          <FormulaBuilderInputTextBox
                            itemRef={itemRef}
                            index={index}
                            itemType={itemType}
                            value={value}
                            handleOnBlur={onPreValuesChange}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </>
        ) : (
          <CustomStyleSection
            itemRef={itemRef}
            itemType={itemType}
            items={["heading"]}
            styles={style}
          />
        )}
      </div>
    </div>
  );
}
