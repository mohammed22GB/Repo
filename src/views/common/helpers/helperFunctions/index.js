import { merge } from "lodash";
import {
  rSetDialog,
  setApplicationStatus,
  updateBackendErrorBank,
} from "../../../../store/actions/properties";
import { defaultFormStyles } from "../../../EditorLayout/Pages/UIEditor/utils/defaultFormStyles";
import {
  defaultStyles,
  getDefaultValues,
} from "../../../EditorLayout/Pages/UIEditor/utils/defaultScreenStyles";
import { unprotectedUrls } from "../../utils/lists";
import {
  WORKFLOWS_TASK_APPROVAL,
  WORKFLOWS_TASK_COMPUTATION,
  WORKFLOWS_TASK_DATA,
  WORKFLOWS_TASK_DOCUMENT,
  WORKFLOWS_TASK_END,
  WORKFLOWS_TASK_MAIL,
  WORKFLOWS_TASK_SCREEN,
  WORKFLOWS_TASK_START,
} from "../../../EditorLayout/Pages/Workflow/components/utils/taskTypes";

export const SetAppStatus =
  ({ type, msg }) =>
  (dispatch) => {
    SetAppStatus.settingTimeOut = SetAppStatus.settingTimeOut || undefined;

    msg = msg === "undefined" ? "" : msg;

    dispatch(setApplicationStatus(type, msg));
    clearTimeout(SetAppStatus.settingTimeOut);
    if (type !== "loading" && msg !== "...") {
      SetAppStatus.settingTimeOut = setTimeout(() => {
        dispatch(setApplicationStatus("info", ""));
      }, 4000);
    }
  };

export const logEndpointError =
  (
    section,
    action,
    resource,
    hostFunc,
    func,
    dispatcher,
    msg,
    callback,
    { id: resourceId, ...data }
  ) =>
  async (dispatch, getState) => {
    const { plugBackendUpdateErrorBank } = getState().reducers;

    const newUpdates = { ...data };

    const updatedErrorBank = {
      ...plugBackendUpdateErrorBank,
      [section]: {
        ...(plugBackendUpdateErrorBank?.[section] || {}),
        [resource]: {
          ...(plugBackendUpdateErrorBank?.[section]?.[resource] || {}),
          [resourceId]: {
            ...(plugBackendUpdateErrorBank?.[section]?.[resource]?.[
              resourceId
            ] || {}),
            payload: {
              ...(plugBackendUpdateErrorBank?.[section]?.[resource]?.[
                resourceId
              ]?.payload || {}),
              ...newUpdates,
            },
            hostFn: hostFunc,
            fn: func,
            dispatcher,
            msg,
            callback,
            ts: new Date(),
          },
        },
      },
    };

    !!Object.keys(data)[0] &&
      dispatch(updateBackendErrorBank(updatedErrorBank));
  };

export const updateEndpointError =
  (section, action, resource, { id: resourceId, ...data }) =>
  async (dispatch, getState) => {
    const { plugBackendUpdateErrorBank: currentStatus } = getState().reducers;

    // delete currentStatus[`${resource}.${resourceId}.${Object.keys(data)[0]}`];
    Object.keys(data).forEach((key) => {
      delete currentStatus?.[section]?.[resource]?.[resourceId]?.payload?.[key];
    });

    if (
      !Object.keys(
        currentStatus?.[section]?.[resource]?.[resourceId]?.payload || {}
      ).length
    ) {
      delete currentStatus?.[section]?.[resource]?.[resourceId];
      if (!Object.keys(currentStatus?.[section]?.[resource] || {}).length) {
        delete currentStatus?.[section]?.[resource];
        if (!Object.keys(currentStatus?.[section] || {}).length) {
          delete currentStatus?.[section];
        }
      }
    }

    !!Object.keys(data)[0] && dispatch(updateBackendErrorBank(currentStatus));
  };

export const wrapAPI =
  (func, msg, ...args) =>
  async (dispatch) => {
    const logFunction = () => {
      /* dispatch(
        logEndpointError(
          args?.[0]?.requestSource || "UI Editor",
          "update",
          args?.[0]?.category,
          wrapAPI,
          func,
          "function",
          msg,
          args?.[0]?.apiCallback,
          ...args
        )
      ); */

      dispatch(
        logEndpointError(
          args?.[0]?.requestSource || "Workflow Editor",
          "update",
          args?.[0]?.category,
          wrapDebounceAPI,
          func,
          "function",
          msg,
          args?.[0]?.apiCallback,
          ...args
        )
      );
    };

    args[0].logFunction = logFunction;

    dispatch(SetAppStatus({ type: "info", msg: "..." }));
    try {
      const resp = await func(...args);

      if (resp?.success || resp?._meta?.success) {
        dispatch(SetAppStatus({ type: "info", msg: msg }));

        //  update endpoint error log
        if (!args?.[0]?.noLogError) {
          dispatch(
            updateEndpointError(
              args?.[0]?.requestSource || "UI Editor",
              "update",
              args?.[0]?.category,
              ...args
            )
          );
        }
      } else {
        dispatch(SetAppStatus({ type: "error", msg: `${resp.data}` }));

        //  add to endpoint error log
        if (!args?.[0]?.noLogError) {
          logFunction();
        }
      }

      return resp;
    } catch (err) {
      return { data: err };
    }
  };

