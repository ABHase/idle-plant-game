// migrations.ts

import { RootState } from "./rootReducer";
import { initialState as initialGlobalState } from "./Slices/gameStateSlice";
import { initialState as initialAppState } from "./Slices/appSlice";
import { initialPlantHistoryState as initialPlantHistoryState } from "./Slices/plantHistorySlice";
import { initialState as initialPlantState } from "./Slices/plantSlice";
import {
  initialState as initialCellCompletionState,
  selectNumberOfCompletedCells,
} from "./Slices/cellCompletionSlice";
import { initialPlantTimeState as initialPlantTimeState } from "./Slices/plantTimeSlice";
import { initialState as initialUpgradesState } from "./Slices/upgradesSlice";
import { initialState as initialTimeBoostState } from "./Slices/timeBoostSlice";
import { PLANT_CONFIGS } from "./plantConfigs";
import { currentVersion } from "./store";

export const runMigrations = (
  state?: RootState,
  version: number = 1
): RootState => {
  // Determine the correct initial plant type for migration
  const plantType = state?.plant?.type || "Fern"; // Default to "Fern" if not found
  const correctInitialPlantState = PLANT_CONFIGS[plantType];

  console.log("Running migrations for version", version);

  if (version < 132) {
    const plantHistoryEntries = state?.plantHistory.entries || [];

    let bestSizeReachedEntry: any = null;
    let bestWaterAbsorbedEntry: any = null;
    let bestSunlightAbsorbedEntry: any = null;
    let bestSugarCreatedEntry: any = null;

    plantHistoryEntries.forEach((entry) => {
      if (
        !bestSizeReachedEntry ||
        entry.sizeReached > bestSizeReachedEntry.sizeReached
      ) {
        bestSizeReachedEntry = entry;
      }
      if (
        !bestWaterAbsorbedEntry ||
        entry.totalWaterAbsorbed > bestWaterAbsorbedEntry.totalWaterAbsorbed
      ) {
        bestWaterAbsorbedEntry = entry;
      }
      if (
        !bestSunlightAbsorbedEntry ||
        entry.totalSunlightAbsorbed >
          bestSunlightAbsorbedEntry.totalSunlightAbsorbed
      ) {
        bestSunlightAbsorbedEntry = entry;
      }
      if (
        !bestSugarCreatedEntry ||
        entry.totalSugarCreated > bestSugarCreatedEntry.totalSugarCreated
      ) {
        bestSugarCreatedEntry = entry;
      }
    });

    // Create a new list that contains only the best entries
    const bestEntries = [
      bestSizeReachedEntry,
      bestWaterAbsorbedEntry,
      bestSunlightAbsorbedEntry,
      bestSugarCreatedEntry,
    ];
    const uniqueBestEntries = Array.from(new Set(bestEntries)); // This ensures uniqueness in case some entries are the best in multiple categories.

    if (state && state.plantHistory) {
      state.plantHistory.entries = uniqueBestEntries;
    }
  }

  // New migration for version 129 to set totalCellsCompleted
  if (version < 132) {
    console.log("Running migration for version 132");
    let totalCellsCompleted = 0;

    // Directly calculate the number of completed cells
    if (state && state.cellCompletion && state.cellCompletion.cells) {
      console.log("Calculating totalCellsCompleted");
      totalCellsCompleted = Object.keys(state.cellCompletion.cells).length;
    }

    // Set the totalCellsCompleted in the app state if app state is defined
    if (state?.app) {
      state.app.totalCellsCompleted = totalCellsCompleted;
    }
  }

  return {
    globalState: {
      ...initialGlobalState,
      ...state?.globalState,
    },
    app: {
      ...initialAppState,
      ...state?.app,
    },
    plantHistory: {
      ...initialPlantHistoryState,
      ...state?.plantHistory,
    },
    plant: {
      ...correctInitialPlantState,
      ...state?.plant,
    },
    plantTime: {
      ...initialPlantTimeState,
      ...state?.plantTime,
    },
    upgrades: {
      ...initialUpgradesState,
      ...state?.upgrades,
    },
    timeBoost:
      state?.timeBoost !== undefined ? state?.timeBoost : initialTimeBoostState,
    cellCompletion: {
      ...initialCellCompletionState,
      ...state?.cellCompletion,
    },
    version: currentVersion,
  };
};
