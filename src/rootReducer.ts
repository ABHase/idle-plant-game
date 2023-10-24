//rootReducer.ts

import { PlantTimeState } from "./Slices/plantTimeSlice";
import { AppState } from "./Slices/appSlice";
import { PlantState } from "./Slices/plantSlice";
import { GlobalState } from "./Slices/gameStateSlice";
import { UpgradesState } from "./Slices/upgradesSlice";
import { PlantHistoryState } from "./Slices/plantHistorySlice";
import { TimeBoostState } from "./Slices/timeBoostSlice";
import { CellCompletionState } from "./Slices/cellCompletionSlice";

export type RootState = {
  version: number;
  plantTime: PlantTimeState;
  app: AppState;
  plant: PlantState;
  globalState: GlobalState;
  upgrades: UpgradesState;
  plantHistory: PlantHistoryState;
  timeBoost: TimeBoostState;
  cellCompletion: CellCompletionState;
};
