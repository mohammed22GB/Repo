import configureStore from "../configureStore";
import theme from "../theme";

import { isValidElement } from "react";
import { ThemeProvider } from "@mui/material";
import { createMemoryHistory } from "history";
import { MsalProvider } from "@azure/msal-react";
import { EventType, PublicClientApplication } from "@azure/msal-browser";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Router } from "react-router";
import { act, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";

/**
 * @typedef {import("@testing-library/react").RenderOptions} RenderOptions
 * @typedef {import("history").MemoryHistoryBuildOptions} MemoryHistoryBuildOptions
 * @typedef {import("redux").Store<any, any> & { dispatch: any }} Store
 *
 * @typedef {{ store?: Store, initialState?: Record<PropertyKey, any> }} StoreOptions
 * @typedef {{ memoryOptions?: MemoryHistoryBuildOptions }} MemoryOptions
 *
 * @typedef {StoreOptions & MemoryOptions & RenderOptions} MockProvidersOptions
 *
 * @param {React.ReactElement} children
 * @param {MockProvidersOptions} [options]
 */
export const mockProviders = (children, options = {}) => {
  const {
    memoryOptions,
    initialState,
    store = configureStore(initialState),
    ...renderOptions
  } = options;
  const history = createMemoryHistory(memoryOptions);

  const isFunctionComponent = typeof children === "function";
  const isRenderCallback = !isValidElement(children) && isFunctionComponent;

  const wrapper = ({ children }) => (
    <MockReduxProvider store={store}>
      <MockQueryClientProvider>
        <MockThemeProvider>
          <MockGoogleOAuthProvider>
            <MockMsalProvider>
              <MockReactRouterProvider history={history}>
                {isRenderCallback ? children({ history, store }) : children}
              </MockReactRouterProvider>
            </MockMsalProvider>
          </MockGoogleOAuthProvider>
        </MockThemeProvider>
      </MockQueryClientProvider>
    </MockReduxProvider>
  );

  const renderResult = render(children, { wrapper, ...renderOptions });

  return { history, store, ...renderResult };
};

export const MockQueryClientProvider = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export const MockReactRouterProvider = ({ children, history }) => {
  return <Router history={history}>{children}</Router>;
};

export const MockThemeProvider = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export const MockGoogleOAuthProvider = ({ children }) => {
  const mockGoogleClientId = "0813e1d1-ad72-46a9-8665-399bba48c201";

  return (
    <GoogleOAuthProvider clientId={mockGoogleClientId}>
      {children}
    </GoogleOAuthProvider>
  );
};

export const MockMsalProvider = ({ children }) => {
  const msalConfig = {
    auth: {
      clientId: "0813e1d1-ad72-46a9-8665-399bba48c201",
    },
    system: {
      allowNativeBroker: false,
    },
  };

  const msalInstance = new PublicClientApplication(msalConfig);

  msalInstance.handleRedirectPromise().then((authResult) => {
    if (authResult) {
      act(() => {
        msalInstance.setActiveAccount(authResult.account);
      });
    }
  });

  msalInstance.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS) {
      act(() => {
        msalInstance.setActiveAccount(event.payload.account);
      });
    }
  });

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
};

export const MockReduxProvider = ({ children, store }) => (
  <Provider store={store}>{children}</Provider>
);
