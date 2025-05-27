import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: "708px",
  },
  paper: {
    padding: theme?.spacing(2),
    textAlign: "center",
    color: theme?.palette.text.secondary,
  },
  input: {
    padding: "10px 14px",
  },
  screenTitle: {
    marginTop: 10,
    marginBottom: 20,
  },
  noRecord: {
    padding: 20,
    fontStyle: "italic",
    fontWeight: 300,
    color: "#FFCC00",
    backgroundColor: "#FFFFFF",
  },
  ul: {
    padding: 0,
    margin: 0,
  },
  noMargin: {
    margin: 0,
    marginTop: -8,
  },
  topMargin20: {
    marginTop: 20,
  },
  paddingLeft50: {
    paddingLeft: 50,
  },
  asbForm: {
    width: "100%",
  },
  asbActionButton: {},
  asbSearchBar: {
    padding: theme?.spacing(2),
    textAlign: "center",
    color: theme?.palette.text.secondary,
  },
  noRadius: {
    backgroundColor: "white",
    borderColor: "red",
  },
  loadingPage: {
    textAlign: "center!important",
    position: "absolute!important",
    top: "50%!important",
    left: "50%!important",
  },
  listsubheader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FAFBFC",
    paddingTop: 20,
    marginBottom: 40,
  },
  listSection: {
    listStyleType: "none",
  },
}));

export default useStyles;
