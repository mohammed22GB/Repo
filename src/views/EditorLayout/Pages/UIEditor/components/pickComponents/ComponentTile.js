import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "3px 0px",
    width: "100%",
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100%",

    boxShadow: "0px 1px 4px 1px #71717140",
    backgroundColor: "#ffffff",
    borderRadius: 2,
  },
  imageIcon: {
    padding: 0,
  },
  iconRoot: {
    textAlign: "center",
    marginBottom: "6px !important",
    height: "unset",
    "& > img": {
      width: 20,
      filter: "invert(1)",
    },
  },
  tileText: {
    color: "#2B2D42",
    fontSize: "8px !important",
    fontWeight: 400,
    lineHeight: "12px !important",
    //letterSpacing: "0.5px",
  },
}));

export default function SimplePaper(props) {
  const classes = useStyles();

  return (
    <Paper
      className={classes?.root}
      elevation={3}
      align="center"
      id={props.tileId}
    >
      <Icon classes={{ root: classes?.iconRoot }}>
        <img
          className={classes?.imageIcon}
          src={props.icon}
          draggable={false}
          alt=""
        />
      </Icon>
      <Typography className={classes?.tileText}>{props.title}</Typography>
    </Paper>
  );
}
