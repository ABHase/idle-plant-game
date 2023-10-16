//store.ts

import { configureStore, Action } from "@reduxjs/toolkit";
import { ThunkAction } from "redux-thunk";
import thunk from "redux-thunk";
import plantTimeReducer from "./Slices/plantTimeSlice";
import appReducer from "./Slices/appSlice";
import plantReducer from "./Slices/plantSlice";
import upgradesReducer from "./Slices/upgradesSlice";
import globalStateSlice from "./Slices/gameStateSlice";
import { loadState, saveState } from "./localStorage";
import { RootState } from "./rootReducer";
import plantHistoryReducer from "./Slices/plantHistorySlice";
import timeBoostReducer from "./Slices/timeBoostSlice";
import { runMigrations } from "./migrations";

const persistedState: RootState | undefined = loadState();
const currentVersion = 1;

if (
  !persistedState ||
  typeof persistedState.version !== "number" ||
  persistedState.version !== currentVersion
) {
  const migratedState = runMigrations(persistedState, currentVersion);
  saveState(migratedState);
}

const store = configureStore({
  ...(persistedState ? { preloadedState: persistedState } : {}),
  reducer: {
    version: (state: number = currentVersion) => state,
    app: appReducer,
    plantTime: plantTimeReducer,
    plant: plantReducer,
    globalState: globalStateSlice,
    upgrades: upgradesReducer,
    plantHistory: plantHistoryReducer,
    timeBoost: timeBoostReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk),
});

export default store;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
