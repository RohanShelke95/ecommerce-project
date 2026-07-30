import {
  CREATE_CATEGORY_FAILURE,
  CREATE_CATEGORY_REQUEST,
  CREATE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_FAILURE,
  DELETE_CATEGORY_REQUEST,
  DELETE_CATEGORY_SUCCESS,
  GET_CATEGORIES_FAILURE,
  GET_CATEGORIES_REQUEST,
  GET_CATEGORIES_SUCCESS,
} from "./ActionType";

const initialState = {
  categories: [],
  loading: false,
  error: null,
};

export const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CATEGORIES_REQUEST:
    case CREATE_CATEGORY_REQUEST:
    case DELETE_CATEGORY_REQUEST:
      return { ...state, loading: true, error: null };
    case GET_CATEGORIES_SUCCESS:
      return { ...state, loading: false, categories: action.payload };
    case CREATE_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: [...state.categories, action.payload],
      };
    case DELETE_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: state.categories.filter((item) => item.id !== action.payload),
      };
    case GET_CATEGORIES_FAILURE:
    case CREATE_CATEGORY_FAILURE:
    case DELETE_CATEGORY_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