export const wrapDebounceAPI =
  (func, msg, ...args) =>
  async (dispatch) => {
    dispatch(SetAppStatus({ type: "info", msg: "..." }));

    const resp = await func(...args);

    if (resp?.success || resp?._meta?.success || resp?.data?._meta?.success) {
      dispatch(SetAppStatus({ type: "info", msg: msg }));

      if (!args?.[0]?.noLogError) {
        dispatch(
          updateEndpointError(
            "Workflow Editor",
            "update",
            args?.[0]?.category,
            ...args
          )
        );
      }
    } else {
      dispatch(SetAppStatus({ type: "error", msg: `${resp?.data}` }));

      if (!args?.[0]?.noLogError) {
        dispatch(
          logEndpointError(
            "Workflow Editor",
            "update",
            args?.[0]?.category,
            wrapDebounceAPI,
            func,
            "function",
            msg,
            args?.[0]?.callback,
            ...args
          )
        );
      }

      return;
    }
    args?.[0]?.callback && args?.[0]?.callback(resp);
  };

export const manageAppLocalStorage = (action, appId, ppty, value) => {
  const localStorageableProperties = [
    "app",
    "activeScreen",
    "activeWorkflow",
    "screenStyles",
    "uieCanvasMode",
    "isNew",
    "canvasPositioning",
  ];
  if (!localStorageableProperties.includes(ppty)) {
    return null;
  }

  if (!appId) {
    const url = window.location.pathname;
    const pathsections = url.split("/");
    if (pathsections.length === 4 && pathsections[1] === "editor") {
      appId = pathsections[2];
    } else {
      return false;
    }
  }

  const retrieved = localStorage.getItem("plug_app_meta_data");
  const alldata = retrieved ? JSON.parse(retrieved) : {};
  let data = alldata?.[appId] || {};

  switch (action) {
    case "set":
      data[ppty] = value;
      alldata[appId] = data;
      break;

    case "get":
      return data[ppty];

    case "clear":
      delete alldata[appId];
      break;

    default:
      return null;
  }

  const stored = JSON.stringify(alldata);
  localStorage.setItem("plug_app_meta_data", stored);
};

export const showAppDialog =
  (params = {}) =>
  (dispatch, getState) => {
    const state = getState().reducers;
    const { showDialog } = state;
    const { status = true } = params;

    const newStatus = { ...showDialog, ...params, status };

    dispatch(rSetDialog(newStatus));
  };

export const getUieResultantStyles = (
  { style: elementStyles },
  { style: screenStyles }
) => {
  const defaultStyles1 = defaultStyles();
  const defaultStyles2 = defaultFormStyles;
  const stylesFromScreen = screenStyles?.page?.overrideDefault
    ? { ...screenStyles?.page }
    : {};
  const stylesFromState = elementStyles?.overrideDefault
    ? { ...elementStyles }
    : {};

  let combinedStyle = merge(defaultStyles1, defaultStyles2);
  combinedStyle = merge(combinedStyle, stylesFromScreen);
  combinedStyle = merge(combinedStyle, stylesFromState);

  return combinedStyle;
};

export const getUieResultantValues = (
  { values: elementValues },
  elementType,
  uieCanvasMode
) => {
  const valuesFromDefault = 0 //uieCanvasMode === APP_DESIGN_MODES.LIVE
    ? {}
    : { ...getDefaultValues(elementType, false) };
  const valuesFromState = { ...elementValues };
  const combinedValues = merge(valuesFromDefault, valuesFromState);

  return combinedValues;
};

export const getFieldValue = (e) => {
  return ["checkbox", "radio"].includes(e?.target?.type)
    ? e?.target.checked
    : e?.target?.value || typeof e?.target?.value === "string"
    ? e?.target?.value
    : e;
};

export const getFieldName = (e, ppty) => {
  return typeof ppty === "string" ? ppty : e?.target?.name;
};

export const convertCheckboxValues = (value, to) => {
  if (to === "array") {
    return Array.isArray(value) ? value : value?.split("; ");
  } else {
    return Array.isArray(value) ? value?.join("; ") : value;
  }
};

