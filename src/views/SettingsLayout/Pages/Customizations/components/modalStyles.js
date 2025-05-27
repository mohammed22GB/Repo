import { makeStyles } from "@material-ui/core";

export const useModalStyles = makeStyles((theme) => ({
  root: {
    borderRadius: "10px",
    width: "600px",
    // back,
    // margin: 0,
    // padding: theme?.spacing(2),
  },
  textFieldRoot: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      "& fieldset": {
        borderColor: "#B8B8B8",
      },
      borderColor: "red",
    },
  },
  selectFieldRoot: {
    borderRadius: "10px",
    borderColor: "#B8B8B8",
    "& .MuiSelect-iconOutlined": {
      fontSize: "25px",
      color: "#535353",
      padding: 0,
      position: "absolute",
      transform: "translate(-30%, -20%)",
    },
  },
  closeButton: {
    position: "absolute",
    right: theme?.spacing(2),
    top: theme?.spacing(2),
    color: theme?.palette?.grey[500],
    backgroundColor: "#ABB3BF",
    padding: 0,
    "&:hover": {
      backgroundColor: "#ABB3BF",
    },
  },
  cancelButton: {
    color: "#2457C1",
    border: "1px solid #2457C1",
    borderRadius: "5px",
    textTransform: "none",
    fontSize: "14px",
    padding: "5px 25px",
  },
  saveButton: {
    borderRadius: "5px",
    textTransform: "none",
    fontSize: "14px",
    padding: "5px 25px",
    backgroundColor: "#2457C1",
    color: "#FFFFFF",
  },
  uploadDocument: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px dashed #2457C1",
    padding: "20px",
    borderRadius: "5px",
    backgroundColor: "rgba(36, 87, 193, 0.05)",
  },
}));
