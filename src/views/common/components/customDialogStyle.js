export const useStyles = (makeStyles) => {
  return makeStyles((theme) => ({
    // necessary for content to be below app bar
    toolbar: theme?.mixins?.toolbar,
    size: {
      width: 469,
      minWidth: "300px",
      height: 350,
      display: "flex",
      alignItems: "center",
      backgroundImage: `url(../../../../../../images/dialog_bg.svg)`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "left bottom",
    },
    topView: {
      width: "88%",
      minWidth: "300px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem 0rem",
    },

    title: {
      fontSize: "1rem",
      fontWeight: 500,
      textTransform: "capitalize",
    },

    actionText: {
      width: "88%",
      minWidth: "300px",
      textAlign: "center",
      "& > p": {
        color: "#010A43",
        fontSize: "0.8",
        marginTop: 22,
        textAlign: "center",
      },
    },

    formWrapper: {
      display: "flex",
      justifyContent: "center",
      marginTop: "2rem",
      marginBottom: "3rem",
      width: "88%",
      minWidth: "300px",
      "& > form": {
        width: "100%",
      },
    },

    input: {
      borderRadius: "10px",
      border: "1.5px solid #0086E8",
    },
    buttonView: {
      width: "88%",
      minWidth: "300px",
      display: "flex",
      justifyContent: "center",
      marginTop: 40,
      "& > :first-child": {
        width: 60,
        height: 30,
        textTransform: "none",
        border: "solid 1.5px #666666",
        marginRight: 20,
      },
      "& > :last-child": {
        width: 60,
        height: 30,
        textTransform: "none",
        border: "solid 1.5px #000000",
        backgroundColor: "#010A43",
        color: "#ffffff",
      },
    },
  }))();
};
