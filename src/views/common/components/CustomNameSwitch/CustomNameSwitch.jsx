import PlainToggleSwitch from "../../../EditorLayout/Pages/UIEditor/components/RightSidebar/components/PlainToggleSwitch";

const CustomNameSwitch = ({ setIsDynamic, name, isDynamic }) => {
  return (
    <PlainToggleSwitch
      value={isDynamic}
      checked={isDynamic}
      onChange={(v) => {
        if (!name) alert("Name of field must first be set");
        else setIsDynamic(!!v?.target?.checked);
      }}
    />
  );
};

export default CustomNameSwitch;
