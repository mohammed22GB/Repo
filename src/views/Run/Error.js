import { BiError } from "react-icons/bi";
const Error = ({ status, message }) => {
  if (!status && !message) return null;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#FFFFFF",
        flexDirection: "column",
      }}
    >
      <BiError fontSize={55} color="red" />
      <h2 style={{ fontFamily: "Inter" }}>{status}</h2>
      <p>{message}</p>
    </div>
  );
};

export default Error;
