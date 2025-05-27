import React from "react";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import {
  Avatar,
  Button,
  CssBaseline,
  Divider,
  Drawer,
  Hidden,
  Link,
  MenuItem,
  Select,
} from "@material-ui/core";
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles,
  withStyles,
} from "@material-ui/core/styles";
import FlashIcon from "../../icons/FlashIcon";
import PlayIcon from "../../icons/PlayIcon";
import RefreshIcon from "../../icons/RefreshIcon";
import SelectDropdownIcon from "../../icons/SelectDropdownIcon";
import ToogleLightMode from "../../icons/ToogleLightMode";
import TrashIcon from "../../icons/TrashIcon";
import SidebarLeftIcon from "../../icons/SidebarLeftIcon";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import DefaultSettingIcon from "../../icons/DefaultSettingIcon";
import LinearSettingIcon from "../../icons/LinearSettingIcon";
import AddIcon from "../../icons/AddIcon";
import Forms from "../Forms";
import Workflow from "../Workflow";
import FloatingAppToolbar from "../FloatingAppToolbar";
import NewDocumentIcon from "../../icons/NewDocumentIcon";
import FormStep from "../FormStep";
import CompletedDocumentIcon from "../../icons/CompletedDocumentIcon";
import CustomAccordion from "../RightSidebar/Properties/CustomAccordion";
import CustomLabelFields from "../RightSidebar/Properties/CustomLabelFields";
import CustomSwitch from "../RightSidebar/Properties/FormFields/Switch";
import CustomInputText from "../RightSidebar/Properties/FormFields/InputText";
import CustomDropdown from "../RightSidebar/Properties/FormFields/Dropdown";

const mainContentItem = [
  { name: "Forms", component: <Forms /> },
  { name: "Workflow", component: <Workflow /> },
];

const CustomTabs = withStyles({
  root: {
    background: "#F8F8F8",
    padding: "8px",
    borderRadius: "8px",
  },
  indicator: {
    display: "none",
  },
  flexContainer: {
    textTransform: "none",
  },
})(Tabs);

function tabProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const drawerWidth = 275;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      position: "relative",
      display: "flex",
      height: "100vh",
      width: "100vw",
      background: "#f8f8f8",
      fontFamily: "Avenir, sans-serif",
      overflow: "hidden",
    },
    root: {
      display: "flex",
    },
    drawer: {
      [theme.breakpoints.up("sm")]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },

    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        display: "none",
      },
    },

    drawerPaper: {
      width: drawerWidth,
      borderRight: "1px solid #F0F0F0",
      background: "##FFFFFF",
    },
    rightDrawerPaper: {
      width: drawerWidth,
      borderLeft: "1px solid #F0F0F0",
      background: "##FFFFFF",
    },
    content: {
      flexGrow: 1,
      overflowY: "auto",
      padding: theme.spacing(8),
      paddingTop: 88,
      paddingBottom: 0,
    },
    patternUnderlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "100vh",
      backgroundImage: "url(/images/newplug/panel-pattern.png)",
      backgroundRepeat: "no-repeat",
      backgroundSize: "450px 100vh",
      backgroundPosition: "left 0",
      pointerEvents: "none",
    },
    patternUnderlayRight: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "100vh",
      backgroundImage: "url(/images/newplug/panel-pattern.png)",
      backgroundRepeat: "no-repeat",
      backgroundSize: "450px 100vh",
      backgroundPosition: "right 0", // or "100% 0"
      pointerEvents: "none",
    },
    defaultPadding: { padding: "16px 24px" },
    customTabRoot: {
      textTransform: "none",
      minWidth: "10px",
      minHeight: "28px",
      padding: "2px 16px",
    },
    customTabSelected: {
      color: "#ffffff",
      backgroundColor: "#292929",
      borderRadius: "8px",
    },
    floatingMenuBar: {
      position: "absolute",
      left: "50%",
      bottom: 32,
      transform: "translateX(-50%)",
      background: "#ffffff",
      borderRadius: 16,
      boxShadow: "0 4px 24px 0 rgba(0,0,0,0.08)",
      display: "flex",
      alignItems: "center",
      padding: "16px",
      gap: 24,
      zIndex: 3,
      border: "1px solid #F0F0F0",
      transition: "padding 0.2s, gap 0.2s, bottom 0.2s",
    },
    menuIcon: {
      fontSize: 22,
      color: "#222",
      cursor: "pointer",
      background: "none",
      border: "none",
      outline: "none",
      padding: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "color 0.2s, font-size 0.2s",
    },
    cursorPointer: {
      cursor: "pointer",
    },
    publishButton: {
      textTransform: "none",
      backgroundColor: "#2457C1",
      borderRadius: "8px",
      color: "#ffffff",
      padding: "8px 24px",
    },
  })
);

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

