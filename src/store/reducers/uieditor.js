import {
  UIEDITOR_SET_DROPZONE,
  UIEDITOR_LOAD_SCREEN_STYLE,
  UIEDITOR_LOAD_CUSTOM_ELEMENTS,
  UIEDITOR_SET_ZOOM_LEVEL,
  DISPLAY_TABLE_COLUMN,
  // Component Styles
  UIEDITOR_COMPONENT_STYLE_CHANGE,
  UIEDITOR_TOGGLE_FULLSCREEN,
  UIEDITOR_SET_DRAG_START,
  UIEDITOR_SET_CANVAS_STRUCTURE,
  UIEDITOR_SET_ACTIVE_ITEM,
  UIEDITOR_SET_SCREENS_ITEMS,
  UIEDITOR_SET_SEARCHED_ELEMENTS,
  UIEDITOR_SET_CANVAS_MODE,
} from "../actions/actionTypes";
import { manageAppLocalStorage } from "../../views/common/helpers/helperFunctions";

const uieCanvasMode = manageAppLocalStorage("get", null, "uieCanvasMode");
const currentScreenStyles = manageAppLocalStorage("get", null, "screenStyles");

export const uieditor = (
  state = {
    canvasActivity: {},
    activityHistory: [],
    undoMode: false,
    undoCursor: -1,
    uiEditorFullScreen: false,
    screenStyles: currentScreenStyles || {},
    displayTableColumn: false,
    dropZone: {},
    droppedPos: { id: null, pos: null },

    screensItems: {},
    canvasStructure: {},
    dragStart: {},
    activeItem: {},
    uieCanvasMode,
    storedSearchedElements: [],

    zoomLevel: 100,
    componentsSelection: { activeComponents: {}, mode: "none" },
  },
  action
) => {
  switch (action.type) {
    case UIEDITOR_SET_DROPZONE: {
      const dropZone = action.payload;
      return {
        ...state,
        dropZone,
      };
    }

    case UIEDITOR_LOAD_SCREEN_STYLE: {
      const style = action.payload;
      return {
        ...state,
        screenStyles: style,
      };
    }

    case UIEDITOR_LOAD_CUSTOM_ELEMENTS: {
      const customElements = action.payload;
      return {
        ...state,
        customElements,
      };
    }

    case UIEDITOR_SET_ZOOM_LEVEL: {
      const zoomLevel = action.payload;
      return {
        ...state,
        zoomLevel,
      };
    }

    case UIEDITOR_SET_ACTIVE_ITEM: {
      const activeItem = action.payload;
      return {
        ...state,
        activeItem,
      };
    }

    case UIEDITOR_SET_CANVAS_MODE: {
      const uieCanvasMode = action.payload;
      return {
        ...state,
        uieCanvasMode,
      };
    }

    case UIEDITOR_SET_SEARCHED_ELEMENTS: {
      const storedSearchedElements = action.payload;
      return {
        ...state,
        storedSearchedElements,
      };
    }

    case UIEDITOR_COMPONENT_STYLE_CHANGE: {
      const canvasItems = action.payload;
      return {
        ...state,
        canvasItems,
      };
    }

    case UIEDITOR_TOGGLE_FULLSCREEN: {
      const uiEditorFullScreen = action.payload;
      return {
        ...state,
        uiEditorFullScreen,
      };
    }

    case DISPLAY_TABLE_COLUMN: {
      return {
        ...state,
        displayTableColumn: action?.payload,
      };
    }

    case UIEDITOR_SET_CANVAS_STRUCTURE: {
      return {
        ...state,
        canvasStructure: action?.payload,
      };
    }

    case UIEDITOR_SET_SCREENS_ITEMS: {
      return {
        ...state,
        screensItems: action?.payload,
      };
    }

    case UIEDITOR_SET_DRAG_START: {
      return {
        ...state,
        dragStart: action?.payload,
      };
    }

    default:
      return state;
  }
};
