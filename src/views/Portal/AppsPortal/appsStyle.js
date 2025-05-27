export const useStyles = (makeStyles) => {
  return makeStyles((theme) => ({
    root: {
      display: "flex",
    },
    // necessary for content to be below app bar

    loading: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },

    appsWrapper: {
      display: "flex",
      alignItems: "flex-start",
      background: "#FFFFFF",
      justifyContent: "space-between",
      flexWrap: "wrap",
      rowGap: 11,
      width: "100%",
      padding: "20px",
      columnGap: 6,
      [theme?.breakpoints?.down("sm")]: {
        flexDirection: "column",
      },
      "@media (max-width: 800px)": {
        width: "90%",
      },
      "@media (max-width: 500px)": {
        width: "75%",
        padding: "20px 10px",
      },
    },
    categoryAccess: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      width: "100%",
      "@media (max-width: 1000px)": {
        flexDirection: "column",
        gap: "25px",
      },
    },
    rightSect: {
      background: "#FFFFFF",
      border: "1px solid #F0F0F0",
      borderRadius: "10px",
      paddingBottom: "0px",
      height: "548px",
      width: "55%",
      overflowY: "auto",
      [theme?.breakpoints?.down("sm")]: {
        width: "90%",
      },
      "@media (max-width: 1000px)": { width: "95%", margin: "10px, auto" },
    },
    leftSect: {
      background: "#FFFFFF",
      width: "100%",
      height: "100%",
      [theme?.breakpoints?.down("sm")]: {
        width: "90%",
      },
      "@media (max-width: 500px)": {
        width: "98%",
      },
      "@media (max-width: 1000px)": { width: "95%", margin: "10px, auto" },
    },
    appsIcon: {
      width: 24,
      height: 24,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: 24,
      minHeight: 24,
      "& img": {
        width: 22,
      },
    },
    onHover: {
      color: "#ababab !important",
      "&:hover": { color: "#DE5439 !important" },
    },
    menuBase: {
      overflow: "hidden !important",
      "& .MuiPopover-paper": {
        overflow: "hidden !important",
        padding: "10px",
      },
    },
    truncated: {
      position: "relative",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      cursor: "pointer",
      fontWeight: "500",
      fontSize: "16px",
      textTransform: "capitalize",
      maxWidth: "100%",
      minWidth: "100px",
    },
    paginate: {
      position: "relative",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "3em",
      marginTop: "2rem",
      "& > span": {
        color: "#2896FD",
        fontWeight: 400,
        lineHeight: "16px",
        cursor: "pointer",
        backgroundColor: "#fff",
        padding: "5px 20px",
        fontSize: 12,
        borderRadius: 20,
        boxShadow: "0 0 5px #ccc",
        zIndex: 1,
        "&:hover": {
          boxShadow: "none",
        },
      },
      "&:before": {
        content: '""',
        borderBottom: "solid 2px #eaeef2",
        width: "100%",
        position: "absolute",
        bottom: 17,
        // zIndex: -1,
      },
    },
    toTopIcon: {
      position: "fixed",
      right: 60,
      bottom: 125,
      background: "#fff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: 50,
      height: 50,
      borderRadius: "50%",
      boxShadow: "0px 1px 4px rgba(111, 111, 111, 0.25)",
      cursor: "pointer",
    },
  }))();
};
