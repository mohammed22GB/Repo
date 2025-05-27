import { TextField } from "@material-ui/core";
import Address from "./actualObjects/Address";
import SubmitButton from "./actualObjects/SubmitButton";
import Currency from "./actualObjects/Currency";
import DateTime from "./actualObjects/DateTime";
import DecisionButton from "./actualObjects/DecisionButton";
import FileUpload from "./actualObjects/FileUpload";
import Image from "./actualObjects/Image";
import InputText from "./actualObjects/InputText";
import InputTable from "./actualObjects/InputTable";
import HeadingText from "./actualObjects/HeadingText";
import PageBreak from "./actualObjects/PageBreak";
import PhoneNumber from "./actualObjects/PhoneNumber";
import Signature from "./actualObjects/Signature";
import UserPicker from "./actualObjects/UserPicker";
// import DisplayTable from "./actualObjects/DisplayTable";
import Text from "./actualObjects/Text";
import Video from "./actualObjects/Video";
import Custom from "./actualObjects/Custom";
import Dropdown from "./actualObjects/Dropdown";
import CheckBox from "./actualObjects/Checkbox";
import Radio from "./actualObjects/Radio";
import Toggle from "./actualObjects/Toggle";
import Slider from "./actualObjects/Slider";
import TextArea from "./actualObjects/TextArea";
import ActionButton from "./actualObjects/ActionButton";
import Header from "./actualObjects/Header";
import ScreenButtons from "./actualObjects/ScreenButtons";
import DisplayTable from "./actualObjects/DisplayTable/DisplayTable";
import { APP_DESIGN_MODES } from "../../../../common/utils/constants";

const RealComponents = ({ ...props }) => {
  switch (props.type) {
    case "submitButton":
      return <SubmitButton /* {...getProps()} */ {...props} />;
    case "ScreenButtons":
      return <ScreenButtons /* {...getProps()} */ {...props} />;
    case "actionButton":
      return <ActionButton /* {...getProps()} */ {...props} />;
    case "decisionButton":
      return <DecisionButton /* {...getProps()} */ {...props} />;
    case "textBox":
      return (
        <TextField
          style={props.style}
          variant="outlined"
          size="small"
          placeholder="type here"
          disabled={
            props.appDesignMode === APP_DESIGN_MODES.EDIT || props.disabled
          }
          /* {...getProps()} */ {...props}
        />
      );
    case "text":
      return <Text /* {...getProps()} */ {...props} />;
    case "video":
      return <Video /* {...getProps()} */ {...props} />;
    case "image":
      return <Image /* {...getProps()} */ {...props} />;
    case "displayTable":
      return <DisplayTable /* {...getProps()} */ {...props} />;
    case "pageBreak":
      return <PageBreak /* {...getProps()} */ {...props} />;
    case "signature":
      return <Signature /* {...getProps()} */ {...props} />;
    case "userPicker":
      return <UserPicker /* {...getProps()} */ {...props} />;
    case "fileUpload":
      return <FileUpload /* {...getProps()} */ {...props} />;
    case "inputText":
      return <InputText /* {...getProps()} */ {...props} />;
    case "textArea":
      return <TextArea /* {...getProps()} */ {...props} />;
    case "heading":
      return <HeadingText /* {...getProps()} */ {...props} />;
    case "dual":
      return (
        <TextField
          variant="outlined"
          size="small"
          placeholder="type here"
          disabled={props.appDesignMode === APP_DESIGN_MODES.EDIT}
        />
      );
    case "dateTime":
      return <DateTime /* {...getProps()} */ {...props} />;
    case "phoneNumber":
      return <PhoneNumber /* {...getProps()} */ {...props} />;
    case "address":
      return <Address /* {...getProps()} */ {...props} />;
    case "currency":
      return <Currency /* {...getProps()} */ {...props} />;

    //  advanced elements
    case "inputTable":
      return <InputTable /* {...getProps()} */ {...props} />;

    //  custom elements
    case "custom":
      return (
        <Custom
          contents={props.contents}
          style={props.style}
          customId={props.customId}
          /* {...getProps()} */ {...props}
        />
      );
    case "dropdown":
      return <Dropdown /* {...getProps()} */ {...props} />;
    case "checkbox":
      return <CheckBox /* {...getProps()} */ {...props} />;
    case "radio":
      return <Radio /* {...getProps()} */ {...props} />;
    case "toggle":
      return <Toggle /* {...getProps()} */ {...props} />;
    case "slider":
      return <Slider /* {...getProps()} */ {...props} />;

    // Navigation
    case "header":
      return <Header /* {...getProps()} */ {...props} />;

    default:
      return <Text /* {...getProps()} */ {...props} />;
  }
};

export default RealComponents;
