import { useEffect, useState } from "react";
import {
  Checkbox,
  Collapse,
  FormControlLabel,
  FormGroup,
  Switch,
  Typography,
} from "@material-ui/core";
import { useDispatch } from "react-redux";
import { v4 } from "uuid";
import { variableGroups } from "../../../../utils/constants";
import { updateTaskVariables } from "../../../../../utils/workflowHelpers";

const ExecutionVariables = ({
  variables,
  activeTask,
  activeTaskId,
  setTaskInfo,
  classes,
}) => {
  const dispatch = useDispatch();
  const [executorVars, setExecutorVars] = useState();
  const [uniquekey, setUniquekey] = useState("");
  const [upgradeSubscribed, setUpgradeSubscribed] = useState(false);
  // const { executorVars } = properties;

  useEffect(() => {
    const execVars = (
      variables?.filter(
        (variable) =>
          variable?.info?.group === variableGroups.EXECUTOR &&
          variable?.info?.parent === activeTask?.taskId
      ) || []
    )?.map((variable) => ({
      title: variable?.info?.matching?.valueSourceInput,
      name: variable?.info?.name,
      dataType: variable?.info?.dataType,
      type: "executor",
    }));

    setExecutorVars(execVars);
  }, [variables, activeTask]);

  useEffect(() => {
    setUniquekey(v4());

    //  for backward compatibility with apps
    //  created before executorVariablesConfig and
    //  to upgrade to executorVariablesConfig mode
    if (
      !!activeTask?.properties?.saveExecutorVariables &&
      activeTask?.executorVariablesConfig?.upgradedOldVersion === false &&
      !upgradeSubscribed
    ) {
      setTaskInfo(
        {
          "executorVariablesConfig.active": true,
          "executorVariablesConfig.upgradedOldVersion": true,
        },
        "executorVariablesConfig",
        true,
        "refreshTask"
      );

      setUpgradeSubscribed(true);
    }
  }, [activeTask]);

  const handleChange = ({ e, dataType, name, title }) => {
    let newVars = [...executorVars] || [];

    if (e.target.checked === true) {
      const newVar = {
        title,
        name,
        dataType: [dataType],
        type: "executor",
      };
      newVars.push(newVar);
    } else {
      newVars = [...executorVars].filter((evar) => evar?.title !== title);
    }

    setExecutorVars(newVars);
    dispatch(updateTaskVariables(activeTaskId, newVars));
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "solid 1px #eee",
          padding: 10,
        }}
      >
        <FormControlLabel
          classes={{
            root: classes.switchLabel,
            label: classes.sectionTitle,
          }}
          control={
            <Switch
              key={!!activeTask?.executorVariablesConfig?.active}
              defaultChecked={!!activeTask?.executorVariablesConfig?.active}
              onChange={(e) => setTaskInfo(e, "executorVariablesConfig.active")}
              name="checkedC"
              color="primary"
              size="small"
            />
          }
          label="Save execution variable"
          labelPlacement="start"
        />
      </div>

      <Collapse
        in={!!activeTask?.executorVariablesConfig?.active}
        style={{ padding: "0 10px" }}
      >
        <FormGroup data-testid="execution-variables-checkboxes">
          <FormControlLabel
            control={
              <Checkbox
                name="hello"
                size={"small"}
                color="primary"
                defaultChecked={
                  !!executorVars?.find((evar) => evar?.title === "name")
                }
                key={`${uniquekey}-1`}
                onChange={(e) =>
                  handleChange({
                    e,
                    name: `Exec. name - [${activeTask?.name || "..."}]`,
                    dataType: "text",
                    title: "name",
                  })
                }
              />
            }
            label={
              <Typography style={{ fontSize: 12 }}>{`Exec. name - [${
                activeTask?.name || "..."
              }]`}</Typography>
            }
            labelPlacement="end"
            className={"checkbox-executor"}
          />
          <FormControlLabel
            control={
              <Checkbox
                size={"small"}
                color="primary"
                defaultChecked={
                  !!executorVars?.find((evar) => evar?.title === "email")
                }
                key={`${uniquekey}-2`}
                onChange={(e) =>
                  handleChange({
                    e,
                    name: `Exec. email - [${activeTask?.name || "..."}]`,
                    dataType: "email",
                    title: "email",
                  })
                }
              />
            }
            label={
              <Typography style={{ fontSize: 12 }}>{`Exec. email - [${
                activeTask?.name || "..."
              }]`}</Typography>
            }
            labelPlacement="end"
            className={"checkbox-executor"}
          />
          <FormControlLabel
            control={
              <Checkbox
                size={"small"}
                color="primary"
                defaultChecked={
                  !!executorVars?.find((evar) => evar?.title === "date")
                }
                key={`${uniquekey}-3`}
                onChange={(e) =>
                  handleChange({
                    e,
                    name: `Exec. time - [${activeTask?.name || "..."}]`,
                    dataType: "date",
                    title: "date",
                  })
                }
              />
            }
            label={
              <Typography style={{ fontSize: 12 }}>{`Exec. time - [${
                activeTask?.name || "..."
              }]`}</Typography>
            }
            labelPlacement="end"
            className={["controlLabel", "checkbox-executor"]}
          />
        </FormGroup>
      </Collapse>
    </>
  );
};

export default ExecutionVariables;
