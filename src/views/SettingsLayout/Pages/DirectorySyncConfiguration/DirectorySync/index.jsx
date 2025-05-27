import { useEffect, useState } from "react";
import useStyles from "../components/style";
import {
  Grid,
  FormControlLabel,
  Select,
  MenuItem,
  Typography,
  Button,
  TextField,
} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import ReactSpinnerTimer from "react-spinner-timer";

import {
  getIdentityProviderDetails,
  createPostRequest,
  getDirectorySyncConfiguration,
  updateDSyncRequest,
} from "../utils/directorySyncAPIs";
import { errorToastify, successToastify } from "../../../../common/utils/Toastify";
import useCustomQuery from "../../../../common/utils/CustomQuery";
import useCustomMutation from "../../../../common/utils/CustomMutation";
import DirectorySyncSwitch from "../DirectorySyncSwitch";
import axios from "axios";

const HandleMicrosoftEntraID = ({
  directorySyncConfig,
  clientId,
  clientSecret,
  tenantId,
  showErrorModal,
  handleChange,
}) => {
  const classes = useStyles();

  return (
    <>
      <Typography className={classes.subText} gutterBottom>
        Client secret
      </Typography>

      <div>
        <TextField
          size="small"
          name="clientSecret"
          fullWidth
          value={clientSecret}
          placeholder={
            directorySyncConfig[0]?.clientSecret || "Enter client secret here"
          }
          onChange={handleChange}
          type="text"
          variant="outlined"
          classes={{
            root: classes.textFieldInputPadding,
          }}
          className={classes.selectProvider}
          disabled={showErrorModal}
        ></TextField>
      </div>

      <Typography className={classes.subText} gutterBottom>
        Client ID
      </Typography>

      <div>
        <TextField
          size="small"
          name="clientId"
          fullWidth
          value={clientId}
          placeholder={
            directorySyncConfig[0]?.clientId || "Enter client id here"
          }
          onChange={handleChange}
          type="text"
          variant="outlined"
          classes={{
            root: classes.textFieldInputPadding,
          }}
          className={classes.selectProvider}
          disabled={showErrorModal}
        ></TextField>
      </div>

      <Typography className={classes.subText} gutterBottom>
        Tenant ID
      </Typography>

      <div>
        <TextField
          size="small"
          name="tenantId"
          fullWidth
          value={tenantId}
          placeholder={
            directorySyncConfig[0]?.tenantId || "Enter tenant Id here"
          }
          onChange={handleChange}
          type="text"
          variant="outlined"
          classes={{
            root: classes.textFieldInputPadding,
          }}
          className={classes.selectProvider}
          disabled={showErrorModal}
        ></TextField>
      </div>
    </>
  );
};

const HandleGoogleWorkspace = ({
  directorySyncConfig,
  superAdminEmail,
  showErrorModal,
  handleChange,
  handleFileUpload,
}) => {
  const classes = useStyles();

  return (
    <>
      <Typography className={classes.subText} gutterBottom>
        Workspace super admin email
      </Typography>

      <div>
        <TextField
          size="small"
          name="superAdminEmail"
          fullWidth
          value={superAdminEmail}
          placeholder={
            directorySyncConfig[0]?.superAdminEmail ||
            "Enter super admin email here"
          }
          onChange={handleChange}
          type="text"
          variant="outlined"
          classes={{
            root: classes.textFieldInputPadding,
          }}
          className={classes.selectProvider}
          disabled={showErrorModal}
        ></TextField>
      </div>

      <Typography className={classes.subText} gutterBottom>
        Upload service account JSON file
      </Typography>

      <div>
        <TextField
          size="small"
          name="serciceAccountFile"
          fullWidth
          onChange={handleFileUpload}
          type="file"
          variant="outlined"
          classes={{
            root: classes.textFieldInputPadding,
          }}
          className={classes.selectProvider}
          disabled={showErrorModal}
        ></TextField>
      </div>
    </>
  );
};

