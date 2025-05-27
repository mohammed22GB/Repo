import React from "react";
import { useDispatch } from "react-redux";

import SidebarFieldPreferenceSection from "../components/SidebarFieldPreferenceSection";
import SidebarLabelPreferenceSection from "../components/SidebarLabelPreferenceSection";
import SidebarNameSection from "../components/SidebarNameSection";

export default function DateTimeSidebar(props) {
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

  const dispatch = useDispatch();

  const [state, setState] = React.useState({
    checkedBtn: true,
  });

  return (
    <>
      <div className="sidebar-container">
        <SidebarNameSection
          id={id}
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
    </>
  );
}
