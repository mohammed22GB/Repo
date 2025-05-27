import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import SidebarNameSection from "../components/SidebarNameSection";
import { useDispatch, useSelector } from "react-redux";
import SidebarFieldPreferenceSection from "../components/SidebarFieldPreferenceSection";
import CustomStyleSection from "../components/CustomStyleSection";
import {
  errorToastify,
  infoToastify,
} from "../../../../../../../common/utils/Toastify";
import { copyScreenStyles } from "../../../../utils/uieditorHelpers";

const useStyles = makeStyles((theme) => ({
  sideHeading: {
    color: "#091540",
    fontSize: 12,
    fontWeight: 300,
    paddingLeft: 3,
    marginBottom: 0,
    display: "flex",
    alignItems: "center",
  },
  subTitle: {
    color: "#999999",
    fontWeight: 375,
    fontSize: 12,
  },
  subColor: {
    color: "#999999",
    fontWeight: 375,
    fontSize: 10,
    paddingBottom: 8,
  },
  subTitle2: {
    color: "#999999",
    fontWeight: 375,
    fontSize: 12,
  },
  user: {
    display: "flex",
    alignItems: "center",
  },
  bgcolor: {
    display: "flex",
  },
  userName: {
    color: "#091540",
    fontWeight: 375,
    fontSize: 12,
    textTransform: "capitalize",
  },
  divider: {
    marginTop: 15,
    marginBottom: 15,
  },
  status: {
    background: "#808080",
    borderRadius: 4,
    color: "white",
    fontSize: 10,
    padding: "2px 20px",
    marginLeft: 10,
    display: "inline-flex",
    textTransform: "capitalize",
  },
  draft: {
    backgroundColor: "#f3f2ec",
    color: "#656776",
    border: "solid 0.5px #e7e6dc",
    padding: "2px 10px",
    fontSize: "0.85em",
    borderRadius: 4,
    letterSpacing: "0.8px",
    fontWeight: 300,
    display: "inline-block",
    textTransform: "uppercase",
  },
  live: {
    backgroundColor: "#3cc0dd",
    border: "solid 0.5px #3cc0dd",
    color: "#FFFFFF",
    padding: "2px 10px",
    fontSize: "0.85em",
    borderRadius: 4,
    letterSpacing: "0.8px",
    fontWeight: 300,
    display: "inline-block",
    textTransform: "uppercase",
    textShadow: "0.5px 0.5px 1px #888",
  },
  subHeading: {
    color: "#091540",
    fontWeight: 375,
    fontSize: 12,
  },
  subContent: {
    color: "#091540",
    fontWeight: 375,
    fontSize: 12,
    paddingBottom: 33,
  },
  subInfo: {
    color: "#999999",
    fontWeight: 375,
    fontSize: 12,
    paddingBottom: 8,
    paddingTop: "0px !important",
  },
  userChanges: {
    fontStyle: "italic",
    paddingTop: 8,
  },
  section: {
    marginBottom: 100,
  },
}));

export default function InfoSidebar({ id, name, values, style, showStyling }) {
  const dispatch = useDispatch();
  const {
    selectedApp: { createdAt, updatedAt, active, creator },
  } = useSelector(({ appsReducer }) => appsReducer);
  const { screensList, activeScreen } = useSelector(({ screens }) => screens);

  const copyPageStyle = (value) => {
    const sourceOverridesDefault = screensList.some(
      (screen) => screen.id === value && screen.style?.overrideDefault
    );
    if (!sourceOverridesDefault) {
      errorToastify("Selected source screen is using screen default styles");
      return;
    }

    dispatch(copyScreenStyles(value, activeScreen.id));
    infoToastify("Styles copied");
  };

  return (
    <div className="sidebar-container">
      <SidebarNameSection
        itemId="info_side_bar"
        title={<b>{`Screen name: ${name || ""}`}</b>}
        itemType="App Information Bar"
        noName
      />

      <div className="sidebar-container-scroll">
        {!showStyling ? (
          <SidebarFieldPreferenceSection
            id={id}
            itemRef={id}
            itemType={"screen"}
            values={values}
            isPage={true}
          />
        ) : (
          <CustomStyleSection
            itemRef={id}
            itemType={"screen"}
            items={[
              "header",
              "heading",
              "text",
              "input",
              "button",
              "label",
              "page",
            ]}
            styles={style}
            isPage={true}
            copyPageStyle={copyPageStyle}
            copyScreensList={screensList
              ?.filter((screen) => screen.id !== activeScreen.id)
              ?.map((screen) => [screen.id, screen.name])}
          />
        )}
      </div>
    </div>
  );
}
