import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  InputBase,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
  withStyles,
} from "@material-ui/core";

import { useStyles } from "../../utils/IntegrationsPanelStyle";
import PanelBody from "../PanelBody";
import { mainNavigationUrls } from "../../../common/utils/lists";
import { successToastify } from "../../../common/utils/Toastify";
import useCustomMutation from "../../../common/utils/CustomMutation";
import {
  newIntegrationAPI,
  updateIntegrationAPI,
} from "../../../common/components/Mutation/Integration/IntegrationMutation";
import useCustomQuery from "../../../common/utils/CustomQuery";
import { getIntegrationResourcesListAPI } from "../../utils/integrationsAPIs";

const GoogleDriveIntegrationPanel = ({
  changeIntegrationPage,
  updatedData,
  updateList,
  integrations,
}) => {
  const classes = useStyles(makeStyles);
  const history = useHistory();

  const steps = 2;

  const completedStep = useRef("in-process");
  const [fieldValue, setFieldValue] = useState({
    name: "",
    selectedFolderInt: "",
  });
  const [step, setStep] = useState(1);
  const [activeId, setActiveId] = useState(null);
  const [availableResourcesList, setAvailableResourcesList] = useState([]);
  const [selectedResourcesList, setSelectedResourcesList] = useState([]);
  const [formCompleted, setFormCompleted] = useState(false);
  const [allIntegration, setIntegrationEmails] = useState([]);
  const [disableDropDown, setDisableDropDown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingAvailableResourcesList, setLoadingAvailableResourcesList] =
    useState(true);

  const {
    integrationReducer: { editAccountFlag },
  } = useSelector((state) => state);

  useEffect(() => {
    if (step === 0) {
      changeIntegrationPage("");
    }
  }, [step, changeIntegrationPage, fieldValue.selectedFolderInt]);

  useEffect(() => {
    const accountsEmail = integrations.length > 0 && [
      ...new Set(
        integrations
          .filter(
            ({ type, properties: { type: propertyType } }) =>
              type === "GoogleApiIntegration" && propertyType === "Google Drive"
          )
          .map(({ properties: { userInfo } }) => userInfo && userInfo?.email)
      ),
    ];

    setIntegrationEmails(() => accountsEmail);

    setActiveId(updatedData?.id);

    setFieldValue((data) => ({
      ...data,
      name: updatedData?.name,
      selectedFolderInt: updatedData?.properties?.userInfo?.email,
    }));

    setSelectedResourcesList(() => updatedData?.properties?.resources || []);
    editAccountFlag && setDisableDropDown(() => true);
  }, [updatedData, integrations, editAccountFlag]);

  useEffect(() => {
    setFormCompleted(!!fieldValue.name && !!fieldValue.selectedFolderInt);
  }, [fieldValue]);

  const newIntGoogleFolderSuccess = ({ data }) => {
    if (
      step === 1 &&
      fieldValue?.selectedFolderInt.toLowerCase() !== "add_new" &&
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
    setLoading(false);
    setDisableDropDown(() => false);
    // setStep(() => 0);

    if (completedStep.current === "finish") {
      setStep(() => 0);
      return history.push(mainNavigationUrls.INTEGRATIONS);
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const getIntegrationResourcesListAPISuccess = ({ data }) => {
    const foldersList = data?.data.map((folders) => ({
      name: folders.name,
      id: folders.id,
    }));
    setLoadingAvailableResourcesList(false);
    setAvailableResourcesList(foldersList);
  };

  // creating a new googel account integration
  const { mutate: newIntFolderMutate } = useCustomMutation({
    apiFunc: newIntegrationAPI,
    onSuccess: newIntGoogleFolderSuccess,
    onError: () => setLoading(false),
    retries: 0,
  });

  // updating a google account integration
  const { mutate: updateIntegrationAPIMutate } = useCustomMutation({
    apiFunc: updateIntegrationAPI,
    onSuccess: updateIntegrationAPISuccess,
    onError: () => setLoading(false),
    retries: 0,
  });

  // fetching all user google folder of the selected integrated google account

  useCustomQuery({
    apiFunc: getIntegrationResourcesListAPI,
    queryKey: ["getResources", { id: activeId }],
    enabled: step === 2 && true,
    onSuccess: getIntegrationResourcesListAPISuccess,
    onError: () => setLoading(false),
  });

  const progressStep = async (e) => {
    /* Preventing the default action of the event. */
    !!e.target && e.preventDefault();
    setLoading(true);

    if (e === 0) {
      setLoading(false);
      setStep(0);
      return;
    } else if (
      step === 1 &&
      ["add_new"].includes(fieldValue?.selectedFolderInt.toLowerCase()) &&
      !editAccountFlag
    ) {
      // create new integration
      const data = {
        name: fieldValue.name,
        type: "GoogleApiIntegration",
        group: "data",
        redirectUrl: `${process.env.REACT_APP_BASE_URL}/integrations`,
        properties: {
          type: "Google Drive",
        },
      };

      await newIntFolderMutate({ data });
    } else if (
      step === 1 &&
      fieldValue?.selectedFolderInt.toLowerCase() !== "add_new" &&
      !editAccountFlag
    ) {
      // create integration from existing account
      const data = {
        name: fieldValue.name,
        email: fieldValue.selectedFolderInt,
        type: "GoogleApiIntegration",
        group: "data",
        redirectUrl: window.location.href,
        properties: {
          type: "Google Drive",
        },
      };

      await newIntFolderMutate({ data });
    } else if (
      step === 1 &&
      fieldValue?.selectedFolderInt.toLowerCase() !== "add_new" &&
      editAccountFlag
    ) {
      // update selected integration
      const data = {
        name: fieldValue.name,
        email: fieldValue?.selectedFolderInt,
        type: "GoogleApiIntegration",
        group: "document",
        properties: {
          type: "Google Drive",
        },
      };

      await updateIntegrationAPIMutate({ id: activeId, data });
    } else if (steps === step) {
      const data = {
        name: fieldValue.name,
        properties: {
          resources: selectedResourcesList,
        },
      };

      completedStep.current = "finish";
      await updateIntegrationAPIMutate({ id: activeId, data });
      return;
    }

    return;
  };

  /**
   * If the folderProps.name is not in the selectedResourcesList, add it. If it is, remove it.
   */
  const updateSelectedList = ({ folderProps }) => {
    /* Creating a copy of the selectedResourcesList array. */
    const folderLists = [...selectedResourcesList];
    /* Finding the index of the folderProps.name in the folderLists array. */
    const folderIdx = folderLists.findIndex(
      (folders) => folders?.name === folderProps?.name
    );

    if (folderIdx === -1) {
      /* Pushing the folderProps object into the folderLists array. */
      folderLists.push(folderProps);
    } else {
      /* Removing the item at index folderIdx from the array folderLists. */
      folderLists.splice(folderIdx, 1);
    }
    /* Setting the state of the selectedResourcesList to the folderLists. */
    setSelectedResourcesList(folderLists);
  };

  /* Creating a custom input component. */
  const BootstrapInput = withStyles((theme) => ({
    input: {
      borderRadius: 4,
      position: "relative",
      backgroundColor: theme?.palette.background.paper,
      border: "1px solid #ced4da",
      fontSize: 16,
      padding: "10px 26px 10px 12px",
      transition: theme?.transitions.create(["border-color", "box-shadow"]),
      "&:focus": {
        borderRadius: 4,
        borderColor: "#80bdff",
        boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
      },
    },
  }))(InputBase);

  /**
   * When the user types in the input field, the value of the input field is set to the value of the
   * field that the user is typing in.
   */
  const handleChange = (e) => {
    setFieldValue((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <PanelBody
      title="Google Drive"
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
                      name="selectedFolderInt"
                      value={fieldValue && fieldValue?.selectedFolderInt}
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
                      name="selectedFolderInt"
                      inputMode="email"
                      onChange={(e) => handleChange(e)}
                      fullWidth
                      FormHelperTextProps={{
                        className: classes.helperText,
                      }}
                      required
                      value={fieldValue.selectedFolderInt || ""}
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
              Select the folders to integrate
            </Typography>
            <div className="selectResources">
              <div style={{ marginTop: 15, marginBottom: 10 }}>
                {loadingAvailableResourcesList ? (
                  <div style={{ fontWeight: 700 }}>Loading, Please wait...</div>
                ) : (
                  <>
                    {!availableResourcesList.length ? (
                      <div>
                        No folders found. You'll need at least one folder to
                        integrate
                      </div>
                    ) : (
                      <FormGroup>
                        {availableResourcesList?.map((folderProps, idx) => {
                          return (
                            <FormControlLabel
                              key={idx}
                              control={
                                <Checkbox
                                  onChange={() =>
                                    updateSelectedList({ folderProps })
                                  }
                                  checked={selectedResourcesList
                                    .map(({ name }) => name)
                                    ?.includes(folderProps.name)}
                                />
                              }
                              label={folderProps.name}
                            />
                          );
                        })}
                      </FormGroup>
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </PanelBody>
  );
};

export default GoogleDriveIntegrationPanel;
