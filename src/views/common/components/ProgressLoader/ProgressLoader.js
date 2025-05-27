import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function CircularIndeterminate() {
  return (
    <div style={{ 
      position: "absolute",
      bottom: 0,
      background: "#020f4724",
      width: "100%",
      left: 0,
      display: "flex",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 5,
    }}>
      <CircularProgress style={{ color: "#010A43" }} />
    </div>
  );
}

