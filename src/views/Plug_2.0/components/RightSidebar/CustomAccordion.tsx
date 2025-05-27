import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import infoIcon from "../../../../assets/icons/info.svg";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      //width: "100%",
      padding: 16,
      "&.MuiTypography-root": {
        fontWeight: 500,
      },
    },
    heading: {
      fontSize: "14px",
      textTransform: "capitalize",
      whiteSpace: "nowrap",
    },
    subHeading: {
      fontSize: "11px ",
      padding: "4px 8px",
      background: "#F0F0F0",
      textTransform: "capitalize",
      borderRadius: 4,
    },
    accordionControl: {
      "&.MuiAccordionSummary-root": {
        minHeight: 11,
      },
      "& .MuiAccordionSummary-content": {
        margin: "15px 0",
      },
    },
  })
);

export default function CustomAccordion({ title, subTitle, children }: any) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState<string | false>("panel1");

  const handleChange =
    (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <div
      className={`${classes.root} properties_accordion`}
      style={{
        padding: 16,
        borderTop: "1px solid #d1d5db",
        // borderRight: "none",
        // borderLeft: "none",
      }}
    >
      <Accordion
        expanded={expanded === "panel1"}
        elevation={0}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary
          style={{ margin: 0, padding: 0 }}
          className={classes.accordionControl}
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography className={classes.heading}>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails style={{ margin: 0, padding: 0 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Typography className={classes.subHeading}>{subTitle}</Typography>
              <img src={infoIcon} alt="info" />
            </div>
            {children}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
