import { MenuItem } from "@material-ui/core";
import Parser from "html-react-parser";
import { Parser as HotFormulaParser } from "hot-formula-parser";
import { APP_DESIGN_MODES, LOREM_IPSUM } from "./constants";
import { separateNumbersWithComma } from "../helpers/helperFunctions";

export const getValueBasedOnAppDesignMode = (
  values,
  appDesignMode,
  displayValue,
  dynamicContentObj,
  screenItems,
  capturedData
) => {
  /**
   * 
   * displayValue is a function.
   * dynamicContentObj is used for getting referenced dynamic content when the component is made dynamic
   * screenItems, captureData were introduced for formula builder implementation to calculate items on the current screen
   * 

  */
  if (appDesignMode === APP_DESIGN_MODES.PREVIEW) {
    const computedValue = getComputedValuePassedIntoFormulaBuilder(
      values,
      screenItems,
      capturedData
    );

    const previewValue = displayValue(computedValue) || LOREM_IPSUM;

    return Parser(previewValue);
  } else if (appDesignMode === APP_DESIGN_MODES.LIVE) {
    const computedValue = getComputedValuePassedIntoFormulaBuilder(
      values,
      screenItems,
      capturedData
    );
    const liveValue = searchAndReplace(computedValue, dynamicContentObj);

    return liveValue;
  } else if (appDesignMode === APP_DESIGN_MODES.EDIT) {
    const editValue = displayValue(values?.value || LOREM_IPSUM);

    return Parser(editValue);
  }
};

const getAnchorableTextAndConvertValidUrlToLink = (text) => {
  const validUrlRegex =
    /\b(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,256}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;

  const processText = (inputText) => {
    return inputText.replace(validUrlRegex, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });
  };

  const anchorRegex = /<a\b[^>]*>(.*?)<\/a>/gi;
  let result = "";
  let lastIndex = 0;

  text.replace(anchorRegex, (match, innerText, offset) => {
    result += processText(text.slice(lastIndex, offset)) + match;
    lastIndex = offset + match.length;
  });

  result += processText(text.slice(lastIndex));

  return Parser(result);
};

export const searchAndReplace = (
  value,
  dynamicContentObj,
  textOrField = "text"
) => {
  const text = value;

  if (text) {
    const newText =
      text?.replace(/(@[a-zA-Z0-9-_]+)/g, (match, offset, string) => {
        return `${dynamicContentObj?.[match]?.toString() || ""}`;
      }) || "";

    if (textOrField === "field" && text === newText) {
      return "";
    }

    //  display newlines accordingly
    const newLined = newText?.split("\n");

    const finalText =
      newLined?.length === 1
        ? getAnchorableTextAndConvertValidUrlToLink(newLined[0])
        : newLined?.map((text, index, theArray) => {
            // check if the text is inside an anchor tag
            const formattedText =
              getAnchorableTextAndConvertValidUrlToLink(text);

            return (
              <>
                {formattedText}
                {index < theArray.length - 1 ? <br /> : null}
              </>
            );
          });

    return finalText;
  }
};

export const dropdownContent = (
  { values, name, appDesignMode, trackLookupVal },
  dynamicContentObj,
  isDocument
) => {
  if (dynamicContentObj) {
    if (
      dynamicContentObj?.[name] &&
      typeof dynamicContentObj?.[name] === "object"
    ) {
      return dynamicContentObj?.[name]?.map((val, index) => {
        return (
          <MenuItem key={index} value={val}>
            {/* {val} */}{" "}
            {separateNumbersWithComma(val, values?.isFormatted, isDocument)}
          </MenuItem>
        );
      });
    } else if (name?.startsWith("@") && !dynamicContentObj?.[name]) {
      return null;
    } else {
      const duplicateLookup = values?.options?.find((opt) => {
        return opt?.dataText === trackLookupVal?.[trackLookupVal?.length - 1];
      });
      if (!duplicateLookup) {
        values.options = [
          ...(values?.options || []),
          ...trackLookupVal?.map((lookupVal) => {
            return {
              id: lookupVal,
              dataText: lookupVal,
            };
          }),
        ];
      }
      return values?.options?.map(({ dataText, dataValue }, i) => {
        return (
          <MenuItem
            key={i}
            value={values?.useValuesAttribute ? dataValue : dataText}
          >
            {/* {dataText} */}
            {separateNumbersWithComma(
              dataText,
              values?.isFormatted,
              isDocument
            )}
          </MenuItem>
        );
      });
    }
  } else {
    const duplicateLookup = values?.options?.find((opt) => {
      return opt?.dataText === trackLookupVal?.[trackLookupVal?.length - 1];
    });
    if (!duplicateLookup) {
      values.options = [
        ...(values?.options || []),
        ...trackLookupVal?.map((lookupVal) => {
          return {
            id: lookupVal,
            dataText: lookupVal,
          };
        }),
      ];
    }
    return values?.options.map(({ dataText, dataValue }, i) => {
      return (
        <MenuItem
          key={i}
          value={values?.useValuesAttribute ? dataValue : dataText}
        >
          {/* {dataText} */}
          {separateNumbersWithComma(dataText, values?.isFormatted, isDocument)}
        </MenuItem>
      );
    });
  }
};

