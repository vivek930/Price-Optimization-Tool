// Handles authentication-related side effects (login & signup) with cookie debugging

import { call, put, takeLatest } from "redux-saga/effects";
import {
  loginError,
  loginRequested,
  loginSucceeded,
  signupError,
  signupRequested,
  signupSucceeded,
} from "../slices/authSlice";
import { enqueueNotification } from "../slices/snackbarSlice";
import { axiosInstance, setUserInfo } from "../../api/axiosInstance";

/*
 * Handles login flow with cookie debugging:
 *  - Calls login API with email/password
 *  - Server sets HTTP-only cookies automatically
 *  - Stores user info (not tokens) in localStorage
 *  - Dispatches success/failure actions
 *  - Navigates on success
 */
function* loginSaga(action) {
  try {
    const { email, password } = action.payload.form;
    const navigate = action.payload.navigate;

    // For cookie-based auth, use the JSON login endpoint
    const response = yield call(
      [axiosInstance, axiosInstance.post],
      "/auth/login",
      {
        email: email,
        password: password,
      }
    );

    const data = response.data;

    // Store user info in localStorage (tokens are in HTTP-only cookies)
    setUserInfo({
      user_name: data.user_name,
      user_id: data.user_id,
      role: data.role,
    });

    // Dispatch success + redirect
    yield put(loginSucceeded());
    navigate("/dashboard");
    yield put(enqueueNotification({ text: "Successfully logged in." }));
  } catch (err) {
    const errorMsg = err.response?.data?.detail || "Login failed";
    yield put(loginError(errorMsg));
    yield put(enqueueNotification({ text: errorMsg, variant: "error" }));
  }
}

/*
 * Handles signup flow:
 *  - Calls signup API with user data
 *  - Dispatches success/failure actions
 *  - Navigates on success
 */
function* signupSaga(action) {
  try {
    const { name, email, password, role } = action.payload.form;
    const navigate = action.payload.navigate;

    yield call([axiosInstance, axiosInstance.post], "/auth/signup", {
      name,
      email,
      password,
      role,
    });

    yield put(signupSucceeded());
    navigate("/");
    yield put(
      enqueueNotification({
        text: "Signup complete. Please log in to continue.",
      })
    );
  } catch (err) {
    const errorMsg = err.response?.data?.detail || "Signup failed";
    yield put(signupError(errorMsg));
    yield put(enqueueNotification({ text: errorMsg, variant: "error" }));
  }
}

//Root watcher saga for authentication
export default function* authSaga() {
  yield takeLatest(loginRequested.type, loginSaga);
  yield takeLatest(signupRequested.type, signupSaga);
}

//Latest working code
