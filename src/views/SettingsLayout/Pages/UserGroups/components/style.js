import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: "100%",
  },
  customPaper: {
    borderRadius: "20px", // Example: Add rounded corners
  },
  gridBox: {
    display: "grid",
    paddingTop: "20px",
    paddingLeft: "10px",
    gridTemplateColumns: "1fr 1fr",
    gap: "30px",
    justifyContent: "space-between",
    alignItems: "start",
    flexWrap: "wrap",
    width: "100%",
    "@media (max-width: 1670px)": {
      gridTemplateColumns: "1fr",
    },
  },
  gridRoot: {
    padding: "20px",
    paddingLeft: "0",
  },
  selectRootField: {},
  rootTextField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "5px",
      "& fieldset": {
        borderColor: "#B8B8B8",
      },
    },
  },
  selectDescriptionField: {
    "& .MuiOutlinedInput-root": {
      padding: "30px 20px",
      borderRadius: "5px",
      "& fieldset": {
        borderColor: "#B8B8B8",
      },
    },
  },
  iconPointer: {
    cursor: "pointer",
  },

  paper: {
    padding: theme?.spacing(2),
    textAlign: "center",
    color: theme?.palette?.text?.secondary,
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
    textTransform: "none",
    padding: "5px 30px",
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
  customButtonLabel: {
    textTransform: "capitalize",
    textDecoration: "none",
    fontSize: 12,
  },
  customInvertedButtonLabel: {
    textTransform: "capitalize",
    textDecoration: "none",
    color: "#091540",
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
    color: theme?.palette?.text?.secondary,
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
    backgroundColor: theme?.palette?.background?.paper,
    border: "none",
    boxShadow: theme?.shadows[5],
    width: 600,
    outline: "none",
    borderRadius: 14,
    [theme?.breakpoints?.down(600)]: {
      width: 400,
    },
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
    paddingTop: 5,
    maxHeight: 400,
    overflowX: "hidden",
  },
  modalBase: {
    padding: "15px 16px 25px 40px",
    borderTop: "solid 1px #EEEEEE",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  formLabel: {
    marginBottom: 10,
    fontWeight: 500,
    color: "#535353",
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
    boxShadow: "0px 7px 64px rgba(0, 0, 0, 0.07)",
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
  userIcon: {
    height: 30,
    width: 30,
    borderRadius: 30,
    backgroundColor: "rgb(255, 204, 0)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 12,
    color: "#FFFFFF",
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
    top: "50%",
    left: "50%",
  },
  noRecord: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    fontStyle: "italic",
    fontWeight: 300,
    color: "#FFCC00",
    backgroundColor: "#FFFFFF",
  },
  userGroupCard: {
    borderRadius: "5px",
    height: "100%",
    boxShadow: "0px 1px 6px 1px rgba(117, 117, 117, 0.25)",
  },
  userGroupCardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "25px",
    paddingBottom: "10px",
  },
  userGroupCardTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#535353",
  },
  userGroupCardDescription: {
    fontSize: "12px",
    fontWeight: 400,
    color: "#535353",
  },
  userGroupCardUtility: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "32px",
  },
  userGroupCardAddIcon: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  userGroupCardFilter: {
    padding: "2px 8px",
    paddingTop: "6px",
    borderRadius: "10px",
    border: "1.5px solid #2457C1",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    cursor: "pointer",
  },
  userGroupCardFilterText: {
    color: "#2457C1",
    fontWeight: 500,
  },
  userGroupCardSingleUserCard: {
    flex: "1",
    display: "grid",
    alignItems: "start",
    gap: "50px",
    overflow: "auto",
    width: "100%",
    gridTemplateColumns: "1fr 1fr",
    padding: "25px",
    [theme?.breakpoints?.down("sm")]: {
      gridTemplateColumns: "1fr", // Change to rows on small screens
    },
  },
  singleUserGroupCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "10px",
    boxShadow: "0px 1px 6px 1px rgba(117, 117, 117, 0.25)",
    width: "100%",
  },
  singleUserGroupCardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    justifyContent: "space-between",
    padding: "10px 15px",
    width: "100%",
    flexWrap: "wrap",
  },
  singleUserGroupCardItemName: {
    color: "#303030",
    fontWeight: 600,
    fontSize: "12px",
    maxWidth: "100px",
    textOverflow: "ellipsis",
    textWrap: "nowrap",
    overflow: "hidden",
  },
  singleUserGroupCardItemUserLength: {
    color: "#8b8b8b",
    fontWeight: 600,
    fontSize: "11px",
    fontStyle: "italic",
    // width: "10px",
    textOverflow: "ellipsis",
    // textWrap: "nowrap",
  },
  singleUserGroupCardItemActions: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    flexWrap: "wrap",
  },
  singleUserGroupCardDivider: {
    height: "2px",
    backgroundColor: "#535353",
  },
  singleUserGroupCardItemButtonContainer: {
    display: "flex",
    justifyContent: "center",
    padding: "25px",
  },
  singleUserGroupCardItemButton: {
    backgroundColor: "#2457C1",
    color: "#ffffff",
    fontWeight: 500,
    textTransform: "none",
  },
  alertModalContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: "15px",
    padding: "30px",
    // width: "100%",
  },
  alertModalContentText: {
    textAlign: "center",
    fontSize: "16px",
    color: "#535353",
    fontWeight: 400,
    lineHeight: "2",

    [theme?.breakpoints?.up("md")]: {
      width: "420px",
    },
  },
  alertModalAction: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: "20px",
  },
  alertModalDialogActions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: "20px",
  },
  alertModalButtonBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  alertModalCancelButton: {
    backgroundColor: "#FFFFFF",
    color: "#2457C1",
    border: "1px solid #2457C1",
    fontWeight: 700,
  },
  alertModalChangeButton: {
    backgroundColor: "#2457c1",
    color: "#fff",
    fontWeight: 700,
  },
}));

export default useStyles;
