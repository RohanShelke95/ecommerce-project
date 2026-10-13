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
  REMOVE_CART_ITEM_REQUEST,
  REMOVE_CART_ITEM_SUCCESS,
  UPDATE_CART_ITEM_FAILURE,
  UPDATE_CART_ITEM_REQUEST,
  UPDATE_CART_ITEM_SUCCESS,
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
      dispatch({
        type: GET_CART_SUCCESS,
        payload: data,
      });
      return data;
    } catch (error) {
      dispatch({
        type: GET_CART_FAILURE,
        payload: getErrorMessage(error),
      });
    } finally {
      inFlightGetCart = null;
    }
  })();

  return inFlightGetCart;
};

export const addItemToCart = (reqData) => async (dispatch) => {
  try {
    dispatch({ type: ADD_ITEM_TO_CART_REQUEST });
    const config = {
      headers: {
        Authorization: `Bearer ${reqData.jwt}`,
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.put(
      `${API_BASE_URL}/api/cart/add`,
      reqData.data,
      config
    );
    dispatch({
      type: ADD_ITEM_TO_CART_SUCCESS,
      payload: data,
    });
    // Immediately fetch updated cart totals
    dispatch(getCart(reqData.jwt));
  } catch (error) {
    dispatch({
      type: ADD_ITEM_TO_CART_FAILURE,
      payload: getErrorMessage(error),
    });
  }
};

export const removeCartItem = (reqData) => async (dispatch) => {
  try {
    dispatch({ type: REMOVE_CART_ITEM_REQUEST });
    const config = {
      headers: {
        Authorization: `Bearer ${reqData.jwt}`,
        "Content-Type": "application/json",
      },
    };
    // Optimistic item removal
    dispatch({
      type: REMOVE_CART_ITEM_SUCCESS,
      payload: reqData.cartItemId,
    });

    await axios.delete(
      `${API_BASE_URL}/api/cart_items/${reqData.cartItemId}`,
      config
    );
    dispatch(getCart(reqData.jwt));
  } catch (error) {
    dispatch({
      type: REMOVE_CART_ITEM_FAILURE,
      payload: getErrorMessage(error),
    });
    dispatch(getCart(reqData.jwt));
  }
};

export const updateCartItem = (reqData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_CART_ITEM_REQUEST });
    const config = {
      headers: {
        Authorization: `Bearer ${reqData.jwt}`,
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.put(
      `${API_BASE_URL}/api/cart_items/${reqData.cartItemId}`,
      reqData.data,
      config
    );
    dispatch({
      type: UPDATE_CART_ITEM_SUCCESS,
      payload: data,
    });
    dispatch(getCart(reqData.jwt));
  } catch (error) {
    dispatch({
      type: UPDATE_CART_ITEM_FAILURE,
      payload: getErrorMessage(error),
    });
  }
};