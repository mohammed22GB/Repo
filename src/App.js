import { Router } from "react-router-dom";
import { ThemeProvider } from "@material-ui/styles";
import { createBrowserHistory } from "history";
import validate from "validate.js";
import io from "socket.io-client";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "react-datepicker/dist/react-datepicker.css";

import Routes from "./Routes";
import theme from "./theme";
import "./App.css";
// import PwaBanner from "./components/pwa-banner";
import validators from "./views/common/helpers/validators";
import { msalConfig } from "./views/common/utils/msconfig";
import packageFile from "../package.json";

const { version } = packageFile;

const browserHistory = createBrowserHistory();

validate.validators = {
  ...validate.validators,
  ...validators,
};

const verifyToken = () =>
  localStorage.getItem("accessToken") === null
    ? false
    : localStorage.getItem("accessToken");

export const socket = io(process.env.REACT_APP_SOCKET_BASE_URL, {
  query: { token: verifyToken() },
  transports: ["websocket", "polling"],
});

console.info("Plug version: ", version);

const msalInstance = new PublicClientApplication(msalConfig);
function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router history={browserHistory}>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENTID}>
          <MsalProvider instance={msalInstance}>
            <Routes />
          </MsalProvider>
        </GoogleOAuthProvider>
      </Router>
      {/* <PwaBanner /> */}
    </ThemeProvider>
  );
}

export default App;
