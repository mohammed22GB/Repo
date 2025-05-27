import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  main: {
    marginLeft: 179,
    display: "flex",
    flexDirection: "row",
  },
  table: {
    flexGrow: 1,
    height: "100%",
    minWidth: 700,
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
    height: 32,
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
    marginBottom: 20,
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
  billingSection: {
    maxHeight: 180,
    overflowX: "hidden",
    position: "relative",
    width: "100%",
    //marginLeft: 10,
  },
  billingsTable: {
    flexGrow: 1,
    //height: "100%",
    padding: theme?.spacing(2),
    minHeight: 400,
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modal1: {
    backgroundColor: theme?.palette.background.paper,
    border: "none",
    boxShadow: theme?.shadows[5],
    width: 550,
    outline: "none",
    borderRadius: 5,
  },
  modal2: {
    backgroundColor: theme?.palette.background.paper,
    border: "none",
    boxShadow: theme?.shadows[5],
    width: 600,
    outline: "none",
    borderRadius: 5,
  },
  modalHead: {
    padding: "11px 0 6px 25px",
    borderBottom: "solid 1px #ABB3BF",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: 500,
    fontSize: 16,
    color: "#091540",
  },
  billingSubHeader: {
    //fontWeight: 700,
    color: "#091540",
    fontSize: "0.9em",
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
  chartSection: {
    //margin: "0 10px",
    height: 180,
    marginRight: 20,
    width: "100%",
    cursor: "pointer",
    position: "relative",
    //border: "2px solid red",
  },
  chartBorder1: {
    border: "2px solid #512B58",
  },
  chartBorder2: {
    border: "2px solid #0c7b93",
  },
  chartCover: {
    width: "100%",
    height: "100%",
    position: "absolute",
    background: "white",
    opacity: 0.3,
  },
  chartLabels: {
    padding: "15px",
    width: "100%",
    height: "100%",
    position: "absolute",
    display: "flex",
    //alignItems: "center",
    justifyContent: "space-between",
  },
  labelText: {
    color: "#512B58",
  },
  labelText2: {
    color: "#0c7b93",
  },
  body2: {
    position: "absolute",
    bottom: 3,
    width: "100%",
    textAlign: "center",
    color: "gray",
    //marginBottom: "1rem",
  },
  iconWrapper: {
    display: "flex",
    alignItems: "center",
    padding: 5,
    background: "#512B58",
    height: "21%",
    borderRadius: "6px",
  },
  iconWrapper2: {
    display: "flex",
    alignItems: "center",
    padding: 5,
    height: "21%",
    borderRadius: "6px",
    background: "#0c7b93",
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
    borderRadius: "3px",
    // width: "238px",
    height: "170px",
    padding: "0 !important",
  },
  detailsHeader: {
    fontWeight: 500,
    color: "#091540",
    fontSize: 13,
  },
  modalButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "118px",
    height: "28px",
    borderRadius: "3px",
    border: "0.3px solid #091540",
    cursor: "pointer",
    //boxShadow: "0px 7px 64px rgba(0, 0, 0, 0.07)",
  },
  integrations: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "150px",
    height: "28px",
    borderRadius: "3px", //variant="h5"
    border: "0.3px solid #091540",
    padding: "0 9px",
  },
  itemsWrap: {
    backgroundColor: "#FFFFFF",
    padding: "6px 0",
    marginTop: 2,
    //marginLeft: 10,
    display: "flex",
    flexWrap: "wrap",
  },
  modalBadge: {
    margin: "15px 10px",
  },
  modalBadge1: {
    padding: "0 !important",
    fontSize: "10px !important",
  },
  itemWrapper: {
    margin: "18px auto",
    display: "flex",
    //justifyContent: "center",
    alignItems: "center",
  },
  centeredWrapper: {
    display: "flex",
    alignItems: "center",
  },
  expandButton: {
    display: "flex",
    justifyContent: "center",
    width: "115px",
    minHeight: "25px",
    padding: "0 6px",
    borderRadius: "3px",
    border: "0.3px solid #091540",
    cursor: "pointer",
    //position: "relative",
  },
  expandIcon: {
    //color: "F8F8F8",
    cursor: "pointer",
  },
  badge: {
    marginRight: "15px",
    //position: "absolute",
    //right: 0,
  },
  badge1: {
    fontSize: 10,
    padding: 0,
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

  _sectionBox: {
    backgroundColor: "white",
    boxShadow: "0 0 3px #00000021",
    padding: 20,
    marginBottom: 20,
  },
  _sectionHeading: {
    color: "#091540",
    fontSize: 15,
    marginBottom: 5,
  },
  _sectionSubheading: {
    marginBottom: 20,
  },
  _accountDetails: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    fontSize: 13,
    rowGap: 10,
  },
  _combo: {
    flex: 1,
    minWidth: 200,
    // maxWidth: 400,
  },
  _title: {
    backgroundColor: "rgb(243, 247, 251)",
    padding: "10px 15px",
    color: "#091540",
  },
  _value: {
    padding: "10px 15px",
  },
  _metricsHeader: {
    color: "#091540",
    fontSize: 15,
    marginTop: 30,
  },

  sideDialogMain: {
    // padding: "30px 24px",
    padding: "30px 4.8%",
    borderTop: "1px solid #eeeeee",
    borderBottom: "1px solid #eeeeee",
    height: "calc(100% - 163px)",
    overflowY: "hidden",
    minHeight: 450,
    maxHeight: 450,
    "&:hover": {
      overflowY: "overlay",
    },
  },

  sideDialogInputsRow: {
    display: "flex",
    flexDirection: "row",
    "& > div": {
      flex: 1,
      // width: "19vw",
    },
  },
  sideDialogInputFields: {
    marginBottom: 5,
  },
  sideDialogActions: {
    justifyContent: "flex-end",
    padding: 8,
    // marginTop: 30
  },
  sideDialogActionButton: {
    textTransform: "none",
    width: 120,
    fontSize: 12,
    "&:hover": {
      backgroundColor: "#062044",
      color: "#fff",
    },
  },

  newColBtn: {
    transform: "translate(13%, 70%)",
    minWidth: "150px",
  },

  createcolBtn: {
    backgroundColor: "#062044",
    textTransform: "capitalize",
    minWidth: 110,
    fontSize: 12,
    padding: 6,
    "&:hover": {
      backgroundColor: "#ccc",
      color: "#000",
    },
  },
  formLabels: {
    paddingTop: theme?.spacing(3),
    fontStyle: "normal",
    fontWeight: 300,
    fontSize: 12,
    lineHeight: "132.24%",
    display: "flex",
    // color: "#091540",
    color: "#646874",
    // textTransform: "capitalize",
  },
  selectPadding: {
    padding: "10.5px 14px",
  },

  rowLabel: {
    paddingTop: 0,
    flex: "1 1 0%",
    border: "solid 1px #ccc",
    marginBottom: 0,
    borderRadius: 5,
    width: "unset",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  telephone: {
    "& input[type=number]": {
      "-moz-appearance": "textfield",
    },
    "& input[type=number]::-webkit-outer-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
    "& input[type=number]::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
  },
  asterisk: {
    color: "crimson",
  },

  dialogContent: {
    width: "40vw",
    maxWidth: 550,
    minWidth: 350,
  },
}));

export default useStyles;
