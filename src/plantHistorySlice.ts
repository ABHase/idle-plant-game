import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the state for a single plant history entry
export interface PlantHistoryEntry {
    plantID: string;
  datePlanted: string;  
  dayReplaced: string;
  sizeReached: number;
  totalWaterAbsorbed: number;
  totalSunlightAbsorbed: number;
  totalSugarCreated: number;
}

// State for the history slice is an array of PlantHistoryEntry
export interface PlantHistoryState {
  entries: PlantHistoryEntry[];
}

const initialPlantHistoryState: PlantHistoryState = {
  entries: [],
};

const plantHistorySlice = createSlice({
  name: 'plantHistory',
  initialState: initialPlantHistoryState,
  reducers: {
    addPlantToHistory: (state, action: PayloadAction<PlantHistoryEntry>) => {
      state.entries.push(action.payload);
    },
    resetPlantHistory: () => initialPlantHistoryState,
  },
});

export const { addPlantToHistory, resetPlantHistory } = plantHistorySlice.actions;
export default plantHistorySlice.reducer;
