// Redux slice to manage global notifications/snackbars
import { createSlice } from "@reduxjs/toolkit";

// Initial state: an array of notifications
const initialState = {
  messages: [], // each message: { id, text, variant }
};

let nextId = 0;

const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    // Add a new notification to the queue
    enqueueNotification: (state, action) => {
      state.messages.push({ id: nextId++, ...action.payload });
    },

    // Remove a notification by ID
    removeNotification: (state, action) => {
      state.messages = state.messages.filter(
        (msg) => msg.id !== action.payload
      );
    },
  },
});

// Export actions for use in components
export const { enqueueNotification, removeNotification } =
  snackbarSlice.actions;

// Export reducer for store
export default snackbarSlice.reducer;
