import {
  APPLICATION_SET_STATUS,
  APPLICATION_SHOW_DIALOG,
  ADD_INVOICETABLE_BACK_COLOR,
  ADD_INVOICETABLE_BORDER_COLOR,
  ADD_FILE_UPLOAD_LAYOUT,
  ADD_FILE_UPLOAD_COLOR,
  ADD_HIDE_LABEL,
  ADD_LABEL_NAME,
  ADD_LABEL_NAME_TEXT_STYLE,
  ADD_LABEL_NAME_TEXT_NAME,
  ADD_LABEL_NAME_TEXT_COLOR,
  ADD_FILE_PREFERENCE_TEXT,
  ADD_FILE_UPLOAD_FROM,
  ADD_LABEL_NAME_TEXT_SIZE,
  ADD_HIDE_TOOL_TIP,
  ADD_FILE_TOOLTIP_TEXT,
  ADD_HIDE_INVOICETABLE_LABEL,
  EDITOR_SHOW_RIGHT_SIDEBAR,
  PLUG_BACKEND_UPDATE_ERROR_BANK,
  SET_PAGE_SEARCH_TEXT,
  EDITOR_SET_LOADING_RIGHT_SIDEBAR,
  EDITOR_SET_ERROR_LOADING_RIGHT_SIDEBAR,
} from "../actions/actionTypes";

const initialState = {
  appStatus: {
    type: "info", //  "info" | "success" | "warning" | "error"
    message: "",
  },
  showDialog: {
    status: false,
    type: "info",
    message: "Are you sure you want to take this action?",
    messageNewLine: "This action can not be undone.",
    trueButt: "Yes",
    falseButt: "No",
    hasCloseButton: true,
    clickBackdropToClose: true,
  },

  hide_invoicetable_label: true,
  completed: false,
  content: "filled",
  color: "#010A43",
  hide_label: true,
  label_name: "Enter Label Name",
  label_name_text_style: "Light",
  file_label_color: "",
  file_preference_text: "Click to upload file",
  file_upload_from: "",
  file_tooltip_text: "Enter your tooltip text",

  hiddenRightSideBar: true,
  loadingRightSideBar: false,
  erroLoadingRightSideBar: false,

  plugBackendUpdateErrorBank: {},
  pageSearchText: "",
};

export const reducers = (state = initialState, action) => {
  switch (action.type) {
    case ADD_HIDE_INVOICETABLE_LABEL: {
      const { hide_invoicetable_label } = action.payload;
      return {
        ...state,
        hide_invoicetable_label,
        completed: false,
      };
    }

    case ADD_INVOICETABLE_BORDER_COLOR: {
      const { border_color, identity } = action.payload;
      return {
        ...state,
        border_color,
        identity,
        completed: false,
      };
    }

    case ADD_INVOICETABLE_BACK_COLOR: {
      const { background_color, identity } = action.payload;
      return {
        ...state,
        background_color,
        identity,
        completed: false,
      };
    }

    case ADD_FILE_UPLOAD_LAYOUT: {
      const { content } = action.payload;
      return {
        ...state,
        content,
        completed: false,
      };
    }

    case ADD_FILE_UPLOAD_COLOR: {
      const { color } = action.payload;
      return {
        ...state,
        color,
        completed: false,
      };
    }

    case ADD_HIDE_LABEL: {
      const { hide_label } = action.payload;
      return {
        ...state,
        hide_label,
        completed: false,
      };
    }

    case ADD_LABEL_NAME: {
      const { label_name } = action.payload;
      return {
        ...state,
        label_name,
        completed: false,
      };
    }

    case ADD_LABEL_NAME_TEXT_SIZE: {
      const { label_name_text_size } = action.payload;
      return {
        ...state,
        label_name_text_size,
        completed: false,
      };
    }

    case ADD_LABEL_NAME_TEXT_STYLE: {
      const { label_name_text_style } = action.payload;
      return {
        ...state,
        label_name_text_style,
        completed: false,
      };
    }

    case ADD_LABEL_NAME_TEXT_NAME: {
      const { label_name_text_align } = action.payload;
      return {
        ...state,
        label_name_text_align,
        completed: false,
      };
    }

    case ADD_LABEL_NAME_TEXT_COLOR: {
      const { file_label_color } = action.payload;
      return {
        ...state,
        file_label_color,
        completed: false,
      };
    }

    case ADD_FILE_PREFERENCE_TEXT: {
      const { file_preference_text } = action.payload;
      return {
        ...state,
        file_preference_text,
        completed: false,
      };
    }

    case ADD_FILE_UPLOAD_FROM: {
      const { file_upload_from } = action.payload;
      return {
        ...state,
        file_upload_from,
        completed: false,
      };
    }

    case ADD_HIDE_TOOL_TIP: {
      const { hide_tool_tip } = action.payload;
      return {
        ...state,
        hide_tool_tip,
        completed: false,
      };
    }

    case ADD_FILE_TOOLTIP_TEXT: {
      const { file_tooltip_text } = action.payload;
      return {
        ...state,
        file_tooltip_text,
        completed: false,
      };
    }

    case EDITOR_SHOW_RIGHT_SIDEBAR: {
      const status = action.payload;
      return {
        ...state,
        hiddenRightSideBar: status,
      };
    }

    case EDITOR_SET_ERROR_LOADING_RIGHT_SIDEBAR: {
      const status = action.payload;
      return {
        ...state,
        erroLoadingRightSideBar: status,
      };
    }

    case EDITOR_SET_LOADING_RIGHT_SIDEBAR: {
      const status = action.payload;
      return {
        ...state,
        loadingRightSideBar: status,
      };
    }

    case APPLICATION_SET_STATUS: {
      const status = action.payload;
      return {
        ...state,
        appStatus: status,
      };
    }

    case APPLICATION_SHOW_DIALOG: {
      const status = action.payload;
      return {
        ...state,
        showDialog: status,
      };
    }

    case PLUG_BACKEND_UPDATE_ERROR_BANK: {
      const payload = action.payload;
      return {
        ...state,
        plugBackendUpdateErrorBank: payload,
      };
    }

    case SET_PAGE_SEARCH_TEXT: {
      const payload = action.payload;
      return {
        ...state,
        pageSearchText: payload,
      };
    }

    default:
      return state;
  }
};
