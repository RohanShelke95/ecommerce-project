import axios from "axios";
import { API_BASE_URL } from "../../../config/api";
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

export const getWishlist = (jwt) => async (dispatch) => {
  dispatch({ type: GET_USER_WISHLIST_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/api/wishlist/`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    dispatch({ type: GET_USER_WISHLIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_USER_WISHLIST_FAILURE, payload: error.message });
  }
};

export const addItemToWishlist = (reqData) => async (dispatch) => {
  // Show loading state immediately so the UI feels responsive
  dispatch({ type: ADD_ITEM_TO_WISHLIST_REQUEST });

  try {
    await axios.post(
      `${API_BASE_URL}/api/wishlist/add/${reqData.productId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${reqData.jwt}`,
        },
      }
    );
    // After successful add, re-fetch the full wishlist so we get the real
    // item with complete product data (title, brand, image, price, etc.)
    dispatch(getWishlist(reqData.jwt));
  } catch (error) {
    dispatch({ type: ADD_ITEM_TO_WISHLIST_FAILURE, payload: error.message });
  }
};

export const removeWishlistItem = (reqData) => async (dispatch) => {
  // Optimistically remove from UI immediately
  dispatch({
    type: REMOVE_WISHLIST_ITEM_SUCCESS,
    payload: reqData.wishlistItemId,
    productId: reqData.productId,
  });

  try {
    await axios.delete(
      `${API_BASE_URL}/api/wishlist/remove/${reqData.wishlistItemId}`,
      {
        headers: {
          Authorization: `Bearer ${reqData.jwt}`,
        },
      }
    );
  } catch (error) {
    dispatch({ type: REMOVE_WISHLIST_ITEM_FAILURE, payload: error.message });
    if (reqData.jwt) dispatch(getWishlist(reqData.jwt));
  }
};
