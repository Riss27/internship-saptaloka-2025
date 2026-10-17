import axios from "axios";
import API_BASE from "../lib/apiBase";

const apiClient = axios.create({
  baseURL: API_BASE,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Single-flight guard: only one 401 redirect can ever be in flight.
let redirecting = false;

apiClient.interceptors.response.use(
  (response) => response,
  (err) => {
    const status = err?.response?.status;
    const url = err?.config?.url ?? "";
    const onAdmin = window.location.pathname.startsWith("/admin");

    if (
      status === 401 &&
      !redirecting &&
      !url.includes("/auth/login") &&
      onAdmin
    ) {
      redirecting = true;
      localStorage.removeItem("authToken");
      localStorage.setItem("sessionExpired", "1");
      window.location.assign("/login");
    }

    return Promise.reject(err);
  }
);

export default apiClient;
