import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import AppsByCategory from "./index";
import { MemoryRouter } from "react-router-dom";

const queryClient = new QueryClient();

const renderWithQueryClient = (ui) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
};

const mockFilteredAppsData = [
  {
    _id: "1",
    name: "Category 1",
    apps: [
      { _id: "a1", name: "App 1", slug: "app-1", account: { slug: "acc1" } },
    ],
  },
  {
    _id: "2",
    name: "Category 2",
    apps: [
      { _id: "a2", name: "App 2", slug: "app-2", account: { slug: "acc2" } },
    ],
  },
];

const mockCategoryAppsData = {
  _meta: {
    pagination: {
      total_count: 20,
    },
  },
};

const mockProps = {
  classes: {
    rightSect: "mockRightSect",
    onHover: "mockOnHover",
  },
  filteredAppsData: mockFilteredAppsData,
  categoryAppsData: mockCategoryAppsData,
  colors: [
    { pri: "#ff0000", sec: "#ffffff" },
    { pri: "#00ff00", sec: "#000000" },
  ],
  isAppsLoading: false,
  perPage: 10,
  pageNo: 0,
  onPageChange: jest.fn(),
  onRowsPerPageChange: jest.fn(),
};

describe("AppsByCategory", () => {
  it("renders category names", () => {
    renderWithQueryClient(<AppsByCategory {...mockProps} />);

    // Check if category names are rendered
    expect(screen.getByText("Category 1")).toBeInTheDocument();
    expect(screen.getByText("Category 2")).toBeInTheDocument();
  });

  it("shows apps when a category is toggled", () => {
    renderWithQueryClient(<AppsByCategory {...mockProps} />);

    // Click on the first category
    fireEvent.click(screen.getByText("Category 1"));

    // Check if the app under the category is displayed
    expect(screen.getByText("App 1")).toBeInTheDocument();
  });

  it("renders skeletons when loading", () => {
    renderWithQueryClient(
      <AppsByCategory {...mockProps} isAppsLoading={true} />
    );

    // Check if skeletons are rendered
    expect(screen.getAllByTestId("app-skeleton").length).toBeGreaterThan(0);
  });

  it("handles pagination correctly", () => {
    renderWithQueryClient(<AppsByCategory {...mockProps} />);

    // Check if pagination is rendered
    expect(
      screen.getByRole("button", { name: /next page/i, hidden: true })
    ).toBeInTheDocument();

    // Simulate a page change
    fireEvent.click(screen.getByRole("button", { name: /next page/i }));
    expect(mockProps.onPageChange).toHaveBeenCalled();
  });
});
