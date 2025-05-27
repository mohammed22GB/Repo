import { useEffect, useState, useRef } from "react";
import _ from "lodash";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { makeStyles } from "@material-ui/core";

import { useStyles } from "../../utils/IntegrationsPanelStyle";
import PanelBody from "../PanelBody";
import { handleDBData } from "../../utils/dataIntegration";
import APIForm from "./IntegrationForms/APIForm";
import { initEndpoint } from "../../utils/customStructures";
import { successToastify } from "../../../common/utils/Toastify";
import useCustomMutation from "../../../common/utils/CustomMutation";
import {
  newIntegrationAPI,
  updateIntegrationAPI,
} from "../../../common/components/Mutation/Integration/IntegrationMutation";
import useCustomQuery from "../../../common/utils/CustomQuery";
import { getIntegrationResourcesListAPI } from "../../utils/integrationsAPIs";

const APIIntegrationPanel = ({
  changeIntegrationPage,
  updatedData,
  updateList,
  integrations,
  type,
  // propertyType: authenticationType,
}) => {
  const { instance } = useMsal();

  const classes = useStyles(makeStyles);
  const steps = 2;

  const completedSteps = useRef(false);
  const location = useLocation();
  const queries = new URLSearchParams(location.search);
  const progress = queries.get("progress");

  const [step, setStep] = useState(1);
  const [activeId, setActiveId] = useState(null);
  const [availableResourcesList, setAvailableResourcesList] = useState([]);
  const [selectedResourcesList, setSelectedResourcesList] = useState([]);
  const [formCompleted, setFormCompleted] = useState(false);
  // const [disableDropDown, setDisableDropDown] = useState(false);
  // const [completedSteps, setCompletedSteps] = useState(false);
  const [loading, setLoading] = useState(false);
  const [overLookResourceSelectedList, setoverLookResourceSelectedList] =
    useState(true);

  const [fieldValues, setFieldValues] = useState({
    name: "",
    authenticationType: "",
    apiType: "",
    headerAuth: [],
    loginUsername: "",
    password: "",
    user: "",
    connectionString: "",
    url: "",
    token: "",
  });

  const [form2fieldValue, setForm2FieldValue] = useState([
    _.cloneDeep(initEndpoint),
  ]);

  const {
    integrationReducer: { editAccountFlag },
  } = useSelector((state) => state);

  useEffect(() => {
    if (progress === "proceed") {
      updateIntegrationAPISuccess({ data: null });
    }
  }, [progress]);

  const newIntAPISuccess = ({ data }) => {
    if (data?.data?.redirect) {
      const redirectUrl = data.data.redirect;
      window.location.href = redirectUrl;
      return;
    } else if (
      data?.data?.properties?.connectionCredentials?.authType === "OAuth2"
    ) {
      const authURLString =
        data?.data?.properties?.connectionCredentials?.authorizationURL;
      const clientIDString = `client_id=${fieldValues?.clientID}`;
      const promptString = "prompt=select_account consent";
      const accessTypeString = "access_type=offline";
      const responseTypeString = `response_type=code`;
      const stateString = `state=${JSON.stringify({
        platform: "oauth2",
        id: data?.data?.id,
        type: "custom",
        mode: "create",
      })}`;
      const redirectUrlString = `redirect_uri=${process.env.REACT_APP_ENDPOINT}/integrations/generate-tokens`;
      const scopeString = `scope=${data?.data?.properties?.connectionCredentials?.scopes?.join(
        " "
      )}`;

      const redirectUrl = `${authURLString}?${clientIDString}&${promptString}&${accessTypeString}&${responseTypeString}&${redirectUrlString}&${scopeString}&${stateString}`;

      window.location.href = redirectUrl;
      return;
    }

    if (step === 1 && !editAccountFlag) {
      updateList(data?.data);
      setActiveId(() => data?.data?.id);
      return setStep((prevStep) => prevStep + 1);
    }

    setLoading(false);
    return;
  };

  const updateIntegrationAPISuccess = ({ data }) => {
    !!data?._meta?.message && successToastify(data?._meta?.message);
    !!data?.data && updateList(data?.data);

    if (completedSteps.current) {
      // setCompletedSteps(() => false);
      completedSteps.current = true;
      setStep(() => 0);
      return;
    } else {
      setStep((prev) => prev + 1);
      // setCompletedSteps(() => false);
      completedSteps.current = false;
    }
    setLoading(false);
  };

  const getIntegrationResourcesListAPISuccess = ({ data }) => {
    setAvailableResourcesList(() => data?.data || []);
  };

  const { mutate: newIntAPIMutate } = useCustomMutation({
    apiFunc: newIntegrationAPI,
    onSuccess: newIntAPISuccess,
    onError: () => {
      setLoading(false);
    },
    retries: 0,
  });

  const { mutate: updateIntegrationAPIMutate } = useCustomMutation({
    apiFunc: updateIntegrationAPI,
    onSuccess: updateIntegrationAPISuccess,
    onError: () => {
      setLoading(false);
    },
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
    setLoading(true);

    if (e === 0) {
      setStep(0);
      setLoading(false);
    } else if (step === 1 && !editAccountFlag) {
      // create new integration

      if (fieldValues?.authenticationType === "GoogleAuth") {
        // getGoogleConsent();
        // data.scopes = [
        //   ...(fieldValues?.googleScopes || []),
        //   "https://www.googleapis.com/auth/userinfo.profile",
        //   "https://www.googleapis.com/auth/userinfo.email",
        // ].join(" ")
      } else if (fieldValues?.authenticationType === "MicrosoftAuth") {
        // getMicrosoftConsent(data);
        // data.scopes = (fieldValues?.microsoftScopes || [])?.join(" ");
      }

      const data = handleDBData({
        type,
        propertyType: fieldValues?.authenticationType,
        fieldValues,
      });

      newIntAPIMutate({
        data,
      });
    } else if (step === 1 && editAccountFlag) {
      // update selected integration
      const data = handleDBData({
        type,
        propertyType: fieldValues?.authenticationType,
        fieldValues,
      });
      updateIntegrationAPIMutate({ id: activeId, data });
    } else if (steps === step) {
      const data = handleDBData({
        type,
        propertyType: fieldValues?.authenticationType,
        form2fieldValue,
        fieldValues,
      });

      completedSteps.current = true;
      updateIntegrationAPIMutate({ id: activeId, data });
    }

    return;
  };

  /* Checking if the step is 0, if it is, it will change the integration page to an empty string. */
  useEffect(() => {
    if (step === 0) {
      changeIntegrationPage("");
    }
  }, [step, changeIntegrationPage]);

  useEffect(() => {
    if (updatedData?.properties?.resources.length > 0) {
      setForm2FieldValue(() => updatedData?.properties?.resources);
    } else {
      setForm2FieldValue(() => [_.cloneDeep(initEndpoint)]);
    }

    if (updatedData) {
      setActiveId(updatedData?.id);
    }
    setSelectedResourcesList(() => updatedData?.properties?.resources);
  }, [updatedData, integrations, editAccountFlag]);

  return (
    <PanelBody
      title="REST API"
      mode={!!updatedData ? "Update" : "New"}
      step={step}
      setStep={progressStep}
      steps={steps}
      isResourceSelected={!!selectedResourcesList?.length}
      overLookResourceSelectedList={overLookResourceSelectedList}
      formCompleted={formCompleted}
      loading={loading}
    >
      <div className={classes.sideDialogMain}>
        <APIForm
          classes={classes}
          step={step}
          setFormCompleted={setFormCompleted}
          setLoading={setLoading}
          type={"RestApiIntegration"}
          integrations={integrations}
          availableResourcesList={availableResourcesList}
          selectedResourcesList={selectedResourcesList}
          // updateSelectedList={updateSelectedList}
          updatedData={updatedData}
          fieldValues={fieldValues}
          steps={steps}
          setFieldValues={setFieldValues}
          form2fieldValue={form2fieldValue}
          setForm2FieldValue={setForm2FieldValue}
        />
      </div>
    </PanelBody>
  );
};

export default APIIntegrationPanel;
