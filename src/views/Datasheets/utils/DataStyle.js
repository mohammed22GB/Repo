export const useStyles = (makeStyles) => {
  return makeStyles((theme) => ({
    root: {
      display: "flex",
      width: "100%",
    },
    // necessary for content to be below app bar
    toolbar: theme?.mixins?.toolbar,

    content: {
      flexGrow: 1,
      padding: theme?.spacing(3),
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
    createBtns: {
      marginLeft: 15,
    },
    dataGridPaper: {
      height: "96%",
      borderBottomLeftRadius: "0px",
      borderBottomRightRadius: "0px",
    },
    dataGrid: {
      borderBottom: "0px",
      borderBottomLeftRadius: "0px",
      borderBottomRightRadius: "0px",
    },
    /* inputInput: {
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
    }, */
    inputInput: {
      // paddingLeft: 20,
    },

    topView: {
      marginBottom: 30,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      "& .MuiOutlinedInput-adornedEnd": {
        paddingRight: 0,
      },
    },

    headingIcon: {
      // width: "13%",
      display: "flex",
      alignItems: "center",
      flex: 1,
      "& $dataIcon": {
        color: "#0c7b93",
      },
    },

    dataIcon: {
      fontWeight: "bold",
    },

    rightView: {
      display: "flex",
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
      minWidth: "300px",
      flexWrap: "wrap",
    },

    sideSections: {
      padding: 15,
      marginBottom: 12,
      borderRadius: "3px 0 0 3px",
      color: "#ffffff",
      cursor: "pointer",
      "&:hover": {
        opacity: 0.8,
      },
    },
    button: {
      backgroundColor: "#062044",
      color: "#fff",
      width: 150,
      textTransform: "none",

      "&:hover": {
        backgroundColor: "#062044",
        opacity: 0.8,
      },
    },
    body1: {
      marginRight: 10,
      color: "#424874",
      fontSize: "20px !important",
    },
    inputRoot: {
      fontSize: "12px !important",
    },
    createnewDataBtn: {
      backgroundColor: "#062044",
      textTransform: "capitalize",
      fontSize: 12,
    },
    newDataView: {
      // width: "79%",
      // position: "absolute",
      // top: 350,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      marginTop: "15%",
    },

    newDataViewImg: {
      height: 100,
      backgroundColor: "#333",
      marginBottom: "1rem",
    },

    sideDialogTitleWrapper: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    sideDialogCloseButton: {
      marginRight: 10,
      height: 24,
    },

    dialogCloseButton: {
      width: "20%",
      "&:hover": {
        backgroundColor: "#0c7b93",
        color: "#fff",
      },
    },
    sideDialogActionButton: {
      textTransform: "none",
      width: "20%",
      fontSize: 12,
      "&:hover": {
        backgroundColor: "#062044",
        color: "#fff",
      },
    },
    dialogContDiv: {
      padding: "40px 24px",
    },

    loading: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    selectPadding: {
      padding: "10.5px 14px",
    },
  }))();
};
