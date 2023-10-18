import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TimeBoostState = boolean;

export const initialState: TimeBoostState = false;

const timeBoostSlice = createSlice({
  name: "timeBoost",
  initialState: initialState as TimeBoostState,
  reducers: {
    activateTimeBoost: (state) => true,
    deactivateTimeBoost: (state) => false,
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action): action is PayloadAction<{ timeBoost: TimeBoostState }> =>
        action.type === "REPLACE_STATE",
      (state, action) => {
        if (action.payload.timeBoost !== undefined) {
          return action.payload.timeBoost;
        }
        return state;
      }
    );
  },
});

export const { activateTimeBoost, deactivateTimeBoost } =
  timeBoostSlice.actions;
export default timeBoostSlice.reducer;
