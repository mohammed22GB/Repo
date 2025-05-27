import {
  Button,
  Grid,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { DoneRounded } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
    height: "100%",
  },

  wrapper: {
    minHeight: "300px",
    width: "681.43px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRightColor: "#fff",
  },
  wrapperCard: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrapper: {
    width: "90.22px",
    height: "90.22px",
    marginBottom: "1rem",
    backgroundColor: "#41AD49",
  },

  icon: {
    fontSize: "4rem",
    color: "#fff",
  },

  text: {
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: 12,
    // lineHeight: "132.24%",
    textAlign: "center",
    padding: 20,
  },

  btn: {
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "6.64813px",
    lineHeight: "132.24%",
    textAlign: "center",
    backgroundColor: "#010A43",
    borderRadius: "1.4246px",
    color: "#fff",
    marginTop: "1rem",
  },
}));

const UploadedSuccessLayout = ({ uploadDone, successText }) => {
  const classes = useStyles();
  return (
    <Grid
      container
      className={classes.container}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Grid item className={classes.wrapper}>
        <IconButton size="large" className={classes.iconWrapper}>
          <DoneRounded className={classes.icon} />
        </IconButton>

        <Typography variant="h6" component={"span"} className={classes.text}>
          {successText}
        </Typography>

        {/* <Button
          variant="contaained"
          className={classes.btn}
          onClick={() => uploadDone()}
        >
          ok
        </Button> */}
      </Grid>
    </Grid>
  );
};

export default UploadedSuccessLayout;
