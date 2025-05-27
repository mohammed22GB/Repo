import userEvent from "@testing-library/user-event";
import * as azure from "@azure/msal-react";

import MicrosoftLogin from "./MicrosoftLogin";

import { screen } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";

import useCustomMutation from "../../../common/utils/CustomMutation";
import { mockProviders } from "../../../../test-utilities/mockProviders";

jest.spyOn(console, "error").mockImplementation(() => {});

jest.mock("../../../common/utils/CustomMutation", () => ({
  __esModule: true,
  default: jest.fn(() => {
    return {
      mutate: jest.fn(),
      isLoading: false,
    };
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  jest.restoreAllMocks();
  jest.mocked(useCustomMutation).mockRestore();
});

const renderComponent = () => {
  mockProviders(
    <MicrosoftLogin
      btnMessage="Login with Microsoft"
      classes={{
        signUpButton: "signUpButton",
        microsoftIcon: "microsoftIcon",
      }}
    />
  );
};

const useMsalSpy = jest.spyOn(azure, "useMsal");

describe("Microsoft Login", () => {
  test("renders Microsoft login button and triggers login flow", async () => {
    const microsoftLoginMutateStub = jest.fn();
    jest.mocked(useCustomMutation).mockImplementation(
      /**
       * Mocking the useCustomMutation hook to return a mock mutate function
       *
       * @param {{ onSuccess: Function, onError: Function }} param
       * @returns {{ mutate: Function, isLoading: boolean }}
       */
      function ({ onSuccess, onError }) {
        microsoftLoginMutateStub.mockImplementation(() => {
          return Promise.resolve(successResponseFixture)
            .then(onSuccess)
            .catch(onError);
        });

        return {
          mutate: microsoftLoginMutateStub,
          isLoading: false,
        };
      }
    );

    useMsalSpy.mockImplementation(() => ({
      instance: {
        loginPopup: jest.fn(() =>
          Promise.resolve({
            accessToken: "microsoft_access_token",
            uniqueId: "unique_id",
            account: { username: "user@microsoft.com" },
          })
        ),
      },
      inProgress: false,
    }));

    renderComponent();
    const microsoftLoginButton = await screen.findByText(
      /Login with Microsoft/i
    );
    expect(microsoftLoginButton).toBeInTheDocument();

    userEvent.click(microsoftLoginButton);

    await waitFor(() => {
      expect(microsoftLoginMutateStub).toHaveBeenCalled();
    });
  });
});
