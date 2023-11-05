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
  geneticMarkerProgressVine: number;
  geneticMarkerThresholdVine: number;
  geneticMarkersVine: number;
  seeds: number;
  silica: number;
  tannins: number;
  calcium: number;
  fulvic: number;
  silicaProgress: number;
  tanninsProgress: number;
  calciumProgress: number;
  fulvicProgress: number;
  silicaThreshold: number;
  tanninsThreshold: number;
  calciumThreshold: number;
  fulvicThreshold: number;
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
  geneticMarkerProgressVine: 0,
  geneticMarkerThresholdVine: 100,
  geneticMarkersVine: 0,
  seeds: 0,
  silica: 0,
  tannins: 0,
  calcium: 0,
  fulvic: 0,
  silicaProgress: 0,
  tanninsProgress: 0,
  calciumProgress: 0,
  fulvicProgress: 0,
  silicaThreshold: 100000,
  tanninsThreshold: 100000,
  calciumThreshold: 100000,
  fulvicThreshold: 100000,
  costModifier: 1,
  currentCell: 0,
  difficulty: 1,
  globalBoostedTicks: 0,
};

type GlobalStateKeys =
  | "silicaProgress"
  | "tanninsProgress"
  | "calciumProgress"
  | "fulvicProgress"
  | "silicaThreshold"
  | "tanninsThreshold"
  | "calciumThreshold"
  | "fulvicThreshold";

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
        case "Vine":
          state.geneticMarkersVine -= action.payload.amount;
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
        case "Vine":
          state.geneticMarkersVine += action.payload.amount;
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
        timeScale: number;
      }>
    ) => {
      const multiplier = Math.floor(
        (action.payload.geneticMarkerUpgradeActive ? 2 : 1) *
          action.payload.timeScale
      );
      const thresholdMultiplier = Math.pow(1.1, action.payload.timeScale);
      switch (action.payload.plantType) {
        case "Fern":
          state.geneticMarkers += multiplier;
          state.geneticMarkerThreshold = Math.floor(
            state.geneticMarkerThreshold * thresholdMultiplier
          );
          break;
        case "Moss":
          state.geneticMarkersMoss += multiplier;
          state.geneticMarkerThresholdMoss = Math.floor(
            state.geneticMarkerThresholdMoss * thresholdMultiplier
          );
          break;
        case "Succulent":
          state.geneticMarkersSucculent += multiplier;
          state.geneticMarkerThresholdSucculent = Math.floor(
            state.geneticMarkerThresholdSucculent * thresholdMultiplier
          );
          break;
        case "Grass":
          state.geneticMarkersGrass += multiplier;
          state.geneticMarkerThresholdGrass = Math.floor(
            state.geneticMarkerThresholdGrass * thresholdMultiplier
          );
          break;
        case "Vine":
          state.geneticMarkersVine += multiplier;
          state.geneticMarkerThresholdVine = Math.floor(
            state.geneticMarkerThresholdVine * thresholdMultiplier
          );
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
        case "Vine":
          state.geneticMarkersVine += action.payload.amount;
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

    reduceGlobalBoostedTicks: (
      state,
      action: PayloadAction<{ plantType: string; ticks: number }>
    ) => {
      if (state.globalBoostedTicks > 0) {
        const { plantType, ticks } = action.payload;
        state.globalBoostedTicks = Math.max(
          0,
          state.globalBoostedTicks - ticks
        );

        let progressKey: GlobalStateKeys;
        let thresholdKey: GlobalStateKeys;
        let resourceKey: keyof typeof state;

        switch (plantType) {
          case "Fern":
            progressKey = "calciumProgress";
            thresholdKey = "calciumThreshold";
            resourceKey = "calcium"; // added this line
            break;
          case "Moss":
            progressKey = "tanninsProgress";
            thresholdKey = "tanninsThreshold";
            resourceKey = "tannins"; // added this line
            break;
          case "Succulent":
            progressKey = "silicaProgress";
            thresholdKey = "silicaThreshold";
            resourceKey = "silica"; // added this line
            break;
          case "Grass":
            progressKey = "fulvicProgress";
            thresholdKey = "fulvicThreshold";
            resourceKey = "fulvic"; // added this line
            break;
          default:
            // Handle unexpected plant type if necessary
            return;
        }

        // Add to progress
        state[progressKey as keyof typeof state] += ticks;

        // Check if the progress exceeds or meets the threshold
        if (
          state[progressKey as keyof typeof state] >=
          state[thresholdKey as keyof typeof state]
        ) {
          // Perform the action when the threshold is reached
          state[resourceKey] += 1; // modified this line

          // Reset the progress to zero
          state[progressKey as keyof typeof state] = 0;

          // Increase the threshold for the next cycle
          state[thresholdKey as keyof typeof state] *= 1.1; // Increase by 10%, for example
        }
      }
    },
    // Reducer to create a seed at the cost of one each tannins, silica, calcium, and fulvic
    createSeed: (state) => {
      // Check if there are enough resources
      if (
        state.tannins >= 1 &&
        state.silica >= 1 &&
        state.calcium >= 1 &&
        state.fulvic >= 1
      ) {
        state.seeds += 1;
        state.tannins -= 1;
        state.silica -= 1;
        state.calcium -= 1;
        state.fulvic -= 1;
      } else {
        console.log("Not enough resources to create a Time Seed.");
      }
    },
    // Reducer to set vineGeneticMarkers to the payload's amount
    setVineGeneticMarkers: (state, action: PayloadAction<number>) => {
      state.geneticMarkersVine = action.payload;
    },
    //reducer to deduct one time seed
    deductTimeSeed: (state) => {
      state.seeds -= 1;
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
  createSeed,
  setVineGeneticMarkers,
  deductTimeSeed,
} = globalStateSlice.actions;

export default globalStateSlice.reducer;
