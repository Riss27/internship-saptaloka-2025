import React, { Suspense } from 'react';
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import './i18n';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Suspense>
  </React.StrictMode>
);
