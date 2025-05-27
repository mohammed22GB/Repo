export const errorTexts = {
  email: "Email inputs only",
  number: "Number input only",
  url: "Url inputs only",
  password: "Password inputs only",
  text: "",
};

export const validateEmail = (input) => {
  // const lessFlexible = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  // const tooFlexible = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

  const emailRegex = /^[a-zA-Z0-9._!%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(input);
};
export const validateNumber = (input) => {
  const numRegex = /^[-+]?[0-9]+$/;
  return numRegex.test(input);
};

export const validatePassword = (input) => {
  const passwordRegex =
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
  return passwordRegex.test(input);
};

export const validateURL = (input) => {
  const strongRegex =
    /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

  const urlRegex =
    /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;
  return urlRegex.test(input);
};

export const validateUIEInputs = (input) => {
  const forbiddenCharsRegex = /[{}|]/;
  const testInput = forbiddenCharsRegex.test(input);
  const notAcceptedChar = input.match(forbiddenCharsRegex);

  return {
    status: testInput,
    characterValue: testInput ? notAcceptedChar : null,
  };
};
