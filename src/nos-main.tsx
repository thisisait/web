import React from "react";
import ReactDOM from "react-dom/client";
import { NosAtlas } from "./pages/NosAtlas";
import "./theme/tokens.css";
import "./theme/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NosAtlas />
  </React.StrictMode>,
);
