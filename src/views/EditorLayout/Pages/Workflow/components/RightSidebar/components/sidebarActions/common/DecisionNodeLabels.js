import React, { useEffect, useState } from "react";
import { Typography, Select, MenuItem } from "@material-ui/core";
import { INVALID_FIELD_LABEL_STYLE } from "../../../../utils/constants";
import { v4 } from "uuid";

const DecisionNodeLabels = ({ classes, taskDecisionActions, setTaskInfo }) => {
  const [actionZeroKey, setActionZeroKey] = useState(v4());
  const [actionOneKey, setActionOneKey] = useState(v4());

  useEffect(() => {
    setActionZeroKey(v4());
    setActionOneKey(v4());
  }, [taskDecisionActions]);

  const _decisionActioning = (val, index) => {
    let oldList = [...(taskDecisionActions || [])];
    const otherValue = val.target.value === "true" ? "false" : "true";

    const newList = [
      { ...oldList[0], label: index === 0 ? val.target.value : otherValue },
      { ...oldList[1], label: index === 1 ? val.target.value : otherValue },
    ];

    setTaskInfo(newList, "decisionActions");
    setActionZeroKey(v4());
    setActionOneKey(v4());
  };

  return (
    <div className={classes.sectionEntry}>
      <Typography
        gutterBottom
        className={classes.sectionTitle}
        style={
          !!taskDecisionActions?.find((action) => !action.label)
            ? INVALID_FIELD_LABEL_STYLE
            : {}
        }
      >
        Select label*
      </Typography>
      <div className={classes.pair}>
        <div className={classes.pair}>
          <div
            style={{
              width: 7,
              flex: "none",
              backgroundColor: "#3dd60b",
              height: "2.85em",
            }}
          ></div>
          <Select
            key={actionZeroKey}
            variant="outlined"
            size="small"
            fullWidth
            placeholder="Select label"
            classes={{
              root: classes.select,
              outlined: classes.selected,
            }}
            onChange={(e) => _decisionActioning(e, 0)}
            value={taskDecisionActions?.[0]?.label}
          >
            <MenuItem value="true">
              True
              <span className={classes.spaceSpanInLI}>
                {`=> Label this branch "True"`}
              </span>
            </MenuItem>
            <MenuItem value="false">
              False
              <span className={classes.spaceSpanInLI}>
                {`=> Label this branch "False"`}
              </span>
            </MenuItem>
          </Select>
        </div>
        <div className={classes.pair}>
          <div
            style={{
              width: 7,
              flex: "none",
              backgroundColor: "#9b0bd6",
              height: "2.85em",
            }}
          ></div>
          <Select
            key={actionOneKey}
            variant="outlined"
            size="small"
            fullWidth
            placeholder="Other label"
            classes={{
              root: classes.select,
              outlined: classes.selected,
            }}
            onChange={(e) => _decisionActioning(e, 1)}
            value={taskDecisionActions?.[1]?.label}
            // disabled
          >
            <MenuItem value="true">
              True
              <span className={classes.spaceSpanInLI}>
                {`=> Label this branch "True"`}
              </span>
            </MenuItem>
            <MenuItem value="false">
              False
              <span className={classes.spaceSpanInLI}>
                {`=> Label this branch "False"`}
              </span>
            </MenuItem>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default DecisionNodeLabels;
