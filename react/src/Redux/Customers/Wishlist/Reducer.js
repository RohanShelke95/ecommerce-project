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
  OPTIMISTIC_ADD_WISHLIST_ITEM,
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

    // Optimistic add: instantly add product to wishlist items
    case OPTIMISTIC_ADD_WISHLIST_ITEM: {
      const newItem = action.payload;
      const currentItems = state.wishlist?.wishlistItems || [];
      const alreadyExists = currentItems.some(
        (item) => item.product?.id === newItem?.product?.id
      );
      return {
        ...state,
        wishlist: {
          ...state.wishlist,
          wishlistItems: alreadyExists
            ? currentItems
            : [...currentItems, newItem],
        },
      };
    }

    case ADD_ITEM_TO_WISHLIST_SUCCESS:
      return { ...state, loading: false };

    // Server is the source of truth — merge pending optimistic items with server items
    case GET_USER_WISHLIST_SUCCESS: {
      const serverItems = action.payload?.wishlistItems || [];
      const currentItems = state.wishlist?.wishlistItems || [];
      const pendingTempItems = currentItems.filter((item) => {
        if (!String(item.id).startsWith("temp_")) return false;
        const itemProdId = item.product?.id || item.product?._id;
        const existsInServer = serverItems.some((sItem) => {
          const sProdId = sItem.product?.id || sItem.product?._id;
          return itemProdId && sProdId && String(sProdId) === String(itemProdId);
        });
        return !existsInServer;
      });

      return {
        ...state,
        wishlist: {
          ...action.payload,
          wishlistItems: [...serverItems, ...pendingTempItems],
        },
        loading: false,
      };
    }

    case REMOVE_WISHLIST_ITEM_SUCCESS:
      return {
        ...state,
        wishlist: {
          ...state.wishlist,
          wishlistItems: (state.wishlist?.wishlistItems || []).filter(
            (item) =>
              String(item.id) !== String(action.payload) &&
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
