import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: "100%",
    //width: 500,
  },
  paper: {
    padding: theme?.spacing(2),
    textAlign: "center",
    color: theme?.palette.text.secondary,
  },
  screenTitle: {
    marginTop: 10,
    marginBottom: 30,
  },
  widen: {
    width: "50%",
  },
  asbForm: {
    width: "100%",
  },
  enScheduleBar: {
    flexDirection: "row",
  },
  activitySectionMargins: {
    marginTop: 30,
  },
  customButton: {
    // backgroundColor: "#dd4400",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 30,
    paddingRight: 30,
  },
  customButtonLabel: {
    textTransform: "capitalize",
    textDecoration: "none",
    fontSize: 12,
    fontWeight: 300,
    // lineHeight: 1,
  },
  userRole: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: "4rem",
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
  heading5: {
    marginTop: "10px",
    marginBottom: "10px",
    fontSize: 14,
    fontWeight: 500,
    overflow: "hidden",
  },
  accounticon: {
    color: "#999999",
    //cursor: "pointer",
    fontSize: 20,
  },
  linkText: {
    color: "#CCCCCC",
    textDecorationColor: "#CCCCCC",
    textDecoration: "underline",
    textDecorationThickness: "1.5px",
    //textDecorationLine: "2px",
    fontSize: 12,
    textAlign: "center",
    padding: "10px 0",
    width: "40%",
    margin: "auto",
    cursor: "pointer",
    "@media (max-width: 1100px)": {
      width: "50%",
    },
  },
  customInvertedButton: {
    backgroundColor: "transparent",
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 20,
    paddingRight: 20,
    borderWidth: 1.5,
    borderStyle: "solid",
    color: "#091540",
    borderColor: "#091540",
    boxShadow: "none",
  },
  customInvertedButtonLabel: {
    textTransform: "capitalize",
    textDecoration: "none",
    color: "#091540",
    fontSize: 12,
  },
  formTextField: {
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: 12,
    lineHeight: 16,
    display: "flex",
    color: "#091540",
    backgroundColor: "#FFFFFF",
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
    padding: 20,
    // paddingLeft: 80,
    // width: "70%"
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
  formLabel: {
    marginBottom: 13,
    fontWeight: 400,
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

  //VIEW ROLES MODAL
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
  modalTitle: {
    marginBottom: 13,
    fontWeight: 700,
  },
  modalText: {
    fontWeight: 400,
    marginTop: 7,
    marginBottom: 7,
  },
  roleBox: {
    border: "1px solid gray",
    marginBottom: 5,
  },
  cancelButton: {
    // backgroundColor: "#dd4400",
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 30,
    paddingRight: 30,
    border: "2px solid midnightblue",
  },
  cancelButtonLabel: {
    textTransform: "capitalize",
    textDecoration: "none",
    fontSize: 12.5,
    letterSpacing: 0.6,
    fontWeight: 700,
    // lineHeight: 1,
  },
}));

export default useStyles;
