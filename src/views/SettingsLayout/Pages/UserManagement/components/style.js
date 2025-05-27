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
    marginBottom: 20,
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
    // backgroundColor: "blue"
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
    backgroundColor: "#010A43",
    padding: "4.5px 20px",
    boxSizing: "border-box",
    border: "solid 1px #010A43",
    color: "#FFFFFF",
    "&:hover": {
      backgroundColor: "#FFFFFF",
      color: "#010A43",
    },
  },
  iconButton: {
    backgroundColor: "transparent",
    padding: "4.5px 12px",
    boxSizing: "border-box",
    border: "solid 1px #010A43",
    color: "#FFFFFF",
    display: "flex",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  customInvertedButton: {
    backgroundColor: "transparent",
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 20,
    paddingRight: 20,
    borderWidth: 1.5,
    borderStyle: "solid",
    borderColor: "#dd4400",
  },
  customButtonLabel: {
    textTransform: "capitalize",
    textDecoration: "none",
    fontSize: 12,
  },
  customInvertedButtonLabel: {
    textTransform: "capitalize",
    textDecoration: "none",
    color: "#dd4400",
    fontSize: 12,
  },
  margin20: {
    padding: 20,
  },
  topMargin0: {
    marginTop: 0,
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
    width: "50%",
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
  noRecord: {
    padding: 20,
    fontStyle: "italic",
    fontWeight: 300,
    color: "#FFCC00",
    backgroundColor: "#FFFFFF",
  },
  modalMain: {
    padding: 30,
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
  loadingPage: {
    textAlign: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
  },
  switchLabel: {
    display: "flex",
    gap: 10,
    marginLeft: 6,
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 12,
  },
  phoneInput: {
    "& .MuiOutlinedInput-input": {
      "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
        "-webkit-appearance": "none",
      },
    },
  },
  userPortalButton: {
    textTransform: "none",
    color: "#F4F8FF",
    padding: "7.5px 20px",
    borderRadius: 9,
    fontSize: 13,
  },
}));

export default useStyles;
