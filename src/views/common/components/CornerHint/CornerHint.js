import React from "react";
import { Tooltip } from "@material-ui/core";

const CornerHint = ({ hint, size = 10 }) => {
  return (
    <Tooltip title={hint}>
      <div
        className="floating-info-circle"
        style={{
          position: "absolute",
          right: 0, // `${(-size / 2) + 1}px`,
          top: 0, // `${(-size / 2) + 1}px`,
          background: "black",
          width: size,
          height: size,
          borderRadius: "100%",
          zIndex: 1,
          color: "white",
          textAlign: "center",
          lineHeight: `${size}px`,
          fontSize: `${0.8 * size}px`,
          fontWeight: 700,
          fontStyle: "italic",
        }}
      >
        i
      </div>
    </Tooltip>
  );
};

export default CornerHint;
