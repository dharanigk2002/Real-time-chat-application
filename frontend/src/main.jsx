import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App.jsx";
import store from "../store";
import Loader from "./components/Loader.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <Loader />
      <Toaster position="top-center" reverseOrder={false} />
      <App />
    </Provider>
  </StrictMode>,
);