export const compareAppVersions = (version1, version2) => {
  const parseVersion = (versionString) => {
    const [major, minor, patch] = versionString.split(".").map(Number);
    return { major, minor, patch };
  };

  const v1 = parseVersion(version1);
  const v2 = parseVersion(version2);

  if (v1.major !== v2.major) {
    return v1.major - v2.major;
  }
  if (v1.minor !== v2.minor) {
    return v1.minor - v2.minor;
  }
  return v1.patch - v2.patch;
};

export const toNumber = (value) => {
  if (isNaN(value)) {
    return 0;
  }
  return Number(value);
};

export const logoutClearLocalStorage = (history, redirect = true) => {
  const rememberMe = localStorage.getItem("rememberMe");
  const ppdo = localStorage.getItem("plug-page-drawer-open");
  const lspk = localStorage.getItem("LOCAL_STORAGE_PWA_KEY");

  localStorage.clear();

  if (!!rememberMe || rememberMe === false) {
    localStorage.setItem("rememberMe", rememberMe);
  }
  if (!!ppdo || ppdo === false) {
    localStorage.setItem("plug-page-drawer-open", ppdo);
  }
  if (!!lspk || lspk === false) {
    localStorage.setItem("LOCAL_STORAGE_PWA_KEY", lspk);
  }

  sessionStorage.clear();

  if (redirect) {
    if (history) {
      history.push(unprotectedUrls.LOGIN);
    } else {
      window.location.href = unprotectedUrls.LOGIN;
    }
  }
};

export const setStateTimeOut = (setState, newVal, initialVal) => {
  setTimeout(() => {
    setState(newVal);
    setTimeout(() => setState(initialVal), 2900);
  }, 100);
};

export const isEmpty = (field) => {
  if (typeof field === "string") {
    field = field.trim();
  } else if (Array.isArray(field)) {
    field = field
      .map((element) =>
        typeof element === "string"
          ? element.trim()
          : !element
          ? ""
          : JSON.stringify(element)
      )
      .join("");
  } else if (typeof field === "object") {
    field = Object.keys(field).length;
  } else {
    return true;
  }
  return !field;
};

export const hasEmptyField = (fieldsObject) => {
  if (typeof fieldsObject !== "object") {
    return false;
  }
  if (Array.isArray(fieldsObject)) {
    return false;
  }

  return Object.keys(fieldsObject).some((key) =>
    Array.isArray(fieldsObject[key])
      ? !fieldsObject[key]?.length
      : !fieldsObject[key]
  );
};

export const concatParserItems = (itemArr) => {
  let content;
  if (Array.isArray(itemArr)) {
    content = itemArr
      .map((txt) =>
        typeof txt === "string"
          ? txt
          : Array.isArray(txt?.props?.children)
          ? txt?.props?.children[0]
          : typeof txt === "object"
          ? txt?.props?.children
          : []
      )
      .join("");
  } else if (typeof itemArr === "object" || itemArr?.props) {
    content = itemArr?.props?.children;
  } else {
    content = itemArr;
  }

  return content instanceof Number ? `${content}` : content;
};

export const separateNumbersWithComma1 = (text, formatText, values) => {
  text = concatParserItems(text);
  if (
    text === undefined ||
    text === null ||
    text === "" ||
    values?.inputType === "computed"
  ) {
    return text;
  }

  const stripRegex = `${text}`?.replace(/(\d{1,3}(?:,\d{3})+)/g, (match) =>
    match?.replace(/,/g, "")
  );
  if (values?.dataType === "inputTable") {
  }

  const stripRegex2 = stripRegex?.replace(/(\d+),(\d+)/g, (match) =>
    match?.replace(/,/g, "")
  );

  const newRegex = /(?<!@)\b\d{1,3}(?:\d{3})*\b(?!\s*\})/g;

  //const newRegex = /(?<!@)\b\d{1,3}(?:\d{3})*\b(?!\s*\}|\s})/g;
  if (values?.dataType === "inputTable") {
  }
  const formattedText =
    formatText !== false
      ? stripRegex2?.replace(newRegex, (match) => {
          if (/^0+$/.test(match)) {
            return match;
          }

          return parseInt(match)?.toLocaleString();
        })
      : text;
  return formattedText;
};

