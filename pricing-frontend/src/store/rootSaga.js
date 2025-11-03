// Combines all individual sagas into a single root saga for Redux-Saga middleware

import { all, fork } from "redux-saga/effects";
import authSaga from "./sagas/authSaga";
import productSaga from "./sagas/productsSaga";

// Root saga: forks all sagas concurrently
export default function* rootSaga() {
  yield all([
    fork(authSaga), // Handles authentication-related side effects
    fork(productSaga), // Handles product-related side effects
  ]);
}
