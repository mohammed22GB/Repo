import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => {
  return {
    root: {
      flexGrow: 1,
      height: "100%",
    },
    paper: {
      padding: theme?.spacing(2),
      textAlign: "center",
      color: theme?.palette?.text?.secondary,
    },
    screenTitle: {
      marginBottom: 30,
      color: "#424874",
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
      width: "50%",
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
    },
    noRecord: {
      padding: 20,
      fontStyle: "italic",
      fontWeight: 300,
      color: "#FFCC00",
      backgroundColor: "#FFFFFF",
      textAlign: "center",
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
    perPageInput: {
      border: "none",
    },
  };
});

export default useStyles;

export const taskStatusRowStyles = makeStyles((theme) => {
  return {
    root: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      padding: theme?.spacing(1),
      borderBottom: "1px solid #ddd",
    },
    nameContainer: {
      display: "flex",
      alignItems: "center",
      overflowWrap: "anywhere",
    },
    fileIcon: {
      marginRight: theme?.spacing(1),
      color: theme?.palette.text.primary,
    },
    description: {
      fontWeight: 500,
      color: "inherit",
    },
    status: {
      height: 18,
      borderRadius: 4,
      width: "80%",
      textAlign: "center",
      color: "white",
      fontSize: "0.9em",
      "&.completed": {
        backgroundColor: "#4caf50",
      },
      "&.in-progress": {
        backgroundColor: "#ff9800",
      },
      "&.failed": {
        backgroundColor: "#f44336",
      },
    },
    typo: {
      overflowWrap: "anywhere",
      fontWeight: 500,
      fontSize: "0.95em",
      color: "#FFFFFF",
    },
    iconButton: {
      padding: 7,
      height: 36,
      marginLeft: theme?.spacing(1),
      position: "absolute",
      right: 0,
      backgroundColor: "#ffffffdd",
      border: "solid 1px #eee",
    },
  };
});

export const SingleWorkflowStyle = makeStyles((theme) => {
  return {
    root: {
      fontSize: 12,
      padding: "12px 0",
      backgroundColor: "#FFFFFF",
      marginBottom: 3,
    },
    maxContent: {
      [theme?.breakpoints?.down("md")]: {
        width: "max-content",
      },
    },
    name: {
      display: "flex",
      alignItems: "center",
      "& .file": {
        width: 30,
        height: 30,
        backgroundColor: "#E4EBFD",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      "& .description": {
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        marginLeft: 5,
      },
    },
    taskRoot: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      padding: theme?.spacing(1),
      borderBottom: "1px solid #ddd",
    },
    nameContainer: {
      display: "flex",
      alignItems: "center",
      overflowWrap: "anywhere",
    },
    fileIcon: {
      marginRight: theme?.spacing(1),
      color: theme?.palette?.text?.primary,
    },
    taskDescription: {
      fontWeight: 500,
      color: "inherit",
    },
    taskStatus: {
      height: 18,
      borderRadius: 4,
      width: "80%",
      textAlign: "center",
      color: "white",
      fontSize: "0.9em",
      "&.completed": {
        backgroundColor: "#4caf50",
      },
      "&.in-progress": {
        backgroundColor: "#ff9800",
      },
      "&.failed": {
        backgroundColor: "#f44336",
      },
    },
    typo: {
      overflowWrap: "anywhere",
      fontWeight: 500,
      fontSize: "0.95em",
      color: "#FFFFFF",
    },
    taskIconButton: {
      padding: 7,
      height: 36,
      marginLeft: theme?.spacing(1),
      position: "absolute",
      right: 0,
      backgroundColor: "#ffffffdd",
      border: "solid 1px #eee",
    },
    status: {
      height: 18,
      borderRadius: 4,
      width: "80%",
      textAlign: "center",
      color: "white",
      fontSize: "0.9em",

      "&.in-progress": {
        backgroundColor: "#3D98EB",
      },
      "&.ongoing": {
        backgroundColor: "#3D98EB",
      },
      "&.pending": {
        backgroundColor: "#EEC23C",
      },
      "&.stopped": {
        backgroundColor: "#000000",
      },
      "&.completed": {
        backgroundColor: "#11B8A4",
      },
      "&.failed": {
        backgroundColor: "#D00026",
      },
    },
    loadingPage: {
      textAlign: "center",
      position: "absolute",
      top: "50%",
      left: "50%",
    },
    tableContainer: {
      width: "100%",
      "& .table": {
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "&:nth-child(odd)": {
          background: "rgba(218, 223, 255, 0.1)",
        },
        "& .content": {
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          fontFamily: "Inter",
          fontSize: "15px",
          fontStyle: "normal",

          lineHeight: "19px",
          letterSpacing: "0em",
          textAlign: "left",
          "& .left": {
            fontWeight: 400,
            width: "50%",
            textTransform: "capitalize",
          },
          "& .right": {
            fontWeight: 400,
            width: "50%",
          },
        },
      },
    },
  };
});

