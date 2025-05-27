import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import Root from "./Root";
import * as serviceWorker from "./serviceWorker";

/* Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_CONNECTION_STRING,
  // integrations: [new BrowserTracing()],
  integrations: [
    new BrowserTracing(),
    new Sentry.Integrations.Breadcrumbs({ console: false }),
  ],
  attachStacktrace: ["production", "staging", "development"].includes(
    process.env.NODE_ENV
  ),
  debug: ["staging", "development"].includes(process.env.NODE_ENV),
  environment: process.env.REACT_APP_ENVIRONMENT,

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
}); */

ReactDOM.render(<Root />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