export const separateNumbersWithComma = (
  text,
  isFormattedText,
  isDocumentScreen
) => {
  if (!text || typeof text !== "string" || isDocumentScreen) {
    return text;
  }

  return text.replace(/\b(\d+)\b/g, (match, number, offset, string) => {
    // Extract context around the number
    const staffIdPatterns = ["staff id", "staff-id", "staffid"];

    let prevContext = text.slice(Math.max(0, offset - 1), offset);
    let nextContext = text.slice(
      offset + match.length,
      offset + match.length + 1
    );

    // Rule 1: Skip if adjacent to letters or special characters
    if (/[a-zA-Z\-\/\@\#\!\*\^]/.test(prevContext + match + nextContext)) {
      return match;
    }

    const precedingText = string
      .slice(Math.max(0, offset - 30), offset)
      .toLowerCase();
    if (
      staffIdPatterns.some((pattern) =>
        new RegExp(`${pattern}[,:. ][,:. ]?$`, "i").test(precedingText)
      )
    ) {
      return match;
    }

    // Rule 2: Skip numbers starting with '0', '+', or prefixed with 'N'
    if (
      /^[0+N]/.test(match) ||
      /^[0+N]/.test(prevContext + match + nextContext)
    ) {
      return match;
    }

    prevContext = text.slice(Math.max(0, offset - 10), offset);
    nextContext = text.slice(offset + match.length, offset + match.length + 10);
    // Rule 3: Four-digit number after month names
    const monthRegex =
      /\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s*[,:]*\s*$/i;
    if (monthRegex.test(prevContext) && match.length === 4) {
      return match;
    }

    // Rule 4: Number after text ending with 'id'
    const idRegex = /\b\w+id\s*[,:]*\s*$/i;
    if (idRegex.test(prevContext)) {
      return match;
    }

    // Add comma separators for numbers that pass all checks
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  });
};

export const getProcessTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins} mins`;
  } else {
    return `${hours} hrs, ${mins} mins`;
  }
};

export const returnLinkUrl = (url) => {
  try {
    const validUrl = new URL(url);
    return url;
  } catch (e) {
    return `https://${url}`;
  }
};

export const getProcessTimeBySeconds = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (minutes === 0) {
    return `${secs} secs`;
  } else if (hours === 0) {
    return `${mins} mins, ${secs} secs`;
  } else {
    return `${hours} hrs, ${mins} mins, ${secs} secs`;
  }
};

export const showTooltip = (stringText, num) => {
  if (!stringText) {
    return "";
  }
  return stringText?.length < num ?? 12 ? "" : stringText;
};

export const sliceContent = (stringText, num) => {
  if (!stringText) {
    return "--";
  }
  return `${stringText?.slice(0, num ?? 12)}${
    stringText?.length > num ?? 12 ? "..." : ""
  }`;
};

// Countdown function
export const secondsCountdown = (totalSeconds, onSecondsChange, onComplete) => {
  // Helper to format time
  function formatTime(minutes, seconds) {
    // const minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  }

  const endTime = Date.now() + totalSeconds * 1000;
  const interval = setInterval(() => {
    const timeRemaining = endTime - Date.now();

    if (timeRemaining <= 0) {
      clearInterval(interval);
      onComplete(false);
      return;
    }

    // Calculate minutes and seconds
    const minutes = Math.floor(timeRemaining / 1000 / 60);
    const seconds = Math.floor(timeRemaining / 1000) % 60;

    // Output formatted time
    onSecondsChange(formatTime(minutes, seconds));
  }, 1000);
  return interval;
};

export const base64ToJson = (base64String) => {
  const binString = atob(base64String);
  const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0));
  const json = new TextDecoder().decode(bytes);
  return JSON.parse(json);
};

export const isStringValidUrl = (text) => {
  const expression =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  const regex = new RegExp(expression);

  return text?.match(regex);
};

export function toolTipTitleReference(inputType) {
  switch (inputType) {
    case WORKFLOWS_TASK_SCREEN:
      return "Add a new screen or user interface to your application";

    case WORKFLOWS_TASK_MAIL:
      return "Send automated emails as part of your workflow to notify users";

    case WORKFLOWS_TASK_DATA:
      return "Connect and manage data sources within your workflow";

    case WORKFLOWS_TASK_APPROVAL:
      return "Add an approval step to your workflow for users to review and approve items";

    case WORKFLOWS_TASK_COMPUTATION:
      return "Perform computations and data processing tasks within your workflow";

    case WORKFLOWS_TASK_DOCUMENT:
      return "Attach or manage documents within your workflow";

    case WORKFLOWS_TASK_START:
      return "Begin your workflow process from this starting point";

    case WORKFLOWS_TASK_END:
      return "Marks the endpoint of your workflow process";

    default:
      return `Drag ${inputType} node unto the canvas`;
  }
}

export const filterDuplicateObjects = (arr, compareFunction, property) => {
  return arr?.filter((obj, index) => {
    let nextIndex = arr?.findIndex((nextObj, nextIndex) => {
      return nextIndex > index && compareFunction(nextObj, obj, property);
    });

    return nextIndex === -1;
  });
};
