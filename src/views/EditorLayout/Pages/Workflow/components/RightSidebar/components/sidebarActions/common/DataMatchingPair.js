import React, { useState, useEffect } from "react";
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
import SelectOnSteroids from "./SelectOnSteroids";
import {
  ArithmeticOperators,
  ConditionalOperators,
  allOperators,
  ComputedTimeUnits,
} from "../../../../utils/constants";

const DataMatchingPair = ({
  index,
  valuesData,
  updateMatching,
  matchedLines,
  matchedLine,
  variables,
  reverseRow = false,
  counter,
  variablesAndCustomOnly = true,
  variablesType = "text",
  multipleSelection = false,
  selText = "Data Field",
  fixed = false,
  includeOriginal = false,
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

  const classes = useStyles();

  const _isAlreadySelected = (id) => {
    return !!matchedLines?.find((line) => line.targetField === id);
    // const found = pL.find((p) => !!p[id]);
    // return !!found && found[id] !== input;
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
            <em>
              {counter
                ? `${reverseRow ? "Select" : "Assign"} ${selText}*`
                : `No ${selText}*`}
            </em>
          </MenuItem>
          {(!!valuesData?.length ? valuesData : []).map((col) => (
            <MenuItem
              key={`col-${col.id || col.name}`}
              value={col.id || col.name}
              disabled={_isAlreadySelected(col.id || col.name)}
            >
              {col.name}
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
        {matchedLine?.updateType === "compute" ? (
          <>
            <SelectOnSteroids
              mode="menu"
              disabled={
                (!matchedLine?.targetField ||
                  matchedLine?.targetField === "choose") &&
                !reverseRow
              }
              // disabled={!activeTask?.properties?.calendarId}
              source="variable"
              variables={[
                ...(includeOriginal
                  ? [
                      {
                        id: "{{ ORIGINAL VALUE }}",
                        name: "{{ ORIGINAL VALUE }}",
                        dataType: "text",
                      },
                    ]
                  : []),
                ...(variables || []),
              ]}
              value={matchedLine?.leftArgument || []}
              onChange={(e) =>
                updateMatching({ ...matchedLine, leftArgument: e }, index)
              }
              type={variablesType}
              multiple={multipleSelection}
              variablesAndCustomOnly={variablesAndCustomOnly}
            />
            <Select
              key={matchedLine?.operator}
              variant="outlined"
              size="small"
              fullWidth
              classes={{
                root: classes.select,
                outlined: classes.selected,
                disabled: classes.disabled,
              }}
              style={{ minWidth: 55, maxWidth: 60, height: 36.5 }}
              defaultValue={matchedLine?.operator || allOperators.EQUALS}
              onChange={(e) => {
                updateMatching(
                  { ...matchedLine, operator: e.target.value },
                  index
                );
              }}
            >
              {ArithmeticOperators?.map(({ value, symbol, title }, idx) => (
                <MenuItem value={value} key={`${value}-${idx}`}>
                  {symbol} <span style={{ marginLeft: 5 }}>{title}</span>
                </MenuItem>
              ))}
            </Select>
            <SelectOnSteroids
              mode="menu"
              disabled={
                (!matchedLine?.targetField ||
                  matchedLine?.targetField === "choose") &&
                !reverseRow
              }
              // disabled={!activeTask?.properties?.calendarId}
              source="variable"
              variables={[
                ...(includeOriginal
                  ? [
                      {
                        id: "{{ ORIGINAL VALUE }}",
                        name: "{{ ORIGINAL VALUE }}",
                        dataType: "text",
                      },
                    ]
                  : []),
                ...(variables || []),
              ]}
              value={matchedLine?.rightArgument || []}
              onChange={(e) =>
                updateMatching({ ...matchedLine, rightArgument: e }, index)
              }
              type={variablesType}
              multiple={multipleSelection}
              variablesAndCustomOnly={variablesAndCustomOnly}
            />

            <Select
              key={matchedLine?.computedTimeUnit}
              variant="outlined"
              size="small"
              fullWidth
              classes={{
                root: classes.select,
                outlined: classes.selected,
                disabled: classes.disabled,
              }}
              defaultValue={matchedLine?.computedTimeUnit ?? ""}
              onChange={(e) => {
                updateMatching(
                  { ...matchedLine, computedTimeUnit: e.target.value },
                  index
                );
              }}
            >
              {ComputedTimeUnits?.map(({ value, symbol, title }, idx) => (
                <MenuItem value={value} key={`${value}-${idx}`}>
                  {symbol} <span style={{ marginLeft: 5 }}>{title}</span>
                </MenuItem>
              ))}
            </Select>
          </>
        ) : (
          <SelectOnSteroids
            mode="menu"
            disabled={
              (!matchedLine?.targetField ||
                matchedLine?.targetField === "choose") &&
              !reverseRow
            }
            // disabled={!activeTask?.properties?.calendarId}
            source="variable"
            contents={["variables"]}
            variables={variables}
            value={matchedLine?.targetValue || []}
            onChange={(e) =>
              updateMatching({ ...matchedLine, targetValue: e }, index)
            }
            type={variablesType}
            multiple={multipleSelection}
            variablesAndCustomOnly={variablesAndCustomOnly}
          />
        )}

        <div
          style={{
            maxWidth: 22,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: 36.5,
          }}
        >
          <Tooltip title="Switch entry mode">
            <span>
              <IconButton
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

export default DataMatchingPair;
