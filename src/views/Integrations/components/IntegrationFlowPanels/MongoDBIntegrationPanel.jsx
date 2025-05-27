import { useEffect, useState } from "react";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { useStyles } from "../../utils/IntegrationsPanelStyle";
import PanelBody from "../PanelBody";
import {
  getIntegrationResourcesListAPI,
  newIntegrationAPI,
  updateIntegrationAPI,
} from "../../utils/integrationsAPIs";
import { errorToastify, successToastify } from "../../../common/utils/Toastify";

const MongoDBIntegrationPanel = ({
  changeIntegrationPage,
  updatedData,
  updateList,
}) => {
  const classes = useStyles(makeStyles);
  const steps = 2;
  const [fieldValue, setFieldValue] = useState({});
  const [step, setStep] = useState(1);
  const [activeId, setActiveId] = useState(null);
  const [availableResourcesList, setAvailableResourcesList] = useState([]);
  const [selectedResourcesList, setSelectedResourcesList] = useState([]);
  const [formCompleted, setFormCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (step === 0) {
      changeIntegrationPage("");
    }
  }, [step, changeIntegrationPage]);

  useEffect(() => {
    setFieldValue({
      name: updatedData?.name,
      database: updatedData?.properties?.database,
      url: updatedData?.properties?.connectionCredentials?.url,
      user: updatedData?.properties?.connectionCredentials?.user,
    });
    setActiveId(updatedData?.id);

    setSelectedResourcesList(updatedData?.properties?.resources || []);

    setStep(1);
  }, [updatedData]);

  useEffect(() => {
    setFormCompleted(
      !!fieldValue.name &&
        !!fieldValue.database &&
        !!fieldValue.url &&
        !!fieldValue.user &&
        !!fieldValue.password
    );
  }, [fieldValue]);

  const progressStep = async (e) => {
    !!e.target && e.preventDefault();

    if (e === 0) {
      //  if integration terminated
      setStep(0);
    } else if (step === 1) {
      //  if integration is still progressing... make connection... first restructure payload
      setLoading(true);
      const payload = {
        name: fieldValue.name,
        type: "DatabaseIntegration",
        group: "data",
        properties: {
          connectionCredentials: {
            url: fieldValue.url,
            user: fieldValue.user,
            password: fieldValue.password,
          },
          type: "MongoDB",
          database: fieldValue.database,
        },
      };

      let sendData,
        _id = activeId;
      try {
        if (!activeId) {
          //  if NEW integration
          sendData = await newIntegrationAPI({ data: payload });
          if (sendData?._meta?.success) {
            _id = sendData?.data.id;
            setActiveId(_id);
          }
        } else {
          //  if UPDATE integration
          sendData = await updateIntegrationAPI({
            id: activeId,
            data: payload,
          }); //  send to backend
        }

        if (sendData?._meta?.success) {
          successToastify(sendData?._meta?.message);

          //  update master list on main UI
          updateList(sendData.data);

          //  move to next step
          setStep(step + 1);

          //  make call for resources
          const getList = await getIntegrationResourcesListAPI(_id);

          //  load resources list into state and UI
          if (getList?._meta?.success) {
            const aList = getList?.data || [];
            setAvailableResourcesList(aList);
          }
        } else {
          errorToastify(sendData?._meta?.message);
        }
      } catch (e) {
        errorToastify(e.response?.data?._meta?.error?.message || e.message);
      }
      setLoading(false);
    } else if (steps <= step) {
      //  if "Finish" is clicked, end of integration
      //  send selected resources list
      try {
        const sendUpdateData = await updateIntegrationAPI({
          id: activeId,
          data: { properties: { resources: selectedResourcesList } },
        }); //  send to backend
        if (sendUpdateData?._meta?.success) {
          successToastify(sendUpdateData?._meta?.message);

          //  update main interface as completed integration
          updateList(sendUpdateData.data);
        } else {
          errorToastify(sendUpdateData?._meta?.message);
        }
      } catch (e) {
        errorToastify(e.response?.data?._meta?.error?.message || e.message);
      }

      //  go to home
      setLoading(false);
      setStep(0);
    }
  };

  const updateSelectedList = (selResource) => {
    const resources = [...selectedResourcesList];
    const resourceIndex = resources.findIndex(
      (resource) => resource.name === selResource.name
    );
    if (resourceIndex === -1) {
      resources.push(selResource);
    } else {
      resources.splice(resourceIndex, 1);
    }
    setSelectedResourcesList(resources);
  };

  /* const typeOutList = () => (
    <div style={{ marginTop: 15, marginBottom: 10 }}>
      { selectedResourcesList.map((c, i) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <TextField 
            key={i} 
            variant="outlined" 
            value={c} 
            onChange={(e) => updateSelectedList(e.target.value, i)} 
            InputProps={{
              className: classes.resoureEntry,
            }}
          />
          <IconButton
            aria-label="Close"
            style={{ marginLeft: 5 }}
            onClick={() => removeFromList(i) }
          >
            <Delete style={{ fontSize: 18 }} />
          </IconButton>
        </div>
      ))}
    </div>
  )

  const addToList = () => {
    const list = [ ...selectedResourcesList ];
    list.push("");
    setSelectedResourcesList(list);
  }
  const updateSelectedList = (text, i) => {
    const list = [ ...selectedResourcesList ];
    list[i] = text;
    setSelectedResourcesList(list);
  }
  const removeFromList = (i) => {
    const list = [ ...selectedResourcesList ];
    list.splice(i, 1);
    setSelectedResourcesList(list);
  } */

  return (
    <PanelBody
      title="MongoDB"
      mode={!!updatedData ? "Update" : "New"}
      step={step}
      setStep={progressStep}
      steps={steps}
      isResourceSelected={!!selectedResourcesList?.length}
      formCompleted={formCompleted}
      loading={loading}
    >
      <div className={classes.sideDialogMain}>
        {step === 1 && (
          <>
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
              // error={hasError("name")}
              fullWidth
              // helperText={hasError("name") ? "Invalid Name" : null}
              FormHelperTextProps={{
                className: classes.helperText,
              }}
              required
              value={fieldValue.name || ""}
              placeholder="Give new integration a name"
              type="text"
              // disabled={!!ppty.default}
              variant="outlined"
              inputProps={{
                className: classes.inputColor,
                autoComplete: "new-password",
                form: {
                  autoComplete: "off",
                },
              }}
            />
            <Typography className={classes.formLabels} gutterBottom>
              Database name
            </Typography>
            <TextField
              className={classes.FormTextField}
              size="small"
              name="database"
              inputMode="text"
              onChange={(e) =>
                setFieldValue({ ...fieldValue, database: e.target.value })
              }
              // error={hasError("name")}
              fullWidth
              // helperText={hasError("name") ? "Invalid Name" : null}
              FormHelperTextProps={{
                className: classes.helperText,
              }}
              required
              value={fieldValue.database || ""}
              placeholder={`Enter here`}
              type="text"
              // disabled={!!ppty.default}
              variant="outlined"
              inputProps={{
                className: classes.inputColor,
                autoComplete: "new-password",
                form: {
                  autoComplete: "off",
                },
              }}
            />
            <Typography className={classes.formLabels} gutterBottom>
              Connection URL
            </Typography>
            <TextField
              className={classes.FormTextField}
              size="small"
              name="url"
              inputMode="text"
              onChange={(e) =>
                setFieldValue({ ...fieldValue, url: e.target.value })
              }
              // error={hasError("name")}
              fullWidth
              // helperText={hasError("name") ? "Invalid Name" : null}
              FormHelperTextProps={{
                className: classes.helperText,
              }}
              required
              value={fieldValue.url || ""}
              placeholder={`Enter here`}
              type="text"
              // disabled={!!ppty.default}
              variant="outlined"
              inputProps={{
                className: classes.inputColor,
                autoComplete: "new-password",
                form: {
                  autoComplete: "off",
                },
              }}
            />
            <Typography className={classes.formLabels} gutterBottom>
              Username
            </Typography>
            <TextField
              className={classes.FormTextField}
              size="small"
              name="user"
              inputMode="text"
              onChange={(e) =>
                setFieldValue({ ...fieldValue, user: e.target.value })
              }
              // error={hasError("name")}
              fullWidth
              // helperText={hasError("name") ? "Invalid Name" : null}
              FormHelperTextProps={{
                className: classes.helperText,
              }}
              required
              placeholder={`Enter here`}
              type="text"
              // disabled={!!ppty.default}
              variant="outlined"
              inputProps={{
                className: classes.inputColor,
                autoComplete: "new-password",
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
              // error={hasError("name")}
              fullWidth
              FormHelperTextProps={{
                className: classes.helperText,
              }}
              required
              placeholder={`Enter here`}
              type="password"
              variant="outlined"
              inputProps={{
                className: classes.inputColor,
                autoComplete: "new-password",
                form: {
                  autoComplete: "off",
                },
              }}
            />
          </>
        )}
        {step === 2 && (
          <>
            <Typography
              className={classes.formLabels}
              // style={idx === 0 ? { paddingTop: 0 } : {}}
              gutterBottom
            >
              Select the collections to integrate
            </Typography>
            <div className="selectResources">
              <div style={{ marginTop: 15, marginBottom: 10 }}>
                <FormGroup>
                  {availableResourcesList?.map((resource, i) => (
                    <FormControlLabel
                      key={i}
                      control={
                        <Checkbox
                          onChange={() => updateSelectedList(resource)}
                          checked={selectedResourcesList
                            ?.map((res) => res.name)
                            .includes(resource.name)}
                        />
                      }
                      label={resource.name}
                    />
                  ))}
                </FormGroup>
              </div>
            </div>
          </>
        )}
      </div>
    </PanelBody>
  );
};

export default MongoDBIntegrationPanel;
