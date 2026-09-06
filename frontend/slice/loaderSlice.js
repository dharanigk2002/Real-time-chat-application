import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loader: false,
};

const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    showLoader(state) {
      state.loader = true;
    },
    hideLoader(state) {
      state.loader = false;
    },
  },
});

export const { showLoader, hideLoader, setToken } = loaderSlice.actions;
export const getLoader = (state) => state.loader.loader;

export default loaderSlice.reducer;
