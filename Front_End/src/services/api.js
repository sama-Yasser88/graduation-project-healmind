import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Fallback token for testing/development
const DEFAULT_TEST_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNmY3MWQ0NjVkZGZlMTYyM2MzNGY0NyIsInJvbGUiOiJkb2N0b3IiLCJpYXQiOjE3ODYyODg5ODcsImV4cCI6MTc4NjM3NTM4N30.UmvSHvrQ20rAWhqPguN37XgQGEMfqm-n3mXUbBu9YgA";

// Request interceptor to automatically attach authorization token
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("authToken") ||
      DEFAULT_TEST_TOKEN;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
