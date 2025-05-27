import { useEffect, useState } from "react";
import { Grid, FormControlLabel } from "@material-ui/core";

import useStyles from "../components/style";
import { TwoFactor } from "../components/StyledSwitch";
import {
  enableDSyncRequest,
  updateDSyncRequest,
} from "../utils/directorySyncAPIs";
import {
  errorToastify,
  successToastify,
} from "../../../../common/utils/Toastify";
import CustomConfirmBox from "../../../../common/components/CustomConfirmBox/CustomConfirmBox";
import useCustomQuery from "../../../../common/utils/CustomQuery";
import useCustomMutation from "../../../../common/utils/CustomMutation";

const EnableDirectorySync = (props) => {
  const classes = useStyles();
  const [isChecked, setIsChecked] = useState(false);
  const [activateDirectorySync, setActivateDirectorySync] = useState("");

  useEffect(() => {
    setIsChecked(props?.dSync?.isEnabled);
  }, [props]);

  const onEnableSuccess = ({ data }) => {
    if (data?._meta.success) {
      successToastify(
        `Directory synchronization ${
          data.data.isEnabled ? "ENABLED" : "DISABLED"
        }`
      );
    } else {
      errorToastify(
        "Unable to switch synchronization status, please try again later."
      );
    }
  };

  const { mutate: updateDirectorySyncStatus } = useCustomMutation({
    apiFunc: enableDSyncRequest,
    onSuccess: onEnableSuccess,
    retries: 0,
  });

  const activateSync = async () => {
    if (!props.dSync) {
      return errorToastify("You need to configure directory sync first");
    }

    const bool = !activateDirectorySync?.target?.checked;
    setIsChecked(bool);

    updateDirectorySyncStatus({ id: props.dSync._id, isEnabled: bool });
  };

  return (
    <div className={[classes.paddingLeft50]}>
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
                control={
                  <TwoFactor
                    checked={isChecked}
                    // onChange={handleChange}
                    onChange={(e) => {
                      e.persist();
                      setActivateDirectorySync(e);
                    }}
                    name="checkedC"
                    color="primary"
                  />
                }
                label="Enable Directory Sync"
                labelPlacement="end"
              />
            </div>
          </Grid>
        </Grid>
      </Grid>
      {!!activateDirectorySync && (
        <CustomConfirmBox
          closeConfirmBox={() => setActivateDirectorySync("")}
          text={`${
            activateDirectorySync?.target?.checked ? "Enable" : "Disable"
          } directory synchronization for this account?`}
          open={!!activateDirectorySync}
          confirmAction={() => activateSync()}
        />
      )}
    </div>
  );
};

export default EnableDirectorySync;
