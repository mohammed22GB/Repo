import { useState } from "react";
import CustomStyleSection from "../components/CustomStyleSection";
import SidebarFieldPreferenceSection from "../components/SidebarFieldPreferenceSection";
import SidebarLabelPreferenceSection from "../components/SidebarLabelPreferenceSection";
import SidebarNameSection from "../components/SidebarNameSection";

export default function InputTextSidebar(props) {
  const {
    values,
    name,
    id,
    itemRef,

    title,
    style,
    type: itemType,
    dataType,
    showStyling,
  } = props;

  const [isDynamic, setIsDynamic] = useState(props?.name?.startsWith("@"));

  return (
    <div className="sidebar-container">
      <SidebarNameSection
        itemRef={itemRef}
        itemId={id}
        itemType={itemType}
        name={name}
        title={title}
        isDynamic={isDynamic}
        setIsDynamic={setIsDynamic}
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
              isDynamic={isDynamic}
              setIsDynamic={setIsDynamic}
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
