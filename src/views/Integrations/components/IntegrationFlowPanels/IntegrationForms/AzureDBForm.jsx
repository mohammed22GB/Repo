import React, { useEffect, useState } from "react";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from "@material-ui/core";

const AzureDBForm = ({
  classes,
  step,
  type,
  availableResourcesList,
  selectedResourcesList,
  updateSelectedList,
  setFormCompleted,
  updatedData,
  fieldValue,
  setFieldValue,
}) => {
  /**
   * When the user types in the input field, the value of the input field is set to the value of the
   * field that the user is typing in.
   */

  useEffect(() => {
    let subscribe = true;
    const mapValueToState = () => {
      /* Setting the value of the field. */
      subscribe &&
        setFieldValue((data) => ({
          ...data,
          name: updatedData?.name || "",
          serverType: updatedData?.serverType || "",
          serverName: updatedData?.serverName || "",
          authentication: updatedData?.authencation || "",
          password: updatedData?.password || "",
          loginUsername: updatedData?.loginUsername,
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
        !!fieldValue.serverType &&
        !!fieldValue.serverName &&
        !!fieldValue.authentication &&
        !!fieldValue.password &&
        !!fieldValue.loginUsername
    );
  }, [fieldValue]);

  return (
    <>
      {step === 1 && type === "AzureDB" ? (
        <div>
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
            value={fieldValue.name || ""}
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
            Server type
          </Typography>
          <TextField
            className={classes.FormTextField}
            size="small"
            name="serverType"
            inputMode="text"
            onChange={(e) =>
              setFieldValue({ ...fieldValue, serverType: e.target.value })
            }
            fullWidth
            FormHelperTextProps={{
              className: classes.helperText,
            }}
            required
            value={fieldValue.serverType || ""}
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
          <Typography className={classes.formLabels} gutterBottom></Typography>
          Server Name
          <TextField
            className={classes.FormTextField}
            size="small"
            name="serverName"
            inputMode="text"
            onChange={(e) =>
              setFieldValue({ ...fieldValue, serverName: e.target.value })
            }
            fullWidth
            FormHelperTextProps={{
              className: classes.helperText,
            }}
            required
            value={fieldValue.serverName || ""}
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
            Authentication
          </Typography>
          <TextField
            className={classes.FormTextField}
            size="small"
            name="authentication"
            inputMode="text"
            onChange={(e) =>
              setFieldValue({ ...fieldValue, authentication: e.target.value })
            }
            fullWidth
            FormHelperTextProps={{
              className: classes.helperText,
            }}
            required
            value={fieldValue.authentication || ""}
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
            Login username
          </Typography>
          <TextField
            className={classes.FormTextField}
            size="small"
            name="loginUserName"
            inputMode="text"
            onChange={(e) =>
              setFieldValue({ ...fieldValue, loginUsername: e.target.value })
            }
            fullWidth
            FormHelperTextProps={{
              className: classes.helperText,
            }}
            required
            value={fieldValue.loginUsername || ""}
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
            value={fieldValue.password || ""}
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
        </div>
      ) : step === 2 && type === "AzureDB" ? (
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

export default AzureDBForm;
