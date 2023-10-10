import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlantTimeState } from './plantTimeSlice'; // Assuming you've exported PlantTimeState from plantTimeSlice.ts

// Initial state for PlantTime (make sure to update this if it changes in plantTimeSlice.ts)
const initialPlantTimeState: PlantTimeState = {
  year: 1,
  season: 'Spring',
  day: 1,
  hour: 6,
  update_counter: 0,
  is_day: true,
};

// State Type
interface AppState {
  totalTime: number;
  plantTime: PlantTimeState;
}

const initialAppState: AppState = {
  totalTime: 0,
  plantTime: initialPlantTimeState,
};

const appSlice = createSlice({
  name: 'app',
  initialState: initialAppState,
  reducers: {
    updateTime: (state, action: PayloadAction<number>) => {
      state.totalTime = action.payload;
    },
  },
});

export const { updateTime } = appSlice.actions;

export default appSlice.reducer;
