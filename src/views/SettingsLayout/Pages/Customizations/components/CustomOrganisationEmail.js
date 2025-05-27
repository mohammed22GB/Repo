import useStyles from "./style";
import Divider from "@material-ui/core/Divider";
import Accordion from "@material-ui/core/Accordion";
import { Typography, Select, MenuItem } from "@material-ui/core";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ArrowDropDownRoundedIcon from "@material-ui/icons/ArrowDropDownRounded";
import CustomToggleSwitch from "./CustomToggleSwitch";
import { DEFAULT, PLUG } from "../utils/customizationutils";
import { useEffect, useState } from "react";

const CustomOrganisationEmail = ({
  defaultEmailSender,
  integrationList,
  handleUpdate,
}) => {
  const classes = useStyles();
  const [isPlugDefaultEnabled, setIsPlugDefaultEnabled] = useState(false);
  const [integrationId, setIntegrationId] = useState("");

  useEffect(() => {
    setIsPlugDefaultEnabled(defaultEmailSender?.usePlugDefault);
    setIntegrationId(defaultEmailSender?.integrationId);
  }, [defaultEmailSender]);

  return (
    <>
      <Accordion
        style={{ borderRadius: "10px" }}
        data-testid="customise-organization-email-appearance"
      >
        <AccordionSummary
          expandIcon={
            <ArrowDropDownRoundedIcon fontSize="large" htmlColor="#000000" />
          }
          aria-controls="custom-default-email-panel1a-content"
          id="custom-default-email-panel1a-header"
        >
          <div className={classes.customOrgEmailSummary}>
            <Typography className={classes.heading}>
              Customise Organisation Email
            </Typography>
            <FormControlLabel
              aria-label="email-sender-toggle"
              onClick={(event) => event.stopPropagation()}
              onFocus={(event) => event.stopPropagation()}
              control={
                <CustomToggleSwitch
                  checked={isPlugDefaultEnabled ? false : true}
                  onChange={(e) => {
                    setIsPlugDefaultEnabled(!e.target.checked);

                    handleUpdate({
                      defaultEmailSender: {
                        usePlugDefault: !e.target.checked,
                        integrationId: !e.target.checked === true ? null : null,
                      },
                    });
                  }}
                  name="defaultEmailSenderToggle"
                />
              }
            />
            <Typography className={classes.customOrgEmailDisableLabel}>
              {isPlugDefaultEnabled ? "Disable" : "Enable"}
            </Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails className={classes.customOrgEmailSummaryBox}>
          <Typography className={classes.subHeading}>
            Change your organisation email
          </Typography>

          <Divider />
          <div style={{ paddingBottom: "20px" }}>
            <div className={classes.customOrgEmailSenderBox}>
              <div>
                <Typography className={classes.mainText} gutterBottom>
                  Email sender
                </Typography>
                <Typography className={classes.subText}>
                  Select or customise your email sender
                </Typography>
              </div>

              <div style={{ width: "180px" }}>
                <Select
                  size="small"
                  variant="outlined"
                  name="integrationId"
                  fullWidth
                  value={integrationId ?? DEFAULT.PLUG}
                  onChange={(e) => {
                    setIntegrationId(e.target.value);
                    handleUpdate({
                      defaultEmailSender: {
                        integrationId: e.target.value,
                      },
                    });
                  }}
                  disabled={isPlugDefaultEnabled ? true : false}
                  classes={{
                    root: classes.selectPadding,
                  }}
                >
                  <MenuItem
                    value={DEFAULT.PLUG}
                    disabled={true}
                    selected={true}
                  >
                    Plug
                  </MenuItem>
                  {integrationList?.map((integrationOrg, index) => (
                    <MenuItem value={integrationOrg?.id} key={index}>
                      {integrationOrg.value}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default CustomOrganisationEmail;
