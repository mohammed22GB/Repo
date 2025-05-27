import React, { useState } from "react";
import SidebarNameSection from "../components/SidebarNameSection";
import TableColumnsPreferences from "../components/TableColumnsPreferences";
import SidebarFieldPreferenceSection from "../components/SidebarFieldPreferenceSection";
import CustomStyleSection from "../components/CustomStyleSection";

const DisplayTableSidebar = (props) => {
  const [isDynamic, setIsDynamic] = useState(props?.name?.startsWith("@"));

  const {
    id,
    itemRef,
    type: itemType,
    title,
    name,
    values,
    style,
    showStyling,
    dataType,
    updateData,
  } = props;

  return (
    <div className="sidebar-container">
      <SidebarNameSection
        itemId={id}
        itemType={itemType}
        name={name}
        title={title}
        itemRef={itemRef}
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
              updateData={updateData}
            />

            <TableColumnsPreferences
              itemType={itemType}
              name={name}
              title={title}
              itemRef={itemRef}
              values={{ ...(values || {}) }}
              dataType={dataType}
              updateData={updateData}
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
};

export default DisplayTableSidebar;
