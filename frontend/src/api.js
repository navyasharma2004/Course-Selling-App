import axios from "axios";

// Backend base URL — set VITE_API_URL in a .env file when deploying.
// Falls back to your local backend (npm start in the root folder, port 3000).
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