export const singleWorkflowInstanceStyle = makeStyles((theme) => {
  return {
    gridPadding: {
      gap: 20,
      padding: "10px",
      paddingLeft: "60px",
      "@media (max-width: 500px)": { paddingLeft: "10px" },
    },
    headerSec: {
      display: "flex",
      marginBottom: "4rem",
      gap: "10px",
      alignItems: "flex-end",
      flexWrap: "wrap",
      [theme?.breakpoints?.down("sm")]: {
        justifyContent: "center",
        marginBottom: "0.5rem",
      },
    },
    headerBtn: {
      textTransform: "none",
      marginLeft: "3rem",
      [theme?.breakpoints?.down("sm")]: {
        width: "15rem",
        marginTop: 10,
      },
    },
    layout: {
      background: "#FFFFFF",
      boxShadow: "0px 3px 4px rgba(226, 226, 226, 0.5)",
      borderRadius: "7px",
      padding: "1px 20px",
    },
    maxContent: {
      [theme?.breakpoints?.down("md")]: {
        width: "max-content",
      },
    },
    summary: {
      width: "100%",
      // marginBottom: 20,
    },
    summaryWrapper: {
      display: "flex",
      width: "80%",
      marginBottom: "2rem",
      [theme?.breakpoints?.down("md")]: {
        width: "max-content",
      },
    },
    listSubheader: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#FFFFFF",
      padding: "0",
    },
    heading: {
      fontWeight: 500,
      fontSize: 14,
      textTransform: "capitalize",
      color: "#091540",
    },
    requestDetails: {
      height: "228px",
      maxHeight: "728px",
      marginBottom: 35,
      maxWidth: "100%",

      "& .scroll": {
        maxHeight: "600px",
        overflowY: "scroll",
        "&::-webkit-scrollbar": {
          width: 5,
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#888",
        },
      },
    },
    gridWrapper: {
      [theme?.breakpoints?.down("md")]: {
        display: "flex",
        flexDirection: "column",
        flexWrap: "nowrap",
      },
    },
    approvalHistory: {
      height: "344px",
      maxHeight: "344px",
      marginBottom: 35,
      maxWidth: "39%",

      "& .scroll": {
        maxHeight: "200px",
        overflowY: "scroll",
        "&::-webkit-scrollbar": {
          width: 5,
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#888",
        },
      },
      [theme?.breakpoints?.down("md")]: {
        maxWidth: "100%",
      },
    },
    taskHistory: {
      height: "344px",
      maxHeight: "344px",
      marginBottom: 35,
      maxWidth: "70%",

      "& .scroll": {
        maxHeight: "200px",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          width: 5,
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#888",
        },
      },
      [theme?.breakpoints?.down("md")]: {
        maxWidth: "100%",
        width: "100%",
      },
    },
    ul: {
      padding: 0,
      margin: 0,
    },
    taskWrapper: {
      height: 467,
      maxWidth: "32%",
      backgroundColor: "#E7E9EE",
      marginLeft: 5, // or something
      "&:first-child": {
        marginLeft: 0,
      },
      marginBottom: 5,
    },
    taskHeader: {
      textAlign: "center",
      fontFamily: "GT Eesti Pro Text",
      fontWeight: 375,
      fontSize: "20px",
    },
    taskCardWrapper: {
      height: 395,
      overflowY: "scroll",
      "&::-webkit-scrollbar": {
        width: 5,
      },
      "&::-webkit-scrollbar-thumb": {
        background: "#888",
      },
    },
    taskCard: {
      background: "#F8F8F8",
      border: " 0.5px solid #C1C1C1",
      boxSizing: "border-box",
      width: "95%",
      maxHeight: "182px",
      height: "150px",
      margin: "0 auto",
      marginBottom: 10,
      padding: "16px 18px",
      display: "flex",
      justifyContent: "space-between",
      flexDirection: "column",
    },
    createdAt: {
      textAlign: "left",
      fontFamily: "GT Eesti Pro Text",
      fontWeight: 375,
      fontSize: "10px",
      color: "#999999",
    },
    gutter: {
      marginLeft: 10, // or something
      "&:first-child": {
        marginLeft: 0,
      },
    },
    loadingPage: {
      textAlign: "center",
      position: "absolute",
      top: "50%",
      left: "50%",
    },
  };
});
