// timeBoostSlice.ts

import { createSlice } from "@reduxjs/toolkit";

export type TimeBoostState = boolean;

const timeBoostSlice = createSlice({
  name: "timeBoost",
  initialState: false as TimeBoostState,
  reducers: {
    activateTimeBoost: (state) => true,
    deactivateTimeBoost: (state) => false,
  },
});

export const initialState: TimeBoostState = false;

export const { activateTimeBoost, deactivateTimeBoost } =
  timeBoostSlice.actions;

export default timeBoostSlice.reducer;
