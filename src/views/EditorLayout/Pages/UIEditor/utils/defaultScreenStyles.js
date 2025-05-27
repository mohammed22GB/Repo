import { v4 } from "uuid";

export const getDefaultValues = (component, onCreation = true) => {
  // BASIC ELEMENTS:
  const allValues = {
    video: {
      label: "Enter label name",
      labelHide: false,
    },
    image: {
      label: "Enter label name",
      labelHide: false,
      width: 200,
      unit: "px",
      textAlign: "left",
    },
    text: {
      value: "Lorem ipsum dolor sit amet...",
    },
    heading: {
      value: "Lorem ipsum dolor sit amet...",
    },
    pageBreak: {
      value: "Hello Word",
    },
    form: {},

    // FORM INPUTS:
    inputText: {
      name: "",
      label: "Enter label name",
      required: false,
      labelHide: false,
      placeholder: "Enter text here",
      type: "text",
      limitCharacter: false,
      min: 3,
      max: 10,
    },
    userPicker: {
      name: "",
      label: "Enter label name",
      required: false,
      labelHide: false,
      placeholder: "Enter text here",
      type: "text",
      limitCharacter: false,
      min: 3,
      max: 10,
    },
    textArea: {
      placeholder: "Enter text here",
      labelHide: false,
      type: "text",
      limitCharacter: false,
      min: 3,
      max: 10,
      label: "Enter label name",
      rows: 3,
    },
    signature: {
      label: "Enter label name",
      buttonText: "Click here to sign",
    },
    fileUpload: {
      label: "Enter label here",
      buttonText: "Click to upload file",
      uploadFrom: "file",
      multipleUpload: false,
      numOfFiles: 1,
      maxFileSize: 2,
      required: false,
      fileType: "any",
      labelHide: false,
    },
    address: {
      label: "Enter label name",
      labelHide: false,
    },
    currency: {
      label: "Enter label name",
      labelHide: false,
      placeholder: "Enter text here",
      defaultCountry: "NG",
      allowOtherCountriesSelection: true,
      maximumFigure: 10,
      showTooltip: false,
      required: false,
      toolTip: "tool tip",
      decimalPrecision: 2,
    },
    dateTime: {
      init: true,
      label: "Enter date label here",
      datePlaceholder: "Enter date placeholder here",
      timePlaceholder: "Enter time placeholder here",
      toolTip: "Enter toolTip",
      hideLabel: false,
      stackRange: true,
      showDate: true,
      showTime: true,
      showTooltip: false,
      rangeStartId: onCreation ? v4() : null,
      rangeEndId: onCreation ? v4() : null,
      rangeDurationId: onCreation ? v4() : null,
    },
    phoneNumber: {
      placeholder: "Enter text here",
      label: "Enter a label",
      labelHide: false,
      defaultCountry: "NG",
    },

    // SELECTION CONTROLS:
    dropdown: {
      selectedValue: [""],
      placeholder: "Enter text here",
      labelHide: false,
      label: "Enter label name",
      options: [],
    },
    checkbox: {
      label: "Enter Checkbox label name",
      labelHide: false,
    },
    radio: {
      label: "Enter label name",
      labelHide: false,
      required: false,
      options: [],
      selectedValue: "",
    },
    toggle: {
      checked: false,
      label: "Enter label name",
      labelHide: false,
    },
    slider: {
      checked: false,
      label: "Enter label name",
      labelHide: false,
      min: 1,
      max: 10,
      step: 2,
      orientation: "horizontal",
    },

    // BUTTONS:
    actionButton: {
      label: "Enter label name",
      buttonText: "Action Text",
      navigation: {
        name: "external",
        link: "",
      },
      type: "submit",
    },
    submitButton: {
      label: "Enter label name",
      buttonText: "Submit Button",
      popUpTitle: "Pop Up Title",
      popUpMessage: "Pop Up message",
      enablePopUp: false,
    },
    decisionButton: {
      yesBtn: "Yes",
      noBtn: "No",
      label: "Enter label name",
      required: false,
      labelHide: false,
    },
    screenButtons: {
      button1Text: "Back",
      button1Type: "button",
      button2Text: "Next",
      button2Type: "button",
    },

    // ADVANCED:
    table: {
      columns: [
        {
          id: v4(),
          dataText: "Column-1",
          relWidth: 1,
        },
        {
          id: v4(),
          dataText: "Column-2",
          relWidth: 1,
        },
      ],
      values: [],
    },
    displayTable: {
      init: true,
      columns: [
        {
          id: v4(),
          dataText: "Column-1",
          relWidth: 1,
        },
        {
          id: v4(),
          dataText: "Column-2",
          relWidth: 1,
        },
      ],
      values: [],
    },
    inputTable: {
      init: true,
      hasTableHeaders: true,
      hasSerialNumbers: true,
      maxRows: 100,
      aggregateCells: [],
      columns: [
        {
          id: v4(),
          header: "Column-1",
          inputType: "inputText",
          relWidth: 1,
        },
        {
          id: v4(),
          header: "Column-2",
          inputType: "inputText",
          relWidth: 1,
        },
      ],
    },

    // Header
    header: {
      name: "",
      label: "Enter name",
      action: "",
      leftIcon: "home",
      leftIconVisible: false,
      leftIconColor: "#FFFF",
      rightIcon: "back",
      rightIconVisible: false,
      rightIconColor: "#FFFF",
      rightNavigation: {},
      leftNavigation: {},
    },
  };

  return allValues[component];
};

