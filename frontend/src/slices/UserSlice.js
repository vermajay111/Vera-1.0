import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  user_id: Cookies.get("user_id") || null,
  username: Cookies.get("username") || null,
  first_name: Cookies.get("first_name") || null,
  last_name: Cookies.get("last_name") || null,
  profile_photo: Cookies.get("profile_photo") || null,
  email: Cookies.get("email") || null,
  bio: Cookies.get("bio") || null,
  tokenCount: Cookies.get("tokenCount") || null,
  unread_notifications: Cookies.get("unread_notifications") === "true",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    user_refresh: (state) => {
      state.user_id = Cookies.get("user_id") || null;
      state.username = Cookies.get("username") || null;
      state.first_name = Cookies.get("first_name") || null;
      state.last_name = Cookies.get("last_name") || null;
      state.profile_photo = Cookies.get("profile_photo") || null;
      state.email = Cookies.get("email") || null;
      state.bio = Cookies.get("bio") || null;
      state.tokenCount = Cookies.get("tokenCount") || null;
      state.unread_notifications =
        Cookies.get("unread_notifications") === "true";
    },

    notifications_refresh: (state) => {
      state.unread_notifications =
        Cookies.get("unread_notifications") === "true";
    },
  },
});

export const { user_refresh, notifications_refresh } =
  userSlice.actions;

export default userSlice.reducer;
