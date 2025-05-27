import { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Tooltip } from "@material-ui/core";

import InfoSidebar from "./components/InfoSidebar";
import HeaderSidebar from "./components/HeaderSidebar";
import InputTableSidebar from "./components/InputTableSidebar";
import FileUploadSidebar from "./components/FileUploadSidebar";
import VideoSidebar from "./components/VideoSidebar";
import PhoneNumberSidebar from "./components/PhoneNumberSidebar";
import TextSidebar from "./components/TextSidebar";
import ImageSidebar from "./components/ImageSidebar";
import DisplayTableSidebar from "./components/DisplayTableSidebar";
import PageBreakSidebar from "./components/PageBreakSidebar";
import SignatureSidebar from "./components/SignatureSidebar";
import TextAreaSidebar from "./components/TextAreaSidebar";
import DateTimeSidebar from "./components/DateTimeSidebar";
import CurrencySidebar from "./components/CurrencySidebar";
import DropDownSidebar from "./components/DropDownSidebar";
import RadioSidebar from "./components/RadioSidebar";
import ToggleSidebar from "./components/ToggleSidebar";
import SliderSidebar from "./components/SliderSidebar";
import InputTextSidebar from "./components/InputTextSidebar";
import SubmitButtonSidebar from "./components/SubmitButtonSidebar";
import HeadingTextSidebar from "./components/HeadingTextSidebar";
import UserPickerSidebar from "./components/UserPickerSidebar";
import {
  rHideRightSideBar,
  updateProp,
} from "../../../../../../store/actions/properties";
import { updateScreenItemPropertyValues } from "../../utils/uieditorHelpers";
import { Close } from "@material-ui/icons";
import { RiPaintBrushLine } from "react-icons/ri";
import {
  getUieResultantStyles,
  getUieResultantValues,
} from "../../../../../common/helpers/helperFunctions";
import SectionSidebar from "./components/SectionSidebar";
import { BsChevronRight } from "react-icons/bs";
import CheckboxSidebar from "./components/CheckBoxSidebar";
import ActionButtonSidebar from "./components/ActionButtonSidebar";

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

