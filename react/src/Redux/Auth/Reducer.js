import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE,
  LOGOUT,
  GET_ALL_CUSTOMERS_SUCCESS,
} from "./ActionTypes";

const initialState = {
  user: null,
  isLoading: false,
  error: null,
  successMessage: null,
  customers: [],
  fetchingUser: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_REQUEST:
    case LOGIN_REQUEST:
      return { ...state, isLoading: true, error: null, successMessage: null, user: null };

    case REGISTER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        successMessage: "Registration successful! Welcome to ShopWithUs.",
      };
    case REGISTER_FAILURE:
    case LOGIN_FAILURE:
      return { ...state, isLoading: false, error: action.payload, successMessage: null };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        successMessage: "Logged in successfully! Welcome back.",
      };
    case GET_USER_REQUEST:
      return { ...state, isLoading: true, error: null, fetchingUser: true };
    case GET_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: action.payload,
        fetchingUser: false,
      };
    case GET_ALL_CUSTOMERS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        customers: action.payload,
      };
    case GET_USER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        fetchingUser: false,
      };
    case LOGOUT:
      localStorage.clear();
      return { ...initialState };
    default:
      return state;
  }
};

export default authReducer;
