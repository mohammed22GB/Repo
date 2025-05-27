import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    // maxWidth: 500,
    width: "100%",
  },
  mainColumnSection: {
    display: "flex",
    alignItems: "start",
    justifyContent: "space-between",
    gap: "20px",

    "@media (max-width: 1240px)": {
      flexDirection: "column",
      justifyContent: "flex-start",
    },
  },
  firstColumnSection: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    width: "50%",
    "@media (max-width: 1240px)": {
      width: "100%",
    },
  },
  secondColumnSection: {
    width: "50%",
    "@media (max-width: 1240px)": {
      width: "100%",
    },
  },

  heading: {
    fontWeight: 600,
    fontSize: "14px",
    color: "#303030",
  },
  subHeading: {
    fontWeight: 400,
    fontSize: "14px",
    color: "#535353",
  },
  mainText: {
    fontWeight: 700,
    fontSize: "14px",
    color: "#535353",
  },
  offSubText: {
    color: "#B7B7B7",
    fontWeight: 400,
    fontSize: "14px",
  },

  internalMaintext: {
    color: "#303030",
    fontWeight: 600,
    fontSize: "14px",
  },
  subText: {
    fontWeight: 400,
    fontSize: "13px",
    color: "#8A8A8A",
  },
  subTextOff: {
    fontWeight: 400,
    fontSize: "14px",
    color: "#535353",
  },
  subTextOffTwo: {
    fontWeight: 400,
    fontSize: "14px",
    textTransform: "uppercase",
    color: "#464D72",
  },

  title: {
    // fontFamily: "Inter",
    // fontStyle: "normal",
    // fontWeight: 500,
    fontSize: 12,
    // lineHeight: "132.24%",
    color: "#091540",
    fontWeight: 600,
    // margin: "40px 0 0",
    // display: "flex", */
    backgroundColor: "#fafafa",
    padding: "5px 8px",
    border: "solid 0.5px #ccc",
    borderRadius: 5,
  },
  usePlug: {
    fontSize: 12,
    // lineHeight: "132.24%",
    color: "#091540",
    fontWeight: 600,
  },
  phonenumber: {
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 12,
    lineHeight: "132.24%",
    color: "#091540",
    top: 366,
    left: 707,
    position: "absolute",
    width: 79,
    height: 16,
    display: "flex",
    alignItems: "center",
  },
  phonenumberTextField: {
    position: "absolute",
    width: 410,
    height: 62,
    top: 394,
    left: 707,

    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: 12,
    lineHeight: 16,

    display: "flex",
    alignItems: "center",
    color: "#ABB3BF",
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

  formLabels: {
    paddingTop: theme?.spacing(3),
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 12,
    lineHeight: "132.24%",
    display: "flex",
    color: "#091540",
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

  nameGrid: {
    [theme?.breakpoints?.down("sm")]: {
      margin: 0,
      "& > .MuiGrid-item": {
        padding: 0,
      },
    },
  },
  customiseColorBox: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginLeft: "200px",
    "@media (max-width: 1200px)": {
      marginLeft: "0",
    },
  },
  customiseColor: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  next: {
    fontFamily: "Inter",
    fontStyle: "normal",
    margin: theme?.spacing(4, 0),
    backgroundColor: "#062044",
    color: "#fff",
    textTransform: "none",
    borderRadius: 3,
    justifyContent: "right",
    padding: theme?.spacing(1, 5),

    "&$disabled": {
      background: "#E7E9EE",
      color: "#fff",
    },
  },
  selectPadding: {
    padding: "10.5px 14px",
    backgroundColor: "#ffffff",
  },
  disabled: {},

  checkedBox: {
    color: "#D2DEFF",
    "& .MuiSvgIcon-root": {
      fontSize: "22px",

      // fill: "#2457C1",
    },
  },
  customOrgEmailSummary: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    padding: 0,
  },
  customOrgEmailDisableLabel: {
    backgroundColor: "#2457C129",
    color: "#2457C1",
    borderRadius: "30px",
    padding: "0 10px",
    fontWeight: 500,
    fontSize: "9px",
  },
  customOrgEmailSummaryBox: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  customOrgEmailSenderBox: {
    display: "flex",
    alignItems: "center",
    gap: "80px",
  },
  accordionDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  accordionAppearanceContent: {
    display: "flex",
    alignItems: "center",
    gap: "100px",
    "@media (max-width: 1024px)": {
      gap: "10px",
    },
  },
  logoBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoImagebox: {
    width: "50px",
    height: "50px",
    border: "1px dashed #535353",
    borderRadius: "12px",
    display: "flex",
    padding: "5px",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F8F8",
  },
  logoUploadButton: {
    width: "100%",
    color: "#FFFFFF",
    textAlign: "center",
    textTransform: "none",
    borderWidth: 1,
    borderRadius: 5,
    font: "14px",
    padding: "3px 5px",
    borderColor: "#2457C1",
    backgroundColor: "#2457C1",
  },
  brandColorBox: {
    display: "flex",
    alignItems: "center",
    gap: "100px",
  },

  defaultBrandColorBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  colorPickerBox: {
    border: "1px solid #D2DEFF",
    backgroundColor: "#F9FAFE",
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    borderRadius: "15px",
    textAlign: "center",
  },
  customColorPickerBox: {
    padding: "5px",
    display: "flex",
    alignItems: "center",
    borderRadius: "50%",
  },
}));

export default useStyles;
