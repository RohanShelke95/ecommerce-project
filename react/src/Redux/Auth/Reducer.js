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
  customers: [],
  fetchingUser: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_REQUEST:
    case LOGIN_REQUEST:
      return { ...state, isLoading: true, error: null, user: null };

    case REGISTER_SUCCESS:
      // Store JWT response immediately; getUser() will overwrite with full profile
      return { ...state, isLoading: false, error: null, user: action.payload };
    case REGISTER_FAILURE:
    case LOGIN_FAILURE:
      return { ...state, isLoading: false, error: action.payload };
    case LOGIN_SUCCESS:
      return { ...state, isLoading: false, error: null };
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
