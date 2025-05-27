import { InputBase } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import SidebarFieldPreferenceSection from "../components/SidebarFieldPreferenceSection";
import SidebarNameSection from "../components/SidebarNameSection";
import CustomStyleSection from "../components/CustomStyleSection";
import { updateScreenItemPropertyValues } from "../../../../utils/uieditorHelpers";

const InputText = withStyles((theme) => ({
  input: {
    color: "#091540",
    borderRadius: 3,
    position: "relative",
    border: "1px solid #ABB3BF",
    fontSize: 11,
    padding: "5px 12px",
    transition: theme?.transitions.create(["border-color", "box-shadow"]),
  },
}))(InputBase);

const HeaderSidebar = (props) => {
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

  const dispatch = useDispatch();
  const onValuesChange = ({ value, property }) =>
    dispatch(
      updateScreenItemPropertyValues({
        value,
        property,
        type: itemType,
        itemRef,
      })
    );

  const iconLabels = [
    ["select", "Select"],
    ["home", "Home"],
    ["back", "Back"],
    ["settings", "Settings"],
    ["message", "Message"],
    ["profile", "Profile"],
  ];

  const onExternalLinkChange = ({ value, property }) => {
    onValuesChange({
      value: { name: "External", link: value, value: "external" },
      property,
    });
  };

  return (
    <>
      <div className="sidebar-container">
        <SidebarNameSection
          itemRef={itemRef}
          id={id}
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
              dataType={dataType}
            />
          ) : (
            <CustomStyleSection
              itemRef={itemRef}
              itemType={itemType}
              items={["header"]}
              styles={style}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default HeaderSidebar;
