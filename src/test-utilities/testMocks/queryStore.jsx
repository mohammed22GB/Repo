import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import configureStore from "../../configureStore";
import { unmountComponentAtNode } from "react-dom";

const store = configureStore();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

export const mockStoreQuery = (ui, options) => {
  //console.log(ui);
  const Wrapper = ({ children }) => (
    <Provider store={options?.store ?? store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );
  return render(ui, { wrapper: Wrapper, container, ...options });
};

export * from "@testing-library/react";
