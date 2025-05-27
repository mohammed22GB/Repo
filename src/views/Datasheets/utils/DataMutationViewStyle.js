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
    toolbar: theme?.mixins?.toolbar,

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

    iconButton: {
      color: "#000",
    },

    title: {
      flexGrow: 1,
      display: "none",
      [theme?.breakpoints?.up("sm")]: {
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
      [theme?.breakpoints?.up("md")]: {
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
      borderRadius: theme?.shape?.borderRadius,
      marginLeft: 0,
      width: "100%",
      [theme?.breakpoints?.up("sm")]: {
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
    },
    inputAdornedEnd: {
      paddingRight: 0,
    },
    inputInput: {
      padding: theme?.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme?.spacing(4)}px)`,
      transition: theme?.transitions?.create("width"),
      width: "100%",
      [theme?.breakpoints?.up("sm")]: {
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
    deleteRowBtn: {
      backgroundColor: "transparent",
      minWidth: 110,
      fontSize: 12,
      padding: "4px 6px",
      color: "#000",
      textTransform: "none",
      border: "1.5px solid #2457C1",
      "&:hover": {
        //backgroundColor: "#062044",
        color: "#fff",
      },
    },
    buttonIcon: {
      //fontSize: 14,
      "&:hover": { color: "white" },
    },
    sideDialogContainer: {
      width: "35%",
      minWidth: "300px",
      // height: "75.5vh",
      marginTop: 0,
      backgroundColor: "#fff",
      // filter: "drop-shadow(1px 5px 10px #ccc)",
      boxShadow: "-4px 4px 6px #ccc",
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
      borderTop: "1px solid #eeeeee",
      borderBottom: "1px solid #eeeeee",
      height: "calc(100% - 163px)",
      overflowY: "hidden",
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
      fontWeight: 600,
      fontSize: 12,
      lineHeight: "132.24%",
      display: "flex",
      // color: "#091540",
      color: "#5b6994",
      // textTransform: "capitalize",
    },
    selectPadding: {
      padding: "10.5px 14px",
    },
  }))();
};
