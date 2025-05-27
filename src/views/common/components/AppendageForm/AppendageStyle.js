export const AppendageUseStyles = (makeStyles) => {
  // let screen = window.innerWidth;
  return makeStyles((theme) => ({
    body: {},
    root: {
      width: "900px",
      display: "flex",
      background: "#FFF",
      alignItems: "center",
      flexDirection: "column",
      justifyContent: "center",
      margin: "auto",
      marginTop: "15px",
      padding: "15px",
      maxWidth: "900px",
    },

    info: {
      background: "#FAFBFC",
      width: "100%",
    },

    textInfo: {
      padding: "21px 47px",
      textAlign: "center",
      fontFamily: "Inter",
      fontSize: "14px",
      fontWeight: 300,
      lineHeight: "19px",
      letterSpacing: "0em",
    },

    tableContainer: {
      width: "100%",
      "& .height": {
        minHeight: 50,
        padding: 0,
        boxSizing: "border-box",
      },
      "& .tableBox": {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflowX: "auto",
        backgroundColor: "#FAFBFC",
        border: "dashed 1px #d2d2da",
        marginTop: 5,
        padding: "5px",
        "& ._title": {
          fontWeight: 700,
        },
        "& .tableColBox": {
          flex: 1,
          minWidth: 100,
          "&:last-child": {
            borderRight: "2px solid gray",
          },
        },
        "& .tableColumn": {
          display: "flex",
          fontWeight: "900",
          alignItems: "center",
          justifyContent: "center",
          // minWidth: "200px",
          minHeight: "40px",
          borderBottom: "2px solid gray",
          borderTop: "2px solid gray",
          paddingLeft: "4px",
          paddingRight: "4px",
        },
        "& .tableRow": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // minWidth: "200px",
          minHeight: 40,
          maxHeight: 40,
          overflowY: "auto",
          borderBottom: "2px solid gray",
          paddingLeft: "4px",
          paddingRight: "4px",
        },
        "& .aggregateBox": {
          width: "100%",
          marginTop: 5,
        },
        "& .aggregateRow": {
          alignSelf: "flex-end",
          display: "flex",
          width: "100%",
          "&:last-child": {
            "& .aggregateCell:not(._empty)": {
              borderBottom: "4px solid gray",
            },
          },
        },
        "& .aggregateCell": {
          flex: 1,
          border: "2px solid gray",
          borderRight: "none",
          borderBottom: "none",
          "&:last-child": {
            borderRight: "2px solid gray",
          },
          "&._empty": {
            border: "solid 2px transparent",
          },
        },
      },
      "& .tableWrapper": {
        // display: "flex",
        // flexDirection: "column",
        // alignItems: "flex-end",
        // justifyContent: "center",
        margin: "auto",
        width: "100%",
      },
      "& .headerArea": {
        display: "flex",
        flexDirection: "column",
        "& .titles": {
          background: "lightgray",
          padding: "0px 12px",
        },
      },
      "& .table": {
        display: "flex",
        alignItems: "center",
        borderBottom: "inset 1px",
        // justifyContent: "center",
        width: "100%",
        "&:nth-child(odd)": {
          background: "rgba(218, 223, 255, 0.1)",
        },
        "& .content": {
          display: "flex",
          // justifyContent: "space-between",
          // width: "50%",
          padding: "0 20px",
          fontFamily: "Inter",
          // fontSize: "15px",
          fontStyle: "normal",

          lineHeight: "19px",
          letterSpacing: "0em",
          textAlign: "left",
          "& .left": {
            fontWeight: 400,
            minWidth: 100,
            marginRight: 12,
            textTransform: "capitalize",
          },
          "& .right": {
            fontWeight: 700,
            overflowWrap: "anywhere",
            // width: "50%",
          },
        },
      },
    },
    approval: {
      background: "#f6f8fa",
      width: "100%",
      marginTop: 10,
      display: "flex",
      flexDirection: "column",
      // minHeight: 234,
      border: "outset 1px",
      "& .approver": {
        borderBottom: "outset 1px",
        backgroundColor: "#dde6ee",
        marginBottom: 20,

        padding: "10px 20px",
        display: "flex",
        // width: "100%",
        fontFamily: "Inter",
        justifyContent: "space-between",
        "& .left": {
          fontWeight: 600,
          minWidth: 90,
          // marginRight: 12,
          textTransform: "capitalize",
        },
        "& .right": {
          // width: "90%",
          // display: "flex",
          // justifyContent: "space-between",
          "& p": {
            margin: 0,
            fontStyle: "normal",
            lineHeight: "18px",
            fontWeight: 600,
          },
          "& .name": {
            // width: "60%",
          },
        },
        "& .moment": {
          // width: "40%",
          // display: "flex",
          "& .time": {
            // width: "30%",
            fontStyle: "normal",
            lineHeight: "18px",
            fontWeight: 300,
            textAlign: "left",
          },
          "& .date": {
            // width: "70%",
            fontStyle: "normal",
            lineHeight: "18px",
            fontWeight: 600,
            textAlign: "left",
          },
        },
      },
      "& .decision": {
        display: "flex",
        padding: "0px 20px",
        "& .left": {
          minWidth: 90,
          // fontSize: "14px",
          fontWeight: 700,
          fontStyle: "normal",
          lineHeight: "18px",
          display: "flex",
          alignItems: "center",
          "& span": {
            color: "red",
          },
        },
        "& .right": {
          // width: "90%",
          display: "flex",
          flexWrap: "wrap",
          marginLeft: 11,
          "& .check": {
            display: "flex",
            alignItems: "center",
            marginRight: 10,

            "& span": {
              paddingLeft: 0,
            },
          },
        },
      },
      "& .decision.taken": {
        "& .right": {
          marginLeft: 0,
        },
      },
      "& .comment": {
        display: "flex",
        padding: "20px",
        // width: "100%",
        "& .left": {
          minWidth: 90,
          // fontSize: "14px",
          fontWeight: 700,
          fontStyle: "normal",
          lineHeight: "15px",
        },
        "& .right": {
          // width: "75%",
          fontSize: "12px",
          fontStyle: "normal",
          lineHeight: "18px",
          fontWeight: 300,
          "& .textarea": {
            resize: "none",
            border: "2px solid #999999",
            borderRadius: "2px",

            "&:placeholder": {
              background: "#979797",
            },
          },
          "& .button": {
            width: 175,
            background: "#010A43",
            color: "#FFFFFF",
            height: 40,
            marginTop: 28,
            textTransform: "none",
          },
          "& .Mui-disabled": {
            background: "darkgray",
          },
        },
      },
    },
    noInfo: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "10vh",
      background: "#FAFBFC",
      fontStyle: "italic",
      padding: 0,
      width: "100%",
    },
    empty: {
      height: 80,
      width: "100%",
      background: "#FFF",
      fontFamily: "Inter",
      fontStyle: "italic",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  }))();
};
