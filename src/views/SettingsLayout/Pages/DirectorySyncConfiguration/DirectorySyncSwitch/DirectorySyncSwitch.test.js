import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  errorToastify,
  successToastify,
} from "../../../../common/utils/Toastify";
import DirectorySyncSwitch from "./index"; // adjust import path as needed
import useCustomMutation from "../../../../common/utils/CustomMutation";

jest.mock(".../../../../../../views/common/utils/CustomMutation");
jest.mock(".../../../../../../views/common/utils/Toastify");
jest.mock("../utils/directorySyncAPIs");

describe("DirectorySyncSwitch Component", () => {
  const mockDSync = {
    _id: "123",
    isEnabled: false,
  };

  beforeEach(() => {
    useCustomMutation.mockImplementation(() => ({
      mutate: jest.fn().mockResolvedValue({
        data: {
          _meta: { success: true },
          data: { isEnabled: true },
        },
      }),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders correctly with directory sync disabled", () => {
    render(<DirectorySyncSwitch dSync={mockDSync} />);

    expect(screen.getByText("Enable Directory Sync")).toBeInTheDocument();
    const switchElement = screen.getByRole("checkbox");
    expect(switchElement).not.toBeChecked();
  });

  test("renders correctly with directory sync enabled", () => {
    render(<DirectorySyncSwitch dSync={{ ...mockDSync, isEnabled: true }} />);

    const switchElement = screen.getByRole("checkbox");
    expect(switchElement).toBeChecked();
  });
});
