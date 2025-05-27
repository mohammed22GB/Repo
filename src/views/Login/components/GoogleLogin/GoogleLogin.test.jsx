import userEvent from "@testing-library/user-event";
import * as reactOAuth from "@react-oauth/google";

import useCustomMutation from "../../../common/utils/CustomMutation";
import GoogleLogin from "./GoogleLogin";

import { screen } from "@testing-library/react";

import { waitFor } from "../../../../test-utilities/testMocks/themeRouter";
import { errorToastify } from "../../../common/utils/Toastify";
import { mainNavigationUrls } from "../../../common/utils/lists";
import { mockProviders } from "../../../../test-utilities/mockProviders";

jest.spyOn(console, "error").mockImplementation(() => {});

jest.mock("../../../common/utils/CustomMutation", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    mutate: jest.fn(),
    isLoading: false,
  })),
}));

jest.mock("../../../common/utils/Toastify", () => {
  return {
    ...jest.requireActual("../../../common/utils/Toastify"),
    successToastify: jest.fn(),
    errorToastify: jest.fn(),
  };
});

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

afterAll(() => {
  jest.restoreAllMocks();
  jest.mocked(useCustomMutation).mockRestore();
});

const renderComponent = () => {
  return mockProviders(
    <GoogleLogin btnMessage="Login with Google" classes={{ googleIcon: "" }} />
  );
};

const googleSignInSuccessResponse = {
  access_token: "ya29.a0ARrdaM8vY1e6bG50b2f8e6f0b2f",
};

const successResponseFixture = {
  data: {
    data: {
      id: "6176ab78f53784268e6f0b2f",
      account: {
        id: "612628aa69a9912a28aeaa9f",
      },
    },
    _meta: {
      accessToken:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0ODUxNDA5ODQsImlhdCI6MTQ4NTEzNzM4NCwiaXNzIjoiYWNtZS5jb20iLCJzdWIiOiIyOWFjMGMxOC0wYjRhLTQyY2YtODJmYy0wM2Q1NzAzMThhMWQiLCJhcHBsaWNhdGlvbklkIjoiNzkxMDM3MzQtOTdhYi00ZDFhLWFmMzctZTAwNmQwNWQyOTUyIiwicm9sZXMiOltdfQ.Mp0Pcwsz5VECK11Kf2ZZNF_SMKu5CgBeLN9ZOP04kZo",
    },
  },
};

describe("Google Login", () => {
  const googleSignInMutateStub = jest.fn();
  const useGoogleLoginSpy = jest.spyOn(reactOAuth, "useGoogleLogin");

  test("renders Google login button and triggers login flow", async () => {
    jest.mocked(useCustomMutation).mockImplementation(
      /**
       * Mocking the useCustomMutation hook to return a mock mutate function
       *
       * @param {{ onSuccess: Function, onError: Function }} param
       * @returns {{ mutate: Function, isLoading: boolean }}
       */
      function ({ onSuccess }) {
        googleSignInMutateStub.mockImplementation(() => {
          return Promise.resolve(successResponseFixture).then(onSuccess);
        });

        return {
          mutate: googleSignInMutateStub,
          isLoading: false,
        };
      }
    );

    const localStorageSetItemSpy = jest.spyOn(
      Object.getPrototypeOf(localStorage),
      "setItem"
    );

    useGoogleLoginSpy.mockImplementation(({ onSuccess }) => {
      return () => {
        onSuccess(googleSignInSuccessResponse);
      };
    });

    const { history } = renderComponent();

    const googleLoginButton = await screen.findByText(/Login with Google/i);
    expect(googleLoginButton).toBeInTheDocument();
    expect(googleLoginButton.closest("button")).not.toBeDisabled();

    expect(useGoogleLoginSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        onSuccess: expect.any(Function),
        prompt: "consent",
        scope: "profile email",
      })
    );

    expect(googleSignInMutateStub).not.toHaveBeenCalled();
    userEvent.click(googleLoginButton);

    expect(googleSignInMutateStub).toHaveBeenCalledWith({
      socialAuthType: "google",
      accessToken: googleSignInSuccessResponse.access_token,
    });

    expect(localStorageSetItemSpy).toHaveBeenNthCalledWith(1, "status", "old");

    await waitFor(() => {
      expect(localStorageSetItemSpy).toHaveBeenCalledTimes(5);
    });

    expect(localStorageSetItemSpy).toHaveBeenLastCalledWith(
      "accessToken",
      successResponseFixture.data._meta.accessToken
    );

    await waitFor(() => {
      expect(history.location.pathname).toBe(mainNavigationUrls.APPS);
    });
  });

  test("handles Google login error", async () => {
    const googleSignInMutateStub = jest.fn();
    const useGoogleLoginSpy = jest.spyOn(reactOAuth, "useGoogleLogin");

    useGoogleLoginSpy.mockImplementation(({ onError }) => {
      return () => {
        onError({ error: "Invalid credentials" });
      };
    });

    jest.mocked(useCustomMutation).mockImplementation(
      /**
       * Mocking the useCustomMutation hook to return a mock mutate function
       *
       * @param {{ onSuccess: Function, onError: Function }} param
       * @returns {{ mutate: Function, isLoading: boolean }}
       */
      function ({ onError }) {
        googleSignInMutateStub.mockImplementation(() => {
          return Promise.reject(new Error("Invalid credentials")).then(onError);
        });

        return {
          mutate: googleSignInMutateStub,
          isLoading: false,
        };
      }
    );

    renderComponent();

    const googleLoginButton = await screen.findByText(/Login with Google/i);
    expect(googleLoginButton).toBeInTheDocument();
    expect(googleLoginButton.closest("button")).not.toBeDisabled();

    expect(useGoogleLoginSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        onError: expect.any(Function),
        prompt: "consent",
        scope: "profile email",
      })
    );

    userEvent.click(googleLoginButton);
    const errorMessage = "An error occurred, kindly try again.";

    await waitFor(() => {
      expect(errorToastify).toHaveBeenCalledWith(errorMessage);
    });
    expect(googleSignInMutateStub).not.toHaveBeenCalled();
  });
});
