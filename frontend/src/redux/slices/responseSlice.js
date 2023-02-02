import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  message: "",
  responseStates: null,
};

export const responseSlice = createSlice({
  name: "response",
  initialState,
  reducers: {
    pending: (state) => {
      state.loading = true;
      state.message = "";
      state.responseStates = null;
    },
    success: (state, action) => {
      state.loading = false;
      state.message = action.payload;
      state.responseStates = "success";
    },
    error: (state, action) => {
      state.loading = false;
      state.message = action.payload;
      state.responseStates = "error";
    },
  },
});

export const { pending, success, error } = responseSlice.actions;

export default responseSlice.reducer;
