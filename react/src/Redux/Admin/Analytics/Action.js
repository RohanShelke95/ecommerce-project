import axios from "axios";
import { API_BASE_URL } from "../../../config/api";
import {
  GET_ANALYTICS_FAILURE,
  GET_ANALYTICS_REQUEST,
  GET_ANALYTICS_SUCCESS,
} from "./ActionType";

export const getAdminAnalytics = (jwt) => async (dispatch) => {
  dispatch({ type: GET_ANALYTICS_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/api/admin/analytics/`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    dispatch({ type: GET_ANALYTICS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_ANALYTICS_FAILURE, payload: error.message });
  }
};
