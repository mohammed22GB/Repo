import React from "react";

interface Props {}

const Workflow = (props: Props) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
        height: "100%",
        flexDirection: "column",
      }}
    >
      <div>workflow start</div>
      <div>workflow end</div>
    </div>
  );
};

export default Workflow;
