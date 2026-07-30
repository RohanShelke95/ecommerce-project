import axios from "axios";
import api, { API_BASE_URL } from "../../../config/api";


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

export const getCategories = () => async (dispatch) => {
  dispatch({ type: GET_CATEGORIES_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/api/admin/categories/`);
    dispatch({ type: GET_CATEGORIES_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: GET_CATEGORIES_FAILURE, payload: error.message });
  }
};

export const createCategory = (categoryData) => async (dispatch) => {
  dispatch({ type: CREATE_CATEGORY_REQUEST });
  try {
    const response = await api.post(`${API_BASE_URL}/api/admin/categories/`, categoryData);
    dispatch({ type: CREATE_CATEGORY_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: CREATE_CATEGORY_FAILURE, payload: error.message });
  }
};

export const deleteCategory = (categoryId) => async (dispatch) => {
  dispatch({ type: DELETE_CATEGORY_REQUEST });
  try {
    await api.delete(`${API_BASE_URL}/api/admin/categories/${categoryId}`);
    dispatch({ type: DELETE_CATEGORY_SUCCESS, payload: categoryId });
  } catch (error) {
    dispatch({ type: DELETE_CATEGORY_FAILURE, payload: error.message });
  }
};
