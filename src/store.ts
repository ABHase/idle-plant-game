//store.ts

import { configureStore, Action } from "@reduxjs/toolkit";
import { ThunkAction } from "redux-thunk";
import thunk from "redux-thunk";
import plantTimeReducer from "./Slices/plantTimeSlice";
import appReducer from "./Slices/appSlice";
import plantReducer from "./Slices/plantSlice";
import upgradesReducer from "./Slices/upgradesSlice";
import cellCompletionReducer from "./Slices/cellCompletionSlice";
import globalStateSlice from "./Slices/gameStateSlice";
import { loadState, saveState } from "./localStorage";
import { RootState } from "./rootReducer";
import plantHistoryReducer from "./Slices/plantHistorySlice";
import timeBoostReducer from "./Slices/timeBoostSlice";
import { runMigrations } from "./migrations";

const persistedState: RootState | undefined = loadState();
//Should be auto incremented when there is a push
export const currentVersion = 74;

// Check if the flag isNewUser exists in local storage
let isNewUser = localStorage.getItem("isNewUser");

if (!persistedState) {
  // New user or local storage is empty
  isNewUser = "true";
  localStorage.setItem("isNewUser", "true");
} else {
  if (isNewUser === null) {
    // Handle edge cases where persistedState exists but isNewUser flag does not
    isNewUser = "false";
    localStorage.setItem("isNewUser", "false");
  }
}

if (
  !persistedState ||
  typeof persistedState.version !== "number" ||
  persistedState.version !== currentVersion
) {
  const migratedState = runMigrations(persistedState, currentVersion);
  saveState(migratedState);
  window.location.reload();
} else {
  // Reset isTimeBoostActive to false
  if (persistedState?.timeBoost) {
    persistedState.timeBoost = false;
  }
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
    cellCompletion: cellCompletionReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk),
});

// Function to export the state as a Base64 encoded string
export const exportState = (): string => {
  const state = store.getState();
  const stringifiedState = JSON.stringify({ state, version: currentVersion });
  const encodedState = btoa(stringifiedState);
  return encodedState;
};

export const importState = (encodedState: string): void => {
  try {
    const decodedString = atob(encodedState);
    const { state, version } = JSON.parse(decodedString);

    if (version !== currentVersion) {
      const migratedState = runMigrations(state, currentVersion);
      store.dispatch({ type: "REPLACE_STATE", payload: migratedState });
      saveState(migratedState);
    } else {
      store.dispatch({ type: "REPLACE_STATE", payload: state });
      saveState(state);
    }
  } catch (error) {
    console.error("Failed to import state: ", error);
  }
};

export default store;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
