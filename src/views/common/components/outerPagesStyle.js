export const useStyles = (makeStyles) => {
  return makeStyles((theme) => ({
    title: {
      fontFamily: "Inter",
      fontStyle: "normal",
      fontSize: 24,
      color: "#212F77",
      fontWeight: 600,
      paddingBottom: "18px",
    },

    formLabels: {
      paddingTop: theme?.spacing(2),
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 600,
      fontSize: 12,
      lineHeight: "132.24%",
      display: "flex",
      color: "#464D72",
    },

    formTextField: {
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 500,
      fontSize: 12,
      lineHeight: "16px",
      display: "flex",
      color: "#091540",
      borderRadius: "8px",
      borderWidth: "1px",
    },

    notched: {
      fontFamily: "Inter",
      borderWidth: "1px",
      borderRadius: "8px",
      background: "#F9FAFE",
      "&:hover": {
        //border: "1px solid #D2DEFF",
        borderColor: "#1866DB",
      },
      "&.Mui-focused": {
        "&.MuiOutlinedInput-notchedOutline": {
          border: "2px solid #1866DB",
        },
      },

      "& .MuiOutlinedInput-input:-webkit-autofill": {
        borderRadius: "10px",
      },
    },
    inputField: {
      height: "1.8rem",
      lineHeight: "1.8rem",
    },

    helperText: {
      margin: "5px 0 0 0",
      // fontFamily: "GT Eesti Pro Test",
    },

    caution: {
      backgroundColor: "#e53935",
      color: "#fff",
      padding: "0.5px 6px",
      borderRadius: "300px",
    },

    pageButton: {
      fontFamily: "Inter",
      fontStyle: "normal",
      fontSize: "14px",
      margin: theme?.spacing(4, 0),
      backgroundColor: "#2457C1",
      color: "#fff",
      textTransform: "none",
      borderRadius: "10px",
      padding: "10px",
      minWidth: 100,

      "&$disabled": {
        background: "#9F9F9F",
        color: "#fff",
      },
    },
    disabled: {},

    subtitle: {
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: 13,
      lineHeight: "130%",
      display: "flex",
      color: "#464D72",
      paddingBottom: theme?.spacing(1),
    },

    root: {
      display: "flex",
      minHeight: "100%",
      [theme?.breakpoints?.down("sm")]: {
        flexDirection: "column",
      },
    },

    hideItemXS: {
      [theme?.breakpoints?.down("xs")]: {
        display: "none",
      },
    },

    hideItemSM: {
      [theme?.breakpoints?.down("sm")]: {
        display: "none",
      },
    },

    hideElement: {
      display: "none",
    },

    pageGrid: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      width: "50%",
      margin: "0 auto",
      [theme?.breakpoints?.down("sm")]: {
        width: "90%",
        position: "relative",
        marginTop: 120,
        marginBottom: "auto",
        boxShadow:
          "0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)",
      },
      [theme?.breakpoints?.down("xs")]: {
        width: "90%",
        position: "relative",
        marginTop: 120,
        marginBottom: "auto",
      },
    },

    pageForm: {
      width: "60%",
      margin: "auto",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      // [theme?.breakpoints?.down("md")]: {
      marginTop: "40px",
      marginBottom: "40px",
      // },

      [theme?.breakpoints?.down("sm")]: {
        width: "90%",
        marginTop: "35px",
        marginBottom: "15px",
        boxShadow: "none",
        padding: 0,
      },
    },
    rememberLabel: {
      "& .MuiFormControlLabel-root": {
        fontFamily: "Open Sans",
      },
      "& .MuiFormControlLabel-label": {
        fontSize: "12px",
        color: "#464D72",
      },
    },
    loginPanel: {
      gap: 8,
      margin: "10px 0",
    },
    hac: {
      background: "#fff",
      padding: "0 10px",
      color: "#464D72",
      fontWeight: 400,
    },
    linkText: {
      fontFamily: "Open Sans",
      fontSize: "14px",
      textDecoration: "underline",
      color: "#487EE6",
      fontWeight: 600,
      cursor: "pointer",
    },

    signUpButton: {
      // margin: theme?.spacing(2, 0, 0, 0),
      boxSizing: "border-box",
      border: "1px solid #D2DEFF",
      fontFamily: "Open Sans",
      fontWeight: 600,
      letterSpacing: "0.5px",
      fontStyle: "normal",
      borderRadius: "10px",
      textTransform: "none",
      padding: "13px 5px",
      flex: 1,
      [theme?.breakpoints?.down("md")]: {
        minWidth: "100%",
        margin: "none",
      },
    },
    _sso: {
      minWidth: "100%",
    },
    googleIcon: {
      paddingRight: "10px",
      height: "20px",
    },
    microsoftIcon: {
      paddingRight: "10px",
      height: "20px",
      // width: 25,
    },

    checkedBox: {
      color: "#D2DEFF",
      "& .MuiSvgIcon-root": {
        fontSize: "22px",

        // fill: "#2457C1",
      },
    },

    checkMain: {
      display: "flex",
      alignItems: "start",
    },

    checkText: {
      fontFamily: "Open Sans",
      fontSize: "12px",
      color: "#464D72",
      display: "inline-block",
      paddingTop: "10px",
    },

    breakText: {
      [theme?.breakpoints?.down("lg")]: {
        display: "none",
      },
    },
    checkTextPriv: {
      fontFamily: "Open Sans",
      fontSize: "12px",
      color: "yellow",
    },

    Terms: {
      textDecoration: "underline",
    },
    SubscribeMail: {
      paddingBottom: theme?.spacing(2),
      width: "110px",
      // paddingLeft: theme?.spacing(13),
    },

    SubscribeForm: {
      // paddingTop: "20%",
      position: "relative",
      // left: "10%",
      [theme?.breakpoints?.down("sm")]: {
        paddingTop: "0",
      },
      [theme?.breakpoints?.up("md")]: {
        paddingTop: "30px",
      },
    },

    SubscribeTitle: {
      paddingBottom: theme?.spacing(2),
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 700,
      fontSize: 26,
      color: "#212F77",
      lineHeight: "132.24%",
      textAlign: "center",
    },

    SubscribeConfirmMail: {
      paddingBottom: theme?.spacing(3),
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: 14,
      lineHeight: "130%",
      color: "#464D72",
      textAlign: "center",
    },

    SubscribeAnything: {
      paddingBottom: theme?.spacing(2),
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 375,
      fontSize: 14,
      lineHeight: "130%",
      color: "#999999",
      display: "flex",
      justifyContent: "center",
    },

    SubscribeSpam: {
      // paddingBottom: theme?.spacing(2),
      fontFamily: "Inter",
      fontStyle: "normal",
      // fontWeight: 375,
      fontSize: 14,
      lineHeight: "130%",
      color: "#999999",
      textAlign: "center",
      marginTop: 20,
    },

    SubscribeLinks: {
      paddingLeft: "3px",
      paddingRight: "3px",
      color: "#212F77",
      fontWeight: "bold",
    },

    SubscribeEmailButton: {
      marginBottom: theme?.spacing(3),
      textTransform: "none",
      backgroundColor: "#2457C1",
      color: "#fff",
      borderRadius: "10px",
      padding: theme?.spacing(1, 5),
    },
  }))();
};
