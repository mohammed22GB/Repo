import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: "100%",
  },

  loadingPage: {
    textAlign: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
  },

  listSubHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: "#FFFFFF",
    backgroundColor: "rgb(251, 251, 251)",
    padding: 12,
    marginBottom: 5,
    borderTopLeftRadius: "20px",
    borderTopRightRadius: "20px",
  },

  headingText: {
    fontWeight: 600,
    textAlign: "left",
  },

  auditedDataBackground: {
    backgroundColor: "#FFFFFF",
  },

  listitemBox: {
    // paddingLeft: "5px",
    // paddingRight: "5px",
    // "&:hover": {
    //   backgroundColor: "#FAFAFA",
    // },
  },

  rowPerPage: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    padding: 6,
    paddingTop: 20,
    gap: 10,
  },

  options: {
    borderBottom: "0 !important",
    marginLeft: "6px",
  },

  errorMessage: {
    color: "#a12121",
    fontWeight: 400,
    fontStyle: "italic",
  },

  noAuditLog: {
    color: "#091540",
    fontWeight: 500,
  },

  ul: {
    padding: 0,
  },

  noRecord: {
    padding: 20,
    fontStyle: "italic",
    fontWeight: 300,
    color: "#FFCC00",
    backgroundColor: "#FFFFFF",
    textAlign: "center",
  },

  perPageInput: {
    border: "none",
    marginLeft: "0px",
    marginRight: "6px",
  },

  listItem: {
    display: "flex",
    gap: 10,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 20,
    borderBottom: "2px solid #EFEFEF",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#FAFAFA",
    },
  },

  itemText: {
    fontWeight: 600,
    overflowWrap: "anywhere",
    textAlign: "left",
  },

  itemDeviceTypeText: {
    fontWeight: 600,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  itemSubBox: {
    borderLeft: "2px solid #EFEFEF",
    paddingLeft: 10,
    paddingTop: 8,
  },

  itemSubText: {
    fontWeight: 600,
    overflowWrap: "anywhere",
  },

  itemContentText: {
    fontWeight: 600,
    overflowWrap: "anywhere",
    padding: "4px 10px",
    backgroundColor: "#FFE7E6",
    // display: "inline-block",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    borderRadius: "5px",
    color: "#8E0603",
    // width: "80px",
  },

  itemUserRoleSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  itemUserRole: {
    fontWeight: 600,
    overflowWrap: "anywhere",
    padding: "4px 10px",
    backgroundColor: "#FFF5D2",
    display: "inline-block",
    borderRadius: "5px",
    color: "#A97104",
  },

  itemSpan: {
    background: "#FFB3B1",
    width: "15px",
    height: "2px",
  },

  itemShowMore: {
    display: "flex",
    alignItems: "center",
  },
}));

export default useStyles;
