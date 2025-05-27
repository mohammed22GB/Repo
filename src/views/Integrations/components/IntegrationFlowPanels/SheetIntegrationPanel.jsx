import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";

import { useStyles } from "../../utils/IntegrationsPanelStyle";
import PanelBody from "../PanelBody";
import { successToastify } from "../../../common/utils/Toastify";
import useCustomMutation from "../../../common/utils/CustomMutation";
import {
  getIntegrationResourcesListAPI,
  newIntegrationAPI,
  updateIntegrationAPI,
} from "../../utils/integrationsAPIs";
import useCustomQuery from "../../../common/utils/CustomQuery";

const SheetIntegrationPanel = ({
  changeIntegrationPage,
  updatedData,
  updateList,
  integrations,
}) => {
  const classes = useStyles(makeStyles);
  const steps = 2;
  const [fieldValue, setFieldValue] = useState({
    name: "",
    selectedSheetInt: "",
  });

  const [step, setStep] = useState(1);
  const [activeId, setActiveId] = useState(null);
  const [availableResourcesList, setAvailableResourcesList] = useState([]);
  const [selectedResourcesList, setSelectedResourcesList] = useState([]);
  const [formCompleted, setFormCompleted] = useState(false);
  const [allIntegration, setIntegrationEmails] = useState([]);
  const [disableDropDown, setDisableDropDown] = useState(false);
  const [completedStep, setCompletedStep] = useState(false);

  const {
    integrationReducer: { editAccountFlag },
  } = useSelector((state) => state);

  const newIntGoogleSheetSuccess = ({ data }) => {
    if (
      step === 1 &&
      fieldValue?.selectedSheetInt.toLowerCase() !== "add_new" &&
      !editAccountFlag
    ) {
      updateList(data?.data);
      setActiveId(() => data?.data?.id);
      return setStep((prevStep) => prevStep + 1);
    } else {
      window.location.href = data.data?.redirect;
    }
  };

  const updateIntegrationAPISuccess = ({ data }) => {
    successToastify(data?._meta?.message);
    updateList(data?.data);

    if (completedStep) {
      setCompletedStep(() => false);
      setStep(() => 0);
      return;
    } else {
      setStep((prev) => prev + 1);
      setCompletedStep(() => false);
    }
  };

  const getIntegrationResourcesListAPISuccess = ({ data }) => {
    const sheetsList = data?.data.map((sheets) => ({
      name: sheets.name,
      id: sheets.id,
    }));
    setAvailableResourcesList(sheetsList);
  };

  const { mutate: newIntSheetMutate } = useCustomMutation({
    apiFunc: newIntegrationAPI,
    onSuccess: newIntGoogleSheetSuccess,
    retries: 0,
  });

  const { mutate: updateIntegrationAPIMutate } = useCustomMutation({
    apiFunc: updateIntegrationAPI,
    onSuccess: updateIntegrationAPISuccess,
    retries: 0,
  });

  useCustomQuery({
    apiFunc: getIntegrationResourcesListAPI,
    queryKey: ["getResources", { id: activeId }],
    enabled: step === 2 && true,
    onSuccess: getIntegrationResourcesListAPISuccess,
  });

  const progressStep = async (e) => {
    e.preventDefault();

    if (e === 0) {
      setStep(0);
      return;
    } else if (
      step === 1 &&
      ["add_new"].includes(fieldValue?.selectedSheetInt.toLowerCase()) &&
      !editAccountFlag
    ) {
      const data = {
        name: fieldValue.name,
        type: "GoogleApiIntegration",
        group: "data",
        redirectUrl: `${process.env.REACT_APP_BASE_URL}/integrations`,
        properties: {
          type: "Google Sheet",
        },
      };

      newIntSheetMutate({
        data,
      });
    } else if (
      step === 1 &&
      fieldValue?.selectedSheetInt.toLowerCase() !== "add_new" &&
      !editAccountFlag
    ) {
      const data = {
        name: fieldValue.name,
        email: fieldValue.selectedSheetInt,
        type: "GoogleApiIntegration",
        group: "data",
        redirectUrl: window.location.href,
        properties: {
          type: "Google Sheet",
        },
      };

      newIntSheetMutate({
        data,
      });
    } else if (
      step === 1 &&
      fieldValue?.selectedSheetInt.toLowerCase() !== "add_new" &&
      editAccountFlag
    ) {
      const data = {
        name: fieldValue.name,
        email: fieldValue?.selectedSheetInt,
        type: "GoogleApiIntegration",
        group: "data",
        properties: {
          type: "Google Sheet",
        },
      };
      updateIntegrationAPIMutate({ id: activeId, data });
    } else if (steps === step) {
      const data = {
        name: fieldValue.name,
        properties: {
          resources: selectedResourcesList,
        },
      };

      setCompletedStep(() => true);
      updateIntegrationAPIMutate({ id: activeId, data });
      setDisableDropDown(() => false);
      setStep(0);
      return;
    }

    return;
  };

  const updateSelectedList = ({ sheetProps }) => {
    const sheetLists = [...selectedResourcesList];
    const sheetIdx = sheetLists.findIndex(
      (sheets) => sheets?.name === sheetProps?.name
    );

    if (sheetIdx === -1) {
      sheetLists.push(sheetProps);
    } else {
      sheetLists.splice(sheetIdx, 1);
    }
    setSelectedResourcesList(sheetLists);
  };

  const handleChange = (e) => {
    setFieldValue((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    if (step === 0) {
      changeIntegrationPage("");
    }
  }, [step, changeIntegrationPage, fieldValue.selectedSheetInt]);

  useEffect(() => {
    const accountsEmail = integrations.length > 0 && [
      ...new Set(
        integrations
          .filter(
            ({ type, properties: { type: propertyType } }) =>
              type === "GoogleApiIntegration" && propertyType === "Google Sheet"
          )
          .map(({ properties: { userInfo } }) => userInfo && userInfo?.email)
      ),
    ];

    setIntegrationEmails(() => accountsEmail);

    setActiveId(updatedData?.id);

    setFieldValue((data) => ({
      ...data,
      name: updatedData?.name,
      selectedSheetInt: updatedData?.properties?.userInfo?.email,
    }));

    setSelectedResourcesList(() => updatedData?.properties?.resources || []);
    editAccountFlag && setDisableDropDown(() => true);
  }, [updatedData, integrations, editAccountFlag]);

  useEffect(() => {
    setFormCompleted(!!fieldValue.name);
  }, [fieldValue]);

  return (
    <PanelBody
      title="Google Sheet"
      mode={!!updatedData ? "Update" : "New"}
      step={step}
      setStep={progressStep}
      steps={steps}
      isResourceSelected={!!selectedResourcesList?.length}
      formCompleted={formCompleted}
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
              onChange={(e) => handleChange(e)}
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

            <div>
              <div style={{ marginTop: 15, marginBottom: 10 }}>
                <Typography className={classes.formLabels} gutterBottom>
                  Account to integrate
                </Typography>
                <FormGroup>
                  {!disableDropDown ? (
                    <Select
                      variant="outlined"
                      size="small"
                      fullWidth
                      classes={{
                        root: classes.selectPadding,
                      }}
                      placeholder={"Select from the list"}
                      name="selectedSheetInt"
                      value={fieldValue && fieldValue?.selectedSheetInt}
                      onChange={(e) => handleChange(e)}
                      disabled={disableDropDown}
                    >
                      <MenuItem value="add_new">Add Google account</MenuItem>
                      {allIntegration.length > 0 &&
                        allIntegration.map((emails, idx) => {
                          return (
                            <MenuItem value={emails} key={idx}>
                              {emails}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  ) : (
                    <TextField
                      className={classes.FormTextField}
                      size="small"
                      name="selectedSheetInt"
                      inputMode="email"
                      onChange={(e) => handleChange(e)}
                      fullWidth
                      FormHelperTextProps={{
                        className: classes.helperText,
                      }}
                      required
                      value={fieldValue.selectedSheetInt || ""}
                      placeholder={`Enter here`}
                      type="email"
                      disabled={disableDropDown}
                      variant="outlined"
                      inputProps={{
                        className: classes.inputColor,
                        autoComplete: "new-int",
                        form: {
                          autoComplete: "off",
                        },
                      }}
                    />
                  )}
                </FormGroup>
              </div>
            </div>
          </>
        )}
        {step === 2 && (
          <>
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
          </>
        )}
      </div>
    </PanelBody>
  );
};

export default SheetIntegrationPanel;
