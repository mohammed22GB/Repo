import { useEffect } from "react";
import validate from "validate.js";
import { makeStyles } from "@material-ui/core";
import { Button, Typography } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { unprotectedUrls } from "../../../../../common/utils/lists";

const schema = {
  password: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 64,
    },
  },
};

const useStyles = makeStyles((theme) => ({
  confirmtick: {
    width: "25%",
    margin: theme?.spacing(4),
  },

  form: {
    textAlign: "center",
  },

  title: {
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: 24,
    color: "#091540",
  },

  confirmbutton: {
    fontFamily: "Inter",
    fontStyle: "normal",
    margin: theme?.spacing(3, 0),
    backgroundColor: "#010A43",
    color: "#fff",
    textTransform: "none",
  },
}));

const FinishSetupConfirm = ({ formState, setFormState, navigation }) => {
  const classes = useStyles();
  const history = useHistory();

  useEffect(() => {
    const errors = validate(formState?.values, schema);

    setFormState((formState) => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {},
    }));
  }, [formState?.values, setFormState]);

  const handleSubmit = (event) => {
    history.push(unprotectedUrls.LOGIN);

    event.preventDefault();
  };

  return (
    <Grid container justifyContent="center" className={classes.actionContainer}>
      <form className={classes.form} data-testid="form">
        <img
          alt="Confirm"
          className={classes.confirmtick}
          src="/images/confirmtick.png"
        />
        <Typography className={classes.title}>
          Password reset successful
        </Typography>
        <Button
          className={classes.confirmbutton}
          onClick={handleSubmit}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
        >
          Proceed to Login
        </Button>
      </form>
    </Grid>
  );
};

export default FinishSetupConfirm;
