import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AppState {
  totalTime: number;
  score: number;
}

export interface UpdateTimeWithScalePayload {
  totalTime: number;
  timeScale: number;
}

export const initialState: AppState = {
  totalTime: 0,
  score: 0,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    resetApp: () => initialState,
    updateTime: (state, action: PayloadAction<number>) => {
      state.totalTime = action.payload;
    },
    updateTimeWithScale: (
      state,
      action: PayloadAction<UpdateTimeWithScalePayload>
    ) => {
      state.totalTime = action.payload.totalTime;
    },
    incrementScore: (state, action: PayloadAction<number>) => {
      state.score += action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action): action is PayloadAction<{ app: AppState }> =>
        action.type === "REPLACE_STATE",
      (state, action) => {
        if (action.payload.app) {
          return action.payload.app;
        }
        return state;
      }
    );
  },
});

export const { updateTime, incrementScore, resetApp, updateTimeWithScale } =
  appSlice.actions;

export default appSlice.reducer;
