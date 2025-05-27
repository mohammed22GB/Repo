import { allOperators } from "../EditorLayout/Pages/Workflow/components/utils/constants";

const convertString = (str) => {
  //console.log(str);
  //debugger;
  if (Array.isArray(str)) {
    str = str[str?.length - 1] ?? "";
  }
  // Convert to boolean
  if (str?.toLowerCase() === "true") return true;
  if (str?.toLowerCase() === "false") return false;

  // Convert to number
  const num = Number(str);
  if (!isNaN(num)) return num;

  // Return original string as default
  return str?.toLowerCase();
};
const convertUndefined = (str) => {
  return str === undefined || str === null || str === "";
};

export const manageLogicalOperators = (
  operator,
  inputOne,
  inputTwo,
  conditionals,
  type
) => {
  if (conditionals !== true || type === "form") return true;
  switch (operator) {
    case allOperators.EQUALS:
      return convertString(inputOne) === convertString(inputTwo);
    case allOperators.NOT_EQUALS:
      return convertString(inputOne) !== convertString(inputTwo);

    case allOperators.GREATER_THAN:
      return convertString(inputOne) > convertString(inputTwo);
    case allOperators.GREATER_THAN_OR_EQUALS:
      return convertString(inputOne) >= convertString(inputTwo);
    case allOperators.LESS_THAN:
      return convertString(inputOne) < convertString(inputTwo);
    case allOperators.LESS_THAN_OR_EQUALS:
      return convertString(inputOne) <= convertString(inputTwo);

    case allOperators.IS_EMPTY:
      return !inputOne;
    case allOperators.NOT_EMPTY:
      return !!inputOne;

    default:
      return false;
  }
};
