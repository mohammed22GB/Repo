import { useEffect, useState } from "react";
import { Tooltip } from "@material-ui/core";
import { connect } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Divider, Paper } from "@material-ui/core";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import { ImPaintFormat } from "react-icons/im";
import { updateProp } from "../../../../store/actions/properties";
import InfoSidebar from "./components/InfoSidebar";
import HeaderSidebar from "./components/HeaderSidebar";
import InputTableSidebar from "./components/InputTableSidebar";
import FileUploadSidebar from "./components/FileUploadSidebar";
import VideoSidebar from "./components/VideoSidebar";
import AddressSidebar from "./components/AddressSidebar";
import PhoneNumberSidebar from "./components/PhoneNumberSidebar";
import TextSidebar from "./components/TextSidebar";
import CustomSidebar from "./components/CustomSidebar";
import ImageSidebar from "./components/ImageSidebar";
import DisplayTableSidebar from "./components/DisplayTableSidebar";
import PageBreakSidebar from "./components/PageBreakSidebar";
import SignatureSidebar from "./components/SignatureSidebar";
import TextAreaSidebar from "./components/TextAreaSidebar";
import DualTextSidebar from "./components/DualTextSidebar";
import DateTimeSidebar from "./components/DateTimeSidebar";
import NumberSidebar from "./components/NumberSidebar";
import CurrencySidebar from "./components/CurrencySidebar";
import NameSidebar from "./components/NameSidebar";
import DropDownSidebar from "./components/DropDownSidebar";
import CheckBoxSidebar from "./components/CheckBoxSidebar";
import RadioSidebar from "./components/RadioSidebar";
import ToggleSidebar from "./components/ToggleSidebar";
import SliderSidebar from "./components/SliderSidebar";
import QuantitySidebar from "./components/QuantitySidebar";
import InputTextSidebar from "./components/InputTextSidebar";
import DecisionButtonSidebar from "./components/DecisionButtonSidebar";
import SubmitButtonSidebar from "./components/SubmitButtonSidebar";
import ActionPane from "./components/ActionPane";
import ActionButtonSidebar from "./components/ActionButtonSidebar";
import LineChartSidebar from "./components/LineChartSidebar";
import HorizontalBarChartSidebar from "./components/HorizontalBarChartSidebar";
import VerticalBarChartSidebar from "./components/VerticalBarChartSidebar";
import PieChartSidebar from "./components/PieChartSidebar";
import AreaGraphSidebar from "./components/AreaGraphSidebar";
import RectangleSidebar from "./components/RectangleSidebar";
import EllipseSidebar from "./components/EllipseSidebar";
import LineSidebar from "./components/LineSidebar";
import PolygonSidebar from "./components/PolygonSidebar";
import StarSidebar from "./components/StarSidebar";
import ArrowSidebar from "./components/ArrowSidebar";
import MenuListSidebar from "./components/MenuListSidebar";
import { rHideRightSideBar } from "../../../../store/actions/properties";
import HeadingTextSidebar from "./components/HeadingTextSidebar";
import SidebarStyleSection from "./components/components/SidebarStyleSection";
import { updateValues } from "../../Pages/UIEditor/utils/canvasHelpers";
import UserPickerSidebar from "./components/UserPickerSidebar";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100%",
    backgroundColor: "transparent",
    position: "relative",
    // paddingBottom: 100
  },
  settings: {
    // margin: "4px 4px 0",
    color: "#666",
  },
  settingsBox: {
    // border: "solid #0C7B93", */
    boxShadow: "-2px 2px 4px #bbb",
    borderWidth: "1px 0 1px 2px",
    backgroundColor: "#F4F4F4",
    borderRadius: "50%",
    width: 29,
    height: 29,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#ddd",
    },
  },
  controls: {
    borderLeft: "0.2px solid #ABB3BF",
    width: "100%",
    backgroundColor: "#FFFFFF",
  },
}));

