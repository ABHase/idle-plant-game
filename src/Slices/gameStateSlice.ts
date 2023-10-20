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
  seeds: number;
  silica: number;
  tannins: number;
  calcium: number;
  fulvic: number;
  costModifier: number;
}

export const initialState: GlobalState = {
  geneticMarkerProgress: 0,
  geneticMarkerThreshold: 10,
  geneticMarkers: 0,
  geneticMarkerProgressMoss: 0,
  geneticMarkerThresholdMoss: 1,
  geneticMarkersMoss: 0,
  geneticMarkerProgressSucculent: 0,
  geneticMarkerThresholdSucculent: 10,
  geneticMarkersSucculent: 0,
  geneticMarkerProgressGrass: 0,
  geneticMarkerThresholdGrass: 10,
  geneticMarkersGrass: 0,
  seeds: 0,
  silica: 0,
  tannins: 0,
  calcium: 0,
  fulvic: 0,
  costModifier: 1,
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
          state.geneticMarkerProgress += multiplier;
          if (state.geneticMarkerProgress >= state.geneticMarkerThreshold) {
            state.geneticMarkers += multiplier;
            state.geneticMarkerProgress = 0;
            state.geneticMarkerThreshold *= 1.1;
          }
          break;
        case "Moss":
          state.geneticMarkerProgressMoss += multiplier;
          if (
            state.geneticMarkerProgressMoss >= state.geneticMarkerThresholdMoss
          ) {
            state.geneticMarkersMoss += multiplier;
            state.geneticMarkerProgressMoss = 0;
            state.geneticMarkerThresholdMoss *= 1.1;
          }
          break;
        case "Succulent":
          state.geneticMarkerProgressSucculent += multiplier;
          if (
            state.geneticMarkerProgressSucculent >=
            state.geneticMarkerThresholdSucculent
          ) {
            state.geneticMarkersSucculent += multiplier;
            state.geneticMarkerProgressSucculent = 0;
            state.geneticMarkerThresholdSucculent *= 1.1;
          }
          break;
        case "Grass":
          state.geneticMarkerProgressGrass += multiplier;
          if (
            state.geneticMarkerProgressGrass >=
            state.geneticMarkerThresholdGrass
          ) {
            state.geneticMarkersGrass += multiplier;
            state.geneticMarkerProgressGrass = 0;
            state.geneticMarkerThresholdGrass *= 1.1;
          }
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
        default:
          // Handle other types or default behavior if needed
          break;
      }
    },
    //Reducer to reset succulent genetic marker threshold
    resetSucculentGeneticMarkerThreshold: (state) => {
      state.geneticMarkerThresholdSucculent = 10;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action): action is PayloadAction<{ gameState: GlobalState }> =>
        action.type === "REPLACE_STATE",
      (state, action) => {
        if (action.payload.gameState) {
          return action.payload.gameState;
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
  // Add other exported actions...
} = globalStateSlice.actions;

export default globalStateSlice.reducer;
