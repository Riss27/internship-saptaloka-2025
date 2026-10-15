// Base URL API backend. Diatur lewat VITE_API_URL di .env; fallback untuk dev lokal.
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default API_BASE;
