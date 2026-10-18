/**
 * Ultra-fast client-side caching & category alias resolution
 * Enables instant (0ms) category product and banner navigation like Amazon & Flipkart
 */

const CATEGORY_ALIASES = {
  women_saree: "saree",
  women_sarees: "saree",
  sarees: "saree",
  tops: "top",
  dresses: "women_dress",
  women_dresses: "women_dress",
  dress: "women_dress",
  mens_kurtas: "mens_kurta",
  men_kurta: "mens_kurta",
  men_kurtas: "mens_kurta",
  gowns: "gouns",
  gown: "gouns",
  womens_gouns: "gouns",
  shirts: "shirt",
  men_shirts: "shirt",
  sunglasses: "sunglasse",
};

export const normalizeCategory = (category) => {
  if (!category) return "";
  const lower = category.trim().toLowerCase();
  return CATEGORY_ALIASES[lower] || lower;
};

// In-memory runtime cache for product queries (0ms access)
const productMemoryCache = new Map();
const filtersMemoryCache = new Map();

export const buildProductCacheKey = (
  category,
  lavelOne = "",
  colors = "",
  sizes = "",
  minPrice = 0,
  maxPrice = 100000,
  minDiscount = 0,
  sort = "price_low",
  stock = "",
  pageNumber = 0,
  pageSize = 10
) => {
  const normCat = normalizeCategory(category);
  const colorStr = Array.isArray(colors) ? colors.join(",") : colors || "";
  const sizeStr = Array.isArray(sizes) ? sizes.join(",") : sizes || "";
  return `${normCat}_${lavelOne || ""}_${colorStr}_${sizeStr}_${minPrice}_${maxPrice}_${minDiscount}_${sort}_${stock}_${pageNumber}_${pageSize}`.toLowerCase();
};

export const getCachedProducts = (key) => {
  if (!key) return null;
  if (productMemoryCache.has(key)) {
    return productMemoryCache.get(key);
  }
  try {
    const raw = sessionStorage.getItem(`cache_prod_${key}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed) {
        productMemoryCache.set(key, parsed);
        return parsed;
      }
    }
  } catch (e) {
    // Ignore storage errors
  }
  return null;
};

export const setCachedProducts = (key, data) => {
  if (!key || !data) return;
  productMemoryCache.set(key, data);
  try {
    sessionStorage.setItem(`cache_prod_${key}`, JSON.stringify(data));
  } catch (e) {
    // Ignore storage quota errors
  }
};

export const getCachedFilters = (key) => {
  if (!key) return null;
  const normKey = normalizeCategory(key);
  if (filtersMemoryCache.has(normKey)) {
    return filtersMemoryCache.get(normKey);
  }
  try {
    const raw = sessionStorage.getItem(`cache_filt_${normKey}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed) {
        filtersMemoryCache.set(normKey, parsed);
        return parsed;
      }
    }
  } catch (e) {}
  return null;
};

export const setCachedFilters = (key, filters) => {
  if (!key || !filters) return;
  const normKey = normalizeCategory(key);
  filtersMemoryCache.set(normKey, filters);
  try {
    sessionStorage.setItem(`cache_filt_${normKey}`, JSON.stringify(filters));
  } catch (e) {}
};
