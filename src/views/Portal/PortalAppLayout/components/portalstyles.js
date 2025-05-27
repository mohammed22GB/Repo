import { makeStyles } from "@material-ui/core/styles";

const drawerWidth = 256;

const usePortalStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: "#FFFFFF",
    boxShadow: "none",
    borderBottom: "1px solid #F0F0F0",
    fontFamily: "Avenir,Inter",
    height: 88,
    justifyContent: "center",
    [theme?.breakpoints?.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      "& .MuiToolbar-gutters": {
        paddingRight: 50,
      },
    },
  },
  customToolBar: {
    [theme?.breakpoints?.down("sm")]: {
      justifyContent: "space-between",
    },
  },
  contentToolBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    width: "100%",
    gap: 45,
    flexGrow: 1,
    "@media (max-width: 600px)": {
      display: "none",
    },
  },
  menuButton: {
    "& .MuiIconButton-root": {
      padding: 0,
    },
    [theme?.breakpoints?.up("sm")]: {
      display: "none",
    },
  },
  mobileLogo: {
    width: "75px",
    height: "auto",
    objectFit: "cover",
    [theme?.breakpoints?.up("sm")]: {
      display: "none",
    },
  },
  switchModeButton: {
    backgroundColor: "#29292929",
    textTransform: "none",
    fontWeight: 400,
    fontSize: 16,
    fontFamily: "Avenir,Inter",
    borderRadius: 8,
    padding: "8px 16px 8px 24px",
    whiteSpace: "nowrap",
    height: 40,
  },
  // necessary for content to be below app bar
  toolbar: theme?.mixins?.toolbar,
}));

export default usePortalStyles;
