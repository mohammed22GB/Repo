import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import DirectorySync from "../DirectorySync"; // adjust import path as needed
import useCustomQuery from "../../../../common/utils/CustomQuery";
import useCustomMutation from "../../../../common/utils/CustomMutation";
import DirectorySyncAPI from "../utils/directorySyncAPIs";
import DirectorySyncSwitch from "../DirectorySyncSwitch";

jest.mock("../../../../common/utils/CustomMutation");
const mockeduseCustomMutation = useCustomMutation;
jest.mock("../../../../common/utils/CustomQuery");
jest.mock("../utils/directorySyncAPIs");
jest.mock("axios");
jest.mock("react-spinner-timer", () => () => <div>Loading...</div>);
jest.mock("../../../../common/utils/Toastify", () => ({
  errorToastify: jest.fn(),
  successToastify: jest.fn(),
}));

jest.mock("../DirectorySyncSwitch", () => () => (
  <div>DirectorySyncSwitch Mock</div>
));

describe("DirectorySync Component", () => {
  const mockIdentityProviders = [
    { id: "1", name: "Microsoft Entra ID", logo: "entra-logo.png" },
    { id: "2", name: "Google Workspace", logo: "google-logo.png" },
  ];

  const mockDirectorySyncConfig = [
    {
      _id: "config1",
      identityProvider: "1",
      clientId: "existing-client-id",
      clientSecret: "existing-client-secret",
      tenantId: "existing-tenant-id",
      superAdminEmail: "existing-admin@example.com",
      _meta: { success: true },
    },
  ];

  beforeEach(() => {
    useCustomQuery.mockImplementation(({ onSuccess }) => {
      React.useEffect(() => {
        onSuccess({ data: { data: mockIdentityProviders } });
      }, []);
      return { data: mockIdentityProviders, isLoading: false };
    });

    mockeduseCustomMutation.mockImplementation(() => ({
      mutate: jest.fn().mockImplementation((data) => {
        if (data.id) {
          return Promise.resolve({ data: { _meta: { success: true } } }); // update
        }
        return Promise.resolve({
          data: { data: { _meta: { success: true, message: "Success" } } },
        }); // create
      }),
    }));

    axios.post.mockResolvedValue({ data: { data: [{ id: "file123" }] } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing and shows title", () => {
    render(<DirectorySync />);
    expect(screen.getByText("Configure Directory Sync")).toBeInTheDocument();
  });

  test("renders loading spinner when isConfigLoading is true", () => {
    render(<DirectorySync />);
  });

  test("renders the component with initial state", () => {
    render(<DirectorySync />);

    expect(screen.getByText("Configure Directory Sync")).toBeInTheDocument();
    expect(screen.getByText("Identity provider")).toBeInTheDocument();
    expect(screen.getByTestId("identity-provider-select")).toBeInTheDocument();
  });

  test("enables save button when form fields are changed", async () => {
    render(<DirectorySync />);

    const saveButton = screen.getByText("Save");

    const select = screen.getByTestId("identity-provider-select");
    fireEvent.change(select, {
      target: { value: "1", name: "identityProvider" },
    });

    await waitFor(() => {
      expect(saveButton).not.toBeDisabled();
    });
  });

  test("handles form submission for new configuration", async () => {
    const mockMutate = jest.fn().mockResolvedValue({
      data: { data: { _meta: { success: true, message: "Success" } } },
    });

    useCustomMutation.mockImplementation(() => ({
      mutate: mockMutate,
    }));

    useCustomQuery.mockImplementation(({ queryKey, onSuccess }) => {
      React.useEffect(() => {
        if (queryKey[0] === "directorySyncConfiguration") {
          onSuccess({ data: { data: [] } });
        } else {
          onSuccess({ data: { data: mockIdentityProviders } });
        }
      }, []);
      return { data: [], isLoading: false };
    });

    render(<DirectorySync />);

    const select = screen.getByTestId("identity-provider-select");
    fireEvent.change(select, {
      target: { value: "1", name: "identityProvider" },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter client secret here"), {
      target: { value: "test-secret", name: "clientSecret" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter client id here"), {
      target: { value: "test-client", name: "clientId" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter tenant Id here"), {
      target: { value: "test-tenant", name: "tenantId" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
    });

    expect(mockMutate).toHaveBeenCalledWith({
      identityProvider: "1",
      clientId: "test-client",
      clientSecret: "test-secret",
      tenantId: "test-tenant",
      superAdminEmail: null,
      serviceAccountFile: null,
    });
  });

  test("displays current configuration when available", async () => {
    useCustomQuery.mockImplementation(({ queryKey, onSuccess }) => {
      React.useEffect(() => {
        if (queryKey[0] === "directorySyncConfiguration") {
          onSuccess({ data: { data: mockDirectorySyncConfig } });
        } else {
          onSuccess({ data: { data: mockIdentityProviders } });
        }
      }, []);
      return { data: mockDirectorySyncConfig, isLoading: false };
    });

    render(<DirectorySync />);

    await waitFor(() => {
      expect(screen.getByText(/You currently have/)).toBeInTheDocument();
      expect(screen.getByText(/Microsoft Entra ID/)).toBeInTheDocument();
    });
  });
});
