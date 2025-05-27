import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn().mockReturnValue({ id: "123" }),
}));

const mockStore = configureStore([]);
const store = (storeData) => mockStore(storeData);

const MockProvider = ({ storeData, children }) => (
  <Provider store={store(storeData)}>{children}</Provider>
);

export default MockProvider;
