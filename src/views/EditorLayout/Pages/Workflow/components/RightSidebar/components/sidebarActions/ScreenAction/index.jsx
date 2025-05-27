import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Collapse, Select, MenuItem } from "@material-ui/core";

import DynamicContentComponent from "../DynamicContentComponent";
import LookUpContentComponent from "../LookUpContentComponent";
import { useStyles } from "../../Helpers/rightSidebarStyles";

const ScreenTaskActions = ({
  isReusableScreen,
  isReusingScreen,
  fieldsAttributes = {},
  updateFieldsAttributes,
  updateLookupContents,
  lookupContents,
  dynamicContents,
  dynamicContentsStructure,
  updateDynamicContents,
}) => {
  const fieldsAttributesKeys = Object.keys(fieldsAttributes);

  const classes = useStyles(makeStyles);
  const [showSection, setShowSection] = useState({
    reusables: false,
    dynamic: false,
    lookUp: false,
  });

  const updateDynamicContentsData = (data, index) => {
    const dynco = [...dynamicContents];
    dynco[index] = data;
    updateDynamicContents(dynco);
  };

  const removeDynamicContentsData = (dataIndex) => {
    const updatedDynamicContents = dynamicContents?.filter(
      (_, index) => index !== dataIndex
    );
    updateDynamicContents(updatedDynamicContents);
  };

  const updateLookupContentsData = (data, index) => {
    const lookup = [...lookupContents];
    lookup[index] = data;
    updateLookupContents(lookup);
  };

  const removeLookupContentsData = (dataIndex) => {
    const updatedContents = [...lookupContents];

    if (updatedContents[dataIndex]) {
      // Extract only the desired properties and update activeSelection
      const { id, info, tasks } = updatedContents[dataIndex];
      updatedContents[dataIndex] = {
        id,
        info,
        tasks,
        activeSelection: false,
      };
    }

    updateLookupContents(updatedContents);
  };

  const selectedLookupContents = lookupContents?.filter(
    (lookup) => lookup?.activeSelection
  );

  const hasUnselectedLookupContent = lookupContents?.filter(
    (lookup) => !lookup?.activeSelection
  )?.length;

  const updateAttributes = (e, attributeKey) => {
    const newAttributes = { ...(fieldsAttributes || {}) };
    newAttributes[attributeKey] = {
      ...newAttributes[attributeKey],
      attribute: e.target.value,
    };

    updateFieldsAttributes(newAttributes);
  };

  const selectedDynamicContents = () =>
    dynamicContentsStructure?.filter(
      (eachDyncoStruct) =>
        !!dynamicContents?.find(
          (dynamicContent) => eachDyncoStruct?.key === dynamicContent?.key
        )
    );

  const hasUnselectedDynamicContent = () =>
    dynamicContentsStructure?.filter(
      (eachDyncoStruct) =>
        !!dynamicContents?.find(
          (dynamicContent) => eachDyncoStruct?.key === dynamicContent?.key
        )
    )?.length < dynamicContentsStructure?.length;

  //COLLAPSE SECTION
  const _toggleSection = (e, sect) => {
    e && e.stopPropagation();
    setShowSection({ ...showSection, [sect]: !showSection[sect] });
  };

  return (
    <Collapse in={true}>
      {/* HANDLE REUSABLE FIELD ATTRIBUTES */}
      {(isReusableScreen || isReusingScreen) && (
        <div
          className={classes.sectionEntry}
          data-testid="config-reusablefieldattrib-section"
        >
          {!!fieldsAttributesKeys.length ? (
            <Typography
              gutterBottom
              className="screen-actions-header"
              onClick={(e) => _toggleSection(e, "reusables")}
              style={{ position: "relative", cursor: "pointer" }}
            >
              Reusable screen fields
              <span className={classes.plusIcon}>
                {!showSection?.dynamic ? "+" : "-"}
              </span>
            </Typography>
          ) : (
            <Typography
              gutterBottom
              className="screen-actions-header"
              style={{ position: "relative", fontStyle: "italic" }}
            >
              No reusable screen fields
            </Typography>
          )}
          {!!fieldsAttributesKeys.length && (
            <Collapse in={showSection?.reusables}>
              <div style={{ color: "#888" }}>
                Specify how each field should behave on current node
              </div>
              <div
                style={{
                  border: "solid 1px #ddd",
                  borderRadius: 5,
                  padding: "5px 0",
                  backgroundColor: "#fcfcfc",
                  maxHeight: 300,
                  overflowY: "auto",
                }}
              >
                {fieldsAttributesKeys.map((attributeKey, index) => {
                  const eachAttribute = (fieldsAttributes || {})[attributeKey];
                  const isFixed = eachAttribute?.name?.startsWith("@");

                  return (
                    <div
                      key={index}
                      className={classes.reusableFieldLine}
                      style={{
                        marginBottom:
                          index < Object.keys(fieldsAttributes || {}).length - 1
                            ? 2
                            : 0,
                      }}
                    >
                      <div style={{ flex: 1 }}>{eachAttribute.name}</div>
                      <div>
                        <Select
                          key={eachAttribute.attribute || "editable"}
                          variant="outlined"
                          size="small"
                          fullWidth
                          placeholder="Select screen"
                          classes={{
                            root: classes.select,
                            outlined: classes.selected,
                          }}
                          defaultValue={
                            isFixed
                              ? "readonly"
                              : eachAttribute.attribute || "editable"
                          }
                          onChange={(e) => updateAttributes(e, attributeKey)}
                        >
                          <MenuItem
                            value="editable"
                            selected
                            disabled={isFixed}
                          >
                            Editable
                          </MenuItem>
                          <MenuItem value="readonly" selected>
                            Readonly
                          </MenuItem>
                          <MenuItem value="hidden" selected>
                            Hidden
                          </MenuItem>
                        </Select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Collapse>
          )}
        </div>
      )}

      {/* HANDLE DYNAMIC CONTENTS */}
      {
        !!dynamicContentsStructure?.length && (
          <div className={classes.sectionEntry}>
            <Typography
              onClick={(e) => _toggleSection(e, "dynamic")}
              gutterBottom
              style={{ position: "relative", cursor: "pointer" }}
              className="screen-actions-header"
            >
              Dynamic contents
              <span className={classes.plusIcon}>
                {!showSection?.dynamic ? "+" : "-"}
              </span>
            </Typography>

            <Collapse in={showSection?.dynamic}>
              <>
                {selectedDynamicContents().map((val, idx) => (
                  <div key={idx}>
                    <DynamicContentComponent
                      classes={classes}
                      currentIdx={idx}
                      dynamicContentsStructure={dynamicContentsStructure}
                      dynamicContents={dynamicContents}
                      updateDynamicContentsData={(data) =>
                        updateDynamicContentsData(data, idx)
                      }
                      removeDynamicContentsData={removeDynamicContentsData}
                    />
                    <hr
                      style={{
                        height: 4,
                        backgroundColor: "#cecece",
                        margin: "1rem 0rem",
                      }}
                    />
                  </div>
                ))}
                {hasUnselectedDynamicContent() && (
                  <DynamicContentComponent
                    classes={classes}
                    currentIdx={
                      dynamicContents?.filter((dc) => !!dc?.key).length
                    }
                    dynamicContentsStructure={dynamicContentsStructure}
                    dynamicContents={dynamicContents}
                    updateDynamicContentsData={(data) =>
                      updateDynamicContentsData(
                        data,
                        dynamicContents?.filter((dc) => !!dc?.key).length
                      )
                    }
                  />
                )}
              </>
            </Collapse>
          </div>
        ) /*  : (
        <Grid style={{ opacity: 0.5, fontWeight: 300, letterSpacing: "0.2px" }}>
          <i>No dynamic content. Ensure fields are configured dynamic.</i>
        </Grid>
      ) */
      }

      {/* HANDLE LOOK UP FIELDS */}
      <div className={classes.sectionEntry}>
        {!!lookupContents?.length ? (
          <Typography
            onClick={(e) => _toggleSection(e, "lookUp")}
            gutterBottom
            style={{ position: "relative", cursor: "pointer" }}
            className="screen-actions-header"
          >
            Lookup fields
            <span className={classes.plusIcon}>
              {!showSection?.lookUp ? "+" : "-"}
            </span>
          </Typography>
        ) : (
          <Typography
            gutterBottom
            style={{ position: "relative", fontStyle: "italic" }}
            className="screen-actions-header"
          >
            No lookup fields
          </Typography>
        )}

        {!!lookupContents?.length && (
          <Collapse in={showSection?.lookUp}>
            <>
              {selectedLookupContents?.map((val, idx) => (
                <div key={idx}>
                  <LookUpContentComponent
                    classes={classes}
                    currentIdx={idx}
                    currentVal={val}
                    dynamicContentsStructure={dynamicContentsStructure}
                    dynamicContents={dynamicContents}
                    lookupContents={lookupContents}
                    updateDynamicContentsData={(data) =>
                      updateDynamicContentsData(data, idx)
                    }
                    updateLookupContentsData={(data, ind) =>
                      updateLookupContentsData(data, ind)
                    }
                    removeLookupContentsData={removeLookupContentsData}
                  />
                  <hr
                    style={{
                      height: 4,
                      backgroundColor: "#cecece",
                      margin: "1rem 0rem",
                    }}
                  />
                </div>
              ))}
              {hasUnselectedLookupContent && (
                <LookUpContentComponent
                  classes={classes}
                  currentIdx={
                    lookupContents?.filter((lc) => !lc?.activeSelection).length
                  }
                  currentVal={{}}
                  dynamicContentsStructure={dynamicContentsStructure}
                  dynamicContents={dynamicContents}
                  lookupContents={lookupContents}
                  updateDynamicContentsData={(data) =>
                    updateDynamicContentsData(
                      data,
                      dynamicContents?.filter((dc) => !!dc?.key).length
                    )
                  }
                  updateLookupContentsData={(data, ind) =>
                    updateLookupContentsData(data, ind)
                  }
                />
              )}
            </>
          </Collapse>
        )}
      </div>
    </Collapse>
  );
};

export default ScreenTaskActions;
