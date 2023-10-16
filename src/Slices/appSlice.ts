// appSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AppState {
  totalTime: number;
}

export const initialState: AppState = {
  totalTime: 0,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    resetApp: () => initialState,
    updateTime: (state, action: PayloadAction<number>) => {
      state.totalTime = action.payload;
    },
  },
});

export const { updateTime, resetApp } = appSlice.actions;

export default appSlice.reducer;
