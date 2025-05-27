import React from "react";
import CustomStyleSection from "../components/CustomStyleSection";
import SidebarFieldPreferenceSection from "../components/SidebarFieldPreferenceSection";
import SidebarLabelPreferenceSection from "../components/SidebarLabelPreferenceSection";
import SidebarNameSection from "../components/SidebarNameSection";

export default function FileUploadSidebar(props) {
  const { layoutStyle, updateProp } = props;

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

  function updateData(key, value) {
    updateProp(key, value);
  }
  const layout = [
    ["fill", "Filled"],
    ["outline", "Outlined"],
  ];

  const fileType = [
    ["any", "Any"],
    ["image", "Image"],
    ["audio", "Audio"],
    ["pdf", "PDF"],
    ["zip", "Zip"],
  ];

  const uploadFrom = [
    ["any", "File"],
    ["image", "Camera"],
    ["audio", "Both Camera & File"],
  ];

  return (
    <div
      className="sidebar-container"
      // autoHide
      // style={{ height: windowDimensions?.height || 100 }}
    >
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
              dataType={dataType || "Any"}
              fileUploadFilesSelection={[
                ["single", "Single"],
                ["multiple", "Multiple"],
              ]}
              // onTypeChange={onTypeChange}
            />
            <SidebarLabelPreferenceSection
              itemRef={itemRef}
              itemType={itemType}
              name={name}
              title={title}
              values={{ ...values }}
            />
          </>
        ) : (
          <CustomStyleSection
            itemRef={itemRef}
            itemType={itemType}
            items={["button", "label"]}
            styles={style}
          />
        )}
      </div>
    </div>
  );
}
