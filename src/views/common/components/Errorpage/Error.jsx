import { makeStyles } from "@material-ui/core/styles";
import { Grid, Link } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    maxWidth: "1020px",
    margin: "0 auto",
  },

  newRoot: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: "100px",
    width: "100%",
    [theme?.breakpoints?.down("xs")]: {
      flexDirection: "column",
    },
    [theme?.breakpoints?.down("sm")]: {
      flexDirection: "column",
      paddingTop: "70px",
    },
    [theme?.breakpoints?.down("md")]: {
      flexDirection: "column",
      paddingTop: "70px",
    },
  },

  grid: {
    display: "grid",
    alignItems: "center",
    justifyContent: "center",

    [theme?.breakpoints?.down("sm")]: {
      alignItems: "start",
      margin: "20px",
      marginTop: "50px",
    },
  },

  gridText: {
    display: "grid",
    alignItems: "center",
    justifyContent: "center",
    color: "#343434",
    fontFamily: "Inter",
    marginRight: "50px",

    [theme?.breakpoints?.down("sm")]: {
      justifyContent: "start",
      width: "320px",
    },
  },

  text404: {
    fontSize: "170px",
    fontWeight: 800,
    margin: "0",
    padding: "0",

    [theme?.breakpoints?.down("sm")]: {
      fontSize: "100px",
    },
  },

  notFound: {
    fontSize: "30px",
    fontWeight: 800,
    margin: "0",
    padding: "0",
    [theme?.breakpoints?.down("sm")]: {
      fontSize: "18px",
    },
  },

  notExist: {
    fontSize: "18px",
    lineHeight: "2",
    [theme?.breakpoints?.down("sm")]: {
      fontSize: "14px",
      lineHeight: "1.7",
    },
  },

  notExistSubText: {
    width: "385px",
    textAlign: "justify",
    [theme?.breakpoints?.down("sm")]: {
      width: "300px",
    },
  },

  backToHome: {
    fontFamily: "Inter",
    fontStyle: "normal",
    backgroundColor: "#2457C1",
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
    textTransform: "none",
    borderRadius: "10px",
    padding: theme?.spacing(1.5),
    width: "35%",
    boxShadow: "0px 4px 10px 1px rgba(43, 45, 66, 0.25)",

    [theme?.breakpoints?.down("sm")]: {
      width: "40%",
    },
  },

  vectorError: {
    [theme?.breakpoints?.down("sm")]: {
      width: "100%",
      marginTop: "10px",
    },
    [theme?.breakpoints?.down("md")]: {
      width: "100%",
      marginTop: "40px",
    },
  },

  logoSize: {
    position: "absolute",
    top: "7%",
    left: "7%",
    transform: "translateX(-50%) translateY(-50%)",

    [theme?.breakpoints?.down("sm")]: {
      left: "15%",
    },
  },
}));

const ErrorPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.logoSize}>
        <img alt="Logo" src="/images/plug-logo.png" width={100} />
      </div>

      <div className={classes.newRoot}>
        <Grid className={classes.grid}>
          <div className={classes.gridText}>
            <p className={classes.text404}>404</p>
            <p className={classes.notFound}>Ooops...page not found</p>
          </div>

          <div className={classes.notExist}>
            <p className={classes.notExistSubText}>
              The page you’re looking for does not exist or another error has
              occured. Not to worry, click the button below to find your way
              back.
            </p>
          </div>

          <Link
            className={classes.backToHome}
            component={RouterLink}
            to="login"
          >
            Back to Home
          </Link>
        </Grid>

        <div>
          <img
            alt="Logo"
            src="/images/errorVector.png"
            className={classes.vectorError}
          />
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
