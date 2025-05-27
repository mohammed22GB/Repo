import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider, setLogger } from "react-query";
import { EditAccountForm } from "./index";

import { successToastify, errorToastify } from "../../../common/utils/Toastify";
import { updateUserAccount } from "../../../common/components/Mutation/ProfileSetting/userMutations";

jest.mock(
  "../../../common/components/Mutation/ProfileSetting/userMutations",
  () => {
    return {
      ...jest.requireActual(
        "../../../common/components/Mutation/ProfileSetting/userMutations"
      ),
      updateUserAccount: jest.fn(),
    };
  }
);

jest.mock("../../../common/utils/Toastify", () => {
  return {
    ...jest.requireActual("../../../common/utils/Toastify"),
    successToastify: jest.fn(),
    errorToastify: jest.fn(),
  };
});

describe("EditAccountForm", () => {
  const queryClient = new QueryClient();
  const mockHandleClose = jest.fn();

  const defaultProps = {
    id: "123",
    handleClose: mockHandleClose,
    initialValues: {
      name: "Test Org",
      industry: "IT",
      noOfEmployee: "1 - 25",
      country: "NG",
    },
  };

  beforeAll(() => {
    setLogger({
      ...console,
      error: jest.fn(),
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  const renderComponent = (props = defaultProps) => {
    return render(<EditAccountForm {...props} />, {
      wrapper: ({ children }) => {
        return (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        );
      },
    });
  };

  it("renders form fields with initial values", () => {
    renderComponent();
    expect(screen.getByPlaceholderText("Enter organization name")).toHaveValue(
      "Test Org"
    );
    expect(screen.getByPlaceholderText("Select industry")).toHaveValue("IT");
    expect(screen.getByPlaceholderText("Select country")).toHaveValue("NG");
    expect(
      screen.getByPlaceholderText("Select number of employees")
    ).toHaveValue("1 - 25");
  });

  it("shows validation errors for empty fields", async () => {
    renderComponent({
      ...defaultProps,
      initialValues: {
        name: "",
        industry: "",
        noOfEmployee: "",
        country: "",
      },
    });

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
      expect(screen.getByText("Industry is required")).toBeInTheDocument();
      expect(screen.getByText("Country is required")).toBeInTheDocument();
      expect(
        screen.getByText("Number of employees is required")
      ).toBeInTheDocument();
    });
  });

  it("calls updateUserAccount on successful form submission", async () => {
    updateUserAccount.mockResolvedValueOnce({ data: "success" });

    renderComponent();

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(updateUserAccount).toHaveBeenCalledWith({
        id: "123",
        name: "Test Org",
        industry: "IT",
        noOfEmployee: "1 - 25",
        country: "NG",
      });

      expect(successToastify).toHaveBeenCalledWith(
        "Account updated successfully"
      );
      expect(mockHandleClose).toHaveBeenCalled();
    });
  });

  it("shows error toast on failed submission", async () => {
    updateUserAccount.mockRejectedValueOnce(new Error("API Error"));

    renderComponent();

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(errorToastify).toHaveBeenCalledWith("Failed to update account");
    });
  });
});
