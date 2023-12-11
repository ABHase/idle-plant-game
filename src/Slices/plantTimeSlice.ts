import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { updateTime, updateTimeWithScale } from "./appSlice"; // Make sure the path is correct

// PlantTime State
export interface PlantTimeState {
  year: number;
  season: string;
  day: number;
  hour: number;
  update_counter: number;
  is_day: boolean;
  rootRotConfirm: boolean;
  showProductionRate: boolean;
  nightMode: boolean;
}

export const initialPlantTimeState: PlantTimeState = {
  year: 1,
  season: "Spring",
  day: 1,
  hour: 0,
  update_counter: 0,
  is_day: true,
  rootRotConfirm: true,
  showProductionRate: false,
  nightMode: false,
};

const plantTimeSlice = createSlice({
  name: "plantTime",
  initialState: initialPlantTimeState,
  reducers: {
    resetPlantTime: () => initialPlantTimeState,
    toggleRootRotConfirm: (state) => {
      state.rootRotConfirm = !state.rootRotConfirm;
    },
    toggleshowProductionRate: (state) => {
      state.showProductionRate = !state.showProductionRate;
    },
    toggleNightMode: (state) => {
      state.nightMode = !state.nightMode;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        updateTimeWithScale,
        (
          state,
          action: PayloadAction<{ totalTime: number; timeScale: number }>
        ) => {
          let additionalMinutes = 5 * action.payload.timeScale;

          while (additionalMinutes > 0) {
            const minutesToAdd = Math.min(
              60 - state.update_counter,
              additionalMinutes
            );

            state.update_counter += minutesToAdd;

            additionalMinutes -= minutesToAdd;

            if (state.update_counter >= 60) {
              state.update_counter -= 60;
              state.hour++;

              if (state.hour >= 24) {
                state.hour = 0;
                state.day++;

                if (state.day > 30) {
                  state.day = 1;
                  const seasons = ["Spring", "Summer", "Autumn", "Winter"];
                  const currentSeasonIndex = seasons.indexOf(state.season);
                  const nextSeasonIndex = (currentSeasonIndex + 1) % 4;
                  state.season = seasons[nextSeasonIndex];

                  if (state.season === "Spring") {
                    state.year++;
                  }
                }
              }
            }
          }
        }
      )
      .addMatcher(
        (action): action is PayloadAction<{ plantTime: PlantTimeState }> =>
          action.type === "REPLACE_STATE",
        (state, action) => {
          if (action.payload.plantTime) {
            return action.payload.plantTime;
          }
          return state;
        }
      );
  },
});

export const {
  resetPlantTime,
  toggleRootRotConfirm,
  toggleshowProductionRate,
  toggleNightMode,
} = plantTimeSlice.actions;
export default plantTimeSlice.reducer;
