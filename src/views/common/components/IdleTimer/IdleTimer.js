import { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { unprotectedUrls } from "../../utils/lists";
import { logoutClearLocalStorage } from "../../helpers/helperFunctions";

const IdleTimer = ({ children }) => {
  //Get RememberMe state from User
  const rememberUser = localStorage.getItem("rememberMe");
  const history = useHistory();

  // Eevents that determine In-Activity
  const events = [
    "load",
    "mousemove",
    "mousedown",
    "click",
    "scroll",
    "keypress",
  ];

  // timer state
  const [timer, setTimer] = useState(null);

  // Inactivity Time - set to 24 Hours in milliseconds
  const INACTIVITY_TIMEOUT = 24 * 60 * 60 * 1000;

  const resetTimer = () => {
    clearTimeout(timer);
    setTimer(null);
  };

  const logoutAction = () => {
    logoutClearLocalStorage(history); // Replace with your logout path
  };

  const handleLogoutTimer = () => {
    setTimer(
      setTimeout(() => {
        resetTimer();
        events.forEach((item) => window.removeEventListener(item, resetTimer));
        logoutAction(); // Log out the user
      }, INACTIVITY_TIMEOUT)
    );
  };

  useEffect(() => {
    if (!rememberUser || rememberUser === "false") {
      handleLogoutTimer();
      events.forEach((event) =>
        window.addEventListener(event, () => {
          resetTimer();
          handleLogoutTimer();
        })
      );

      return () => {
        events.forEach((event) =>
          window.removeEventListener(event, () => {
            resetTimer();
            handleLogoutTimer();
          })
        );
      };
    }
  }, []);

  return children;
};

export default IdleTimer;