const NewPlugEditorLayout = (props: Props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className={classes.container}>
      <CssBaseline />
      {/* Left sidebar drawer */}
      <nav className={classes.drawer} aria-label="left drawer">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            anchor="left"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {/* {drawer} */}
          </Drawer>
        </Hidden>
        {/* Desktop implementation for the right sidebar */}
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
            anchor="left"
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "40px 24px 16px 24px ",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <img
                  src="/images/newplug/descasio.png"
                  alt="company logo"
                  style={{ width: "auto" }}
                />
                <SelectDropdownIcon />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <SidebarLeftIcon />
              </div>
            </div>
            <Divider />
            <div
              style={{
                padding: "16px 24px",
                display: "flex",
                alignItems: "start",
                gap: 16,
                flexDirection: "column",
              }}
            >
              <Breadcrumbs aria-label="breadcrumb" style={{ fontSize: 11 }}>
                <Link color="inherit" href="/" onClick={() => {}}>
                  App Builder
                </Link>
                <Link
                  color="inherit"
                  href="/getting-started/installation/"
                  onClick={() => {}}
                >
                  {mainContentItem[value]?.name}
                </Link>
              </Breadcrumbs>

              <Typography
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#292929",
                }}
              >
                Service Request Form
              </Typography>
            </div>
            <Divider />
            <div style={{ padding: "16px 24px" }}>
              <CustomTabs
                value={value}
                onChange={handleChange}
                aria-label="simple tabs example"
                variant="fullWidth"
              >
                {mainContentItem.map((item, index) => (
                  <Tab
                    label={item?.name}
                    {...tabProps(index)}
                    classes={{
                      root: classes.customTabRoot,
                      selected: classes.customTabSelected,
                    }}
                  />
                ))}
              </CustomTabs>
            </div>
            <Divider />

            <div
              style={{
                display: "flex",
                alignItems: "start",
                justifyContent: "space-between",
                gap: 10,
              }}
              className={classes.defaultPadding}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <SelectDropdownIcon />
                <Typography
                  style={{ fontSize: 16, color: "#292929", fontWeight: 600 }}
                >
                  Step
                </Typography>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {mainContentItem[value]?.name === "Forms" && (
                  <div>
                    <DefaultSettingIcon />
                  </div>
                )}
                <div>
                  <LinearSettingIcon />
                </div>
                {mainContentItem[value]?.name === "Forms" && (
                  <div>
                    <AddIcon />
                  </div>
                )}
              </div>
            </div>

            <FormStep title="Service Request Form" icon={<NewDocumentIcon />} />

            <FormStep
              title="Service Desk Review"
              isActive={true}
              icon={<CompletedDocumentIcon isActive={true} />}
            />
          </Drawer>
        </Hidden>
      </nav>

      {/* Main Editor Area */}
      <main className={classes.content}>
        <div className={classes.patternUnderlay} />
        <div className={classes.patternUnderlayRight} />

        {/* Main content placeholder */}
        {mainContentItem[value]?.component}

        {/* Floating Menu Bar */}
        {mainContentItem[value]?.name === "Forms" && <FloatingAppToolbar />}
      </main>

      {/* Right sidebar drawer */}
      <nav className={classes.drawer} aria-label="right drawer">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            anchor="right"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.rightDrawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {/* {drawer} */}
          </Drawer>
        </Hidden>
        {/* Desktop implementation for the right sidebar */}
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.rightDrawerPaper,
            }}
            variant="permanent"
            anchor="right"
            open
          >
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  padding: "32px 33px 16px 24px",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.publishButton}
                  disableElevation={true}
                  endIcon={<FlashIcon />}
                >
                  Publish
                </Button>
                <Avatar
                  alt="Logged in user with name"
                  src="/static/images/avatar/1.jpg"
                  style={{ border: "1.25px solid#F0F0F0" }}
                />
                <ToogleLightMode />
              </div>

              <Divider />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  // gap: 33,
                  padding: "16px 24px",
                }}
              >
                <div className={classes.cursorPointer}>
                  <RefreshIcon />
                </div>
                <div className={classes.cursorPointer}>
                  <PlayIcon />
                </div>
                <div className={classes.cursorPointer}>
                  <TrashIcon />
                </div>

                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={10}
                  onChange={() => {}}
                  IconComponent={SelectDropdownIcon}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </div>

              <Divider />

              <div
                style={{
                  width: "100%",
                  border: "1px solid #d1d5db",
                  borderTop: "none",
                  //borderBottom: "none",
                }}
              >
                <div
                  style={{ padding: "16px", borderTop: "1px solid #F0F0F0" }}
                >
                  <Typography
                    style={{ fontWeight: 500, color: "#292929", fontSize: 14 }}
                  >
                    Properties
                  </Typography>
                </div>
                <CustomAccordion title="General" subTitle="validation">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                      width: "100%",
                    }}
                  >
                    <CustomLabelFields title="Add Conditional">
                      <CustomSwitch />
                    </CustomLabelFields>
                    <CustomLabelFields title="Placeholder">
                      <CustomInputText placeholder="Enter a value" />
                    </CustomLabelFields>
                    <CustomLabelFields title="Content Type">
                      <CustomDropdown
                        placeholder="Enter a value"
                        items={[
                          { value: "Option 1", name: "option1" },
                          { value: "Option 2", name: "option2" },
                        ]}
                      />
                    </CustomLabelFields>
                  </div>
                </CustomAccordion>
              </div>
            </>
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
};

export default NewPlugEditorLayout;
