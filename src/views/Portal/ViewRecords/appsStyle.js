export const useStyles = (makeStyles) => {
  return makeStyles((theme) => {
    return {
      root: {
        display: "flex",
      },
      appsWrapper: {
        display: "flex",
        flexDirection: "column",
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
      },
      categoryItem: {
        cursor: "pointer",
        "&:hover": {
          background: "#DE54391F",
        },
      },
    };
  })();
};