const UieRightSidebar = (props) => {
  const classes = useStyles();
  const { activeItem, screensItems } = useSelector(({ uieditor }) => uieditor);
  const { activeScreen } = useSelector(({ screens }) => screens);
  const { hiddenRightSideBar } = useSelector(({ reducers }) => reducers);

  const itemDetails = screensItems?.[activeScreen?.id]?.[activeItem?.itemRef];
  const combinedStyles = getUieResultantStyles(itemDetails || {}, activeScreen);
  const combinedValues = getUieResultantValues(
    itemDetails || {},
    activeItem.type
  );

  if (itemDetails) {
    itemDetails.style = combinedStyles;
    itemDetails.values = combinedValues;
  }

  const { dispatch, otherParams } = props;
  const [switchSideView, setSwitchSideView] = useState("standard");
  const [togglePaneStyling, setTogglePaneStyling] = useState(false);

  useEffect(() => {
    if (otherParams?.iam === "workflows") {
      dispatch(rHideRightSideBar(true));
    }
  }, [otherParams, dispatch]);

  const onValuesChange = ({ value, property, itemRef }) => {
    dispatch(
      updateScreenItemPropertyValues({
        value,
        property,
        itemRef,
      })
    );
  };

  const isSection = activeItem?.type === "section";

  const _toggleRightSideBar = () => {
    props.dispatch(rHideRightSideBar(!props.hiddenRightSideBar));
  };
  const closePanel = () => {
    props.dispatch(rHideRightSideBar(true));
  };

  const updatePropCallback = (prop, value) => dispatch(updateProp(prop, value));

  const RenderUIERightSwitch = () => {
    switch (activeItem?.type) {
      case "screen":
        return (
          <InfoSidebar
            {...activeScreen}
            showStyling={togglePaneStyling}
            updateProp={updatePropCallback}
          />
        );

      case "section":
        return (
          <SectionSidebar
            {...activeItem}
            updateProp={updatePropCallback}
            showStyling={togglePaneStyling}
          />
        );

      /* case "styling":
        return (
          <SidebarStyleSection
            updateProp={updatePropCallback}
            activeSelection={canvasItems?.[myIndex || 0]}
            screenStyles={screenStyles}
            screenHasHeader={screenHasHeader}
          />
        ); */

      case "ScreenButtons":
        // This ScreenButtons should be changed if they decide to add properties to ScreenButton
        return <InfoSidebar updateProp={updatePropCallback} />;

      case "header":
        return (
          <HeaderSidebar
            {...itemDetails}
            showStyling={togglePaneStyling}
            updateProp={updatePropCallback}
          />
        );

      // BASIC ELEMENTS
      case "video":
        return (
          <VideoSidebar
            {...itemDetails}
            showStyling={togglePaneStyling}
            updateProp={updatePropCallback}
          />
        );
      case "image":
        return (
          <ImageSidebar
            {...itemDetails}
            showStyling={togglePaneStyling}
            updateProp={updatePropCallback}
          />
        );
      case "text":
        return (
          <TextSidebar
            {...itemDetails}
            showStyling={togglePaneStyling}
            updateProp={updatePropCallback}
          />
        );
      case "pageBreak":
        return (
          <PageBreakSidebar
            {...itemDetails}
            showStyling={togglePaneStyling}
            updateProp={updatePropCallback}
          />
        );

      // FORM INPUTS
      case "inputText":
        return (
          <InputTextSidebar
            {...itemDetails}
            showStyling={togglePaneStyling}
            updateProp={updatePropCallback}
          />
        );
      case "textArea":
        return (
          <TextAreaSidebar
            {...itemDetails}
            showStyling={togglePaneStyling}
            updateProp={updatePropCallback}
          />
        );
      case "heading":
        return (
          <HeadingTextSidebar
            {...itemDetails}
            showStyling={togglePaneStyling}
            updateProp={updatePropCallback}
          />
        );
      case "fileUpload":
        return (
          <FileUploadSidebar
            {...itemDetails}
            showStyling={togglePaneStyling}
            updateProp={updatePropCallback}
          />
        );
      case "phoneNumber":
        return (
          <PhoneNumberSidebar
            {...itemDetails}
            showStyling={togglePaneStyling}
            updateProp={updatePropCallback}
          />
        );
      case "currency":
        return (
          <CurrencySidebar
            {...itemDetails}
            showStyling={togglePaneStyling}
            updateProp={updatePropCallback}
          />
        );
      case "dateTime":
        return (
          <DateTimeSidebar
            {...itemDetails}
            showStyling={togglePaneStyling}
            updateProp={updatePropCallback}
          />
        );
      // case "address":
      //   return (
      //     <AddressSidebar
      //       {...itemDetails}
      //       showStyling={togglePaneStyling}
      //       updateProp={updatePropCallback}
      //     />
      //   );
      case "signature":
        return (
          <SignatureSidebar
            {...itemDetails}
            showStyling={togglePaneStyling}
            updateProp={updatePropCallback}
          />
        );
      case "userPicker":
        return (
          <UserPickerSidebar
            {...itemDetails}
            showStyling={togglePaneStyling}
            updateProp={updatePropCallback}
          />
        );

      // SELECTION CONTROLS
      case "dropdown":
        return (
          <DropDownSidebar
            {...itemDetails}
            updateData={(value, property) =>
              onValuesChange({ value, property, itemRef: itemDetails.itemRef })
            }
            showStyling={togglePaneStyling}
            updateProp={updatePropCallback}
          />
        );
      case "checkbox":
        return (
          <CheckboxSidebar
            {...itemDetails}
            updateData={(value, property) =>
              onValuesChange({ value, property, itemRef: itemDetails.itemRef })
            }
            showStyling={togglePaneStyling}
            updateProp={updatePropCallback}
          />
        );
      case "radio":
        return (
          <RadioSidebar
            {...itemDetails}
            updateData={(value, property) =>
              onValuesChange({ value, property, itemRef: itemDetails.itemRef })
            }
            showStyling={togglePaneStyling}
            updateProp={updatePropCallback}
          />
        );
      case "toggle":
        return (
          <ToggleSidebar
            {...itemDetails}
            showStyling={togglePaneStyling}
            updateProp={updatePropCallback}
          />
        );
      case "slider":
        return (
          <SliderSidebar
            {...itemDetails}
            showStyling={togglePaneStyling}
            updateProp={updatePropCallback}
          />
        );

      // BUTTONS
      case "submitButton":
        return (
          <SubmitButtonSidebar
            {...itemDetails}
            showStyling={togglePaneStyling}
            updateProp={updatePropCallback}
          />
        );
      case "actionButton":
        return (
          <ActionButtonSidebar
            {...itemDetails}
            showStyling={togglePaneStyling}
            updateProp={updatePropCallback}
          />
        );

      // ADVANCED
      case "inputTable":
        return (
          <InputTableSidebar
            {...itemDetails}
            showStyling={togglePaneStyling}
            updateProp={updatePropCallback}
          />
        );
      case "displayTable":
        return (
          <DisplayTableSidebar
            {...itemDetails}
            updateData={(value, property) => {
              onValuesChange({ value, property, itemRef: itemDetails.itemRef });
            }}
            showStyling={togglePaneStyling}
            updateProp={updatePropCallback}
          />
        );

      case "submit-button":
        return <SubmitButtonSidebar />;
      // case "action-pane":
      //   return <ActionPane />;

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
    } else {
      _toggleRightSideBar();
    }
  };

  return (
    <Paper className={classes.root} variant="outlined" square>
      {!hiddenRightSideBar && (
        <Tooltip title="Close side panel">
          <div
            style={{
              position: "absolute",
              left: -35,
              color: activeItem?.type === "screen" ? "#ffffff" : "#333",
              width: 35,
              height: 35,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "3px 0 0 3px",
              cursor: "pointer",
              // backgroundImage: "linear-gradient(#7e8389, #64686d)",
              backgroundImage:
                activeItem?.type === "screen"
                  ? "linear-gradient(#7e8389, #64686d)"
                  : "linear-gradient(rgb(255 255 255), rgb(249 252 255), rgb(223 230 239))",
              // boxShadow: "-1px 3px 5px #999",
              boxShadow: "rgb(183 183 183) 0px 3px 4px",
              zIndex: 1,
            }}
            onClick={closePanel}
          >
            <Close />
          </div>
        </Tooltip>
      )}
      <div
        className={classes.controls}
        id="drawer-container"
        style={{
          position: "relative",
          // boxShadow: "-3px 5px 12px #bbb",
          boxShadow: "rgb(233 233 233) -3px 5px 12px",
          overflowY: "auto",
          // marginBottom: 100,
          // paddingBottom: 50,
        }}
      >
        <div
          style={{
            height: 35,
            fontSize: 14,
            color: activeItem?.type === "screen" ? "#ffffff" : "#333",
            // backgroundColor: "#7e8389",
            /* border-bottom: solid 1px #7e8389, */
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 10px",
            // boxShadow: "0 3px 5px #999",
            boxShadow: "rgb(183 183 183) 0px 3px 4px",
            backgroundImage:
              activeItem?.type === "screen"
                ? "linear-gradient(#7e8389, #64686d)"
                : "linear-gradient(rgb(255 255 255), rgb(249 252 255), rgb(223 230 239))",
            marginBottom: 5,
          }}
        >
          <div>{togglePaneStyling || isSection ? "Styles" : "Properties"}</div>
          {!isSection && (
            <div
              style={{
                marginLeft: "auto",
                marginRight: 5,
                fontSize: 10,
                letterSpacing: "1.5px",
                display: "flex",
                alignItems: "center",
              }}
            >
              show {!togglePaneStyling ? "Styles" : "Properties"}{" "}
              <BsChevronRight style={{ marginLeft: 4 }} />
            </div>
          )}
          <Tooltip title={`${togglePaneStyling ? "Hide" : "Show"} styling`}>
            <div
              style={{
                display: "flex",
                padding: 5,
                alignItems: "center",
                justifyContent: "center",
                border: `${
                  togglePaneStyling || isSection ? "inset" : "outset"
                } 1px #aaa`,
                borderRadius: 3,
                background: `${
                  togglePaneStyling || isSection
                    ? "rgb(215 223 233)"
                    : "rgb(249 252 255)"
                }`,
                cursor: "pointer",
              }}
              onClick={() =>
                isSection ? () => {} : setTogglePaneStyling(!togglePaneStyling)
              }
            >
              <RiPaintBrushLine style={{ fontSize: 16, color: "#333" }} />
            </div>
          </Tooltip>
        </div>
        {RenderUIERightSwitch()}
      </div>
    </Paper>
  );
};

export default connect((state) => {
  return {
    activeComponents: state.uieditor.activeComponents,
    canvasItems: state.uieditor.canvasItems,
    screenStyles: state.uieditor.screenStyles,

    hiddenRightSideBar: state.reducers.hiddenRightSideBar,
    componentsSelection: state.uieditor.componentsSelection,
  };
})(UieRightSidebar);
