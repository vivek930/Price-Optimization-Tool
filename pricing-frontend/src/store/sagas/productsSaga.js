// Handles product CRUD side effects (get, create, update, delete)

import axios from "axios";
import { call, put, takeLatest, delay } from "redux-saga/effects";
import { axiosInstance } from "../../api/axiosInstance";
import {
  getProductSucceeded,
  getProductError,
  getProductRequested,
  createProductError,
  createProductSucceeded,
  createProductRequested,
  updateProductSucceeded,
  updateProductError,
  updateProductRequested,
  deleteProductSucceeded,
  deleteProductError,
  deleteProductRequested,
} from "../slices/productsSlice";
import { enqueueNotification } from "../slices/snackbarSlice";

//Fetch all products for a given user with optional search and category filters
function* getProductSaga(action) {
  const source = axios.CancelToken.source();

  try {
    const { userId, search, category } = action.payload;

    // Build query parameters
    const params = new URLSearchParams();
    if (search && search.trim() !== "") {
      params.append("search", search.trim());
    }
    if (category && category.trim() !== "") {
      params.append("category", category.trim());
    }

    const queryString = params.toString();
    const url = `/products/user/${userId}${
      queryString ? `?${queryString}` : ""
    }`;

    const response = yield call([axiosInstance, axiosInstance.get], url, {
      cancelToken: source.token,
    });

    // yield delay(5000);
    yield put(getProductSucceeded(response.data));
  } catch (err) {
    if (!axios.isCancel(err)) {
      const msg = err?.response?.data?.detail || "Request failed";
      yield put(getProductError(msg));
      yield put(enqueueNotification({ text: msg, variant: "error" }));
    }
  }
}

//Create a new product
function* createProductSaga(action) {
  try {
    const response = yield call(
      [axiosInstance, axiosInstance.post],
      "/products/",
      action.payload
    );
    yield put(createProductSucceeded(response.data));
    yield put(
      enqueueNotification({
        text: `Product ${response.data.name} has been successfully created.`,
      })
    );
  } catch (err) {
    const msg = err?.response?.data?.detail || "Create failed";
    yield put(createProductError(msg));
    yield put(enqueueNotification({ text: msg, variant: "error" }));
  }
}

//Update an existing product
function* updateProductSaga(action) {
  try {
    const id = action.payload.productId;
    const data = action.payload.form;
    const name = data.name;

    console.log("action in testing: ", action.payload);

    const response = yield call(
      [axiosInstance, axiosInstance.put],
      `/products/${id}`,
      data
    );
    yield put(updateProductSucceeded(response.data));
    yield put(
      enqueueNotification({
        text: `Product ${name} has been successfully updated.`,
      })
    );
  } catch (err) {
    const msg = err?.response?.data?.detail || "Update failed";
    yield put(updateProductError(msg));
    yield put(enqueueNotification({ text: msg, variant: "error" }));
  }
}

//Delete a product by ID
function* deleteProductSaga(action) {
  try {
    const id = action.payload.productId;
    const name = action.payload.productName;
    yield call([axiosInstance, axiosInstance.delete], `/products/${id}`);
    yield put(deleteProductSucceeded(id));
    yield put(
      enqueueNotification({
        text: `Product ${name} has been successfully deleted.`,
      })
    );
  } catch (err) {
    const msg = err?.response?.data?.detail || "Delete failed";
    yield put(deleteProductError(msg));
    yield put(enqueueNotification({ text: msg, variant: "error" }));
  }
}

//Root watcher saga for product operations
export default function* productSaga() {
  yield takeLatest(getProductRequested.type, getProductSaga);
  yield takeLatest(createProductRequested.type, createProductSaga);
  yield takeLatest(updateProductRequested.type, updateProductSaga);
  yield takeLatest(deleteProductRequested.type, deleteProductSaga);
}
