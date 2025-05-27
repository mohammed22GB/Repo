import { useEffect, useState } from "react";
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
import {
  getIntegrationResourcesListAPI,
  newIntegrationAPI,
  updateIntegrationAPI,
} from "../../utils/integrationsAPIs";
import { errorToastify, successToastify } from "../../../common/utils/Toastify";

const DocuSignIntegrationPanel = ({
  changeIntegrationPage,
  updatedData,
  updateList,
  docusignIntegrationAccounts,
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
    console.log(
      `_____useEffect >> setFieldValue >>> ${JSON.stringify(updatedData)}`
    );
    setFieldValue({
      name: updatedData?.name,
      account: updatedData?.properties?.docusignAccount,
      // account: updatedData?.properties?.userInfo?.email,
    });
    setActiveId(updatedData?.id);

    setSelectedResourcesList(updatedData?.properties?.resources || []);

    setStep(1);
  }, [updatedData]);

  useEffect(() => {
    setFormCompleted(!!fieldValue.name && !!fieldValue.account);
  }, [fieldValue]);

  const progressStep = async (e) => {
    !!e?.target && e.preventDefault();

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
        type: "DocusignApiIntegration",
        group: "document",
        redirectUrl: `${process.env.REACT_APP_BASE_URL}/integrations`,
        ...(!!fieldValue.account
          ? {
              email: docusignIntegrationAccounts.find(
                (doc) =>
                  !!doc.accounts.find(
                    (account) => account.account_id === fieldValue.account
                  )
              )?.email,
            }
          : {}),
        properties: {
          type: "DocuSign",
          ...(!!fieldValue.account
            ? { docusignAccount: fieldValue.account }
            : {}),
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

          // if (!fieldValue.account) {
          if (!!sendData?.data?.redirect) {
            //  redirect to docusign
            const redirectUrl = sendData?.data?.redirect;
            window.location.href = redirectUrl;
            return;
          }
        } else {
          //  if UPDATE integration
          sendData = await updateIntegrationAPI({
            id: activeId,
            data: { ...payload },
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
      setLoading(true);
      try {
        const sendUpdateData = await updateIntegrationAPI({
          id: activeId,
          properties: { resources: selectedResourcesList },
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

  const selectAccount = (e) => {
    console.log("1111111111");
    if (e.target.value === "_new_") {
      console.log("222222222222");
      // progressStep(null);
    } else {
      console.log("3333333333333");
      setFieldValue({ ...fieldValue, account: e.target.value });
    }
  };

  const getSubAccounts = () => {
    const accounts_ = [];
    console.log(
      `docusignIntegrationAccounts >>> ${JSON.stringify(
        docusignIntegrationAccounts
      )}`
    );
    [...docusignIntegrationAccounts].forEach((doc) => {
      doc.accounts.forEach((acc) => {
        accounts_.push({
          email: doc.email,
          account_id: acc.account_id,
          account_name: acc.account_name,
        });
      });
    });
    console.log(`accounts_ >>> ${JSON.stringify(accounts_)}`);
    const uniqueArray = [
      ...new Set(accounts_.map((o) => JSON.stringify(o))),
    ].map((s) => JSON.parse(s));

    console.log(`uniqueArray >>> ${JSON.stringify(uniqueArray)}`);
    return uniqueArray;
  };

  return (
    <PanelBody
      title="DocuSign"
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
              DocuSign account
            </Typography>
            <Select
              name="account"
              variant="outlined"
              size="small"
              fullWidth
              placeholder="Select form screen"
              classes={{
                root: classes.selectPadding,
              }}
              value={
                (fieldValue?.account === "_new_" && "choose") ||
                fieldValue?.account ||
                "choose"
              }
              onChange={selectAccount}
              disabled={!!activeId}
            >
              <MenuItem value="choose" disabled>
                <em>Select DocuSign Account</em>
              </MenuItem>
              {(getSubAccounts() || []).map((sub, indx) => (
                <MenuItem key={indx} value={sub.account_id}>
                  {sub.account_name} - {sub.email}
                </MenuItem>
              ))}
              <MenuItem value="_new_" selected>
                Add New DocuSign Account
              </MenuItem>
            </Select>
          </>
        )}
        {step === 2 && (
          <>
            <Typography
              className={classes.formLabels}
              // style={idx === 0 ? { paddingTop: 0 } : {}}
              gutterBottom
            >
              Select the templates to integrate
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

export default DocuSignIntegrationPanel;
