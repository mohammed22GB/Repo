import React from "react";
import MoreIcon from "../../icons/MoreIcon";
import { Typography } from "@material-ui/core";

interface Props {
  title: string;
  icon: React.ReactNode;
  isActive?: boolean;
}

const FormStep = ({ title, icon, isActive = false }: Props) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        cursor: "pointer",
        padding: "16px 24px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {icon}
        <Typography
          style={{
            fontSize: isActive ? 15 : 13,
            color: "#535353",
            fontWeight: 500,
          }}
        >
          {title}
        </Typography>
      </div>

      <MoreIcon />
    </div>
  );
};

export default FormStep;
