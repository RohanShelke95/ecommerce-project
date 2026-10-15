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
        // Merge temporary items (id starts with 'temp_') with real server items based on product id & size
        const tempItems = state.cartItems.filter(item => item.id && item.id.startsWith('temp_'));
        const mergedItems = action.payload.cartItems.map(serverItem => {
          // Find matching temp item
          const match = tempItems.find(t =>
            t.product?.id === serverItem.product?.id && t.size === serverItem.size
          );
          return match ? { ...serverItem, id: serverItem.id } : serverItem;
        });
        // Include any temp items that did not match (unlikely but keep)
        const remainingTemp = tempItems.filter(t =>
          !mergedItems.some(mi => mi.product?.id === t.product?.id && mi.size === t.size)
        );
        const finalItems = [...mergedItems, ...remainingTemp];
        const totals = recalculateTotals(finalItems);
        return {
          ...state,
          cartItems: finalItems,
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
        (item) => item.id !== action.payload
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
        item.id === action.payload.cartItemId
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
