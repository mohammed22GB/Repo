import React, { useEffect, useState } from "react";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from "@material-ui/core";

const OracleDBForm = ({
  classes,
  step,
  type,
  availableResourcesList,
  selectedResourcesList,
  updateSelectedList,
  updatedData,
  setFormCompleted,
  fieldValue,
  setFieldValue,
}) => {
  useEffect(() => {
    let subscribe = true;
    const mapValueToState = () => {
      /* Setting the value of the field. */
      subscribe &&
        setFieldValue((data) => ({
          ...data,
          name: updatedData?.name || "",
          user: updatedData?.user || "",
          password: updatedData?.password || "",
          connectionString: updatedData?.connectionString || "",
          // selectedSheetInt: updatedData?.properties?.userInfo?.email,
        }));
    };
    mapValueToState();

    return () => {
      subscribe = false;
    };
  }, []);

  /* Checking if the fieldValue.name is empty or not. If it is empty, it will set the formCompleted to
false. If it is not empty, it will set the formCompleted to true. */
  useEffect(() => {
    setFormCompleted(
      !!fieldValue.name &&
        !!fieldValue.user &&
        !!fieldValue.password &&
        !!fieldValue.connectionString
    );
  }, [fieldValue]);

  return (
    <>
      {step === 1 && type === "OracleDB" ? (
        <FormGroup>
          <Typography className={classes.formLabels} gutterBottom>
            Name
          </Typography>
          <TextField
            className={classes.FormTextField}
            size="small"
            name="name"
            inputMode="text"
            onChange={(e) =>
              setFieldValue({ ...fieldValue, name: e.target.value })
            }
            fullWidth
            FormHelperTextProps={{
              className: classes.helperText,
            }}
            required
            value={fieldValue.name}
            placeholder={`Enter here`}
            type="text"
            variant="outlined"
            inputProps={{
              className: classes.inputColor,
              autoComplete: "new-int",
              form: {
                autoComplete: "off",
              },
            }}
          />

          <Typography className={classes.formLabels} gutterBottom>
            User
          </Typography>

          <TextField
            className={classes.FormTextField}
            size="small"
            name="user"
            inputMode="text"
            onChange={(e) =>
              setFieldValue({ ...fieldValue, user: e.target.value })
            }
            fullWidth
            FormHelperTextProps={{
              className: classes.helperText,
            }}
            required
            value={fieldValue.user}
            placeholder={`Enter here`}
            type="text"
            variant="outlined"
            inputProps={{
              className: classes.inputColor,
              autoComplete: "new-int",
              form: {
                autoComplete: "off",
              },
            }}
          />
          <Typography className={classes.formLabels} gutterBottom>
            Connection string
          </Typography>

          <TextField
            className={classes.FormTextField}
            size="small"
            name="connectionString"
            inputMode="text"
            onChange={(e) =>
              setFieldValue({ ...fieldValue, connectionString: e.target.value })
            }
            fullWidth
            FormHelperTextProps={{
              className: classes.helperText,
            }}
            required
            value={fieldValue.connectionString}
            placeholder={`Enter here`}
            type="text"
            variant="outlined"
            inputProps={{
              className: classes.inputColor,
              autoComplete: "new-int",
              form: {
                autoComplete: "off",
              },
            }}
          />
          <Typography className={classes.formLabels} gutterBottom>
            Password
          </Typography>

          <TextField
            className={classes.FormTextField}
            size="small"
            name="password"
            inputMode="text"
            onChange={(e) =>
              setFieldValue({ ...fieldValue, password: e.target.value })
            }
            fullWidth
            FormHelperTextProps={{
              className: classes.helperText,
            }}
            required
            value={fieldValue.password}
            placeholder={`Enter here`}
            type="text"
            variant="outlined"
            inputProps={{
              className: classes.inputColor,
              autoComplete: "new-int",
              form: {
                autoComplete: "off",
              },
            }}
          />
        </FormGroup>
      ) : step === 2 && type === "OracleDB" ? (
        <div>
          <Typography className={classes.formLabels} gutterBottom>
            Select the collections to integrate
          </Typography>
          <div className="selectResources">
            <div style={{ marginTop: 15, marginBottom: 10 }}>
              <FormGroup>
                {availableResourcesList?.map((sheetProps, idx) => {
                  return (
                    <FormControlLabel
                      key={idx}
                      control={
                        <Checkbox
                          onChange={() => updateSelectedList({ sheetProps })}
                          checked={selectedResourcesList
                            .map(({ name }) => name)
                            ?.includes(sheetProps.name)}
                        />
                      }
                      label={sheetProps.name}
                    />
                  );
                })}
              </FormGroup>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default OracleDBForm;
