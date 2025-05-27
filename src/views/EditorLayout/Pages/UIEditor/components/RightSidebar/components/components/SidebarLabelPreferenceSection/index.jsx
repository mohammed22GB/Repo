import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Collapse, InputBase, Typography } from "@material-ui/core";
import { useDispatch } from "react-redux";
import Switch from "../../PlainToggleSwitch";
import { updateScreenItemPropertyValues } from "../../../../../utils/uieditorHelpers";

const SidebarLabelPreferenceSection = React.memo(
  ({ itemType, values, index, itemRef }) => {
    const [showPreferences, setShowPreferences] = useState(false);

    const InputText = withStyles((theme) => ({
      input: {
        color: "#091540",
        borderRadius: 3,
        position: "relative",
        border: "1px solid #ABB3BF",
        fontSize: 11,
        padding: "5px 12px",
        transition: theme?.transitions.create(["border-color", "box-shadow"]),
      },
    }))(InputBase);

    const dispatch = useDispatch();
    const onValuesChange = ({ value, property }) =>
      dispatch(
        updateScreenItemPropertyValues({
          value,
          property,
          index,
          itemRef,
          type: itemType,
        })
      );

    const inputType = [
      ["text", "Text"],
      ["email", "Email"],
      ["url", "URL"],
      ["password", "Password"],
      ["number", "Number"],
    ];

    return (
      <div className="sidebar-section">
        <div
          className="sidebar-section-header"
          onClick={() => setShowPreferences((prev) => !prev)}
        >
          <Typography>Label Preferences</Typography>
          <span>{`[${showPreferences ? "-" : "+"}]`}</span>
        </div>

        <Collapse in={showPreferences}>
          <div style={{ padding: 8 }}></div>

          <div className="sidebar-section-itemgroup">
            <div className="sidebar-section-item">
              <Typography gutterBottom className="row-label _long">
                Hide label?:
              </Typography>

              <Switch
                itemType="togglehide"
                defaultValue={values?.labelHide}
                toggleHide={(v) =>
                  onValuesChange({
                    value: v,
                    property: "labelHide",
                  })
                }
              />
            </div>

            <div className="sidebar-section-item">
              <div></div>
            </div>

            <div className="sidebar-section-item _full">
              <Typography gutterBottom className="row-label">
                Text:
              </Typography>
              <InputText
                size="small"
                placeholder="Enter label text"
                defaultValue={values?.label}
                disabled={values?.labelHide}
                onBlur={(e) =>
                  onValuesChange({ value: e.target.value, property: "label" })
                }
              />
            </div>
            {values?.setRange && (
              <>
                <div className="sidebar-section-item _full">
                  <Typography gutterBottom className="row-label">
                    End:
                  </Typography>
                  <InputText
                    size="small"
                    placeholder="Enter label text"
                    defaultValue={values?.labelDateEnd || "End date"}
                    disabled={values?.labelHide}
                    onBlur={(e) =>
                      onValuesChange({
                        value: e.target.value,
                        property: "labelDateEnd",
                      })
                    }
                  />
                </div>
                {values?.hasDuration && (
                  <div className="sidebar-section-item _full">
                    <Typography gutterBottom className="row-label">
                      Duration:
                    </Typography>
                    <InputText
                      size="small"
                      placeholder="Enter label text"
                      defaultValue={values?.labelDuration || "Duration"}
                      disabled={values?.labelHide}
                      onBlur={(e) =>
                        onValuesChange({
                          value: e.target.value,
                          property: "labelDuration",
                        })
                      }
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </Collapse>
      </div>
    );
  }
);
export default SidebarLabelPreferenceSection;
