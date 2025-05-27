import { makeStyles } from "@material-ui/styles";
import { Typography } from "@material-ui/core";
import Logout from "../../../Login/components/Logout/Logout";

const useStyles = makeStyles((theme) => ({
  trouble: {
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: 350,
    fontSize: 14,
    lineHeight: "169.3%",
    display: "flex",
    color: "#999999",
  },
  links: {
    paddingLeft: "3px",
    color: "#091540",
    fontWeight: "bold",
  },
}));

const IntroGetHelp = () => {
  const classes = useStyles();

  const isLoggedIn = !!localStorage.getItem("userId");

  return (
    <div>
      <Typography
        className={classes.trouble}
        color="textSecondary"
        variant="body1"
        align="right"
        //justifyContent="flex-end"
      >
        {isLoggedIn && <Logout />}
      </Typography>
    </div>
  );
};

export default IntroGetHelp;
