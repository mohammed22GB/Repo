export const useStyles = (makeStyles) => {
  return makeStyles((theme) => ({
    draggableMainContainer: {
      width: "681.43px",
      minHeight: "444px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    draggableContainer: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
    },

    topView: {
      width: "100%",
      height: "3em",
      padding: "0px 1rem",
      justifyContent: "space-between",
      alignItems: "center",
      alignSelf: "baseline",
      "& > h6": {
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "6.64813px",
        lineHeight: "132.24%",
        color: "#091540",
      },
    },

    tabsWrapper: {
      display: "flex",
      justifyContent: "center",
    },
    tabs: {
      height: 50,
      // backgroundColor: "red",
      // marginBottom: "2rem",
    },

    tabsBorder: {
      textTransform: "capitalize",
      fontStyle: "normal",
      fontWeight: 500,
      fontSize: "14px",
      lineHeight: "132.24%",
      textAlign: "center",
      color: "#424874",
      minHeight: 40,
      paddingTop: 3,
    },
    tabBtn: {
      textTransform: "capitalize",
      fontStyle: "normal",
      fontWeight: 300,
      fontSize: "12px",
      lineHeight: "132.24%",
      textAlign: "center",
      color: "#424874",
      padding: 0,
      minHeight: 40,
      minWidth: 130,
    },
    buttonWrapper: {
      marginTop: "1rem",
      marginBottom: "1rem",
      width: "100%",
      minWidth: "5em",
      height: "1.5em",
      display: "flex",
      justifyContent: "center",
    },
    buttonWrapperLeftButton: {
      width: "67px",
      height: "100%",
      border: "0.474866px solid #010A43",
      color: "#010A43",
      borderRadius: "1.4246px",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "5.6984px",
      lineHeight: "8px",
      textAlign: "center",
      marginRight: "1rem",
    },

    buttonWrapperRightButton: {
      width: "67px",
      height: "100%",
      borderRadius: "1.4246px",
      backgroundColor: "#010A43",
      color: "#fff",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "5.6984px",
      lineHeight: "8px",
      textAlign: "center",
    },
    nextButton: {
      fontStyle: "normal",
      backgroundColor: "#010A43",
      color: "#fff",
      textTransform: "capitalize",
      padding: "4px 30px",
      borderRadius: 3,

      "&$disabled": {
        background: "#ABB3BF",
        color: "#fff",
      },
    },
    downloadLinkBox: {
      display: "flex",
      alignItems: "center",
      gap: 8,
    },
    downloadLink: {
      color: "#0d99ff",
      textDecoration: "none",
      "&:hover": {
        cursor: "pointer",
        textDecoration: "underline",
      },
    },
  }))();
};
