import { useState } from "react";
import useStyles from "../components/style";
import { TextField, Typography, Button, Tooltip } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";

import { updateSamlAuthInfo } from "./ssoAccountsAPI";
import { copyURI, renameFormLabel } from "./helper";
import { errorToastify, infoToastify } from "../../../../common/utils/Toastify";

const SAMLFORM = ({ ssoId, setupParameter, formData, setFormData }) => {
  const classes = useStyles();

  // const [isLoading, setIsLoading] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const [disableButton, setDisableButton] = useState(true);

  const handlePutRequest = async (id, data) => {
    if (!id || !data) return errorToastify("You're missing a required input");
    setIsSaving(true);
    setDisableButton(true);

    try {
      const result = await updateSamlAuthInfo(id, data);
      if (result === "UPDATED") {
        // console.log(`Submitted ${ssoId} with the metadata: ${data}`);
        infoToastify("Account successfully updated");
        setIsSaving(false);
      }
    } catch (error) {
      errorToastify(error.response.data._meta.error.message);
      setIsSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    // Check if any of the fields are empty
    const anyEmptyField = Object.values({
      ...formData,
      [name]: value, // include the newly updated value
    }).some((value) => value === "" || value === null); // Check if any value is empty

    // Disable the button if any field is empty
    setDisableButton(anyEmptyField);
  };

  const handleSamlSubmit = () => {
    const data = formData;
    // console.log("FormMetaData", data);
    // console.log("ssoId", ssoId);
    handlePutRequest(ssoId, data);
  };

  return (
    <>
      <div className={classes.rowPadding}>
        {setupParameter && (
          <>
            <Divider
              classes={{
                root: classes.dividerColor,
              }}
            />
            <div>
              <Typography className={classes.mainText}>
                Setup SAML Authentication
              </Typography>
              <Typography className={classes.subText} gutterBottom>
                Copy and paste the information below to your identity provider
              </Typography>
            </div>
            <div key="" style={{ marginBottom: "20px" }}>
              {setupParameter &&
                Object.entries(setupParameter).map(([key, value], index) => (
                  <div key={index}>
                    <Typography className={classes.subText} gutterBottom>
                      {renameFormLabel(key)}
                    </Typography>

                    <div className={classes.selectURI}>
                      <p className={classes.textURI}>{value}</p>
                      <Tooltip
                        title={`Copy ${renameFormLabel(key)}`}
                        onClick={() => copyURI({ value }, renameFormLabel(key))}
                        placement="top"
                      >
                        <img
                          src="/images/newplug/Content-copy.png"
                          alt="copy_cc"
                          style={{ cursor: "pointer" }}
                        />
                      </Tooltip>
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}

        {formData && (
          <>
            <Divider
              classes={{
                root: classes.dividerColor,
              }}
            />

            <Typography className={classes.subText}>
              Complete below with information from your identity provider
            </Typography>

            <div className={classes.selectProvider}>
              {formData &&
                Object.entries(formData).map(([key, value], index) => (
                  <div key={index}>
                    <Typography className={classes.subText} gutterBottom>
                      {renameFormLabel(key)}
                    </Typography>
                    <TextField
                      className={classes.selectProvider}
                      name={key}
                      size="small"
                      placeholder={renameFormLabel(key)}
                      fullWidth
                      value={value}
                      onChange={handleInputChange}
                      type="text"
                      inputMode="text"
                      variant="outlined"
                    />
                  </div>
                ))}
            </div>

            <Button
              color="primary"
              style={{}}
              classes={{
                root: classes.customButton,
                label: classes.customButtonLabel,
                disabled: classes.disabled,
              }}
              onClick={handleSamlSubmit}
              size="large"
              title="submitBtn"
              variant="contained"
              disabled={disableButton}
              type="submit"
            >
              Save
              {isSaving && <div className="activity-loader"></div>}
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default SAMLFORM;
