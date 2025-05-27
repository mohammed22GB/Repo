import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { useSelector } from "react-redux";

import { useStyles } from "../../utils/IntegrationsPanelStyle";
import PanelBody from "../PanelBody";
import OracleDBForm from "./IntegrationForms/OracleDB";
import { handleDBData } from "../../utils/dataIntegration";
import { successToastify } from "../../../common/utils/Toastify";
import useCustomMutation from "../../../common/utils/CustomMutation";
import {
  newIntegrationAPI,
  updateIntegrationAPI,
} from "../../../common/components/Mutation/Integration/IntegrationMutation";
import useCustomQuery from "../../../common/utils/CustomQuery";
import { getIntegrationResourcesListAPI } from "../../utils/integrationsAPIs";

const OracleDBIntegrationPanel = ({
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

  const {
    integrationReducer: { editAccountFlag },
  } = useSelector((state) => state);

  const newIntOracleDBSuccess = ({ data }) => {
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

  // creating a new googel account integration
  const { mutate: newIntOracleDBMutate } = useCustomMutation({
    apiFunc: newIntegrationAPI,
    onSuccess: newIntOracleDBSuccess,
    retries: 0,
  });

  // updating a google account integration
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
    /* Preventing the default action of the event. */
    !!e.target && e.preventDefault();
    console.log(`aaaaaaaaaaaaaaaaaaa`);

    if (e === 0) {
      console.log(`bbbbbbbbbbbbbbbbbbbbbbb`);
      setStep(0);
      return;
    } else if (
      step === 1 &&
      ["add_new"].includes(fieldValue?.selectedSheetInt.toLowerCase()) &&
      !editAccountFlag
    ) {
      // create new integration
      const data = handleDBData({ type, propertyType, fieldValue });
      newIntOracleDBMutate({
        data,
      });
    } else if (
      step === 1 &&
      fieldValue?.selectedSheetInt.toLowerCase() !== "add_new" &&
      !editAccountFlag
    ) {
      // create integration from existing account
      const data = handleDBData({ type, propertyType, fieldValue });
      newIntOracleDBMutate({
        data,
      });
    } else if (
      step === 1 &&
      fieldValue?.selectedSheetInt.toLowerCase() !== "add_new" &&
      editAccountFlag
    ) {
      // update selected integration
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

  const updateSelectedList = ({ DBProps }) => {
    const DBTableLists = [...selectedResourcesList];
    const dbTableIdx = DBTableLists.findIndex(
      (tableDB) => tableDB?.name === DBProps?.name
    );

    if (dbTableIdx === -1) {
      DBTableLists.push(DBProps);
    } else {
      DBTableLists.splice(dbTableIdx, 1);
    }
    setSelectedResourcesList(DBTableLists);
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
        <OracleDBForm
          classes={classes}
          setFormCompleted={setFormCompleted}
          step={step}
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

export default OracleDBIntegrationPanel;
