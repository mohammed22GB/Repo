import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Collapse,
  TextField,
  FormControlLabel,
  Switch,
} from "@material-ui/core";
import RichTextEditor from "./common/RichTextEditor";
import SelectOnSteroids from "./common/SelectOnSteroids";
import ScheduleActivity from "../Helpers/ScheduleActivity";
import { useStyles } from "../Helpers/rightSidebarStyles";
import { v4 } from "uuid";
import { setStateTimeOut } from "../../../../../../../common/helpers/helperFunctions";
import PropertyFieldLabel from "./common/PropertyFieldLabel";

const MailActions = ({
  show,
  setTaskInfo,
  activeTask,
  properties,
  variables,
  hideTarget = false,
  hideCC = false,
  hideFrom = false,
  optionalSubject = false,
  optionalBody = false,
}) => {
  const _convertBody = (content, wh) => {
    if (wh === "to-id") {
      if (
        !!content &&
        content.slice(0, 3) === "<p>" &&
        content.slice(-4) === "</p>"
      ) {
        content = !!content ? content.slice(3, -4) : "";
      }

      setStateTimeOut(setIndicator, true, false);
      setTaskInfo(content, "emailBody");
    } else if (wh === "from-id") {
      return !!content ? content + "&nbsp;" : "&nbsp;";
    }
  };

  const classes = useStyles(makeStyles);

  const [indicator, setIndicator] = useState(false);
  const [heldBody, setHeldBody] = useState(properties?.emailBody);
  const [fieldsKey, setFieldsKey] = useState("-");

  useEffect(() => {
    setFieldsKey(v4());
  }, [activeTask?.id]);

  return (
    <Collapse in={show}>
      {!hideTarget && (
        <div className={classes.sectionEntry}>
          <PropertyFieldLabel
            propertyFieldname={"Email target"}
            propertyReference={!properties?.emailTarget?.length}
            isFieldOptional={optionalBody}
          />
          <SelectOnSteroids
            source="emailTarget"
            variables={variables}
            // onChange={setTaskInfo}
            onChange={(v) => setTaskInfo(v, "emailTarget")}
            value={properties?.emailTarget}
          />
        </div>
      )}

      {!hideCC && (
        <div className={classes.sectionEntry}>
          <PropertyFieldLabel propertyFieldname={"Cc"} />
          <SelectOnSteroids
            source="emailCC"
            variables={variables}
            // onChange={setTaskInfo}
            onChange={(v) => setTaskInfo(v, "emailCC")}
            value={properties?.emailCC}
          />
        </div>
      )}

      <div className={classes.sectionEntry}>
        <PropertyFieldLabel
          propertyFieldname={"Email subject"}
          propertyReference={!properties?.emailSubject}
          isFieldOptional={optionalSubject}
        />
        <TextField
          key={`${fieldsKey}-1`}
          variant="outlined"
          size="small"
          fullWidth
          placeholder="Enter Subject"
          InputProps={{
            className: classes.input,
          }}
          defaultValue={properties?.emailSubject || ""}
          onChange={(e) => setTaskInfo(e, "emailSubject")}
        />
      </div>

      <div className={classes.sectionEntry}>
        <PropertyFieldLabel
          propertyFieldname={"Email body"}
          propertyReference={!heldBody?.trim()}
          isFieldOptional={optionalBody}
          savedMessage={true}
          onSave={_convertBody}
          heldBody={heldBody}
          messageSavedIndicator={indicator}
        />
        <RichTextEditor
          variables={variables}
          emailBody={_convertBody(properties?.emailBody, "from-id")}
          holdBody={(content) => setHeldBody(content)}
        />
      </div>

      {/* {!hideFrom && ( */}
      {false && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            margin: "10px 0",
          }}
        >
          <FormControlLabel
            classes={{
              root: classes.switchLabel,
              label: classes.sectionTitle,
            }}
            control={
              <Switch
                key={!!properties?.customEmailFrom || false}
                defaultChecked={!!properties?.customEmailFrom || false}
                onChange={(e) => setTaskInfo(e, "customEmailFrom")}
                name="checkedB"
                color="primary"
                size="small"
              />
            }
            label="Specify From address [connection details required]"
            labelPlacement="start"
          />
        </div>
      )}

      {!hideFrom && (
        <Collapse in={!!properties?.customEmailFrom}>
          <div className={classes.matchingFields}>
            <div className={classes.sectionEntry}>
              <Typography gutterBottom className={classes.sectionTitle}>
                From address
              </Typography>
              <TextField
                key={`${fieldsKey}-2`}
                variant="outlined"
                size="small"
                fullWidth
                placeholder="Enter Subject"
                InputProps={{
                  className: classes.input,
                }}
                defaultValue={properties?.emailFrom || ""}
                onChange={(e) => setTaskInfo(e, "emailFrom")}
              />
            </div>
          </div>
        </Collapse>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          margin: "10px 0px 5px",
        }}
      >
        <FormControlLabel
          classes={{
            root: classes.switchLabel,
            label: classes.sectionTitle,
          }}
          control={
            <Switch
              key={activeTask?.useCustomTrigger}
              defaultChecked={activeTask?.useCustomTrigger}
              onChange={(e) => setTaskInfo(e, "useCustomTrigger")}
              name="checkedC"
              color="primary"
              size="small"
            />
          }
          label="Schedule Mail"
          labelPlacement="start"
        />
      </div>

      {activeTask?.useCustomTrigger ? (
        <ScheduleActivity
          activeTask={activeTask}
          classes={classes}
          saveScheduleInfo={setTaskInfo}
          variables={variables}
          from={"emailTask"}
        />
      ) : null}
    </Collapse>
  );
};

export default MailActions;
