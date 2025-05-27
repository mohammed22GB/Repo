export const useStyle = (makeStyles) => {
  return makeStyles((theme) => ({
    toolbar: theme?.mixins.toolbar,
    size: {
      width: 469,
      height: 319,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundImage: `url(../../../../../../images/notification_dialog_bg.svg)`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "left bottom",
    },
    iconOuterBox: {
      border: "solid 4px #010A43",
      borderRadius: "50%",
      padding: 5,
    },
    iconInnerBox: {
      backgroundColor: "#00529D",
      width: 84,
      height: 84,
      borderRadius: "50%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },

    modalButton: {
      borderRadius: "5px",
      backgroundColor: "#2457C1",
      boxShadow: "0px 4px 10px 1px rgba(43, 45, 66, 0.25)",
      color: "#fff",
      fontSize: 16,
      fontWeight: 500,
      padding: "8px 35px",
      cursor: "pointer",
      textTransform: "none",
    },

    customModaltwo: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 20,
      gap: 10,
      padding: "50px 60px",
    },

    iconOuterBoxtwo: {
      border: "solid 4px #00529D",
      borderRadius: "50%",
      padding: 5,
    },

    modalTwoText: {
      color: "#535353",
      fontSize: 16,
      fontWeight: 500,
      width: "390px",
      textAlign: "center",
      lineHeight: 2,
      [theme?.breakpoints?.down("sm")]: {
        fontSize: 12,
        width: "220px",
      },
    },
  }))();
};
