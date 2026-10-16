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
  OPTIMISTIC_ADD_WISHLIST_ITEM,
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
  // Optimistically add the item to wishlist immediately so UI updates instantly
  dispatch({
    type: OPTIMISTIC_ADD_WISHLIST_ITEM,
    payload: {
      id: `temp_${Date.now()}`,
      product: reqData.product || null,
    },
  });

  try {
    dispatch({ type: ADD_ITEM_TO_WISHLIST_REQUEST });
    await axios.post(
      `${API_BASE_URL}/api/wishlist/add/${reqData.productId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${reqData.jwt}`,
        },
      }
    );
    // Sync with server to replace temp IDs with real data
    dispatch(getWishlist(reqData.jwt));
  } catch (error) {
    dispatch({ type: ADD_ITEM_TO_WISHLIST_FAILURE, payload: error.message });
    // Revert by fetching real wishlist state
    dispatch(getWishlist(reqData.jwt));
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
