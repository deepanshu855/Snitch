import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "../src/app/App";
import { Provider } from "react-redux";
import { store } from "./app/app.store";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
    <ToastContainer />
  </Provider>,
);
