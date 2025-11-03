// Redux slice to manage product-related state (CRUD operations + selections)
import { createSlice } from "@reduxjs/toolkit";

// Initial state for products
const initialState = {
  productDataLoading: false,
  productDataSuccess: false,
  productDataError: false,

  createProductLoading: false,
  createProductSuccess: false,
  createProductError: false,

  updateProductLoading: false,
  updateProductSuccess: false,
  updateProductError: false,

  deleteProductLoading: false,
  deleteProductSuccess: false,
  deleteProductError: false,

  productItems: [], // All products list
  selectedIds: [], // For bulk actions
  errorMessage: "",
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // GET PRODUCTS
    getProductRequested: (state, action) => {
      state.productDataLoading = true;
      state.productDataSuccess = false;
      state.productDataError = false;
    },
    getProductSucceeded: (state, action) => {
      state.productDataLoading = false;
      state.productDataSuccess = true;
      state.productDataError = false;
      state.productItems = action.payload;
    },
    getProductError: (state, action) => {
      state.productDataLoading = false;
      state.productDataSuccess = false;
      state.productDataError = true;
      state.errorMessage = action.payload;
    },

    // CREATE PRODUCT
    createProductRequested: (state, action) => {
      state.createProductLoading = true;
      state.createProductSuccess = false;
      state.createProductError = false;
    },
    createProductSucceeded: (state, action) => {
      state.createProductLoading = false;
      state.createProductSuccess = true;
      state.createProductError = false;
      state.productItems.push(action.payload);
    },
    createProductError: (state, action) => {
      state.createProductLoading = false;
      state.createProductSuccess = false;
      state.createProductError = true;
      state.errorMessage = action.payload;
    },

    // UPDATE PRODUCT
    updateProductRequested: (state, action) => {
      state.updateProductLoading = true;
      state.updateProductSuccess = false;
      state.updateProductError = false;
    },
    updateProductSucceeded: (state, action) => {
      state.updateProductLoading = false;
      state.updateProductSuccess = true;

      // Replace updated product in list
      const index = state.productItems.findIndex(
        (p) => p.id === action.payload.id
      );
      if (index >= 0) state.productItems[index] = action.payload;

      state.updateProductError = false;
    },
    updateProductError: (state, action) => {
      state.updateProductLoading = false;
      state.updateProductSuccess = false;
      state.updateProductError = true;
      state.errorMessage = action.payload;
    },

    // DELETE PRODUCT
    deleteProductRequested: (state, action) => {
      state.deleteProductLoading = true;
      state.deleteProductSuccess = false;
      state.deleteProductError = false;
    },
    deleteProductSucceeded: (state, action) => {
      state.deleteProductLoading = false;
      state.deleteProductSuccess = true;

      // Remove product by ID
      state.productItems = state.productItems.filter(
        (p) => p.id !== action.payload
      );
      state.deleteProductError = false;
    },
    deleteProductError: (state, action) => {
      state.deleteProductLoading = false;
      state.deleteProductSuccess = false;
      state.deleteProductError = true;
      state.errorMessage = action.payload;
    },
    selectedPrdouctsIds: (state, action) => {
      state.selectedIds = action.payload;
    },
  },
});

export const {
  getProductRequested,
  getProductSucceeded,
  getProductError,
  createProductRequested,
  createProductSucceeded,
  createProductError,
  updateProductRequested,
  updateProductSucceeded,
  updateProductError,
  deleteProductRequested,
  deleteProductSucceeded,
  deleteProductError,
  selectedPrdouctsIds,
} = productsSlice.actions;

export default productsSlice.reducer;
