import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@material-ui/core";

import { handleSelectedSort } from "./util/logics";
import filterIcon from "../../../../assets/images/file-icon.svg";
import sortIcon from "../../../../assets/images/sort-icon.svg";
import {
  SELECTED_CATEGORY,
  SELECTED_SORT,
} from "../../../../store/actions/appsActions";

const useStyles = makeStyles((theme) => ({
  root: {
    // marginRight: theme?.spacing(1)
  },
  filterLabel: {
    background: "#E7E9EE",
    padding: "6.5px 10px 6px",
    border: "1px solid #ABB3BF",
    borderRight: "none",
    borderRadius: "3px 0 0 3px",
    color: "#091540",
    fontSize: 12,
  },
  selectMenu: {
    border: "none",
    boxShadow: "none",
  },
  buttonStyle: {
    textTransform: "none",
    color: "#2457C1",
    fontSize: 12,
    border: "solid 1px",
    borderRadius: 5,
    boxShadow: "0px 4px 10px 1px #2B2D4240",
    width: 90,
  },
}));

const FilterBar = (props) => {
  const classes = useStyles();
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("Last modified");
  const {
    appsReducer: { appsAndTemplatesData },
  } = useSelector((state) => state);
  const dispatch = useDispatch();

  const filterOptions = props?.filterOptions || [
    ["AG", "All Categories"],
    ["MC", "HR"],
    ["GV", "Finance & Ops"],
    ["IT", "Sales"],
  ];

  const sortOptions = [
    ["AZ", "A - Z"],
    ["ZA", "Z - A"],
    ["new", "Last modified"],
  ];

  const handleFilter = (event) => {
    event.persist();
    // setCategory(() => event.target.value);
    dispatch({ type: SELECTED_CATEGORY, payload: event.target.value });
  };

  const handleSort = (event) => {
    event.persist();
    setSort(() => event.target.value);
    handleSelectedSort({
      selectedSort: event.target.value,
      dispatch,
    });
    dispatch({ type: SELECTED_SORT, payload: event.target.value });
  };

  return (
    <div>
      {" "}
      {/*  style={{ margin: "30px 0" }}> */}
      <Grid container alignItems="center" justifyContent="flex-end" spacing={1}>
        <Grid item>
          <Button className="filter-bar-btn">
            Filter{" "}
            <img src={filterIcon} alt="filter" style={{ marginLeft: 5 }} />
          </Button>
        </Grid>

        <Grid item>
          <Button className="filter-bar-btn">
            Sort by <img src={sortIcon} alt="sort" style={{ marginLeft: 5 }} />
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default FilterBar;
