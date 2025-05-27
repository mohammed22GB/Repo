import { Typography } from "@material-ui/core";
import AddRoundedIcon from "@material-ui/icons/AddRounded";
import RemoveRoundedIcon from "@material-ui/icons/RemoveRounded";
import React, { useState } from "react";
import { quickAccessImages } from "../utils/customizationutils";

const CustomQuickAccessApp = ({
  index,
  app,
  apps,
  handleAppSeletion,
  isSelected,
  isDisabled,
  showSelectIcon = false,
}) => {
  return (
    <div
      key={index}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        // Grey out the item and make it unclickable if disabled
        opacity: isDisabled ? 0.5 : 1,
        pointerEvents: isDisabled ? "none" : "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          backgroundColor: "",
        }}
      >
        <img
          src={
            quickAccessImages[
              Math.floor(Math.random() * quickAccessImages.length)
            ]
          }
          alt="logo"
          style={{ objectFit: "cover", width: "32px" }}
        />
        <Typography
          style={{
            color: "#535353",
            fontWeight: 500,
            fontSize: "14px",
          }}
        >
          {app?.name ?? "Cash disembursement to vendors"}
        </Typography>
      </div>

      {showSelectIcon && (
        <div
          style={{
            cursor: "pointer",
          }}
          onClick={() => handleAppSeletion(app)}
        >
          {isSelected ? (
            <RemoveRoundedIcon fontSize="large" htmlColor="#535353" />
          ) : (
            <AddRoundedIcon fontSize="large" htmlColor="#535353" />
          )}
        </div>
      )}
    </div>
  );
};

export default CustomQuickAccessApp;
