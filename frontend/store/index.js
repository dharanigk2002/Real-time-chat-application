import { configureStore } from "@reduxjs/toolkit";
import loaderReducer from "../slice/loaderSlice.js";
import userReducer from "../slice/userSlice.js";

const store = configureStore({
  reducer: {
    loader: loaderReducer,
    user: userReducer,
  },
});

export default store;
