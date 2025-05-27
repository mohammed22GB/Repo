import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Button,
  Collapse,
  InputAdornment,
  InputBase,
  MenuItem,
  Select,
  Typography,
  TextField,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import Selector from "../../Selector";
import Switch from "../../PlainToggleSwitch";
import { updateScreenItemPropertyValues } from "../../../../../utils/uieditorHelpers";
import { errorToastify } from "../../../../../../../../common/utils/Toastify";
import { saveAsset } from "../../../../../utils/screenAPIs";
import { allCountries } from "../../../../../../../../common/utils/lists";
import CustomNameSwitch from "../../../../../../../../common/components/CustomNameSwitch/CustomNameSwitch";
import {
  allOperators,
  ConditionalOperators,
} from "../../../../../../Workflow/components/utils/constants";
import {
  GENERAL_DEFAULT_DATE_FORMAT,
  workflowScreenVariableFieldTypes,
} from "../../../../../../../../common/utils/constants";
import FormulaBuilderInputTextBox from "../FormulaBuilderInputTextBox";

const MAX_FILE_SRC_MBSIZE = 2;

const durationMeasureList = [
  ["hour", "Hours"],
  ["day", "Days"],
  ["month", "Month"],
  ["year", "Years"],
];

const SidebarFieldPreferenceSection = React.memo(
  ({
    itemType,
    hasName,
    // propses: { name, itemRef,  containingChildIndex },
    id,
    itemRef,
    name,
    title,
    values,
    dataType,
    showStyling,
    // onValuesChange,
    // onTypeChange,
    fileUploadFilesSelection,
    isDynamic,
    setIsDynamic,
    defaultPhoneCountries,
    updateData,
    isPage,
    ...props
  }) => {
    /* These are defined within the component for to update values */
    const dateFormatsList = [
      ["DD-MM-YYYY", moment().format("DD-MM-YYYY")],
      ["YYYY-MM-DD", moment().format("YYYY-MM-DD")],
      ["MM-DD-YYYY", moment().format("MM-DD-YYYY")],
      ["MMM-DD-YYYY", moment().format("MMM-DD-YYYY")],
      ["MMMM Do, YYYY", moment().format("MMMM Do, YYYY")],
      ["Do MMMM, YYYY", moment().format("Do MMMM, YYYY")],
      ["MMMM, YYYY", moment().format("MMMM, YYYY")],
    ];
    const timeFormatsList = [
      ["12", moment().format("hh:mm a")],
      ["24", moment().format("HH:mm")],
    ];

    const [showPreferences, setShowPreferences] = useState(false);
    const [autoValue, setAutoValue] = useState({ pre: "", seqL: "" });
    const [inputTypes, setInputTypes] = useState([
      ["text", "Text"],
      ["email", "Email"],
      ["url", "URL"],
      ["password", "Password"],
      ["number", "Number"],
      ["autoNumber", "AutoNumber"],
    ]);

    const { screensItems } = useSelector(({ uieditor }) => uieditor);
    const { activeScreen } = useSelector(({ screens }) => screens);

    const filteredItems = [];
    Object.keys(screensItems?.[activeScreen?.id] || {}).forEach((itemId) => {
      const item = screensItems?.[activeScreen?.id]?.[itemId];
      if (workflowScreenVariableFieldTypes.includes(item?.type)) {
        filteredItems.push(item);
      }
    });

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

    const dispatch = useDispatch();

    useEffect(() => {
      if (!setIsDynamic) {
        return;
      }

      if (name?.length > 1 && name.startsWith("@")) {
        setIsDynamic(true);
      } else {
        setIsDynamic(false);
      }
    }, [name]);

    useEffect(() => {
      const clearPreviousValueSrcOnDynamicChange = setTimeout(() => {
        if (
          ["image"].includes(itemType) &&
          name?.startsWith("@") &&
          isDynamic
        ) {
          onValuesChange({
            value: "",
            property: "src",
          });
        }
      }, 2000);

      // Clean up the timeout if the component unmounts or if the dependency changes before the timeout completes
      return () => clearTimeout(clearPreviousValueSrcOnDynamicChange);
    }, [name]);

    useEffect(() => {
      if (
        [
          "dropdown",
          "checkbox",
          "radio",
          "inputText",
          "image",
          "displayTable",
        ].includes(itemType)
      ) {
        let newName;
        if (isDynamic) {
          newName = !name ? "" : name?.startsWith("@") ? name : "@" + name;
        } else {
          newName = !name
            ? ""
            : name?.startsWith("@")
            ? name?.substring(1)
            : name;
        }

        if (name === newName) {
          return;
        }
        const value = newName;

        return dispatch(
          updateScreenItemPropertyValues({
            property: "name",
            value,
            itemRef,
            isRootValue: true,
          })
        );
      }
    }, [isDynamic]);

    const onValuesChange = ({ value, root, property, e, isRootValue }) => {
      e?.persist();

      const notAffectVariables = !["hasDuration", "setRange"].includes(
        property
      );

      dispatch(
        updateScreenItemPropertyValues({
          value,
          property,
          root,
          itemRef,
          type: itemType,
          isPage,
          isRootValue,
          notAffectVariables,
        })
      );
    };

    const onDataChange = ({ value, root, action }) =>
      dispatch(
        updateData({
          value,
          root,
          action,
          id,
          itemRef,

          type: itemType,
        })
      );
    const onFileChange = async (e) => {
      const bodyFormData = new FormData();
      const files = e.target.files;

      if (files.length > 1) {
        errorToastify(`You can only select 1 file`);
        return;
      }
      for (let i = 0; i < files.length; i++) {
        if (files[i].size < parseInt(MAX_FILE_SRC_MBSIZE) * 1024 * 1024) {
          bodyFormData.append("file", files[i]);
        } else {
          errorToastify(
            `${files[i].name} is greater than ${MAX_FILE_SRC_MBSIZE}MB `
          );
        }
      }

      const resp = await saveAsset(bodyFormData);
      const retUrl = resp?.data?.[0]?.url;

      onValuesChange({ value: retUrl, property: "src" });
    };
    const onImageUpload = async (e) => {
      const imagefile = e.target.files[0];
      if (imagefile.size < parseInt(MAX_FILE_SRC_MBSIZE) * 1024 * 1024) {
        let reader = new FileReader();
        reader.readAsDataURL(imagefile);
        reader.onload = function () {
          onValuesChange({ value: reader.result, property: "src" });
        };
        reader.onerror = function (error) {};
      } else {
        errorToastify(
          `${imagefile.name} is greater than ${MAX_FILE_SRC_MBSIZE}MB `
        );
      }
    };

    const changeImageSourceOption = (e) => {
      e.persist();

      onValuesChange({
        value: e.target.value,
        property: "imageSource",
      });

      setTimeout(() => {
        onValuesChange({
          value: "",
          property: "src",
        });
      }, 2000);
    };

    const units = [
      ["px", "px"],
      ["%", "%"],
    ];

    const digits = [
      ["01", "01"],
      ["001", "001"],
      ["0001", "0001"],
      ["00001", "00001"],
      ["000001", "000001"],
      ["0000001", "0000001"],
    ];

    const align = [
      ["left", "Left"],
      ["center", "Center"],
      ["right", "Right"],
    ];

    const uploadTypes = [
      ["*", "Any"],
      ["text/plain", "Text"],
      ["audio/*", "Audio"],
      ["video/*", "Video"],
      ["image/*", "Image"],
      ["application/pdf", "PDF"],
      ["image/*, application/pdf", "Image/PDF"],
    ];

    const arrangementOptions = [
      ["vertical", "Vertical"],
      ["horizontal", "Horizontal"],
    ];

    const userPickerTypes = [
      ["users", "Users"],
      ["userGroups", "User groups"],
      ["both", "Both"],
    ];
    const userPickerSelectTypes = [
      ["single", "Single"],
      ["multiple", "Multiple"],
    ];

    const pageEdgeModeSelection = [
      ["shadow", "Shadow"],
      ["border", "Border"],
    ];

    const imageDropdown = [
      ["uploadImage", "Upload image"],
      ["imageURL", "Image URL"],
    ];
    // useEffect(() => {
    //   if (itemType === "inputText") {
    //     setInputTypes((prev) => [...prev, ["autoNumber", "AutoNumber"]]);
    //   }
    // }, [itemType]);

    const MyTextInput = ({ pptyName = "value" }) => {
      return (
        <InputText
          size="small"
          fullWidth
          multiline
          rows={pptyName === "pageHeaderText" ? 2 : 9}
          defaultValue={
            pptyName === "pageHeaderText"
              ? values?.page?.[pptyName]
              : values?.[pptyName]
          }
          onBlur={(v) =>
            onValuesChange({
              value: v.target.value,
              property: pptyName,
              e: v,
              ...(pptyName === "pageHeaderText" ? { root: "page" } : {}),
            })
          }
          /* InputProps={{
      style: {
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: 12,
        color: "#091540!important",
        LineHeight: 15.6,
      },
    }} */
        />
      );
    };

    const getSampleDateTimeValue = () => {
      const arr = [];
      if (values?.showDate) {
        arr.push(values?.dateFormat || GENERAL_DEFAULT_DATE_FORMAT);
      }
      if (values?.showTime) {
        arr.push(values?.timeFormat == "12" ? "hh:mm a" : "HH:mm");
      }
      const arrString = arr.join(" | ");
      const retValue = `Sample data: ${moment().format(arrString)}`;

      return retValue;
    };

    return (
      <div className="sidebar-section">
        <div
          className="sidebar-section-header"
          onClick={() => setShowPreferences((prev) => !prev)}
        >
          <Typography>Component preferences</Typography>
          <span>{`[${showPreferences ? "-" : "+"}]`}</span>
        </div>

        <Collapse in={showPreferences}>
          <div style={{ padding: 8 }}></div>

          <div className="sidebar-section-itemgroup">
            {["header"].includes(itemType) && (
              <div
                className="sidebar-section-item _full"
                style={{ display: "block" }}
              >
                <Typography
                  gutterBottom
                  className="row-label _long"
                  style={{ margin: "10px 0" }}
                >
                  Text content <span>(use @ to bind variables)</span>
                </Typography>
                <MyTextInput />
              </div>
            )}
            {["dateTime"].includes(itemType) && (
              <div className="sidebar-section-item">
                <Typography gutterBottom className="row-label _long">
                  Show date?:
                </Typography>

                <Switch
                  itemType="togglehide"
                  value={values?.showDate}
                  checked={values?.showDate}
                  disabled={!values?.showTime && values?.showDate}
                  toggleHide={(v) =>
                    onValuesChange({ value: v, property: "showDate" })
                  }
                />
              </div>
            )}
            {["dateTime"].includes(itemType) && (
              <div className="sidebar-section-item">
                <Typography gutterBottom className="row-label">
                  Format:
                </Typography>

                <Selector
                  items={dateFormatsList}
                  disabled={!values?.showDate}
                  onChange={(v) =>
                    onValuesChange({ value: v, property: "dateFormat" })
                  }
                  selectedValue={
                    values?.dateFormat || GENERAL_DEFAULT_DATE_FORMAT
                  }
                />
              </div>
            )}
            {["dateTime"].includes(itemType) && (
              <div className="sidebar-section-item">
                <Typography gutterBottom className="row-label _long">
                  Show time?:
                </Typography>

                <Switch
                  itemType="togglehide"
                  value={values?.showTime}
                  checked={values?.showTime}
                  disabled={!values?.showDate && values?.showTime}
                  toggleHide={(v) =>
                    onValuesChange({ value: v, property: "showTime" })
                  }
                />
              </div>
            )}
            {["dateTime"].includes(itemType) && (
              <>
                <div className="sidebar-section-item">
                  <Typography gutterBottom className="row-label">
                    Format:
                  </Typography>

                  <Selector
                    items={timeFormatsList}
                    disabled={!values?.showTime}
                    onChange={(v) =>
                      onValuesChange({ value: v, property: "timeFormat" })
                    }
                    selectedValue={values?.timeFormat || "24"}
                  />
                </div>
                <div
                  className="sidebar-section-item _full"
                  style={{
                    border: "dashed 1px #aaa",
                    backgroundColor: "#f8f8f8",
                    minHeight: 25,
                    justifyContent: "center",
                  }}
                >
                  <Typography gutterBottom className="row-label _long">
                    {getSampleDateTimeValue()}
                  </Typography>
                </div>
              </>
            )}
            {["dateTime"].includes(itemType) && (
              <>
                <div className="sidebar-section-item _full">
                  <Typography gutterBottom className="row-label _long">
                    Set range? (
                    {!values?.rangeStartId ? (
                      <span style={{ color: "red" }}>re-add component</span>
                    ) : (
                      "use start / end date fields"
                    )}
                    ):
                  </Typography>

                  <Switch
                    name={`setRange-${itemRef}`}
                    itemId={id} //  added to update state
                    itemType="togglehide"
                    value={values?.setRange}
                    checked={values?.setRange}
                    disabled={!values?.rangeStartId}
                    toggleHide={(v) =>
                      onValuesChange({ value: v, property: "setRange" })
                    }
                  />
                </div>
                {values?.setRange && (
                  <>
                    <div className="sidebar-section-item">
                      <Typography gutterBottom className="row-label _long">
                        Duration?:
                      </Typography>

                      <Switch
                        name={`hasDuration-${itemRef}`}
                        itemType="togglehide"
                        value={values?.hasDuration}
                        checked={values?.hasDuration}
                        disabled={!values?.showDate && values?.hasDuration}
                        toggleHide={(v) =>
                          onValuesChange({ value: v, property: "hasDuration" })
                        }
                      />
                    </div>
                    {values?.hasDuration && (
                      <>
                        <div className="sidebar-section-item">
                          <Typography gutterBottom className="row-label _long">
                            Measure:
                          </Typography>

                          <Selector
                            items={durationMeasureList}
                            disabled={!values?.hasDuration}
                            onChange={(v) =>
                              onValuesChange({
                                value: v,
                                property: "durationMeasure",
                              })
                            }
                            selectedValue={values?.durationMeasure || "hour"}
                          />
                        </div>
                        {["day", "month", "year"].includes(
                          values?.durationMeasure
                        ) && (
                          <div className="sidebar-section-item">
                            <Typography
                              gutterBottom
                              className="row-label _long"
                            >
                              Days inclusive?:
                            </Typography>

                            <Switch
                              itemType="togglehide"
                              value={values?.rangeInclusive}
                              checked={values?.rangeInclusive}
                              disabled={
                                !values?.hasDuration && values?.rangeInclusive
                              }
                              toggleHide={(v) =>
                                onValuesChange({
                                  value: v,
                                  property: "rangeInclusive",
                                })
                              }
                            />
                          </div>
                        )}
                      </>
                    )}
                    <div className="sidebar-section-item">
                      <Typography gutterBottom className="row-label _long">
                        Stack range?
                      </Typography>
                      <Switch
                        // itemType="togglehide"
                        value={!(values?.stackRange === false)}
                        checked={!(values?.stackRange === false)}
                        onChange={(v) =>
                          onValuesChange({
                            value: v?.target?.checked,
                            property: "stackRange",
                          })
                        }
                      />
                    </div>
                  </>
                )}
              </>
            )}
            {["dateTime"].includes(itemType) && (
              <div className="sidebar-section-item">
                <Typography gutterBottom className="row-label _long">
                  Stack date/time?
                </Typography>
                <Switch
                  // itemType="togglehide"
                  value={values?.stacked}
                  checked={values?.stacked}
                  onChange={(v) =>
                    onValuesChange({
                      value: v?.target?.checked,
                      property: "stacked",
                    })
                  }
                />
              </div>
            )}
            {["fileUpload", "signature"].includes(itemType) && (
              <div className="sidebar-section-item _full">
                <Typography gutterBottom className="row-label">
                  Text:
                </Typography>

                <InputText
                  size="small"
                  placeholder="Enter button text"
                  defaultValue={values?.buttonText}
                  onBlur={(e) =>
                    onValuesChange({
                      value: e.target.value,
                      property: "buttonText",
                    })
                  }
                />
              </div>
            )}
            {[
              "inputText",
              "dropdown",
              "checkbox",
              "radio",
              "fileUpload",
            ].includes(itemType) && (
              <div
                className={`sidebar-section-item ${
                  dataType === "autoNumber" ? "_full" : ""
                }`}
              >
                <Typography gutterBottom className="row-label">
                  Type:
                </Typography>

                <Selector
                  items={itemType === "fileUpload" ? uploadTypes : inputTypes}
                  onChange={(v) => {
                    onValuesChange({
                      value: v,
                      property:
                        itemType === "fileUpload" ? "fileType" : "dataType",
                      isRootValue: itemType !== "fileUpload",
                    });
                  }}
                  selectedValue={
                    itemType === "fileUpload" ? values.fileType : dataType
                  }
                />
              </div>
            )}
            {["checkbox", "radio"].includes(itemType) && (
              <>
                <div className={`sidebar-section-item`}>
                  <Typography gutterBottom className="row-label">
                    Arrange:
                  </Typography>

                  <Selector
                    items={arrangementOptions}
                    onChange={(value) =>
                      onValuesChange({
                        value,
                        property: "optionsArrangement",
                      })
                    }
                    selectedValue={values.optionsArrangement || "vertical"}
                  />
                </div>

                {values.optionsArrangement === "horizontal" && (
                  <div className={`sidebar-section-item`}>
                    <Typography gutterBottom className="row-label">
                      Columns:
                    </Typography>

                    <InputText
                      size="small"
                      placeholder="Max. items/row"
                      type="number"
                      defaultValue={values?.maxOptionsPerRow || 2}
                      onBlur={(e) => {
                        onValuesChange({
                          value: e.target.value,
                          property: "maxOptionsPerRow",
                        });
                      }}
                    />
                  </div>
                )}
              </>
            )}
            {["userPicker"].includes(itemType) && (
              <div
                className={`sidebar-section-item ${
                  dataType === "autoNumber" ? "_full" : ""
                }`}
              >
                <Typography gutterBottom className="row-label">
                  Data:
                </Typography>

                <Selector
                  items={userPickerTypes}
                  onChange={(value) =>
                    onValuesChange({
                      value,
                      property: "dataType",
                    })
                  }
                  selectedValue={values.dataType}
                />
              </div>
            )}
            {["userPicker"].includes(itemType) && (
              <div
                className={`sidebar-section-item ${
                  dataType === "autoNumber" ? "_full" : ""
                }`}
              >
                <Typography gutterBottom className="row-label">
                  Select:
                </Typography>

                <Selector
                  items={userPickerSelectTypes}
                  onChange={(value) =>
                    onValuesChange({
                      value,
                      property: "multiple",
                    })
                  }
                  selectedValue={values.multiple}
                />
              </div>
            )}
            {dataType === "autoNumber" && (
              <div className="sidebar-section-item _full">
                <Typography gutterBottom className="row-label">
                  Digits:
                </Typography>
                <Selector
                  items={digits}
                  onChange={(e) => {
                    onValuesChange({
                      value: e,
                      property: "sequenceLength",
                    });
                    //setAutoValue({ ...autoValue, seqL: e });
                  }}
                  selectedValue={values?.sequenceLength}
                />
              </div>
            )}
            {dataType === "autoNumber" && (
              <div className="sidebar-section-item _full">
                <Typography gutterBottom className="row-label">
                  Prefix:
                </Typography>

                <InputText
                  size="small"
                  placeholder="Enter prefix"
                  defaultValue={values?.sequencePrefix}
                  onBlur={(e) => {
                    onValuesChange({
                      value: e.target.value,
                      property: "sequencePrefix",
                    });
                    //setAutoValue({ ...autoValue, pre: e.target.value });
                  }}
                />
              </div>
            )}
            {["textArea"].includes(itemType) && (
              <div className="sidebar-section-item">
                <Typography gutterBottom className="row-label">
                  Rows:
                </Typography>

                <InputText
                  size="small"
                  placeholder="Enter button text"
                  defaultValue={values?.rows}
                  onBlur={(e) =>
                    onValuesChange({
                      value: e.target.value,
                      property: "rows",
                    })
                  }
                />
              </div>
            )}
            {["inputText", "textArea"].includes(itemType) &&
              dataType !== "autoNumber" && (
                <div className="sidebar-section-item">
                  <Typography gutterBottom className="row-label _long">
                    Limit characters?
                  </Typography>
                  <Switch
                    itemType="togglehide"
                    value={values?.limitCharacter}
                    checked={values?.limitCharacter}
                    toggleHide={(v) =>
                      onValuesChange({ value: v, property: "limitCharacter" })
                    }
                  />
                </div>
              )}
            {values?.limitCharacter && (
              <div className="sidebar-section-item">
                <Typography gutterBottom className="row-label">
                  Min.:
                </Typography>
                <InputText
                  size="small"
                  placeholder={values?.min}
                  defaultValue={values?.min}
                  onBlur={(v) =>
                    onValuesChange({
                      value: v.target.value,
                      property: "min",
                    })
                  }
                />
              </div>
            )}
            {values?.limitCharacter && (
              <div className="sidebar-section-item">
                <Typography gutterBottom className="row-label">
                  Max.:
                </Typography>
                <InputText
                  size="small"
                  placeholder={values?.max}
                  defaultValue={values?.max}
                  onBlur={(v) =>
                    onValuesChange({
                      value: v.target.value,
                      property: "max",
                    })
                  }
                />
              </div>
            )}
            {["phoneNumber"].includes(itemType) && (
              <div className="sidebar-section-item">
                <Typography gutterBottom className="row-label _long">
                  Hide country?
                </Typography>
                <Switch
                  itemType="togglehide"
                  value={values?.hideCountry}
                  checked={values?.hideCountry}
                  toggleHide={(v) =>
                    onValuesChange({ value: v, property: "hideCountry" })
                  }
                />
              </div>
            )}
            {["phoneNumber"].includes(itemType) && (
              <div className="sidebar-section-item">
                <Typography gutterBottom className="row-label _long">
                  Default ctry
                </Typography>
                <Selector
                  items={allCountries.map((ctry) => [ctry.code, ctry.name])}
                  // disabled={values?.hideCountry}
                  onChange={(v) =>
                    onValuesChange({ value: v, property: "defaultCountry" })
                  }
                  selectedValue={values?.defaultCountry}
                />
              </div>
            )}
            {!["screen", "text", "header", "heading", "image"].includes(
              itemType
            ) &&
              dataType !== "autoNumber" && (
                <div className="sidebar-section-item">
                  <Typography gutterBottom className="row-label _long">
                    Required?
                  </Typography>
                  <Switch
                    // itemType="togglehide"
                    value={values?.required === true}
                    checked={values?.required === true}
                    onChange={(v) =>
                      onValuesChange({
                        value: v?.target?.checked,
                        property: "required",
                      })
                    }
                    // toggleHide={(v) =>
                    //     onValuesChange({ value: v, property: "required" })
                    //   }
                  />
                </div>
              )}
            {["screen"].includes(itemType) && (
              <div className="sidebar-section-item">
                <Typography gutterBottom className="row-label _long">
                  Page columns
                </Typography>
                <InputText
                  disabled
                  size="small"
                  placeholder={1}
                  defaultValue={values?.page?.pageColumns || 1}
                  onBlur={(v) =>
                    onValuesChange({
                      value: v.target.value,
                      property: "pageColumns",
                      root: "page",
                    })
                  }
                />
              </div>
            )}
            {["screen"].includes(itemType) && (
              <div className="sidebar-section-item">
                <Typography gutterBottom className="row-label _long">
                  Edge mode
                </Typography>
                <Selector
                  items={pageEdgeModeSelection}
                  onChange={(v) =>
                    onValuesChange({
                      value: v,
                      property: "edgeMode",
                      root: "page",
                    })
                  }
                  selectedValue={values?.page?.edgeMode || "border"}
                />
              </div>
            )}
            {["screen"].includes(itemType) && (
              <>
                <div className="sidebar-section-item _full">
                  <Typography gutterBottom className="row-label _long">
                    Add page header to screen?
                  </Typography>
                  <Switch
                    value={values?.page?.pageHasHeader}
                    checked={values?.page?.pageHasHeader}
                    onChange={(evt) =>
                      onValuesChange({
                        value: evt?.target?.checked,
                        property: "pageHasHeader",
                        root: "page",
                      })
                    }
                  />
                </div>

                {values?.page?.pageHasHeader && (
                  <div
                    className="sidebar-section-item _full"
                    style={{ display: "block" }}
                  >
                    <Typography
                      gutterBottom
                      className="row-label _long"
                      style={{ margin: "10px 0" }}
                    >
                      Text content <span>(use @ to bind variables)</span>
                    </Typography>
                    <MyTextInput pptyName="pageHeaderText" />
                  </div>
                )}
              </>
            )}
            <div
              className={`sidebar-section-item ${
                dataType === "autoNumber" ? "_full" : ""
              }`}
            >
              <Typography gutterBottom className="row-label">
                Conditional?:
              </Typography>

              <Switch
                // itemType="togglehide"
                value={values?.conditionals}
                checked={values?.conditionals}
                onChange={(v) =>
                  onValuesChange({
                    value: v?.target?.checked,
                    property: "conditionals",
                  })
                }
                // toggleHide={(v) =>
                //     onValuesChange({ value: v, property: "required" })
                //   }
              />
            </div>
            {values?.conditionals && (
              <div className={`sidebar-section-item _full`}>
                <Typography gutterBottom className="row-label _long">
                  Conditional element:
                </Typography>

                <Select
                  variant="outlined"
                  onChange={(e) =>
                    onValuesChange({
                      value: e.target.value,
                      property: "conditionalElement",
                    })
                  }
                  value={values?.conditionalElement || ""}
                  style={{}}
                >
                  {filteredItems?.map(
                    (child, index) =>
                      child?.name && (
                        <MenuItem
                          key={index}
                          value={child?.itemRef}
                          style={{
                            paddingLeft: 12,
                            paddingRight: 12,
                            paddingTop: 1,
                            paddingBottom: 2,
                            fontSize: 10,
                            fontWeight: 300,
                          }}
                        >
                          {child?.name}
                        </MenuItem>
                      )
                  )}
                </Select>
              </div>
            )}
            {values?.conditionals && (
              <div className={`sidebar-section-item _full`}>
                <Typography gutterBottom className="row-label _long">
                  Where:
                </Typography>

                <Select
                  variant="outlined"
                  onChange={(e) =>
                    onValuesChange({
                      value: e.target.value,
                      property: "conditionalOperator",
                    })
                  }
                  value={values?.conditionalOperator || ""}
                  style={{}}
                >
                  {ConditionalOperators?.map(
                    ({ value, symbol, title }, index) => (
                      <MenuItem
                        key={index}
                        value={value}
                        style={{
                          paddingLeft: 12,
                          paddingRight: 12,
                          paddingTop: 1,
                          paddingBottom: 2,
                          fontSize: 10,
                          fontWeight: 300,
                        }}
                      >
                        {symbol + title}
                      </MenuItem>
                    )
                  )}
                </Select>

                {![allOperators.IS_EMPTY, allOperators.NOT_EMPTY].includes(
                  values?.conditionalOperator
                ) && (
                  <InputText
                    size="small"
                    placeholder="Type in text"
                    defaultValue={values?.conditionalValue}
                    onBlur={(e) =>
                      onValuesChange({
                        value: e.target.value,
                        property: "conditionalValue",
                      })
                    }
                  />
                )}
              </div>
            )}
            {["userPicker"].includes(itemType) && dataType !== "autoNumber" && (
              <div className="sidebar-section-item">
                <Typography gutterBottom className="row-label _long">
                  Read-only?
                </Typography>
                <Switch
                  itemType="togglehide"
                  value={values?.editable}
                  checked={values?.editable}
                  toggleHide={(v) =>
                    onValuesChange({ value: v, property: "editable" })
                  }
                />
              </div>
            )}
            {["inputText", "textArea"].includes(itemType) && (
              <div className="sidebar-section-item">
                <Typography gutterBottom className="row-label">
                  Computed?
                </Typography>
                <Switch
                  itemType="togglehide"
                  value={values?.computed ? values?.computed : false}
                  checked={values?.computed ? values?.computed : false}
                  toggleHide={(v) =>
                    onValuesChange({
                      value: v,
                      property: "computed",
                    })
                  }
                />
              </div>
            )}
            {["fileUpload"].includes(itemType) && (
              <div className="sidebar-section-item">
                <Typography gutterBottom className="row-label">
                  Selection
                </Typography>

                <Selector
                  items={fileUploadFilesSelection}
                  onChange={(v) =>
                    onValuesChange({ value: v, property: "selectionCount" })
                  }
                  selectedValue={values?.selectionCount}
                />
              </div>
            )}
            {["fileUpload"].includes(itemType) && (
              <div className="sidebar-section-item">
                <Typography gutterBottom className="row-label _long">
                  Max. size
                </Typography>

                <InputText
                  size="small"
                  placeholder="(size in MB)"
                  defaultValue={values?.maxFileSize}
                  endAdornment={
                    <InputAdornment position="end">MB</InputAdornment>
                  }
                  onBlur={(e) =>
                    onValuesChange({
                      value: e.target.value,
                      property: "maxFileSize",
                    })
                  }
                />
              </div>
            )}
            {["fileUpload"].includes(itemType) && (
              <div className="sidebar-section-item">
                <Typography gutterBottom className="row-label _long">
                  Max. files
                </Typography>

                <Selector
                  items={[
                    ["1", "1"],
                    ["2", "2"],
                    ["3", "3"],
                    ["4", "4"],
                  ]}
                  width="6rem"
                  onChange={(v) =>
                    onValuesChange({ value: v, property: "numOfFiles" })
                  }
                  selectedValue={values?.numOfFiles}
                />
              </div>
            )}
            {[
              "dropdown",
              "checkbox",
              "radio",
              "inputText",
              "image",
              "displayTable",
            ].includes(itemType) && (
              <div className="sidebar-section-item">
                <Typography gutterBottom className="row-label _long">
                  {["inputText"].includes(itemType)
                    ? "Read-only?"
                    : ["displayTable"].includes(itemType)
                    ? "Import data?"
                    : "Dynamic options?"}
                </Typography>
                <CustomNameSwitch
                  name={name}
                  setIsDynamic={setIsDynamic}
                  isDynamic={isDynamic}
                />
              </div>
            )}
            {["inputText", "textArea"].includes(itemType) &&
              values?.computed && (
                <FormulaBuilderInputTextBox
                  itemRef={itemRef}
                  itemType={itemType}
                  value={values}
                  handleOnBlur={onValuesChange}
                />
              )}
            {["inputText", "textArea"].includes(itemType) &&
              dataType !== "autoNumber" && (
                <div className="sidebar-section-item _full">
                  <Typography gutterBottom className="row-label">
                    Placehldr
                  </Typography>

                  <InputText
                    size="small"
                    placeholder="Type in placeholder text"
                    defaultValue={values?.placeholder}
                    onBlur={(e) =>
                      onValuesChange({
                        value: e.target.value,
                        property: "placeholder",
                      })
                    }
                  />
                </div>
              )}
            {["dropdown", "checkbox", "radio"].includes(itemType) && (
              <div className="sidebar-section-item">
                <Typography gutterBottom className="row-label _long">
                  Values attribute?
                </Typography>
                <Switch
                  checked={values?.useValuesAttribute}
                  value={values?.useValuesAttribute}
                  onChange={(e) => {
                    updateData(e.target.checked, "useValuesAttribute");
                  }}
                />
              </div>
            )}
            {["inputTable"].includes(itemType) && (
              <div className="sidebar-section-item">
                <Typography gutterBottom className="row-label _long">
                  Table header?
                </Typography>
                <Switch
                  checked={values?.hasTableHeaders}
                  value={values?.hasTableHeaders}
                  onChange={(e) => {
                    onValuesChange({
                      value: e.target.checked,
                      property: "hasTableHeaders",
                    });
                  }}
                />
              </div>
            )}
            {["inputTable"].includes(itemType) && (
              <div className="sidebar-section-item">
                <Typography gutterBottom className="row-label _long">
                  Serial no.?
                </Typography>
                <Switch
                  checked={values?.hasSerialNumbers}
                  value={values?.hasSerialNumbers}
                  onChange={(e) => {
                    onValuesChange({
                      value: e.target.checked,
                      property: "hasSerialNumbers",
                    });
                  }}
                />
              </div>
            )}
            {["inputTable"].includes(itemType) && (
              <div className="sidebar-section-item">
                <Typography gutterBottom className="row-label _long">
                  Allow upload?
                </Typography>
                <Switch
                  checked={values?.allowUpload}
                  value={values?.allowUpload}
                  onChange={(e) => {
                    onValuesChange({
                      value: e.target.checked,
                      property: "allowUpload",
                    });
                  }}
                />
              </div>
            )}
            {["image"].includes(itemType) && !name?.startsWith("@") && (
              <>
                <div className="sidebar-section-item _full">
                  <Typography gutterBottom className="row-label _long">
                    Select image source
                  </Typography>
                  <Select
                    id={"uploadImage"}
                    disabled={""}
                    size="small"
                    name="imageSource"
                    required
                    value={
                      !values?.imageSource ? "uploadImage" : values?.imageSource
                    }
                    onChange={(e) => {
                      changeImageSourceOption(e);
                    }}
                    error={""}
                    type="text"
                    variant="outlined"
                  >
                    {imageDropdown.map((imageChoice, i) => (
                      <MenuItem value={imageChoice[0]} key={i}>
                        {imageChoice[1]}
                      </MenuItem>
                    ))}
                  </Select>
                </div>

                {values?.imageSource === "imageURL" ? (
                  <div className="sidebar-section-item _full">
                    <TextField
                      id={"imageUrl"}
                      name="imageUrl"
                      required
                      error={""}
                      size="small"
                      fullWidth
                      placeholder="Enter an Image URL here..."
                      onChange={(e) => {
                        e.persist();

                        onValuesChange({
                          value: e.target.value,
                          property: "src",
                        });
                      }}
                      type="text"
                      inputMode="text"
                      value={values?.src}
                      variant="outlined"
                    />
                  </div>
                ) : (
                  <div className="sidebar-section-item _full">
                    <Typography gutterBottom className="row-label _long">
                      Click to upload image
                    </Typography>
                    <Button
                      variant="contained"
                      component="label"
                      size="small"
                      style={{ textTransform: "capitalize", fontSize: 11 }}
                    >
                      Upload
                      <input
                        hidden
                        accept="image/*"
                        type="file"
                        onChange={onImageUpload}
                      />
                    </Button>
                  </div>
                )}
              </>
            )}
            {["image"].includes(itemType) && (
              <div className="sidebar-section-item">
                <Typography gutterBottom className="row-label">
                  Width
                </Typography>

                <InputText
                  size="small"
                  type="number"
                  placeholder="Image width"
                  defaultValue={values?.width}
                  onBlur={(e) =>
                    onValuesChange({
                      value: e.target.value,
                      property: "width",
                    })
                  }
                />
              </div>
            )}
            {["image"].includes(itemType) && (
              <div className="sidebar-section-item">
                <Typography gutterBottom className="row-label">
                  Unit
                </Typography>

                <Selector
                  items={units}
                  onChange={(v) =>
                    onValuesChange({
                      value: v,
                      property: "unit",
                    })
                  }
                  selectedValue={values?.unit}
                />
              </div>
            )}
            {["image"].includes(itemType) && (
              <div className="sidebar-section-item">
                <Typography gutterBottom className="row-label">
                  Align
                </Typography>

                <Selector
                  items={align}
                  onChange={(v) =>
                    onValuesChange({
                      value: v,
                      property: "textAlign",
                    })
                  }
                  selectedValue={values?.textAlign}
                />
              </div>
            )}
          </div>
        </Collapse>
      </div>
    );
  }
);
export default SidebarFieldPreferenceSection;
