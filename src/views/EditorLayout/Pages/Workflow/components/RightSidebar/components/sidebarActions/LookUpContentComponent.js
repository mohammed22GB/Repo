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

const LookUpContentComponent = ({
  classes,
  currentIdx,
  currentVal,
  lookupContents,
  updateLookupContentsData,
  removeLookupContentsData,
}) => {
  const lookupContentsIndexData = lookupContents[currentIdx];
  const [show, setShow] = useState(true);
  const getSelectedIndex = (value) => {
    const theKey =
      value?.target?.name === "lookupField"
        ? value?.target?.value
        : currentVal?.info?.matching?.valueSourceInput;

    const position = lookupContents?.findIndex(
      (content) => content?.info?.matching?.valueSourceInput === theKey
    );

    return position;
  };

  const updateLookconIndexData = (dataValue, ppty, isGrouped) => {
    const index = getSelectedIndex(dataValue);
    const newData = {
      ...lookupContents[index],
      ...(isGrouped
        ? {
            ...dataValue,
          }
        : {
            [dataValue?.target?.name]: dataValue?.target?.value,
          }),
      activeSelection: true,
    };
    if (
      dataValue?.target?.name === "lookupField" &&
      currentVal?.activeSelection
    ) {
      const oldIndex = lookupContents.findIndex(
        (lookVal) =>
          lookVal?.info?.matching?.valueSourceInput ===
          currentVal?.info?.matching?.valueSourceInput
      );
      lookupContents[oldIndex].activeSelection = false;
    }
    updateLookupContentsData(newData, index);
  };

  const shouldBeDisabled = (lID) => {
    return (
      lookupContents?.find(
        (lookcon) =>
          !!lookcon?.activeSelection &&
          lookcon?.info?.matching?.valueSourceInput === lID
      ) && currentVal?.info?.matching?.valueSourceInput !== lID
    );
  };

  const isSelectedLookUpContentIndexData = !!currentVal?.activeSelection;

  // Find the actual index of the current lookup content
  const currentValueActualIndex = lookupContents?.findIndex(
    (content) => content?.id === currentVal?.id
  );

  return (
    <>
      <div className={classes.sectionEntry} style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography gutterBottom className={classes.sectionTitle}>
            Select lookup field
          </Typography>
          <div>
            {isSelectedLookUpContentIndexData && (
              <Tooltip title="Remove selected lookup field">
                <IconButton
                  size="small"
                  style={{ marginRight: 10 }}
                  onClick={() => {
                    removeLookupContentsData(currentValueActualIndex);
                  }}
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
          name="lookupField"
          variant="outlined"
          size="small"
          fullWidth
          placeholder="Select form screen"
          classes={{
            root: classes.select,
          }}
          value={currentVal?.info?.matching?.valueSourceInput || "choose"}
          onChange={updateLookconIndexData}
        >
          <MenuItem value="choose" disabled>
            <em>Select lookup field</em>
          </MenuItem>
          {lookupContents?.map((lc, idx) => {
            return (
              <MenuItem
                value={lc?.info?.matching?.valueSourceInput}
                selected
                key={idx}
                disabled={shouldBeDisabled(
                  lc?.info?.matching?.valueSourceInput
                )}
              >
                {lc?.info?.name}
              </MenuItem>
            );
          })}
        </Select>
      </div>
      <Collapse in={!!show && !!currentVal?.activeSelection}>
        <DataActivitiesModule
          moduleSource={"screenLookupContent"}
          data={{ ...currentVal, isLookupField: true }}
          updateData={updateLookconIndexData}
          lookupContents={lookupContents}
        />
      </Collapse>
    </>
  );
};

export default LookUpContentComponent;
