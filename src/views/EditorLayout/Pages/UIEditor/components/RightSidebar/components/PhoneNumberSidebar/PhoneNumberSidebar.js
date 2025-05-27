import React from "react";
import SidebarNameSection from "../components/SidebarNameSection";
import SidebarFieldPreferenceSection from "../components/SidebarFieldPreferenceSection";
import SidebarLabelPreferenceSection from "../components/SidebarLabelPreferenceSection";
import CustomStyleSection from "../components/CustomStyleSection";

export default function FileUploadSidebar(props) {
  const {
    id,
    itemRef,
    style,
    values,
    name,
    title,
    type: itemType,
    showStyling,
  } = props;

  const defaultPhoneCountries = [
    ["NIG", "Nigeria"],
    ["GHA", "Ghana"],
  ];

  return (
    <div className="sidebar-container">
      <SidebarNameSection
        itemId={id}
        itemType={itemType}
        name={name}
        title={title}
        itemRef={itemRef}
      />

      <div className="sidebar-container-scroll">
        {!showStyling ? (
          <>
            <SidebarFieldPreferenceSection
              itemType={itemType}
              name={name}
              title={title}
              itemRef={itemRef}
              values={{ ...values }}
              // dataType={dataType}
              defaultPhoneCountries={defaultPhoneCountries}
            />
            <SidebarLabelPreferenceSection
              itemType={itemType}
              name={name}
              title={title}
              itemRef={itemRef}
              values={{ ...values }}
              // dataType={dataType}
            />
          </>
        ) : (
          <CustomStyleSection
            itemRef={itemRef}
            itemType={itemType}
            items={["input", "label"]}
            styles={style}
          />
        )}
      </div>
    </div>
  );
}
