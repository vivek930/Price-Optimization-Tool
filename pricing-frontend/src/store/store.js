// Redux store configuration using Redux Toolkit and Redux-Saga

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/slices/authSlice";
import snackbarReducer from "../store/slices/snackbarSlice";
import productReducer from "../store/slices/productsSlice";
import modalReducer from "../store/slices/modalsSlice";
import rootSaga from "./rootSaga";
import createSagaMiddleware from "redux-saga";

// Create the saga middleware instance
const sagaMiddleWare = createSagaMiddleware();

// Configure the Redux store
export const store = configureStore({
  reducer: {
    auth: authReducer, // Handles authentication state
    snackbar: snackbarReducer, // Handles global notifications
    product: productReducer, // Handles product-related state
    modals: modalReducer, // Handles modal open/close state
  },
  // Replace default thunk middleware with saga middleware
  middleware: (getDefault) =>
    getDefault({ thunk: false }).concat(sagaMiddleWare),
});

// Run the root saga after the store is created
sagaMiddleWare.run(rootSaga);
