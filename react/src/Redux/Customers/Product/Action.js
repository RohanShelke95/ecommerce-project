import axios from "axios";

import {
  FIND_PRODUCTS_BY_CATEGORY_REQUEST,
  FIND_PRODUCTS_BY_CATEGORY_SUCCESS,
  FIND_PRODUCTS_BY_CATEGORY_FAILURE,
  FIND_PRODUCT_BY_ID_REQUEST,
  FIND_PRODUCT_BY_ID_SUCCESS,
  FIND_PRODUCT_BY_ID_FAILURE,
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_FAILURE,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAILURE,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAILURE,
  SEARCH_PRODUCT_REQUEST,
  SEARCH_PRODUCT_SUCCESS,
  SEARCH_PRODUCT_FAILURE,
  SEARCH_PRODUCTS_PAGE_REQUEST,
  SEARCH_PRODUCTS_PAGE_SUCCESS,
  SEARCH_PRODUCTS_PAGE_FAILURE,
} from "./ActionType";
import api, { API_BASE_URL } from "../../../config/api";
import {
  normalizeCategory,
  buildProductCacheKey,
  getCachedProducts,
  setCachedProducts,
} from "../../../utils/categoryCache";

export const findProducts = (reqData) => async (dispatch) => {
  const {
    colors,
    sizes,
    minPrice,
    maxPrice,
    minDiscount,
    category,
    stock,
    sort,
    pageNumber,
    pageSize,
    lavelOne,
  } = reqData;

  const normCategory = normalizeCategory(category);
  const cacheKey = buildProductCacheKey(
    normCategory,
    lavelOne,
    colors,
    sizes,
    minPrice,
    maxPrice,
    minDiscount,
    sort,
    stock,
    pageNumber,
    pageSize
  );

  // 1. Instant Cache Hit: Return data immediately with 0ms latency
  const cachedData = getCachedProducts(cacheKey);
  if (cachedData) {
    dispatch({
      type: FIND_PRODUCTS_BY_CATEGORY_SUCCESS,
      payload: cachedData,
      category: normCategory,
      fromCache: true,
      skipLoading: true,
    });
  } else {
    // Only set loading if no cached data available
    dispatch({ type: FIND_PRODUCTS_BY_CATEGORY_REQUEST });
  }

  try {
    const { data } = await api.get(
      `/api/products?color=${colors || ""}&size=${sizes || ""}&minPrice=${minPrice || 0}&maxPrice=${maxPrice || 100000}&minDiscount=${minDiscount || 0}&category=${normCategory}&stock=${stock || ""}&sort=${sort || "price_low"}&pageNumber=${pageNumber || 0}&pageSize=${pageSize || 10}&lavelOne=${lavelOne || ""}`
    );

    // Save fresh response in cache
    setCachedProducts(cacheKey, data);

    dispatch({
      type: FIND_PRODUCTS_BY_CATEGORY_SUCCESS,
      payload: data,
      category: normCategory,
    });
  } catch (error) {
    // If we already served from cache, don't show full failure
    if (!cachedData) {
      dispatch({
        type: FIND_PRODUCTS_BY_CATEGORY_FAILURE,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  }
};

/**
 * Silent prefetch category products in background (e.g., on hover or idle)
 * Never triggers loading indicators
 */
export const prefetchCategoryProducts = (category, lavelOne = "") => async (dispatch) => {
  if (!category) return;
  const normCategory = normalizeCategory(category);
  const cacheKey = buildProductCacheKey(normCategory, lavelOne);

  if (getCachedProducts(cacheKey)) {
    return; // Already cached
  }

  try {
    const { data } = await api.get(
      `/api/products?color=&size=&minPrice=0&maxPrice=100000&minDiscount=0&category=${normCategory}&stock=&sort=price_low&pageNumber=0&pageSize=10&lavelOne=${lavelOne || ""}`
    );
    setCachedProducts(cacheKey, data);
    dispatch({
      type: FIND_PRODUCTS_BY_CATEGORY_SUCCESS,
      payload: data,
      category: normCategory,
      fromCache: true,
      skipLoading: true,
    });
  } catch (err) {
    // Silent catch for background prefetch
  }
};

export const findProductById = (reqData) => async (dispatch) => {
  try {
    dispatch({ type: FIND_PRODUCT_BY_ID_REQUEST });

    const { data } = await api.get(`/api/products/id/${reqData.productId}`);

    console.log("products by  id : ", data);
    dispatch({
      type: FIND_PRODUCT_BY_ID_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FIND_PRODUCT_BY_ID_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const searchProductsPage = (reqData) => async (dispatch) => {
  const {
    q,
    colors,
    sizes,
    minPrice,
    maxPrice,
    minDiscount,
    stock,
    sort,
    pageNumber,
    pageSize,
  } = reqData;

  try {
    dispatch({ type: SEARCH_PRODUCTS_PAGE_REQUEST });

    const { data } = await api.get(
      `/api/products/search/filtered?q=${encodeURIComponent(q || "")}&color=${colors}&size=${sizes}&minPrice=${minPrice}&maxPrice=${maxPrice}&minDiscount=${minDiscount}&stock=${stock || ""}&sort=${sort || "price_low"}&pageNumber=${pageNumber}&pageSize=${pageSize}`
    );

    dispatch({
      type: SEARCH_PRODUCTS_PAGE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SEARCH_PRODUCTS_PAGE_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const searchProduct = (keyword) => async (dispatch) => {
  try {
    dispatch({ type: SEARCH_PRODUCT_REQUEST });

    const { data } = await api.get(`/api/products/search`,{
      params:{
        q:keyword
      }
    });

    console.log("products by  id : ", data);
    dispatch({
      type: SEARCH_PRODUCT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SEARCH_PRODUCT_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const createProduct = (product) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_PRODUCT_REQUEST });

    const { data } = await api.post(
      `${API_BASE_URL}/api/admin/products/`,
      product.data
    );

    dispatch({
      type: CREATE_PRODUCT_SUCCESS,
      payload: data,
    });

    console.log("created product ", data);
  } catch (error) {
    dispatch({
      type: CREATE_PRODUCT_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateProduct = (product) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PRODUCT_REQUEST });

    const { data } = await api.put(
      `${API_BASE_URL}/api/admin/products/${product.productId}`,
      product
    );

    dispatch({
      type: UPDATE_PRODUCT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_PRODUCT_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteProduct = (productId) => async (dispatch) => {
  console.log("delete product action",productId)
  try {
    dispatch({ type: DELETE_PRODUCT_REQUEST });

    let {data}=await api.delete(`/api/admin/products/${productId}/delete`);

    dispatch({
      type: DELETE_PRODUCT_SUCCESS,
      payload: { response: data, productId },
    });

    console.log("product delte ",data)
  } catch (error) {
    console.log("catch error ",error)
    dispatch({
      type: DELETE_PRODUCT_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
