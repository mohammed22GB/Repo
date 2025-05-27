import React from "react";

const UieCanvasPageHeader = ({ screen }) => {
  // console.log(`====> screen >> `, JSON.stringify(screen));
  return !screen?.values?.page?.pageHasHeader ? null : (
    <div
      style={{
        backgroundColor: "#06188f",
        color: "#fff",
        fontSize: 18,
        fontWeight: 600,
        height: 50,
        padding: "0 20px",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        borderRadius: 3,
        marginBottom: 10,
        ...(screen?.style?.page?.overrideDefault
          ? screen?.style?.page?.header
          : {}),
      }}
    >
      {screen?.values?.page?.pageHeaderText || "Header text goes here...."}
    </div>
  );
};

export default UieCanvasPageHeader;
