import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import configureStore from "./configureStore";
//import PwaBanner from "./components/pwa-banner";
import CacheBuster from "react-cache-buster";
import packageFile from "../package.json";

const store = configureStore();
const queryClient = new QueryClient();

function Root() {
  const { version } = packageFile;
  const isProduction =
    process.env.NODE_ENV === "production" ||
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "staging";

  return (
    <CacheBuster currentVersion={version} isEnabled={isProduction}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <App />
          </Router>
        </QueryClientProvider>
        {/* <PwaBanner /> */}
      </Provider>
    </CacheBuster>
  );
}

export default Root;
