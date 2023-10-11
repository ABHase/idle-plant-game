//rootReducer.ts

import { PlantTimeState } from './plantTimeSlice';
import { AppState } from './appSlice';
import { PlantState } from './plantSlice';
import { GlobalState } from './gameStateSlice';

export type RootState = {
    plantTime: PlantTimeState;
    app: AppState;
    plant: PlantState;
    globalState: GlobalState;
};