// this is maintained also in backend. Updates must be synced!
export const defaultStyles = (screenType = "app") => {
  return {
    page: {
      ...(screenType === "app"
        ? {
            horizontalMargin: 0.5,
            verticalMargin: 0.5,
            backgroundColor: "#FFFFFF",
            lineSpacing: 15,
            dimensionMeasure: "px",
            width: 900,
          }
        : {
            horizontalMargin: 0.5,
            verticalMargin: 0.5,
            backgroundColor: "#FEFEFE",
            width: 8.5,
            height: 11,
            dimensionMeasure: "inch",
            lineSpacing: 15,
          }),
    },
    header: {
      height: 50,
      textAlign: "left",
      fontSize: 18,
      fontWeight: 600,
      color: "#ffffff",
      lineHeight: 1.5,

      borderStyle: "solid",
      borderWidth: 0,
      borderRadius: 0,
      borderColor: "#091540",
      backgroundColor: "#091540",
    },
    form: {
      width: "100%",
      height: "auto",
      padding: 0,
      spacing: 15,

      borderStyle: "solid",
      borderWidth: 0,
      borderRadius: 0,
      borderColor: "#091540",
      backgroundColor: "transparent",
    },
    field: {
      width: 300,
      height: 40,

      fontSize: 12,
      fontWeight: 400,
      color: "#091540",
      textAlign: "left",

      borderStyle: "solid",
      borderWidth: 1,
      borderRadius: 0,
      borderColor: "#091540",
      backgroundColor: "#ffffff",

      /* color: "#ffff",
      cursor: "pointer",
      border: "1px solid #010A43",
      padding: "10px 0",
      fontSize: "12px",
      variant: "filled",
      background: "#010A43",
      "&:hover": {
        color: "#010A43",
      },
      "&:disabled": {
        color: "#ffff",
      }, */
    },
    text: {
      width: "100%",
      textAlign: "left",
      fontSize: 12,
      fontWeight: 300,
      color: "#091540",
      lineHeight: 1.5,

      borderStyle: "solid",
      borderWidth: 0,
      borderRadius: 0,
      borderColor: "#091540",
      backgroundColor: "transparent",
    },
    heading: {
      width: "100%",
      textAlign: "left",
      fontSize: 14,
      fontWeight: 600,
      color: "#0c7b93",
      lineHeight: 1.5,

      borderStyle: "solid",
      borderWidth: 0,
      borderRadius: 0,
      borderColor: "#091540",
      backgroundColor: "transparent",
    },
    label: {
      textAlign: "left",
      fontSize: 12,
      fontWeight: 300,
      color: "#999",
      lineHeight: 1,

      borderStyle: "solid",
      borderWidth: 0,
      borderRadius: 0,
      borderColor: "#091540",
      backgroundColor: "transparent",
    },
    button: {
      width: 150,
      height: 40,

      fontSize: 12,
      fontWeight: 300,
      color: "#ffffff",
      textAlign: "center",
      textTransform: "none",

      borderStyle: "solid",
      borderWidth: 1,
      borderRadius: 0,
      borderColor: "#091540",
      backgroundColor: "#091540",

      /* color: "#ffff",
      cursor: "pointer",
      border: "1px solid #010A43",
      padding: "10px 0",
      fontSize: "12px",
      variant: "filled",
      background: "#010A43",
      "&:hover": {
        color: "#010A43",
      },
      "&:disabled": {
        color: "#ffff",
      }, */
    },
  };
};

export const defaultData = {
  address: [
    {
      name: "street",
      placeholder: "Enter text here",
    },
  ],
  currency: [
    {
      name: "NGN",
    },
    {
      name: "USD",
    },
    {
      name: "EUR",
    },
  ],
  checkbox: [
    {
      value: "option 1",
      checked: false,
      id: new Date().getTime(),
    },
  ],
  radio: [
    {
      value: "option 1",
      checked: false,
      id: new Date().getTime(),
    },
  ],
  slider: [
    {
      value: 0,
      label: "0",
    },
    {
      value: 100,
      label: "100",
    },
  ],
  video: [],
  image: [],
  text: [],
  pageBreak: [],
  form: [],
  inputText: [],
  textArea: [],
  heading: [],
  signature: [],
  userPicker: [],
  fileUpload: [],
  dateTime: [],
  phoneNumber: [],
  dropdown: [],
  toggle: [],
  actionButton: [],
  submitButton: [],
  decisionButton: [],
  table: {
    columns: [],
    rows: [],
  },
  inputTable: [],
  header: [],
};

// export default defaultStyles;
