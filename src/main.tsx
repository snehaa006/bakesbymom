import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./styles/base.css";
import "./styles/nav.css";
import "./styles/landing.css";
import "./styles/catalog.css";
import "./styles/shop.css";
import "./styles/assistant.css";
import "./styles/admin.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
