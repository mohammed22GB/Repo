import {
  ClickAwayListener,
  Paper,
  Popper,
  Typography,
} from "@material-ui/core";
import { IoFilterOutline } from "react-icons/io5";
import { useRef, useState } from "react";

const SortElement = ({ sortFunc, itemArr, classes }) => {
  const sortAnchorRef = useRef(null);
  const [openSort, setOpenSort] = useState(false);

  const handleSortClose = (event) => {
    if (sortAnchorRef.current && sortAnchorRef.current.contains(event.target)) {
      return;
    }
    setOpenSort(false);
  };

  const handleSortItemClick = (event, index) => {
    sortFunc(index);
    setOpenSort(false);
  };

  const handleSortToggle = () => {
    setOpenSort((prevOpen) => {return !prevOpen});
  };
  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "3px",
          alignItems: "center",
          cursor: "pointer",
        }}
        ref={sortAnchorRef}
        onClick={handleSortToggle}
      >
        <Typography
          noWrap
          style={{
            margin: "10px 0",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "500",
          }}
        >
          Sort by
        </Typography>
        <IoFilterOutline size={18} />
      </div>
      <Popper
        open={openSort}
        anchorEl={sortAnchorRef.current}
        style={{ zIndex: 50 }}
      >
        <Paper elevation={3} style={{ paddingTop: "5px" }}>
          <ClickAwayListener onClickAway={handleSortClose}>
            <div>
              {itemArr?.map((sortName, index) => {return (
                <Typography
                  key={index}
                  style={{
                    margin: "10px 0px",
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {return handleSortItemClick(e, index)}}
                  className={classes.item}
                >
                  {sortName}
                </Typography>
              )})}
            </div>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </div>
  );
};

export default SortElement;
