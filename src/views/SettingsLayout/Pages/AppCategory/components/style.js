import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: "100%",
  },
  paper: {
    padding: theme?.spacing(2),
    textAlign: "center",
    color: theme?.palette.text.secondary,
  },
  screenTitle: {
    marginTop: 10,
    marginBottom: 50,
  },
  asbForm: {
    width: "100% !important",
  },
  enScheduleBar: {
    flexDirection: "row",
  },
  activitySectionMargins: {
    marginTop: 30,
  },
  ul: {
    padding: 0,
  },
  paddingLeft50: {
    paddingLeft: 0,
    [theme?.breakpoints?.up("md")]: {
      paddingLeft: 0,
    },
  },
  outer: {
    backgroundColor: "blue",
  },
  inner: {
    backgroundColor: "#EDF1F8",
    float: "left",
    margin: 2,
    paddingTop: 1,
    paddingBottom: 1,
    paddingRight: 3,
    paddingLeft: 3,
    width: 50,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 300,
    textAlign: "center",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
  innerLast: {
    float: "left",
    margin: 2,
    paddingTop: 1,
    paddingBottom: 1,
    width: 50,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 300,
    textAlign: "center",
  },
  customButton: {
    // backgroundColor: "#dd4400",
    backgroundColor: "#091540",
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 20,
    paddingRight: 20,
    color: "#FFFFFF",
    borderStyle: "solid",
    borderColor: "#091540",
    borderWidth: 1,
    "&:hover": {
      backgroundColor: "#FFFFFF",
      color: "#010A43",
    },
  },
  customButtonLabel: {
    textTransform: "capitalize",
    textDecoration: "none",
    fontSize: 12,
  },
  margin20: {
    padding: 20,
  },
  topMargin20: {
    marginTop: 20,
  },
  topMargin30: {
    marginTop: 30,
  },
  paddingLeft80: {
    paddingLeft: 80,
  },
  bottomMargin20: {
    marginBottom: 3,
  },
  noLeftMargin: {
    marginLeft: 0,
    width: 300,
  },
  floatRight: {
    justifyContent: "flex-end",
  },
  asbSearchBar: {
    padding: theme?.spacing(2),
    textAlign: "center",
    color: theme?.palette.text.secondary,
  },
  noLineLink: {
    textDecoration: "none",
  },
  dataLabel: {
    color: "#999999",
  },
  inputData: {
    marginTop: 10,
    fontWeight: "bold",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper2: {
    backgroundColor: theme?.palette.background.paper,
    border: "none",
    boxShadow: theme?.shadows[5],
    width: 400,
    outline: "none",
    borderRadius: 5,
  },
  modalHead: {
    padding: "8px 16px 8px 30px",
    borderBottom: "solid 1px #EEEEEE",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalMain: {
    // padding: theme?.spacing(2, 4, 3),
    padding: 30,
    paddingTop: 10,
    maxHeight: 400,
    overflowX: "hidden",
  },
  modalBase: {
    padding: "8px 16px 8px 40px",
    borderTop: "solid 1px #EEEEEE",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  formLabel: {
    marginBottom: 13,
    fontWeight: 400,
  },
  container: {
    marginTop: "53PX",
    marginRight: "27px",
    width: 258,
    height: 165,
    backgroundColor: "#FFFFFF",
    border: "1px dashed #999999",
    boxSizing: "border-box",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    cursor: "pointer",
  },
  moredetails: {
    width: "100%",
    // marginTop: "55PX",
    position: "relative",
    backgroundColor: "#FFFFFF",
    //boxShadow: "0px 7px 64px rgba(0, 0, 0, 0.07)",
    borderRadius: "3px",
    // width: "238px",
    height: "170px",
    // marginLeft: "27px",
    // marginRight: "27px",
    padding: "0 !important",
  },
  add: {
    color: "#FFFFFF",
    backgroundColor: "#999999",
    fontSize: 27,
    // position: "absolute",
    borderRadius: "8px",
  },
  accounticon: {
    color: "#999999",
    cursor: "pointer",
    fontSize: 20,
  },
  linkText: {
    color: "#CCCCCC",
    textDecorationColor: "#CCCCCC",
    fontSize: 12,
    fontStyle: "italic",
    textAlign: "center",
    padding: "10px 0",
  },
  details: {
    marginTop: "53PX",
    backgroundColor: "#FFFFFF",
    boxShadow: "0px 7px 64px rgba(0, 0, 0, 0.07)",
    borderRadius: "3px",
    width: "238px",
    height: "165px",
  },
  margin: {
    margin: theme?.spacing(1),
  },
  assign: {
    width: "500px",
    height: "500px",
  },
  cancel: {
    cursor: "pointer",
    color: "#ABB3BF",
  },
  noRecord: {
    display: "flex",
    justifyContent: "center",
    fontStyle: "italic",
    fontWeight: 300,
    color: "#FFCC00",
    paddingTop: 30,
    backgroundColor: "#FFFFFF",
  },
  heading5: {
    marginTop: "10px",
    marginBottom: "10px",
    fontSize: 14,
    fontWeight: 500,
    overflow: "hidden",
  },
  twoicon: {
    cursor: "pointer",
    color: "#999999",
    marginTop: "10px",
    marginBottom: "10px",
  },
  remove: {
    cursor: "pointer",
  },
  input1: {
    WebkitBoxShadow: "0 0 0 1000px white inset",
    fontSize: 15,
  },
  input2: {
    WebkitBoxShadow: "0 0 0 1000px white inset",
    "&::placeholder": {
      fontSize: 11,
    },
  },
  loadingPage: {
    textAlign: "center",
    position: "absolute",
    top: "90% !important",
    left: "50%",
  },
}));

export default useStyles;
