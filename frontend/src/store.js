import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./slices/UserSlice";
import { tokenSlice } from "./slices/TokenSlice";

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    token: tokenSlice.reducer,
  },
});
