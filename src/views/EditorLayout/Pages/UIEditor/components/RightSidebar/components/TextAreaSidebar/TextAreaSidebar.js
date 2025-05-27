import React from "react";
import SidebarNameSection from "../components/SidebarNameSection";
import SidebarFieldPreferenceSection from "../components/SidebarFieldPreferenceSection";
import SidebarLabelPreferenceSection from "../components/SidebarLabelPreferenceSection";
import CustomStyleSection from "../components/CustomStyleSection";

export default function TextAreaSidebar(props) {
  const {
    values,
    name,
    title,
    id,
    itemRef,

    style,
    type: itemType,
    dataType,
    showStyling,
  } = props;

  const inputType = [
    ["text", "Text"],
    ["email", "Email"],
    ["url", "URL"],
  ];

  return (
    <div className="sidebar-container">
      <SidebarNameSection
        itemRef={itemRef}
        itemId={id}
        itemType={itemType}
        name={name}
        title={title}
      />

      <div className="sidebar-container-scroll">
        {!showStyling ? (
          <>
            <SidebarFieldPreferenceSection
              itemRef={itemRef}
              itemType={itemType}
              name={name}
              title={title}
              values={{ ...values }}
              dataType={dataType}
            />
            <SidebarLabelPreferenceSection
              itemRef={itemRef}
              itemType={itemType}
              name={name}
              title={title}
              values={{ ...values }}
              dataType={dataType}
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
