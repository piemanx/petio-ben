import { createSlice } from "@reduxjs/toolkit";
import * as types from "../actionTypes";

const initialState = {
  pages: {},
};

const navSlice = createSlice({
  name: "nav",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(types.STORE_NAV, (state, action) => {
        state.pages[action.path] = {
          state: action.state,
          scroll: action.scroll,
          carousels: action.carousels,
        };
      })
      .addCase(types.CLEAR_NAV, (state) => {
        state.pages = {};
      });
  },
});

export default navSlice.reducer;
