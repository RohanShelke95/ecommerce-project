import {
  GET_ANALYTICS_FAILURE,
  GET_ANALYTICS_REQUEST,
  GET_ANALYTICS_SUCCESS,
} from "./ActionType";

const initialState = {
  analytics: null,
  loading: false,
  error: null,
};

export const analyticsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ANALYTICS_REQUEST:
      return { ...state, loading: true, error: null };
    case GET_ANALYTICS_SUCCESS:
      return { ...state, loading: false, analytics: action.payload };
    case GET_ANALYTICS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
