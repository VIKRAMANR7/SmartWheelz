import { MotionConfig } from "motion/react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { AppProvider } from "./context/AppContext";

import "./index.css";

createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <AppProvider>
      <MotionConfig>
        <App />
      </MotionConfig>
    </AppProvider>
  </BrowserRouter>
);
