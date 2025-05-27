import { MemoryRouter } from "react-router-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";

import { clickOutside } from "../../../../test-utilities/clickOutside";
import { ActionMenu } from "./index";

const mockHistoryPush = jest.fn();

jest.mock("react-router", () => {
  return {
    ...jest.requireActual("react-router"),
    useHistory: () => {
      return {
        push: mockHistoryPush,
      };
    },
  };
});

describe("ActionMenu", () => {
  const queryClient = new QueryClient();

  const mockData = {
    _id: "123",
    slug: "test-org",
    name: "Test Organization",
    industry: "IT",
    noOfEmployee: "1 - 25",
    country: "NG",
  };

  const defaultProps = { data: mockData };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  /**
   * @param {{ data: Plug.Account }} props
   */
  const renderComponent = (props = defaultProps) => {
    render(<ActionMenu {...props} />, {
      wrapper: ({ children }) => {
        return (
          <QueryClientProvider client={queryClient}>
            <MemoryRouter>{children}</MemoryRouter>
          </QueryClientProvider>
        );
      },
    });
  };

  it("renders the more options button", () => {
    renderComponent();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("opens menu when more options button is clicked", async () => {
    renderComponent();

    const menuButton = screen.getByRole("button");
    fireEvent.click(menuButton);

    expect(await screen.findByRole("menu")).toBeInTheDocument();
  });

  it("shows all menu items when opened", async () => {
    renderComponent();

    fireEvent.click(screen.getByRole("button"));

    const menuItems = await screen.findAllByRole("menuitem");
    expect(menuItems).toHaveLength(4);

    ["View details", "Edit details", "View users", "Export users"].forEach(
      (item, idx) => {
        expect(menuItems[idx]).toHaveTextContent(item);
      }
    );
  });

  it("navigates to account details page when View details is clicked", async () => {
    renderComponent();

    fireEvent.click(screen.getByRole("button"));
    const menuItems = await screen.findAllByRole("menuitem");
    fireEvent.click(menuItems[0]);

    expect(mockHistoryPush).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: "/administration/test-org",
      })
    );
  });

  it("opens edit dialog when Edit details is clicked", async () => {
    renderComponent();

    fireEvent.click(screen.getByRole("button"));
    const menuItems = await screen.findAllByRole("menuitem");
    fireEvent.click(menuItems[1]);

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Edit organization")).toBeInTheDocument();
  });

  it("shows error prompt when account has no slug", async () => {
    const mockDataNoSlug = { ...mockData, slug: null };
    renderComponent({ data: mockDataNoSlug });

    fireEvent.click(screen.getByRole("button"));
    const menuItems = await screen.findAllByRole("menuitem");
    fireEvent.click(menuItems[0]);

    expect(await screen.findByText("Invalid account")).toBeInTheDocument();
  });

  it("opens user dump dialog when Export users is clicked", async () => {
    renderComponent();

    fireEvent.click(screen.getByRole("button"));
    const menuItems = await screen.findAllByRole("menuitem");
    fireEvent.click(menuItems[3]);

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Export User Dump")).toBeInTheDocument();
  });

  it("closes menu when clicking outside", async () => {
    renderComponent();

    fireEvent.click(screen.getByRole("button"));
    expect(await screen.findByRole("menu")).toBeInTheDocument();

    clickOutside();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
