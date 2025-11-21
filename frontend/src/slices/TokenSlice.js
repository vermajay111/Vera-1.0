import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  access: Cookies.get("access"),
  refresh: Cookies.get("refresh"),
};

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    token_refresh: (state) => {
      state.access = Cookies.get("access");
      state.refresh = Cookies.get("refresh");
    },
  },
});

export const { token_refresh } = tokenSlice.actions;
export default tokenSlice.reducer;
