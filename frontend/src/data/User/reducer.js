import { createSlice } from "@reduxjs/toolkit";
import * as types from "../actionTypes";

const initialState = {
  current: false,
  logged_in: false,
  credentials: false,
  library_index: false,
  requests: false,
  email: false,
  reviews: {},
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(types.LOGIN, (state, action) => {
        state.current = action.data.user;
        state.logged_in = true;
      })
      .addCase(types.LOGOUT, (state) => {
        state.current = false;
        state.logged_in = false;
        state.credentials = false;
      })
      .addCase(types.CREDENTIALS, (state, action) => {
        state.credentials = action.credentials;
      })
      .addCase(types.CREDENTIALS_EMAIL, (state, action) => {
        state.email = action.credentials;
      })
      .addCase(types.LIBRARIES_INDEX, (state, action) => {
        state.library_index = action.libraries;
      })
      .addCase(types.LOGIN_ADMIN, (state, action) => {
        state.logged_in = true;
        state.credentials = {
          plexToken: action.credentials.token,
        };
        state.current = action.credentials.username;
      })
      .addCase(types.GET_REQUESTS, (state, action) => {
        state.requests = action.requests;
      })
      .addCase(types.GET_REVIEWS, (state, action) => {
        state.reviews[action.id] = action.reviews;
      })
      .addCase(types.UPDATE_QUOTA, (state, action) => {
        if (state.current) {
          state.current.quotaCount = action.quota;
        }
      });
  },
});

export default userSlice.reducer;
