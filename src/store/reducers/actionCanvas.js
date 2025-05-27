/* eslint-disable default-case */
import {
  UPDATE_PROP,
  ACTIVATE_CANVAS,
  SAVE_CANVAS,
  UIEDITOR_REGISTER_POSITION,
} from "../actions/actionTypes";

const activeCanvasElement = {};
const layoutCanvas = {};

export const activeCanvas = (state = activeCanvasElement, action) => {
  switch (action.type) {
    case UPDATE_PROP: {
      const { action: k, value } = action.payload;
      return {
        ...state,
        data: {
          ...state.data,
          [k]: value,
        },
      };
    }

    case ACTIVATE_CANVAS: {
      const { componentType, data } = action.payload;

      return {
        componentType,
        data,
      };
    }

    default:
      return state;
  }
};
export function canvasLayout(state = layoutCanvas, action) {
  switch (action.type) {
    case SAVE_CANVAS: {
      const { workspaceId, layout } = action.payload;
      return {
        ...state,
        workspaceId,
        layout,
      };
    }
    default:
      return state;
  }
}

export function canvasRegisterPosition(state = layoutCanvas, action) {
  switch (action.type) {
    case UIEDITOR_REGISTER_POSITION: {
      const { workspaceId, layout } = action.payload;
      return {
        ...state,
        workspaceId,
        layout,
      };
    }
    default:
      return state;
  }
}
