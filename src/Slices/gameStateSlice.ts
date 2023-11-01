// gameStateSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GlobalState {
  geneticMarkerProgress: number;
  geneticMarkerThreshold: number;
  geneticMarkers: number;
  geneticMarkerProgressMoss: number;
  geneticMarkerThresholdMoss: number;
  geneticMarkersMoss: number;
  geneticMarkerProgressSucculent: number;
  geneticMarkerThresholdSucculent: number;
  geneticMarkersSucculent: number;
  geneticMarkerProgressGrass: number;
  geneticMarkerThresholdGrass: number;
  geneticMarkersGrass: number;
  geneticMarkerProgressBush: number;
  geneticMarkerThresholdBush: number;
  geneticMarkersBush: number;
  seeds: number;
  silica: number;
  tannins: number;
  calcium: number;
  fulvic: number;
  costModifier: number;
  currentCell: number;
  difficulty: number;
  globalBoostedTicks: number;
}

export const initialState: GlobalState = {
  geneticMarkerProgress: 0,
  geneticMarkerThreshold: 100,
  geneticMarkers: 0,
  geneticMarkerProgressMoss: 0,
  geneticMarkerThresholdMoss: 10,
  geneticMarkersMoss: 0,
  geneticMarkerProgressSucculent: 0,
  geneticMarkerThresholdSucculent: 100,
  geneticMarkersSucculent: 0,
  geneticMarkerProgressGrass: 0,
  geneticMarkerThresholdGrass: 100,
  geneticMarkersGrass: 0,
  geneticMarkerProgressBush: 0,
  geneticMarkerThresholdBush: 100,
  geneticMarkersBush: 0,
  seeds: 0,
  silica: 0,
  tannins: 0,
  calcium: 0,
  fulvic: 0,
  costModifier: 1,
  currentCell: 0,
  difficulty: 1,
  globalBoostedTicks: 0,
};

const globalStateSlice = createSlice({
  name: "gameState",
  initialState,
  reducers: {
    resetGlobalState: () => initialState,
    deductGeneticMarkers: (
      state,
      action: PayloadAction<{ amount: number; plantType: string }>
    ) => {
      switch (action.payload.plantType) {
        case "Fern":
          state.geneticMarkers -= action.payload.amount;
          break;
        case "Moss":
          state.geneticMarkersMoss -= action.payload.amount;
          break;
        case "Succulent":
          state.geneticMarkersSucculent -= action.payload.amount;
          break;
        case "Grass":
          state.geneticMarkersGrass -= action.payload.amount;
          break;
        case "Bush":
          state.geneticMarkersBush -= action.payload.amount;
          break;
        default:
          // Handle other types or default behavior if needed
          break;
      }
    },
    increaseGeneticMarkers: (
      state,
      action: PayloadAction<{ amount: number; plantType: string }>
    ) => {
      switch (action.payload.plantType) {
        case "Fern":
          state.geneticMarkers += action.payload.amount;
          break;
        case "Moss":
          state.geneticMarkersMoss += action.payload.amount;
          break;
        case "Succulent":
          state.geneticMarkersSucculent += action.payload.amount;
          break;
        case "Grass":
          state.geneticMarkersGrass += action.payload.amount;
          break;
        case "Bush":
          state.geneticMarkersBush += action.payload.amount;
          break;
        default:
          // Handle other types or default behavior if needed
          break;
      }
    },

    updateGeneticMarkerProgress: (
      state,
      action: PayloadAction<{
        geneticMarkerUpgradeActive: boolean;
        plantType: string;
      }>
    ) => {
      const multiplier = action.payload.geneticMarkerUpgradeActive ? 2 : 1;
      switch (action.payload.plantType) {
        case "Fern":
          state.geneticMarkers += multiplier;
          state.geneticMarkerThreshold *= 1.1;
          break;
        case "Moss":
          state.geneticMarkersMoss += multiplier;
          state.geneticMarkerThresholdMoss *= 1.1;
          break;
        case "Succulent":
          state.geneticMarkersSucculent += multiplier;
          state.geneticMarkerThresholdSucculent *= 1.1;
          break;
        case "Grass":
          state.geneticMarkersGrass += multiplier;
          state.geneticMarkerThresholdGrass *= 1.1;
          break;
        default:
          // Handle other types or default behavior if needed
          break;
      }
    },

    //Probably going to remove this below
    updateSecondaryResources: (
      state,
      action: PayloadAction<{ biomeName: string }>
    ) => {
      switch (action.payload.biomeName) {
        case "Desert":
          state.silica += 1;
          break;
        case "Tropical Forest":
          state.tannins += 1;
          break;
        case "Mountain":
          state.calcium += 1;
          break;
        case "Swamp":
          state.fulvic += 1;
          break;
        default:
          break;
      }
    },
    addGeneticMarkers: (
      state,
      action: PayloadAction<{ amount: number; plantType: string }>
    ) => {
      switch (action.payload.plantType) {
        case "Fern":
          state.geneticMarkers += action.payload.amount;
          break;
        case "Moss":
          state.geneticMarkersMoss += action.payload.amount;
          break;
        case "Succulent":
          state.geneticMarkersSucculent += action.payload.amount;
          break;
        case "Grass":
          state.geneticMarkersGrass += action.payload.amount;
          break;
        case "Bush":
          state.geneticMarkersBush += action.payload.amount;
          break;
        default:
          // Handle other types or default behavior if needed
          break;
      }
    },

    //Add geneticMarkersBush by payload does not need plant type only adding to one kind
    addGeneticMarkersBush: (
      state,
      action: PayloadAction<{ amount: number }>
    ) => {
      state.geneticMarkersBush += action.payload.amount;
    },

    //Reducer to reset succulent genetic marker threshold
    resetSucculentGeneticMarkerThreshold: (state) => {
      state.geneticMarkerThresholdSucculent = 10;
    },

    //Reducer to reset grass genetic marker threshold
    resetGrassGeneticMarkerThreshold: (state) => {
      state.geneticMarkerThresholdGrass = 100;
    },
    //Reducer to set the difficulty based on a payload
    setDifficulty: (state, action: PayloadAction<{ difficulty: number }>) => {
      state.difficulty = action.payload.difficulty;
    },
    //Set current cell
    setCurrentCell: (state, action: PayloadAction<{ cellNumber: number }>) => {
      state.currentCell = action.payload.cellNumber;
    },
    // Increase global boosted ticks by payload
    increaseGlobalBoostedTicks: (state, action: PayloadAction<number>) => {
      state.globalBoostedTicks += action.payload;
    },

    // Your other reducer code...

    //Reduce global boosted ticks by one to a minimum of 0
    reduceGlobalBoostedTicks: (state) => {
      if (state.globalBoostedTicks > 0) {
        state.globalBoostedTicks -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action): action is PayloadAction<{ globalState: GlobalState }> =>
        action.type === "REPLACE_STATE",
      (state, action) => {
        if (action.payload.globalState) {
          return action.payload.globalState;
        }
        return state;
      }
    );
  },
});

export const {
  updateGeneticMarkerProgress,
  resetGlobalState,
  deductGeneticMarkers,
  increaseGeneticMarkers,
  addGeneticMarkers,
  resetSucculentGeneticMarkerThreshold,
  addGeneticMarkersBush,
  resetGrassGeneticMarkerThreshold,
  setCurrentCell,
  setDifficulty,
  increaseGlobalBoostedTicks,
  reduceGlobalBoostedTicks,
} = globalStateSlice.actions;

export default globalStateSlice.reducer;
