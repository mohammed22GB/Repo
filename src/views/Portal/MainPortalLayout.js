import {
  ClickAwayListener,
  makeStyles,
  Paper,
  Popper,
  Typography,
} from "@material-ui/core";
import FilterElement from "./commonComponents/Filter";
import SortElement from "./commonComponents/Sort";

export const useStyles = makeStyles((theme) => {
  return {
    item: {
      cursor: "pointer",
      "&:hover": {
        background: "#DE54391F",
      },
    },

    container: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      background: "#FFFFFF",
      padding: "24px",
      borderRadius: "8px",
    },
    headerTitle: {
      cursor: "pointer",
    },
  };
});

const MainPortalLayout = (props) => {
  const {
    pageTitle,
    sortFunc,
    filterFunc,
    sortItems,
    filterItems,
    pageSubtitle,
    children,
  } = props;

  const classes = useStyles();

  return (
    <div className={`${classes.container} portal-main-layout`}>
      <div
        style={{
          display: "flex",
          gap: "3px",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "0px 10px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "2rem",
          }}
        >
          <Typography
            style={{
              fontSize: "22px",
              marginBottom: "16px",
              fontWeight: "500",
            }}
            noWrap
            component="div"
          >
            {pageTitle}
          </Typography>
          <Typography style={{ fontSize: "16px" }} component="div">
            {pageSubtitle}
          </Typography>
        </div>
        <div
          style={{
            display: "flex",
            gap: "25px",
            alignItems: "center",
          }}
        >
          {!!filterItems && (
            <FilterElement
              filterFunc={filterFunc}
              classes={classes}
              itemArr={filterItems}
            />
          )}

          {!!sortItems && (
            <SortElement
              sortFunc={sortFunc}
              classes={classes}
              itemArr={sortItems}
            />
          )}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
};
export default MainPortalLayout;
