import {
  FETCH_DATA_OWNER,
  SET_DATA_COLUMN,
  SHOW_FIELD,
  ADD_TO_DATA_COLUMN,
  SET_DATA_NAMES,
  SHOW_COLUMNBOX,
  SET_DATA_PERMS,
} from "../actions/dataAction";

const dataSheetState = {
  dataName: "",
  dataOwner: "",
  dataHeads: [
    //  consider moving this off here! to db or the data page
    {
      field: "name",
      headerName: "Name",
      type: "string",
      order: 1,
      editable: true,
      width: 180,
    },
    {
      field: "owner",
      headerName: "Owner",
      type: "string",
      order: 2,
      editable: false,
      width: 180,
    },
    {
      field: "created",
      headerName: "Created",
      type: "date",
      order: 3,
      editable: false,
      width: 180,
    },
  ],
  sheetsDataColumn: [],
  showFields: false,
  showColumnBox: false,
  columnTypes: ["string", "number", "date"],
  dataSheetNames: [],
  setSearchQuery: "",
  datasheetSearchQuery: "",
  permissions: {},
};

export const dataReducer = (state = dataSheetState, action) => {
  const { type, payload } = action;
  switch (type) {
    case FETCH_DATA_OWNER:
      return { ...state, dataOwner: payload };

    case SET_DATA_COLUMN:
      return { ...state, sheetsDataColumn: payload };

    case ADD_TO_DATA_COLUMN:
      return {
        ...state,
        sheetsDataColumn: [...state.sheetsDataColumn, payload],
      };

    case SHOW_FIELD:
      return { ...state, showFields: payload };

    case SHOW_COLUMNBOX:
      return { ...state, showColumnBox: payload };

    case SET_DATA_NAMES:
      return { ...state, dataSheetNames: payload };
    case SET_DATA_PERMS:
      //console.log(action.type, action.payload);
      return { ...state, permissions: payload };

    default:
      return state;
  }
};
