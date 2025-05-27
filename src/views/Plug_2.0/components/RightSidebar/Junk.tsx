import { Typography } from "@material-ui/core";
import React from "react";
import CustomAccordion from "./Properties/CustomAccordion";

const Configuration = ({ children }: any) => {
  return (
    <div style={{ border: "1px solid #d1d5db", width: "100%" }}>
      <div style={{ padding: "16px", borderBottom: "1px solid #d1d5db" }}>
        <Typography>Properties</Typography>
      </div>
      <CustomAccordion title="General" subTitle="validation">
        {children}
      </CustomAccordion>
    </div>
  );
};

export default Configuration;
