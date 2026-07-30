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
  dispatch({ type: ADD_ITEM_TO_WISHLIST_REQUEST });
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/api/wishlist/add/${reqData.productId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${reqData.jwt}`,
        },
      }
    );
    dispatch({ type: ADD_ITEM_TO_WISHLIST_SUCCESS, payload: data });
    // Re-fetch the wishlist to keep the Redux store synchronized
    dispatch(getWishlist(reqData.jwt));
  } catch (error) {
    dispatch({ type: ADD_ITEM_TO_WISHLIST_FAILURE, payload: error.message });
  }
};

export const removeWishlistItem = (reqData) => async (dispatch) => {
  dispatch({ type: REMOVE_WISHLIST_ITEM_REQUEST });
  try {
    const { data } = await axios.delete(
      `${API_BASE_URL}/api/wishlist/remove/${reqData.wishlistItemId}`,
      {
        headers: {
          Authorization: `Bearer ${reqData.jwt}`,
        },
      }
    );
    dispatch({
      type: REMOVE_WISHLIST_ITEM_SUCCESS,
      payload: reqData.wishlistItemId,
    });
  } catch (error) {
    dispatch({ type: REMOVE_WISHLIST_ITEM_FAILURE, payload: error.message });
  }
};
