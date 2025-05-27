import { useState } from "react";
import SidebarFieldPreferenceSection from "../components/SidebarFieldPreferenceSection";
import SidebarLabelPreferenceSection from "../components/SidebarLabelPreferenceSection";
import SidebarNameSection from "../components/SidebarNameSection";
import OptionsSelectionSection from "../components/OptionsSelectionSection";
import CustomStyleSection from "../components/CustomStyleSection";

export default function DropDownSidebar(props) {
  const {
    values,
    name,
    id,
    itemRef,

    title,
    style,
    type: itemType,
    dataType,
    updateData,
    showStyling,
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
}
