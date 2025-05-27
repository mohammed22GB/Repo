import { CircularProgress } from "@material-ui/core";

const LoadingScreen2 = ({ loading, message }) => {
  // if (!loading) return null;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 50,
      }}
    >
      <CircularProgress style={{ color: "#8d9a6b" }} />
      <div style={{ marginTop: 30 }}>{message || "L O A D I N G . . ."}</div>
    </div>
  );
};

export default LoadingScreen2;
