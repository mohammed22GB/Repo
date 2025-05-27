import React, { useState } from "react";
import {
  Collapse,
  MenuItem,
  Select,
  Typography,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import { DeleteRounded } from "@material-ui/icons";
import DataActivitiesModule from "./common/DataActivitiesModule";

const DynamicContentComponent = ({
  classes,
  currentIdx,
  dynamicContentsStructure,
  dynamicContents,
  updateDynamicContentsData,
  removeDynamicContentsData,
}) => {
  const dynamicContentsIndexData = dynamicContents[currentIdx];
  const [show, setShow] = useState(true);

  const getSelectedIndex = (value) => {
    const theKey =
      value?.target?.name === "key"
        ? value?.target?.value
        : dynamicContentsIndexData?.key;
    const position = dynamicContentsStructure?.findIndex(
      (content) => content.key === theKey
    );

    return position;
  };

  const updateDyncoIndexData = (dataValue, ppty, isGrouped) => {
    const index = getSelectedIndex(dataValue);
    const newData = {
      ...dynamicContentsStructure[index],
      ...(dataValue?.target?.name === "key" ? {} : dynamicContentsIndexData),
      ...(isGrouped
        ? {
            ...dataValue,
          }
        : {
            [dataValue.target.name]: dataValue.target.value,
          }),
    };

    updateDynamicContentsData(newData);
  };

  const shouldBeDisabled = (aKey) =>
    dynamicContents?.find((dynco) => !!dynco?.key && dynco?.key === aKey) &&
    dynamicContents?.find(
      (dynco) => dynco?.key !== dynamicContentsIndexData?.key
    );

  const isSelectedDynamicContentIndexData = !!dynamicContentsIndexData?.key; // Determine if the content is selected

  return (
    <>
      <div className={classes.sectionEntry} style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography gutterBottom className={classes.sectionTitle}>
            Content placeholder
          </Typography>
          <div>
            {isSelectedDynamicContentIndexData && (
              <Tooltip title="Remove selected dynamic component field">
                <IconButton
                  size="small"
                  style={{ marginRight: 10 }}
                  onClick={() => removeDynamicContentsData(currentIdx)}
                >
                  <DeleteRounded style={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
            )}

            <span
              onClick={() => setShow((prev) => !prev)}
              style={{ cursor: "pointer" }}
            >
              {show ? "[-]" : "[+]"}
            </span>
          </div>
        </div>
        <Select
          name="key"
          variant="outlined"
          size="small"
          fullWidth
          placeholder="Select form screen"
          classes={{
            root: classes.select,
          }}
          value={dynamicContentsIndexData?.key || "choose"}
          onChange={updateDyncoIndexData}
        >
          <MenuItem value="choose" disabled>
            <em>Select dynamic content</em>
          </MenuItem>
          {dynamicContentsStructure?.map((dc, idx) => {
            return (
              <MenuItem
                value={dc?.key}
                selected
                key={`${dc}-${idx}`}
                disabled={shouldBeDisabled(dc?.key)}
              >
                {dc?.key} {`(${dc?.fieldType})`}
              </MenuItem>
            );
          })}
        </Select>
      </div>
      <Collapse in={!!show && !!dynamicContentsIndexData?.key}>
        <DataActivitiesModule
          moduleSource={
            dynamicContentsIndexData?.dynamicType === "table"
              ? "screenDynamicContentTable"
              : "screenDynamicContent"
          }
          data={dynamicContentsIndexData}
          updateData={updateDyncoIndexData}
        />
      </Collapse>
    </>
  );
};

export default DynamicContentComponent;
