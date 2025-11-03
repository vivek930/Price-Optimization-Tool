// Redux slice to manage the state of various modals in the app
import { createSlice } from "@reduxjs/toolkit";

// Initial state for modal visibility and selected product data
const initialState = {
  isCreateProductModalOpen: false,
  isUpdateProductModalOpen: false,
  isDeleteProductModalOpen: false,
  isDemandForecastModalOpen: false,
  productToUpdate: null, // Holds product data when updating or deleting
};

const modalsSlice = createSlice({
  name: "modalsStateSlice",
  initialState,
  reducers: {
    // CREATE PRODUCT MODAL
    openCreateProductModal: (state) => {
      state.isCreateProductModalOpen = true;
    },
    closeCreateProductModal: (state) => {
      state.isCreateProductModalOpen = false;
    },

    // UPDATE PRODUCT MODAL
    openUpdateProductModal: (state, action) => {
      state.isUpdateProductModalOpen = true;
      state.productToUpdate = action.payload;
    },
    closeUpdateProductModal: (state) => {
      state.isUpdateProductModalOpen = false;
      state.productToUpdate = null;
    },

    // DELETE PRODUCT MODAL
    openDeleteProductModal: (state, action) => {
      state.isDeleteProductModalOpen = true;
      state.productToUpdate = action.payload;
    },
    closeDeleteProductModal: (state) => {
      state.isDeleteProductModalOpen = false;
      state.productToUpdate = null;
    },

    // DEMAND FORECAST MODAL
    openDemandForecastModal: (state) => {
      state.isDemandForecastModalOpen = true;
    },
    closeDemandForecastModal: (state) => {
      state.isDemandForecastModalOpen = false;
    },
  },
});

// Export actions for use in components
export const {
  openCreateProductModal,
  closeCreateProductModal,
  openUpdateProductModal,
  closeUpdateProductModal,
  openDeleteProductModal,
  closeDeleteProductModal,
  openDemandForecastModal,
  closeDemandForecastModal,
} = modalsSlice.actions;

// Export reducer for store
export default modalsSlice.reducer;
