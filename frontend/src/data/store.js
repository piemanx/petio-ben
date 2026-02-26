import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";

let store;

function initStore(preloadedState) {
  store = configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // Legacy app might have non-serializable objects in state/actions
      }),
  });
}

export { store, initStore };
