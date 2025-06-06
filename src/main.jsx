import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./App.css";
// import { initializeLocalStorage } from "./utils";

// Initialize localStorage with default values
// initializeLocalStorage();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