const DirectorySync = () => {
  const classes = useStyles();

  const [identityProvidersList, setIdentityProvidersList] = useState([]);
  const [directorySyncConfig, setDirectorySyncConfig] = useState([]);

  const [identityProvider, setIdentityProvider] = useState(null);
  const [identityProviderName, setIdentityProviderName] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [tenantId, setTenantId] = useState(null);
  const [superAdminEmail, setSuperAdminEmail] = useState(null);
  const [serviceAccountFile, setServiceAccountFile] = useState(null);

  const [disableButton, setDisableButton] = useState(true);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isConfigLoading, setIsConfigLoading] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);

  useEffect(() => {
    document.title = "Settings | Directory Sync";
  }, []);

  const onGetIdentityProviderSuccess = ({ data }) => {
    setIdentityProvidersList(data.data);
  };

  useCustomQuery({
    apiFunc: getIdentityProviderDetails,
    queryKey: ["identityProviders"],
    onSuccess: onGetIdentityProviderSuccess,
  });

  const onGetDirectorySyncConfigurationSuccess = ({ data }) => {
    setDirectorySyncConfig(data.data);
  };

  useCustomQuery({
    apiFunc: getDirectorySyncConfiguration,
    queryKey: ["directorySyncConfiguration"],
    onSuccess: onGetDirectorySyncConfigurationSuccess,
  });

  const onUpdateSuccess = ({ data }) => {
    if (data?._meta.success) {
      setIsConfigLoading(false);
      successToastify(`Directory synchronization updated successfully`);
    } else {
      setIsConfigLoading(false);
      errorToastify(
        "Unable to update synchronization configuration, please try again later."
      );
    }
  };

  const { mutate: updateDirectorySyncConfig } = useCustomMutation({
    apiFunc: updateDSyncRequest,
    onSuccess: onUpdateSuccess,
    retries: 0,
  });

  const onCreateSuccess = ({ data }) => {
    if (data?.data?._meta.success) {
      setIsConfigLoading(false);
      successToastify(data?.data?._meta.message);
    } else {
      setIsConfigLoading(false);
      errorToastify(
        "Unable to create synchronization configuration, please try again later."
      );
    }
  };

  const { mutate: createDirectorySyncConfig } = useCustomMutation({
    apiFunc: createPostRequest,
    onSuccess: onCreateSuccess,
    retries: 0,
  });

  const getCurrentIdentityProvider = () => {
    let idProvider;
    if (directorySyncConfig.length) {
      identityProvidersList.map((identityProvider) => {
        if (identityProvider.id === directorySyncConfig[0]?.identityProvider) {
          idProvider = identityProvider.name;
          return;
        }
      });
    }
    return idProvider;
  };

  const handleChange = (e) => {
    e.persist();
    setDisableButton(false);

    const name = e.target.name;
    const value = e.target.value;

    switch (name) {
      case "clientId":
        setClientId(value);
        setDisableButton(false);
        break;
      case "clientSecret":
        setClientSecret(value);
        setDisableButton(false);
        break;
      case "tenantId":
        setTenantId(value);
        setDisableButton(false);
        break;
      case "superAdminEmail":
        setSuperAdminEmail(value);
        setDisableButton(false);
        break;
      case "identityProvider":
        const selectedProvider = identityProvidersList.find(
          (provider) => provider.id === value
        );
        setIdentityProvider(value);
        setIdentityProviderName(selectedProvider.name);
        setDisableButton(false);
        break;
      default:
        break;
    }
  };

  const handleSubmit = () => {
    setIsConfigLoading(true);
    setDisableButton(true);

    const data = {
      identityProvider,
      clientId,
      clientSecret,
      tenantId,
      superAdminEmail,
      serviceAccountFile,
    };

    if (!directorySyncConfig?.length) {
      createDirectorySyncConfig(data);
    } else {
      const id = directorySyncConfig[0]?._id;
      const filteredData = {};
      for (const key in data) {
        if (data[key] !== null) {
          filteredData[key] = data[key];
        }
      }
      updateDirectorySyncConfig({ id, ...filteredData });
    }
  };

  // Loaders
  const handleSpinner = (lap) => {
    if (lap.isFinish) {
      setIsConfigLoading(false);
    }
  };

  const handleFileUpload = (event) => {
    setIsFileUploading(true);
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append("file", file);

    axios
      .post(`${process.env.REACT_APP_ENDPOINT}/files/public/upload`, formData)
      .then((response) => {
        setServiceAccountFile(response.data.data[0].id);
        setIsFileUploading(false);
      })
      .catch((error) => {
        errorToastify("Error uploading file. please try again later.");
        setIsFileUploading(false);
      });
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
    <div>
      <DirectorySyncSwitch dSync={directorySyncConfig[0]} />
      <form>
        <Divider
          classes={{
            root: classes.dividerColor,
          }}
        />

        <div className={classes.rowPadding}>
          <div>
            <Typography className={classes.mainText}>
              Configure Directory Sync
            </Typography>
            <Typography className={classes.subText} gutterBottom>
              {directorySyncConfig.length ? (
                <div>
                  You currently have{" "}
                  <b style={{ color: "#2457C1" }}>
                    {getCurrentIdentityProvider()}
                  </b>{" "}
                  configured.
                </div>
              ) : (
                `Choose your provider and provide SCIM credentials.`
              )}
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
              placeholder="Select Identity Provider"
              inputProps={{ "data-testid": "identity-provider-select" }}
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
              {identityProvidersList?.map((idList) => (
                <MenuItem
                  value={idList?.id}
                  key={idList?.id}
                  className={classes.dropDownMenu}
                  data-testid={`identity-provider-${idList?.id}`}
                >
                  <span className={classes.dropDownMenu}>
                    <img src={`${idList?.logo}`} alt="logo" width={18} />
                    {idList?.name}
                  </span>
                </MenuItem>
              ))}
            </Select>
          </div>

          {identityProviderName === "Microsoft Entra ID" ? (
            <HandleMicrosoftEntraID
              directorySyncConfig={directorySyncConfig}
              clientId={clientId}
              clientSecret={clientSecret}
              tenantId={tenantId}
              showErrorModal={showErrorModal}
              handleChange={handleChange}
            />
          ) : null}

          {identityProviderName === "Google Workspace" ? (
            <HandleGoogleWorkspace
              directorySyncConfig={directorySyncConfig}
              superAdminEmail={superAdminEmail}
              showErrorModal={showErrorModal}
              handleChange={handleChange}
              handleFileUpload={handleFileUpload}
            />
          ) : null}

          {isFileUploading && <p>Uploading...</p>}

          <Button
            color="primary"
            style={{ marginTop: 15 }}
            classes={{
              root: classes.customButton,
              label: classes.customButtonLabel,
              disabled: classes.disabled,
            }}
            disabled={disableButton || showErrorModal || isFileUploading}
            onClick={handleSubmit}
            size="large"
            title="Save configuration"
            variant="contained"
            // type="submit"
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DirectorySync;
