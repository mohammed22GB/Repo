import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  FormGroup,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";

import { useStyles } from "../../utils/IntegrationsPanelStyle";
import PanelBody from "../PanelBody";
import { errorToastify, successToastify } from "../../../common/utils/Toastify";
import {
  newIntegrationAPI,
  updateIntegrationAPI,
} from "../../../common/components/Mutation/Integration/IntegrationMutation";

const GMailIntegrationPanel = ({
  changeIntegrationPage,
  updatedData,
  updateList,
  integrations,
}) => {
  const classes = useStyles(makeStyles);
  const steps = 1;
  const [fieldValue, setFieldValue] = useState({
    name: "",
    googleAccount: "",
  });

  const [step, setStep] = useState(1);
  const [activeId, setActiveId] = useState(null);
  const [availableResourcesList, setAvailableResourcesList] = useState([]);
  const [selectedResourcesList, setSelectedResourcesList] = useState([]);
  const [formCompleted, setFormCompleted] = useState(false);
  const [allIntegration, setIntegrationEmails] = useState([]);
  const [disableDropDown, setDisableDropDown] = useState(false);
  const [completedStep, setCompletedStep] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFieldValue({
      name: updatedData?.name,
      googleAccount: updatedData?.properties?.userInfo?.email,
    });
    setActiveId(updatedData?.id);

    /* Filtering the integrations array and returning the email addresses of the users. */
    const accountsEmail = Array.from(
      new Set(
        integrations
          .filter(({ type, properties }) => {
            if (properties && "userInfo" in properties) {
              const hasEmail = "email" in properties.userInfo;
              const isGoogleIntegration = type === "GoogleApiIntegration";
              const isGoogleMail = properties.type === "Google Mail";

              return hasEmail && isGoogleIntegration && isGoogleMail;
            }

            return false;
          })
          .map(({ properties }) => properties.userInfo.email)
      )
    );

    /* Setting the state of the component. */
    setIntegrationEmails(integrations.length ? accountsEmail : []);

    setStep(1);
  }, [updatedData, integrations]);

  /* Checking if the step is 0, if it is, it will change the integration page to an empty string. */
  useEffect(() => {
    if (step === 0) {
      changeIntegrationPage("");
    }
  }, [step, changeIntegrationPage]);

  /* Checking if the fieldValue.name is empty or not. If it is empty, it will set the formCompleted to
  false. If it is not empty, it will set the formCompleted to true. */
  useEffect(() => {
    setFormCompleted(!!fieldValue.name);
  }, [fieldValue]);

  /* Destructuring the state object and assigning the value of editAccountFlag to the variable
  editAccountFlag. */
  const {
    integrationReducer: { editAccountFlag },
  } = useSelector((state) => state);

  const progressStep = async (e) => {
    !!e.target && e.preventDefault();

    if (e === 0) {
      //  if integration terminated
      setStep(0);
    } else if (step === 1) {
      //  if integration is still progressing... make connection... first restructure payload
      if (!fieldValue.name) {
        errorToastify("Enter name for new integration");
        return;
      }

      setLoading(true);

      const payload = {
        name: fieldValue.name,
        type: "GoogleApiIntegration",
        group: "mail",
        ...(!!activeId || fieldValue.googleAccount !== "_new_"
          ? { email: fieldValue.googleAccount }
          : {}),
        redirectUrl: `${process.env.REACT_APP_BASE_URL}/integrations`,
        properties: {
          type: "Google Mail",
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

          if (sendData?.data?.redirect) {
            //  redirect to google consent page
            window.location.href = sendData?.data?.redirect;
          }
        } else {
          //  if UPDATE integration
          sendData = await updateIntegrationAPI({
            id: activeId,
            data: payload,
          });

          if (sendData?._meta?.success) {
            successToastify(sendData?._meta?.message);

            //  update master list on main UI
            updateList(sendData.data);

            //  go to home
            setStep(0);
          } else {
            errorToastify(sendData?._meta?.message);
          }
        }
      } catch (e) {
        errorToastify(e.response?.data?._meta?.error?.message || e.message);
      }

      setLoading(false);
    }
  };

  const selectAccount = (e) => {
    setFieldValue({ ...fieldValue, googleAccount: e.target.value });
    /* if (e.target.value === "_new_") {
      // progressStep(null);
    } else {
      setFieldValue({ ...fieldValue, googleAccount: e.target.value });
    } */
  };

  return (
    <PanelBody
      title="GMail"
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
              fullWidth
              FormHelperTextProps={{
                className: classes.helperText,
              }}
              required
              value={fieldValue.name || ""}
              placeholder={`Enter here`}
              type="text"
              variant="outlined"
              autoFocus
              focused
              inputProps={{
                className: classes.inputColor,
                autoComplete: "new-int",
                form: {
                  autoComplete: "off",
                },
              }}
            />

            <div>
              <Typography className={classes.formLabels} gutterBottom>
                Google account
              </Typography>
              <FormGroup>
                <Select
                  variant="outlined"
                  size="small"
                  fullWidth
                  classes={{
                    root: classes.selectPadding,
                  }}
                  placeholder={"Select from the list"}
                  name="googleAccount"
                  value={fieldValue?.googleAccount || "choose"}
                  onChange={selectAccount}
                  disabled={!!activeId}
                >
                  <MenuItem value="choose" disabled>
                    <em>Select Google account</em>
                  </MenuItem>
                  <MenuItem value="_new_">Add Google account</MenuItem>
                  {allIntegration.length > 0 &&
                    allIntegration.map((emails, idx) => {
                      return (
                        <MenuItem value={emails} key={idx}>
                          {emails}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormGroup>
            </div>
          </>
        )}
      </div>
    </PanelBody>
  );
};

export default GMailIntegrationPanel;
