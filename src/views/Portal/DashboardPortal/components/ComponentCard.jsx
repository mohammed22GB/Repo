import { Skeleton } from "@mui/material";
import { makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  componentWidth: {
    display: "flex",
    flexDirection: "column",
    padding: "24px",
    gap: "18px",
    borderRadius: "10px",
    background: "#FFFFFF",
    minHeight: "100%",
    overflowY: "auto",
    width: (props) => props.laptopWidthMD,
    "@media (max-width: 1200px)": {
      width: (props) => props.laptopWidthSM,
    },
    "@media (max-width: 1170px)": {
      maxHeight: "18rem",
    },
    "@media (max-width: 800px)": {
      width: "99% !important",
    },
  },
}));

const ComponentCard = ({
  isLoading,
  title,
  Body,
  laptopWidthSM,
  laptopWidthMD,
  SideElement,
}) => {
  const classes = useStyles({ laptopWidthMD, laptopWidthSM });
  return (
    <div className={classes.componentWidth}>
      <div
        style={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          noWrap
          style={{
            width: "100%",
            fontWeight: "500",
            fontSize: "22px",
            overflow: "unset",
          }}
        >
          {title}
        </Typography>
        {SideElement && <SideElement />}
      </div>
      {isLoading ? (
        <>
          <Skeleton width="90%" height="40px" />
          <Skeleton width="90%" height="40px" />
          <Skeleton width="90%" height="40px" />
          <Skeleton width="90%" height="40px" />
        </>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "24px",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Body />
          </div>
        </>
      )}
    </div>
  );
};

export default ComponentCard;
