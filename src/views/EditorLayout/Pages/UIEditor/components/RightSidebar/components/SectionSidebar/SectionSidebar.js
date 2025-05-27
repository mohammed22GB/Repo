import React from "react";
import SidebarNameSection from "../components/SidebarNameSection";
import { useDispatch, useSelector } from "react-redux";
import CustomStyleSection from "../components/CustomStyleSection";
import {
  errorToastify,
  infoToastify,
} from "../../../../../../../common/utils/Toastify";
import { copyScreenStyles } from "../../../../utils/uieditorHelpers";

export default function SectionSidebar({
  id,
  itemRef,
  name,
  values,
  sectionStyle,
  style,
  showStyling,
}) {
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
        title={<b>Section</b>}
        itemType="App Information Bar"
        noName
      />

      <div className="sidebar-container-scroll">
        {/* {showStyling && ( */}
        <CustomStyleSection
          itemRef={id || itemRef}
          itemType={"screen"}
          items={[]}
          styles={sectionStyle}
          isSection={true}
          copyPageStyle={copyPageStyle}
          copyScreensList={screensList
            ?.filter((screen) => screen.id !== activeScreen.id)
            ?.map((screen) => [screen.id, screen.name])}
        />
        {/* )} */}
      </div>
    </div>
  );
}
