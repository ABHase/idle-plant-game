//rootReducer.ts

import { PlantTimeState } from "./plantTimeSlice";
import { AppState } from "./appSlice";
import { PlantState } from "./plantSlice";
import { GlobalState } from "./gameStateSlice";
import { UpgradesState } from "./upgradesSlice";
import { PlantHistoryState } from "./plantHistorySlice";
import { TimeBoostState } from "./timeBoostSlice"; // Assuming you named your state as TimeBoostState in the slice file

export type RootState = {
  plantTime: PlantTimeState;
  app: AppState;
  plant: PlantState;
  globalState: GlobalState;
  upgrades: UpgradesState;
  plantHistory: PlantHistoryState;
  timeBoost: TimeBoostState; // Add this line
};
