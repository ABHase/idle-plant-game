import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { updateTime } from "./appSlice"; // Make sure the path is correct

// PlantTime State
export interface PlantTimeState {
  year: number;
  season: string;
  day: number;
  hour: number;
  update_counter: number;
  is_day: boolean;
}

export const initialPlantTimeState: PlantTimeState = {
  year: 1,
  season: "Spring",
  day: 1,
  hour: 0,
  update_counter: 0,
  is_day: true,
};

const plantTimeSlice = createSlice({
  name: "plantTime",
  initialState: initialPlantTimeState,
  reducers: {
    resetPlantTime: () => initialPlantTimeState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateTime, (state, action: PayloadAction<number>) => {
        // Increase update_counter by 5
        state.update_counter += 5;

        // Check for hour turnover
        if (state.update_counter >= 60) {
          state.update_counter -= 60;
          state.hour += 1;

          // Check for day turnover
          if (state.hour >= 24) {
            state.hour = 0;
            state.day += 1;

            // Check for season turnover
            if (state.day > 30) {
              state.day = 1;
              const seasons = ["Spring", "Summer", "Autumn", "Winter"];
              const currentSeasonIndex = seasons.indexOf(state.season);
              const nextSeasonIndex = (currentSeasonIndex + 1) % 4;
              state.season = seasons[nextSeasonIndex];

              // Check for year turnover (when rolling from Winter to Spring)
              if (state.season === "Spring") {
                state.year += 1;
              }
            }
          }
        }
      })
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

export const { resetPlantTime } = plantTimeSlice.actions;
export default plantTimeSlice.reducer;
