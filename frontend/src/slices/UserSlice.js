import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  username: Cookies.get("username") || null,
  first_name: Cookies.get("first_name") || null,
  last_name: Cookies.get("last_name") || null,
  profile_photo: Cookies.get("profile_photo") || null,
  bio: Cookies.get("bio") || null,
  unread_notifications:
    Cookies.get("unread_notifications") === "true" ? true : false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    user_refresh: (state) => {
      state.username = Cookies.get("username") || null;
      state.first_name = Cookies.get("first_name") || null;
      state.last_name = Cookies.get("last_name") || null;
      state.profile_photo = Cookies.get("profile_photo") || null;
      state.bio = Cookies.get("bio") || null;
      state.unread_notifications =
        Cookies.get("unread_notifications") === "true" ? true : false;
    },

    notifcations_refresh: (state) => {
      state.unread_notifications =
        Cookies.get("unread_notifications") === "true" ? true : false;
    },
  },
});

export const { user_refresh, notfications_refresh } = userSlice.actions;

export default userSlice.reducer;
