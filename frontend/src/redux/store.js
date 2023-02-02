import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import responseSlice from "./slices/responseSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    response: responseSlice,
  },
});
