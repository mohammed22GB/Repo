// src/views/EditorLayout/Pages/UIEditor/components/RightSidebar/components/RadioSidebar/RadioSidebar.js
import { useState } from "react";
import SidebarNameSection from "../components/SidebarNameSection";
import SidebarFieldPreferenceSection from "../components/SidebarFieldPreferenceSection";
import OptionsSelectionSection from "../components/OptionsSelectionSection";
import SidebarLabelPreferenceSection from "../components/SidebarLabelPreferenceSection";
import CustomStyleSection from "../components/CustomStyleSection";

const RadioSidebar = (props) => {
  const [isDynamic, setIsDynamic] = useState(props?.name?.startsWith("@"));

  const {
    id,
    itemRef,
    name,
    title,
    values,
    style,
    type: itemType,
    dataType,
    showStyling,
    updateData,
  } = props;

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
              updateData={updateData}
            />
            {!isDynamic && (
              <OptionsSelectionSection
                itemRef={itemRef}
                itemType={itemType}
                name={name}
                title={title}
                values={{ ...values }}
                dataType={dataType}
                updateData={updateData}
              />
            )}
            <SidebarLabelPreferenceSection
              itemRef={itemRef}
              itemType={itemType}
              name={name}
              title={title}
              values={values}
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
};

export default RadioSidebar;
