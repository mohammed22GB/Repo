import { useEffect, useState } from "react";
import useStyles from "./components/style";
import {
  Grid,
  FormControlLabel,
  Select,
  MenuItem,
  Typography,
  Button,
} from "@material-ui/core";
import { TwoFactor } from "./components/SwitchStyles";
import Divider from "@material-ui/core/Divider";
import ReactSpinnerTimer from "react-spinner-timer";

import SAMLFORM from "./utils/AdvancedSetting";
import {
  configurationPostRequest,
  configurationPutRequest,
  getAccountInfo,
  getIdentityProviderDetails,
  getSsoConfigurationDetails,
  updateSSOStatus,
} from "./utils/ssoAccountsAPI";
import { errorToastify, infoToastify } from "../../../common/utils/Toastify";
import useCustomQuery from "../../../common/utils/CustomQuery";
import useCustomMutation from "../../../common/utils/CustomMutation";
import CustomConfirmBoxV2 from "../../../common/components/CustomConfirmBoxV2/CustomConfirmBoxV2";

const SSO = () => {
  const classes = useStyles();

  //#region configuration states

  const [identityProvidersList, setIdentityProvidersList] = useState([]);

  const [isSecure, setIsSecure] = useState(false);
  const [identityProvider, setIdentityProvider] = useState("");

  const [protocol, setProtocol] = useState("");
  const [protocolList, setProtocolList] = useState([]);

  const [disableButton, setDisableButton] = useState(true);

  const [ssoId, setSsoId] = useState("");

  const [setupUrl, setSetupUrl] = useState({
    baseUrl: "",
    redirectUrl: "",
    logoutUrl: "",
  });

  const [formData, setFormData] = useState({
    tenantSubdomain: "",
    clientId: "",
    clientSecret: "",
    clientSublime: "",
  });

  const [userData, setUserData] = useState([]);

  // ssoEnable Switch
  const [isSsoEnabled, setIsSsoEnabled] = useState(false);

  //config Loading
  const [isConfigLoading, setIsConfigLoading] = useState(false);

  //show the modal if not custom domain
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [errorText, setErrorText] = useState("");

  //#endregion configuration states

  //#region functions

  const getSsoConfiguration = async () => {
    setIsConfigLoading(true);
    setDisableButton(true);
    try {
      const configurationData = await getSsoConfigurationDetails();

      setUserData(configurationData?.data);
      // console.log("userData >>>", configurationData?.data);

      setSsoId(configurationData?.data?.[0]?._id);
      setIsSecure(configurationData?.data?.[0]?.isSecure);

      setIdentityProvider(configurationData?.data?.[0]?.identityProvider);
      setProtocol(configurationData?.data?.[0]?.protocol);

      setFormData(configurationData?.data?.[0]?.metadata);
      setSetupUrl(configurationData?.data?.[0]?.setupParameters);

      if (configurationData?._meta?.success) {
        const identityProviderInfo = await getIdentityProviderDetails();
        setIdentityProvidersList(identityProviderInfo?.data);
        setProtocolList(identityProviderInfo?.data);
        setIsConfigLoading(false);
      }
    } catch (error) {
      setIsConfigLoading(false);
      // console.log("ERRROORRR", error);
      if (error.response.status === 400) {
        // console.log("400 errrorrr", error.response.data._meta.error.message);
        setIsSecure("");
        setErrorText(error.response.data._meta.error.message);
        setShowErrorModal(true);
      }
    } finally {
      setIsConfigLoading(false);
    }
  };

  const accountSsoSuccess = ({ data }) => {
    // console.log(data);
    const ssoStatus = data?.data?.ssoEnabled;
    // console.log("sso Account Status from Api", ssoStatus);
    setIsSsoEnabled(ssoStatus);
  };

  const onStatusUpdateSuccess = ({ data }) => {
    // console.log(data);
    // const ssoStatus = data?.data?.ssoEnabled;

    // setIsSsoEnabled(ssoStatus);
    infoToastify(data?._meta?.message);
  };

  //#endregion functions

  useEffect(() => {
    document.title = "Setting | SSO Configuration";
  }, []);

  useEffect(() => {
    // Call the getSsoConfiguration function
    getSsoConfiguration();
  }, []);

  // fetching the account to know if ssoIsEnabled
  useCustomQuery({
    apiFunc: getAccountInfo,
    queryKey: ["ssoInfo"],
    onSuccess: accountSsoSuccess,
  });
  // updating the account when sso switch is checked
  const { mutate: updateStatus } = useCustomMutation({
    apiFunc: updateSSOStatus,
    onSuccess: onStatusUpdateSuccess,
    retries: 0,
  });

  const handlePostRequest = async (data) => {
    setIsConfigLoading(true);
    setDisableButton(true);
    try {
      const result = await configurationPostRequest(data);

      if (result === "SUBMITTED") {
        // console.log("SUBMITTED", result);
        await getSsoConfiguration();
        // setIsConfigLoading(false);
      }
    } catch (error) {
      setIsConfigLoading(false);
      if (error.response) {
        setDisableButton(true);
        // console.log("POST ERROR", error.response.data._meta.error.message);
        errorToastify(error.response.data._meta.error.message);
      }
    }
  };

  const updateSsoConfiguration = async (id, data) => {
    setIsConfigLoading(true);
    setDisableButton(true);
    const result = await configurationPutRequest(id, data);

    if (result === "UPDATED") {
      // Clear form field
      // console.log("PUT REQUEST WAS A SUCCESS");
      setFormData(null);
      // console.log("Form data cleared here");

      // console.log(result.data);
      await getSsoConfiguration();
      // setIsConfigLoading(false);
    }
  };

  const handleChange = (e) => {
    e.persist();
    setDisableButton(false);

    const name = e.target.name;
    const value = e.target.value;

    if (name === "isSecure") {
      setIsSecure(value);
      setDisableButton(false);
    } else if (name === "identityProvider") {
      setIdentityProvider(value);
    } else if (name === "protocol") {
      setProtocol(value);
    }
  };

  const handleSubmit = () => {
    const data = { protocol, identityProvider };
    // console.log("DATA BEING SENT", data);

    if (!userData?.length) {
      // console.log("POST DATA", data);
      handlePostRequest(data);
    } else {
      // console.log("PUT DATA");
      updateSsoConfiguration(ssoId, data);
    }
  };

  // Loaders
  const handleSpinner = (lap) => {
    if (lap.isFinish) {
      setIsConfigLoading(false);
    }
  };

  if (isConfigLoading) {
    return (
      <div className={classes.loadingPage}>
        <ReactSpinnerTimer
          timeInSeconds={3}
          totalLaps={2}
          isRefresh={false}
          onLapInteraction={handleSpinner}
        />
      </div>
    );
  }

  return (
    <form>
      {showErrorModal && (
        <CustomConfirmBoxV2 open={true} text={errorText} trueText="Close" />
      )}

      <Grid container>
        <Grid
          container
          item
          sm={12}
          xs={12}
          className={classes.bottomMargin20}
          spacing={3}
        >
          <Grid
            container
            item
            justifyContent="flex-end"
            spacing={2}
            style={{ marginTop: 10, marginBottom: 10 }}
          >
            <div
              style={{
                marginRight: "auto",
                display: "flex",
                alignItems: "center",
                marginLeft: 9,
                borderRadius: 5,
                border: "inset 1px #eee",
                backgroundColor: "#fbfbfb",
              }}
            >
              <FormControlLabel
                classes={{
                  root: classes.switchLabel,
                  label: classes.sectionTitle,
                }}
                disabled={showErrorModal}
                control={
                  <TwoFactor
                    // checked={() => updateStatus(ssoEnableSwitch)}
                    // checked={() => updateStatus(isSsoEnabled)}
                    // onChange={handleChange}
                    checked={isSsoEnabled}
                    onChange={() => {
                      updateStatus(!isSsoEnabled);
                      setIsSsoEnabled((prev) => !prev);
                    }}
                    name="ssoEnable"
                    color="primary"
                    //size="small"
                  />
                }
                label="Enable SSO"
                labelPlacement="end"
              />
            </div>
          </Grid>
        </Grid>
      </Grid>

      <Divider
        classes={{
          root: classes.dividerColor,
        }}
      />

      <div className={classes.rowPadding}>
        <div>
          <Typography className={classes.mainText}>
            Configure identity provider
          </Typography>
          <Typography className={classes.subText} gutterBottom>
            Choose your provider and authentication type.
          </Typography>
        </div>

        <Typography className={classes.subText} gutterBottom>
          Identity provider
        </Typography>

        <div>
          <Select
            size="small"
            name="identityProvider"
            fullWidth
            value={identityProvider || "None"}
            onChange={handleChange}
            type="text"
            variant="outlined"
            classes={{
              root: classes.selectPadding,
            }}
            className={classes.selectProvider}
            disabled={showErrorModal}
          >
            <MenuItem value={"None"} disabled>
              Select identity provider
            </MenuItem>
            {identityProvidersList?.map((idList, i) => (
              <MenuItem
                value={idList?.id}
                key={idList?.id}
                className={classes.dropDownMenu}
              >
                <span className={classes.dropDownMenu}>
                  <img src={`${idList?.logo}`} alt="logo" width={18} />
                  {idList?.name}
                </span>
              </MenuItem>
            ))}
          </Select>
        </div>

        {/* <Typography className={classes.subText} gutterBottom>
          Authentication Type
        </Typography> */}

        {/* <div>
          <Select
            size="small"
            name="isSecure"
            fullWidth
            value={isSecure}
            onChange={handleChange}
            type="text"
            variant="outlined"
            classes={{
              root: classes.selectPadding,
            }}
            className={classes.selectProvider}
            disabled={showErrorModal}
          >
            {authenticationType.map((r, i) => (
              <MenuItem
                value={i === 0 ? false : true}
                key={i}
                className={classes.dropDownMenu}
              >
                <span className={classes.dropDownMenu}>
                  {r[1]}
                  {i !== 0 && (
                    <span className={classes.recommend}>Recommended</span>
                  )}
                </span>
              </MenuItem>
            ))}
          </Select>

          {isSecure && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              <Typography
                className={classes.identityText}
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Learn how to configure secure authentication on Azure AD B2C
              </Typography>
              <Link
                rel="noreferrer"
                target="_blank"
                href="https://www.google.com"
              >
                <img
                  src="/images/External_link.svg"
                  alt="logo"
                  style={{ cursor: "pointer", marginTop: 5 }}
                  width={15}
                />
              </Link>
            </div>
          )}
        </div> */}

        <Typography className={classes.subText} gutterBottom>
          Protocol
        </Typography>

        <div>
          <Select
            size="small"
            name="protocol"
            fullWidth
            value={protocol || "None"}
            onChange={handleChange}
            type="text"
            variant="outlined"
            classes={{
              root: classes.selectPadding,
            }}
            className={classes.selectProvider}
            disabled={showErrorModal}
          >
            <MenuItem value={"None"} disabled>
              Select protocol
            </MenuItem>
            {protocolList
              ?.filter((pList) => pList?.id === identityProvider)
              ?.map((pList, i) => (
                <MenuItem
                  value={pList?.protocols.toString()}
                  key={pList?.id}
                  className={classes.dropDownMenu}
                >
                  <span className={classes.dropDownMenu}>
                    {pList?.protocols}
                  </span>
                </MenuItem>
              ))}
          </Select>
        </div>

        <Button
          color="primary"
          style={{ marginTop: 15 }}
          classes={{
            root: classes.customButton,
            label: classes.customButtonLabel,
            disabled: classes.disabled,
          }}
          disabled={
            disableButton || showErrorModal || !identityProvider || !protocol
          }
          onClick={handleSubmit}
          size="large"
          title="Save configuration"
          variant="contained"
          // type="submit"
        >
          Save
        </Button>
      </div>

      {!!userData?.length && (
        <SAMLFORM
          ssoId={ssoId}
          setupParameter={setupUrl}
          formData={formData}
          setFormData={setFormData}
        />
      )}
    </form>
  );
};

export default SSO;
