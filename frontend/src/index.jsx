import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { initStore, store } from "./data/store";
import { Provider } from "react-redux";
import "./styles/main.scss";
import { initAuth } from "./data/auth";

const startApp = () => {
  initStore();
  initAuth();
  const container = document.getElementById("root");
  const root = createRoot(container);
  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  );
};

if (!window.cordova) {
  startApp();
} else {
  document.addEventListener("deviceready", startApp, false);
}
serviceWorker.unregister();
