import { AppBar, IconButton, Toolbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { AiOutlineHome } from "react-icons/ai";
import { FaArrowLeft, FaRegEnvelope } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { APP_DESIGN_MODES } from "../../../../../../common/utils/constants";

const Header = ({ style, values, appDesignMode }) => {
  const useStyles = makeStyles((theme) => style);
  /* const useStyles = makeStyles((theme) => ({
    ...style,
    menuButton: {
      ...style?.menuButton,
      marginRight: theme?.spacing(style?.menuButton?.marginRight),
    },
    myHead: {
      minHeight: style?.dimensions?.height,
      paddingLeft: 20,
      width: "100%",
      margin: "auto",
    },
  })); */
  const classes = useStyles();
  const history = useHistory();

  const dispatch = useDispatch();

  const ICONS = ({ color, name }) => {
    switch (name) {
      case "home":
        return <AiOutlineHome color={color} />;
      case "back":
        return <FaArrowLeft color={color} />;
      case "settings":
        return <FiSettings color={color} />;
      case "message":
        return <FaRegEnvelope color={color} />;
      case "profile":
        return <CgProfile color={color} />;
      default:
        return null;
    }
  };

  const onClickLink = (navigation) => {
    if (!navigation) return null;
    if (navigation?.name?.toLowerCase() === "external")
      return window.open(navigation.link, "_blank");
    if (appDesignMode === APP_DESIGN_MODES.PREVIEW)
      return history.push(navigation.link);
    // dispatch(getScreenFromBackEnd(navigation?.link));
  };
  return (
    <div
      style={{
        marginBottom: appDesignMode === APP_DESIGN_MODES.EDIT ? 0 : 0,
        flexGrow: 1,
      }}
    >
      <AppBar
        className={classes?.header}
        //position={appDesignMode === APP_DESIGN_MODES.EDIT || appDesignMode === APP_DESIGN_MODES.PREVIEW ? "static" : "fixed"}
        position="static"
      >
        <Toolbar
          className={`${classes?.myHead}`}
          style={{ minHeight: style?.header?.height }}
        >
          {values?.leftIconVisible && (
            <IconButton
              onClick={() => onClickLink(values?.leftNavigation)}
              disabled={appDesignMode === APP_DESIGN_MODES.EDIT}
              edge="start"
              className={classes?.menuButton}
              color="inherit"
              aria-label="menu"
            >
              <ICONS name={values?.leftIcon} color={values?.leftIconColor} />
            </IconButton>
          )}
          <div>{values?.value}</div>
          {values?.rightIconVisible && (
            <IconButton
              disabled={appDesignMode === APP_DESIGN_MODES.EDIT}
              onClick={() => onClickLink(values?.rightNavigation)}
              edge="end"
              className={classes?.menuButton}
              style={{ textAlign: "right" }}
              color="inherit"
              aria-label="menu"
            >
              <ICONS name={values?.rightIcon} color={values?.rightIconColor} />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
