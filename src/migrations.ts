// migrations.ts

import { RootState } from "./rootReducer";
import { initialState as initialGlobalState } from "./Slices/gameStateSlice";
import { initialState as initialAppState } from "./Slices/appSlice";
import { initialPlantHistoryState as initialPlantHistoryState } from "./Slices/plantHistorySlice";
import { initialState as initialPlantState } from "./Slices/plantSlice";
import { initialPlantTimeState as initialPlantTimeState } from "./Slices/plantTimeSlice";
import { initialState as initialUpgradesState } from "./Slices/upgradesSlice";
import { initialState as initialTimeBoostState } from "./Slices/timeBoostSlice";

export const runMigrations = (
  state?: RootState,
  version: number = 1
): RootState => {
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
      ...initialPlantState,
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
    version: version,
  };
};
