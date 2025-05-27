import React, { useState } from "react";
import {
  Typography,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from "@material-ui/core";
import { useDispatch } from "react-redux";
import { v4 } from "uuid";

import {
  CONDITION_OPERATORS,
  INVALID_FIELD_LABEL_STYLE,
  exemptCurrentTaskVariables,
  getOperators,
} from "../../../../../utils/constants";
import SelectOnSteroids from "../SelectOnSteroids";
import DecisionNodeLabels from "../DecisionNodeLabels";
import { rRemoteUpdateCanvasElements } from "../../../../../../../../../../store/actions/properties";

const DataHasDecision = ({
  classes,
  hasDecision,
  updateData,
  dataOperationId,
  aggregationFunction,
  decisionCriterion,
  retrievedDataVariableName,
  variables,
  activeTaskId,
  taskDecisionActions,
  taskHasDecision,
  workflowCanvas,
}) => {
  const dispatch = useDispatch();
  const [resetKey, setResetKey] = useState("");

  const makeDataDecision = (event) => {
    event.preventDefault();

    /* get node output links (if any) */
    const links = workflowCanvas.filter((w) => w.source === activeTaskId);
    if (!!links.length) {
      const conf = window?.confirm(
        "This may disconnect outbound link(s). Proceed?"
      );
      if (!conf) {
        setResetKey(v4());
        return false;
      }
      dispatch(rRemoteUpdateCanvasElements(links));
    }
    updateData(event);
  };

  const _updateCriterion = (event, ppty) => {
    const currentValue = {
      ...decisionCriterion,
      [ppty]: event?.target?.value || event,
    };

    updateData({ target: { name: "decisionCriterion", value: currentValue } });
  };

  const getDisabledOperators = () => {
    if (["NONE", "LIST"].includes(aggregationFunction)) {
      return Object.values(CONDITION_OPERATORS).filter(
        (operator) =>
          ![
            CONDITION_OPERATORS.IS_NULL,
            CONDITION_OPERATORS.IS_NOT_NULL,
          ].includes(operator)
      );
    }
    return [];
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          // margin: " 0 10px",
        }}
      >
        <FormControlLabel
          classes={{
            root: classes.switchLabel,
            label: classes.sectionTitle,
          }}
          control={
            <Switch
              name="hasDecision"
              key={`${resetKey}${!!hasDecision}`}
              defaultChecked={!!hasDecision}
              onChange={makeDataDecision}
              color="primary"
              size="small"
              disabled={taskHasDecision && !hasDecision}
            />
          }
          label={`Use for decision ${
            taskHasDecision && !hasDecision
              ? "(Node already has decision!)"
              : ""
          }`}
          labelPlacement="start"
        />
      </div>

      {!!hasDecision && (
        <div className={classes.matchingFields}>
          <div className={classes.sectionEntry}>
            <Typography
              gutterBottom
              className={classes.sectionTitle}
              /* style={
              !activeTask?.properties?.decisionFunction
                ? INVALID_FIELD_LABEL_STYLE
                : {}
            } */
            >
              Decision is TRUE if
            </Typography>
            <div>
              <ul
                style={{
                  padding: 0,
                  margin: 0,
                  listStyle: "none",
                  display: "flex",
                  gap: 5,
                  alignItems: "center",
                }}
              >
                {/* <li className={classes.decisionPrefix}>IF</li> */}
                <li
                  className={classes.functionTrueFalse}
                  style={{
                    flex: 1,
                    border: "solid 1px #bbb",
                    height: 36,
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  <span
                    style={{
                      padding: 3,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >{`[ ${
                    retrievedDataVariableName || `variable-${dataOperationId}`
                  } ]`}</span>
                </li>
                <li
                  style={{
                    minWidth: 34,
                    // maxWidth: 34,
                    overflow: "hidden",
                    ...([
                      CONDITION_OPERATORS.IS_NULL,
                      CONDITION_OPERATORS.IS_NOT_NULL,
                    ].includes(decisionCriterion?.operator)
                      ? { flex: 1 }
                      : {}),
                  }}
                >
                  <Select
                    key={decisionCriterion?.operator || "none"}
                    variant="outlined"
                    size="small"
                    fullWidth
                    placeholder="Select screen"
                    classes={{
                      root: classes.select,
                      outlined: classes.selected,
                    }}
                    onChange={(e) => _updateCriterion(e, "operator")}
                    defaultValue={decisionCriterion?.operator || "none"}
                  >
                    <MenuItem value="choose" disabled>
                      <em>Select operator</em>
                    </MenuItem>
                    <MenuItem value="none" selected>
                      <b style={{ visibility: "hidden" }}>_</b>
                    </MenuItem>
                    {getOperators(
                      "comparison",
                      MenuItem,
                      classes,
                      getDisabledOperators()
                    )}
                  </Select>
                </li>
                {![
                  CONDITION_OPERATORS.IS_NULL,
                  CONDITION_OPERATORS.IS_NOT_NULL,
                ].includes(decisionCriterion?.operator) && (
                  <li
                    style={{
                      flex: 1,
                    }}
                  >
                    <SelectOnSteroids
                      // mode="menu"
                      source="variable"
                      variables={exemptCurrentTaskVariables(
                        variables,
                        activeTaskId
                      )}
                      onChange={(e) => _updateCriterion(e, "operand")}
                      value={decisionCriterion?.operand}
                      type="text"
                      placeholderText="Select or type value"
                      contents={["variables", "custom"]}
                      multiple={false}
                    />
                  </li>
                )}
              </ul>
            </div>
          </div>

          <DecisionNodeLabels
            classes={classes}
            taskDecisionActions={taskDecisionActions}
            setTaskInfo={(value, name) =>
              updateData({ target: { name, value } })
            }
          />
        </div>
      )}
    </>
  );
};

export default DataHasDecision;
