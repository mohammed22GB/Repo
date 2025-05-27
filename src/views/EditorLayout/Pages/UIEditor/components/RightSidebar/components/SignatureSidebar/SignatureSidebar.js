import React from "react";
import SidebarFieldPreferenceSection from "../components/SidebarFieldPreferenceSection";
import SidebarLabelPreferenceSection from "../components/SidebarLabelPreferenceSection";
import SidebarNameSection from "../components/SidebarNameSection";

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

  const { selectedLayout } = props;

  const labelLayout = [
    ["filled", "filed"],
    ["outline", "outline"],
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
        <SidebarFieldPreferenceSection
          itemType={itemType}
          name={name}
          title={title}
          itemRef={itemRef}
          values={{ ...values }}
        />
        <SidebarLabelPreferenceSection
          itemType={itemType}
          name={name}
          title={title}
          itemRef={itemRef}
          values={{ ...values }}
        />
      </div>
    </div>
  );
}
