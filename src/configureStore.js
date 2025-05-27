import thunkMiddleware from "redux-thunk";
import rootReducer from "./store/reducers";

import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import { verifyAuth } from "./store/actions";

export default function configureStore(persistedState) {
  const store = createStore(
    rootReducer,
    persistedState,
    composeWithDevTools({ trace: true, traceLimit: 25 })(
      applyMiddleware(thunkMiddleware)
    )
  );
  store.dispatch(verifyAuth());
  return store;
}
