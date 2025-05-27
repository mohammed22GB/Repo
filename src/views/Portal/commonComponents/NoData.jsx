import { Typography } from "@material-ui/core";
import React from "react";

const NoData = () => {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "2rem",
      }}
    >
      <Typography variant="body3" noWrap>
        No data found
      </Typography>
    </div>
  );
};

export default NoData;
