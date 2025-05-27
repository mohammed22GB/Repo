import React from "react";
import "../../../../assets/css/divider.css";

const Divider = ({ style, children }) => {
  return (
    <div style={style} className="container">
      <span className="content">
        <span class="inner-content">{children}</span>
      </span>
    </div>
  );
};

export default Divider;
