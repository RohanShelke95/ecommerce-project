/**
 * Utility to normalize image URLs.
 *
 * Product images stored in the database sometimes contain only a relative
 * path (e.g. "/image/612/612/...") instead of the full Flipkart CDN URL.
 * This helper detects such paths and prepends the correct base domain so
 * images load properly on every environment (local dev, Vercel, Render,
 * Hostinger, etc.).
 */

const BASE_IMAGE_URL = "https://rukminim1.flixcart.com";

/**
 * Returns a fully-qualified image URL.
 *
 * - If `url` is falsy, returns an empty string.
 * - If `url` already starts with "http" or "data:", it is returned as-is.
 * - Otherwise it is treated as a relative path and the Flipkart CDN base
 *   domain is prepended.
 *
 * @param {string} url - The raw image URL / path.
 * @returns {string} A full image URL safe to use in `<img src>`.
 */
export const getImageUrl = (url) => {
  if (!url) return "";
  // If already absolute (http or data), return as-is
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  // If the URL is a relative upload path (e.g., /uploads/...), prepend backend base URL
  if (url.startsWith("/uploads/")) {
    const backendBase = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
    // Ensure no double slash when concatenating
    return `${backendBase.replace(/\/+$/, "")}${url}`;
  }
  // Otherwise treat as Flipkart CDN relative path
  return `${BASE_IMAGE_URL}${url}`;
};
