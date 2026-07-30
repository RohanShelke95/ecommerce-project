import { searchProduct } from "./Action";
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
  DELETE_PRODUCT_FAILURE,
  DELETE_PRODUCT_SUCCESS,
  SEARCH_PRODUCT_SUCCESS,
  SEARCH_PRODUCTS_PAGE_REQUEST,
  SEARCH_PRODUCTS_PAGE_SUCCESS,
  SEARCH_PRODUCTS_PAGE_FAILURE,
} from "./ActionType";

const initialState = {
  products: [],
  product: null,
  loading: false,
  error: null,
  deleteProduct:null,
  searchProducts:[],
  searchResults: null,
  categoryProducts: {} // New field to store products by category
};

const customerProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case FIND_PRODUCTS_BY_CATEGORY_REQUEST:
      return { ...state, loading: true, error: null };
    case FIND_PRODUCTS_BY_CATEGORY_SUCCESS:
      return { 
        ...state, 
        products: action.payload, 
        loading: false,
        categoryProducts: {
          ...state.categoryProducts,
          [action.category]: action.payload.content // Store by category name
        }
      };
    case FIND_PRODUCTS_BY_CATEGORY_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case FIND_PRODUCT_BY_ID_REQUEST:
      return { ...state, loading: true, error: null };
    case FIND_PRODUCT_BY_ID_SUCCESS:
      return { ...state, product: action.payload, loading: false };
    case FIND_PRODUCT_BY_ID_FAILURE:
      return { ...state, loading: false, error: action.payload };
      case CREATE_PRODUCT_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
      case CREATE_PRODUCT_SUCCESS:
        return {
          ...state,
          loading: false,
          products: Array.isArray(state.products) 
            ? [...state.products, action.payload] 
            : (state.products && Array.isArray(state.products.content) 
                ? { ...state.products, content: [...state.products.content, action.payload] }
                : [action.payload]),
        };
        case SEARCH_PRODUCT_SUCCESS:
          return {
            ...state,
            loading: false,
            searchProducts: action.payload,
          };
      case SEARCH_PRODUCTS_PAGE_REQUEST:
        return { ...state, loading: true, error: null };
      case SEARCH_PRODUCTS_PAGE_SUCCESS:
        return {
          ...state,
          loading: false,
          searchResults: action.payload,
        };
      case SEARCH_PRODUCTS_PAGE_FAILURE:
        return { ...state, loading: false, error: action.payload };
      case CREATE_PRODUCT_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      case UPDATE_PRODUCT_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
      case UPDATE_PRODUCT_SUCCESS:
        return {
          ...state,
          loading: false,
          products: Array.isArray(state.products)
            ? state.products.map((product) =>
                product.id === action.payload.id ? action.payload : product
              )
            : (state.products && Array.isArray(state.products.content)
                ? { ...state.products, content: state.products.content.map((product) =>
                    product.id === action.payload.id ? action.payload : product
                  )}
                : state.products),
        };
      case UPDATE_PRODUCT_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      case DELETE_PRODUCT_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
      case DELETE_PRODUCT_SUCCESS: {
        const deletedProductId = action.payload?.productId;
        const updatedCategoryProducts = Object.fromEntries(
          Object.entries(state.categoryProducts).map(([key, products]) => [
            key,
            products.filter((product) => product.id !== deletedProductId),
          ])
        );

        return {
          ...state,
          loading: false,
          deleteProduct: action.payload?.response,
          categoryProducts: updatedCategoryProducts,
          products:
            state.products?.content && deletedProductId
              ? {
                  ...state.products,
                  content: state.products.content.filter(
                    (product) => product.id !== deletedProductId
                  ),
                  totalElements: Math.max(
                    0,
                    (state.products.totalElements || 0) - 1
                  ),
                }
              : state.products,
        };
      }
      case DELETE_PRODUCT_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
    default:
      return state;
  }
};

export default customerProductReducer;
