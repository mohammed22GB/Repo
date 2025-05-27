import { BsFillCheckCircleFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { LIVE_RUN_FIRST_SCREEN } from "../../store/actions/actionTypes";
import { useState } from "react";
const Completed = () => {
  const dispatch = useDispatch();
  dispatch({ type: LIVE_RUN_FIRST_SCREEN, payload: null });
  const history = useHistory();
  const [hover, setHover] = useState(false);

  const goHome = () => {
    window.top.close();
    // window.location.href = `${
    //   window.location.origin
    // }/run/${localStorage.getItem("liveAccountSlug")}/${localStorage.getItem(
    //   "liveAppSlug"
    // )}`;
    //history.push({ pathname: "/apps" });
  };
  return (
    <div className="run-finish-display">
      <div>
        <div
          className={`_box ${hover ? "_hover" : ""}`}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <img
            // style={{ marginTop: "1rem", width: "50%" }}
            src="../../../../../images/plug_logo.svg"
            alt="Plug logo"
            width={70}
            className="_bottom"
            style={{ zoom: 1.3 }}
          />
          <BsFillCheckCircleFill
            fontSize={70}
            color="limegreen"
            className="_top"
          />
        </div>

        <div
          style={{
            fontFamily: "Inter",
            fontWeight: 200,
            marginTop: 30,
          }}
        >
          You have successfully completed this process.
        </div>
        <div style={{ marginTop: 10 }}>
          Kindly{" "}
          <span onClick={goHome} style={{ fontWeight: 700, cursor: "pointer" }}>
            close
          </span>{" "}
          this tab.
        </div>
        {/* <Button
        variant="contained"
        style={{ textTransform: "none" }}
        color="primary"
        onClick={goHome}
      >
        Close
      </Button> */}
      </div>
    </div>
  );
};

export default Completed;