function RightSidebar(props) {
  const classes = useStyles();
  const {
    componentsSelection,
    screenStyles,
    canvasItems,
    dispatch,
    otherParams,
  } = props;
  const [myIndex, setMyIndex] = useState(null);
  const [activeData, setActiveData] = useState({});
  const [updatedActiveComponent, setUpdatedActiveComponent] = useState({
    type: "info",
  });
  const theme = useTheme();
  const [switchSideView, setSwitchSideView] = useState("standard");
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const screenHasHeader = !!canvasItems.find((ci) => ci?.type === "header");

  useEffect(() => {
    if (otherParams?.iam === "workflows") dispatch(rHideRightSideBar(true));
  }, [otherParams, dispatch]);

  // useEffect(() => {
  //   console.log(`INDEX-2 > ${props.index}`);
  // }, [props.index]);

  useEffect(() => {
    setSwitchSideView("standard");
  }, [componentsSelection]);

  useEffect(() => {
    // console.log(
    //   `>> componentsSelection >> ${JSON.stringify(componentsSelection)}`
    // );
    const { activeComponents, mode } = componentsSelection;
    const {
      parent,
      index,
      id,
      type,
      style,
      containerType,
      containingChildIndex,
      isInsideContainer,
    } = activeComponents || {};
    const activeComponent = { id, type, parent, style };
    setMyIndex(index);
    // console.log(`___=_=_=> ${JSON.stringify(canvasItems)}`);

    if (switchSideView === "styling") {
      setUpdatedActiveComponent({
        type: "styling",
      });
    } else if (mode === "single") {
      if (activeComponent.type) {
        setUpdatedActiveComponent(activeComponent);
      }
      let findActiveData;
      if (isInsideContainer) {
        //console.log("333");
        findActiveData = canvasItems?.[index]?.children?.[containingChildIndex];
        //console.log(findActiveData.values);
        if (findActiveData) {
          setActiveData({
            ...findActiveData,
            index,
            containingChildIndex,
            containerType,
            parent,
            styles: !!findActiveData?.style?.overrideDefault
              ? { ...findActiveData?.style }
              : { ...screenStyles },
            stylesOverride: !!findActiveData?.style?.overrideDefault,
          });
        }
      } else {
        findActiveData = canvasItems?.[index];
        if (findActiveData) {
          setActiveData({
            ...findActiveData,
            index,
            containingChildIndex,
            styles: !!findActiveData?.style?.overrideDefault
              ? { ...findActiveData?.style }
              : { ...screenStyles },
            stylesOverride: !!findActiveData?.style?.overrideDefault,
          });
        }
      }
    } else if (mode === "multi") {
      setUpdatedActiveComponent({
        type: "multi",
      });
    } else {
      setUpdatedActiveComponent({
        type: "info",
      });
    }
    //console.log("555");
  }, [componentsSelection, canvasItems, switchSideView]);

  const handleRightSwitch = () => {
    setUpdatedActiveComponent("action-pane");
  };

  const handleDecisionRightSwitch = () => {
    setUpdatedActiveComponent("decision-button");
  };

  const handleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const onValuesChange = ({ value, property }) => {
    //console.log(`>>> ${value} > ${property}`);
    dispatch(
      updateValues({
        value,
        property,
        index: activeData?.index,
      })
    );
  };

  const _toggleRightSideBar = () => {
    props.dispatch(rHideRightSideBar(!props.hiddenRightSideBar));
  };

  const updatePropCallback = (prop, value) => dispatch(updateProp(prop, value));
  const renderUIERightSwitch = ({ type }) => {
    switch (type) {
      case "multi":
        return (
          <CustomSidebar
            updateProp={updatePropCallback}
            canvasItems={canvasItems}
            componentsSelection={componentsSelection}
            which="multi"
          />
        );

      case "info":
        return <InfoSidebar updateProp={updatePropCallback} />;

      case "styling":
        return (
          <SidebarStyleSection
            updateProp={updatePropCallback}
            activeSelection={canvasItems?.[myIndex || 0]}
            screenStyles={screenStyles}
            screenHasHeader={screenHasHeader}
          />
        );

      case "ScreenButtons":
        // This ScreenButtons should be changed if they decide to add properties to ScreenButton
        return <InfoSidebar updateProp={updatePropCallback} />;
      case "header":
        return (
          <HeaderSidebar {...activeData} updateProp={updatePropCallback} />
        );

      // BASIC ELEMENTS
      case "video":
        return <VideoSidebar {...activeData} updateProp={updatePropCallback} />;
      case "image":
        return <ImageSidebar {...activeData} updateProp={updatePropCallback} />;
      case "text":
        return <TextSidebar {...activeData} updateProp={updatePropCallback} />;
      case "pageBreak":
        return (
          <PageBreakSidebar {...activeData} updateProp={updatePropCallback} />
        );

      // FORM INPUTS
      case "inputText":
        return (
          <InputTextSidebar {...activeData} updateProp={updatePropCallback} />
        );
      case "textArea":
        return (
          <TextAreaSidebar {...activeData} updateProp={updatePropCallback} />
        );
      case "heading":
        return (
          <HeadingTextSidebar {...activeData} updateProp={updatePropCallback} />
        );
      case "fileUpload":
        return (
          <FileUploadSidebar {...activeData} updateProp={updatePropCallback} />
        );
      case "phoneNumber":
        return (
          <PhoneNumberSidebar {...activeData} updateProp={updatePropCallback} />
        );
      case "currency":
        return (
          <CurrencySidebar {...activeData} updateProp={updatePropCallback} />
        );
      case "dateTime":
        return (
          <DateTimeSidebar {...activeData} updateProp={updatePropCallback} />
        );
      case "address":
        return (
          <AddressSidebar {...activeData} updateProp={updatePropCallback} />
        );
      case "signature":
        return (
          <SignatureSidebar {...activeData} updateProp={updatePropCallback} />
        );
      case "userPicker":
        return (
          <UserPickerSidebar {...activeData} updateProp={updatePropCallback} />
        );

      // SELECTION CONTROLS
      case "dropdown":
        return (
          <DropDownSidebar
            {...activeData}
            updateData={(value, property) =>
              onValuesChange({ value, property })
            }
            updateProp={updatePropCallback}
          />
        );
      case "checkbox":
        return (
          <CheckBoxSidebar
            {...activeData}
            updateData={(value, property) =>
              onValuesChange({ value, property })
            }
            updateProp={updatePropCallback}
          />
        );
      case "radio":
        return <RadioSidebar {...activeData} updateProp={updatePropCallback} />;
      case "toggle":
        return (
          <ToggleSidebar {...activeData} updateProp={updatePropCallback} />
        );
      case "slider":
        return (
          <SliderSidebar {...activeData} updateProp={updatePropCallback} />
        );

      // BUTTONS
      case "submitButton":
        return (
          <SubmitButtonSidebar
            {...activeData}
            updateProp={updatePropCallback}
          />
        );
      case "actionButton":
        return (
          <ActionButtonSidebar
            {...activeData}
            updateProp={updatePropCallback}
          />
        );
      case "decisionButton":
        return (
          <DecisionButtonSidebar
            {...activeData}
            updateProp={updatePropCallback}
          />
        );

      // ADVANCED
      case "inputTable":
        return (
          <InputTableSidebar {...activeData} updateProp={updatePropCallback} />
        );
      case "displayTable":
        return (
          <DisplayTableSidebar
            {...activeData}
            updateProp={updatePropCallback}
          />
        );

      case "custom":
        return (
          <CustomSidebar
            updateProp={updatePropCallback}
            canvasItems={canvasItems}
            componentsSelection={componentsSelection}
            customInfo={{
              customId: canvasItems[updatedActiveComponent.id]?.customId,
              customName: canvasItems[updatedActiveComponent.id]?.customName,
            }}
            which="custom"
          />
        );

      case "dualText":
        return (
          <DualTextSidebar {...activeData} updateProp={updatePropCallback} />
        );

      case "number":
        return (
          <NumberSidebar {...activeData} updateProp={updatePropCallback} />
        );

      case "name":
        return <NameSidebar {...activeData} updateProp={updatePropCallback} />;
      // case "currency":
      //   return <PasswordSidebar {...activeData} updateProp={updatePropCallback} />;

      // case "checkbox":
      //   return <InputTableSidebar {...activeData} updateProp={updatePropCallback} />;

      case "quantity":
        return (
          <QuantitySidebar {...activeData} updateProp={updatePropCallback} />
        );

      case "linechart":
        return (
          <LineChartSidebar {...activeData} updateProp={updatePropCallback} />
        );

      case "horizontalbarchart":
        return (
          <HorizontalBarChartSidebar
            {...activeData}
            updateProp={updatePropCallback}
          />
        );

      case "verticalbarchart":
        return (
          <VerticalBarChartSidebar
            {...activeData}
            updateProp={updatePropCallback}
          />
        );

      case "piechart":
        return (
          <PieChartSidebar {...activeData} updateProp={updatePropCallback} />
        );

      case "areagraph":
        return (
          <AreaGraphSidebar {...activeData} updateProp={updatePropCallback} />
        );
      case "rectangle":
        return (
          <RectangleSidebar {...activeData} updateProp={updatePropCallback} />
        );

      case "ellipse":
        return (
          <EllipseSidebar {...activeData} updateProp={updatePropCallback} />
        );

      case "line":
        return <LineSidebar {...activeData} updateProp={updatePropCallback} />;

      case "polygon":
        return (
          <PolygonSidebar {...activeData} updateProp={updatePropCallback} />
        );

      case "star":
        return <StarSidebar {...activeData} updateProp={updatePropCallback} />;

      case "arrow":
        return <ArrowSidebar {...activeData} updateProp={updatePropCallback} />;

      case "menulist":
        return (
          <MenuListSidebar {...activeData} updateProp={updatePropCallback} />
        );
      case "submit-button":
        return <SubmitButtonSidebar />;
      case "action-pane":
        return <ActionPane />;

      default:
        return null;
    }
  };

  const _getSideView = (typ) => {
    if (props.hiddenRightSideBar) {
      setSwitchSideView(typ);
      _toggleRightSideBar();
    } else if (switchSideView !== typ) {
      setSwitchSideView(switchSideView === "standard" ? "styling" : "standard");
    } else _toggleRightSideBar();
  };

  return (
    <Paper className={classes.root} variant="outlined" square>
      <div
        style={{
          backgroundColor: "transparent",
          position: "absolute",
          left: -21,
          top: 5,
          zIndex: 999,
          cursor: "pointer",
        }}
      >
        {updatedActiveComponent.type === "action-pane" ? (
          <div>
            <SettingsOutlinedIcon
              fontSize="small"
              className={classes.settings}
              // onClick={handleDecisionRightSwitch}
            />
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection:
                switchSideView === "standard" ? "column" : "column-reverse",
            }}
          >
            <Tooltip title="Selection Properties">
              <div
                className={classes.settingsBox}
                onClick={() => _getSideView("standard")}
                style={{
                  backgroundColor:
                    switchSideView === "standard" ? "#deeef1" : "#F4F4F4",
                }}
              >
                <SettingsOutlinedIcon
                  fontSize="small"
                  className={classes.settings}
                  style={{
                    color: switchSideView === "standard" ? "#666" : "#999",
                  }}
                  // onClick={handleDrawer}
                />
              </div>
            </Tooltip>
            <Tooltip title="Global Appearance">
              <div
                className={classes.settingsBox}
                onClick={() => _getSideView("styling")}
                style={{
                  backgroundColor:
                    switchSideView === "standard" ? "#F4F4F4" : "#deeef1",
                }}
              >
                <ImPaintFormat
                  fontSize="small"
                  className={classes.settings}
                  style={{
                    color: switchSideView === "standard" ? "#999" : "#666",
                  }}
                  // onClick={handleDrawer}
                />
              </div>
            </Tooltip>
          </div>
        )}
        {updatedActiveComponent.type === "decision-button" ? (
          updatedActiveComponent.type === "action-pane" ? (
            <div className={classes.settingsBox}>
              <div style={{ padding: "7px 6px 4px" }}>
                <img
                  src="../../../../images/icons/direction.svg"
                  alt=""
                  // onClick={handleRightSwitch}
                />
              </div>
              <Divider />
            </div>
          ) : (
            <div>
              <div style={{ padding: "7px 6px 4px" }}>
                <img
                  src="../../../../images/icons/direction.svg"
                  alt=""
                  // onClick={handleRightSwitch}
                />
              </div>
              <Divider />
            </div>
          )
        ) : (
          ""
        )}
      </div>

      <div
        className={classes.controls}
        id="drawer-container"
        style={{
          position: "relative",
          boxShadow: "-3px 5px 12px #bbb",
          overflowY: "auto",
          // marginBottom: 100,
          // paddingBottom: 50,
        }}
      >
        {renderUIERightSwitch(updatedActiveComponent)}
        {/* <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={handleDrawer}
            classes={{
              paper: classes.drawerPaper,
            }}
            >
            
              {isDrawerOpen ? (
                <div className={classes.controls}>
                  hello
                {renderRightSwitch(updatedActiveComponent)}
              </div>
              ): (
                <SettingsOutlinedIcon
              fontSize="small"
              className={classes.settings}
            />
              )}
          </Drawer> */}
        {/* <Drawer 

            open={ isDrawerOpen }

            onClose={() => {}}

            PaperProps={{ style: { position: 'absolute' } }}

            BackdropProps={{ style: { position: 'absolute' } }}

            ModalProps={{

              container: document.getElementById('drawer-container'),

              style: { position: 'absolute' }

            }}

            variant="temporary"

          >

            <div>yeeah</div>

          </Drawer>   */}
      </div>
    </Paper>
  );
}
export default connect((state) => {
  return {
    activeComponents: state.uieditor.activeComponents,
    canvasItems: state.uieditor.canvasItems,
    screenStyles: state.uieditor.screenStyles,

    hiddenRightSideBar: state.reducers.hiddenRightSideBar,
    componentsSelection: state.uieditor.componentsSelection,
  };
})(RightSidebar);
