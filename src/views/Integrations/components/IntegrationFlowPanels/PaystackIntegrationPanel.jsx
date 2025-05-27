import { useEffect, useState } from "react";
import { makeStyles, TextField, Typography } from "@material-ui/core";

import { useStyles } from "../../utils/IntegrationsPanelStyle";
import PanelBody from "../PanelBody";
import {
  newIntegrationAPI,
  updateIntegrationAPI,
} from "../../utils/integrationsAPIs";
import { errorToastify, successToastify } from "../../../common/utils/Toastify";

const PaystackIntegrationPanel = ({
  changeIntegrationPage,
  updatedData,
  updateList,
}) => {
  const classes = useStyles(makeStyles);
  const steps = 1;
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
    setFormCompleted(!!fieldValue.name && !!fieldValue.kokoro);
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
        type: "PaymentServiceIntegration",
        group: "payment",
        properties: {
          type: "Paystack",
          secretKey: fieldValue.kokoro,
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

          //  go to home
          setStep(0);
        } else {
          errorToastify(sendData?._meta?.message);
        }
      } catch (e) {
        errorToastify(e.response?.data?._meta?.error?.message || e.message);
      }
      setLoading(false);
    }
  };

  return (
    <PanelBody
      title="Paystack"
      mode={!!updatedData ? "Update" : "New"}
      step={step}
      setStep={progressStep}
      steps={steps}
      isResourceSelected={!!selectedResourcesList?.length}
      formCompleted={formCompleted}
      overLookResourceSelectedList
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
              Secret key
            </Typography>
            <TextField
              className={classes.FormTextField}
              size="small"
              name="kokoro"
              inputMode="text"
              onChange={(e) =>
                setFieldValue({ ...fieldValue, kokoro: e.target.value })
              }
              // error={hasError("name")}
              fullWidth
              // helperText={hasError("name") ? "Invalid Name" : null}
              FormHelperTextProps={{
                className: classes.helperText,
              }}
              required
              value={fieldValue.kokoro || ""}
              placeholder={`Enter here`}
              type="text"
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
      </div>
    </PanelBody>
  );
};

export default PaystackIntegrationPanel;
