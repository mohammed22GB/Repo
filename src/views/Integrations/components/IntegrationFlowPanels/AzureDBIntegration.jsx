import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core";

import { useStyles } from "../../utils/IntegrationsPanelStyle";
import PanelBody from "../PanelBody";
import AzureDBForm from "./IntegrationForms/AzureDBForm";
import { handleDBData } from "../../utils/dataIntegration";
import { successToastify } from "../../../common/utils/Toastify";
import useCustomMutation from "../../../common/utils/CustomMutation";
import {
  newIntegrationAPI,
  updateIntegrationAPI,
} from "../../../common/components/Mutation/Integration/IntegrationMutation";
import useCustomQuery from "../../../common/utils/CustomQuery";
import { getIntegrationResourcesListAPI } from "../../utils/integrationsAPIs";

const AzureDBIntegrationPanel = ({
  changeIntegrationPage,
  updatedData,
  updateList,
  integrations,
  type,
  propertyType,
}) => {
  const classes = useStyles(makeStyles);
  const steps = 2;
  const [fieldValue, setFieldValue] = useState({
    name: "",
    serverType: "",
    serverName: "",
    authentication: "",
    loginUsername: "",
    password: "",
    user: "",
    connectionString: "",
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
  const [renderPanel, setRenderPanel] = useState([]);

  const {
    integrationReducer: { editAccountFlag },
  } = useSelector((state) => state);

  const newIntAzureDBSuccess = ({ data }) => {
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

  const { mutate: newIntAzureDBMutate } = useCustomMutation({
    apiFunc: newIntegrationAPI,
    onSuccess: newIntAzureDBSuccess,
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
    !!e.target && e.preventDefault();

    if (e === 0) {
      setStep(0);
      return;
    } else if (
      step === 1 &&
      ["add_new"].includes(fieldValue?.selectedSheetInt.toLowerCase()) &&
      !editAccountFlag
    ) {
      const data = handleDBData({ type, propertyType, fieldValue });
      newIntAzureDBMutate({
        data,
      });
    } else if (
      step === 1 &&
      fieldValue?.selectedSheetInt.toLowerCase() !== "add_new" &&
      !editAccountFlag
    ) {
      const data = handleDBData({ type, propertyType, fieldValue });
      newIntAzureDBMutate({
        data,
      });
    } else if (
      step === 1 &&
      fieldValue?.selectedSheetInt.toLowerCase() !== "add_new" &&
      editAccountFlag
    ) {
      const data = handleDBData({ type, propertyType, fieldValue });
      updateIntegrationAPIMutate({ id: activeId, data });
    } else if (steps === step) {
      const data = handleDBData({ type, propertyType, fieldValue });

      setCompletedStep(() => true);
      updateIntegrationAPIMutate({ id: activeId, data });
      setDisableDropDown(() => false);
      setStep(0);
      return;
    }

    return;
  };

  /**
   * If the sheetProps.name is not in the selectedResourcesList, add it. If it is, remove it.
   */
  const updateSelectedList = ({ DBProps }) => {
    /* Creating a copy of the selectedResourcesList array. */
    const DBTableLists = [...selectedResourcesList];
    /* Finding the index of the azureDBProps.name in the AzureTableLists array. */
    const dbTableIdx = DBTableLists.findIndex(
      (tableDB) => tableDB?.name === DBProps?.name
    );

    if (dbTableIdx === -1) {
      /* Pushing the sheetProps object into the AzureTableLists array. */
      DBTableLists.push(DBProps);
    } else {
      /* Removing the item at index azureTableIdx from the array AzureTableLists. */
      DBTableLists.splice(dbTableIdx, 1);
    }
    /* Setting the state of the selectedResourcesList to the AzureTableLists. */
    setSelectedResourcesList(DBTableLists);
  };

  /* Creating a custom input component. */
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
            ({ type: _type, properties: { type: _propertyType } }) =>
              _type === type && _propertyType === propertyType
          )
          .map(({ properties: { userInfo } }) => userInfo && userInfo?.email)
      ),
    ];

    setIntegrationEmails(() => accountsEmail);

    setActiveId(updatedData?.id);
    setSelectedResourcesList(() => updatedData?.properties?.resources || []);

    editAccountFlag && setDisableDropDown(() => true);
  }, [updatedData, integrations, editAccountFlag]);

  return (
    <PanelBody
      title={propertyType}
      mode={!!updatedData ? "Update" : "New"}
      step={step}
      setStep={progressStep}
      steps={steps}
      isResourceSelected={!!selectedResourcesList?.length}
      formCompleted={formCompleted}
    >
      <div className={classes.sideDialogMain}>
        <AzureDBForm
          classes={classes}
          step={step}
          setFormCompleted={setFormCompleted}
          type={propertyType}
          availableResourcesList={availableResourcesList}
          selectedResourcesList={selectedResourcesList}
          updateSelectedList={updateSelectedList}
          updatedData={updatedData}
          fieldValue={fieldValue}
          setFieldValue={setFieldValue}
        />
      </div>
    </PanelBody>
  );
};

export default AzureDBIntegrationPanel;
