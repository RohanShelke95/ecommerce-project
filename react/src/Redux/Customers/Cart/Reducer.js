import {
  ADD_ITEM_TO_CART_FAILURE,
  ADD_ITEM_TO_CART_REQUEST,
  ADD_ITEM_TO_CART_SUCCESS,
  GET_CART_FAILURE,
  GET_CART_REQUEST,
  GET_CART_SUCCESS,
  REMOVE_CART_ITEM_FAILURE,
  REMOVE_CART_ITEM_REQUEST,
  REMOVE_CART_ITEM_SUCCESS,
  UPDATE_CART_ITEM_FAILURE,
  UPDATE_CART_ITEM_REQUEST,
  UPDATE_CART_ITEM_SUCCESS,
  OPTIMISTIC_UPDATE_CART_ITEM,
  OPTIMISTIC_ADD_CART_ITEM,
} from "./ActionType";

const initialState = {
  cart: null,
  loading: false,
  error: null,
  cartItems: [],
};

// Recalculate cart totals locally from cartItems array — no API needed
const recalculateTotals = (cartItems) => {
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item?.product?.price || 0) * (item?.quantity || 1),
    0
  );
  const totalDiscountedPrice = cartItems.reduce(
    (sum, item) =>
      sum + (item?.product?.discountedPrice || 0) * (item?.quantity || 1),
    0
  );
  const discounte = totalPrice - totalDiscountedPrice;
  const totalItem = cartItems.reduce((sum, item) => sum + (item?.quantity || 1), 0);

  return { totalPrice, totalDiscountedPrice, discounte, totalItem };
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ITEM_TO_CART_REQUEST:
      return { ...state, loading: true, error: null };

    // Optimistic add: instantly add item + recalculate totals
    case OPTIMISTIC_ADD_CART_ITEM: {
      const newItem = action.payload;
      const existingIndex = state.cartItems.findIndex(
        (i) => i?.product?.id === newItem?.product?.id && i?.size === newItem?.size
      );
      let updatedItems;
      if (existingIndex >= 0) {
        // Item already in cart — increase quantity
        updatedItems = state.cartItems.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + (newItem.quantity || 1) }
            : item
        );
      } else {
        updatedItems = [...state.cartItems, newItem];
      }
      const totals = recalculateTotals(updatedItems);
      return {
        ...state,
        loading: true, // still waiting for real API confirmation
        cartItems: updatedItems,
        cart: { ...(state.cart || {}), ...totals },
      };
    }

    case ADD_ITEM_TO_CART_SUCCESS:
      return { ...state, loading: false };

    case ADD_ITEM_TO_CART_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case GET_CART_REQUEST:
      return { ...state, loading: true };

    case GET_CART_SUCCESS: {
        // Server is the source of truth — use its items directly.
        // Discard all temp items; they have been synced or the add failed.
        const serverItems = action.payload.cartItems || [];
        const totals = recalculateTotals(serverItems);
        return {
          ...state,
          cartItems: serverItems,
          cart: { ...(action.payload || {}), ...totals },
          loading: false,
        };
      }

    case GET_CART_FAILURE:
      return { ...state, error: action.payload, loading: false };

    case REMOVE_CART_ITEM_REQUEST:
      return { ...state, error: null };

    case REMOVE_CART_ITEM_SUCCESS: {
      const updatedItems = state.cartItems.filter(
        (item) => String(item.id) !== String(action.payload)
      );
      const totals = recalculateTotals(updatedItems);
      return {
        ...state,
        cartItems: updatedItems,
        cart: { ...(state.cart || {}), ...totals },
        loading: false,
      };
    }

    case REMOVE_CART_ITEM_FAILURE:
      return { ...state, error: action.payload, loading: false };

    case UPDATE_CART_ITEM_REQUEST:
      return { ...state, error: null };

    // Optimistic update: instantly change quantity + recalculate price totals
    case OPTIMISTIC_UPDATE_CART_ITEM: {
      const updatedItems = state.cartItems.map((item) =>
        String(item.id) === String(action.payload.cartItemId)
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      const totals = recalculateTotals(updatedItems);
      return {
        ...state,
        cartItems: updatedItems,
        cart: { ...(state.cart || {}), ...totals },
      };
    }

    case UPDATE_CART_ITEM_SUCCESS:
      return { ...state, loading: false };

    case UPDATE_CART_ITEM_FAILURE:
      return { ...state, error: action.payload, loading: false };

    default:
      return state;
  }
};

export default cartReducer;
