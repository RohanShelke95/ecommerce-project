/**
 * Utility to normalize image URLs.
 *
 * Product images stored in the database can be:
 *  1. Full URLs (http… or data:…)  → returned as-is
 *  2. Relative upload paths         → prefixed with the backend base URL
 *     e.g. "uploads/men/clothing/Shirt/beige-shirt1.webp"
 *     or   "/uploads/men/clothing/Shirt/beige-shirt1.webp"
 *  3. Flipkart CDN relative paths   → prefixed with the Flipkart CDN base
 */

const FLIPKART_CDN = "https://rukminim1.flixcart.com";

// Must match the deployed backend URL used in api.js
const BACKEND_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://ecommerce-project-olf9.onrender.com"
    : "http://localhost:5454");

/**
 * Returns a fully-qualified image URL.
 *
 * @param {string} url - The raw image URL / path from the database.
 * @returns {string} A full image URL safe to use in <img src>.
 */
export const getImageUrl = (url) => {
  if (!url) return "";

  // 1. Already a full URL – return as-is
  if (url.startsWith("http") || url.startsWith("data:")) return url;

  // 2. Upload path (with or without leading slash)
  //    e.g. "/uploads/…" or "uploads/…"
  if (url.includes("uploads/")) {
    // Normalise: ensure exactly one leading slash
    const cleanPath = "/" + url.replace(/^\/+/, "");
    return `${BACKEND_URL.replace(/\/+$/, "")}${cleanPath}`;
  }

  // 3. Flipkart CDN relative path (legacy data)
  return `${FLIPKART_CDN}${url.startsWith("/") ? "" : "/"}${url}`;
};
