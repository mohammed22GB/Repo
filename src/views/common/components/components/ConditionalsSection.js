import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Collapse, InputBase, Typography } from "@material-ui/core";
import { useDispatch } from "react-redux";
import {
  updateComponentAttribute,
  updateValues,
} from "../../../../Pages/UIEditor/utils/canvasHelpers";
import Switch from "../PlainToggleSwitch";

const SidebarFieldPreferenceSection = React.memo(
  ({
    itemType,
    id,
    name,
    values,
    index,
    dataType,
    isInsideContainer,
    containingChildIndex,
    isDynamic,
    setIsDynamic,
    updateData,
  }) => {
    const [showPreferences, setShowPreferences] = useState(false);
    const [autoValue, setAutoValue] = useState({ pre: "", seqL: "" });
    const [inputTypes, setInputTypes] = useState([
      ["text", "Text"],
      ["email", "Email"],
      ["url", "URL"],
      ["password", "Password"],
      ["number", "Number"],
    ]);
    // const [isDynamic, setIsDynamic] = useState(false);

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
      if (["dropdown", "checkbox", "radio", "inputText"].includes(itemType)) {
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
          updateComponentAttribute({
            attrib: "name",
            value,
            index,
            isInsideContainer,
            containingChildIndex,
          })
        );
      }
    }, [isDynamic]);

    const onValuesChange = ({ value, property, e }) => {
      e?.persist();
      dispatch(
        updateValues({
          value,
          property,
          index,
          isInsideContainer,
          containingChildIndex,
          type: itemType,
        })
      );
    };
    const onTypeChange = ({ name, value }) =>
      dispatch(
        updateComponentAttribute({
          attrib: "dataType",
          // attrib: "type",
          value,
          index,
          isInsideContainer,
          containingChildIndex,
        })
      );
    const onDataChange = ({ value, root, action }) =>
      dispatch(
        updateData({
          value,
          root,
          action,
          id,
          index,
          isInsideContainer,
          containingChildIndex,
          type: itemType,
        })
      );
    useEffect(() => {
      if (itemType === "inputText") {
        setInputTypes((prev) => [...prev, ["autoNumber", "AutoNumber"]]);
      }
    }, [itemType]);

    return (
      <div className="sidebar-section">
        <div
          className="sidebar-section-header"
          onClick={() => setShowPreferences((prev) => !prev)}
        >
          <Typography>Conditionals</Typography>
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
            {["inputText", "textArea", "phoneNumber", "userPicker"].includes(
              itemType
            ) &&
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
          </div>
        </Collapse>
      </div>
    );
  }
);
export default SidebarFieldPreferenceSection;
