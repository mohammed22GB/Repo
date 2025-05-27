import { useEffect, useState } from "react";
import { makeStyles, TextField, Typography } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";

import { useStyles } from "../../utils/IntegrationsPanelStyle";
import PanelBody from "../PanelBody";
import { successToastify } from "../../../common/utils/Toastify";
import { SET_EDIT_INTEGRATION_FLAG } from "../../../../store/actions/integrationActions";
import useCustomMutation from "../../../common/utils/CustomMutation";
import {
  newIntegrationAPI,
  updateIntegrationAPI,
} from "../../utils/integrationsAPIs";

const SendGridIntegrationPanel = ({
  changeIntegrationPage,
  updatedData,
  updateList,
  integrations,
}) => {
  const classes = useStyles(makeStyles);
  const steps = 1;
  const [fieldValue, setFieldValue] = useState({
    name: "",
    apiKey: "",
    templateId: "",
  });

  const [step, setStep] = useState(1);
  const [activeId, setActiveId] = useState(null);
  const [formCompleted, setFormCompleted] = useState(false);

  const {
    integrationReducer: { editAccountFlag },
  } = useSelector((state) => state);

  const dispatch = useDispatch();

  const newIntSendGridSuccess = ({ data }) => {
    if (step === 1 && !editAccountFlag) {
      setActiveId(() => data?.data?.id);
      setStep(() => 0);
      return;
    } else {
      setActiveId(() => data?.data?.id);
      setStep(() => 0);
      return;
    }
  };

  const updateIntegrationAPISuccess = ({ data }) => {
    successToastify(data?._meta?.message);
    updateList(data?.data);
    dispatch({ type: SET_EDIT_INTEGRATION_FLAG, payload: false });

    setStep(() => 0);
    return;
  };

  const { mutate: newIntSendGridMutate } = useCustomMutation({
    apiFunc: newIntegrationAPI,
    onSuccess: newIntSendGridSuccess,
    retries: 0,
  });

  const { mutate: updateIntegrationAPIMutate } = useCustomMutation({
    apiFunc: updateIntegrationAPI,
    onSuccess: updateIntegrationAPISuccess,
    retries: 0,
  });

  const progressStep = async (e) => {
    !!e.target && e.preventDefault();

    if (e === 0) {
      setStep(0);
      return;
    } else if (step === 1 && !editAccountFlag) {
      // create new integration
      const data = {
        name: fieldValue.name,
        type: "EmailServiceIntegration",
        group: "mail",
        properties: {
          apiKey: fieldValue?.apiKey,
          templateId: fieldValue?.templateId,
          type: "SendGrid",
        },
      };

      newIntSendGridMutate({
        data,
      });
    } else if (step === 1 && editAccountFlag) {
      // update selected integration

      const data = {
        name: fieldValue.name,
        type: "EmailServiceIntegration",
        properties: {
          apiKey: fieldValue?.apiKey,
          templateId: fieldValue?.templateId,
          type: "SendGrid",
        },
      };
      updateIntegrationAPIMutate({ id: activeId, data });
    }
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
  }, [step, changeIntegrationPage]);

  useEffect(() => {
    setActiveId(updatedData?.id);

    /* Setting the value of the field. */
    setFieldValue((data) => ({
      ...data,
      name: updatedData?.name,
    }));
  }, [updatedData, integrations, editAccountFlag]);

  useEffect(() => {
    setFormCompleted(
      !!fieldValue.name && !!fieldValue.apiKey && !!fieldValue.templateId
    );
  }, [fieldValue]);

  return (
    <PanelBody
      title="Send Grid"
      mode={!!updatedData ? "Update" : "New"}
      step={step}
      setStep={progressStep}
      overLookResourceSelectedList
      steps={steps}
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

            <Typography className={classes.formLabels} gutterBottom>
              ApiKey
            </Typography>
            <TextField
              className={classes.FormTextField}
              size="small"
              name="apiKey"
              inputMode="text"
              onChange={(e) => handleChange(e)}
              fullWidth
              FormHelperTextProps={{
                className: classes.helperText,
              }}
              required
              value={fieldValue.apiKey || ""}
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
              Template Id
            </Typography>
            <TextField
              className={classes.FormTextField}
              size="small"
              name="templateId"
              inputMode="text"
              onChange={(e) => handleChange(e)}
              fullWidth
              FormHelperTextProps={{
                className: classes.helperText,
              }}
              required
              value={fieldValue.templateId || ""}
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
          </>
        )}
      </div>
    </PanelBody>
  );
};

export default SendGridIntegrationPanel;
