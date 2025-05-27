import React from "react";
import { MenuItem } from "@material-ui/core";
import { ArrowRight } from "@material-ui/icons";

/**
 * It takes an array of objects, and returns an array of MenuItems.
 *
 * The MenuItems are grouped by the value of the object's parent property.
 *
 * The MenuItems are sorted by the value of the object's parent property.
 *
 * The MenuItems are sorted by the value of the object's dataType property.
 *
 * The MenuItems are sorted by the value of the object's name property.
 *
 * The MenuItems are sorted by the value of the object's id property.
 *
 * The MenuItems are sorted by the value of the object's type property.
 *
 *
 * The MenuItems are
 * @returns An array of MenuItems.
 */
const VariablesMenuItems = ({
  variables,
  classes,
  workflowCanvas,
  type = null,
  excludeType = "task", //  "task" | "input"
  exclude = [],
}) => {
  const Formation = () => {
    const uniq = [];
    const elems = [];

    const parents = !!variables ? variables.map((v) => v?.info?.parent) : [];
    parents.forEach((v) => {
      !uniq.includes(v) && uniq.push(v);
    });

    const workflowTasks = {};

    workflowCanvas.forEach((canvasItem) => {
      if (canvasItem.type && !canvasItem.source) {
        workflowTasks[canvasItem.id] = canvasItem;
      }
    });

    uniq.forEach((u) => {
      elems.push(
        <MenuItem value="no-choose" disabled key={u}>
          <span style={{ textTransform: "capitalize" }}>
            {workflowTasks?.[u]?.type}
          </span>
          : {workflowTasks?.[u]?.name}
        </MenuItem>
      );

      variables
        ?.filter(
          (v) =>
            v?.info?.parent === u &&
            (!type || (type && v.info?.dataType.includes(type))) &&
            (excludeType !== "task" || !exclude.includes(v?.info?.parent)) &&
            (excludeType !== "input" ||
              !exclude.includes(v?.info?.matching?.valueSourceInput))
        )
        .forEach((v, i) => {
          elems.push(
            <MenuItem value={v.id} key={v.id}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: "1em",
                }}
              >
                <ArrowRight style={{ fontSize: 18 }} />
                <div>{v.info?.name}</div>
              </div>
            </MenuItem>
          );
        });
    });

    return elems.map((el) => el);
  };

  return Formation();
};

export default VariablesMenuItems;
