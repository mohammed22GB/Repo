import { useState } from "react";
import CustomStyleSection from "../components/CustomStyleSection";
import SidebarFieldPreferenceSection from "../components/SidebarFieldPreferenceSection";
import SidebarNameSection from "../components/SidebarNameSection";

export default function ImageSidebar(props) {
  const {
    id,
    itemRef,

    type: itemType,
    title,
    style,
    values,
    showStyling,
    name,
  } = props;
  const [isDynamic, setIsDynamic] = useState(name?.startsWith("@"));

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
          <SidebarFieldPreferenceSection
            itemRef={itemRef}
            itemType={itemType}
            name={name}
            title={title}
            values={{ ...values }}
            isDynamic={isDynamic}
            setIsDynamic={setIsDynamic}
          />
        ) : (
          <CustomStyleSection
            itemRef={itemRef}
            itemType={itemType}
            items={["image"]}
            styles={style}
          />
        )}
      </div>
      {/* consider adding border radius and other stylings to image */}
    </div>
  );
}
