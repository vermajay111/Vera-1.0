import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = { value: Cookies.get("username") };

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    user_refresh: (state) => {
      state.value = Cookies.get("username");
    },
  },
});

export const { user_refresh } = userSlice.actions;

export default userSlice.reducer;
