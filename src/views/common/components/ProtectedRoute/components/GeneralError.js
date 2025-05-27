import React from "react";

const GeneralError = ({ section }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...(section === "editors"
          ? { position: "absolute", height: "100%", left: 0, right: 0 }
          : { width: "100%", height: "100%" }),
      }}
    >
      <div
        style={{
          width: "30%",
          minWidth: 200,
          fontWeight: 300,
          fontSize: 14,
          lineHeight: 1.6,
          background: "#ffffff99",
          color: "#ae0e0e",
          boxShadow: "0 0 7px #ff5050",
          padding: 20,
          borderRadius: 5,
        }}
      >
        Sorry. An error occured and has been reported. <br />
        <br />
        Kindly refresh or navigate to another section of the platform while we
        swiftly rectify this embarrassment.
      </div>
    </div>
  );
};

export default GeneralError;
