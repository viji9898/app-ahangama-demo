import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "antd/dist/reset.css";
import "mapbox-gl/dist/mapbox-gl.css";
import App from "./app/App";
import "./styles/globals.css";
import { SearchProvider } from "./app/searchContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <SearchProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SearchProvider>
    </HelmetProvider>
  </React.StrictMode>
);
