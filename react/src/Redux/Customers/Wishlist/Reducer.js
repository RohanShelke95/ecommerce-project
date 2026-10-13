import {
  ADD_ITEM_TO_WISHLIST_FAILURE,
  ADD_ITEM_TO_WISHLIST_REQUEST,
  ADD_ITEM_TO_WISHLIST_SUCCESS,
  GET_USER_WISHLIST_FAILURE,
  GET_USER_WISHLIST_REQUEST,
  GET_USER_WISHLIST_SUCCESS,
  REMOVE_WISHLIST_ITEM_FAILURE,
  REMOVE_WISHLIST_ITEM_REQUEST,
  REMOVE_WISHLIST_ITEM_SUCCESS,
} from "./ActionType";

const initialState = {
  wishlist: null,
  loading: false,
  error: null,
};

export const wishlistReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_WISHLIST_REQUEST:
      return { ...state, loading: true, error: null };
    case ADD_ITEM_TO_WISHLIST_REQUEST:
    case REMOVE_WISHLIST_ITEM_REQUEST:
      return { ...state, error: null };
    case ADD_ITEM_TO_WISHLIST_SUCCESS: {
      const currentItems = state.wishlist?.wishlistItems || [];
      const alreadyExists = currentItems.some(
        (item) => item.product?.id === action.payload?.product?.id
      );
      return {
        ...state,
        wishlist: {
          ...state.wishlist,
          wishlistItems: alreadyExists
            ? currentItems
            : [...currentItems, action.payload],
        },
        loading: false,
      };
    }
    case GET_USER_WISHLIST_SUCCESS:
      return { ...state, wishlist: action.payload, loading: false };
    case REMOVE_WISHLIST_ITEM_SUCCESS:
      return {
        ...state,
        wishlist: {
          ...state.wishlist,
          wishlistItems: (state.wishlist?.wishlistItems || []).filter(
            (item) =>
              item.id !== action.payload &&
              (!action.productId || item.product?.id !== action.productId)
          ),
        },
        loading: false,
      };
    case ADD_ITEM_TO_WISHLIST_FAILURE:
    case GET_USER_WISHLIST_FAILURE:
    case REMOVE_WISHLIST_ITEM_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
