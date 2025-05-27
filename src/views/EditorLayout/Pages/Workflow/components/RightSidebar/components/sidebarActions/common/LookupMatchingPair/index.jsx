import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Select,
  MenuItem,
  Collapse,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import { CancelRounded, SwapHoriz } from "@material-ui/icons";
import SelectOnSteroids from "../SelectOnSteroids";
import { useSelector } from "react-redux";

const LookupMatchingPair = ({
  index,
  valuesData,
  updateMatching,
  matchedLines,
  matchedLine,
  reverseRow = false,
  dataObj,
  lookupContents,
  fixed = false,
}) => {
  const useStyles = makeStyles((theme) => ({
    sectionTitle: {
      color: "#999",
      fontSize: 12,
      marginBottom: 5,
      height: 36.5,
      boxSizing: "border-box",
    },
    select: {
      color: "#091540",
      fontSize: 12,
      padding: 10,
      height: 36.5,
      boxSizing: "border-box",
    },
    sectionEntry: {
      marginBottom: 13,
    },
    matchingFields: {
      borderRadius: 5,
      border: "dashed 1.5px #999",
      padding: "10px 5px 10px 10px",
      // paddingRight: 0,
      backgroundColor: "#f8f8f8",
    },
    pair: {
      display: "flex",
      flexDirection: reverseRow ? "row-reverse" : "row",
      alignItems: "center",
      marginBottom: 10,
      height: 35.25,
      gap: 5,
      "& > div": {
        flex: 1,
        "&:first-child": {},
      },
      "&:last-of-type": {
        marginBottom: 0,
      },
    },
    disabled: {
      color: "#999",
    },
    menuSubs: {
      fontSize: "0.8em",
      color: "#0c7b93",
      fontWeight: "normal",
    },
    selected: {
      "& span": {
        display: "none",
      },
    },
  }));

  const { workflowTasks: allTasks, workflowCanvas } = useSelector(
    ({ workflows }) => workflows
  );
  const lookupContentsRef = useRef(lookupContents);
  useEffect(() => {
    lookupContentsRef.current = lookupContents?.filter(
      (content) => content?.id !== dataObj?.id
    );
  }, [lookupContents, dataObj?.id]);

  const classes = useStyles();

  const _isAlreadySelected = (id) => {
    return !!matchedLines?.find((line) => line.targetField === id);
  };

  const _isLookupFieldSelected = (id) => {
    return !!matchedLines?.find((line) => line?.targetValue?.[0]?.id === id);
  };

  const directValueMatching = () => (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          height: 36.5,
        }}
      >
        <Select
          variant="outlined"
          size="small"
          data-testid="firstDropdown"
          placeholder="Select data options"
          fullWidth
          classes={{
            root: classes.select,
            outlined: classes.selected,
            disabled: classes.disabled,
          }}
          value={matchedLine?.targetField || "choose"}
          onChange={(e) =>
            updateMatching(
              { ...matchedLine, targetField: e.target.value },
              index
            )
          }
        >
          <MenuItem value="choose" key="key-col-0" selected disabled>
            <em>Assign data field</em>
          </MenuItem>
          {(!!valuesData?.length ? valuesData : [])?.map((col) => (
            <MenuItem
              key={`col-${col?.id || col?.name}`}
              value={col?.id || col?.name}
              disabled={_isAlreadySelected(col?.id || col?.name)}
            >
              {col?.name}
            </MenuItem>
          ))}
        </Select>
        <div
          style={{
            maxWidth: 10,
            textAlign: "center",
            height: 36.5,
            display: "flex",
            alignItems: "center",
          }}
        >
          =
        </div>
      </div>
      <div style={{ display: "flex", gap: 5, overflowX: "auto" }}>
        <Select
          data-testid="secondDropdown"
          name="lookupField"
          variant="outlined"
          size="small"
          fullWidth
          placeholder="Select form screen"
          disabled={
            (!matchedLine?.targetField ||
              matchedLine?.targetField === "choose") &&
            !reverseRow
          }
          classes={{
            root: classes.select,
          }}
          value={matchedLine?.targetValue?.[0]?.id || ""}
          onChange={(e) => {
            const selected = lookupContentsRef.current?.find(
              (variable) => variable?.id === e.target.value
            );
            updateMatching(
              {
                ...matchedLine,
                targetValue: [
                  {
                    dataType: selected?.info?.dataType,
                    id: selected?.id,
                    info: `${allTasks?.[selected?.info?.parent]?.name} (${
                      allTasks?.[selected?.info?.parent]?.type
                    })`,
                    name: selected?.info?.name,
                    variableType: "Variable",
                  },
                ],
              },
              index
            );
          }}
        >
          <MenuItem value="choose" selected disabled>
            <em>Select lookup field</em>
          </MenuItem>
          {lookupContentsRef?.current?.map((lc, idx) => {
            return (
              <MenuItem
                disabled={_isLookupFieldSelected(lc?.id)}
                className="ldos"
                value={lc?.id}
                key={idx}
              >
                {lc?.info?.name}
              </MenuItem>
            );
          })}
        </Select>

        <div
          style={{
            maxWidth: 22,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: 36.5,
          }}
        >
          <Tooltip>
            <span>
              <IconButton
                title="Switch entry mode"
                size="small"
                style={{ padding: 0 }}
                onClick={() => {
                  updateMatching(
                    {
                      ...matchedLine,
                      updateType:
                        matchedLine?.updateType === "compute"
                          ? "replace"
                          : "compute",
                    },
                    index
                  );
                }}
              >
                <SwapHoriz style={{ fontSize: 14 }} />
              </IconButton>
            </span>
          </Tooltip>
          {!fixed && (
            <div className={classes.addComponent} style={{ flex: 0 }}>
              <Tooltip title="Remove line">
                <span>
                  <IconButton
                    size="small"
                    style={{ padding: 0 }}
                    disabled={matchedLines?.length <= 1}
                    onClick={() => {
                      updateMatching("@remove", index);
                    }}
                  >
                    <CancelRounded style={{ fontSize: 14 }} />
                  </IconButton>
                </span>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return directValueMatching();
};

export default LookupMatchingPair;
