import {
  ClickAwayListener,
  Paper,
  Popper,
  Typography,
} from "@material-ui/core";
import { useRef, useState } from "react";
import { LuFilter } from "react-icons/lu";

const FilterElement = ({ filterFunc, itemArr, classes }) => {
  const filAnchorRef = useRef(null);
  const [openFil, setOpenFil] = useState(false);

  const handleFiltClose = (event) => {
    if (filAnchorRef.current && filAnchorRef.current.contains(event.target)) {
      return;
    }

    setOpenFil(false);
  };
  const handleFilterToggle = () => {
    setOpenFil((prevOpen) => {
      return !prevOpen;
    });
  };
  const handleFilterItemClick = (item) => {
    filterFunc(item);
    setOpenFil(false);
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
        ref={filAnchorRef}
        onClick={handleFilterToggle}
      >
        <Typography
          style={{ margin: "10px 0", fontSize: "16px", fontWeight: "500" }}
        >
          Filter
        </Typography>
        <LuFilter size={18} />
      </div>
      <Popper
        open={openFil}
        anchorEl={filAnchorRef.current}
        style={{ zIndex: 50 }}
      >
        <Paper elevation={3} style={{ paddingTop: "5px" }}>
          <ClickAwayListener onClickAway={handleFiltClose}>
            <div>
              <div style={{ margin: "1rem 2rem", width: "fit-content" }}>
                <Typography
                  onClick={(e) => {
                    return handleFilterItemClick({
                      name: "All",
                      filterType: "all",
                    });
                  }}
                  style={{ padding: "6px 10px 6px 1px" }}
                  className={classes.item}
                >
                  Undo filter
                </Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "15px",
                  borderRadius: "8px",
                  alignItems: "flex-start",
                  padding: "12px 21px",
                  overflow: "auto",
                  maxHeight: "200px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography variant="body2" style={{ color: "darkgray" }}>
                    Category-----
                  </Typography>
                  <div>
                    {itemArr?.map((item, index) => {
                      return (
                        <Typography
                          key={index}
                          style={{
                            margin: "10px 0px",
                            padding: "5px 10px 5px 1px",
                          }}
                          onClick={(e) => {
                            return handleFilterItemClick({
                              ...item,
                              filterType: "category",
                            });
                          }}
                          className={classes.item}
                          data-testid={`${item?.name} ${index + 1}`}
                        >
                          {item?.name}
                        </Typography>
                      );
                    })}
                  </div>{" "}
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography variant="body2" style={{ color: "darkgray" }}>
                    Status-----
                  </Typography>
                  <div>
                    <Typography
                      style={{
                        margin: "10px 0px",
                        padding: "5px 10px 5px 1px",
                      }}
                      onClick={(e) => {
                        return handleFilterItemClick({
                          status: "pending",
                          filterType: "status",
                        });
                      }}
                      className={classes.item}
                    >
                      {"Pending"}
                    </Typography>
                    <Typography
                      style={{
                        margin: "10px 0px",
                        padding: "5px 10px 5px 1px",
                      }}
                      onClick={(e) => {
                        return handleFilterItemClick({
                          status: "in-progress",
                          filterType: "status",
                        });
                      }}
                      className={classes.item}
                    >
                      {"In-progress"}
                    </Typography>
                    <Typography
                      style={{
                        margin: "10px 0px",
                        padding: "5px 10px 5px 1px",
                      }}
                      onClick={(e) => {
                        return handleFilterItemClick({
                          status: "completed",
                          filterType: "status",
                        });
                      }}
                      className={classes.item}
                    >
                      {"Completed"}
                    </Typography>
                  </div>{" "}
                </div>
              </div>
            </div>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </div>
  );
};

export default FilterElement;
