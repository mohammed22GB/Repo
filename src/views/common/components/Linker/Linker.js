import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { APP_DESIGN_MODES } from "../../utils/constants";
const useStyles = makeStyles((theme) => ({
  root: {
    textDecoration: "none",
  },
}));
const Linker = ({ navigation, ...props }) => {
  const classes = useStyles();
  if (
    props.appDesignMode === APP_DESIGN_MODES.EDIT ||
    props.appDesignMode === APP_DESIGN_MODES.PREVIEW
  )
    return <div {...props}>{props.children}</div>;
  if (navigation?.name && navigation?.name?.toLowerCase() === "external")
    return (
      <a
        target="_blank"
        className={classes.root}
        rel="noopener noreferrer"
        href={navigation?.link || "/"}
        {...props}
      >
        {props.children}
      </a>
    );
  return (
    <Link className={classes.root} to={navigation?.link || "/"} {...props}>
      {props.children}
    </Link>
  );
};

export default Linker;
