import { SET_SORTPARAMS } from "../../../../../store/actions/appsActions";

export const handleSelectedSort = ({ selectedSort, dispatch }) => {
  let sortParams = {};

  switch (selectedSort) {
    case "A - Z":
      sortParams["name"] = "asc";
      break;

    case "Z - A":
      sortParams["name"] = "desc";
      break;

    case "Last modified":
      sortParams["updatedAt"] = "desc";
      break;

    default:
      sortParams["updatedAt"] = "desc";
      break;
  }
  dispatch({ type: SET_SORTPARAMS, payload: sortParams });
};
