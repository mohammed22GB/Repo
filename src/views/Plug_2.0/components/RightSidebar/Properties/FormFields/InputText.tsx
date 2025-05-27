import { withStyles } from "@material-ui/core/styles";
import { InputBase } from "@material-ui/core";

const CustomInputText = withStyles((theme) => ({
  input: {
    color: "#091540",
    borderRadius: 8,
    position: "relative",
    border: "none",
    fontSize: 12,
    padding: "2px 8px",
    height: "32px",
    background: "#F8F8F8",
    transition: theme?.transitions.create(["border-color", "box-shadow"]),
  },
}))(InputBase);
export default CustomInputText;
