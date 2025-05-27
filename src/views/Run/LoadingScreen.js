import { makeStyles } from "@material-ui/styles";
import runLoading from "../../assets/images/run_loading.svg";
const useStyles = makeStyles((theme) => ({
  loadingSquare: {
    position: "fixed",
    width: 220,
    height: 220,
    // backgroundColor: "pink",
    margin: "auto",
    left: 0,
    right: 0,
    top: "calc(50vh - 100px)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    // border: "solid 1px #1d486a",
    border: "solid 1px transparent",
    alignItems: "center",
    borderRadius: 10,
    // boxShadow: "4px 4px 10px #ddd",
    boxShadow: "0 0 20px #eee",
    backgroundColor: "#ffffff",
    zIndex: 10000,
  },
  loadingStatus: {
    fontSize: "0.7em",
    marginTop: 10,
  },
}));
const LoadingScreen = ({ loading, message }) => {
  const classes = useStyles();
  if (!loading) return null;
  return (
    <div className={classes.loadingSquare}>
      {/* <img
        className={classes.image}
        src={runLoading}
        alt=""
        style={{ marginBottom: 10 }}
      /> */}
      <div className="app-run-loader2"></div>
      <div style={{ color: "#666" }}>{message}</div>
      <div className={classes.loadingStatus}>please wait...</div>
    </div>
  );
};

export default LoadingScreen;
