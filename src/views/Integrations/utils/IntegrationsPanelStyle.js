export const useStyles = (makeStyles) => {
  return makeStyles((theme) => ({
    rootParent: {
      display: "flex",
      flexDirection: "column",
      height: "100%",

      // display: "block",
      position: "relative",
      overflowY: "visible",
      // flexGrow: 1,
    },
    root: {
      display: "flex",
      flexDirection: "column",
      // height: "100%",

      // display: "block",
      position: "relative",
      overflowY: "visible",
      // flexGrow: 1,
    },

    // necessary for content to be below app bar
    toolbar: theme?.mixins.toolbar,

    appNameWrapper: {
      padding: 10,
      display: "flex",
      alignItems: "center",
      position: "relative",
      backgroundColor: "white",
      borderBottom: "solid 0.2px #ddd",
    },

    appName: {
      textTransform: "capitalize",
      color: "#000",
      fontWeight: "bold",
    },

    sort: {
      flex: 0.3,
      minWidth: "80px",
      alignItems: "center",
      display: "flex",
    },

    filter: {
      display: "flex",
      minWidth: "80px",
      alignItems: "center",
      flex: 0.5,
    },
    switchLabel: {
      width: "100%",
      justifyContent: "space-between",
      margin: 0,
    },
    sectionTitle: {
      color: "#999",
      fontSize: 12,
      marginBottom: 5,
    },
    iconButton: {
      color: "#000",
    },

    title: {
      flexGrow: 1,
      display: "none",
      [theme?.breakpoints.up("sm")]: {
        display: "block",
      },
    },

    toolbarWrapper: {
      flex: 1,
      display: "flex",
      justifyContent: "space-between",
    },
    leftView: {
      display: "none",
      [theme?.breakpoints.up("md")]: {
        display: "flex",
        alignItems: "center",
        marginLeft: 12,
        flex: 1,
      },
    },

    rightView: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
    },

    search: {
      position: "relative",
      borderRadius: theme?.shape.borderRadius,
      marginLeft: 0,
      width: "100%",
      [theme?.breakpoints.up("sm")]: {
        marginLeft: theme?.spacing(1),
        width: "auto",
      },
    },
    searchIcon: {
      padding: theme?.spacing(0, 2),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      opacity: 0.3,
    },
    inputRoot: {
      color: "inherit",
      fontSize: "12px !important",
      paddingRight: 0,
      height: 30,
      fontWeight: 300,
    },
    resoureEntry: {
      color: "inherit",
      fontSize: "12px !important",
      paddingRight: 0,
      height: 30,
      fontWeight: 300,
      width: 200,
    },
    inputAdornedEnd: {
      paddingRight: 0,
    },
    inputInput: {
      padding: theme?.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme?.spacing(4)}px)`,
      transition: theme?.transitions.create("width"),
      width: "100%",
      [theme?.breakpoints.up("sm")]: {
        width: "20ch",
        height: 30,
        borderRadius: 10,
        border: "2px solid #ccc",
        "&:focus": {
          width: "20ch",
        },
      },
    },
    createBtns: {
      display: "flex",
      marginLeft: 10,
      minWidth: 20,

      "& $button": {
        marginRight: 10,
        textTransform: "capitalize",
        "&:last-of-type": {
          marginRight: 0,
        },
      },
    },
    sideDialogTitleWrapper: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: 14,
      borderBottom: "solid 1px #d9e1e5",
      padding: "16px 24px",
    },
    sideFlowDialogTitleWrapper: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingRight: 10,
    },
    createrowBtn: {
      backgroundColor: "#ccc",
      minWidth: 110,
      fontSize: 12,
      padding: 6,
      color: "#000",
      "&:hover": {
        backgroundColor: "#062044",
        color: "#fff",
      },
    },
    sideDialogContainer: {
      width: "35%",
      minWidth: "300px",
      // height: "75.5vh",
      marginTop: 0,
      backgroundColor: "#fff",
      // filter: "drop-shadow(1px 5px 10px #ccc)",
      boxShadow: "-4px 2px 6px #eee",
      position: "fixed",
      right: 0,
      top: 60,
      bottom: 0,
      zIndex: 5,
      padding: 20,
    },
    sideFlowDialogContainer: {
      width: "35%",
      minWidth: "300px",
      // height: "75.5vh",
      marginTop: 0,
      backgroundColor: "#fff",
      // filter: "drop-shadow(1px 5px 10px #ccc)",
      boxShadow: "-4px 2px 6px #eee",
      position: "fixed",
      right: 0,
      top: 60,
      bottom: 0,
      zIndex: 5,
    },

    newColumnDialogTitleWrapper: {
      display: "flex",
      justifyContent: "space-between",
      "& $h4": {
        marginLeft: 30,
      },
    },

    closeIcon: {
      marginRight: 15,
    },

    sideDialogMain: {
      // padding: "30px 24px",
      padding: "30px 4.8%",
      paddingTop: 0,
      borderTop: "1px solid #eeeeee",
      borderBottom: "1px solid #eeeeee",
      height: "calc(100% - 110px)",
      overflowY: "hidden",
      "&:hover": {
        overflowY: "overlay",
      },
    },
    addUnit: {
      // border: "solid 1px",
      // float: "left",
      width: 93,
      // marginBottom: 40,
      textAlign: "center",
      fontSize: 11,
      cursor: "pointer",
      padding: 5,
      filter: "saturate(0.3)",
      "&:hover": {
        boxShadow: "0 0 2px #d0d2e0",
        filter: "saturate(1)",
      },
      "&:active": {
        // boxShadow: "0 0 2px red",
        backgroundColor: "#fafafa",
      },
      "& img": {
        padding: 10,
        height: 40,
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
      fontWeight: 600,
      fontSize: 12,
      color: "#5b6994",
      lineHeight: "132.24%",
      display: "flex",
      // color: "#091540",
      // color: "red",
      // textTransform: "capitalize",
    },
    selectPadding: {
      padding: "10.5px 14px",
    },
    toggleBtn: {
      position: "absolute",
      width: 20,
      height: 20,
      backgroundColor: "#666",
      color: "#ffffff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "50%",
      left: -10,
      top: 17,
      cursor: "pointer",
      // cursor: "not-allowed",
    },
    apiEndpointHeader: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: 14,
      borderBottom: "solid 1px #c0c9cd",
      padding: "10px 0 0",
      marginBottom: 10,
    },
    apiEndpointHeaderText: {
      color: "#434a7c",
      padding: "5px 10px",
      fontWeight: 500,
      borderRadius: "3px 3px 0 0",
      backgroundColor: "#dddee9",
      border: "outset 1px",
      borderBottom: "none",
      fontSize: 13,
    },
    apiEndpointBox: {
      borderRadius: 4,
      marginBottom: 10,
      border: "solid 1px #37505b",
    },
    apiEndpointBar: {
      display: "flex",
      "& > div": {
        padding: "8px 10px",
        display: "flex",
        alignItems: "center",
      },
    },
    apiEndpointBarBtn: {
      backgroundColor: "#f4f4f4",
      borderLeft: "outset 1px #d0d9dc",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#e8e8e8",
      },
    },
    errorLabelText: {
      fontWeight: 400,
      color: "red",
      fontSize: 10,
      marginLeft: 5,
    },
  }))();
};
