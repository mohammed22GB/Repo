import { makeStyles } from "@material-ui/core/styles";
import { Typography, Tooltip } from "@material-ui/core";
import { useStyles } from "../../Helpers/rightSidebarStyles";
import { INVALID_FIELD_LABEL_STYLE } from "../../../../utils/constants";

const PropertyFieldLabel = ({
  propertyFieldname,
  isFieldOptional = true,
  propertyReference = false,
  onSave,
  heldBody,
  messageSavedIndicator,
  savedMessage = false,
  enabledTooltip = false,
  tooltipTitle,
}) => {
  const classes = useStyles(makeStyles);

  return (
    <Typography
      gutterBottom
      className={classes.sectionTitle}
      style={propertyReference ? INVALID_FIELD_LABEL_STYLE : {}}
    >
      {enabledTooltip && tooltipTitle ? (
        <Tooltip placement="right" title={tooltipTitle}>
          <span> {propertyFieldname}</span>
        </Tooltip>
      ) : (
        propertyFieldname
      )}
      {isFieldOptional ? "" : "*"}
      {savedMessage && (
        <>
          <span
            className="email-body-save-btn"
            onClick={() => onSave(heldBody, "to-id")}
          >
            Save message
          </span>
          {messageSavedIndicator ? (
            <span
              style={{
                fontSize: "11px",
                fontWeight: 500,
                marginRight: 10,
                float: "right",
              }}
              id="mail-action-message-saved"
            >
              Message saved
            </span>
          ) : (
            ""
          )}
        </>
      )}
    </Typography>
  );
};

export default PropertyFieldLabel;
