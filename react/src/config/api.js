
import axios from 'axios';
const DEPLOYED = process.env.REACT_APP_API_URL || 'https://ecommerce-project-olf9.onrender.com';
const LOCALHOST = 'http://localhost:5454';

export const API_BASE_URL = process.env.NODE_ENV === 'production' ? DEPLOYED : LOCALHOST;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Use a request interceptor so the token is read fresh on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt');
  if (token && token !== "null" && token !== "undefined") {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

api.defaults.headers.post['Content-Type'] = 'application/json';

// Add a response interceptor to handle 401/400 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    // 401 = expired/invalid token
    // 400 on profile or cart = stale JWT after backend restart (H2 wiped users)
    const isProtectedEndpoint =
      url.includes("/api/users/profile") || url.includes("/api/cart");

    if (status === 401 || (status === 400 && isProtectedEndpoint)) {
      console.warn(`[API] Stale/invalid JWT detected (${status} on ${url}). Clearing session.`);
      localStorage.clear();
      // Redirect to login if not already there
      if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
