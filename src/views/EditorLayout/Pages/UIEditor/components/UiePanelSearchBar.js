import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import searchInputIcon from "../../../../../assets/images/search-input-icon.svg";

const useStyles = makeStyles((theme) => ({
  formTextField: {
    fontStyle: "normal",
    display: "flex",
    border: "1px solid #424874",
    "& .MuiOutlinedInput-adornedEnd": {
      paddingRight: 0,
    },
    "& .MuiOutlinedInput-adornedStart": {
      paddingLeft: 0,
    },
  },
  closeButton: {
    color: "#010A43",
  },
  input: {
    color: "#ABB3BF",
    fontSize: 12,
  },
}));

const UiePanelSearchBar = ({
  size = "small",
  placeholder = "Search components...",
  type = "text",
  name = "searchComponent",
  setSearch = null,
}) => {
  const classes = useStyles();
  const [searchText, setSearchText] = useState("");

  const _setSearchText = (txt) => {
    setSearchText(txt);
    setSearch(txt);
  };

  return (
    <div className="app-search-bar _editor">
      {!searchText.length && <img src={searchInputIcon} alt="search" />}
      <TextField
        name={name}
        type={type}
        variant="outlined"
        placeholder={placeholder}
        value={searchText}
        onChange={(e) => _setSearchText(e.target.value)}
        style={{ flex: 1 }}
        autoComplete="off"
        autoCorrect="off"
        inputProps={{
          autoComplete: "new-password",
          form: {
            autoComplete: "off",
          },
        }}
      />
      {!!searchText.length && (
        <img
          src={searchInputIcon}
          alt="search"
          onClick={(e) => _setSearchText("")}
          style={{ cursor: "pointer" }}
        />
      )}
    </div>
  );
};

export default UiePanelSearchBar;