export const convertValidUrlToClickableLink = (text) => {
  const arrayedText = Array.isArray(text) ? text : [text];

  // Function to validate if string  passed is a valid URL
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (e) {
      return false;
    }
  };

  return arrayedText.map((text, index) => {
    const validUrl = isValidUrl(text);

    return validUrl ? (
      <a href={text} key={index} target="_blank" rel="noopener noreferrer">
        {text}
      </a>
    ) : (
      text
    );
  });
};

export const getDynamicImageSrc = (dynamicContentObj, name, values) => {
  if (dynamicContentObj?.[name]) {
    return dynamicContentObj?.[name];
  }

  return values?.src || "/images/image-component.png";
};

export const autoCompleteDateTimeValues = (value) => {
  const timeRegex = /^T\d{2}:\d{2}$/.test(value);
  const dateRegex = /^(?:\d{4}-\d{2}-\d{2}|\d{2}-\d{2}-\d{4})T$/.test(value);
  const currentDate = new Date().toISOString().split("T")[0];

  if (timeRegex) {
    value = `${currentDate}${value}`;
  }

  if (dateRegex) {
    value = `${value}00:00`;
  }

  return value;
};

export const checkIfValueIsDateTimeValue = (value) => {
  const timeRegex = /^T\d{2}:\d{2}$/.test(value);
  const dateRegex = /^(?:\d{4}-\d{2}-\d{2}|\d{2}-\d{2}-\d{4})T$/.test(value);
  const dateTimeRegex = /^(?:\d{4}-\d{2}-\d{2}|\d{2}-\d{2}-\d{4})T\d{2}:\d{2}$/; //factoring in the MM-DD-YYYY format

  // Handle time format T00:00
  if (timeRegex) {
    // Use the current date if no date is provided
    const today = new Date().toISOString().split("T")[0];
    value = `${today}${value}`;
  } else if (dateRegex) {
    value = `${value}00:00`;
  }

  const passedRegex = dateTimeRegex.test(value);
  const millisecondsForOneDay = 1000 * 60 * 60 * 24; //value for one-day time in milliseconds

  if (passedRegex) {
    const isDate = new Date(value);
    const currentDayInMilliseconds = isDate.getTime();
    const calculatedMilliseconds =
      currentDayInMilliseconds / millisecondsForOneDay;

    return {
      isDateTime: true,
      dateTimeValue: calculatedMilliseconds,
    };
  } else {
    return {
      isDateTime: false,
      originalValue: value,
    };
  }
};

export const convertMillisecondsToTime = (milliseconds) => {
  const days = Math.floor(milliseconds);
  let hours = Math.floor((milliseconds - days) * 24);
  let minutes = Math.round(((milliseconds - days) * 24 - hours) * 60); // Round directly to avoid seconds.

  // Add minutes to hours if >= 60
  hours += Math.floor(minutes / 60);
  minutes = minutes % 60;

  const actualCalculatedDateTime = [];
  if (days > 0) {
    actualCalculatedDateTime.push(`${days} day${days > 1 ? "s" : ""}`);
  }
  if (hours > 0) {
    actualCalculatedDateTime.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  }
  if (minutes > 0) {
    actualCalculatedDateTime.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
  }

  return actualCalculatedDateTime.join(", ");
};

export const getComputedValuePassedIntoFormulaBuilder = (
  values,
  screenItems,
  capturedData
) => {
  const formulaParser = (expression) => {
    const parser = new HotFormulaParser();
    let triggerDateTime = false;

    const replacedExpression = expression?.replace(
      /\{\{([^\}\{]+)\}\}/g,
      (match, actualItemName) => {
        const item = screenItems?.find((screenItem) => {
          return screenItem?.name === actualItemName;
        });
        const value = capturedData?.[item?.id] ?? item?.values?.value;
        const isValidDateTime = checkIfValueIsDateTimeValue(value);

        if (isValidDateTime.isDateTime) {
          triggerDateTime = true;
          return isValidDateTime.dateTimeValue;
        } else {
          return isValidDateTime.originalValue ?? "";
        }
      }
    );

    const result = parser.parse(replacedExpression);
    const parsedResult = result?.result;

    return parsedResult !== null && parsedResult !== undefined
      ? `${
          triggerDateTime
            ? convertMillisecondsToTime(parsedResult)
            : parsedResult
        }`
      : replacedExpression;
  };

  const getMatchAndParse = () => {
    const parsedExpressionValue = values?.value?.replace(
      /\{\{([^\}\{]+)\}\}/g,
      (match, actualItemName) => {
        const uniqueValueItem = values?.computeConfigurations?.find(
          (computeConfig) => {
            return computeConfig?.key === match;
          }
        );

        const formulaToBeParsed = formulaParser(uniqueValueItem?.formula);

        return formulaToBeParsed;
      }
    );

    return parsedExpressionValue || "";
  };

  if (values?.useFormulaBuilder) {
    const finalValue = getMatchAndParse();

    return finalValue;
  } else if (values?.computed || values?.inputType === "computed") {
    const actualValue = formulaParser(values?.formulaBuilderExpression);

    return actualValue;
  } else {
    return values?.value;
  }
};
