import axios from 'axios';
import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  SEND_OTP_REQUEST,
  SEND_OTP_SUCCESS,
  SEND_OTP_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE,
  LOGOUT,
  GET_ALL_CUSTOMERS_REQUEST,
  GET_ALL_CUSTOMERS_SUCCESS,
  GET_ALL_CUSTOMERS_FAILURE
} from './ActionTypes';
import api, { API_BASE_URL } from '../../config/api';

// Register action creators
const registerRequest = () => ({ type: REGISTER_REQUEST });
const registerSuccess = (user) => ({ type: REGISTER_SUCCESS, payload:user });
const registerFailure = error => ({ type: REGISTER_FAILURE, payload: error });

export const sendOtp = (email) => async (dispatch) => {
  dispatch({ type: SEND_OTP_REQUEST });
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/send-otp`, { email });
    dispatch({
      type: SEND_OTP_SUCCESS,
      payload: response.data?.message || `Verification code sent to ${email}`,
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.response?.data?.error || error.message;
    dispatch({ type: SEND_OTP_FAILURE, payload: message });
    throw new Error(message);
  }
};

export const verifyOtpAndSignup = (signupData) => async (dispatch) => {
  dispatch(registerRequest());
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signup-verify`, signupData);
    const user = response.data;
    if (user.jwt) {
      localStorage.setItem("jwt", user.jwt);
      dispatch(getUser(user.jwt));
    }
    dispatch(
      registerSuccess({
        ...user,
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        email: signupData.email,
      })
    );
    return user;
  } catch (error) {
    const message = error.response?.data?.message || error.response?.data?.error || error.message;
    dispatch(registerFailure(message));
    throw new Error(message);
  }
};

export const register = userData => async dispatch => {
  dispatch(registerRequest());
  try {
    const response=await axios.post(`${API_BASE_URL}/auth/signup`, userData);
    const user = response.data;
    if(user.jwt) {
      localStorage.setItem("jwt", user.jwt);
      // Fetch full user profile asynchronously in background
      dispatch(getUser(user.jwt));
    }
    console.log("registerr :- ",user);
    dispatch(registerSuccess({ ...user, firstName: userData.firstName, lastName: userData.lastName, email: userData.email }));
  } catch (error) {
    console.log("error ",error);
    const message = error.response?.data?.message || error.response?.data?.error || error.message;
    
    // If account was created during a prior request, auto-login seamlessly
    if (message && (message.toLowerCase().includes("already used") || message.toLowerCase().includes("already exist"))) {
      try {
        console.log("Email already registered, attempting auto-login...");
        const loginRes = await axios.post(`${API_BASE_URL}/auth/signin`, {
          email: userData.email,
          password: userData.password,
        });
        const loginData = loginRes.data;
        if (loginData?.jwt) {
          localStorage.setItem("jwt", loginData.jwt);
          await dispatch(getUser(loginData.jwt));
          dispatch(loginSuccess(loginData));
          return;
        }
      } catch (loginErr) {
        console.log("Auto-login fallback failed:", loginErr);
      }
    }
    
    dispatch(registerFailure(message));
  }
};

// Login action creators
const loginRequest = () => ({ type: LOGIN_REQUEST });
const loginSuccess = user => ({ type: LOGIN_SUCCESS, payload: user });
const loginFailure = error => ({ type: LOGIN_FAILURE, payload: error });

export const login = userData => async dispatch => {
  dispatch(loginRequest());
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signin`, userData);
    const user = response.data;
    if(user.jwt) {
      localStorage.setItem("jwt", user.jwt);
      // Fetch full user profile so auth.user is populated immediately
      await dispatch(getUser(user.jwt));
    }
    console.log("login ",user);
    dispatch(loginSuccess(user));
  } catch (error) {
    const message = error.response?.data?.message || error.response?.data?.error || error.message;
    dispatch(loginFailure(message));
  }
};



//  get user from token
export const getAllCustomers = (token) => {
  return async (dispatch) => {
    console.log("jwt - ",token)
    dispatch({ type: GET_ALL_CUSTOMERS_REQUEST });
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/users`,{
        headers:{
          "Authorization":`Bearer ${token}`
        }
      });
      const users = response.data;
      dispatch({ type: GET_ALL_CUSTOMERS_SUCCESS, payload: users });
      console.log("All Customers",users)
    } catch (error) {
      const errorMessage = error.message;
      console.log(error)
      dispatch({ type: GET_ALL_CUSTOMERS_FAILURE, payload: errorMessage });
    }
  };
};

export const getUser = (token) => {
  return async (dispatch) => {
    dispatch({ type: GET_USER_REQUEST });
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/profile`,{
        headers:{
          "Authorization":`Bearer ${token}`
        }
      });
      const user = response.data;
      dispatch({ type: GET_USER_SUCCESS, payload: user });
      console.log("req User ",user)
    } catch (error) {
      const errorMessage = error.message;
      dispatch({ type: GET_USER_FAILURE, payload: errorMessage });
    }
  };
};

export const logout = (token) => {
    return async (dispatch) => {
      dispatch({ type: LOGOUT });
      localStorage.clear();
    };
  };
