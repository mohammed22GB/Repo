import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      //padding: 16,
    },
    heading: {
      fontSize: "14px",
      textTransform: "capitalize",
      whiteSpace: "nowrap",
      marginRight: 10,
    },
  })
);

export default function CustomLabelFields({ title, children }: any) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState<string | false>("panel1");

  const handleChange =
    (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <div className={classes.root}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          justifyContent: "space-between",
          padding: "0px",
        }}
      >
        <Typography className={classes.heading}>{title}</Typography>
        {children}
      </div>
    </div>
  );
}
