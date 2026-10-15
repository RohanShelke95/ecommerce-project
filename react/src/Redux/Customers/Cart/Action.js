import axios from "axios";
import { API_BASE_URL } from "../../../config/api";
import {
  ADD_ITEM_TO_CART_REQUEST,
  ADD_ITEM_TO_CART_SUCCESS,
  ADD_ITEM_TO_CART_FAILURE,
  GET_CART_FAILURE,
  GET_CART_REQUEST,
  GET_CART_SUCCESS,
  REMOVE_CART_ITEM_FAILURE,
  REMOVE_CART_ITEM_SUCCESS,
  UPDATE_CART_ITEM_FAILURE,
  UPDATE_CART_ITEM_SUCCESS,
  OPTIMISTIC_UPDATE_CART_ITEM,
  OPTIMISTIC_ADD_CART_ITEM,
} from "./ActionType";

const getErrorMessage = (error) => {
  if (error.response && error.response.data) {
    return (
      error.response.data.error ||
      error.response.data.message ||
      error.response.data.details ||
      error.message
    );
  }
  return error.message;
};

// Singleton in-flight request tracker to prevent redundant duplicate cart fetches
let inFlightGetCart = null;

export const getCart = (jwt) => async (dispatch) => {
  if (!jwt) return;
  if (inFlightGetCart) return inFlightGetCart;

  inFlightGetCart = (async () => {
    try {
      dispatch({ type: GET_CART_REQUEST });
      const config = {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.get(`${API_BASE_URL}/api/cart/`, config);
      dispatch({ type: GET_CART_SUCCESS, payload: data });
      return data;
    } catch (error) {
      dispatch({ type: GET_CART_FAILURE, payload: getErrorMessage(error) });
    } finally {
      inFlightGetCart = null;
    }
  })();

  return inFlightGetCart;
};

export const addItemToCart = (reqData) => async (dispatch) => {
  // Optimistically add the item to cart immediately so the UI reflects it instantly
  dispatch({
    type: OPTIMISTIC_ADD_CART_ITEM,
    payload: {
      id: `temp_${Date.now()}`,
      product: reqData.cartItem?.product || reqData.product || null,
      size: reqData.cartItem?.size || reqData.data?.size || "",
      quantity: reqData.cartItem?.quantity || reqData.data?.quantity || 1,
      imageUrl: (reqData.cartItem?.product?.imageUrl || reqData.product?.imageUrl) ?? "",
    },
  });

  try {
    dispatch({ type: ADD_ITEM_TO_CART_REQUEST });
    const config = {
      headers: {
        Authorization: `Bearer ${reqData.jwt}`,
        "Content-Type": "application/json",
      },
    };
    await axios.put(`${API_BASE_URL}/api/cart/add`, reqData.data, config);
    dispatch({ type: ADD_ITEM_TO_CART_SUCCESS });
    // Sync with real server data to replace temp IDs and confirm totals
    dispatch(getCart(reqData.jwt));
  } catch (error) {
    dispatch({
      type: ADD_ITEM_TO_CART_FAILURE,
      payload: getErrorMessage(error),
    });
    // Revert by fetching real cart state
    dispatch(getCart(reqData.jwt));
  }
};

export const removeCartItem = (reqData) => async (dispatch) => {
  // Optimistically remove item immediately — UI updates instantly
  dispatch({
    type: REMOVE_CART_ITEM_SUCCESS,
    payload: reqData.cartItemId,
  });

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${reqData.jwt}`,
        "Content-Type": "application/json",
      },
    };
    await axios.delete(
      `${API_BASE_URL}/api/cart_items/${reqData.cartItemId}`,
      config
    );
    // Sync with server to confirm (no extra loading state shown)
    dispatch(getCart(reqData.jwt));
  } catch (error) {
    dispatch({ type: REMOVE_CART_ITEM_FAILURE, payload: getErrorMessage(error) });
    // Revert on error
    dispatch(getCart(reqData.jwt));
  }
};

export const updateCartItem = (reqData) => async (dispatch) => {
  const newQuantity = reqData.data?.quantity;

  // Optimistically update quantity + price totals immediately
  if (newQuantity !== undefined) {
    dispatch({
      type: OPTIMISTIC_UPDATE_CART_ITEM,
      payload: {
        cartItemId: reqData.cartItemId,
        quantity: newQuantity,
      },
    });
  }

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${reqData.jwt}`,
        "Content-Type": "application/json",
      },
    };
    await axios.put(
      `${API_BASE_URL}/api/cart_items/${reqData.cartItemId}`,
      reqData.data,
      config
    );
    dispatch({ type: UPDATE_CART_ITEM_SUCCESS });
    // Sync with server in background to confirm real totals
    dispatch(getCart(reqData.jwt));
  } catch (error) {
    dispatch({
      type: UPDATE_CART_ITEM_FAILURE,
      payload: getErrorMessage(error),
    });
    // Revert on error
    dispatch(getCart(reqData.jwt));
  }
};