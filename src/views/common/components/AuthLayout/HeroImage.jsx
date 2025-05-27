import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography } from "@material-ui/core";
import IntroHeaderLogo from "../../components/IntroHeaderLogo/IntroHeaderLogo";

const useStyles = makeStyles((theme) => ({
  grid: {
    minHeight: "100%",
    width: "50%",
    position: "relative",
    [theme?.breakpoints?.down("sm")]: {
      width: "20%",
    },
    [theme?.breakpoints?.down("xs")]: {
      position: "absolute",
    },
  },
  quoteContainer: {
    //paddingTop: theme?.spacing(4),
    display: "flex",
    flexDirection: "column",
    //justifyContent: "center",
    alignItems: "center",
    background: "#2457C1",
    width: "50%",
    height: "100%",
    top: "50%",
    left: "25%",
    transform: "translateX(-50%) translateY(-50%)",
    position: "fixed",
    zIndex: -5,
    [theme?.breakpoints?.down("sm")]: {
      background: "#fff",
      position: "static",
      transform: "none",
      top: "0%",
      left: "0%",
    },
  },
  logoSize: {
    top: "7%",
    left: "10%",
    transform: "translateX(-50%) translateY(-50%)",
    position: "fixed",
    //border: "3px solid red",
    [theme?.breakpoints?.down("sm")]: {
      alignSelf: "flex-start",
      position: "relative",
      top: 25,
      left: 12,
      transform: "none",
    },
  },

  shadowImg: {
    //top: "50%",
    //border: "3px solid blue",
    left: "70%",
    transform: "translateX(-50%) translateY(-50%)",
    position: "fixed",
    [theme?.breakpoints?.down("sm")]: {
      display: "none",
      position: "static",
      transform: "none",
      top: "0%",
      left: "0%",
    },
  },

  btmShadowImg: {
    //border: "3px solid red",
    bottom: "0%",
    left: "35%",
    transform: "translateX(-50%) translateY(35%)",
    position: "fixed",
    [theme?.breakpoints?.down("sm")]: {
      display: "none",
      position: "static",
      transform: "none",
      top: "0%",
      left: "0%",
    },
  },

  starsImg: {
    height: "88vh",
    //border: "3px solid green",
    top: "50%",
    left: "50%",
    transform: "translateX(-50%) translateY(-50%)",
    position: "fixed",
    [theme?.breakpoints?.down("sm")]: {
      display: "none",
      position: "static",
      transform: "none",
      top: "0%",
      left: "0%",
    },
  },

  hideItemXS: {
    [theme?.breakpoints?.down("xs")]: {
      display: "none",
    },
  },
  hideItemSM: {
    [theme?.breakpoints?.down("sm")]: {
      display: "none",
    },
  },

  mac: {
    //width: "60%",
    //paddingLeft: "10%",
    //paddingTop: "5%",
    //border: "3px solid green",
    top: "45%",
    left: "50%",
    transform: "translateX(-50%) translateY(-50%)",
    position: "fixed",
    [theme?.breakpoints?.down("lg")]: {
      width: "75%",
    },
    [theme?.breakpoints?.down("xl")]: {
      width: "65%",
    },
    [theme?.breakpoints?.down("sm")]: {
      position: "static",
      transform: "none",
      top: "0%",
      left: "0%",
    },
  },
  macBox: {
    //border: "3px solid red",
  },

  heroText: {
    paddingTop: "6%",
    display: "flex",
    flexDirection: "column",
    [theme?.breakpoints?.down("sm")]: {
      display: "none",
    },
  },
  innovateone: {
    fontFamily: "Open Sans",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#E9E9E9",
    lineHeight: "10px",
    width: "100%",
    top: "75%",
    left: "50%",
    transform: "translateX(-50%) translateY(-50%)",
    position: "fixed",
    [theme?.breakpoints?.down("xl")]: {
      fontSize: 22,
      lineHeight: "10px",
    },
    [theme?.breakpoints?.down("sm")]: {
      position: "static",
      transform: "none",
      top: "0%",
      left: "0%",
    },
  },

  innovateoneone: {
    fontFamily: "Open Sans",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#E9E9E9",
    lineHeight: "10px",
    width: "100%",
    top: "78%",
    left: "50%",
    transform: "translateX(-50%) translateY(-50%)",
    position: "fixed",
    paddingTop: "6%",
    [theme?.breakpoints?.down("xl")]: {
      fontSize: 22,
      lineHeight: "10px",
    },
    [theme?.breakpoints?.down("sm")]: {
      position: "static",
      transform: "none",
      top: "0%",
      left: "0%",
    },
  },

  innovatetwotwo: {
    paddingLeft: "7px",
    color: "#E9E9E9",
  },
}));

const HeroImage = () => {
  const classes = useStyles();

  return (
    <div className={classes.grid}>
      <div className={classes.quoteContainer}>
        <div className={classes.logoSize}>
          <IntroHeaderLogo />
        </div>

        <div>
          <img
            src="/images/newplug/top.png"
            alt="backgroundShadow"
            className={classes.shadowImg}
          />
        </div>

        <div>
          <img
            src="/images/newplug/bottom.png"
            alt="backgroundShadow"
            className={classes.btmShadowImg}
          />
        </div>

        <div>
          <img
            src="/images/newplug/starsImg.png"
            alt="backgroundShadow"
            className={classes.starsImg}
          />
        </div>

        <div className={classes.macBox}>
          <img
            alt="Macintosh"
            className={`${classes.hideItemSM} ${classes.mac}`}
            src="/images/newplug/macbook.png"
          />
        </div>

        <Grid item className={[classes.heroText, classes.hideItemSM]}>
          <Typography className={classes.innovateone}>
            Innovate Smarter, Ship Faster,
          </Typography>
          <Typography className={classes.innovateoneone}>
            Think
            <span className={classes.innovatetwotwo}>Plug!</span>
          </Typography>
        </Grid>
      </div>
    </div>
  );
};

export default HeroImage;
