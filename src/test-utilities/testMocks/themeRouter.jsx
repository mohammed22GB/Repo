import { mockStoreQuery } from "./queryStore";
import { ThemeProvider, createTheme } from "@mui/material";
import { createMemoryHistory } from "history";
import { MsalProvider } from "@azure/msal-react";
import { act } from "@testing-library/react";
import {
  PublicClientApplication,
  InteractionType,
  EventType,
} from "@azure/msal-browser";
import { QueryClient, QueryClientProvider } from "react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";

let msalInstance;
let mockGoogleClientId = "0813e1d1-ad72-46a9-8665-399bba48c201";
const msalConfig = {
  auth: {
    clientId: "0813e1d1-ad72-46a9-8665-399bba48c201",
  },
  system: {
    allowNativeBroker: false,
  },
};

let eventCallbacks;
let handleRedirectSpy;
let cachedAccounts = [];

beforeAll(() => {
  const userData = {
    roles: ["Designer", "Employee", "Admin"],
    _id: "62b1e8e6c3d82b1ddd3dec0f",
    account: {
      user: "615ae60a3b0d9011ce1aecc8",
      id: "615ae60a3b0d9011ce1aecc9",
    },
    id: "62b1e8e6c3d82b1ddd3dec0f",
  };
  const userInfo = JSON.stringify(userData);
  localStorage.setItem("userInfo", userInfo);
});
beforeEach(() => {
  eventCallbacks = [];
  let eventId = 0;
  msalInstance = new PublicClientApplication(msalConfig);
  jest
    .spyOn(msalInstance, "addEventCallback")
    .mockImplementation((callbackFn) => {
      eventCallbacks.push(callbackFn);
      eventId += 1;
      return eventId.toString();
    });
  handleRedirectSpy = jest
    .spyOn(msalInstance, "handleRedirectPromise")
    .mockImplementation(() => {
      const eventStart = {
        eventType: EventType.HANDLE_REDIRECT_START,
        interactionType: InteractionType.Redirect,
        payload: null,
        error: null,
        timestamp: 10000,
      };

      act(() => {
        eventCallbacks.forEach((callback) => {
          callback(eventStart);
        });
      });
      const eventEnd = {
        eventType: EventType.HANDLE_REDIRECT_END,
        interactionType: InteractionType.Redirect,
        payload: null,
        error: null,
        timestamp: 10000,
      };

      act(() => {
        eventCallbacks.forEach((callback) => {
          callback(eventEnd);
        });
      });
      return Promise.resolve(null);
    });

  jest
    .spyOn(msalInstance, "getAllAccounts")
    .mockImplementation(() => cachedAccounts);
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
  cachedAccounts = [];
});

jest.mock("@material-ui/core/styles", () => ({
  ...jest.requireActual("@material-ui/core/styles"),
  makeStyles: (styles) => (theme) =>
    typeof styles === "function" ? styles(theme) : styles || {},
}));

const mockFunc = jest.fn();
jest.mock("validate.js", () => ({
  __esModule: true,
  ...jest.requireActual("validate.js"),
  default: (...args) => mockFunc((...args) => ({})),
}));

const theme = createTheme();

export const mockThemeAndRouter = (children, options) => {
  const history = createMemoryHistory({ initialEntries: ["/"] });

  return mockStoreQuery(
    <ThemeProvider theme={theme}>
      <GoogleOAuthProvider clientId={mockGoogleClientId}>
        <MsalProvider instance={msalInstance}>{children}</MsalProvider>
      </GoogleOAuthProvider>
    </ThemeProvider>,
    options
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});
export const queryWrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

export * from "@testing-library/react";
