import { render, screen, fireEvent, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";

import { ExportDump } from "./index";

describe("ExportDump", () => {
  const queryClient = new QueryClient();

  const renderComponent = (props) => {
    return render(<ExportDump {...props} />, {
      wrapper: ({ children }) => {
        return (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        );
      },
    });
  };

  it("renders export accounts button", () => {
    renderComponent();
    const button = screen.getByText("Export accounts");
    expect(button).toBeInTheDocument();
  });

  it("opens modal when export accounts button is clicked", () => {
    renderComponent();
    const button = screen.getByText("Export accounts");
    fireEvent.click(button);

    const modal = screen.getByRole("dialog");
    expect(modal).toBeInTheDocument();
    expect(screen.getByText("Export account dump")).toBeInTheDocument();
  });

  it("closes modal when handleClose is called", () => {
    renderComponent();
    const modal = screen.queryByRole("dialog");
    expect(modal).not.toBeInTheDocument();

    const button = screen.getByText("Export accounts");
    fireEvent.click(button);

    const modalAfterOpen = screen.getByRole("dialog");
    expect(modalAfterOpen).toBeInTheDocument();

    const closeButton = within(modalAfterOpen).getByText("Cancel");
    fireEvent.click(closeButton);

    const modalAfterClose = screen.queryByText("Export account dump");
    expect(modalAfterClose).not.toBeInTheDocument();
  });
});
