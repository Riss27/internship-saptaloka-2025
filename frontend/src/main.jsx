// frontend/src/main.jsx
import React, { Suspense } from "react"; // Tambahkan Suspense
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./i18n"; // Impor konfigurasi i18n

  ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Suspense>
  </React.StrictMode>
);
