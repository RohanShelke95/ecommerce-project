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
  const totalPrice = (cartItems || []).reduce(
    (sum, item) => sum + (item?.product?.price ?? item?.price ?? 0) * (item?.quantity || 1),
    0
  );
  const totalDiscountedPrice = (cartItems || []).reduce(
    (sum, item) =>
      sum +
      (item?.product?.discountedPrice ??
        item?.discountedPrice ??
        item?.product?.price ??
        item?.price ??
        0) *
        (item?.quantity || 1),
    0
  );
  const discounte = totalPrice - totalDiscountedPrice;
  const totalItem = (cartItems || []).reduce((sum, item) => sum + (item?.quantity || 1), 0);

  return { totalPrice, totalDiscountedPrice, discounte, totalItem };
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ITEM_TO_CART_REQUEST:
      return { ...state, error: null };

    // Optimistic add: instantly add item + recalculate totals
    case OPTIMISTIC_ADD_CART_ITEM: {
      const newItem = action.payload;
      const newItemProdId = newItem?.product?.id || newItem?.product?._id;
      const existingIndex = state.cartItems.findIndex((i) => {
        const iProdId = i?.product?.id || i?.product?._id;
        return (
          iProdId &&
          newItemProdId &&
          String(iProdId) === String(newItemProdId) &&
          i?.size === newItem?.size
        );
      });
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
        loading: false,
        cartItems: updatedItems,
        cart: { ...(state.cart || {}), ...totals },
      };
    }

    case ADD_ITEM_TO_CART_SUCCESS: {
      const { tempId, cartItem } = action.payload || {};
      if (!tempId) return { ...state, loading: false };

      const updatedItems = (state.cartItems || []).map((item) => {
        if (String(item.id) === String(tempId)) {
          return {
            ...item,
            ...(cartItem || {}),
            product: {
              ...(item.product || {}),
              ...(cartItem?.product || {}),
            },
          };
        }
        return item;
      });
      const totals = recalculateTotals(updatedItems);
      return {
        ...state,
        cartItems: updatedItems,
        cart: { ...(state.cart || {}), ...totals },
        loading: false,
      };
    }

    case ADD_ITEM_TO_CART_FAILURE: {
      const tempId = action.payload?.tempId;
      const updatedItems = tempId
        ? (state.cartItems || []).filter((item) => String(item.id) !== String(tempId))
        : state.cartItems;
      const totals = recalculateTotals(updatedItems);
      return {
        ...state,
        cartItems: updatedItems,
        cart: { ...(state.cart || {}), ...totals },
        loading: false,
        error: action.payload?.error || action.payload,
      };
    }

    case GET_CART_REQUEST:
      return { ...state, loading: state.cartItems.length === 0 };

    case GET_CART_SUCCESS: {
      const serverItems = action.payload?.cartItems || [];

      // Preserve pending optimistic temp items that the server hasn't returned yet, preventing item disappearance
      const pendingTempItems = (state.cartItems || []).filter((item) => {
        if (!String(item.id).startsWith("temp_")) return false;
        const itemProdId = item.product?.id || item.product?._id;
        const existsInServer = serverItems.some((sItem) => {
          const sProdId = sItem.product?.id || sItem.product?._id;
          return (
            ((itemProdId && sProdId && String(sProdId) === String(itemProdId)) ||
              (sItem.id && String(sItem.id) === String(item.id))) &&
            sItem.size === item.size
          );
        });
        return !existsInServer;
      });

      const mergedItems = [...serverItems, ...pendingTempItems];
      const totals = recalculateTotals(mergedItems);
      return {
        ...state,
        cartItems: mergedItems,
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
