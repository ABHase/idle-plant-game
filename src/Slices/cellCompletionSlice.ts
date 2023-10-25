//cellCompletionSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Export the state type
export type CellCompletionState = {
  cells: {
    [cellNumber: number]: string | null; // e.g., { 0: 'Fern', 1: 'Grass', ... }
  };
};

export const initialState: CellCompletionState = {
  cells: {},
};

const cellCompletionSlice = createSlice({
  name: "cellCompletion",
  initialState,
  reducers: {
    completeCell: (
      state,
      action: PayloadAction<{ cellNumber: number; plantType: string }>
    ) => {
      const { cellNumber, plantType } = action.payload;
      state.cells[cellNumber] = plantType;
    },
    resetCell: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (
        action
      ): action is PayloadAction<{ cellCompletion: CellCompletionState }> =>
        action.type === "REPLACE_STATE",
      (state, action) => {
        if (action.payload.cellCompletion !== undefined) {
          return action.payload.cellCompletion;
        }
        return state;
      }
    );
  },
});

export const { completeCell, resetCell } = cellCompletionSlice.actions;
export default cellCompletionSlice.reducer;
