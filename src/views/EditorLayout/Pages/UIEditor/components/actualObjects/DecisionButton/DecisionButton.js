import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Grid, Typography } from "@material-ui/core";
import Required from "../Required";

export default function DecisionButton({ style, values }) {
  const useStyles = makeStyles((theme) => style);
  const classes = useStyles();

  return (
    <div>
      {/* <Typography className={classes?.label}>Enter Label Name</Typography> */}
      {!values?.labelHide && (
        <Typography gutterBottom className={classes?.label}>
          {values?.label}
          <Required required={values?.required} />
        </Typography>
      )}
      <Grid container>
        <Grid item xs={1}>
          <Button
            // disabled={style.appDesignMode === APP_DESIGN_MODES.EDIT}
            className={classes?.yesBtn}
          >
            {values?.yesBtn}
          </Button>
        </Grid>
        <Grid item xs={1}>
          <Button
            // disabled={style.appDesignMode === APP_DESIGN_MODES.EDIT}
            className={classes?.noBtn}
          >
            {values?.noBtn}
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
