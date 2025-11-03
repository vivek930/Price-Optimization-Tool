// Redux slice to manage authentication state (login/signup) using Redux Toolkit
import { createSlice } from "@reduxjs/toolkit";

// Initial state for authentication
const initialState = {
  loginRequestedLoading: false,
  loginRequestedSuccess: false,
  loginRequestedError: false,

  signupRequestedLoading: false,
  signupRequestedSuccess: false,
  signupRequestedError: false,

  errorMessage: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // LOGIN ACTIONS
    loginRequested: (state, action) => {
      state.loginRequestedLoading = true;
      state.loginRequestedSuccess = false;
      state.loginRequestedError = false;
    },
    loginSucceeded: (state) => {
      state.loginRequestedLoading = false;
      state.loginRequestedSuccess = true;
      state.loginRequestedError = false;
    },
    loginError: (state, action) => {
      state.loginRequestedLoading = false;
      state.loginRequestedSuccess = false;
      state.loginRequestedError = true;
      state.errorMessage = action.payload;
    },

    // SIGNUP ACTIONS
    signupRequested: (state, action) => {
      state.signupRequestedLoading = true;
      state.signupRequestedSuccess = false;
      state.signupRequestedError = false;
    },
    signupSucceeded: (state) => {
      state.signupRequestedLoading = false;
      state.signupRequestedSuccess = true;
      state.signupRequestedError = false;
    },
    signupError: (state, action) => {
      state.signupRequestedLoading = false;
      state.signupRequestedSuccess = false;
      state.signupRequestedError = true;
      state.errorMessage = action.payload;
    },
  },
});

// Export actions for use in components or sagas
export const {
  loginRequested,
  loginSucceeded,
  loginError,
  signupRequested,
  signupSucceeded,
  signupError,
} = authSlice.actions;

// Export reducer for store configuration
export default authSlice.reducer;

//latest working code
