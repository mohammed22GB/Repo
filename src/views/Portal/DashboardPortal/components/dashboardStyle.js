import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => {
  return {
    wrapper: {
      display: "flex",
      gap: "20px",
      width: "100%",
      justifyContent: "flex-end",
      marginTop: "30px",
      fontFamily: "Avenir,Inter",
      "@media (max-width: 1170px)": {
        marginTop: "280px",
        flexWrap: "wrap",
        justifyContent: "flex-start",
      },

      "@media (max-width: 800px)": {
        marginTop: "2rem",
      },
      "@media (max-width: 500px)": {
        marginTop: "3rem",
      },
    },
  };
});
